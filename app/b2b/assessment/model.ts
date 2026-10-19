import { B2B_SYSTEMS, COMPLAINT_PACKAGES, OFFERS, formatPrice } from '../../offers';

/**
 * The free business assessment. It is deliberately simple arithmetic on the
 * visitor's own answers: no industry benchmark is invented, and the one
 * planning assumption (how much of the admin could be removed) is visible and
 * adjustable. The result is useful before anyone shares a contact detail.
 */
export type AreaId = 'enquiries' | 'documents' | 'complaints' | 'reporting' | 'followup' | 'repetition';

export type Option = {
  id: string;
  label: string;
  /** Estimated hours a week this answer suggests. The visitor can see the sum. */
  hours: number;
  /** 0 = joined up, 3 = firefighting. Used only to place the answer on a scale. */
  score: number;
  /** A question that does not apply is left out of the score rather than flattering it. */
  na?: boolean;
};

export type Question = {
  id: AreaId;
  title: string;
  hint: string;
  options: Option[];
};

export type Answers = Partial<Record<AreaId, string>>;

export type Solution = { name: string; price: string; href: string; why: string };

const system = (id: string) => B2B_SYSTEMS.find((item) => item.id === id)!;

export const SOLUTION: Record<AreaId, Solution> = {
  enquiries: {
    name: system('speed').name,
    price: system('speed').price,
    href: '/b2b#systems',
    why: 'An instant reply with your booking link, and a clear alert when someone enquires.',
  },
  documents: {
    name: system('intake').name,
    price: system('intake').price,
    href: '/b2b#systems',
    why: 'One upload link and polite reminders until the ID, letters and forms are in.',
  },
  complaints: {
    name: COMPLAINT_PACKAGES[0].name,
    price: COMPLAINT_PACKAGES[0].price,
    href: '/complaints#health-check',
    why: 'A short review of your cases and the first five fixes, ranked.',
  },
  reporting: {
    name: COMPLAINT_PACKAGES[1].name,
    price: COMPLAINT_PACKAGES[1].price,
    href: '/complaints#board-reporting',
    why: 'Your records turned into a board paper, dashboard and action list.',
  },
  followup: {
    name: system('proposal').name,
    price: system('proposal').price,
    href: '/b2b#systems',
    why: 'A short run of polite follow-ups that stops the moment they reply.',
  },
  repetition: {
    name: OFFERS[1].name,
    price: OFFERS[1].price,
    href: '/prices#practices',
    why: 'Up to three repeat jobs joined up, with a weekly report.',
  },
};

/** First fixes cost nothing and are useful even if the visitor never gets in touch. */
export const FIRST_FIXES: Record<AreaId, readonly string[]> = {
  enquiries: [
    'Give every enquiry one owner and one inbox.',
    'Send an instant acknowledgement with a booking link.',
    'Check the inbox at fixed times, not when someone remembers.',
  ],
  documents: [
    'Send one checklist link instead of asking for documents in pieces.',
    'Put the missing items and a due date in one visible place.',
    'Stop accepting documents by WhatsApp unless they are filed the same day.',
  ],
  complaints: [
    'Give every complaint a reference, an owner and a due date.',
    'Add a root-cause field before the case is closed.',
    'Review the top three causes monthly, not every case.',
  ],
  reporting: [
    'Agree the five numbers your board or managers actually ask for.',
    'Pull them from one source, not three exports.',
    'Write the one-line headline before the chart.',
  ],
  followup: [
    'Write the one follow-up you always forget.',
    'Diarise day 3, not “next week”.',
    'Stop the sequence the moment they reply.',
  ],
  repetition: [
    'List the fields you copy between tools.',
    'Pick one source of truth for each field.',
    'Automate the transfer before adding another tool.',
  ],
};

