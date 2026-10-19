/**
 * Fictional data behind every sample on /complaints and in the downloadable files.
 * "Northgate Advisory" does not exist. The 120 records are generated from a fixed seed,
 * so the page and the PDFs all show the same numbers, and the
 * findings quoted in the slides are computed from the records, not typed in.
 */
export const SAMPLE_BUSINESS = 'Northgate Advisory (fictional)';
export const SAMPLE_PERIOD = 'Oct 2025 to Sep 2026';
export const TARGET_DAYS = 15; // the fictional firm's own target, in working days

export const CATEGORIES = ['Fees and invoicing', 'Delays', 'Communication', 'Quality of advice', 'Staff conduct', 'Systems and documents'] as const;
export type Category = (typeof CATEGORIES)[number];
export const ROOT_CAUSES = ['Unclear fee explanation', 'Handover between teams', 'No owner for follow-up', 'Outdated letter template', 'Training gap', 'Portal or system fault', 'Expectation not managed'] as const;
export type RootCause = (typeof ROOT_CAUSES)[number];
export const OUTCOMES = ['Upheld', 'Partly upheld', 'Not upheld'] as const;
export type Outcome = (typeof OUTCOMES)[number];
export const MONTHS = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'] as const;

export type Complaint = { ref: string; month: number; day: number; category: Category; channel: 'Email' | 'Phone' | 'Letter' | 'Web form'; rootCause: RootCause; outcome: Outcome; daysToClose: number; redress: number };

const PER_MONTH = [7, 8, 8, 9, 8, 9, 10, 12, 16, 15, 11, 7]; // 120 in total, with a rise from Jun after a fee-schedule change

function seeded(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const pick = <T,>(random: () => number, items: readonly T[], weights: readonly number[]): T => {
  const total = weights.reduce((a, b) => a + b, 0);
  let roll = random() * total;
  for (let i = 0; i < items.length; i += 1) { roll -= weights[i]; if (roll <= 0) return items[i]; }
  return items[items.length - 1];
};

const CAUSES_BY_CATEGORY: Record<Category, readonly number[]> = {
  // order follows ROOT_CAUSES
  'Fees and invoicing': [70, 0, 5, 20, 0, 0, 5],
  Delays: [0, 50, 35, 0, 5, 5, 5],
  Communication: [0, 15, 55, 10, 10, 0, 10],
  'Quality of advice': [5, 5, 0, 15, 60, 0, 15],
  'Staff conduct': [0, 0, 10, 0, 70, 0, 20],
  'Systems and documents': [0, 5, 5, 25, 0, 55, 10],
};
const UPHELD_RATE: Record<Category, number> = { 'Fees and invoicing': 0.6, Delays: 0.5, Communication: 0.45, 'Quality of advice': 0.3, 'Staff conduct': 0.35, 'Systems and documents': 0.5 };
const BASE_DAYS: Record<Category, number> = { 'Fees and invoicing': 10, Delays: 14, Communication: 11, 'Quality of advice': 17, 'Staff conduct': 15, 'Systems and documents': 9 };

export function buildComplaints(): Complaint[] {
  const random = seeded(20261019);
  const records: Complaint[] = [];
  let n = 0;
  PER_MONTH.forEach((count, month) => {
    const feeSpike = month >= 8 && month <= 10; // Jun to Aug
    const weights = [feeSpike ? 40 : 14, 20, 22, 11, 7, 18];
    for (let i = 0; i < count; i += 1) {
      n += 1;
      const category = pick(random, CATEGORIES, weights);
      const rootCause = pick(random, ROOT_CAUSES, CAUSES_BY_CATEGORY[category]);
      const r = random();
      const outcome: Outcome = r < UPHELD_RATE[category] ? 'Upheld' : r < UPHELD_RATE[category] + 0.2 ? 'Partly upheld' : 'Not upheld';
      const handover = rootCause === 'Handover between teams' ? 6 : rootCause === 'No owner for follow-up' ? 4 : 0;
      const daysToClose = Math.max(3, Math.round(BASE_DAYS[category] + handover + (random() - 0.4) * 8));
      const redress = outcome === 'Not upheld' ? 0 : Math.round((random() * 120 + (outcome === 'Upheld' ? 40 : 15)) / 5) * 5;
      records.push({ ref: `NG-${String(n).padStart(3, '0')}`, month, day: 1 + Math.floor(random() * 27), category, channel: pick(random, ['Email', 'Phone', 'Letter', 'Web form'] as const, [45, 30, 10, 15]), rootCause, outcome, daysToClose, redress });
    }
  });
  return records;
}

export const COMPLAINTS: readonly Complaint[] = buildComplaints();

export const count = (rows: readonly Complaint[], test: (row: Complaint) => boolean) => rows.filter(test).length;
export const share = (part: number, whole: number) => (whole === 0 ? 0 : Math.round((part / whole) * 100));
export const average = (values: readonly number[]) => (values.length ? Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 10) / 10 : 0);

