/**
 * Per-page extras for the /for pages: what changes (three before/after rows),
 * and which receptionist preset to demo.
 * These are examples of what changes, never client results or statistics.
 * Prices are never typed here (they come from app/offers.ts).
 */
import type { ChangeRow } from '../before-after';
import { getMenuJob } from '../offers';

const row = (job: string, icon: string, before: string, after: string): ChangeRow => ({ key: job, icon, before, name: getMenuJob(job).name, after });

export type TradeExtras = {
  changes: ChangeRow[];
  /** Receptionist demo: preset id in app/receptionist-demo/presets.mjs, the name it answers as, and "Talk to it as ___". */
  receptionist?: { preset: string; business: string; as: string };
};

export const TRADE_EXTRAS: Record<string, TradeExtras> = {
  'heating-and-plumbing': {
    changes: [
      row('missed-call', 'phone', 'You can’t answer with your hands in a boiler, so the caller rings the next engineer.', 'The caller gets a text with a link to book or ask for a quote.'),
      row('quote-follow-up', 'mail', 'Quotes you sent last week have gone quiet.', 'A friendly reminder goes out after 3 and 7 days, and stops when they reply.'),
      row('reviews', 'star', 'Happy customers never get asked for a review.', 'A review request follows every finished job.'),
    ],
    receptionist: { preset: 'plumbing', business: 'Your plumbing firm', as: 'a plumber' },
  },
  roofers: {
    changes: [
      row('missed-call', 'phone', 'You can’t answer on a roof, so the homeowner rings the next roofer.', 'The caller gets a text with a link to send photos and ask for a quote.'),
      row('quote-follow-up', 'mail', 'Quotes sent after the last storm have gone quiet.', 'A friendly reminder goes out after 3 and 7 days, and stops when they reply.'),
      row('reviews', 'star', 'Finished roofs never turn into Google reviews.', 'A review request follows every finished job.'),
    ],
    receptionist: { preset: 'roofer', business: 'Your roofing firm', as: 'a roofer' },
  },
  builders: {
    changes: [
      row('one-list', 'layers', 'Enquiries arrive by phone, website, email and Facebook.', 'Every enquiry lands in one list with an instant reply.'),
      row('quote-follow-up', 'mail', 'Big quotes go unchased while you’re on site.', 'Quotes are chased after 3 and 7 days, and stop when they reply.'),
      row('payment-reminders', 'cart', 'Stage payments slip and you end up chasing.', 'A nudge goes before and after each stage is due, with the pay link.'),
    ],
    receptionist: { preset: 'builder', business: 'Your building firm', as: 'a builder' },
  },
  electricians: {
    changes: [
      row('missed-call', 'phone', 'You can’t pick up mid-job, so the caller tries the next electrician.', 'The caller gets a text with a link to book a visit or describe the job.'),
      row('job-updates', 'chat', 'Customers ring to ask when you’re coming.', '“Booked”, “on the way” and “done” texts go out for you.'),
      row('reviews', 'star', 'Happy customers never get asked for a review.', 'A review request follows every finished job.'),
    ],
    receptionist: { preset: 'electrician', business: 'Your electrical firm', as: 'an electrician' },
  },
  'salons-and-beauty': {
    changes: [
      row('online-booking', 'chat', 'Bookings arrive by DM, phone and late-night forms.', 'Every booking lands in one place with an instant confirmation.'),
      row('reminders', 'calendar', 'Clients forget, and the chair sits empty.', 'A reminder goes the day before; clients confirm or move by text.'),
      row('rebooking', 'repeat', 'Regulars drift away and nobody nudges them back.', 'Past clients get a nudge when they’re due back.'),
    ],
    receptionist: { preset: 'salon', business: 'Your salon', as: 'a salon' },
  },
  'dog-groomers': {
    changes: [
      row('missed-call', 'phone', 'You can’t answer mid-groom, so the owner rings the next groomer.', 'The owner gets a text with your booking link.'),
      row('online-booking', 'paw', 'Bookings wait until you can stop and reply.', 'Owners book a slot themselves, day or night.'),
      row('reminders', 'calendar', 'A forgotten appointment leaves a gap in your day.', 'A reminder goes out the day before.'),
    ],
  },
  garages: {
    changes: [
      row('missed-call', 'phone', 'Drivers ring once, and if nobody answers they ring the next garage.', 'The caller gets a text with a link to book an MOT or ask for a quote.'),
      row('one-list', 'mail', 'Quote and MOT requests arrive by phone, email and web form.', 'Each one is logged in a single list with an instant reply.'),
      row('quote-follow-up', 'chat', 'Quotes go quiet once the car is on the ramp.', 'A friendly reminder goes out if the customer goes quiet.'),
    ],
    receptionist: { preset: 'garage', business: 'Your garage', as: 'a garage' },
  },
  'cafes-and-food': {
    changes: [
      row('one-list', 'mail', 'Orders, bookings and messages land in different places.', 'One list, with an automatic reply.'),
      row('online-booking', 'calendar', 'Table bookings come by phone while you’re serving.', 'Customers book a table themselves, day or night.'),
      row('reviews', 'star', 'Happy regulars never get asked for a review.', 'Customers are asked for a Google review after each visit.'),
    ],
  },
  'clinics-and-therapists': {
    changes: [
      row('one-list', 'mail', 'New enquiries wait while you’re with a patient.', 'Each one is acknowledged straight away with the next step.'),
      row('online-booking', 'calendar', 'Booking means ringing and hoping someone answers.', 'Clients book themselves, day or night.'),
      row('reminders', 'chat', 'A missed appointment leaves a gap you can’t refill.', 'A reminder goes out the day before; clients confirm or move by text.'),
    ],
    receptionist: { preset: 'clinic', business: 'Your clinic', as: 'a clinic' },
  },
  architects: {
    changes: [
      row('one-list', 'mail', 'Project enquiries start from a blank email.', 'Each enquiry is captured with the key details and acknowledged automatically.'),
      row('quote-follow-up', 'chat', 'Proposals go quiet after you send them.', 'A polite follow-up goes out, in your words.'),
      row('milestones', 'pin', 'Clients ask where their project is up to.', 'Clients get an update at each stage, automatically.'),
    ],
  },
  // Customer-type pages derive their before/after rows from their own pains; only the phone and receptionist are set here.
  trades: {
    changes: [],
    receptionist: { preset: 'builder', business: 'Your trade business', as: 'a tradesperson' },
  },
  appointments: {
    changes: [],
    receptionist: { preset: 'salon', business: 'Your salon', as: 'a salon' },
  },
  creators: {
    changes: [],
  },
  offices: {
    changes: [],
  },
};

/** Icons for before/after rows derived from menu jobs (kit-icon names). */
export const JOB_ICONS: Record<string, string> = {
  'missed-call': 'phone', 'online-booking': 'calendar', reminders: 'calendar', rebooking: 'repeat', waitlist: 'pin', reviews: 'star',
  'quote-follow-up': 'mail', 'payment-reminders': 'cart', 'job-updates': 'chat', 'dm-replies': 'chat', 'keyword-dm': 'chat',
  'email-list': 'mail', 'one-list': 'mail', onboarding: 'layers', milestones: 'pin', 'weekly-report': 'layers',
};
