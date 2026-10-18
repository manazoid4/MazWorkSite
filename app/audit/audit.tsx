'use client';

import { useEffect, useId, useRef, useState, type FormEvent } from 'react';
import { CHECK_REPLY_TIME, CONTACT_EMAIL, MAIN_CTA } from '../site';
import { FREE_STEP, formatPrice } from '../offers';
import { buildRecoveryMailto, sendPlanEnquiry } from '../enquiry';
import { rememberedAttribution, rememberedCampaign } from '../linkedin-source';
import { enquirySource, safeEnquiryPageUrl } from '../trade-context';
import { trackConversion } from '../analytics';
import { DEFAULT_RATE, DEFAULT_SHARE, TASKS, TOOLS, WORKING_WEEKS, audit, storeAudit, summarise, type TaskId } from './model';
import '../interactive.css';
import '../b2b.css';

const EMAIL_PATTERN = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
const SUBJECT = 'Maz Works — free automation audit';
type Send = 'idle' | 'sending' | 'sent' | 'error';

/**
 * Free automation audit. The estimate shows straight away with no contact
 * details; the personal plan is an optional second step. Hours come from the
 * visitor, so does the value of their time, and the one assumption (how much can
 * be automated) is a slider they can change.
 */
export function AutomationAudit({ page = 'audit' }: { page?: string }) {
  const uid = useId();
  const requestId = useRef('');
  const sending = useRef(false);
  const [tools, setTools] = useState<string[]>([]);
  const [hours, setHours] = useState<Partial<Record<TaskId, number>>>({});
  const [rate, setRate] = useState(DEFAULT_RATE);
  const [share, setShare] = useState(DEFAULT_SHARE);
  const [send, setSend] = useState<Send>('idle');
  const [message, setMessage] = useState('');
  const [recovery, setRecovery] = useState(`mailto:${CONTACT_EMAIL}`);

  useEffect(() => { requestId.current = crypto.randomUUID(); }, []);

  const entries = TASKS.flatMap((task) => (hours[task.id] ? [{ id: task.id, hours: hours[task.id]! }] : []));
  const result = audit(entries, rate, share);
  const summary = summarise(entries, rate, share, tools);

  useEffect(() => { if (entries.length) storeAudit(summary); }, [entries.length, summary]);

  function toggleTask(id: TaskId, hoursDefault: number) {
    setHours((current) => { const next = { ...current }; if (next[id]) delete next[id]; else next[id] = hoursDefault; return next; });
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending.current) return;
    const data = new FormData(event.currentTarget);
    const name = String(data.get('name') || '').trim();
    const email = String(data.get('email') || '').trim();
    const website = String(data.get('website') || '').trim();
    const honey = String(data.get('_honey') || '').trim();
    if (!name) { setSend('error'); setMessage('Add your name so I know who to reply to.'); return; }
    if (!EMAIL_PATTERN.test(email)) { setSend('error'); setMessage('That email looks incomplete. It should look like name@example.co.uk.'); return; }
    const source = enquirySource(window.location.search, rememberedCampaign(), page);
    setRecovery(buildRecoveryMailto(SUBJECT, [['Name', name], ['Email', email], ['Website', website], ['Audit', summary], ['Source', source]]));
    setSend('sending'); sending.current = true;
    const response = await sendPlanEnquiry({ request_id: requestId.current, name, email, website, service: FREE_STEP.name, problem: summary, customer_message: '', next_step: 'Send a free preview and fixed price; not an order', source, attribution: rememberedAttribution(), _replyto: email, _subject: SUBJECT, _template: 'table', _honey: honey, _url: safeEnquiryPageUrl(window.location.href) });
    sending.current = false;
    if (response.ok) { setSend('sent'); trackConversion('Form submitted', { source }); requestId.current = crypto.randomUUID(); return; }
    setSend('error');
    setMessage(response.status === 429 ? 'Lots of requests just now. Please wait a minute and try again.' : response.reason === 'timeout' ? 'That took too long to send.' : 'That could not reach me — your connection may have dropped.');
  }

  return (
    <div className="ce" style={{ maxWidth: '44rem' }} role="group" aria-labelledby={`${uid}-t`}>
      <h3 id={`${uid}-t`}>Which repeat jobs are costing you time?</h3>
      <p className="ce-lede">Takes about a minute. The estimate shows straight away, with nothing to sign up for.</p>

      <fieldset className="au-tasks">
        <legend className="ce-label">1. Tools you use today (optional)</legend>
        <div className="ce-chips">
          {TOOLS.map((tool) => (
            <label key={tool} className={`ce-chip${tools.includes(tool) ? ' is-on' : ''}`}>
              <input className="ce-chip-input" type="checkbox" checked={tools.includes(tool)} onChange={() => setTools(tools.includes(tool) ? tools.filter((item) => item !== tool) : [...tools, tool])} />{tool}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="au-tasks">
        <legend className="ce-label">2. Tick what applies, then set hours a week</legend>
        {TASKS.map((task) => {
          const on = hours[task.id] !== undefined;
          return (
            <div key={task.id} className={`au-task${on ? ' is-on' : ''}`}>
              <label className="au-check"><input type="checkbox" checked={on} onChange={() => toggleTask(task.id, task.hours)} /><span>{task.label}<small>{task.hint}</small></span></label>
              {on && (
                <div className="ce-slider">
                  <label htmlFor={`${uid}-${task.id}`}><span>Hours a week</span><output htmlFor={`${uid}-${task.id}`}>{hours[task.id]}</output></label>
                  <input id={`${uid}-${task.id}`} type="range" min={1} max={20} step={1} value={hours[task.id]} onChange={(event) => setHours({ ...hours, [task.id]: Number(event.target.value) })} style={{ ['--fill' as string]: `${((hours[task.id]! - 1) / 19) * 100}%` }} />
                </div>
              )}
            </div>
          );
        })}
      </fieldset>

      <div className="au-assume">
        <p className="ce-label"><span>3. Check the assumptions. Change them to suit you.</span></p>
        <div className="ce-slider">
          <label htmlFor={`${uid}-rate`}><span>What an hour of your team’s time is worth</span><output htmlFor={`${uid}-rate`}>{formatPrice(rate)}</output></label>
          <input id={`${uid}-rate`} type="range" min={10} max={150} step={5} value={rate} onChange={(event) => setRate(Number(event.target.value))} style={{ ['--fill' as string]: `${((rate - 10) / 140) * 100}%` }} />
        </div>
        <div className="ce-slider">
          <label htmlFor={`${uid}-share`}><span>Share of that work that could be automated</span><output htmlFor={`${uid}-share`}>{share}%</output></label>
          <input id={`${uid}-share`} type="range" min={10} max={80} step={5} value={share} onChange={(event) => setShare(Number(event.target.value))} style={{ ['--fill' as string]: `${((share - 10) / 70) * 100}%` }} />
        </div>
        <p className="s-small">The sum: hours a week × {WORKING_WEEKS} working weeks × share automated × hourly value. The 50% start point is a cautious guess, not a measured result. Your own jobs may be higher or lower.</p>
      </div>

      <div className="ce-result is-ready" aria-live="polite">
        {entries.length === 0 ? <p className="ce-hint">Tick at least one job to see your estimate.</p> : (
          <>
            <p className="au-total">{result.yearHours.toLocaleString('en-GB')} hours a year</p>
            <p className="ce-line">on the jobs you ticked. If {share}% of that could be automated, that is about <strong>{result.savedHours.toLocaleString('en-GB')} hours</strong>, or <strong>{formatPrice(result.savedValue)}</strong> of time at {formatPrice(rate)} an hour. An estimate from your own numbers, not a promise of savings.</p>
            <h4>Three places to start</h4>
            <ul className="au-recs">
              {result.recommended.map((item) => (
                <li key={item.name}><strong>{item.name} · {item.price}</strong><span>{item.why} (You said {item.hours} {item.hours === 1 ? 'hour' : 'hours'} a week on the related job.)</span><a href={item.href}>See details →</a></li>
              ))}
            </ul>

            <h4>Want this as a personal plan?</h4>
            {send === 'sent' ? <p role="status"><strong>Thanks, I’ve got it.</strong> I’ll read it myself and reply within {CHECK_REPLY_TIME} with a plan and a fixed price.</p> : (
              <>
                <form className="s-quick-form" onSubmit={submit} noValidate>
                  <div className="s-quick-fields">
                    <input name="name" autoComplete="name" placeholder="Your name" aria-label="Your name" required disabled={send === 'sending'} />
                    <input name="email" type="email" autoComplete="email" inputMode="email" placeholder="you@business.co.uk" aria-label="Work email" required disabled={send === 'sending'} />
                    <input name="website" autoComplete="url" placeholder="Website (optional)" aria-label="Website (optional)" disabled={send === 'sending'} />
                    <button className="button button-signal" type="submit" disabled={send === 'sending'}>{send === 'sending' ? 'Sending…' : 'Send me my plan'}</button>
                  </div>
                  <label className="mw-honeypot" aria-hidden="true"><input name="_honey" tabIndex={-1} autoComplete="off" /></label>
                </form>
                <p className="s-note">I use your details only to reply to this. See the <a href="/privacy">privacy page</a>. Free, no obligation. Prefer the full form? <a href="/free-plan?audit=1&src=audit#leak-check-form">{MAIN_CTA}</a>.</p>
                {send === 'error' && <p className="s-quick-status" role="status">{message} <a href={recovery}>Send it by email instead</a>.</p>}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
