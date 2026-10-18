'use client';

import { useEffect, useRef, useState } from 'react';
import { OFFERS, formatPrice, getOffer, priceAmount } from './offers';
import './interactive.css';

const SHARES = [10, 20, 30, 50];

/** Eases the big number toward its target so the sliders feel alive. */
function useCountUp(target: number) {
  const [shown, setShown] = useState(target);
  const from = useRef(target);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { from.current = target; setShown(target); return; }
    const start = from.current;
    const began = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const progress = Math.min(1, (now - began) / 320);
      const value = Math.round(start + (target - start) * (1 - Math.pow(1 - progress, 3)));
      from.current = value;
      setShown(value);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target]);
  return shown;
}

function Slider({ id, label, value, max, step, money, onChange }: { id: string; label: string; value: number; max: number; step: number; money?: boolean; onChange: (value: number) => void }) {
  return (
    <div className="ce-slider">
      <label htmlFor={id}><span>{label}</span><output htmlFor={id}>{money ? formatPrice(value) : value}</output></label>
      <input id={id} type="range" min={0} max={max} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} style={{ ['--fill' as string]: `${(value / max) * 100}%` }} />
    </div>
  );
}

/**
 * "What it's costing you" (Batch 2, rebuilt 30 Sep as a live estimator).
 * Only the visitor's own numbers: nothing starts filled in and there are no
 * industry figures. Drag two sliders, tap a share, and the monthly figure,
 * the comparison bars and the payback update as you go.
 * Monthly = per week × share lost × job value × 52 ÷ 12.
 * Prices come from offers.ts; nothing is hard-coded here.
 */
export type CalculatorPreset = { perWeek: number; share: number; value: number; label: string };

export function CostCalculator({ preset, trade, buildLink = true }: { preset?: CalculatorPreset; trade?: string; buildLink?: boolean } = {}) {
  const [perWeek, setPerWeek] = useState(0);
  const [share, setShare] = useState(0);
  const [value, setValue] = useState(0);
  const usePreset = () => { if (!preset) return; setPerWeek(preset.perWeek); setShare(preset.share); setValue(preset.value); };
  const ready = perWeek > 0 && share > 0 && value > 0;
  const monthly = ready ? Math.round((perWeek * (share / 100) * value * 52) / 12) : 0;
  const shown = useCountUp(monthly);
  // Creators are sold their own starter, so the estimate and the CTA use it on /for/creators.
  const STARTER = trade === 'creators' ? getOffer('creator-starter') : OFFERS[0];
  const starter = priceAmount(STARTER.price);
  const days = monthly > 0 ? Math.max(1, Math.ceil(starter / (monthly / 30))) : 0;
  const costShare = monthly > 0 ? Math.min(100, Math.max(4, (starter / monthly) * 100)) : 0;

  return (
    <div className="ce" role="group" aria-labelledby="calc-title">
      <p className="eyebrow">Your numbers, your estimate</p>
      <h3 id="calc-title">What are missed enquiries costing you?</h3>
      <p className="ce-lede">Drag the sliders. Nothing is saved or sent.</p>
      {preset ? <p className="ce-preset"><button type="button" className="ce-chip" onClick={usePreset}>Start with typical numbers</button> <span className="s-small">{preset.label}. Then drag to yours.</span></p> : null}

      <Slider id="ce-week" label="Calls or enquiries you get a week" value={perWeek} max={60} step={1} onChange={setPerWeek} />
      <div className="ce-slider">
        <p className="ce-label" id="ce-share-label"><span>How many slip away?</span><output>{share ? `${share}%` : 'Tap one'}</output></p>
        <div className="ce-chips" role="radiogroup" aria-labelledby="ce-share-label">
          {SHARES.map((option) => (
            <button key={option} type="button" role="radio" aria-checked={share === option} className={`ce-chip${share === option ? ' is-on' : ''}`} onClick={() => setShare(option)}>{option}%</button>
          ))}
        </div>
      </div>
      <Slider id="ce-value" label="What a job is worth" value={value} max={1000} step={10} money onChange={setValue} />

      <div className={`ce-result${ready ? ' is-ready' : ''}`} aria-live="polite">
        {ready ? (
          <>
            <p className="ce-big"><strong>{formatPrice(shown)}</strong><span> a month</span></p>
            <p className="ce-line">by your own numbers.</p>
            <div className="ce-bars" aria-hidden="true">
              <div><span>Lost each month</span><i style={{ width: '100%' }} /></div>
              <div><span>{STARTER.name}, once</span><i className="ce-bar-cost" style={{ width: `${costShare}%` }} /></div>
            </div>
            <p className="ce-pay">{days > 365 ? `${STARTER.name} would take over a year to pay for itself on these numbers.` : `${STARTER.name} (${STARTER.price}) would pay for itself in about ${days} ${days === 1 ? 'day' : 'days'}.`}</p>
            <a className="button button-signal" href={`/free-plan?package=${encodeURIComponent(STARTER.name)}&src=estimator${trade ? `-${trade}&trade=${trade}` : ''}#leak-check-form`}>Get my free preview</a>
          </>
        ) : (
          <p className="ce-hint">Move the sliders to see your number. The sum: per week × share lost × job value × 52 ÷ 12. Compare it with {STARTER.name} at {STARTER.price} once.</p>
        )}
      </div>
      <p className="s-small">An estimate from what you entered, not a promise of results.{buildLink ? <> <a href="#build-my-system">Build my system →</a></> : null}</p>
    </div>
  );
}
