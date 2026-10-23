/**
 * Niche guides. Every example is a real problem found on a live UK small-business
 * website during manual checks in September 2026, described without naming the
 * business. Keep it that way: no invented findings, no names.
 *
 * These are examples of businesses this applies to, not a limit: the same
 * review and systems work for any UK business customers book, call or enquire with.
 */
import { AUTOMATION_MENU, EXTRAS, OFFERS, WEB_OFFERS, getExtra } from '../offers';

const offer = (id: string) => {
  const found = OFFERS.find((item) => item.id === id);
  if (!found) throw new Error(`Unknown offer ${id}`);
  return found;
};
const addOn = (name: string, body: string) => {
  const found = EXTRAS.find((item) => item.name === name);
  if (!found) throw new Error(`Unknown add-on ${name}`);
  return { name: `Add-on: ${found.name}`, price: found.price, body, pick: found.name };
};
/** A second task adds to a Starter at the Extra automation price (Offer v12: £99). */
const menuJob = (name: string, body: string) => {
  const found = AUTOMATION_MENU.find((item) => item.name === name);
  if (!found) throw new Error(`Unknown menu job ${name}`);
  return { name: `Add a second task: ${found.name}`, price: getExtra('Extra automation').price, body, pick: offer('starter').name };
};
/** Starter is ONE job (Offer v9). Anything more is a priced add-on or a Business System. */
const starter = (body: string) => ({ name: offer('starter').name, price: offer('starter').price, body, pick: offer('starter').name });
const system = (body: string) => ({ name: offer('business-system').name, price: offer('business-system').price, body, pick: offer('business-system').name });
const website = (body: string) => { const w = WEB_OFFERS.find((item) => item.id === 'website')!; return { name: w.name, price: w.price, body, pick: w.name }; };
const custom = (body: string) => ({ name: offer('custom').name, price: offer('custom').price, body, pick: offer('custom').name });

export type NicheGuide = {
  id: string;
  name: string;
  /** Short label for menus. */
  shortName: string;
  title: string;
  lede: string;
  /** `pick` is the exact package or add-on name that pre-fills the free plan form. */
  fixes: { name: string; price: string; body: string; pick: string }[];
  /** Optional illustrations. Must be labelled as illustrative, never passed off as client work. */
  visuals?: { src: string; alt: string; caption: string }[];
  /** Optional related page, e.g. physical models for architects. */
  related?: { href: string; label: string; body: string };
};

