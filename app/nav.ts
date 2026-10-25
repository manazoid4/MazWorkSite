import { NICHE_GUIDES } from './for/niches';
import { CUSTOMER_TYPES } from './customer-types';

/**
 * One map of the site, used by the header menu, the footer and tests, so every
 * route an owner might want is reachable in one or two taps.
 * Six links in the header, one button, and a short menu on phones. Everything
 * else (kinds of business, trades, FAQ, free membership, legal) is grouped in
 * NAV_GROUPS and on /site-map, and linked from the page that explains it.
 */
export type NavLink = { href: string; label: string };

/** Shown in the header on desktop: six links plus the one button. */
export const PRIMARY_NAV: NavLink[] = [
  { href: '/what-we-do', label: 'What I do' },
  { href: '/proof', label: 'My work' },
  { href: '/prices', label: 'Prices' },
  { href: '/tools', label: 'Tools and demos' },
  { href: '/about', label: 'About' },
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

/** Footer: one row. */
export const FOOTER_LINKS: NavLink[] = [
  ...PRIMARY_NAV,
  { href: '/faq', label: 'FAQ' },
  { href: '/privacy', label: 'Privacy' },
  { href: '/terms', label: 'Terms' },
];

export const NAV_GROUPS: { title: string; links: NavLink[] }[] = [
  {
    title: 'What I do',
    links: [
      { href: '/what-we-do', label: 'What I do' },
      { href: '/prices', label: 'Prices' },
      { href: '/local-businesses', label: 'For local businesses' },
      { href: '/website-design', label: 'Website design · Derbyshire & Nottingham' },
      { href: '/professional-teams', label: 'For professional teams' },
      { href: '/after-hours-receptionist', label: 'After-Hours Receptionist' },
      { href: '/for#problems', label: 'Pick your problem' },
      { href: '/for#jobs', label: 'Jobs I set up' },
      { href: '/what-we-do#why', label: 'How I work' },
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
    title: 'My work and tools',
    links: [
      { href: '/proof', label: 'My work' },
      { href: '/tools', label: 'Tools and demos' },
      { href: '/tools/restaurant-tables', label: 'Restaurant table picker (concept demo)' },
    ],
  },
  {
    title: 'Help',
    links: [
      { href: '/about', label: 'About' },
      { href: '/contact', label: 'Contact' },
      { href: '/faq', label: 'FAQ' },
      { href: '/free-membership', label: 'Free membership' },
      { href: '/terms', label: 'Terms of work' },
      { href: '/privacy', label: 'Privacy' },
      { href: '/site-map', label: 'Site map' },
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
