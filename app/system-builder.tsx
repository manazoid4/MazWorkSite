'use client';
import { MAIN_CTA } from './site';

import { useState } from 'react';
import { CUSTOMER_TYPES } from './customer-types';
import { quotePlan } from './offers';
import { HEADACHE_PICKS, getSystem } from './systems';

const TRADES = [...CUSTOMER_TYPES.map((type) => ({ id: type.id, label: `${type.name}: ${type.examples.split(',').slice(0, 2).join(',').toLowerCase()}…` })), { id: 'other', label: 'Something else, all welcome' }];

/** Where the builder's main button lands: the free plan form, pre-filled and tagged src=builder. */
export function builderHref(trade: string, headaches: string[]): string {
  const systems = [...new Set(headaches.map((id) => HEADACHE_PICKS.find((pick) => pick.id === id)?.system).filter(Boolean))] as string[];
  const quote = quotePlan(systems.map((id) => getSystem(id)));
  const params = new URLSearchParams({ src: 'builder' });
  if (trade) params.set('trade', trade);
  if (systems.length) params.set('systems', systems.join(','));
  if (quote.offer) params.set('package', quote.offer.name);
  return `/free-plan?${params.toString()}#leak-check-form`;
}

/**
 * "Build my system" (Batch 2): pick a trade, tap the headaches, and the
 * matching systems from systems.ts line up as a day, priced by quotePlan() in
 * offers.ts. Without JavaScript it falls back to links: the free plan form
 * and each system on /what-we-do. Not a <form>, so the page keeps one form.
 */
export function SystemBuilder({ presetTrade = '' }: { presetTrade?: string }) {
  const [trade, setTrade] = useState(presetTrade);
  const [headaches, setHeadaches] = useState<string[]>([]);
  const systems = [...new Set(headaches.map((id) => HEADACHE_PICKS.find((pick) => pick.id === id)!.system))].map((id) => getSystem(id));
  const quote = quotePlan(systems);
  const toggle = (id: string) => setHeadaches((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));

  return (
    <div className="s-builder" id="builder" role="group" aria-labelledby="builder-title">
      <h3 id="builder-title">Build my system</h3>
      <fieldset className="s-builder-step">
        <legend><span>1</span> What kind of business?</legend>
        <div className="s-chips">
          {TRADES.map((item) => (
            <label key={item.id} className="s-chip">
              <input type="radio" name="builder-trade" value={item.id} checked={trade === item.id} onChange={() => setTrade(item.id)} />
              <span>{item.label}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <fieldset className="s-builder-step">
        <legend><span>2</span> What’s costing you time or customers? <small>Tap any</small></legend>
        <div className="s-chips">
          {HEADACHE_PICKS.map((pick) => (
            <label key={pick.id} className="s-chip">
              <input type="checkbox" name="builder-headache" value={pick.id} checked={headaches.includes(pick.id)} onChange={() => toggle(pick.id)} />
              <span>{pick.label}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <div className="s-builder-result" aria-live="polite">
        {systems.length ? (
          <ol className="s-builder-day">
            {systems.map((system) => (
              <li key={system.id}><strong>{system.name}</strong><span>{system.result}</span></li>
            ))}
          </ol>
        ) : (
          <p className="s-small">Tap a headache and your system lines up here.</p>
        )}
        <ul className="s-builder-lines">
          {quote.lines.map((line) => <li key={line.label}><span>{line.label}</span><strong>{line.price}</strong></li>)}
        </ul>
        <p className="s-builder-total"><span>Your price</span><strong>{quote.totalLabel}</strong></p>
        <p className="s-small">{quote.note} Working by: {quote.workingBy.toLowerCase()}.</p>
      </div>
      {/* ConversionTracker records this as 'CTA clicked'; the systems travel in the URL. */}
      <a className="button button-signal" href={builderHref(trade, headaches)}>{MAIN_CTA}</a>
      <p className="s-small">Opens the free preview form with your picks filled in. No call, no obligation.</p>
      <noscript>
        <p className="s-small">Or see each system: {HEADACHE_PICKS.map((pick, index) => <span key={pick.id}>{index ? ' · ' : ''}<a href={`/what-we-do#${pick.system}`}>{pick.label}</a></span>)}</p>
      </noscript>
    </div>
  );
}