export const QUESTIONS: Question[] = [
  {
    id: 'enquiries',
    title: 'When a new enquiry comes in, what happens?',
    hint: 'Think about a normal Tuesday, not the best week.',
    options: [
      { id: 'owned', label: 'It lands in one place and someone owns it', hours: 0, score: 0 },
      { id: 'shared', label: 'It reaches a shared inbox, but replies wait', hours: 1.5, score: 1 },
      { id: 'passed', label: 'It goes to whoever is free, or gets forwarded around', hours: 3, score: 2 },
      { id: 'lost', label: 'It can sit unread, or we only see it when the customer chases', hours: 5, score: 3 },
    ],
  },
  {
    id: 'documents',
    title: 'How do you collect ID, signed letters and client forms?',
    hint: 'For example, onboarding a new client or opening a file.',
    options: [
      { id: 'portal', label: 'A form or portal collects them, with reminders', hours: 0, score: 0 },
      { id: 'checklist', label: 'We have a checklist, but chase by email', hours: 2, score: 1 },
      { id: 'varied', label: 'Each person asks in their own way', hours: 3.5, score: 2 },
      { id: 'scattered', label: 'It is spread across email, WhatsApp and paper', hours: 5, score: 3 },
      { id: 'none', label: 'This is not part of what we do', hours: 0, score: 0, na: true },
    ],
  },
  {
    id: 'complaints',
    title: 'How are complaints tracked and reported?',
    hint: 'Including the ones that arrive by phone or in a partner’s inbox.',
    options: [
      { id: 'system', label: 'A case system records dates, owners and outcomes', hours: 0, score: 0 },
      { id: 'sheet', label: 'A spreadsheet we keep up to date', hours: 2, score: 1 },
      { id: 'inbox', label: 'They live in inboxes; we remember the dates', hours: 4, score: 2 },
      { id: 'unlogged', label: 'We do not log them consistently', hours: 6, score: 3 },
      { id: 'none', label: 'We do not handle complaints', hours: 0, score: 0, na: true },
    ],
  },
  {
    id: 'reporting',
    title: 'How long does a management or board report take?',
    hint: 'The regular report, not a one-off project.',
    options: [
      { id: 'click', label: 'It is already a dashboard or a one-click export', hours: 0, score: 0 },
      { id: 'template', label: 'A few hours from a template', hours: 2, score: 1 },
      { id: 'day', label: 'A day or more piecing it together', hours: 5, score: 2 },
      { id: 'avoid', label: 'We avoid it, or it does not happen', hours: 7, score: 3 },
      { id: 'none', label: 'We do not report on operations', hours: 0, score: 0, na: true },
    ],
  },
  {
    id: 'followup',
    title: 'What happens after you send a quote or proposal?',
    hint: 'The ones that go quiet, not the ones that say yes straight away.',
    options: [
      { id: 'sequence', label: 'A sequence follows up and stops when they reply', hours: 0, score: 0 },
      { id: 'diary', label: 'Someone diarises one follow-up', hours: 1.5, score: 1 },
      { id: 'memory', label: 'We follow up when we remember', hours: 3, score: 2 },
      { id: 'nothing', label: 'Usually nothing until they come back', hours: 4, score: 3 },
      { id: 'none', label: 'We do not send quotes or proposals', hours: 0, score: 0, na: true },
    ],
  },
  {
    id: 'repetition',
    title: 'How much time goes on copying details between tools?',
    hint: 'CRM to spreadsheet to invoice, or the same details typed twice.',
    options: [
      { id: 'low', label: 'Under an hour a week', hours: 0.5, score: 0 },
      { id: 'one-three', label: '1–3 hours a week', hours: 2, score: 1 },
      { id: 'three-five', label: '3–5 hours a week', hours: 4, score: 2 },
      { id: 'high', label: 'More than 5 hours a week', hours: 6, score: 3 },
    ],
  },
];

export const WORKING_WEEKS = 46;
export const DEFAULT_RATE = 40;
export const DEFAULT_SHARE = 40;
export const RATE_OPTIONS = [30, 40, 50, 75] as const;
export const SHARE_OPTIONS = [30, 40, 50, 60] as const;

export type Band = { label: string; note: string };

