'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { CHECK_REPLY_TIME, CONTACT_EMAIL, MAIN_CTA, PREVIEW_TIME } from '../site';
import { FREE_STEP, OFFERS, formatPrice, priceAmount } from '../offers';
import { NATIVE_FORM_ENDPOINT, buildRecoveryMailto, sendPlanEnquiry } from '../enquiry';
import { rememberedCampaign } from '../linkedin-source';
import { enquirySource, safeEnquiryPageUrl } from '../trade-context';
import { trackConversion } from '../analytics';
import '../interactive.css';

/**
 * Missed-calls calculator (CRO Move 5, 18 Oct 2026). A section of /local-businesses, and the
 * result is gated: you see your number once you leave an email and a name, the
 * same two fields as the hero, posted to the same place as the /contact free-preview form. The
 * numbers are the visitor's own; nothing is saved and no industry figure is
 * assumed. Every price comes from offers.ts.
 */
const SHARES = [10, 20, 30, 50];
const EMAIL_PATTERN = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
const SUBJECT = 'Maz Works — missed-calls calculator';
const NEXT_STEP = 'Send a free preview and fixed price; not an order';
const AUTO_REPLY = `Thanks, I've got your request. I'll reply within ${CHECK_REPLY_TIME}, then send one focused preview and a fixed price, usually within ${PREVIEW_TIME}. No call needed and no obligation. Manazir, Maz Works`;

function Slider({ id, label, value, max, step, money, name, onChange }: { id: string; label: string; value: number; max: number; step: number; money?: boolean; name: string; onChange: (value: number) => void }) {
  return (
    <div className="ce-slider">
      <label htmlFor={id}><span>{label}</span><output htmlFor={id}>{money ? formatPrice(value) : value}</output></label>
      <input id={id} type="range" name={name} min={0} max={max} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} style={{ ['--fill' as string]: `${(value / max) * 100}%` }} />
    </div>
  );
}

type Gate = 'locked' | 'sending' | 'open' | 'error';

