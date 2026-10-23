/**
 * The four kinds of customer (offer map, 2 Oct 2026): pick yours, see your
 * problems, see the step that fixes them and what it costs. Prices and job
 * names come from app/offers.ts; nothing here hard-codes a price.
 * Pains are written in the owner's words; none name a real business.
 */
import { AUTOMATION_MENU, CREATOR_OFFERS, OFFERS, WEB_OFFERS, getMenuJob, getOffer, type CustomerTypeId, type Offer } from './offers';

export type PainRow = {
  pain: string;
  /** Small set-up that eases it (free with a Starter), or null. */
  setup: string | null;
  /** Automation-menu job id that fixes it (a Starter). */
  starter: string | null;
  /** What the joined-up Business System adds. */
  system: string | null;
};

export type Recipe = {
  name: string;
  /** Which rung it is: shows that offer's name and price. */
  offer: Offer;
  /** Menu job ids inside it. */
  jobs: string[];
  what: string;
};

export type CustomerType = {
  id: CustomerTypeId;
  name: string;
  shortName: string;
  /** Icon name in kit-icon.tsx. */
  icon: string;
  title: string;
  lede: string;
  examples: string;
  pains: PainRow[];
  recipes: Recipe[];
  /** Calculator preset: typical numbers to start the sliders with. */
  calculator: { perWeek: number; share: number; value: number; label: string };
  /** Systems (app/systems.ts ids) to animate on the page. */
  scenes: string[];
  /** Menu job ids to show first. */
  menu: string[];
  /** Niche guides that sit under this type. */
  niches: string[];
};

const starter = OFFERS[0];
const system = OFFERS[1];
const custom = OFFERS[2];
const website = WEB_OFFERS[0];
const [creatorStarter, creatorLaunch] = CREATOR_OFFERS;

