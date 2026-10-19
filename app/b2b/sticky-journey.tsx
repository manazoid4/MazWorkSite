'use client';

import { useEffect, useState } from 'react';
import { CampaignLink } from '../campaign-link';
import { BookCall } from '../booking-modal';

/**
 * Phone-only bar for the two B2B actions. It appears after the hero and hides
 * while the final CTA or footer is on screen, so it never covers a form or the
 * last chance to choose.
 */
export function StickyJourney() {
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;
    const targets = [
      document.getElementById('main-content'),
      document.getElementById('b2b-final'),
      document.querySelector('.mw-site-footer'),
    ].filter((element): element is HTMLElement => Boolean(element));
    const onScreen = new Set<Element>();
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) onScreen.add(entry.target);
        else onScreen.delete(entry.target);
      }
      setHidden(onScreen.size > 0);
    }, { threshold: 0.05 });
    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, []);

  return (
    <div className={`b2b-sticky${hidden ? ' is-hidden' : ''}`} aria-hidden={hidden || undefined}>
      <CampaignLink className="button button-signal" href="/b2b/assessment?src=b2b-assessment">Free assessment</CampaignLink>
      <BookCall className="button" interest="Business systems">15-minute call</BookCall>
    </div>
  );
}
