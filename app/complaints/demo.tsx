'use client';

import { useId, useRef, useState, type KeyboardEvent } from 'react';
import {
  ACK_TARGET_DAYS, CATEGORIES, DEMO_CASES, DEMO_TODAY, RESPONSE_TARGET_DAYS, STAGES,
  acknowledgementEmail, caseDeadlines, caseHealth, countByCategory, draftReply, nextCaseId,
  type Category, type DemoCase, type Health,
} from './model';

/**
 * Interactive complaints demo for /complaints. Everything here is invented; it
 * runs in the browser only and sends nothing. The reply draft is built from
 * template wording and needs a person to approve it, which the demo shows.
 */
const TABS = [
  { id: 'intake', label: '1. Log a complaint' },
  { id: 'tracker', label: '2. Track cases' },
  { id: 'reply', label: '3. Draft a reply' },
  { id: 'trends', label: '4. See patterns' },
] as const;
type TabId = (typeof TABS)[number]['id'];

const HEALTH_LABEL: Record<Health, string> = { 'on-track': 'On track', 'due-soon': 'Due soon', overdue: 'Overdue' };
const day = (iso: string) => new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' });

export function ComplaintsDemo() {
  const uid = useId();
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [tab, setTab] = useState<TabId>('intake');
  const [cases, setCases] = useState<DemoCase[]>(DEMO_CASES);
  const [category, setCategory] = useState<Category>('Delay');
  const [summary, setSummary] = useState('The delivery date we agreed has passed and nobody has told us why.');
  const [logged, setLogged] = useState<DemoCase | null>(null);
  const [replyId, setReplyId] = useState(DEMO_CASES[0].id);
  const [approved, setApproved] = useState<string[]>([]);

  function onTabKey(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const move = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
    if (!move) return;
    event.preventDefault();
    const next = (index + move + TABS.length) % TABS.length;
    setTab(TABS[next].id);
    tabRefs.current[next]?.focus();
  }

  function logComplaint() {
    const text = summary.trim();
    if (!text) return;
    const item: DemoCase = { id: nextCaseId(cases), client: 'Your client (example)', category, summary: text.slice(0, 160), received: DEMO_TODAY, stage: 'Received', owner: 'You' };
    setCases([...cases, item]);
    setLogged(item);
    setReplyId(item.id);
  }

  const sorted = [...cases].sort((a, b) => caseHealth(a).daysLeft - caseHealth(b).daysLeft);
  const alerts = sorted.filter((item) => caseHealth(item).health !== 'on-track');
  const counts = countByCategory(cases);
  const top = Math.max(1, ...Object.values(counts));
  const replyCase = cases.find((item) => item.id === replyId) ?? cases[0];
  const isApproved = approved.includes(replyCase.id);

  return (
    <div className="cx" aria-labelledby={`${uid}-title`}>
      <div className="cx-head">
        <h3 id={`${uid}-title`}>Try it with made-up data</h3>
        <p>Every name and case below is invented. Nothing you type here is sent anywhere.</p>
      </div>

      <div className="cx-tabs" role="tablist" aria-label="Demo steps">
        {TABS.map((item, index) => (
          <button key={item.id} ref={(node) => { tabRefs.current[index] = node; }} type="button" role="tab" id={`${uid}-tab-${item.id}`} aria-selected={tab === item.id} aria-controls={`${uid}-panel-${item.id}`} tabIndex={tab === item.id ? 0 : -1} onClick={() => setTab(item.id)} onKeyDown={(event) => onTabKey(event, index)}>{item.label}</button>
        ))}
      </div>

      <div className="cx-panel" role="tabpanel" id={`${uid}-panel-${tab}`} aria-labelledby={`${uid}-tab-${tab}`} tabIndex={0}>
        {tab === 'intake' && (
          <>
            <p className="cx-note">A client complains by form or email. It lands in one place, in the same shape every time.</p>
            <div className="cx-field">
              <label htmlFor={`${uid}-cat`}>What is it about?</label>
              <select id={`${uid}-cat`} value={category} onChange={(event) => setCategory(event.target.value as Category)}>
                {CATEGORIES.map((name) => <option key={name}>{name}</option>)}
              </select>
            </div>
            <div className="cx-field">
              <label htmlFor={`${uid}-sum`}>What happened?</label>
              <textarea id={`${uid}-sum`} rows={3} maxLength={160} value={summary} onChange={(event) => setSummary(event.target.value)} />
            </div>
            <button className="button button-signal" type="button" onClick={logComplaint} disabled={!summary.trim()}>Log this complaint</button>
            <div aria-live="polite">
              {logged && (
                <div className="cx-result">
                  <p><strong>{logged.id} logged.</strong> Acknowledge by {day(caseDeadlines(logged.received).acknowledge)} ({ACK_TARGET_DAYS} working days). Reply by {day(caseDeadlines(logged.received).respond)} ({RESPONSE_TARGET_DAYS} working days). Those two targets are set by you, per business.</p>
                  <p className="cx-label">Acknowledgement sent to the client</p>
                  <pre>{acknowledgementEmail(logged)}</pre>
                  <button className="button" type="button" onClick={() => setTab('tracker')}>See it in the tracker →</button>
                </div>
              )}
            </div>
          </>
        )}

        {tab === 'tracker' && (
          <>
            <p className="cx-note">Today in this demo is {day(DEMO_TODAY)}. The most urgent case is always at the top.</p>
            <div aria-live="polite">
              {alerts.length > 0 && <p className="cx-alert"><strong>{alerts.length} {alerts.length === 1 ? 'case needs' : 'cases need'} attention:</strong> {alerts.map((item) => item.id).join(', ')}. In a live set-up this is the email or message that reaches you.</p>}
            </div>
            <div className="cx-table-wrap">
              <table className="cx-table">
                <caption className="s-visually-hidden">Demo complaint cases, most urgent first</caption>
                <thead><tr><th scope="col">Case</th><th scope="col">About</th><th scope="col">Stage</th><th scope="col">Next date</th><th scope="col">Status</th></tr></thead>
                <tbody>
                  {sorted.map((item) => {
                    const health = caseHealth(item);
                    return (
                      <tr key={item.id}>
                        <th scope="row">{item.id}<span>{item.client}</span></th>
                        <td>{item.summary}</td>
                        <td>
                          <label className="s-visually-hidden" htmlFor={`${uid}-st-${item.id}`}>Stage for {item.id}</label>
                          <select id={`${uid}-st-${item.id}`} value={item.stage} onChange={(event) => setCases(cases.map((row) => row.id === item.id ? { ...row, stage: event.target.value as DemoCase['stage'] } : row))}>
                            {STAGES.map((stage) => <option key={stage}>{stage}</option>)}
                          </select>
                        </td>
                        <td>{health.target === 'acknowledge' ? 'Acknowledge' : 'Reply'} by {day(health.due)}</td>
                        <td><span className={`cx-pill is-${health.health}`}>{HEALTH_LABEL[health.health]}{health.health === 'overdue' ? ` by ${Math.abs(health.daysLeft)} working ${Math.abs(health.daysLeft) === 1 ? 'day' : 'days'}` : health.health === 'due-soon' ? ` · ${health.daysLeft} working ${health.daysLeft === 1 ? 'day' : 'days'} left` : ''}</span></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}

        {tab === 'reply' && (
          <>
            <p className="cx-note">A first draft comes from your own template wording. Nothing goes out until a person reads it and approves it.</p>
            <div className="cx-field">
              <label htmlFor={`${uid}-case`}>Which case?</label>
              <select id={`${uid}-case`} value={replyCase.id} onChange={(event) => setReplyId(event.target.value)}>
                {cases.map((item) => <option key={item.id} value={item.id}>{item.id} · {item.category}</option>)}
              </select>
            </div>
            <p className="cx-label">Draft reply</p>
            <pre>{draftReply(replyCase)}</pre>
            <div className="cx-actions">
              <button className="button button-signal" type="button" aria-pressed={isApproved} onClick={() => setApproved(isApproved ? approved.filter((id) => id !== replyCase.id) : [...approved, replyCase.id])}>{isApproved ? 'Approved by you ✓' : 'Approve and send'}</button>
            </div>
            <p className="cx-note" aria-live="polite">{isApproved ? 'In a live set-up this is the moment it sends, and the approval is saved on the case.' : 'Not sent. The bracketed parts are for you to fill in.'}</p>
          </>
        )}

        {tab === 'trends' && (
          <>
            <p className="cx-note">Counts update as you log cases. Repeated causes show up before they become a habit.</p>
            <ul className="cx-bars">
              {CATEGORIES.map((name) => (
                <li key={name}>
                  <span className="cx-bar-label">{name}</span>
                  <span className="cx-bar-track" aria-hidden="true"><i style={{ width: `${(counts[name] / top) * 100}%` }} /></span>
                  <strong>{counts[name]}<span className="s-visually-hidden"> {counts[name] === 1 ? 'case' : 'cases'}</span></strong>
                </li>
              ))}
            </ul>
            <p className="cx-note">{cases.length} cases in this demo. A live monthly summary uses your real log.</p>
          </>
        )}
      </div>
    </div>
  );
}