export function monthlyCounts(rows: readonly Complaint[]): number[] {
  return MONTHS.map((_, month) => count(rows, (row) => row.month === month));
}

export function byCategory(rows: readonly Complaint[]) {
  return CATEGORIES.map((category) => {
    const set = rows.filter((row) => row.category === category);
    return { category, total: set.length, upheld: count(set, (row) => row.outcome !== 'Not upheld'), avgDays: average(set.map((row) => row.daysToClose)), late: count(set, (row) => row.daysToClose > TARGET_DAYS) };
  });
}

export function outcomeSplit(rows: readonly Complaint[]) {
  return OUTCOMES.map((outcome) => ({ outcome, total: count(rows, (row) => row.outcome === outcome) }));
}

export function rootCauseTable(rows: readonly Complaint[]) {
  return ROOT_CAUSES.map((cause) => {
    const set = rows.filter((row) => row.rootCause === cause);
    return { cause, total: set.length, share: share(set.length, rows.length), upheldShare: share(count(set, (row) => row.outcome !== 'Not upheld'), set.length), avgDays: average(set.map((row) => row.daysToClose)), redress: set.reduce((sum, row) => sum + row.redress, 0) };
  }).filter((row) => row.total > 0).sort((a, b) => b.total - a.total);
}

export function summary(rows: readonly Complaint[]) {
  const total = rows.length;
  const closedLate = count(rows, (row) => row.daysToClose > TARGET_DAYS);
  const quarter = (from: number) => rows.filter((row) => row.month >= from && row.month < from + 3).length;
  return {
    total,
    upheldShare: share(count(rows, (row) => row.outcome !== 'Not upheld'), total),
    avgDays: average(rows.map((row) => row.daysToClose)),
    withinTarget: share(total - closedLate, total),
    redress: rows.reduce((sum, row) => sum + row.redress, 0),
    lastQuarter: quarter(9),
    firstQuarter: quarter(0),
    peakMonth: MONTHS[monthlyCounts(rows).indexOf(Math.max(...monthlyCounts(rows)))],
  };
}

const ACTION_FOR_CAUSE: Record<RootCause, string> = {
  'Unclear fee explanation': 'Rewrite the fee explanation and send it before work starts.',
  'Handover between teams': 'Keep one case owner from first contact to closure.',
  'No owner for follow-up': 'Name one case owner on every complaint, with a next-action date.',
  'Outdated letter template': 'Refresh the letter templates that no longer fit.',
  'Training gap': 'Brief handlers on investigation and reply standards.',
  'Portal or system fault': 'Log faults with the system owner and track them to a fix.',
  'Expectation not managed': 'Say at the start what will happen and by when.',
};

/** Plain-English findings, computed from the records so they cannot drift from the charts. */
export function findings(rows: readonly Complaint[]): { headline: string; evidence: string; action: string }[] {
  const causes = rootCauseTable(rows);
  const s = summary(rows);
  const top = causes[0];
  const handover = causes.find((row) => row.cause === 'Handover between teams')!;
  const training = causes.find((row) => row.cause === 'Training gap')!;
  const feeRows = rows.filter((row) => row.category === 'Fees and invoicing');
  const feeSpike = feeRows.filter((row) => row.month >= 8 && row.month <= 10).length;
  return [
    { headline: `${top.cause} is the biggest single cause`, evidence: `${top.total} of ${s.total} complaints (${top.share}%), and ${top.upheldShare}% of them were upheld at least in part.`, action: ACTION_FOR_CAUSE[top.cause] },
    { headline: 'Fee complaints clustered after the fee-schedule change', evidence: `${feeSpike} of the ${feeRows.length} fee complaints arrived in June to August. The busiest month overall was ${s.peakMonth}.`, action: 'Review how the new schedule is explained to existing clients.' },
    { headline: 'Handovers add days', evidence: `Complaints caused by team handovers took ${handover.avgDays} working days on average against a ${TARGET_DAYS}-day target (all complaints: ${s.avgDays}).`, action: ACTION_FOR_CAUSE['Handover between teams'] },
    { headline: 'A training gap sits behind many upheld complaints', evidence: `${training.total} complaints (${training.share}%) trace to it, and ${training.upheldShare}% were upheld at least in part.`, action: ACTION_FOR_CAUSE['Training gap'] },
    { headline: 'Timeliness is mixed', evidence: `${s.withinTarget}% closed within the ${TARGET_DAYS}-day target; ${100 - s.withinTarget}% did not.`, action: 'Report ageing cases to the weekly management meeting.' },
  ];
}

