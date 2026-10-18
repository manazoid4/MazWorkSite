import { CUSTOMER_TYPES } from './customer-types';
import { NICHE_GUIDES } from './for/niches';
import { AFTER_HOURS, ALL_OFFERS, CREATOR_EXTRAS, EXTRAS } from './offers';
import { HEADACHE_PICKS, SYSTEMS } from './systems';
import { isCampaignTag, isEnquirySource } from './linkedin-source';

export const TRADE_CHOICES = [...CUSTOMER_TYPES, ...NICHE_GUIDES].map(item => ({ id: item.id, label: item.shortName }));
export const KNOWN_PACKAGES = [...new Set([...ALL_OFFERS, ...EXTRAS, ...CREATOR_EXTRAS, AFTER_HOURS].map(item => item.name))];
export const TRADE_PROBLEMS = [
  { id: 'missed-call', label: 'Missed calls', job: 'missed-call' },
  { id: 'quote-follow-up', label: 'Chasing quotes', job: 'quote-follow-up' },
  { id: 'booking', label: 'Making bookings easier', job: 'online-booking' },
  { id: 'reminder', label: 'Appointment reminders', job: 'reminders' },
  { id: 'lead-capture', label: 'Keeping enquiries in one place', job: 'one-list' },
  { id: 'onboarding', label: 'Customer paperwork and onboarding', job: 'onboarding' },
] as const;

export type TradeContext = { trade: string; problem: string; proof: string; package: string; sourcePage: string };
const isTrade = (value: string) => TRADE_CHOICES.some(item => item.id === value);
const formTrade = (value: string) => isTrade(value) || ['creator', 'other'].includes(value);

/** Relevant starting points, rather than an assumption about the visitor's job. */
export function problemsForTrade(trade: string) {
  const type = CUSTOMER_TYPES.find(item => item.id === trade || item.niches.includes(trade));
  const ids = type?.id === 'trades' ? ['missed-call', 'quote-follow-up', 'booking', 'lead-capture']
    : type?.id === 'appointments' || trade === 'cafes-and-food' ? ['missed-call', 'booking', 'reminder', 'lead-capture']
    : type?.id === 'creators' || trade === 'creator' ? ['booking', 'lead-capture', 'onboarding']
    : type?.id === 'offices' ? ['quote-follow-up', 'booking', 'lead-capture', 'onboarding']
    : TRADE_PROBLEMS.map(item => item.id);
  return TRADE_PROBLEMS.filter(item => ids.includes(item.id));
}

export function tradeLabel(trade: string): string {
  return TRADE_CHOICES.find(item => item.id === trade)?.label || (trade === 'creator' ? 'Creators' : trade === 'other' ? 'Something else' : 'Not specified');
}

export function cleanSourcePage(value: string): string {
  return TRADE_CHOICES.some(item => value === `/for/${item.id}`) ? value : '';
}

export function readTradeContext(search: string): TradeContext {
  const params = new URLSearchParams(search);
  const requested = params.get('trade') || '';
  const trade = formTrade(requested) ? requested : '';
  const problem = params.get('problem') || '';
  const proof = params.get('proof') || '';
  const pkg = params.get('package') || '';
  const src = params.get('src') || '';
  return {
    trade,
    problem: trade && problemsForTrade(trade).some(item => item.id === problem) ? problem : '',
    proof: isTrade(trade) && proof === trade ? proof : '',
    package: KNOWN_PACKAGES.includes(pkg) ? pkg : '',
    // A declared origin must stand on its own; campaign attribution never supplies it.
    sourcePage: params.has('from') ? cleanSourcePage(params.get('from') || '') : src.startsWith('for-') ? cleanSourcePage(`/for/${src.slice(4)}`) : '',
  };
}

/** Public contract used by trade CTAs. No package is inferred from a demo. */
export function buildTradeEnquiryHref(trade: string, options: { problem?: string; proof?: string; package?: string } = {}): string {
  if (!isTrade(trade)) return '/free-plan#leak-check-form';
  const params = new URLSearchParams({ src: `for-${trade}`, trade, from: `/for/${trade}` });
  if (options.problem && problemsForTrade(trade).some(item => item.id === options.problem)) params.set('problem', options.problem);
  const proof = options.proof;
  if (proof === trade) params.set('proof', proof);
  if (options.package && KNOWN_PACKAGES.includes(options.package)) params.set('package', options.package);
  return `/free-plan?${params}#leak-check-form`;
}

export function changeTrade(context: TradeContext, trade: string): TradeContext {
  const next = formTrade(trade) ? trade : '';
  return next === context.trade ? context : { ...context, trade: next, proof: '', problem: '', package: '' };
}

/** Keep existing builder context, but never propagate names, addresses or arbitrary parameters. */
export function contextSearch(search: string, context: TradeContext): string {
  const original = new URLSearchParams(search);
  const params = new URLSearchParams();
  const src = original.get('src');
  if (isEnquirySource(src)) params.set('src', src);
  for (const [key, value] of [['trade', context.trade], ['problem', context.problem], ['proof', context.proof], ['package', context.package], ['from', context.sourcePage]]) {
    if (value) params.set(key, value);
  }
  const systems = (original.get('systems') || '').split(',').filter(id => SYSTEMS.some(item => item.id === id));
  if (systems.length) params.set('systems', [...new Set(systems)].join(','));
  for (const id of original.getAll('headache')) if (HEADACHE_PICKS.some(item => item.id === id)) params.append('headache', id);
  return params.toString();
}

/** Fallback is the page the form lives on, so a plain homepage submit is not logged as /free-plan. */
export function enquirySource(search: string, remembered: string, fallback = 'free-plan'): string {
  const value = new URLSearchParams(search).get('src');
  const current = isEnquirySource(value) ? value : `direct (${fallback})`;
  return isCampaignTag(remembered) && remembered !== current ? `${remembered} → ${current}` : current;
}

export function safeEnquiryPageUrl(href: string): string {
  const url = new URL(href);
  url.search = contextSearch(url.search, readTradeContext(url.search));
  url.hash = '';
  return url.href;
}

export function tradeContextFields(context: TradeContext): Array<[string, string]> {
  return [
    ['Industry', tradeLabel(context.trade)],
    ['Demo viewed', context.proof ? `${tradeLabel(context.proof)} (illustrative demo, not client results)` : 'Not specified'],
    ['Problem focus', TRADE_PROBLEMS.find(item => item.id === context.problem)?.label || 'Not selected'],
    ['Package preference', context.package ? `${context.package} (explicit interest, not an order)` : 'Not chosen — help me decide'],
    ['Source page', context.sourcePage],
    ['Request', 'Free demo and fixed price; no order or obligation'],
  ];
}
