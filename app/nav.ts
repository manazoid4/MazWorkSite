import { NICHE_GUIDES } from './for/niches';
import { CUSTOMER_TYPES } from './customer-types';

/**
 * One map of the site, used by the header menu, the footer and tests, so every
 * route an owner might want is reachable from every page in one or two taps.
 * Big-site pattern (Xero, ManyPets): a few visible top links, a grouped menu
 * behind a labelled "Menu" button on phones, and the same groups in the footer.
 */
export type NavLink = { href: string; label: string };

/** Shown in the header on desktop. Seven links plus the "Free preview" button. */
export const PRIMARY_NAV: NavLink[] = [
  { href: '/what-we-do', label: 'What I do' },
  { href: '/local-businesses', label: 'Local businesses' },
  { href: '/professional-teams', label: 'Professional teams' },
  { href: '/prices', label: 'Prices' },
  { href: '/proof', label: 'Proof' },
  { href: '/free-templates', label: 'Free templates' },
  { href: '/contact', label: 'Contact' },
];

/** The one primary header button. */
export const NAV_CTA: NavLink = { href: '/contact', label: 'Free preview' };

/** Phone menu: short on purpose, one screen, no scrolling. The full map lives in the footer and /site-map. */
export const MENU_LINKS: NavLink[] = [
  ...PRIMARY_NAV,
  { href: '/for', label: 'Who it’s for' },
  { href: '/faq', label: 'FAQ' },
  { href: '/site-map', label: 'Everything else' },
];

export const NAV_GROUPS: { title: string; links: NavLink[] }[] = [
  {
    title: 'What I do',
    links: [
      { href: '/what-we-do', label: 'What I do' },
      { href: '/prices', label: 'Packages and prices' },
      { href: '/local-businesses', label: 'Local businesses' },
      { href: '/professional-teams', label: 'Professional teams' },
      { href: '/after-hours-receptionist', label: 'After-hours call answering' },
      { href: '/for#problems', label: 'Pick your problem' },
      { href: '/for#jobs', label: 'Jobs I set up' },
      { href: '/what-we-do#why', label: 'How I work' },
      { href: '/contact', label: 'Free preview and bigger jobs' },
    ],
  },
  {
    title: 'Who it’s for',
    links: [
      ...CUSTOMER_TYPES.map((type) => ({ href: `/for/${type.id}`, label: type.name })),
      ...NICHE_GUIDES.map((guide) => ({ href: `/for/${guide.id}`, label: guide.shortName })),
      { href: '/for', label: 'All kinds of business' },
    ],
  },
  {
    title: 'Help',
    links: [
      { href: '/proof', label: 'Proof and client work' },
      { href: '/about', label: 'About' },
      { href: '/faq', label: 'FAQ' },
      { href: '/free-templates', label: 'Free templates' },
      { href: '/terms', label: 'Terms of work' },
      { href: '/privacy', label: 'Privacy' },
      { href: '/site-map', label: 'Site map' },
    ],
  },
  {
    // Objects stays a concept range, kept apart from the one thing a small business can buy today.
    title: 'Physical products',
    links: [
      { href: '/3d-printing', label: 'Objects (concept range)' },
      { href: '/3d-printing#architecture-property', label: 'Architecture models' },
    ],
  },
];

/** Homepage "On this page" jump bar, in page order. */
export const HOME_SECTIONS: NavLink[] = [
  { href: '#customer-buckets', label: 'What I do' },
  { href: '#doors-title', label: 'Who I help' },
  { href: '#proof-title', label: 'Work you can see' },
  { href: '#about-title', label: 'About Maz' },
];