export const NICHE_GUIDES: NicheGuide[] = [
  {
    id: 'heating-and-plumbing',
    shortName: 'Heating and plumbing',
    name: 'Heating, plumbing and gas engineers',
    title: 'Win the heating and plumbing work you miss while your hands are full',
    lede: 'You can’t answer the phone with your hands in a boiler. If nobody gets back to the caller, they ring the next engineer on Google, and quotes you sent last week go quiet.',
    fixes: [
      starter('One task set up to run itself: miss a call on a job and the caller gets a text straight away with a link to book or ask for a quote.'),
      menuJob('Quote follow-up', 'No reply to a quote? A friendly reminder goes out after 3 and 7 days, in your words, and stops when they reply.'),
      system('Missed-call text-back, quote follow-up and review requests joined up, with a weekly report, so new work keeps coming in while you’re on the tools.'),
    ],
  },
  {
    id: 'roofers',
    shortName: 'Roofers',
    name: 'Roofers and roofing contractors',
    title: 'Win the roofing jobs that ring while you’re up a ladder',
    lede: 'Leaks and storm damage don’t wait. If nobody answers, the homeowner rings the next roofer on Google, and the quotes you sent after the last storm go quiet.',
    fixes: [
      starter('One task set up to run itself: miss a call on the roof and the caller gets a text straight away with a link to send photos and ask for a quote.'),
      menuJob('Quote follow-up', 'No reply to a quote? A friendly reminder goes out after 3 and 7 days, in your words, and stops when they reply.'),
      system('Missed-call text-back, quote follow-up and review requests joined up, with a weekly report, so the work keeps coming in between jobs.'),
    ],
  },
  {
    id: 'builders',
    shortName: 'Builders',
    name: 'Builders, extensions and renovation firms',
    title: 'Turn building enquiries into site visits without living on the phone',
    lede: 'Big jobs start with a call or a form, then a site visit and a quote. Miss the call, or leave the quote unchased, and the job goes to whoever replied first.',
    fixes: [
      starter('One task set up to run itself: every enquiry from your phone, website and messages lands in one list with an instant reply.'),
      menuJob('Quote follow-up', 'Quotes are chased for you after 3 and 7 days, and stop the moment the customer replies.'),
      menuJob('Payment reminders', 'Stage payments are nudged before and after they’re due, with the payment link, so you stop chasing money.'),
    ],
  },
  {
    id: 'electricians',
    shortName: 'Electricians',
    name: 'Electricians and electrical contractors',
    title: 'Answer every electrical enquiry, even with your hands in a fuse box',
    lede: 'People ring when the power is off or a job can’t wait. If you can’t pick up, they try the next electrician, and certificate and quote enquiries pile up unanswered.',
    fixes: [
      starter('One task set up to run itself: miss a call and the caller gets a text with a link to book a visit or describe the job.'),
      menuJob('Job update texts', '“Booked”, “on the way”, “done”: sent for you, so customers stop ringing for updates.'),
      system('Missed-call text-back, quote follow-up and review requests joined up, with a weekly report, so you can stay on the tools.'),
    ],
  },
  {
    id: 'salons-and-beauty',
    shortName: 'Salons and beauty',
    name: 'Salons and beauty',
    title: 'Keep salon and beauty clients booking without chasing them',
    lede: 'Clients book on their phone, often late at night. If the booking route breaks, they book somewhere else and you never hear about it.',
    fixes: [
      starter('One task set up to run itself: every booking or enquiry lands in one place and gets an instant confirmation.'),
      menuJob('Appointment reminders', 'Clients get a reminder the day before, so fewer no-shows.'),
      system('Rebooking prompts, review requests and no-show follow-ups joined up and sent for you, so repeat visits do not depend on your memory.'),
    ],
  },
  {
    id: 'dog-groomers',
    shortName: 'Dog groomers',
    name: 'Dog groomers',
    title: 'Take dog grooming bookings while your hands are full',
    lede: 'You cannot answer the phone mid-groom. If your website cannot take the booking instead, the call goes to the next groomer on Google.',
    fixes: [
      starter('One task set up to run itself: every booking confirmed automatically, so you can keep grooming.'),
      menuJob('Missed-call text-back', 'Miss a call and the owner gets a text with your booking link, so they don’t ring another groomer.'),
      menuJob('Online booking', 'If you have no booking tool yet. Most booking tools charge a monthly fee, paid to them directly, and I tell you the cost before you commit.'),
    ],
  },
  {
    id: 'garages',
    shortName: 'Garages and MOT',
    name: 'Garages and MOT centres',
    title: 'Turn garage and MOT enquiries into booked jobs',
    lede: 'Most drivers search when something is already wrong. They want a number to tap or an MOT slot to book, fast.',
    fixes: [
      starter('One task set up to run itself: every quote or MOT request logged in one list with an instant reply.'),
      menuJob('Quote follow-up', 'A friendly reminder goes out if the customer goes quiet after a quote.'),
      website('A new site with online booking and job updates built in, when your current one can’t do it.'),
    ],
  },
  {
    id: 'cafes-and-food',
    shortName: 'Cafés and food',
    name: 'Cafes, bakeries and food',
    title: 'Get more people through the café door',
    lede: 'People check your hours, menu and number on their phone before they visit. Small errors quietly send them elsewhere.',
    fixes: [
      starter('One task set up to run itself: orders, bookings and messages gathered in one place with an automatic reply.'),
      menuJob('Review requests', 'Customers are asked for a Google review after each visit.'),
      website('A phone-first site with menu, hours, ordering or table booking built in, when your current one can’t do it.'),
    ],
  },
  {
    id: 'clinics-and-therapists',
    shortName: 'Clinics and therapists',
    name: 'Clinics and therapists',
    title: 'Let clients book without ringing you mid-session',
    lede: 'Patients are often nervous before they book. A dead link or a missing number at the wrong moment is enough to stop them.',
    fixes: [
      starter('One task set up to run itself: new enquiries acknowledged straight away with the next step.'),
      menuJob('Appointment reminders', 'Patients and clients get a reminder the day before, so fewer appointments are missed.'),
    ],
  },
  {
    id: 'architects',
    shortName: 'Architects',
    name: 'Architects and architecture practices',
    title: 'Turn people who like your work into real projects',
    lede: 'A strong portfolio gets attention, but the next step still matters. If a potential client has to hunt for contact details or start from a blank email, every enquiry begins with extra back-and-forth.',
    fixes: [
      starter('One task set up to run itself: a project enquiry captured in one place, acknowledged automatically and passed to you with the key details already collected.'),
      system('Enquiry, qualification, consultation, proposal and follow-up joined up so new-project admin does not start from scratch every time.'),
      website('A portfolio or practice site with project pages, enquiry flow or a client-facing tool built around how your practice actually works.'),
    ],
    visuals: [
      { src: '/architecture/massing-model.svg', alt: 'Illustrative axonometric of a simple 1:500 massing model on a site base, with a QR plaque that opens the project page', caption: 'A simple massing model with a QR or tap plaque that opens the project page.' },
      { src: '/architecture/site-plan.svg', alt: 'Illustrative site plan with a proposed dwelling, garage, trees, access road, north arrow and scale bar', caption: 'A clean site plan for a proposal or project page.' },
    ],
    related: {
      href: '/3d-printing#architecture-property',
      label: 'See models and drawings',
      body: 'Simple printed concept and massing models, plus clear presentation drawings, linked to your project page.',
    },
  },
];

export function getNicheGuide(id: string) {
  return NICHE_GUIDES.find((guide) => guide.id === id);
}
