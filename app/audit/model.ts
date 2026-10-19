import { AFTER_HOURS, COMPLAINT_PACKAGES, OFFERS } from '../offers';

/**
 * Maths for the free automation audit. Plain arithmetic on the visitor's own
 * numbers plus one visible assumption (how much of each task can be automated).
 * Nothing is a promise of savings; the page says so.
 */
export const WORKING_WEEKS = 46;
export const DEFAULT_SHARE = 50;
export const DEFAULT_RATE = 40;

export type TaskId = 'complaints' | 'onboarding' | 'proposals' | 'invoices' | 'copying' | 'enquiries' | 'reporting' | 'calls';
export type Solution = { name: string; price: string; href: string; why: string };

export const TASKS: { id: TaskId; label: string; hint: string; hours: number; solution: Solution }[] = [
  { id: 'complaints', label: 'Tracking and reporting on complaints', hint: 'Chasing cases, piecing the numbers together, explaining them to management', hours: 3, solution: { name: COMPLAINT_PACKAGES[0].name, price: COMPLAINT_PACKAGES[0].price, href: '/complaints', why: 'A short report on what your complaints are telling you, and what to fix first.' } },
  { id: 'onboarding', label: 'Onboarding new clients', hint: 'Chasing ID, signed letters, forms and details', hours: 4, solution: { name: OFFERS[1].name, price: OFFERS[1].price, href: '/prices', why: 'Joined-up forms, reminders and a weekly list of who is stuck.' } },
  { id: 'proposals', label: 'Chasing proposals and quotes', hint: 'Following up when nothing comes back', hours: 2, solution: { name: OFFERS[0].name, price: OFFERS[0].price, href: '/services', why: 'One automatic follow-up job, set up and tested with you.' } },
  { id: 'invoices', label: 'Chasing invoices and payments', hint: 'Reminders to late payers', hours: 2, solution: { name: OFFERS[0].name, price: OFFERS[0].price, href: '/services', why: 'Polite reminders on your own schedule.' } },
  { id: 'copying', label: 'Copying details between apps', hint: 'CRM to spreadsheet to invoice', hours: 3, solution: { name: OFFERS[1].name, price: OFFERS[1].price, href: '/prices', why: 'Enter it once and have it appear where it is needed.' } },
  { id: 'enquiries', label: 'Replying to new enquiries', hint: 'First acknowledgement and booking links', hours: 2, solution: { name: OFFERS[0].name, price: OFFERS[0].price, href: '/services', why: 'An instant reply and a booking link, in your wording.' } },
  { id: 'reporting', label: 'Pulling together weekly reports', hint: 'Numbers from several tools into one page', hours: 2, solution: { name: OFFERS[1].name, price: OFFERS[1].price, href: '/prices', why: 'A weekly email of what came in and what is due.' } },
  { id: 'calls', label: 'Calls missed while busy or closed', hint: 'Messages taken late or not at all', hours: 1, solution: { name: AFTER_HOURS.name, price: AFTER_HOURS.price, href: AFTER_HOURS.href, why: 'Callers leave a clear message and get answers from your information.' } },
];

export type Entry = { id: TaskId; hours: number };

export function audit(entries: Entry[], rate: number, share: number) {
  const valid = entries.filter((entry) => entry.hours > 0 && TASKS.some((task) => task.id === entry.id));
  const weekly = valid.reduce((sum, entry) => sum + entry.hours, 0);
  const yearHours = Math.round(weekly * WORKING_WEEKS);
  const savedHours = Math.round(yearHours * (share / 100));
  const savedValue = Math.round(savedHours * rate);
  const seen = new Set<string>();
  const recommended: (Solution & { hours: number })[] = [];
  for (const entry of [...valid].sort((a, b) => b.hours - a.hours)) {
    const solution = TASKS.find((task) => task.id === entry.id)!.solution;
    if (seen.has(solution.name)) continue;
    seen.add(solution.name);
    recommended.push({ ...solution, hours: entry.hours });
    if (recommended.length === 3) break;
  }
  return { weekly, yearHours, savedHours, savedValue, recommended };
}

export function summarise(entries: Entry[], rate: number, share: number, tools: string[] = []): string {
  const result = audit(entries, rate, share);
  const lines = entries.filter((entry) => entry.hours > 0).map((entry) => `${TASKS.find((task) => task.id === entry.id)?.label}: ${entry.hours}h/week`);
  const stack = tools.length ? ` Tools in use: ${tools.join(', ')}.` : '';
  return `Automation audit. ${lines.join('; ')}.${stack} Value of time £${rate}/h, ${share}% assumed automatable, ${WORKING_WEEKS} working weeks. Estimate: ${result.yearHours}h/year on these tasks, about ${result.savedHours}h (£${result.savedValue}) of it automatable. Suggested: ${result.recommended.map((item) => item.name).join(', ') || 'none'}.`;
}

export const TOOLS = ['Gmail', 'Outlook', 'Xero', 'HubSpot', 'Pipedrive', 'Spreadsheets', 'Cal.com'] as const;
const STORE_KEY = 'mw-audit';

/** Keeps the audit result for this tab so /free-plan can pre-fill its message box. Storage may be blocked, so never throw. */
export function storeAudit(text: string): void {
  try { sessionStorage.setItem(STORE_KEY, text.slice(0, 900)); } catch { /* storage blocked */ }
}
export function readStoredAudit(): string {
  try { return sessionStorage.getItem(STORE_KEY) || ''; } catch { return ''; }
}
