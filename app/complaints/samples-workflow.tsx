'use client';

import { useId, useState } from 'react';
import { FICTION_NOTE } from './reports';

/** Samples for the Workflows & Staff Toolkit package. Fictional procedure for "Northgate Advisory". */

const STEPS = [
  { id: 'log', label: 'Log and acknowledge', note: 'Within 2 working days' },
  { id: 'triage', label: 'Triage: anything urgent?', note: 'Use the decision tree', decision: true },
  { id: 'investigate', label: 'Investigate', note: 'Check the customer’s account too' },
  { id: 'draft', label: 'Draft the reply', note: 'Answer every point raised' },
  { id: 'check', label: 'Checklist and second read', note: 'Before it is sent' },
  { id: 'close', label: 'Send, close and record the cause', note: 'Root cause on every case' },
];

export function FlowchartSample() {
  const gap = 78;
  const height = STEPS.length * gap + 10;
  return (
    <figure className="sx-card">
      <p className="sx-fiction">{FICTION_NOTE}</p>
      <svg className="sx-flow" viewBox={`0 0 340 ${height}`} role="img" aria-label={`Process flowchart: ${STEPS.map((step) => step.label).join(', then ')}. At triage, urgent cases are escalated to a manager the same day.`}>
        {STEPS.map((step, i) => {
          const y = 8 + i * gap;
          return (
            <g key={step.id}>
              {i > 0 && <path className="sx-arrow" d={`M170 ${y - 14} V ${y} m-5 -6 l5 6 l5 -6`} />}
              {step.decision
                ? <polygon className="sx-node is-decision" points={`170,${y} 320,${y + 28} 170,${y + 56} 20,${y + 28}`} />
                : <rect className="sx-node" x="20" y={y} width="300" height="56" rx="10" />}
              <text className="sx-node-t" x="170" y={y + 26} textAnchor="middle">{step.label}</text>
              <text className="sx-node-n" x="170" y={y + 43} textAnchor="middle">{step.note}</text>
            </g>
          );
        })}
      </svg>
      <figcaption className="sx-note">Urgent cases leave the main path at triage and go to a manager the same day. The real chart uses your own step names, roles and timings.</figcaption>
    </figure>
  );
}

type Node = { q: string; yes: string | { outcome: string; who: string }; no: string | { outcome: string; who: string } };
const TREE: Record<string, Node> = {
  harm: { q: 'Is the customer vulnerable, or is there a risk of harm?', yes: { outcome: 'Escalate today', who: 'Team manager, same working day' }, no: 'claim' },
  claim: { q: 'Does it allege misconduct, or mention a solicitor or regulator?', yes: { outcome: 'Escalate to compliance', who: 'Compliance officer, within 1 working day' }, no: 'repeat' },
  repeat: { q: 'Has this customer complained about the same thing before?', yes: { outcome: 'Escalate to the complaints lead', who: 'Complaints lead, within 2 working days' }, no: 'redress' },
  redress: { q: 'Could putting it right cost more than £250?', yes: { outcome: 'Needs sign-off', who: 'Team manager approves before any offer' }, no: { outcome: 'Handler resolves', who: 'Case handler, within the 15-day target' } },
};

export function DecisionTreeSample() {
  const [path, setPath] = useState<{ key: string; answer: 'yes' | 'no' }[]>([]);
  const answered = path.length;
  const last = path[path.length - 1];
  const next = last ? (TREE[last.key][last.answer] as string | { outcome: string; who: string }) : 'harm';
  const result = typeof next === 'object' ? next : null;
  const key = typeof next === 'string' ? next : '';
  return (
    <div className="sx-card" role="group" aria-label="Sample escalation decision tree">
      <p className="sx-fiction">{FICTION_NOTE}</p>
      <ol className="sx-path" aria-label="Your answers so far">
        {path.map((step) => <li key={step.key}>{TREE[step.key].q} <strong>{step.answer === 'yes' ? 'Yes' : 'No'}</strong></li>)}
      </ol>
      <div aria-live="polite">
        {result ? (
          <div className="cx-result"><p><strong>{result.outcome}.</strong> {result.who}.</p></div>
        ) : (
          <>
            <p className="sx-q" id="sx-q">{TREE[key].q}</p>
            <div className="cx-actions" role="group" aria-labelledby="sx-q">
              <button type="button" className="button" onClick={() => setPath([...path, { key, answer: 'yes' }])}>Yes</button>
              <button type="button" className="button" onClick={() => setPath([...path, { key, answer: 'no' }])}>No</button>
            </div>
          </>
        )}
      </div>
      {answered > 0 && <button type="button" className="button" onClick={() => setPath([])}>Start again</button>}
      <p className="sx-note">This sample has four questions; yours are built from your own escalation points, thresholds and names.</p>
    </div>
  );
}

const INFOGRAPHICS = [
  { title: 'Investigation quality', points: ['Read the whole complaint, twice', 'Check the customer’s account, not just ours', 'Find the cause, not only the symptom', 'Write down what you checked', 'Ask: would a stranger agree with our decision?'] },
  { title: 'Customer communication', points: ['Answer every point they raised', 'Plain words, short sentences', 'Say what happens next, and when', 'Apologise for the experience, not for facts we dispute', 'Send an update if it will run late'] },
  { title: 'Complaint resolution', points: ['Put right what went wrong', 'Explain the decision and the reason', 'Offer fair, consistent redress', 'Tell them how to take it further', 'Record the root cause'] },
];

export function InfographicsSample() {
  return (
    <div className="sx-card" role="group" aria-label="Sample employee infographics">
      <p className="sx-fiction">{FICTION_NOTE}</p>
      <div className="sx-infos">
        {INFOGRAPHICS.map((info, index) => (
          <section key={info.title} className={`sx-info is-${index}`} aria-label={info.title}>
            <h4>{info.title}</h4>
            <ol>{info.points.map((point) => <li key={point}>{point}</li>)}</ol>
            <small>Northgate Advisory · staff guide {index + 1}/3</small>
          </section>
        ))}
      </div>
      <p className="sx-note">Delivered with your logo, colours and wording, as editable files plus print-ready PDFs.</p>
    </div>
  );
}

const CHECKS = ['I have read every point the customer raised', 'I checked the customer’s account as well as our records', 'The reply answers each point in plain English', 'I have said what happens next and by when', 'Any redress is consistent with similar cases', 'I know the root cause and have recorded it', 'A second person has read the reply', 'The customer knows how to take it further'];

export function ChecklistSample() {
  const uid = useId();
  const [ticked, setTicked] = useState<string[]>([]);
  const ready = ticked.length === CHECKS.length;
  return (
    <div className="sx-card" role="group" aria-label="Sample employee checklist">
      <p className="sx-fiction">{FICTION_NOTE}</p>
      <fieldset className="au-tasks">
        <legend className="ce-label">Before you send a reply</legend>
        {CHECKS.map((check, i) => (
          <label key={check} htmlFor={`${uid}-${i}`} className="au-check">
            <input id={`${uid}-${i}`} type="checkbox" checked={ticked.includes(check)} onChange={() => setTicked(ticked.includes(check) ? ticked.filter((item) => item !== check) : [...ticked, check])} />
            <span>{check}</span>
          </label>
        ))}
      </fieldset>
      <p className="sx-note" aria-live="polite">{ready ? 'All checked: ready to send.' : `${ticked.length} of ${CHECKS.length} checked.`}</p>
    </div>
  );
}
