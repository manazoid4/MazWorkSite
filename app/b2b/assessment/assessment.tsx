'use client';

import { useEffect, useId, useRef, useState, type FormEvent } from 'react';
import { CHECK_REPLY_TIME, CONTACT_EMAIL, MAIN_CTA } from '../../site';
import { FREE_STEP, formatPrice } from '../../offers';
import { buildRecoveryMailto, sendPlanEnquiry } from '../../enquiry';
import { rememberedAttribution, rememberedCampaign } from '../../linkedin-source';
import { enquirySource, safeEnquiryPageUrl } from '../../trade-context';
import { trackConversion } from '../../analytics';
import { BookCall } from '../../booking-modal';
import {
  AREA_LABEL,
  DEFAULT_RATE,
  DEFAULT_SHARE,
  QUESTIONS,
  RATE_OPTIONS,
  SHARE_OPTIONS,
  WORKING_WEEKS,
  assess,
  isComplete,
  selected,
  summarise,
  type Answers,
} from './model';
import '../../b2b.css';
import './assessment.css';

const EMAIL_PATTERN = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
const SUBJECT = 'Maz Works — free business assessment';
type Send = 'idle' | 'sending' | 'sent' | 'error';

/**
 * The free business assessment. One question at a time so it works on a phone,
 * an instant result before any contact details, and a plain-text summary that is
 * the same whether it stays on screen or becomes an enquiry.
 */
