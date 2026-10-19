'use client';

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { CONTACT_EMAIL } from './site';
import { EnquiryRecovery } from './enquiry-recovery';
import { trackConversion } from './analytics';
import {
  DEFAULT_NEXT_STEP,
  DEFAULT_SERVICE_ID,
  ENQUIRY_NEXT_STEPS,
  ENQUIRY_SERVICES,
  NATIVE_FORM_ENDPOINT,
  buildRecoveryMailto,
  readServiceFromLocation,
  sendEnquiry,
  type EnquiryServiceId,
} from './enquiry';

type SubmitState = 'idle' | 'sending' | 'sent' | 'error';

const FAILURE_COPY: Record<'rejected' | 'timeout' | 'network', string> = {
  rejected: 'Delivery was not confirmed.',
  timeout: 'That took too long to send.',
  network: 'That could not reach me — your connection may have dropped.',
};

/** Links to the enquiry form with the service pre-selected, keeping typed text when the form is on this page. */
export function ServiceEnquiryLink({ service, children }: { service: string; children: ReactNode }) {
  return <a className="mw-service-link" href={`/contact?service=${service}#contact`} onClick={(event) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (!document.getElementById('contact')) return;
    event.preventDefault();
    window.history.pushState(null, '', `?service=${service}#contact`);
    window.dispatchEvent(new Event('maz-enquiry-service'));
    document.getElementById('contact')?.scrollIntoView();
    document.querySelector<HTMLElement>('.mw-demo-form [name="problem"]')?.focus({ preventScroll: true });
  }}>{children}</a>;
}

