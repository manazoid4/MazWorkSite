'use client';

import { useEffect, useState } from 'react';
import { MAIN_CTA } from '../site';
import { OFFERS } from '../offers';
import { BIZ_TYPES, NEXT_THREE, SOLUTIONS, demoHref, jobNames, type BizId, type Solution } from './data';
import './solutions.css';

/** `#missed-calls` or `#missed-calls/salon`: the solution, then optionally the business type. */
function parseHash(hash: string): { id: string | null; biz: BizId | null } {
  const [id, biz] = hash.replace(/^#/, '').split('/');
  return {
    id: SOLUTIONS.some((s) => s.id === id) ? id : null,
    biz: BIZ_TYPES.some((b) => b.id === biz) ? (biz as BizId) : null,
  };
}

function from(solution: Solution) {
  return solution.onceHead === OFFERS[1].price ? solution.onceHead.toLowerCase() : solution.onceHead;
}

function Panel({ solution, biz, open }: { solution: Solution; biz: BizId | null; open: boolean }) {
  const jobs = jobNames(solution.jobs);
  const example = biz ? solution.examples[biz] : null;
  const bizLabel = BIZ_TYPES.find((b) => b.id === biz)?.label;
  return (
    <details className="sol-panel" id={solution.id} open={open}>
      <summary><span>{solution.short}</span><b>{from(solution)}</b></summary>
      <div className="sol-body">
        <section aria-labelledby={`${solution.id}-q1`}>
          <h3 className="sol-q" id={`${solution.id}-q1`}>The problem</h3>
          <p className="sol-problem">{solution.problem}</p>
          <p className="sol-sum">{from(solution)} once · {solution.keepsHead.toLowerCase()} monthly{solution.also ? ` · ${solution.also}` : ''}</p>
          <p className="sol-pain">{solution.pain}</p>
          {example ? <p className="sol-eg"><b>{bizLabel}:</b> {example}</p> : null}
          <ol className="sol-flow" aria-label="What happens">
            <li><i>Starts when</i><span>{solution.flow.start}</span></li>
            <li><i>Then it</i><span>{solution.flow.does}</span></li>
            <li><i>You get</i><span>{solution.flow.result}</span></li>
          </ol>
        </section>

        <section aria-labelledby={`${solution.id}-q2`}>
          <h3 className="sol-q" id={`${solution.id}-q2`}>What you get</h3>
          <ul className="sol-list">{solution.get.map((line) => <li key={line}>{line}</li>)}</ul>
          <p className="sol-small">{solution.pkg === OFFERS[1].name ? 'Three of these, joined up: ' : jobs.length === 1 ? 'The task: ' : 'Pick one of: '}{jobs.join(', ')}.</p>
        </section>

        <section aria-labelledby={`${solution.id}-q3`}>
          <h3 className="sol-q" id={`${solution.id}-q3`}>What it costs</h3>
          <div className="sol-split">
            <div className="sol-once">
              <p className="sol-split-label">Pay once (you own it)</p>
              <p className="sol-split-value">{solution.onceHead}</p>
              <dl>{solution.once.map((line) => <div key={line.label}><dt>{line.label}</dt><dd>{line.value}</dd></div>)}</dl>
            </div>
            <div className="sol-keeps">
              <p className="sol-split-label">Keeps costing</p>
              <p className="sol-split-value">{solution.keepsHead}</p>
              <dl>{solution.keeps.map((line) => <div key={line.label}><dt>{line.label}</dt><dd>{line.value}</dd></div>)}</dl>
            </div>
          </div>
          <p className="sol-small"><b>You own:</b> {solution.own} No VAT added.</p>
          <p className="sol-small">{solution.upgrade}</p>
        </section>

        <section aria-labelledby={`${solution.id}-q4`}>
          <h3 className="sol-q" id={`${solution.id}-q4`}>What happens next</h3>
          <ol className="sol-next">{NEXT_THREE.map((step) => <li key={step.day}><i>{step.day}</i><span>{step.title}</span></li>)}</ol>
          <a className="button button-signal sol-cta" href={demoHref(solution)}>{MAIN_CTA} <span aria-hidden="true">→</span></a>
        </section>
      </div>
    </details>
  );
}

/**
 * The six solutions. Every one is in the HTML (open on /solutions, folded when
 * `startOpen` is false), and the picker buttons are plain anchors, so it all
 * works without JavaScript. With JavaScript one panel shows at a time, the
 * choice lives in the URL hash and the back button steps through choices.
 */
export function SolutionsPicker({ startOpen, firstSelected }: { startOpen: boolean; firstSelected: boolean }) {
  const [hydrated, setHydrated] = useState(false);
  const [sel, setSel] = useState<string | null>(firstSelected ? SOLUTIONS[0].id : null);
  const [biz, setBiz] = useState<BizId | null>(null);

  useEffect(() => {
    const read = () => {
      const { id, biz: b } = parseHash(window.location.hash);
      if (id) setSel(id);
      setBiz(b);
    };
    read();
    setHydrated(true);
    // A shared link lands on its panel, which only shows once this has run.
    const first = parseHash(window.location.hash).id;
    if (first) requestAnimationFrame(() => document.getElementById('solutions')?.scrollIntoView());
    window.addEventListener('popstate', read);
    window.addEventListener('hashchange', read);
    return () => { window.removeEventListener('popstate', read); window.removeEventListener('hashchange', read); };
  }, []);

  const hashFor = (id: string | null, b: BizId | null) => `#${id ?? ''}${b && id ? `/${b}` : ''}`;
  const choose = (id: string, event: React.MouseEvent) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    window.history.pushState(null, '', hashFor(id, biz));
    setSel(id);
  };
  const chooseBiz = (b: BizId | null) => {
    window.history.replaceState(null, '', hashFor(sel, b));
    setBiz(b);
  };

  return (
    <div className={`sol${hydrated ? ' sol-js' : ''}`} id="solutions">
      <nav aria-label="Pick your problem">
        <p className="sol-prompt">Tap the one that sounds like you.</p>
        <ul className="sol-picker">
          {SOLUTIONS.map((solution) => (
            <li key={solution.id}>
              <a href={`#${solution.id}`} aria-current={hydrated && sel === solution.id ? 'true' : undefined} onClick={(event) => choose(solution.id, event)}>
                <span>{solution.short}</span><b>{from(solution)}</b>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {hydrated ? (
        <div className="sol-biz" role="group" aria-labelledby="sol-biz-label">
          <span id="sol-biz-label">I run a… (optional)</span>
          {BIZ_TYPES.map((b) => <button type="button" key={b.id} aria-pressed={biz === b.id} onClick={() => chooseBiz(biz === b.id ? null : b.id)}>{b.label}</button>)}
          <small>Changes the example only, never the price.</small>
        </div>
      ) : null}

      {SOLUTIONS.map((solution) => {
        const on = hydrated && sel === solution.id;
        return <div key={solution.id} className={on ? 'sol-item sol-on' : 'sol-item'}><Panel solution={solution} biz={on ? biz : null} open={hydrated ? on : startOpen} /></div>;
      })}
    </div>
  );
}
