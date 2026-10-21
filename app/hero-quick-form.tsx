'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { BOOKING_URL, CHECK_REPLY_TIME, CONTACT_EMAIL, MAIN_CTA } from './site';
import { CallLink, trackConversion } from './analytics';
import { NATIVE_FORM_ENDPOINT, buildRecoveryMailto, sendPlanEnquiry } from './enquiry';
import { FREE_STEP } from './offers';
import { rememberedCampaign } from './linkedin-source';
import { enquirySource, safeEnquiryPageUrl } from './trade-context';

/**
 * CRO Move 3 (18 Oct): a two-field start in the hero, email first then name,
 * posting to the same place as /contact (api/enquiry, FormSubmit fallback).
 * A visitor who is not ready to describe the job can still start in one tap.
 * The job detail arrives by reply, so the hero does not ask for an essay.
 */
const DEFAULT_PROBLEM = 'Quick request from the homepage hero. Send a working preview and a fixed price; I will add the job details by reply.';
const NEXT_STEP = 'Send a free preview and fixed price; not an order';
const SUBJECT = 'Maz Works — free preview and price';
const AUTO_REPLY = `Thanks, I've got your request. I'll email you a working preview with your business name and a fixed price, usually within ${CHECK_REPLY_TIME}. No call needed and no obligation. Manazir, Maz Works`;

// The browser's own type=email rule, plus a dot in the domain so "sam@gmail" is caught too.
const EMAIL_PATTERN = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

type State = 'idle' | 'sending' | 'sent' | 'error';

export function HeroQuickForm() {
  const requestId = useRef('');
  const sending = useRef(false);
  const formRef = useRef<HTMLFormElement>(null);
  const [hydrated, setHydrated] = useState(false);
  const [state, setState] = useState<State>('idle');
  const [message, setMessage] = useState('');
  const [recoveryHref, setRecoveryHref] = useState(`mailto:${CONTACT_EMAIL}`);

  useEffect(() => { setHydrated(true); requestId.current = crypto.randomUUID(); }, []);

  function focusField(name: string) {
    formRef.current?.querySelector<HTMLElement>(`[name="${name}"]`)?.focus();
  }

  async function submitRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending.current || state === 'sending') return;

    const form = event.currentTarget;
    const data = new FormData(form);
    const email = String(data.get('email') || '').trim();
    const name = String(data.get('name') || '').trim();
    const honey = String(data.get('_honey') || '').trim();
    const source = enquirySource(window.location.search, rememberedCampaign(), 'homepage');

    if (!name) { setState('error'); setMessage('Add your name so I know who to reply to.'); focusField('name'); return; }
    if (!EMAIL_PATTERN.test(email)) { setState('error'); setMessage('That email looks incomplete. It should look like name@example.co.uk.'); focusField('email'); return; }

    setRecoveryHref(buildRecoveryMailto(SUBJECT, [['Name', name], ['Email', email], ['The job', DEFAULT_PROBLEM], ['Source', source]]));
    setState('sending');
    sending.current = true;

    const result = await sendPlanEnquiry({
      request_id: requestId.current,
      name,
      email,
      service: FREE_STEP.name,
      problem: DEFAULT_PROBLEM,
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
      form.reset();
      setState('sent');
      trackConversion('Form submitted', { source });
      if (result.confirmationSent) trackConversion('Confirmation sent', { source });
      requestId.current = crypto.randomUUID();
      return;
    }

    setState('error');
    setMessage(result.status === 429 ? 'Lots of requests just now. Please wait a minute and try again.' : result.reason === 'timeout' ? 'That took too long to send.' : 'That could not reach me — your connection may have dropped.');
  }

  return (
    <form
      className="s-quick-form"
      id="hero-quick-form"
      action={NATIVE_FORM_ENDPOINT}
      method="post"
      ref={formRef}
      onSubmit={submitRequest}
      noValidate={hydrated}
    >
      <input type="hidden" name="_subject" value={SUBJECT} />
      <input type="hidden" name="_template" value="table" />
      <input type="hidden" name="_autoresponse" value={AUTO_REPLY} />
      <input type="hidden" name="service" value={FREE_STEP.name} />
      <input type="hidden" name="problem" value={DEFAULT_PROBLEM} />
      <input type="hidden" name="next_step" value={NEXT_STEP} />
      <div className="s-quick-fields">
        <input name="email" type="email" autoComplete="email" inputMode="email" placeholder="you@business.co.uk" aria-label="Email" required disabled={state === 'sending'} />
        <input name="name" autoComplete="name" placeholder="Your name" aria-label="Your name" required disabled={state === 'sending'} />
        <button className="button button-signal s-button-lg" type="submit" disabled={state === 'sending' || state === 'sent'}>
          {state === 'sending' ? 'Sending…' : MAIN_CTA}
        </button>
      </div>
      <label className="mw-honeypot" aria-hidden="true">
        <input name="_honey" tabIndex={-1} autoComplete="off" />
      </label>
      <p className="s-note">No working, no invoice. <CallLink href={BOOKING_URL} placement="hero-quick-form">Book a time now →</CallLink></p>
      <p className="s-quick-status" role="status" aria-live="polite">
        {state === 'sent' && <>✓ <strong>Got it, thank you.</strong> Check your inbox — I send your demo and fixed price from {CONTACT_EMAIL}, usually within {CHECK_REPLY_TIME}.</>}
        {state === 'error' && <>{message} <a href={recoveryHref}>Send it by email instead</a>.</>}
      </p>
    </form>
  );
}
