import { AFTER_HOURS, STARTER_GUARANTEE } from '../offers';
import { CHECK_REPLY_TIME } from '../site';

/**
 * Copy for /after-hours-receptionist. Prices come from AFTER_HOURS in
 * app/offers.ts; nothing here types a £ figure. No invented stats, clients or
 * results, and no "AI" wording (Maz, 27 Sep): it is an automated receptionist.
 */

export const CHIPS = ['Day and night cover', 'Takes messages', 'Answers your FAQs', 'Email summaries', 'Urgent-call rules', 'Monthly tuning included'];

export const BEST_FOR = [
  { label: 'Salons and beauty', href: '/for/salons-and-beauty' },
  { label: 'Clinics and therapists', href: '/for/clinics-and-therapists' },
  { label: 'Garages', href: '/for/garages' },
  { label: 'Roofers', href: '/for/roofers' },
  { label: 'Builders', href: '/for/builders' },
  { label: 'Plumbers', href: '/for/heating-and-plumbing' },
  { label: 'Electricians', href: '/for/electricians' },
  { label: 'Small service businesses', href: '/for' },
];

/** Before and after, one row per moment that changes. */
export const COMPARE = [
  { before: 'The caller hits voicemail and rings the next business on Google.', after: 'The call is answered in your business name.' },
  { before: '“Are you open Saturday?” goes unanswered until Monday.', after: 'Common questions are answered there and then, from your own info.' },
  { before: 'Three missed calls, no messages, no idea who they were.', after: 'Name, number and what they need, read back to check.' },
  { before: 'A morning of ringing people back with no context.', after: 'One clear summary in your inbox before you open.' },
];

export const STEPS = [
  { title: 'I learn your business', body: 'Your hours, services, areas, prices you’re happy to share, and the questions people always ask.' },
  { title: 'We set the rules', body: 'Your greeting, what it can answer, what counts as urgent and who it tells.' },
  { title: 'Calls you miss are answered', body: 'If you don’t pick up, the call goes to it. Answer as normal when you can; nothing else changes.' },
  { title: 'You get the summary', body: 'Each call arrives by email with who, what and how urgent, so you ring back with context.' },
];

export const TRUST = [
  { icon: 'rules', title: 'Follows your rules', body: 'It only answers from the information you approve. Anything else becomes a message.' },
  { icon: 'urgent', title: 'Urgent calls reach you', body: 'You choose the words and situations that matter, and whether it texts or rings you.' },
  { icon: 'honest', title: 'Sticks to what it knows', body: 'It answers only from the information you approve. If a question isn’t covered, it takes a message instead of guessing.' },
  { icon: 'clear', title: 'Clear with callers', body: 'It says it’s an automated receptionist for your business. Callers can leave a message for you instead.' },
  { icon: 'record', title: 'Recording only with notice', body: 'Call recording is off unless you want it. If it’s on, callers are told at the start.' },
  { icon: 'control', title: 'You stay in control', body: 'Change the greeting, hours or answers by email. Switch it off by turning off call forwarding.' },
];

export const EMERGENCY_NOTE = 'The receptionist takes messages and answers everyday questions. It is not an emergency service: callers in an emergency are told to ring 999 or the right urgent service.';

export const FAQS = [
  { q: 'What does it actually do?', a: 'Any call you don’t pick up goes to it, whether you’re on a job or closed for the night. It greets callers in your business name, answers the common questions you’ve given it, takes a clear message, follows your urgent-call rules and emails you a summary.' },
  { q: 'Does it replace me or my staff?', a: 'No. It covers the calls nobody can answer, so callers get a reply instead of voicemail. You still ring people back and do the work.' },
  { q: 'Can it answer questions about my business?', a: 'Yes, from the information you give me: hours, services, areas, “from” prices and how to book. If a caller asks something it hasn’t been given, it says so and takes a message.' },
  { q: 'Is it a real person?', a: 'No. It’s an automated receptionist with a natural voice, and it says so. Callers can leave a message for you instead. Like any automated system it can occasionally mishear, which is why every call comes with a summary and I review calls each month.' },
  { q: 'What happens if someone needs urgent help?', a: `You set what counts as urgent, like a leak or a car stuck on a driveway, and it texts or rings you. ${EMERGENCY_NOTE}` },
  { q: 'Can I change the greeting or opening hours?', a: 'Yes. Email me and I update it, usually within 2 working days. Holidays and closures are included in the monthly price.' },
  { q: 'Are calls recorded?', a: 'Only if you want them to be. If recording is on, callers are told at the start of the call. Otherwise you get the written summary only.' },
  { q: 'How is my customers’ information handled?', a: 'Call details go to you by email and are used only to run your service. To answer and summarise calls, the audio passes through a telephone provider and a speech-processing provider. I never sell caller details or share them for marketing. Transcripts are kept for 30 days by default, then deleted, and you can ask for them to be deleted sooner. Details are in the privacy notice.' },
  { q: 'Will it work with my phone number?', a: 'Usually, yes. Most UK phone providers let you send calls on when you don’t answer. I check your setup in the free preview stage and tell you plainly before you pay anything.' },
  { q: 'What if I get lots of calls?', a: `${AFTER_HOURS.minutes} call minutes a month are included. If you regularly need more, I tell you and we agree a price first. You are never billed for extra minutes by surprise.` },
  { q: 'Does it answer in the day as well as after hours?', a: 'Yes, both, for the same price. In the day it only gets the calls you don’t pick up, so you still answer as normal when you can. When you’re closed it says so and takes a message.' },
  { q: 'Can I cancel?', a: `Yes. ${AFTER_HOURS.terms} Turn off call forwarding and your phone works as it did before.` },
];