/** The Health Check sample: a different, smaller fictional review of 15 cases. Scores are the reviewer's judgement out of 5. */
export const HEALTH_SCORECARD = [
  { area: 'Acknowledgement', score: 4, note: '13 of 15 acknowledged promptly and said what happens next.' },
  { area: 'Investigation depth', score: 2, note: 'In 9 of 15 cases the notes show no check of the customer’s own account of events.' },
  { area: 'Reply clarity', score: 3, note: 'Replies are polite but 6 of 15 leave one of the customer’s points unanswered.' },
  { area: 'Timeliness', score: 3, note: '4 of 15 passed the firm’s own target; no holding reply was sent in any of them.' },
  { area: 'Root cause recorded', score: 1, note: 'Only 2 of 15 records say why it happened. Nothing links cases together.' },
  { area: 'Fair outcome', score: 4, note: 'Redress offered was consistent for similar cases.' },
] as const;

export const HEALTH_RECOMMENDATIONS = [
  { rank: 1, title: 'Record a root cause on every closed case', why: 'Without it, repeat problems cannot be seen. Cost: one extra field.', evidence: 'Only 2 of 15 records give a cause.', effort: 'Low', owner: 'Complaints lead' },
  { rank: 2, title: 'Answer every point the customer raised', why: 'Unanswered points are the commonest reason a customer writes back.', evidence: '6 of 15 replies skipped a point. A checklist before sending fixes most of this.', effort: 'Low', owner: 'All handlers' },
  { rank: 3, title: 'Send a holding reply when a case will run late', why: 'A short update stops silence turning into a second complaint.', evidence: '4 cases passed target; none had a holding reply.', effort: 'Low', owner: 'Complaints lead' },
  { rank: 4, title: 'Check the customer’s account before deciding', why: 'Decisions made on the firm’s records alone look one-sided and are easier to challenge.', evidence: '9 of 15 investigations show no such check.', effort: 'Medium', owner: 'Team managers' },
  { rank: 5, title: 'Review the complaints letter templates', why: 'Several replies repeat the same stock paragraph even where it does not fit.', evidence: 'The same paragraph appears in 7 of 15 replies.', effort: 'Medium', owner: 'Compliance / operations' },
] as const;

export type ActionItem = { id: number; action: string; owner: string; due: string; priority: 'High' | 'Medium' | 'Low'; status: 'Not started' | 'In progress' | 'Done' };
export const ACTIONS: readonly ActionItem[] = [
  { id: 1, action: 'Name one case owner on every complaint, who keeps it to the end', owner: 'Complaints lead', due: '16 Nov 2026', priority: 'High', status: 'Not started' },
  { id: 2, action: 'Rewrite the fee explanation sent at engagement', owner: 'Head of client services', due: '30 Nov 2026', priority: 'High', status: 'In progress' },
  { id: 3, action: 'Add “next action” and date fields to the tracker', owner: 'Operations manager', due: '9 Nov 2026', priority: 'Medium', status: 'Done' },
  { id: 4, action: 'Brief handlers on investigation and reply standards (two short sessions)', owner: 'Team managers', due: '4 Dec 2026', priority: 'Medium', status: 'Not started' },
  { id: 5, action: 'Report cases older than 10 working days at the weekly meeting', owner: 'Complaints lead', due: '23 Nov 2026', priority: 'Medium', status: 'Not started' },
  { id: 6, action: 'Refresh the four complaint letter templates', owner: 'Compliance officer', due: '18 Dec 2026', priority: 'Low', status: 'Not started' },
];
