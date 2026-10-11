import { AFTER_HOURS, AUTOMATION_MENU, CARE_PLAN, FREE_STEP, NEXT_STEPS, OFFERS, UPGRADE_CREDITS, getExtra } from '../offers';

/**
 * Maz Works Solutions: six problems in the owner's words, each answered with the
 * same four things. Nothing here is a product of its own: every solution maps
 * onto existing offers and the automation menu in offers.ts, and every price is
 * read from there. Never type a price in this file (tests check).
 */

export type BizId = 'trade' | 'salon' | 'garage' | 'cafe' | 'office';
export const BIZ_TYPES: { id: BizId; label: string }[] = [
  { id: 'trade', label: 'Trade' },
  { id: 'salon', label: 'Salon or clinic' },
  { id: 'garage', label: 'Garage' },
  { id: 'cafe', label: 'Café or shop' },
  { id: 'office', label: 'Office' },
];

export type CostLine = { label: string; value: string };

export type Solution = {
  id: string;
  /** Short name on the picker button. */
  short: string;
  /** The problem, in the owner's words. */
  problem: string;
  pain: string;
  /** Three-step mini flow. */
  flow: { start: string; does: string; result: string };
  /** Menu jobs a Starter can pick from (ids in AUTOMATION_MENU). */
  jobs: string[];
  get: string[];
  /** Pay once (you own it). */
  once: CostLine[];
  onceHead: string;
  /** Keeps costing: monthly service, optional care, third-party costs paid direct. */
  keeps: CostLine[];
  keepsHead: string;
  own: string;
  /** Package named in the pre-filled free demo form. */
  pkg: string;
  /** Extra line for upgrades and bundles. */
  upgrade: string;
  examples: Record<BizId, string>;
};

const [STARTER, SYSTEM] = OFFERS;
const extra = getExtra('Extra automation').price;
const TEXTS: CostLine = { label: 'Texts and any booking app', value: 'A few pence a text, paid direct to the provider. You are told the cost before you pay me.' };
const CARE: CostLine = { label: `${CARE_PLAN.name} (optional)`, value: `${CARE_PLAN.price}, cancel any time` };
const SETUPS: CostLine = { label: 'Two one-day set-ups of your choice', value: 'Included' };
const OWN_STARTER = 'Your accounts, your customer list and every message. If you stop paying me, it keeps running.';
const STARTER_UPGRADE = `Want another task later? Extra automation is ${extra}. Three or more tasks is a ${SYSTEM.name}. ${UPGRADE_CREDITS[0]}`;
const starterOnce = (label: string): CostLine[] => [{ label: `${label} (${STARTER.name})`, value: STARTER.price }, SETUPS];

