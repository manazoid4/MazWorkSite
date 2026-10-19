'use client';

import { track } from '@vercel/analytics';
import { useEffect, useRef, type ReactNode } from 'react';
import { rememberedAttribution, rememberAttribution, rememberCampaign } from './linkedin-source';

/**
 * Conversion events for Vercel Web Analytics. Custom events only show in the
 * dashboard on a paid Vercel plan; on Hobby the calls are harmless no-ops, so
 * the site is ready the day the plan changes.
 */
export type ConversionEvent = 'Check submitted' | 'Enquiry sent' | 'Call clicked' | 'Pricing viewed' | 'CTA clicked' | 'Form started' | 'Form submitted' | 'Confirmation sent' | 'What-we-do section viewed' | 'Campaign visit' | 'Assessment started' | 'Assessment completed' | 'Assessment submitted' | 'Booking opened';

export function trackConversion(name: ConversionEvent, data?: Record<string, string>) {
  try {
    track(name, data);
  } catch {
    // Analytics must never break a form or a link.
  }
}

/** Outbound link to the 15-minute call that records where it was clicked. */
export function CallLink({ href, placement, className, children }: { href: string; placement: string; className?: string; children: ReactNode }) {
  return (
    <a className={className} href={href} target="_blank" rel="noreferrer" onClick={() => trackConversion('Call clicked', { placement })}>
      {children}
    </a>
  );
}

/** Fires one "Pricing viewed" event the first time the wrapped section is half on screen. */
export function PricingViewTracker({ targetId }: { targetId: string }) {
  const sent = useRef(false);
  useEffect(() => {
    const target = document.getElementById(targetId);
    if (!target || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver((entries) => {
      if (sent.current || !entries.some((entry) => entry.isIntersecting)) return;
      sent.current = true;
      trackConversion('Pricing viewed', { page: window.location.pathname });
      observer.disconnect();
    }, { threshold: 0.35 });
    observer.observe(target);
    return () => observer.disconnect();
  }, [targetId]);
  return null;
}

export function ConversionTracker() {
 useEffect(() => {
  rememberCampaign(location.search);
  rememberAttribution(location.search, document.referrer);
  // A LinkedIn post should be visible as a campaign visit, not only as a pageview.
  // One event per tab: later pages the visitor opens should not inflate the count.
  const attribution = rememberedAttribution();
  if (attribution) {
    try { if (!sessionStorage.getItem('mw-campaign-visit')) { sessionStorage.setItem('mw-campaign-visit', '1'); trackConversion('Campaign visit', { attribution, page: location.pathname }); } }
    catch { trackConversion('Campaign visit', { attribution, page: location.pathname }); }
  }
  const click = (event: MouseEvent) => { const link = (event.target as Element).closest?.('a'); if (!link) return;
   const href = link.getAttribute('href') || '';
   if (href.includes('/free-plan') || href.includes('/b2b/assessment') || href === '#check' || href === '#assessment') trackConversion('CTA clicked', {placement: link.closest('section')?.id || 'navigation',page:location.pathname,attribution:rememberedAttribution()});
  };
  document.addEventListener('click', click);
  const observer = new IntersectionObserver(entries => { for (const entry of entries) if (entry.isIntersecting) {trackConversion('What-we-do section viewed',{section:entry.target.id});observer.unobserve(entry.target);} },{threshold:0.1});
  if (location.pathname === '/what-we-do') document.querySelectorAll('section[id]').forEach(section => observer.observe(section));
  return () => {document.removeEventListener('click',click);observer.disconnect();};
 }, []);
 return null;
}
