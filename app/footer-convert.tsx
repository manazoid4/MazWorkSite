'use client';

import { useEffect, useState } from 'react';
import { NewsletterSignup } from './newsletter-signup';
import { MAIN_CTA } from './site';
import { TRADES, TRADE_STORAGE_KEY, getTrade, type TradeKey } from './trades';

/**
 * The last thing every visitor scrolls past, so it asks one question ("which one
 * are you?") and then shows only their world: their line, their example video,
 * a tagged demo link and the mailing list. The pick is remembered on this device.
 */
export function FooterConvert() {
  // 'other': every UK small business can answer, not just the five trades (AGENTS.md audience rule).
  const [key, setKey] = useState<TradeKey | 'other' | null>(null);

  useEffect(() => {
    const read = () => {
      try { const v = localStorage.getItem(TRADE_STORAGE_KEY); setKey(v === 'other' ? 'other' : getTrade(v)?.key ?? null); } catch { /* storage blocked: stay generic */ }
    };
    read();
    window.addEventListener('mw-trade', read);
    return () => window.removeEventListener('mw-trade', read);
  }, []);

  function pick(next: TradeKey | 'other') {
    setKey(next);
    try { localStorage.setItem(TRADE_STORAGE_KEY, next); } catch { /* still works for this page */ }
  }

  const trade = getTrade(key);
  const demoHref = trade ? `/free-plan?src=footer-${trade.key}&trade=${trade.guide}#leak-check-form` : '/free-plan?src=footer-convert#leak-check-form';

  return (
    <div className="mw-footer-convert">
      <div className="mw-footer-pick">
        <p className="mw-footer-ask" id="footer-pick-title">Which one are you?</p>
        <div className="mw-footer-chips" role="group" aria-labelledby="footer-pick-title">
          {TRADES.map((item) => (
            <button key={item.key} type="button" aria-pressed={item.key === key} onClick={() => pick(item.key)}>{item.label}</button>
          ))}
          <button type="button" aria-pressed={key === 'other'} onClick={() => pick('other')}>Something else</button>
        </div>
        <p className="mw-footer-line" aria-live="polite">
          {trade ? trade.line : key === 'other' ? 'Any small business: the enquiry gets answered, the quote followed up and the booking confirmed while you work.' : 'Pick yours and see the jobs that could run on their own while you work.'}
        </p>
        <p className="mw-footer-actions">
          <a className="button button-signal" href={demoHref}>{MAIN_CTA}</a>
          {trade ? <a className="text-link" href={`/for/${trade.guide}`}>See it for {trade.label === 'Trades' ? 'trades' : `a ${trade.label.toLowerCase()}`}</a> : null}
        </p>
        <p className="s-small">Free. No call needed. You see it working with your business name before you pay anything.</p>
      </div>
      {trade ? (
        <video
          key={trade.key}
          className="mw-footer-video"
          src={`/video/for/${trade.key}.mp4`}
          poster={`/video/for/${trade.key}.webp`}
          controls
          muted
          playsInline
          preload="none"
          aria-label={`22 second example for a ${trade.label.toLowerCase()}: messages answered, followed up and confirmed while the owner works. Example, not a real customer.`}
        />
      ) : null}
      <NewsletterSignup
        id="footer-signup"
        source="footer"
        trade={trade?.key}
        title="Not ready yet?"
        text={trade ? trade.offer : 'Get the 22 second example by email now, then one short email a month.'}
      />
    </div>
  );
}
