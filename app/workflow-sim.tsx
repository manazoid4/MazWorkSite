'use client';

import { useEffect, useId, useRef, useState } from 'react';
import './b2b.css';

/**
 * Workflow simulator: a small SVG pipeline that shows how a job moves between
 * tools. It is an illustration, not a live system: the millisecond figures are
 * made-up examples and the page says so. No canvas or animation library.
 */
export const PRESETS = [
  { id: 'lead', name: 'Enquiry to booking', steps: [
    { label: 'Web form sent', ms: 0 }, { label: 'Reply and booking link sent', ms: 900 }, { label: 'Visitor picks a time (Cal.com)', ms: 1400 }, { label: 'Added to your sheet or CRM', ms: 1700 }, { label: 'You get an alert', ms: 2100 },
  ], text: 'A form is sent, the visitor gets a reply with a booking link, picks a time, and the booking is added to your sheet or CRM and you are told.' },
  { id: 'onboarding', name: 'Client onboarding', steps: [
    { label: 'Engagement letter signed', ms: 0 }, { label: 'Folder created', ms: 700 }, { label: 'Welcome email and checklist sent', ms: 1300 }, { label: 'Reminder if documents are missing', ms: 2000 }, { label: 'Team told when complete', ms: 2500 },
  ], text: 'Once the letter is signed, a folder is made, the client gets a checklist, missing items are chased, and your team is told when it is complete.' },
  { id: 'missed', name: 'Missed call recovery', steps: [
    { label: 'Call missed', ms: 0 }, { label: 'Text sent with booking link', ms: 600 }, { label: 'Caller books or replies', ms: 1500 }, { label: 'Logged for you', ms: 1900 },
  ], text: 'A missed call triggers a text with a booking link. When the caller books or replies, it is logged for you.' },
] as const;

const STEP_MS = 650;

export function WorkflowSimulator() {
  const uid = useId();
  const timer = useRef<number | undefined>(undefined);
  const [presetId, setPresetId] = useState<(typeof PRESETS)[number]['id']>('lead');
  const [reached, setReached] = useState(-1); // index of the last node the packet has reached
  const [running, setRunning] = useState(false);
  const preset = PRESETS.find((item) => item.id === presetId)!;
  const count = preset.steps.length;

  useEffect(() => () => window.clearInterval(timer.current), []);

  function choose(id: (typeof PRESETS)[number]['id']) {
    window.clearInterval(timer.current);
    setRunning(false); setReached(-1); setPresetId(id);
  }

  function run() {
    window.clearInterval(timer.current);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setReached(count - 1); setRunning(false); return; }
    let index = 0;
    setReached(0); setRunning(true);
    timer.current = window.setInterval(() => {
      index += 1;
      setReached(index);
      if (index >= count - 1) { window.clearInterval(timer.current); setRunning(false); }
    }, STEP_MS);
  }

  const height = count * 76 + 20;
  const y = (index: number) => 30 + index * 76;

  return (
    <div className="wf" role="group" aria-labelledby={`${uid}-t`}>
      <h3 id={`${uid}-t`} style={{ margin: 0 }}>Watch a job move between tools</h3>
      <div className="wf-presets" role="group" aria-label="Example workflow">
        {PRESETS.map((item) => <button key={item.id} type="button" aria-pressed={presetId === item.id} onClick={() => choose(item.id)}>{item.name}</button>)}
      </div>
      <p className="s-small" style={{ margin: 0 }}>{preset.text}</p>

      <svg className="wf-svg" style={{ maxWidth: 360, margin: '0 auto' }} viewBox={`0 0 320 ${height}`} role="img" aria-label={`${preset.name}: ${preset.steps.map((step) => step.label).join(', then ')}.`}>
        {preset.steps.slice(1).map((step, index) => <line key={step.label} className={`wf-line${reached > index ? ' is-done' : ''}`} x1={160} x2={160} y1={y(index) + 22} y2={y(index + 1) - 22} />)}
        {preset.steps.map((step, index) => (
          <g key={step.label} className={`wf-node${reached > index || (!running && reached === index) ? ' is-done' : reached === index ? ' is-live' : ''}`}>
            <rect x={20} y={y(index) - 22} width={280} height={44} rx={10} />
            <text x={160} y={y(index) + 5} textAnchor="middle">{step.label}</text>
          </g>
        ))}
        {reached >= 0 && <circle className="wf-packet" r={7} cx={160} cy={y(reached)} />}
      </svg>

      <div>
        <button type="button" className="wf-run button" onClick={run} disabled={running}>{running ? 'Running…' : reached >= count - 1 ? 'Run it again' : 'Run test'}</button>
      </div>

      <ol className="wf-log" aria-live="polite" aria-label="Test log">
        {preset.steps.slice(0, Math.max(reached + 1, 0)).map((step) => <li key={step.label}><time>{step.ms} ms</time><span>{step.label}</span></li>)}
      </ol>
      <p className="s-small" style={{ margin: 0 }}>An illustration with example timings, not a live system. Real timings depend on your tools.</p>
    </div>
  );
}
