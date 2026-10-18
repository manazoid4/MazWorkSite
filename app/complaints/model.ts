/**
 * Logic behind the fictional complaints demo on /complaints. Pure functions so
 * node tests can import it. Every case, name and figure here is invented for the
 * demo; the page says so. Deadlines are targets the business sets for itself
 * (the demo uses 2 and 20 working days), never a statement of what the law needs.
 */
export const DEMO_TODAY = '2026-10-19'; // fixed so the demo renders the same for everyone
export const ACK_TARGET_DAYS = 2;
export const RESPONSE_TARGET_DAYS = 20;
export const DUE_SOON_DAYS = 3;

export type Category = 'Delay' | 'Service quality' | 'Billing' | 'Communication';
export const CATEGORIES: Category[] = ['Delay', 'Service quality', 'Billing', 'Communication'];

export type Stage = 'Received' | 'Acknowledged' | 'Investigating' | 'Reply drafted';
export const STAGES: Stage[] = ['Received', 'Acknowledged', 'Investigating', 'Reply drafted'];

export type DemoCase = { id: string; client: string; category: Category; summary: string; received: string; stage: Stage; owner: string };

export const DEMO_CASES: DemoCase[] = [
  { id: 'C-1001', client: 'Example Studio Ltd', category: 'Delay', summary: 'Project handover two weeks later than agreed.', received: '2026-09-21', stage: 'Investigating', owner: 'Sam' },
  { id: 'C-1002', client: 'Sample Advisory LLP', category: 'Billing', summary: 'Invoice includes hours the client says were not approved.', received: '2026-10-05', stage: 'Reply drafted', owner: 'Priya' },
  { id: 'C-1003', client: 'Demo Lettings Co', category: 'Communication', summary: 'No reply to three emails about a repair.', received: '2026-10-14', stage: 'Received', owner: 'Sam' },
  { id: 'C-1004', client: 'Test Consulting Ltd', category: 'Service quality', summary: 'Report delivered with errors in two tables.', received: '2026-10-09', stage: 'Acknowledged', owner: 'Priya' },
  { id: 'C-1005', client: 'Placeholder Trading', category: 'Delay', summary: 'Onboarding documents still not set up after a month.', received: '2026-10-12', stage: 'Acknowledged', owner: 'Sam' },
];

const DAY = 86_400_000;
const parse = (iso: string) => new Date(`${iso}T00:00:00Z`);
const format = (date: Date) => date.toISOString().slice(0, 10);

/** Adds working days (Mon–Fri). Bank holidays are not modelled in the demo; a live set-up would add the client's own calendar. */
export function addWorkingDays(iso: string, days: number): string {
  const date = parse(iso);
  let left = days;
  while (left > 0) {
    date.setTime(date.getTime() + DAY);
    const weekday = date.getUTCDay();
    if (weekday !== 0 && weekday !== 6) left -= 1;
  }
  return format(date);
}

/** Working days from `from` up to `to`; negative when `to` is already past. */
export function workingDaysBetween(from: string, to: string): number {
  if (from === to) return 0;
  const sign = from < to ? 1 : -1;
  const [start, end] = sign === 1 ? [from, to] : [to, from];
  let count = 0;
  const date = parse(start);
  const stop = parse(end);
  while (date < stop) {
    date.setTime(date.getTime() + DAY);
    const weekday = date.getUTCDay();
    if (weekday !== 0 && weekday !== 6) count += 1;
  }
  return count * sign;
}

export type Health = 'on-track' | 'due-soon' | 'overdue';

export function caseDeadlines(received: string) {
  return { acknowledge: addWorkingDays(received, ACK_TARGET_DAYS), respond: addWorkingDays(received, RESPONSE_TARGET_DAYS) };
}

/** What needs attention now. A case still at "Received" is judged on its acknowledgement date; the rest on the reply date. */
export function caseHealth(item: Pick<DemoCase, 'received' | 'stage'>, today = DEMO_TODAY): { health: Health; daysLeft: number; target: 'acknowledge' | 'respond'; due: string } {
  const deadlines = caseDeadlines(item.received);
  const target = item.stage === 'Received' ? 'acknowledge' : 'respond';
  const due = deadlines[target];
  const daysLeft = workingDaysBetween(today, due);
  const health: Health = daysLeft < 0 ? 'overdue' : daysLeft <= DUE_SOON_DAYS ? 'due-soon' : 'on-track';
  return { health, daysLeft, target, due };
}

export function nextCaseId(cases: Pick<DemoCase, 'id'>[]): string {
  const highest = cases.reduce((max, item) => Math.max(max, Number(item.id.replace('C-', '')) || 0), 1000);
  return `C-${highest + 1}`;
}

export function countByCategory(cases: Pick<DemoCase, 'category'>[]): Record<Category, number> {
  const counts = { Delay: 0, 'Service quality': 0, Billing: 0, Communication: 0 } as Record<Category, number>;
  for (const item of cases) counts[item.category] += 1;
  return counts;
}

const TEMPLATES: Record<Category, string> = {
  Delay: 'Thank you for raising this, and I am sorry for the delay. I have read your complaint ("{what}"). {owner} will confirm a firm date with you by {date}.',
  'Service quality': 'Thank you for telling us about this. I have checked your complaint ("{what}") and found [add what you found]. We will put it right and write to you by {date}.',
  Billing: 'Thank you for raising the invoice. I have gone through it against our records ("{what}"). [Add what you found.] I will write to you again by {date}.',
  Communication: 'I am sorry you did not get a reply ("{what}"). {owner} now has your case and will contact you by {date}. You can reply to this email at any time.',
};

export function longDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
}

/** Draft built from the business's own template wording. It is never sent until a person approves it. */
export function draftReply(item: Pick<DemoCase, 'category' | 'summary' | 'client' | 'owner' | 'received'>): string {
  const date = longDate(caseDeadlines(item.received).respond);
  const body = TEMPLATES[item.category]
    .replace('{what}', item.summary.replace(/\.$/, ''))
    .replace('{owner}', item.owner)
    .replace('{date}', date);
  return `Dear ${item.client},\n\n${body}\n\nKind regards,\n[Your name]`;
}

export function acknowledgementEmail(item: Pick<DemoCase, 'id' | 'client' | 'received'>): string {
  return `Subject: We have received your complaint (${item.id})\n\nDear ${item.client},\n\nThank you for getting in touch. Your complaint is logged as ${item.id}. We will reply properly by ${longDate(caseDeadlines(item.received).respond)}, and will update you sooner if anything changes.`;
}
