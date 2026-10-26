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
  'after-hours', 'voice-demo',
  ...['website-design', 'one-page-website', 'missed-call-text-back', 'website-cost'].flatMap(id => [id, `${id}-bottom`]), 'whats-new', 'b2b', 'b2b-assessment', 'audit', 'complaints', 'proof',
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
  const valid = (part: string) => isEnquirySource(part) || /^direct \((homepage|free-plan|contact|brand-kit|3d-printing|b2b-assessment)\)$/.test(part);
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
  if (url.origin === base && ['/free-plan', '/brand-kit', '/audit', '/complaints', '/b2b', '/b2b/assessment', '/professional-teams', '/contact'].includes(url.pathname)) {
    url.searchParams.set('src', source);
    return `${url.pathname}${url.search}${url.hash}`;
  }
  if (url.origin === 'https://cal.com' && url.pathname === '/mazworks/quick-chat') {
    url.searchParams.set('utm_source', source);
    return url.href;
  }
  return href;
}

const ATTRIBUTION_KEY = 'mw-attribution';
const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content'] as const;
const UTM_VALUE = /^[a-z0-9][a-z0-9._-]{0,39}$/i;

/** One short line of campaign labels (UTM values and a LinkedIn referrer), or '' when there is nothing safe to keep. */
export function attributionLine(search: string, referrer: string): string {
  const params = new URLSearchParams(search);
  const parts = UTM_KEYS.flatMap((key) => { const value = params.get(key) || ''; return UTM_VALUE.test(value) ? [`${key.slice(4)}=${value}`] : []; });
  let host = '';
  try { host = new URL(referrer).hostname.replace(/^www\./, ''); } catch { /* no referrer */ }
  if (host === 'linkedin.com' || host === 'lnkd.in' || host.endsWith('.linkedin.com')) parts.push('referrer=linkedin');
  // Organic search has no UTM tags, so record the engine's domain to tell Google enquiries from direct visits.
  else if (/^(google|bing|duckduckgo|ecosia|yahoo)\.[a-z.]{2,6}$/.test(host)) parts.push('referrer=organic-search');
  return parts.join('; ');
}

/** First touch wins, for this tab only. Storage can be blocked, so never throw. */
export function rememberAttribution(search: string, referrer: string): void {
  const line = attributionLine(search, referrer);
  if (!line) return;
  try { if (!sessionStorage.getItem(ATTRIBUTION_KEY)) sessionStorage.setItem(ATTRIBUTION_KEY, line); } catch { /* storage blocked */ }
}

export function rememberedAttribution(): string {
  try { const value = sessionStorage.getItem(ATTRIBUTION_KEY) || ''; return /^[a-z0-9=._; -]{0,200}$/i.test(value) ? value : ''; } catch { return ''; }
}
