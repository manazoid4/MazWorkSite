/** Outreach tags from docs/maz-works/OUTREACH-TEMPLATES.md and the LinkedIn series: li-3, em-trades, call-offices, fu-2, dm-creators. */
const OUTREACH_TAG = /^(li|em|call|fu|dm)-[a-z0-9]{1,16}$/;

const LINKEDIN_SOURCES = ['linkedin', 'linkedin-profile', 'linkedin-featured', 'linkedin-post', 'linkedin-company'];

/** True for a public campaign label (LinkedIn or outreach tag); never arbitrary query data. */
export function isCampaignTag(source: string | null | undefined): source is string {
  return !!source && (LINKEDIN_SOURCES.includes(source) || OUTREACH_TAG.test(source));
}

// Actual public CTA sources (including generated links in type pages, services,
// scene-player, the calculator and case studies). Do not accept arbitrary suffixes.
const INTERNAL_SOURCES = new Set([
  'site', 'nav', 'footer', 'contact', 'brand-kit', 'for-hub', 'prices', 'prices-hero',
  'builder', 'estimator', 'example-plan', 'scope-sheet', 'services', 'demos',
  'after-hours', 'voice-demo', 'whats-new',
  ...['trades', 'appointments', 'creators', 'offices', 'heating-and-plumbing', 'roofers',
    'builders', 'electricians', 'salons-and-beauty', 'dog-groomers', 'garages',
    'cafes-and-food', 'clinics-and-therapists', 'architects'].map(id => `for-${id}`),
  ...['trades', 'appointments', 'creators', 'offices', 'other'].map(id => `estimator-${id}`),
  ...['missed-calls', 'enquiries', 'reminders', 'reviews', 'quotes', 'booking', 'rebooking',
    'weekly', 'keyword-dm'].map(id => `scene-${id}`),
  ...['missed-call', 'quote-follow-up', 'payment-reminders', 'reviews', 'job-updates',
    'weekly-report', 'online-booking', 'reminders', 'rebooking', 'waitlist', 'dm-replies',
    'keyword-dm', 'email-list', 'one-list', 'onboarding', 'milestones'].map(id => `service-${id}`),
  ...['jobfilter', 'scrap-finance-partners', 'agent-nudge', 'openflowkit', 'khutba-io', 'maz-pocket'].map(id => `case-${id}`),
]);

export function isEnquirySource(source: string | null | undefined): source is string {
  return !!source && (isCampaignTag(source) || INTERNAL_SOURCES.has(source));
}

/** Also accepts the existing first-touch → current-source format, never raw query data. */
export function cleanEnquirySource(value: unknown): string {
  if (typeof value !== 'string') return '';
  const parts = value.split(' → ');
  const valid = (part: string) => isEnquirySource(part) || /^direct \((homepage|free-plan|contact|brand-kit|3d-printing)\)$/.test(part);
  if (parts.length === 1) return valid(parts[0]) ? value : '';
  return parts.length === 2 && isCampaignTag(parts[0]) && valid(parts[1]) ? value : '';
}

const CAMPAIGN_KEY = 'mw-campaign';

/** Remember the campaign a visitor landed with, for this tab only. Storage can be blocked, so never throw. */
export function rememberCampaign(search: string): void {
  const source = new URLSearchParams(search).get('src');
  if (!isCampaignTag(source)) return;
  // First touch wins: keep the tag that brought them, even if they open a second campaign link.
  try { if (!isCampaignTag(sessionStorage.getItem(CAMPAIGN_KEY))) sessionStorage.setItem(CAMPAIGN_KEY, source); } catch { /* storage blocked */ }
}

/** The campaign remembered on landing, if any. */
export function rememberedCampaign(): string {
  try { const value = sessionStorage.getItem(CAMPAIGN_KEY); return isCampaignTag(value) ? value : ''; } catch { return ''; }
}

/** Preserve only the public campaign labels; never copy arbitrary query data. */
export function linkedInHref(href: string, search: string): string {
  const source = new URLSearchParams(search).get('src');
  if (!isCampaignTag(source)) return href;
  const base = 'https://www.mazworks.uk';
  const url = new URL(href, base);
  if (url.origin === base && ['/free-plan', '/brand-kit'].includes(url.pathname)) {
    url.searchParams.set('src', source);
    return `${url.pathname}${url.search}${url.hash}`;
  }
  if (url.origin === 'https://cal.com' && url.pathname === '/mazworks/quick-chat') {
    url.searchParams.set('utm_source', source);
    return url.href;
  }
  return href;
}