export function BusinessAssessment() {
  const uid = useId();
  const requestId = useRef('');
  const sending = useRef(false);
  const started = useRef(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const [answers, setAnswers] = useState<Answers>({});
  const [step, setStep] = useState(0);
  const [rate, setRate] = useState<number>(DEFAULT_RATE);
  const [share, setShare] = useState<number>(DEFAULT_SHARE);
  const [showResult, setShowResult] = useState(false);
  const [send, setSend] = useState<Send>('idle');
  const [message, setMessage] = useState('');
  const [recovery, setRecovery] = useState(`mailto:${CONTACT_EMAIL}`);

  useEffect(() => { requestId.current = crypto.randomUUID(); }, []);

  const question = QUESTIONS[step];
  const answer = answers[question.id];
  const result = assess(answers, rate, share);
  const complete = isComplete(answers);

  function choose(id: string) {
    if (!started.current) {
      started.current = true;
      trackConversion('Assessment started', { page: 'b2b-assessment' });
    }
    setAnswers((current) => ({ ...current, [question.id]: id }));
    if (send === 'error') { setSend('idle'); setMessage(''); }
  }

  function next() {
    if (!answer) return;
    if (step < QUESTIONS.length - 1) {
      setStep(step + 1);
      window.setTimeout(() => heading.current?.focus(), 0);
      return;
    }
    if (!isComplete(answers)) return;
    setShowResult(true);
    trackConversion('Assessment completed', {
      score: String(result.score),
      top: result.topArea || 'none',
      attribution: rememberedAttribution(),
    });
    window.setTimeout(() => document.getElementById('assessment-result')?.focus(), 0);
  }

  function back() {
    setStep((current) => Math.max(0, current - 1));
    window.setTimeout(() => heading.current?.focus(), 0);
  }

  function restart() {
    setAnswers({}); setStep(0); setShowResult(false); setSend('idle'); setMessage('');
    window.setTimeout(() => heading.current?.focus(), 0);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending.current) return;
    const data = new FormData(event.currentTarget);
    const name = String(data.get('name') || '').trim();
    const email = String(data.get('email') || '').trim();
    const website = String(data.get('website') || '').trim();
    const note = String(data.get('note') || '').trim();
    const honey = String(data.get('_honey') || '').trim();
    if (!name) { setSend('error'); setMessage('Add your name so I know who to reply to.'); return; }
    if (!EMAIL_PATTERN.test(email)) { setSend('error'); setMessage('That email looks incomplete. It should look like name@example.co.uk.'); return; }

    const summary = summarise(answers, rate, share);
    const problem = [summary, note ? `Their note: ${note}` : ''].filter(Boolean).join('\n\n');
    const source = enquirySource(window.location.search, rememberedCampaign(), 'b2b-assessment');
    setRecovery(buildRecoveryMailto(SUBJECT, [['Name', name], ['Email', email], ['Website', website], ['Assessment', summary], ['Note', note], ['Source', source]]));
    setSend('sending'); sending.current = true;
    const response = await sendPlanEnquiry({
      request_id: requestId.current,
      name,
      email,
      website,
      service: FREE_STEP.name,
      problem,
      customer_message: note,
      interested_in: result.recommendations[0]?.name || 'Not sure yet',
      next_step: 'Send a fixed-scope plan based on the assessment; not an order',
      source,
      attribution: rememberedAttribution(),
      _replyto: email,
      _subject: SUBJECT,
      _template: 'table',
      _honey: honey,
      _url: safeEnquiryPageUrl(window.location.href),
    });
    sending.current = false;
    if (response.ok) {
      setSend('sent');
      trackConversion('Assessment submitted', { score: String(result.score), top: result.topArea || 'none', source });
      requestId.current = crypto.randomUUID();
      return;
    }
    setSend('error');
    setMessage(response.status === 429 ? 'Lots of requests just now. Please wait a minute and try again.' : response.reason === 'timeout' ? 'That took too long to send.' : 'That could not reach me — your connection may have dropped.');
  }

  if (showResult) {
    const top = result.recommendations[0];
    return (
      <div className="as as-result-wrap" id="assessment-result" tabIndex={-1} aria-labelledby={`${uid}-result-title`}>
        <div className="as-result" aria-live="polite">
          <div className="as-score">
            <p className="as-kicker">Your result</p>
            <p className="as-band">{result.band.label}</p>
            <p className="as-score-num"><strong>{result.score}</strong><span>/100</span></p>
            <h2 id={`${uid}-result-title`}>{result.band.note}</h2>
            <p className="as-score-note">Based only on your six answers. It is an estimate, not a benchmark or a promise of savings.</p>
          </div>

          <div className="as-metrics">
            <div><strong>{result.weeklyHours}h</strong><span>a week on the jobs you picked</span></div>
            <div><strong>{result.yearHours.toLocaleString('en-GB')}h</strong><span>a year, at {WORKING_WEEKS} working weeks</span></div>
            <div><strong>{formatPrice(result.savedValue)}</strong><span>time value if {share}% is removed, at {formatPrice(rate)}/h</span></div>
          </div>

          <div className="as-assumptions">
            <p className="as-kicker">Change the assumptions</p>
            <div className="as-assumption-row">
              <label htmlFor={`${uid}-rate`}>What an hour of your team’s time is worth</label>
              <select id={`${uid}-rate`} value={rate} onChange={(event) => setRate(Number(event.target.value))}>
                {RATE_OPTIONS.map((value) => <option key={value} value={value}>{formatPrice(value)}</option>)}
              </select>
            </div>
            <div className="as-assumption-row">
              <label htmlFor={`${uid}-share`}>Share of that admin that could be removed</label>
              <select id={`${uid}-share`} value={share} onChange={(event) => setShare(Number(event.target.value))}>
                {SHARE_OPTIONS.map((value) => <option key={value} value={value}>{value}%</option>)}
              </select>
            </div>
            <p className="as-fine">The sum: hours a week × {WORKING_WEEKS} working weeks × {share}% × {formatPrice(rate)}. The planning assumption is a cautious guess, not a measured result.</p>
          </div>
        </div>

        <div className="as-next">
          <h3>Where to start</h3>
          {result.recommendations.length ? (
            <ul className="as-recs">
              {result.recommendations.map((item) => (
                <li key={item.name}>
                  <span className="as-rec-tag">{AREA_LABEL[item.area]} · about {item.hours}h a week</span>
                  <strong>{item.name}</strong>
                  <span className="as-rec-price">{item.price}</span>
                  <p>{item.why}</p>
                  <a href={item.href}>See what it includes →</a>
                </li>
              ))}
            </ul>
          ) : (
            <div className="as-empty">
              <p><strong>Nothing here looks worth buying yet.</strong> Your answers point to admin that is already joined up, or too small to justify a build. The free fixes below are still worth doing.</p>
              <p>If you want a second opinion, book a short call and I will tell you honestly if there is a job worth automating.</p>
            </div>
          )}

          {result.firstFixes.length > 0 && (
            <>
              <h3>Three things you can do this week, free</h3>
              <ol className="as-fixes">{result.firstFixes.map((fix) => <li key={fix}>{fix}</li>)}</ol>
            </>
          )}

          <div className="as-actions">
            <a className="button button-signal" href="#send-assessment">Send me this assessment</a>
            <BookCall className="button button-dark" interest={top ? top.name : 'Business assessment'}>Book a 15-Minute Call</BookCall>
            <button type="button" className="button as-print" onClick={() => window.print()}>Print or save a copy</button>
          </div>

          <details className="as-review">
            <summary>Review your answers</summary>
            <dl>
              {selected(answers).map((item) => (
                <div key={item.question.id}><dt>{AREA_LABEL[item.question.id]}</dt><dd>{item.option.label}</dd></div>
              ))}
            </dl>
            <button type="button" className="text-link" onClick={restart}>Start again</button>
          </details>

          <div className="as-send" id="send-assessment">
            <h3>Want a fixed-scope plan based on this?</h3>
            <p>Send the result to me. I read it myself and reply within {CHECK_REPLY_TIME} with a written scope, a fixed price and what I would leave alone. No call needed, no obligation.</p>
            {send === 'sent' ? (
              <p className="as-sent" role="status"><strong>Got it, thank you.</strong> Check your inbox for a copy. I will reply within {CHECK_REPLY_TIME} with a plan and a fixed price. If it has not arrived by then, check your junk folder or email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.</p>
            ) : (
              <form className="as-form" onSubmit={submit} noValidate>
                <div className="as-form-row">
                  <label>Your name<input name="name" autoComplete="name" required disabled={send === 'sending'} /></label>
                  <label>Work email<input name="email" type="email" inputMode="email" autoComplete="email" placeholder="you@business.co.uk" required disabled={send === 'sending'} /></label>
                </div>
                <label>Business name or website <small>(optional)</small><input name="website" autoComplete="url" disabled={send === 'sending'} /></label>
                <label>Anything I should know? <small>(optional)</small><textarea name="note" rows={3} placeholder="For example: the busiest team, a deadline, or the system you already use." disabled={send === 'sending'} /></label>
                <label className="mw-honeypot" aria-hidden="true"><input name="_honey" tabIndex={-1} autoComplete="off" /></label>
                <button className="button button-signal" type="submit" disabled={send === 'sending'}>{send === 'sending' ? 'Sending…' : 'Send me my plan'}</button>
                <p className="as-fine">I use your details only to reply to this. See the <a href="/privacy">privacy page</a>. Free, no obligation.</p>
                {send === 'error' && <p className="as-error" role="status">{message} <a href={recovery}>Send it by email instead</a>.</p>}
              </form>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="as" role="group" aria-labelledby={`${uid}-title`}>
      <div className="as-progress">
        <p><span>Question {step + 1} of {QUESTIONS.length}</span><span>About 2 minutes</span></p>
        <div className="as-track" role="progressbar" aria-valuemin={1} aria-valuemax={QUESTIONS.length} aria-valuenow={step + 1} aria-label="Assessment progress"><i style={{ width: `${((step + 1) / QUESTIONS.length) * 100}%` }} /></div>
      </div>

      <div className="as-question">
        <p className="as-kicker">{AREA_LABEL[question.id]}</p>
        <h2 id={`${uid}-title`} ref={heading} tabIndex={-1}>{question.title}</h2>
        <p className="as-hint">{question.hint}</p>
        <fieldset className="as-options">
          <legend className="s-visually-hidden">{question.title}</legend>
          {question.options.map((option) => (
            <label key={option.id} className={`as-option${answer === option.id ? ' is-on' : ''}`}>
              <input type="radio" name={`${uid}-${question.id}`} value={option.id} checked={answer === option.id} onChange={() => choose(option.id)} />
              <span>
                <strong>{option.label}</strong>
                <small>{option.na ? 'Not applicable' : option.hours > 0 ? `about ${option.hours}h a week` : 'already joined up'}</small>
              </span>
            </label>
          ))}
        </fieldset>
        <div className="as-nav">
          {step > 0 ? <button type="button" className="button" onClick={back}>Back</button> : <span />}
          <button type="button" className="button button-signal" onClick={next} disabled={!answer}>{step === QUESTIONS.length - 1 ? 'See my result' : 'Next question'}</button>
        </div>
        <p className="as-fine">No contact details needed. Your answers stay in this browser until you choose to send them.</p>
      </div>
    </div>
  );
}