export function DemoRequestForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [service, setService] = useState<EnquiryServiceId>(DEFAULT_SERVICE_ID);
  const [submitState, setSubmitState] = useState<SubmitState>('idle');
  const [validationError, setValidationError] = useState('');
  const [invalidField, setInvalidField] = useState('');
  const [failureReason, setFailureReason] = useState<'rejected' | 'timeout' | 'network'>('rejected');
  const [recoveryHref, setRecoveryHref] = useState(`mailto:${CONTACT_EMAIL}`);

  useEffect(() => {
    const syncService = () => setService(readServiceFromLocation() ?? DEFAULT_SERVICE_ID);
    const selectedValue = formRef.current?.querySelector<HTMLSelectElement>('[name="service"]')?.value;
    const selectedService = ENQUIRY_SERVICES.find((option) => option.id === selectedValue)?.id;
    // Preserve a native selection made while the scripts were still loading.
    setService(selectedService && selectedService !== DEFAULT_SERVICE_ID ? selectedService : readServiceFromLocation() ?? DEFAULT_SERVICE_ID);
    window.addEventListener('maz-enquiry-service', syncService);
    window.addEventListener('popstate', syncService);
    return () => {
      window.removeEventListener('maz-enquiry-service', syncService);
      window.removeEventListener('popstate', syncService);
    };
  }, []);

  function focusField(name: string) {
    formRef.current?.querySelector<HTMLElement>(`[name="${name}"]`)?.focus();
  }

  async function submitRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitState === 'sending') return;

    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get('name') || '').trim();
    const email = String(data.get('email') || '').trim();
    const business = String(data.get('business') || '').trim();
    const problem = String(data.get('problem') || '').trim();
    const nextStep = String(data.get('nextStep') || DEFAULT_NEXT_STEP).trim();
    const honey = String(data.get('_honey') || '').trim();

    const missing = !name ? 'name' : !email ? 'email' : !problem ? 'problem' : '';
    if (missing) {
      setInvalidField(missing);
      setValidationError(
        missing === 'problem'
          ? 'Add a short description of what you want to improve.'
          : `Add your ${missing} so I can reply.`,
      );
      focusField(missing);
      return;
    }

    setValidationError('');
    setInvalidField('');

    const serviceLabel = ENQUIRY_SERVICES.find((option) => option.id === service)?.label ?? 'Not specified';
    const subject = `Maz Works — enquiry${business ? ` — ${business}` : ''} — ${serviceLabel}`;

    setRecoveryHref(buildRecoveryMailto(subject, [
      ['Name', name],
      ['Email', email],
      ['Business', business],
      ['Service', serviceLabel],
      ['What to improve', problem],
      ['Most useful next step', nextStep],
    ]));

    setSubmitState('sending');

    const result = await sendEnquiry({
      name,
      email,
      business: business || 'Not provided',
      service: serviceLabel,
      problem,
      next_step: nextStep,
      _replyto: email,
      _subject: subject,
      _template: 'table',
      _honey: honey,
      _url: window.location.href,
    });

    if (result.ok) {
      form.reset();
      setService(DEFAULT_SERVICE_ID);
      setSubmitState('sent');
      trackConversion('Enquiry sent', { service });
      return;
    }

    setFailureReason(result.reason);
    setSubmitState('error');
  }

  const selectedServiceLabel = ENQUIRY_SERVICES.find((option) => option.id === service)?.label ?? 'Not sure yet';

  return (
    <form className="mw-demo-form" action={NATIVE_FORM_ENDPOINT} method="post" ref={formRef} onSubmit={submitRequest} onInput={(event) => {
      if ((event.target as HTMLInputElement).name === invalidField) {
        setInvalidField('');
        setValidationError('');
      }
    }}>
      <input type="hidden" name="_subject" value="Maz Works — business enquiry" />
      <input type="hidden" name="_template" value="table" />
      <p className="mw-form-kicker">Just your name, email and what you want to improve. No service choice needed.</p>
      <div className="mw-form-row">
        <label>
          <span>Name</span>
          <input name="name" autoComplete="name" required aria-invalid={invalidField === 'name' || undefined} aria-describedby={invalidField === 'name' ? 'business-enquiry-error' : undefined} disabled={submitState === 'sending'} />
        </label>
        <label>
          <span>Email</span>
          <input name="email" type="email" autoComplete="email" required aria-invalid={invalidField === 'email' || undefined} aria-describedby={invalidField === 'email' ? 'business-enquiry-error' : undefined} disabled={submitState === 'sending'} />
        </label>
      </div>

      <label>
        <span>What do you need help with?</span>
        <textarea
          name="problem"
          aria-invalid={invalidField === 'problem' || undefined}
          aria-describedby={invalidField === 'problem' ? 'business-enquiry-error' : undefined}
          rows={5}
          required
          disabled={submitState === 'sending'}
          placeholder="For example: I miss customer calls while working, or need a clearer way to track and report complaints."
        />
      </label>

      <details className="mw-form-options">
        <summary>
          <span>Optional details</span>
          <small>{service === DEFAULT_SERVICE_ID ? 'Business, service and preferred next step' : `Selected: ${selectedServiceLabel}`}</small>
        </summary>
        <div className="mw-form-options-body">
          <label>
            <span>Business <small>optional</small></span>
            <input name="business" autoComplete="organization" disabled={submitState === 'sending'} />
          </label>

          <label>
            <span>What do you need help with?</span>
            <select
              name="service"
              value={service}
              onChange={(event) => setService(event.target.value as EnquiryServiceId)}
              disabled={submitState === 'sending'}
            >
              {ENQUIRY_SERVICES.map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}
            </select>
          </label>

          <label>
            <span>What would be most useful next?</span>
            <select name="nextStep" defaultValue={DEFAULT_NEXT_STEP} disabled={submitState === 'sending'}>
              {ENQUIRY_NEXT_STEPS.map((option) => <option key={option}>{option}</option>)}
            </select>
          </label>
        </div>
      </details>

      <label className="mw-honeypot" aria-hidden="true">
        <span>Website</span>
        <input name="_honey" tabIndex={-1} autoComplete="off" />
      </label>

      <div className="mw-form-submit">
        <button className="button button-dark" type="submit" disabled={submitState === 'sending' || submitState === 'sent'}>
          {submitState === 'sending' ? 'Sending…' : submitState === 'sent' ? 'Sent' : 'Send enquiry'}
        </button>
        <p>Sent directly from this form to my inbox. No account or booking step. <a href="/privacy">How I use your details</a>.</p>
        <p id="business-enquiry-error" className="mw-form-status mw-form-error" role="alert">{validationError}</p>
        <p className="mw-form-status" role="status" aria-live="polite">
          {submitState === 'sent' && (
            <>
              Enquiry sent. I’ll reply by email.{' '}
              <button type="button" className="text-link" onClick={() => { setSubmitState('idle'); focusField('name'); }}>Send another</button>
            </>
          )}
          {submitState === 'error' && (
            <>
              {FAILURE_COPY[failureReason]} Nothing you typed has been lost —{' '}
              <a href={recoveryHref}>send it by email instead</a> (everything is filled in for you), or email{' '}
              <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
            </>
          )}
        </p>
        {submitState === 'error' && <EnquiryRecovery href={recoveryHref} />}
      </div>
    </form>
  );
}
