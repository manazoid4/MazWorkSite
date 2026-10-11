'use client';

import { useEffect, useState } from 'react';
import type { IndustryProof } from './industry-proof-data';
import { advanceProof, initialProofState, proofSummary, replayProof, selectProofChoice } from './industry-proof-state';
import { buildTradeEnquiryHref } from '../trade-context';
import { MAIN_CTA } from '../site';

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
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setState(s => advanceProof(proof, advanceProof(proof, s)));
      return;
    }
    if (state.complete) setState(replayProof(proof));
    setPlaying(true);
  }
  return (
    <section className="ip-proof" id="industry-proof" data-testid="industry-proof" data-industry={proof.slug} aria-labelledby="ip-title">
      <header className="ip-head"><p className="ip-label">Illustrative demo · example data</p><h2 id="ip-title">{proof.title}</h2><p>No messages sent. No live booking or connected apps.</p></header>
      <ol className="ip-progress" aria-label="Example steps">{proof.steps.map((s, index) => <li key={s.title} aria-current={index === state.step ? 'step' : undefined}><span>{index + 1}</span>{s.title}</li>)}</ol>
      <div className="ip-customer">
        <h3>Customer view</h3>
        <p aria-live="polite" aria-atomic="true">{summary.customer}</p>
        {step.fields.length ? <fieldset disabled={!ready || (playing && !state.complete)}><legend>Try different example details</legend>{step.fields.map(id => {
          const f = proof.fields.find(item => item.id === id)!;
          return <label key={id} htmlFor={`ip-${id}`}>{f.label}<select id={`ip-${id}`} value={state.choices[id]} onChange={event => setState(s => selectProofChoice(proof, s, id, event.target.value))}>{f.options.map(option => <option key={option}>{option}</option>)}</select></label>;
        })}</fieldset> : null}
      </div>
      <div className="ip-controls">
        <button type="button" disabled={!ready} onClick={() => { setPlaying(false); state.complete ? replay() : setState(s => advanceProof(proof, s)); }}>{state.complete ? 'Replay' : 'Next step'}</button>
        <button type="button" disabled={!ready} onClick={() => playing && !state.complete ? setPlaying(false) : play()}>{playing && !state.complete ? 'Pause' : 'Play example'}</button>
        {state.step > 0 && !state.complete ? <button type="button" onClick={replay}>Replay</button> : null}
      </div>
      <aside className="ip-owner" aria-labelledby="ip-owner-title"><p className="ip-label">Owner summary · illustrative {state.complete ? 'result' : 'preview'}</p><h3 id="ip-owner-title">{proof.artifact}</h3><strong>{summary.status}</strong><dl>{summary.fields.map(f => <div key={f.label}><dt>{f.label}</dt><dd>{f.value}</dd></div>)}</dl><p>{summary.owner}</p></aside>
      <details className="ip-boundary"><summary>Scope and demo limits</summary><p>{proof.scope} {proof.boundary}</p><p>Actual setup depends on your existing tools and permissions. Any app subscriptions or message costs are paid to the provider and agreed first.</p></details>
      <noscript><p>Read the example without JavaScript:</p><ol>{proof.steps.map(s => <li key={s.title}><strong>{s.title}: </strong>{s.customer} {s.owner}</li>)}</ol><p>{proof.boundary}</p></noscript>
      <a className="ip-cta" href={href}>{MAIN_CTA} <span aria-hidden="true">→</span></a>
    </section>
  );
}
