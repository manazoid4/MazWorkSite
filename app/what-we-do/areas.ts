import { AFTER_HOURS, OFFERS, getOffer } from '../offers';

/**
 * The four kinds of work, in plain words (reimagination, 25 Oct 2026).
 * Every price is read from app/offers.ts; nothing here types a number.
 * The home page may import this so the two pages cannot disagree.
 */
export type ServiceArea = {
  id: string;
  letter: 'A' | 'B' | 'C' | 'D';
  title: string;
  problem: string;
  what: string;
  examples: string[];
  priceLine: string;
  links: { href: string; label: string }[];
};

const launch = getOffer('creator-launch');
const website = getOffer('website');
const [starter, system, custom] = OFFERS;

export const SERVICE_AREAS: ServiceArea[] = [
  {
    id: 'websites',
    letter: 'A',
    title: 'A website that does its job',
    problem: 'People find you, cannot tell what you do, and leave.',
    what: 'One clear page or a small site that says what you do and makes it easy to enquire, book or buy. I can also tidy your Google listing.',
    examples: ['A single page to book, buy or enquire', 'A five-page site with enquiries going to one list', 'Your Google listing kept right'],
    priceLine: `${launch.name} ${launch.price}. ${website.name} ${website.price.toLowerCase()}.`,
    links: [{ href: '/prices#websites', label: 'Website prices' }, { href: '/local-businesses#find-customers', label: 'More on websites' }],
  },
  {
    id: 'enquiries',
    letter: 'B',
    title: 'Enquiries answered and followed up',
    problem: 'A missed call, a quote nobody chased, a review you forgot to ask for.',
    what: 'I set up the follow-up so it happens without you remembering. Missed callers get a text. Quotes get a polite nudge. Happy customers get asked for a review.',
    examples: ['Missed-call text-back', 'Quote follow-up and payment reminders', 'Review requests after a job', 'Calls answered when you cannot pick up'],
    priceLine: `${starter.name} ${starter.price} for one job. ${AFTER_HOURS.name} ${AFTER_HOURS.price}.`,
    links: [{ href: '/local-businesses#serve-customers', label: 'The jobs I set up most' }, { href: AFTER_HOURS.href, label: 'Call answering' }],
  },
  {
    id: 'booking',
    letter: 'C',
    title: 'Bookings and everyday running',
    problem: 'Appointments by text, jobs in someone’s head, and no clear view of what is overdue.',
    what: 'Online booking and reminders for a small business. For a team, one place to see who owns what, what is due and what keeps going wrong, including complaints reporting.',
    examples: ['Online booking and reminders', 'Three jobs joined up with a weekly report', 'Deadline and workload views for a team', 'Complaints reporting and improvement actions'],
    priceLine: `${system.name} ${system.price.toLowerCase()}. Team reporting is quoted to scope.`,
    links: [{ href: '/local-businesses', label: 'For local businesses' }, { href: '/professional-teams', label: 'For professional teams' }],
  },
  {
    id: 'custom-tools',
    letter: 'D',
    title: 'A small tool built for one job',
    problem: 'Off-the-shelf apps do almost what you need, but not quite.',
    what: 'When nothing you can buy fits, I build one focused tool for one job and hand it over. You own it.',
    examples: ['A customer login to see bookings or jobs', 'A staff tool that replaces a spreadsheet', 'Photo to quote: take photos of a job and get a draft quote to check and send'],
    priceLine: `${custom.name} ${custom.price.toLowerCase()}, agreed in a written spec first.`,
    links: [{ href: '/tools', label: 'Tools and demos' }, { href: '/contact?service=software#contact', label: 'Describe your job' }],
  },
];