export const CUSTOMER_TYPES: CustomerType[] = [
  {
    id: 'trades',
    name: 'Trades',
    shortName: 'Trades',
    icon: 'bolt',
    title: 'Stop losing jobs to missed calls and quiet quotes',
    lede: 'You’re on a job, the phone rings, you can’t answer, and the caller rings the next plumber. Then the quotes you did send go quiet.',
    examples: 'Plumbers, electricians, builders, roofers, garages, landscapers.',
    pains: [
      { pain: 'I miss calls on jobs and lose work', setup: 'Booking link everywhere', starter: 'missed-call', system: 'Missed calls, enquiries and quotes in one list' },
      { pain: 'Quotes go quiet', setup: 'Quote template', starter: 'quote-follow-up', system: 'Quote → job → invoice → payment chase, joined up' },
      { pain: 'Chasing payments', setup: 'Invoice template with pay link', starter: 'payment-reminders', system: 'Joined to quotes and jobs' },
      { pain: 'No reviews, or not enough', setup: 'Review QR card', starter: 'reviews', system: 'Reviews, rebooking and the weekly report' },
      { pain: 'Customers keep ringing for updates', setup: 'Saved replies', starter: 'job-updates', system: 'A live job tracker link for customers' },
      { pain: 'Admin eats my evenings', setup: null, starter: 'weekly-report', system: 'Everything above, plus the Monday email' },
    ],
    recipes: [
      { name: `${starter.name}: missed-call text-back`, offer: starter, jobs: ['missed-call'], what: 'Miss a call and the caller gets a text with your quote link. Working in a week.' },
      { name: `${system.name}: calls, quotes and reviews`, offer: system, jobs: ['missed-call', 'quote-follow-up', 'reviews'], what: 'Nobody slips through, quotes chase themselves, every finished job asks for a review. Weekly report included.' },
      { name: `${custom.name}: a job app for your team`, offer: custom, jobs: [], what: 'Jobs, photos, sign-off and invoices in one tool your team actually uses.' },
    ],
    calculator: { perWeek: 15, share: 20, value: 250, label: 'A typical trade: 15 calls a week, 1 in 5 missed, £250 a job' },
    scenes: ['missed-calls', 'quotes', 'reviews'],
    menu: ['missed-call', 'quote-follow-up', 'payment-reminders', 'reviews', 'job-updates', 'weekly-report'],
    niches: ['heating-and-plumbing', 'roofers', 'builders', 'electricians', 'garages'],
  },
  {
    id: 'appointments',
    name: 'Appointments',
    shortName: 'Appointments',
    icon: 'scissors',
    title: 'Fill the diary without answering the phone mid-appointment',
    lede: 'Bookings come by phone and DM while your hands are busy. No-shows cost you, cancellations go to waste, and the same questions arrive all day.',
    examples: 'Salons, barbers, groomers, clinics, physios, trainers, tutors.',
    pains: [
      { pain: 'Bookings by phone or DM, can’t answer mid-appointment', setup: 'Booking link everywhere', starter: 'online-booking', system: 'Booking, reminders and DM auto-replies joined up' },
      { pain: 'No-shows', setup: 'Saved replies', starter: 'reminders', system: 'Reminders, deposits and a waitlist that fills cancellations' },
      { pain: 'Clients don’t come back', setup: null, starter: 'rebooking', system: 'Rebooking, review requests and a loyalty message' },
      { pain: 'Same DMs all day: price? availability?', setup: 'Saved replies', starter: 'dm-replies', system: 'Joined to booking and your email list' },
      { pain: 'Full until January, cancellations wasted', setup: null, starter: 'waitlist', system: 'Waitlist, deposits and the weekly report' },
    ],
    recipes: [
      { name: `${starter.name}: reminders that cut no-shows`, offer: starter, jobs: ['reminders'], what: 'A reminder the day before; clients confirm or move by text.' },
      { name: `${system.name}: booking, reminders and rebooking`, offer: system, jobs: ['online-booking', 'reminders', 'rebooking'], what: 'Clients book themselves, turn up, and get nudged when they’re due back. Weekly report included.' },
      { name: `${custom.name}: packages and memberships`, offer: custom, jobs: [], what: 'Packages, memberships and your own booking rules when the booking app can’t.' },
    ],
    calculator: { perWeek: 25, share: 10, value: 45, label: 'A typical salon: 25 bookings a week, 1 in 10 lost or no-show, £45 a visit' },
    scenes: ['booking', 'reminders', 'rebooking'],
    menu: ['online-booking', 'reminders', 'rebooking', 'waitlist', 'dm-replies', 'reviews'],
    niches: ['salons-and-beauty', 'dog-groomers', 'clinics-and-therapists', 'cafes-and-food'],
  },
  {
    id: 'creators',
    name: 'Creators',
    shortName: 'Creators',
    icon: 'camera',
    title: 'Turn followers into a list you own and a page that sells',
    lede: 'You’ve got the audience. What’s missing is the path from a post to a paid session or download, and a list that’s yours if the app changes its mind.',
    examples: 'Coaches, trainers, makers, artists, musicians, photographers.',
    pains: [
      { pain: 'Followers but no sales', setup: 'Profile tidy', starter: 'keyword-dm', system: 'A page selling up to three things, payments to your account' },
      { pain: 'I answer the same DMs', setup: 'Saved replies', starter: 'dm-replies', system: 'An FAQ section on the page' },
      { pain: 'I don’t own my audience', setup: null, starter: 'email-list', system: 'A 3-email welcome series' },
      { pain: 'I look amateur', setup: 'Profile tidy', starter: null, system: 'Brand look, 12 post templates and 3 launch posts' },
      { pain: 'Booking calls is messy', setup: 'Booking link everywhere', starter: 'online-booking', system: 'Paid booking with reminders' },
    ],
    recipes: [
      { name: `${creatorStarter.name}: comment a word, get your guide`, offer: creatorStarter, jobs: ['keyword-dm', 'email-list'], what: 'Someone comments a word like PLAN, gets your free guide by message and joins your email list. Profile tidy and your link everywhere included.' },
      { name: `${creatorLaunch.name}: book and pay for calls`, offer: creatorLaunch, jobs: ['online-booking', 'email-list'], what: 'One page that books and takes payment for calls, in your look, with a welcome series.' },
      { name: `${creatorLaunch.name}: sell a download`, offer: creatorLaunch, jobs: ['email-list'], what: 'One page that sells a download, sends it automatically and grows your list.' },
    ],
    calculator: { perWeek: 20, share: 30, value: 60, label: 'A typical creator: 20 DMs a week asking about prices, 3 in 10 never answered, £60 a sale' },
    scenes: ['keyword-dm', 'booking', 'enquiries'],
    menu: ['keyword-dm', 'email-list', 'dm-replies', 'online-booking'],
    niches: [],
  },
  {
    id: 'offices',
    name: 'Small offices',
    shortName: 'Offices',
    icon: 'layers',
    title: 'Get every enquiry, document and update out of your inbox',
    lede: 'Enquiries arrive by phone, email and forms. Onboarding paperwork drags. Clients chase for updates. Hiring someone to manage it costs more than fixing it.',
    examples: 'Estate agents, accountants, solicitors, consultancies, recruiters.',
    pains: [
      { pain: 'Enquiries scattered across email, phone and forms', setup: 'Contact form that reaches you', starter: 'one-list', system: 'Assignment to staff and a weekly report' },
      { pain: 'Onboarding paperwork: forms, ID, documents', setup: 'Quote template', starter: 'onboarding', system: 'Onboarding → engagement letter → invoice' },
      { pain: 'Clients chase for updates', setup: 'Saved replies', starter: 'milestones', system: 'A tracker with automatic updates to everyone involved' },
      { pain: 'Hiring admin to do all of the above', setup: null, starter: null, system: 'A Business System instead of, or alongside, the hire' },
    ],
    recipes: [
      { name: `${starter.name}: every enquiry in one list`, offer: starter, jobs: ['one-list'], what: 'Phone, email and forms land in one list with an instant reply, so nothing waits in a personal inbox.' },
      { name: `${system.name}: enquiry to onboarding`, offer: system, jobs: ['one-list', 'onboarding', 'milestones'], what: 'Enquiry, onboarding and client updates joined up. Weekly report included.' },
      { name: `${custom.name}: a client portal`, offer: custom, jobs: [], what: 'Clients log in to see progress, documents and invoices instead of emailing you.' },
    ],
    calculator: { perWeek: 10, share: 20, value: 600, label: 'A typical small firm: 10 enquiries a week, 1 in 5 lost to slow replies, £600 a client' },
    scenes: ['enquiries', 'quotes', 'weekly'],
    menu: ['one-list', 'onboarding', 'milestones', 'quote-follow-up', 'payment-reminders', 'weekly-report'],
    niches: ['architects'],
  },
];

export function getCustomerType(id: string): CustomerType | undefined {
  return CUSTOMER_TYPES.find((type) => type.id === id);
}

export function isCustomerType(id: string): id is CustomerTypeId {
  return CUSTOMER_TYPES.some((type) => type.id === id);
}

/** The rung names a pain row points at, for the pain table. */
export function painCells(row: PainRow): { setup: string; starter: string; system: string } {
  return {
    setup: row.setup ? `${row.setup} · free with a ${starter.name}` : '—',
    starter: row.starter ? `${getMenuJob(row.starter).name} · ${starter.price}` : '—',
    system: row.system ?? '—',
  };
}

/** The website offer, for types that need somewhere to send people. */
export const WEBSITE_OFFER = website;
export const CUSTOM_OFFER = getOffer('custom');

/** All the ids the "Build my system" and free-plan form accept as a trade. */
export const TYPE_IDS = CUSTOMER_TYPES.map((type) => type.id);
/** Jobs listed in the menu, for tests: every type page shows only real menu jobs. */
export const MENU_IDS = AUTOMATION_MENU.map((job) => job.id);
