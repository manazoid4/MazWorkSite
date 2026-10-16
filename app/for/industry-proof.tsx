'use client';

import { useEffect, useState } from 'react';
import type { IndustryProof } from './industry-proof-data';
import { advanceProof, initialProofState, proofSummary, replayProof, selectProofChoice } from './industry-proof-state';
import { buildTradeEnquiryHref } from '../trade-context';
import { MAIN_CTA } from '../site';
import { CampaignLink } from '../campaign-link';

/**
 * One reusable, data-driven example per industry. The visitor steps through the
 * scenario, picks example details, and sees the owner's side. Always labelled as
 * an example; nothing is sent. With JavaScript off, the <noscript> list tells the
 * same story. The enquiry link carries the industry and the job they looked at.
 */
export function IndustryProof({ proof }: { proof: IndustryProof }) {
  const [state, setState] = useState(() => initialProofState(proof));
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  useEffect(() => { setReady(true); }, []);
  useEffect(() => {
    if (!playing || state.complete) return;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (media.matches) { setPlaying(false); return; }
    const stopForMotion = () => { if (media.matches) setPlaying(false); };
    media.addEventListener('change', stopForMotion);
    const timer = window.setTimeout(() => setState(s => advanceProof(proof, s)), 2400);
    return () => { window.clearTimeout(timer); media.removeEventListener('change', stopForMotion); };
  }, [playing, state.step, state.complete, proof]);
  const step = proof.steps[state.step];
  const summary = proofSummary(proof, state);
  const href = buildTradeEnquiryHref(proof.slug, { problem: proof.problem, proof: state.interacted ? proof.slug : undefined });
  function replay() { setPlaying(false); setState(replayProof(proof)); }
  function play() {
    // Reduced motion: no timers, just jump to the finished state (the "still").
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setState(s => proof.steps.reduce(acc => advanceProof(proof, acc), s));
      return;
    }
    if (state.complete) setState(replayProof(proof));
    setPlaying(true);
  }
  return (
    <div role="region" className="ip-proof" id="industry-proof" data-testid="industry-proof" data-industry={proof.slug} aria-labelledby="ip-title">
      <header className="ip-head"><p className="ip-label">Example · made-up business, nothing is sent</p><h2 id="ip-title">{proof.title}</h2><p className="ip-moment">{proof.moment}</p></header>
      <ol className="ip-progress" aria-label="Example steps">{proof.steps.map((s, index) => <li key={s.title} aria-current={index === state.step ? 'step' : undefined}><span>{index + 1}</span><em>{s.title}</em></li>)}</ol>
      <div className="ip-customer">
        <h3>{state.step === 0 ? 'What happens' : 'What the customer sees'}</h3>
        <p aria-live="polite" aria-atomic="true">{summary.customer}</p>
        {step.fields.length ? <fieldset disabled={!ready || (playing && !state.complete)}><legend>Try different example details</legend>{step.fields.map(id => {
          const f = proof.fields.find(item => item.id === id)!;
          return <label key={id} htmlFor={`ip-${id}`}>{f.label}<select id={`ip-${id}`} value={state.choices[id]} onChange={event => setState(s => selectProofChoice(proof, s, id, event.target.value))}>{f.options.map(option => <option key={option}>{option}</option>)}</select></label>;
        })}</fieldset> : null}
      </div>
      <div className="ip-controls">
        <button type="button" className="ip-next" disabled={!ready} onClick={() => { setPlaying(false); if (state.complete) replay(); else setState(s => advanceProof(proof, s)); }}>{state.complete ? 'Replay' : 'Next step'}</button>
        <button type="button" disabled={!ready} onClick={() => { if (playing && !state.complete) setPlaying(false); else play(); }}>{playing && !state.complete ? 'Pause' : 'Play example'}</button>
        {state.step > 0 && !state.complete ? <button type="button" onClick={replay}>Start again</button> : null}
      </div>
      <aside className="ip-owner" aria-labelledby="ip-owner-title"><p className="ip-label">Your side · {state.complete ? 'what lands with you' : 'preview'}</p><h3 id="ip-owner-title">{proof.artifact}</h3><strong>{summary.status}</strong><dl>{summary.fields.map(f => <div key={f.label}><dt>{f.label}</dt><dd>{f.value}</dd></div>)}</dl><p>{summary.owner}</p>{state.complete ? <p className="ip-decision"><strong>Your call.</strong> {proof.decision}</p> : null}</aside>
      <details className="ip-boundary"><summary>What this example does not do</summary><p>{proof.scope} {proof.boundary}</p><p>Real setup depends on your existing tools and permissions. Any app subscriptions or message costs are paid to the provider and agreed first.</p></details>
      <noscript><p>Turn on JavaScript to step through this example. {proof.boundary}</p></noscript>
      <CampaignLink className="ip-cta" href={href}>{MAIN_CTA} <span aria-hidden="true">→</span></CampaignLink>
    </div>
  );
}