export const SOLUTIONS: Solution[] = [
  {
    id: 'missed-calls',
    short: 'Missed calls',
    problem: 'I miss calls and lose the job.',
    pain: 'You are on a job or closed for the night. The caller does not leave a message. They ring the next name on Google.',
    flow: { start: 'A call goes unanswered.', does: 'The caller gets a text with your booking or quote link.', result: 'The enquiry arrives in writing, ready to answer.' },
    jobs: ['missed-call'],
    get: ['A text back to every missed caller, in your business name', 'Tested with you on your own phone before it goes live'],
    once: starterOnce('Missed-call text-back'),
    onceHead: STARTER.price,
    keeps: [TEXTS, CARE, { label: `Want calls answered instead? ${AFTER_HOURS.name}`, value: `${AFTER_HOURS.price}, ${AFTER_HOURS.minutes} minutes. ${AFTER_HOURS.setup}.` }],
    keepsHead: 'Nothing required',
    own: OWN_STARTER,
    pkg: STARTER.name,
    upgrade: `${STARTER_UPGRADE} The ${AFTER_HOURS.name} is a separate monthly service: ${AFTER_HOURS.terms}`,
    examples: {
      trade: 'Up a ladder when the phone rings? The caller gets your quote link before they ring someone else.',
      salon: 'Mid-appointment with your hands busy? They get a text with your booking link.',
      garage: 'Under a car at 4pm? The caller gets a text to book a slot or ask for a quote.',
      cafe: 'Rush on and the phone goes unanswered? A text with your hours and your order or booking link goes out.',
      office: 'In a meeting when a client calls? They get a text and a link to book a time.',
    },
  },
  {
    id: 'bookings',
    short: 'Bookings and no-shows',
    problem: 'People book, then do not turn up.',
    pain: 'Empty slots cost you money, and you spend evenings answering “are you free Tuesday?”.',
    flow: { start: 'Someone books, or a day before their slot.', does: 'They book themselves and get a reminder they can confirm or move.', result: 'Fewer gaps, and cancelled slots go to the next person on your list.' },
    jobs: ['online-booking', 'reminders', 'waitlist', 'rebooking'],
    get: ['Reminders by text that customers answer with one tap', 'A waitlist that fills a cancellation for you'],
    once: starterOnce('Booking or reminders'),
    onceHead: STARTER.price,
    keeps: [TEXTS, CARE],
    keepsHead: 'Nothing required',
    own: OWN_STARTER,
    pkg: STARTER.name,
    upgrade: STARTER_UPGRADE,
    examples: {
      trade: 'A reminder the day before a visit, so you are not driving to a locked door.',
      salon: 'Clients confirm or move their slot by text, and a cancellation goes to the waitlist.',
      garage: 'A reminder the day before a service or MOT, with a way to move it.',
      cafe: 'Table or event bookings made online, with a reminder so the table is not wasted.',
      office: 'Clients book and confirm meetings themselves, and get a nudge before.',
    },
  },
  {
    id: 'quotes',
    short: 'Quotes that go quiet',
    problem: 'I send a quote and never hear back.',
    pain: 'Enquiries and quotes sit in your inbox. You mean to chase, but the day gets away.',
    flow: { start: 'You send a quote and there is no reply.', does: 'A friendly reminder goes out after 3 and after 7 days.', result: 'Customers answer, and every enquiry is in one list.' },
    jobs: ['quote-follow-up', 'one-list', 'payment-reminders'],
    get: ['Follow-up messages written with you, in your own voice', 'Phone, email and forms landing in one list'],
    once: starterOnce('Quote follow-up'),
    onceHead: STARTER.price,
    keeps: [TEXTS, CARE],
    keepsHead: 'Nothing required',
    own: OWN_STARTER,
    pkg: STARTER.name,
    upgrade: STARTER_UPGRADE,
    examples: {
      trade: 'The kitchen quote you sent on Monday gets a polite nudge on Thursday, without you remembering.',
      salon: 'Someone asks about a course of treatments and goes quiet. They get a friendly follow-up.',
      garage: 'An estimate for brakes is not answered. A reminder goes out, with the pay or book link.',
      cafe: 'A catering or event enquiry gets an instant reply, then a nudge if they go quiet.',
      office: 'A proposal goes unanswered. A short reminder follows, and the reply lands in one list.',
    },
  },
  {
    id: 'updates',
    short: 'Customer updates',
    problem: 'Customers keep ringing to ask what is happening.',
    pain: 'You stop work to say “yes, it is booked” or “we are nearly done”.',
    flow: { start: 'A job is booked, on its way or finished.', does: 'The customer is told, by text or email, without you typing it.', result: 'Fewer calls asking for an update.' },
    jobs: ['job-updates', 'reminders', 'milestones', 'payment-reminders'],
    get: ['Messages for each stage, worded with you', 'Payment reminders with the pay link, if you want them'],
    once: starterOnce('Updates or reminders'),
    onceHead: STARTER.price,
    keeps: [TEXTS, CARE],
    keepsHead: 'Nothing required',
    own: OWN_STARTER,
    pkg: STARTER.name,
    upgrade: STARTER_UPGRADE,
    examples: {
      trade: '“Booked”, “on the way”, “done”: sent for you, so the customer is not left guessing.',
      salon: 'A confirmation and a reminder before each visit, and a thank-you after.',
      garage: '“Your car is in”, “ready to collect”: sent as each stage is reached.',
      cafe: 'Order received and ready for collection messages, without you typing them.',
      office: 'A client gets an update at each stage of their case, automatically.',
    },
  },
  {
    id: 'reviews',
    short: 'Reviews and repeat customers',
    problem: 'Happy customers do not leave reviews or come back.',
    pain: 'Your best work never reaches Google, and past customers forget you when they need you again.',
    flow: { start: 'A job finishes, or a customer is due back.', does: 'They are asked for a Google review, or nudged to rebook.', result: 'More reviews, and you are told when one arrives.' },
    jobs: ['reviews', 'rebooking', 'email-list'],
    get: ['A review request after every job, with a link that opens your Google page', 'A review QR card to print, if you pick it as a set-up'],
    once: starterOnce('Review requests or rebooking'),
    onceHead: STARTER.price,
    keeps: [TEXTS, CARE],
    keepsHead: 'Nothing required',
    own: OWN_STARTER,
    pkg: STARTER.name,
    upgrade: STARTER_UPGRADE,
    examples: {
      trade: 'The day after a job, the customer is asked for a review. You do nothing.',
      salon: 'Clients are nudged to rebook when they are due back, and asked for a review after.',
      garage: 'Customers are reminded when the next service is due, and asked for a review.',
      cafe: 'A QR card at the till opens your review page, and regulars hear from you.',
      office: 'Happy clients are asked for a review, so the next one trusts you faster.',
    },
  },
  {
    id: 'joined-up',
    short: 'All of it joined up',
    problem: 'I chase customers by hand, from first enquiry to payment.',
    pain: 'Calls, quotes, bookings and reviews all live in different places, and you are the glue.',
    flow: { start: 'A customer gets in touch.', does: 'Three tasks run one after another, on one customer list.', result: 'A weekly email shows what came in and what is due.' },
    jobs: ['missed-call', 'quote-follow-up', 'reviews', 'one-list', 'weekly-report'],
    get: ['Three tasks from the menu, joined up', 'A weekly report, team training and a month of care'],
    once: [{ label: SYSTEM.name, value: SYSTEM.price }, { label: 'Weekly report, team training and 3 one-day set-ups', value: 'Included' }],
    onceHead: SYSTEM.price,
    keeps: [{ label: `First month of ${CARE_PLAN.name}`, value: 'Included' }, { label: `${CARE_PLAN.name} after that (optional)`, value: `${CARE_PLAN.price}, cancel any time` }, TEXTS],
    keepsHead: 'Nothing required',
    own: 'Your accounts, your customer list and every message. Your team is trained, and if you stop paying me it keeps running.',
    pkg: SYSTEM.name,
    upgrade: `Started with a Starter? Its price comes off a ${SYSTEM.name} booked within 60 days. A fourth task is Extra automation, ${extra}.`,
    examples: {
      trade: 'Missed call, then quote, then follow-up, then review: one flow, one list.',
      salon: 'Enquiry, booking, reminder, review and rebooking nudge, all joined up.',
      garage: 'Enquiry, estimate, reminder, collection message and a service-due nudge.',
      cafe: 'Orders, events and reviews on one list, with a weekly email on what came in.',
      office: 'Enquiry, onboarding form, milestone updates and payment reminders in one place.',
    },
  },
];

export function jobNames(ids: string[]): string[] {
  return ids.map((id) => AUTOMATION_MENU.find((job) => job.id === id)?.name).filter((name): name is string => Boolean(name));
}

/** Pre-filled free demo link: package and source tag, same pattern as the other pages. */
export function demoHref(solution: Solution): string {
  return `/free-plan?src=solutions-${solution.id}&package=${encodeURIComponent(solution.pkg)}#leak-check-form`;
}

/** Day 0, 3 and 7 from the shared next-steps list. */
export const NEXT_THREE = [NEXT_STEPS[0], NEXT_STEPS[2], NEXT_STEPS[3]];
export const DEMO_PRICE = FREE_STEP.price;
