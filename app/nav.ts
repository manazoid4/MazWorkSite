import { NICHE_GUIDES } from './for/niches';
import { CUSTOMER_TYPES } from './customer-types';
import { REFERRAL_RANGE } from './offers';

/**
 * One map of the site, used by the header menu, the footer and tests, so every
 * route an owner might want is reachable from every page in one or two taps.
 * Big-site pattern (Xero, ManyPets): a few visible top links, a grouped menu
 * behind a labelled "Menu" button on phones, and the same groups in the footer.
 */
export type NavLink = { href: string; label: string };

/** Shown in the header on desktop. Keep to four plus the free plan button. */
export const PRIMARY_NAV: NavLink[] = [
  { href: '/solutions', label: 'Solutions' },
  { href: '/prices', label: 'Prices' },
  { href: '/what-we-do', label: 'What we do' },
  { href: '/proof', label: 'Proof' },
];

/** Phone menu: short on purpose, one screen, no scrolling. The full map lives in the footer and /site-map. */
export const MENU_LINKS: NavLink[] = [
  { href: '/solutions', label: 'Solutions' },
  { href: '/b2b', label: 'For agencies and practices' },
  { href: '/prices', label: 'Packages and prices' },
  { href: '/what-we-do', label: 'What we do' },
  { href: '/proof', label: 'Proof' },
  { href: '/demos', label: 'Bigger build demos' },
  { href: '/for', label: 'Who it’s for' },
  { href: '/refer', label: 'Refer a business' },
  { href: '/faq', label: 'FAQ' },
  { href: '/site-map', label: 'Everything else' },
];

export const NAV_GROUPS: { title: string; links: NavLink[] }[] = [
  {
    title: 'What I do',
    links: [
      { href: '/solutions', label: 'Pick your problem' },
      { href: '/prices', label: 'Packages and prices' },
      { href: '/what-we-do', label: 'What we do' },
      { href: '/services', label: 'Jobs I set up' },
      { href: '/after-hours-receptionist', label: 'After-hours call answering' },
      { href: '/managed-presence', label: 'Managed presence' },
      { href: '/b2b', label: 'For agencies and practices' },
      { href: '/complaints', label: 'Complaints tracking' },
      { href: '/audit', label: 'Free automation audit' },
      { href: '/missed-calls-calculator', label: 'Missed-calls calculator' },
      { href: '/what-we-do#example', label: 'Example plan' },
      { href: '/free-plan?src=footer#leak-check-form', label: 'Get my free preview' },
      { href: '/contact', label: 'Bigger jobs' },
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
      { href: '/refer', label: `Refer a business (earn ${REFERRAL_RANGE})` },
      { href: '/faq', label: 'FAQ' },
      { href: '/work/scrap-finance-partners', label: 'Client work' },
      { href: '/terms', label: 'Terms of work' },
      { href: '/privacy', label: 'Privacy' },
      { href: '/site-map', label: 'Site map' },
    ],
  },
  {
    // Kept apart from the service on purpose (29 Sep rebuild): Objects is a
    // concept range and the Lab holds Maz's own products, so neither competes
    // with the one thing a small business can buy today.
    title: 'Lab / Physical products',
    links: [
      { href: '/video', label: 'Video and filming' },
      { href: '/3d-printing', label: 'Objects (concept range)' },
      { href: '/3d-printing#architecture-property', label: 'Architecture models' },
      { href: '/lab', label: 'Lab: my own products' },
    ],
  },
];

/** Homepage "On this page" jump bar, in page order. */
export const HOME_SECTIONS: NavLink[] = [
  { href: '#build', label: 'What I build' },
  { href: '#how', label: 'See it working' },
  { href: '#check', label: 'Get my free preview' },
  { href: '#about', label: 'About Maz' },
];
