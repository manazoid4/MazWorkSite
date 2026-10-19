import { BOOKING_URL } from './site';

/**
 * The Cal.com link carries the same campaign labels the visitor arrived with.
 * Attribution is the safe line built by `attributionLine` (source, medium,
 * campaign, content), so only those four labels can ever reach the booking.
 */
const UTM: Record<string, string> = {
  source: 'utm_source',
  medium: 'utm_medium',
  campaign: 'utm_campaign',
  content: 'utm_content',
};
const SAFE_VALUE = /^[a-z0-9][a-z0-9._-]{0,39}$/i;

export function bookingUrl(page: string, interest: string, attribution: string, campaign: string): string {
  const url = new URL(BOOKING_URL);
  const labels = new Map<string, string>();
  const kept: string[] = [];
  for (const part of attribution.split('; ')) {
    const [key, ...rest] = part.split('=');
    const value = rest.join('=');
    if (UTM[key] && SAFE_VALUE.test(value)) {
      labels.set(key, value);
      kept.push(`${key}=${value}`);
    } else if (key === 'referrer' && value === 'linkedin') {
      kept.push('referrer=linkedin');
    }
  }

  const notes = [`From ${page}`, interest && `Interested in: ${interest}`, kept.length && `Campaign: ${kept.join('; ')}`].filter(Boolean).join('. ');
  url.searchParams.set('notes', notes.slice(0, 300));

  // The first-touch UTM source wins; an internal campaign tag is the fallback.
  const source = labels.get('source') || campaign;
  if (source) url.searchParams.set('utm_source', source);
  for (const key of ['medium', 'campaign', 'content']) {
    const value = labels.get(key);
    if (value) url.searchParams.set(UTM[key], value);
  }
  return url.href;
}