export function bandFor(score: number): Band {
  if (score <= 25) return { label: 'Under control', note: 'Your answers suggest the basics are joined up. Spend only on a specific bottleneck.' };
  if (score <= 50) return { label: 'Some gaps', note: 'A few jobs depend on someone remembering. Fix the biggest one first.' };
  if (score <= 75) return { label: 'Mostly manual', note: 'Several jobs are held together by hand. Start with the one costing the most hours.' };
  return { label: 'Firefighting', note: 'Admin is crowding out paid work. Pick one job and get it out of the inbox first.' };
}

export function selected(answers: Answers) {
  return QUESTIONS.flatMap((question) => {
    const option = question.options.find((item) => item.id === answers[question.id]);
    return option ? [{ question, option }] : [];
  });
}

export function isComplete(answers: Answers): boolean {
  return QUESTIONS.every((question) => question.options.some((option) => option.id === answers[question.id]));
}

export type AssessmentResult = {
  score: number;
  band: Band;
  weeklyHours: number;
  yearHours: number;
  savedHours: number;
  savedValue: number;
  recommendations: ({ area: AreaId; hours: number } & Solution)[];
  firstFixes: readonly string[];
  topArea: AreaId | null;
};

export function assess(answers: Answers, rate = DEFAULT_RATE, share = DEFAULT_SHARE): AssessmentResult {
  const chosen = selected(answers);
  const applicable = chosen.filter((item) => !item.option.na);
  const maxScore = applicable.length * 3;
  const rawScore = applicable.reduce((sum, item) => sum + item.option.score, 0);
  const score = maxScore ? Math.round((rawScore / maxScore) * 100) : 0;
  const weeklyHours = Math.round(chosen.reduce((sum, item) => sum + item.option.hours, 0) * 10) / 10;
  const yearHours = Math.round(weeklyHours * WORKING_WEEKS);
  const savedHours = Math.round(yearHours * (share / 100));
  const savedValue = Math.round(savedHours * rate);

  const ranked = applicable
    .filter((item) => item.option.hours > 0 && item.option.score > 0)
    .sort((a, b) => b.option.hours - a.option.hours || b.option.score - a.option.score);

  const seen = new Set<string>();
  const recommendations: AssessmentResult['recommendations'] = [];
  for (const item of ranked) {
    const solution = SOLUTION[item.question.id];
    if (seen.has(solution.name)) continue;
    seen.add(solution.name);
    recommendations.push({ area: item.question.id, hours: item.option.hours, ...solution });
    if (recommendations.length === 2) break;
  }

  const topArea = recommendations[0]?.area || null;
  return {
    score,
    band: bandFor(score),
    weeklyHours,
    yearHours,
    savedHours,
    savedValue,
    recommendations,
    firstFixes: topArea ? FIRST_FIXES[topArea] : [],
    topArea,
  };
}

/** Plain text for the owner email, HubSpot message, Telegram alert and the visitor's own copy. */
export function summarise(answers: Answers, rate = DEFAULT_RATE, share = DEFAULT_SHARE): string {
  const result = assess(answers, rate, share);
  const lines = selected(answers).map((item) => `${item.question.title} ${item.option.label}`).join(' | ');
  const fixes = result.firstFixes.length ? ` First fixes: ${result.firstFixes.join(' ')}` : '';
  return [
    `Business assessment. Score ${result.score}/100 (${result.band.label}).`,
    lines,
    `Estimate: ${result.weeklyHours}h/week, ${result.yearHours}h/year. Planning assumption ${share}%: ${result.savedHours}h/year, about ${formatPrice(result.savedValue)} at ${formatPrice(rate)}/h.`,
    `Suggested: ${result.recommendations.map((item) => `${item.name} (${item.price})`).join(', ') || 'no system yet; start with a conversation'}.`,
    fixes.trim(),
  ].filter(Boolean).join(' ');
}

/** Where the free fixes live, so the result can link to an explanation rather than a sales page alone. */
export const AREA_LABEL: Record<AreaId, string> = {
  enquiries: 'New enquiries',
  documents: 'Client documents',
  complaints: 'Complaints',
  reporting: 'Reporting',
  followup: 'Proposal follow-up',
  repetition: 'Copying between tools',
};
