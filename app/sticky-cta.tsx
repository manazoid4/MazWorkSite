'use client';

import { useEffect, useState } from 'react';
import { CHECK_REPLY_TIME, MAIN_CTA } from './site';

/**
 * Phone-only bar that keeps the free plan one tap away (Batch 3). It appears
 * once the hero has left the screen, and hides again while the form or the
 * footer is on screen so it never covers fields or links. Without JavaScript
 * it stays hidden: the page's own buttons do the job.
 */
export function StickyCheckCta({ href, hideWhenVisible }: { href: string; hideWhenVisible?: string }) {
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;
    const targets = [document.getElementById('main-content'), hideWhenVisible ? document.getElementById(hideWhenVisible) : null, document.querySelector('.mw-site-footer')]
      .filter((element): element is HTMLElement => Boolean(element));
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
  }, [hideWhenVisible]);

  return (
    <div className={`s-sticky${hidden ? ' s-sticky-hidden' : ''}`} aria-hidden={hidden || undefined}>
      <a className="button button-signal" href={href} tabIndex={hidden ? -1 : undefined}>{MAIN_CTA}</a>
      <span>Free · reply in {CHECK_REPLY_TIME}</span>
    </div>
  );
}