/** What happens after the visitor asks for the free preview. */
export const NEXT = [
  { title: 'Tell me about your business', body: 'A few taps in the form. Your website helps.' },
  { title: 'Hear your demo', body: `I reply within ${CHECK_REPLY_TIME} to check your phone setup, then set up a demo answering as your business for you to hear.` },
  { title: 'Go live', body: 'I set your rules, you switch on “divert when unanswered” on your phone once, and we test it together.' },
  { title: 'Pay once it works', body: AFTER_HOURS.guarantee },
];

export const GUARANTEE_SHORT = STARTER_GUARANTEE.split('. ')[0];

export type Scenario = {
  id: string;
  label: string;
  time: string;
  lines: { who: 'caller' | 'desk'; text: string }[];
  summary: { title: string; rows: [string, string][]; flag?: string };
};

/** Example calls for the in-page demo. A made-up business, labelled as such. */
export const SCENARIOS: Scenario[] = [
  {
    id: 'booking',
    label: 'A new customer',
    time: '8:52pm',
    lines: [
      { who: 'desk', text: 'Good evening, Harbour Street Garage. We’re closed right now, but I can help or take a message. How can I help?' },
      { who: 'caller', text: 'Hi, do you do MOTs on a Saturday?' },
      { who: 'desk', text: 'Yes, Saturday mornings from 8 till 12. Would you like the team to call you to book one in?' },
      { who: 'caller', text: 'Please. It’s Sam, on 07700 900123.' },
      { who: 'desk', text: 'Thanks Sam, that’s 07700 900123. The team will call you after 8 tomorrow. Anything else?' },
    ],
    summary: { title: 'New enquiry: MOT booking', rows: [['Caller', 'Sam · 07700 900123'], ['Wants', 'Saturday MOT'], ['Answered', 'Saturday hours 8–12'], ['Next step', 'Call back after 8am']] },
  },
  {
    id: 'urgent',
    label: 'An urgent call',
    time: '10:17pm',
    lines: [
      { who: 'desk', text: 'Good evening, Harbour Street Garage. We’re closed right now. How can I help?' },
      { who: 'caller', text: 'My car’s broken down outside your yard and it’s blocking the road.' },
      { who: 'desk', text: 'Thanks for telling me. If anyone is in danger, please ring 999. I’ll pass this to the owner as urgent. Can I take your name and number?' },
      { who: 'caller', text: 'Priya, 07700 900456.' },
      { who: 'desk', text: 'Thanks Priya. I’ve sent your details to the owner as urgent.' },
    ],
    summary: { title: 'Urgent: breakdown at the yard', rows: [['Caller', 'Priya · 07700 900456'], ['Rule used', 'Breakdown on site → text owner'], ['Told caller', 'Ring 999 if in danger']], flag: 'Owner texted at 10:18pm' },
  },
  {
    id: 'unknown',
    label: 'A question it can’t answer',
    time: '7:05am',
    lines: [
      { who: 'desk', text: 'Good morning, Harbour Street Garage. We open at 8. How can I help?' },
      { who: 'caller', text: 'How much would a new clutch be for a 2015 Focus?' },
      { who: 'desk', text: 'I don’t have prices for that job, so I won’t guess. I can take your details and the team will call you with a proper quote.' },
      { who: 'caller', text: 'OK. Jo, 07700 900789.' },
      { who: 'desk', text: 'Thanks Jo. You’ll get a call after 8 today.' },
    ],
    summary: { title: 'Quote request: clutch', rows: [['Caller', 'Jo · 07700 900789'], ['Car', '2015 Ford Focus'], ['Answered', 'No price given, quote needed'], ['Next step', 'Call back after 8am']] },
  },
];
