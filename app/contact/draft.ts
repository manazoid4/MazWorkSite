/**
 * Free-plan autopilot (plan v3, C9): turn what the visitor tapped into a
 * drafted reply Maz can approve in two minutes. Pure and deterministic, read
 * entirely from app/offers.ts and app/customer-types.ts, so the draft can never
 * quote a price that isn't on the site. The form sends it as the `draft` field
 * and the enquiry email shows it under "Draft reply".
 */
import { CUSTOMER_TYPES, getCustomerType } from '../customer-types';
import { ALWAYS_INCLUDED, CARE_PLANS, CHANGES_WINDOW, NEXT_STEPS, OFFERS, STARTER_GUARANTEE, getExtra, getMenuJob, getOffer, type Offer } from '../offers';
import { HEADACHE_PICKS, getSystem } from '../systems';
import { CHECK_REPLY_TIME } from '../site';

export type DraftInput = {
  name?: string;
  /** Customer type id or niche id from ?trade= */
  trade?: string;
  /** System ids from "Build my system", comma separated. */
  systems?: string;
  /** Package or add-on name the visitor asked about. */
  package?: string;
  /** Quick-pick labels and free text, one per line. */
  problem?: string;
};

export type Draft = {
  recipe: string;
  offer: Offer;
  jobs: string[];
  price: string;
  subject: string;
  text: string;
};

/** Map the free-plan quick picks to automation-menu job ids. */
const PICK_TO_JOB: Record<string, string> = {
  'Missed calls': 'missed-call',
  'Slow replies to enquiries': 'one-list',
  'No-shows': 'reminders',
  'Chasing quotes': 'quote-follow-up',
  'Chasing invoices': 'payment-reminders',
  'Paperwork and forms': 'onboarding',
  'Getting more reviews': 'reviews',
  'Copying details between apps': 'one-list',
  'Orders only by DM': 'dm-replies',
  'No website to send people to': 'online-booking',
};

const SYSTEM_TO_JOB: Record<string, string> = {
  'missed-calls': 'missed-call', enquiries: 'one-list', reminders: 'reminders', reviews: 'reviews', quotes: 'quote-follow-up', booking: 'online-booking', rebooking: 'rebooking', weekly: 'weekly-report', 'keyword-dm': 'keyword-dm',
};

export function jobsFromInput(input: DraftInput): string[] {
  const jobs: string[] = [];
  for (const id of (input.systems || '').split(',').map((s) => s.trim()).filter(Boolean)) {
    const job = SYSTEM_TO_JOB[id] ?? HEADACHE_PICKS.find((pick) => pick.id === id)?.system;
    if (job && SYSTEM_TO_JOB[job]) jobs.push(SYSTEM_TO_JOB[job]);
    else if (job && jobExists(job)) jobs.push(job);
  }
  for (const line of (input.problem || '').split('\n').map((s) => s.trim())) {
    const job = PICK_TO_JOB[line];
    if (job) jobs.push(job);
  }
  return [...new Set(jobs)].filter(jobExists);
}

function jobExists(id: string): boolean {
  try { getMenuJob(id); return true; } catch { return false; }
}

/** Which rung fits: a named package wins, then the job count, then the type's first recipe. */
export function draftFreePlan(input: DraftInput): Draft {
  const type = getCustomerType(input.trade || '') ?? CUSTOMER_TYPES.find((t) => t.niches.includes(input.trade || ''));
  const jobs = jobsFromInput(input);
  const asked = input.package ? [getOffer('starter'), getOffer('business-system'), getOffer('custom'), getOffer('creator-starter'), getOffer('creator-launch'), getOffer('website')].find((o) => o.name === input.package) : undefined;

  let offer: Offer;
  let recipe: string;
  if (asked) {
    offer = asked;
    recipe = type?.recipes.find((r) => r.offer.id === asked.id)?.name ?? asked.name;
  } else if (type?.id === 'creators') {
    offer = jobs.length >= 2 ? getOffer('creator-launch') : getOffer('creator-starter');
    recipe = type.recipes.find((r) => r.offer.id === offer.id)?.name ?? offer.name;
  } else if (jobs.length >= 3) {
    offer = getOffer('business-system');
    recipe = type?.recipes.find((r) => r.offer.id === 'business-system')?.name ?? offer.name;
  } else {
    offer = getOffer('starter');
    recipe = type?.recipes.find((r) => r.offer.id === 'starter')?.name ?? offer.name;
  }

  const jobNames = (jobs.length ? jobs : (type?.recipes.find((r) => r.offer.id === offer.id)?.jobs ?? [])).map((id) => getMenuJob(id).name);
  const firstJob = jobNames[0] ?? 'the job you described';
  const extraJobs = offer.id === 'starter' && jobNames.length > 1 ? jobNames.slice(1) : [];
  const extra = getExtra('Extra automation');
  const first = (input.name || '').trim().split(/\s+/)[0] || 'there';

  const lines: string[] = [
    `Hi ${first},`,
    '',
    `Thanks for the message. Here is your free preview and fixed price, in plain words.`,
    '',
    `Your preview: [paste the preview link here]. It is one focused example of the fix, built on my own test setup, so nothing touches your apps yet.`,
    '',
    `What I'd set up first: ${recipe} (${offer.price}).`,
    `What it does: ${offer.body}`,
    jobNames.length ? `Jobs inside: ${jobNames.join(', ')}.` : '',
    extraJobs.length ? `If you want ${extraJobs.join(' and ')} as well, each is Extra automation at ${extra.price}, or three jobs together is a Business System from ${getOffer('business-system').from.toLocaleString('en-GB')}.` : '',
    '',
    `What I'd leave alone for now: anything that doesn't touch ${firstJob.toLowerCase()} yet. One job, working, beats three half-done.`,
    '',
    `Always included: ${ALWAYS_INCLUDED.map((item) => item.title.toLowerCase()).join(', ')}.`,
    offer.guarantee ? `Guarantee: ${offer.guarantee}` : '',
    '',
    `What happens next: ${NEXT_STEPS.map((step) => `${step.day}: ${step.title.toLowerCase()}`).join(' · ')}.`,
    `After that: ${CHANGES_WINDOW.short}, and a 90-day fix promise. Help afterwards is optional (${CARE_PLANS[0].name} ${CARE_PLANS[0].price}).`,
    '',
    `Costs you pay directly, if any: a texting or booking app's own fee. I tell you before anything is switched on. Two small set-ups come free with a Starter. No VAT added.`,
    '',
    `Reply "yes" and I'll send the written scope sheet, or ask me anything first.`,
    '',
    'Manazir, Maz Works',
  ];

  return {
    recipe,
    offer,
    jobs,
    price: offer.price,
    subject: `Your free preview: ${recipe}, ${offer.price}`,
    text: lines.filter((line, index, all) => !(line === '' && all[index - 1] === '')).join('\n'),
  };
}

/** Sanity: the reply promise lives in one place. */
export const DRAFT_REPLY_WINDOW = CHECK_REPLY_TIME;
export const DRAFT_STARTER = OFFERS[0];
export const DRAFT_GUARANTEE = STARTER_GUARANTEE;