export function MissedCallsCalculator() {
  const requestId = useRef('');
  const sending = useRef(false);
  const [perWeek, setPerWeek] = useState(8);
  const [share, setShare] = useState(20);
  const [value, setValue] = useState(250);
  const [gate, setGate] = useState<Gate>('locked');
  const [message, setMessage] = useState('');
  const [hydrated, setHydrated] = useState(false);
  const [recoveryHref, setRecoveryHref] = useState(`mailto:${CONTACT_EMAIL}`);

  useEffect(() => { setHydrated(true); requestId.current = crypto.randomUUID(); }, []);

  const ready = perWeek > 0 && share > 0 && value > 0;
  const monthly = ready ? Math.round((perWeek * (share / 100) * value * 52) / 12) : 0;
  const yearly = monthly * 12;
  const STARTER = OFFERS[0];
  const starter = priceAmount(STARTER.price);
  const days = monthly > 0 ? Math.max(1, Math.ceil(starter / (monthly / 30))) : 0;
  const costShare = monthly > 0 ? Math.min(100, Math.max(4, (starter / monthly) * 100)) : 0;
  const numbers = `${perWeek} calls a week, ${share}% missed, ${formatPrice(value)} a job — about ${formatPrice(monthly)} a month (${formatPrice(yearly)} a year) at risk by your own numbers.`;

  async function unlock(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending.current || gate === 'sending') return;
    const data = new FormData(event.currentTarget);
    const email = String(data.get('email') || '').trim();
    const name = String(data.get('name') || '').trim();
    const honey = String(data.get('_honey') || '').trim();
    const source = enquirySource(window.location.search, rememberedCampaign(), 'missed-calls-calculator');

    if (!name) { setGate('error'); setMessage('Add your name so I know who to reply to.'); return; }
    if (!EMAIL_PATTERN.test(email)) { setGate('error'); setMessage('That email looks incomplete. It should look like name@example.co.uk.'); return; }

    setRecoveryHref(buildRecoveryMailto(SUBJECT, [['Name', name], ['Email', email], ['Their numbers', numbers], ['Source', source]]));
    setGate('sending');
    sending.current = true;

    const result = await sendPlanEnquiry({
      request_id: requestId.current,
      name,
      email,
      service: FREE_STEP.name,
      problem: `Missed-calls calculator: ${numbers}`,
      customer_message: '',
      next_step: NEXT_STEP,
      source,
      _replyto: email,
      _subject: SUBJECT,
      _template: 'table',
      _honey: honey,
      _url: safeEnquiryPageUrl(window.location.href),
    });
    sending.current = false;

    if (result.ok) {
      setGate('open');
      trackConversion('Form submitted', { source });
      if (result.confirmationSent) trackConversion('Confirmation sent', { source });
      requestId.current = crypto.randomUUID();
      return;
    }
    setGate('error');
    setMessage(result.status === 429 ? 'Lots of requests just now. Please wait a minute and try again.' : result.reason === 'timeout' ? 'That took too long to send.' : 'That could not reach me — your connection may have dropped.');
  }

  return (
    <div className="ce" role="group" aria-labelledby="mcc-title">
      <p className="eyebrow">Your numbers, your estimate</p>
      <h3 id="mcc-title">What are missed calls costing you?</h3>
      <p className="ce-lede">Drag the sliders to your week. Nothing is saved, and nothing is sent until you ask for the number.</p>

      <Slider id="mcc-week" label="Calls or enquiries you get a week" value={perWeek} max={60} step={1} name="Calls a week" onChange={setPerWeek} />
      <div className="ce-slider">
        <p className="ce-label" id="mcc-share-label"><span>How many slip away?</span><output>{share ? `${share}%` : 'Tap one'}</output></p>
        <div className="ce-chips" role="radiogroup" aria-labelledby="mcc-share-label">
          {SHARES.map((option) => (
            <label key={option} className={`ce-chip${share === option ? ' is-on' : ''}`}>
              <input className="ce-chip-input" type="radio" name="Share missed" value={`${option}%`} checked={share === option} onChange={() => setShare(option)} />
              {option}%
            </label>
          ))}
        </div>
      </div>
      <Slider id="mcc-value" label="What a job is worth" value={value} max={1000} step={10} money name="Value of a job" onChange={setValue} />

      <div className={`ce-result${gate === 'open' ? ' is-ready' : ''}`} aria-live="polite">
        {gate === 'open' ? (
          <>
            <p className="ce-big"><strong>{formatPrice(monthly)}</strong><span> a month</span></p>
            <p className="ce-line">by your own numbers. That is about {formatPrice(yearly)} a year.</p>
            <div className="ce-bars" aria-hidden="true">
              <div><span>Lost each month</span><i style={{ width: '100%' }} /></div>
              <div><span>{STARTER.name}, once</span><i className="ce-bar-cost" style={{ width: `${costShare}%` }} /></div>
            </div>
            <p className="ce-pay">{days > 365 ? `${STARTER.name} would take over a year to pay for itself on these numbers.` : `${STARTER.name} (${STARTER.price}) would pay for itself in about ${days} ${days === 1 ? 'day' : 'days'}.`}</p>
            <a className="button button-signal" href={`/contact?intent=preview&package=${encodeURIComponent(STARTER.name)}&src=missed-calls-calculator#leak-check-form`}>{MAIN_CTA}</a>
          </>
        ) : ready ? (
          <>
            <p className="ce-big"><strong>???</strong><span> a month</span></p>
            <p className="ce-line">Your number is one step away. Where should I send it?</p>
            <form className="s-quick-form" action={NATIVE_FORM_ENDPOINT} method="post" onSubmit={unlock} noValidate={hydrated}>
              <input type="hidden" name="_subject" value={SUBJECT} />
              <input type="hidden" name="_template" value="table" />
              <input type="hidden" name="_autoresponse" value={AUTO_REPLY} />
              <input type="hidden" name="service" value={FREE_STEP.name} />
              <input type="hidden" name="problem" value="Missed-calls calculator: the visitor's figures are in the Calls a week, Share missed and Value of a job fields above." />
              <input type="hidden" name="next_step" value={NEXT_STEP} />
              <div className="s-quick-fields">
                <input name="email" type="email" autoComplete="email" inputMode="email" placeholder="you@business.co.uk" aria-label="Email" required disabled={gate === 'sending'} />
                <input name="name" autoComplete="name" placeholder="Your name" aria-label="Your name" required disabled={gate === 'sending'} />
                <button className="button button-signal" type="submit" disabled={gate === 'sending'}>{gate === 'sending' ? 'Sending…' : 'Show my number'}</button>
              </div>
              <label className="mw-honeypot" aria-hidden="true"><input name="_honey" tabIndex={-1} autoComplete="off" /></label>
            </form>
            <p className="s-note">Same as the free preview form: I read it myself and reply within {CHECK_REPLY_TIME}. No obligation.</p>
            {gate === 'error' && <p className="s-quick-status" role="status">{message} <a href={recoveryHref}>Send it by email instead</a>.</p>}
          </>
        ) : (
          <p className="ce-hint">Move the sliders to see your number. The sum: calls a week × share missed × job value × 52 ÷ 12.</p>
        )}
      </div>
      <p className="s-small">An estimate from what you entered, not a promise of results.</p>
    </div>
  );
}
