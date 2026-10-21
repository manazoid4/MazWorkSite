'use client';
import { MAIN_CTA } from './site';

import { useEffect, useRef, useState } from 'react';
import { SYSTEMS, systemPrice } from './systems';
import './interactive.css';

const LIST = SYSTEMS.filter((system) => !system.packageId);
const STEP_MS = 650;

/**
 * "Every system, explained" as a picker. Tap a job, watch its steps run,
 * then ask for it or book a free preview.
 * - All panels are in the page (search, no-JavaScript); with JavaScript one shows.
 * - Deep links like /what-we-do#missed-calls open that system.
 * - Reduced motion shows every step at once.
 */
export function SystemExplorer() {
  const [active, setActive] = useState(LIST[0].id);
  const [step, setStep] = useState(LIST[0].steps.length);
  const [live, setLive] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  const play = (id: string) => {
    window.clearTimeout(timer.current);
    const system = LIST.find((item) => item.id === id)!;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setStep(system.steps.length); return; }
    setStep(0);
    const next = (value: number) => {
      setStep(value);
      if (value < system.steps.length) timer.current = window.setTimeout(() => next(value + 1), STEP_MS);
    };
    timer.current = window.setTimeout(() => next(1), 250);
  };

  const choose = (id: string) => { setActive(id); play(id); };

  useEffect(() => {
    setLive(true);
    const fromHash = LIST.find((item) => item.id === window.location.hash.slice(1));
    if (fromHash) { setActive(fromHash.id); play(fromHash.id); } else play(LIST[0].id);
    const onHash = () => { const hit = LIST.find((item) => item.id === window.location.hash.slice(1)); if (hit) choose(hit.id); };
    window.addEventListener('hashchange', onHash);
    return () => { window.removeEventListener('hashchange', onHash); window.clearTimeout(timer.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="se" data-live={live || undefined}>
      <div className="se-chips" role="tablist" aria-label="Choose a system">
        {LIST.map((system, index) => (
          <button key={system.id} type="button" role="tab" id={`se-tab-${system.id}`} aria-selected={active === system.id} aria-controls={system.id} className={`se-chip${active === system.id ? ' is-on' : ''}`} data-tone={index % 6} onClick={() => choose(system.id)}>{system.name}</button>
        ))}
      </div>
      {LIST.map((system, index) => {
        const isActive = active === system.id;
        return (
          <div key={system.id} id={system.id} role="tabpanel" aria-labelledby={`se-tab-${system.id}`} className="se-panel" data-tone={index % 6} hidden={live && !isActive}>
            <h3>{system.name}</h3>
            <p className="se-headache"><strong>The headache:</strong> {system.headache}.</p>
            <ol className="se-steps">
              {system.steps.map((item, stepIndex) => (
                <li key={item.title} className={`se-step${!live || (isActive && step >= stepIndex + 1) ? ' is-on' : ''}${isActive && step === stepIndex + 1 ? ' is-now' : ''}`}>
                  <span className="se-dot" aria-hidden="true">{stepIndex + 1}</span>
                  <span><strong>{item.title}.</strong> {item.detail}</span>
                </li>
              ))}
            </ol>
            <p className={`se-result${!live || (isActive && step >= system.steps.length) ? ' is-on' : ''}`}><strong>{system.result}</strong></p>
            <p className="se-price">{systemPrice(system)}</p>
            <div className="se-actions">
              <a className="button button-signal" href={`/contact?package=${encodeURIComponent(system.offerName)}#leak-check-form`}>{MAIN_CTA}</a>
              <a className="se-try" href="/after-hours-receptionist#bigger-builds">Bigger build? See a free preview →</a>
              {live ? <button type="button" className="se-replay" onClick={() => play(system.id)}>Replay</button> : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}
