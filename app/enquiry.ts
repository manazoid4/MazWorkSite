import { VIDEO_PRICES, formatPrice, AFTER_HOURS, MANAGED_PRESENCE, OFFERS, CARE_PLANS, getExtra, getOffer } from './offers';
import { CONTACT_EMAIL, FORM_DELIVERY_EMAIL } from './site';

export const FORM_ENDPOINT = `https://formsubmit.co/ajax/${FORM_DELIVERY_EMAIL}`;
export const NATIVE_FORM_ENDPOINT = `https://formsubmit.co/${FORM_DELIVERY_EMAIL}`;

/** Default time before a hung submission is abandoned so the button never sticks on "Sending…". */
export const SUBMIT_TIMEOUT_MS = 15000;

/**
 * Service context for an enquiry. `id` is what a CTA passes in `?service=`,
 * `label` is what the visitor sees and what arrives in the email.
 */
export const ENQUIRY_SERVICES = [
  // Ids are stable deep-link keys (old outreach links use them); labels follow app/offers.ts.
  { id: 'repair', label: `Starter Automation (${OFFERS[0].price})` },
  { id: 'automation', label: `Business System (${OFFERS[1].price.toLowerCase()})` },
  { id: 'software', label: `Custom software or internal tool (${OFFERS[2].price.toLowerCase()})` },
  { id: 'website', label: `Website with enquiries built in (${getOffer('website').price.toLowerCase()})` },
  { id: 'creator-starter', label: `Starter for creators: keyword DM, free resource, email list (${getOffer('creator-starter').price})` },
  { id: 'sales-page', label: `Launch Page: one page that books, sells or takes enquiries (${getOffer('creator-launch').price})` },
  { id: 'brand-sales-page', label: `Launch Page: one page that books, sells or takes enquiries (${getOffer('creator-launch').price})` },
  { id: 'reviews', label: `Review requests and customer reminders (${OFFERS[0].name} ${OFFERS[0].price})` },
  { id: 'after-hours', label: `${AFTER_HOURS.name}: calls answered when you can’t pick up (${AFTER_HOURS.price})` },
  { id: 'managed-presence', label: `${MANAGED_PRESENCE.name}: website, Google and social updates (${MANAGED_PRESENCE.price.toLowerCase()})` },
  { id: 'care', label: `Care plans (${CARE_PLANS[0].price} or ${CARE_PLANS[1].price})` },
  { id: 'complaints', label: 'Complaints and customer experience improvement (quoted to scope)' },
  { id: 'reporting', label: 'Dashboards, KPI reporting and SLA oversight (quoted to scope)' },
  { id: 'rebuild', label: 'Rebuild of an existing site or system' },
  { id: 'google-profile', label: `Google listing tidy (small set-up, free with a Starter ${getOffer('starter').price})` },
  { id: 'bundle', label: 'Starter plus optional extras' },
  { id: 'objects', label: 'Tap-to-review stands and signs' },
  { id: 'brand-kit', label: `Starter for creators: keyword DM, free resource, email list (${getOffer('creator-starter').price})` },
  { id: 'video', label: `Video and filming: shoots from ${formatPrice(VIDEO_PRICES.halfDay)}, edits ${formatPrice(VIDEO_PRICES.editBundle)}` },
  { id: 'portfolio-project', label: 'Apply for a Portfolio Project (limited places, chosen at my discretion)' },
  { id: 'unsure', label: 'Not sure yet, help me work it out' },
] as const;

export type EnquiryServiceId = (typeof ENQUIRY_SERVICES)[number]['id'];

export const DEFAULT_SERVICE_ID: EnquiryServiceId = 'unsure';

/** Next step the visitor actually wants. */
export const ENQUIRY_NEXT_STEPS = [
  'A fixed quote for a specific job',
  'A free preview and fixed price',
  'A 15-minute call',
  'Just answer my question first',
] as const;

export const DEFAULT_NEXT_STEP = ENQUIRY_NEXT_STEPS[0];

/**
 * Reads `?service=` from the current URL. Used from an effect rather than
 * `useSearchParams` so the static export keeps prerendering these pages.
 */
export function readServiceFromLocation(): EnquiryServiceId | null {
  if (typeof window === 'undefined') return null;
  const requested = new URLSearchParams(window.location.search).get('service');
  if (!requested) return null;
  const match = ENQUIRY_SERVICES.find((service) => service.id === requested.toLowerCase());
  return match ? match.id : null;
}

export type EnquiryResult = { ok: true; confirmationSent?: boolean } | { ok: false; reason: 'rejected' | 'timeout' | 'network'; status?: number };

/** Posts the enquiry and normalises FormSubmit's `success: "false"` body into a real failure. */
export async function sendEnquiry(payload: Record<string, string>, timeoutMs = SUBMIT_TIMEOUT_MS): Promise<EnquiryResult> {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(FORM_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    const body = await response.json().catch(() => null) as { success?: boolean | string } | null;

    // The timer can fire after a successful status but while the body is still being
    // read. That rejection is swallowed above, so check the signal rather than treat an
    // unread body as delivered — FormSubmit reports rejections in the body, not the status.
    if (controller.signal.aborted) return { ok: false, reason: 'timeout' };

    const confirmed = body?.success === true || body?.success === 'true';
    if (!response.ok || !confirmed) return { ok: false, reason: 'rejected' };
    return { ok: true };
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') return { ok: false, reason: 'timeout' };
    return { ok: false, reason: 'network' };
  } finally {
    window.clearTimeout(timer);
  }
}

/**
 * Builds a mailto link carrying everything the visitor typed, so a failed
 * submission is still a recoverable enquiry rather than a lost one.
 */
export function buildRecoveryMailto(subject: string, fields: Array<[string, string]>): string {
  const body = fields
    .filter(([, value]) => value.trim().length > 0)
    .map(([label, value]) => `${label}: ${value}`)
    .join('\n');
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/**
 * Must exceed vercel.json maxDuration (30s) for api/enquiry.js, whose worst case is ~18s (see api/enquiry.js).
 * If this fired first, the FormSubmit fallback would send a second copy after the owner mail already went.
 */
export const API_TIMEOUT_MS = 35000;

/** Transactional first; native/AJAX FormSubmit remains the independently usable fallback. */
export async function sendPlanEnquiry(payload: Record<string, string>): Promise<EnquiryResult> {
  try {
    const response = await fetch('/api/enquiry', { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(payload), signal: AbortSignal.timeout(API_TIMEOUT_MS) });
    const result = await response.json();
    if (response.ok && result.ok === true) return { ok: true, confirmationSent: result.confirmationSent === true };
    // Validation and abuse rejections must not bypass the server via fallback.
    if (response.status === 400 || response.status === 413 || response.status === 429) return {ok:false,reason:'rejected',status:response.status};
  } catch { /* A static host, unavailable function or network timeout can use the existing transport. */ }
  return sendEnquiry(payload);
}
