'use client';

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { CHECK_REPLY_TIME, CONTACT_EMAIL, PREVIEW_TIME } from './site';
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
  sendPlanEnquiry,
  type EnquiryServiceId,
} from './enquiry';
import { FREE_STEP } from './offers';
import { rememberedAttribution, rememberedCampaign } from './linkedin-source';
import { readStoredAudit } from './audit/model';
import { draftFreePlan } from './contact/draft';
import { enquirySource, readTradeContext, safeEnquiryPageUrl, tradeLabel } from './trade-context';

type SubmitState = 'idle' | 'sending' | 'sent' | 'error';

/** The next-step choice that means "send a free preview"; it uses the transactional route and carries the link context. */
const PREVIEW_STEP = ENQUIRY_NEXT_STEPS[1];
const SETUP_SERVICE = 'Setup intake';
const SETUP_STEP = 'Confirm payment in Stripe before setup; the package query is not proof of payment';

type FailureReason = 'rejected' | 'timeout' | 'network' | 'invalid';

// The browser's own type=email rule (HTML spec), plus a dot in the domain so "sam@gmail" is caught too.
const EMAIL_PATTERN = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

const FAILURE_COPY: Record<FailureReason, string> = {
  invalid: 'Something in the form was not accepted. Please check your email address and that your name and message are filled in, then try again.',
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

export function DemoRequestForm({
  kicker,
  problemPlaceholder,
  contact = false,
  formId,
}: {
  kicker?: string;
  problemPlaceholder?: string;
  /** The /contact form: shows the next-step choice up front (free preview is one) and reads deep-link context. */
  contact?: boolean;
  formId?: string;
} = {}) {
  const formRef = useRef<HTMLFormElement>(null);
  const requestId = useRef('');
  const [next, setNext] = useState<string>(DEFAULT_NEXT_STEP);
  const [setup, setSetup] = useState(false);
  const [sentAs, setSentAs] = useState<'enquiry' | 'preview' | 'setup'>('enquiry');
  const [confirmation, setConfirmation] = useState(false);
  const [service, setService] = useState<EnquiryServiceId>(DEFAULT_SERVICE_ID);
  const [submitState, setSubmitState] = useState<SubmitState>('idle');
  const [validationError, setValidationError] = useState('');
  const [invalidField, setInvalidField] = useState('');
  const [failureReason, setFailureReason] = useState<FailureReason>('rejected');
  const [recoveryHref, setRecoveryHref] = useState(`mailto:${CONTACT_EMAIL}`);

  useEffect(() => {
    requestId.current = crypto.randomUUID();
    if (!contact) return;
    // Deep links from the rest of the site (and the old /contact and /start addresses) say what the visitor came for.
    const params = new URLSearchParams(window.location.search);
    const intent = params.get('intent');
    if (intent === 'setup') setSetup(true);
    else if (intent === 'preview' || params.has('package') || params.has('trade') || params.has('audit')) setNext(PREVIEW_STEP);
    const fill = (name: string, value: string | null) => {
      const input = formRef.current?.querySelector<HTMLInputElement | HTMLTextAreaElement>(`[name="${name}"]`);
      if (input && value && !input.value) input.value = value.replace(/[<>]/g, '').slice(0, name === 'problem' ? 4000 : 80);
    };
    fill('name', params.get('name'));
    fill('business', params.get('business') || params.get('website'));
    if (params.get('audit')) fill('problem', readStoredAudit());
    else if (params.get('package')) fill('problem', `I’m asking about ${params.get('package')}.`);
  }, [contact]);

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
    const referredBy = String(data.get('referred_by') || '').trim();
    const problem = String(data.get('problem') || '').trim();
    const nextStep = contact ? next : String(data.get('nextStep') || DEFAULT_NEXT_STEP).trim();
    const honey = String(data.get('_honey') || '').trim();

    const missing = !name ? 'name' : !email || !EMAIL_PATTERN.test(email) ? 'email' : !problem ? 'problem' : '';
    if (missing) {
      setInvalidField(missing);
      setValidationError(
        missing === 'problem'
          ? 'Add a short description of what you want to improve.'
          : missing === 'email' && email
            ? 'That email looks incomplete. It should look like name@example.co.uk.'
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
      ['Referred by', referredBy],
      ['Service', serviceLabel],
      ['What to improve', problem],
      ['Most useful next step', nextStep],
    ]));

    setSubmitState('sending');

    const preview = contact && !setup && nextStep === PREVIEW_STEP;
    const common = { name, email, problem, referred_by: referredBy, _replyto: email, _honey: honey };
    let result;
    const source = enquirySource(window.location.search, rememberedCampaign(), 'contact');
    if (contact && (setup || preview)) {
      // Free preview and post-payment setup go through api/enquiry (confirmation email, draft reply), then the FormSubmit fallback.
      const context = readTradeContext(window.location.search);
      const planSubject = `Maz Works — ${setup ? 'setup details' : 'free preview and price'} — ${business || name}`;
      const draft = setup ? null : draftFreePlan({ name, trade: context.trade, package: context.package, problem });
      result = await sendPlanEnquiry({
        ...common,
        request_id: requestId.current,
        draft: draft
          ? `Owner review required: this is a demo enquiry, not an order. ${context.package ? `Explicit package interest: ${context.package}.` : 'No package selected; the suggestion below is provisional.'} Check the customer’s existing tools before proposing new functionality.\n\n${draft.subject}\n\n${draft.text}`
          : `Owner action: ${SETUP_STEP}. The return URL and package query are not payment verification.`,
        website: business,
        service: setup ? SETUP_SERVICE : FREE_STEP.name,
        customer_message: '',
        interested_in: context.package || 'Not chosen',
        trade: context.trade,
        industry: tradeLabel(context.trade),
        problem_id: context.problem,
        proof_id: context.proof,
        source_page: context.sourcePage,
        next_step: setup ? SETUP_STEP : 'Send a free preview and fixed price; not an order',
        source,
        attribution: rememberedAttribution(),
        _subject: planSubject,
        _template: 'table',
        _url: safeEnquiryPageUrl(window.location.href),
      });
    } else {
      result = await sendEnquiry({
        ...common,
        business: business || 'Not provided',
        service: serviceLabel,
        next_step: nextStep,
        source,
        attribution: rememberedAttribution(),
        _subject: subject,
        _template: 'table',
        _url: window.location.href,
      });
    }

    if (result.ok) {
      form.reset();
      setService(DEFAULT_SERVICE_ID);
      setNext(DEFAULT_NEXT_STEP);
      setSentAs(setup ? 'setup' : preview ? 'preview' : 'enquiry');
      setConfirmation('confirmationSent' in result && result.confirmationSent === true);
      setSubmitState('sent');
      requestId.current = crypto.randomUUID();
      trackConversion('Enquiry sent', { service });
      if (contact && (setup || preview)) trackConversion('Form submitted', { source });
      return;
    }

    setFailureReason(result.status === 400 ? 'invalid' : result.reason);
    setSubmitState('error');
  }

  const previewing = contact && !setup && next === PREVIEW_STEP;
  const selectedServiceLabel = ENQUIRY_SERVICES.find((option) => option.id === service)?.label ?? 'Not sure yet';

  return (
    <form className="mw-demo-form" id={formId} action={NATIVE_FORM_ENDPOINT} method="post" ref={formRef} onSubmit={submitRequest} onInput={(event) => {
      if ((event.target as HTMLInputElement).name === invalidField) {
        setInvalidField('');
        setValidationError('');
      }
    }}>
      <input type="hidden" name="_subject" value="Maz Works — business enquiry" />
      <input type="hidden" name="_template" value="table" />
      <p className="mw-form-kicker">{setup ? 'Share what needs setting up and where to send the confirmation.' : kicker ?? 'Just your name, email and what you want to improve. No service choice needed.'}</p>
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
        <span>{setup ? 'What do you need set up?' : 'What do you need help with?'}</span>
        <textarea
          name="problem"
          aria-invalid={invalidField === 'problem' || undefined}
          aria-describedby={invalidField === 'problem' ? 'business-enquiry-error' : undefined}
          rows={5}
          required
          disabled={submitState === 'sending'}
          placeholder={setup ? 'For call answering: your phone line, hours, common questions and urgent-call rules' : problemPlaceholder ?? 'For example: I need more website enquiries, a clearer team dashboard, or help tracking deadlines and complaints.'}
        />
      </label>

      {contact && !setup ? (
        <fieldset className="ct-next">
          <legend>What would be most useful next?</legend>
          {ENQUIRY_NEXT_STEPS.map((option) => (
            <label key={option} className="ct-next-option">
              <input type="radio" name="nextStep" value={option} checked={next === option} onChange={() => setNext(option)} disabled={submitState === 'sending'} />
              <span>{option}</span>
            </label>
          ))}
          {previewing ? <p className="ct-next-note">Free and no obligation. I reply myself within {CHECK_REPLY_TIME}, then send one focused preview and a fixed price, usually within {PREVIEW_TIME}. No call needed.</p> : null}
        </fieldset>
      ) : null}

      <details className="mw-form-options">
        <summary>
          <span>Optional details</span>
          <small>{service === DEFAULT_SERVICE_ID ? (contact ? 'Business and service' : 'Business, service and preferred next step') : `Selected: ${selectedServiceLabel}`}</small>
        </summary>
        <div className="mw-form-options-body">
          <label>
            <span>Business <small>optional</small></span>
            <input name="business" autoComplete="organization" disabled={submitState === 'sending'} />
          </label>

          <label>
            <span>Service <small>optional</small></span>
            <select
              name="service"
              value={service}
              onChange={(event) => setService(event.target.value as EnquiryServiceId)}
              disabled={submitState === 'sending'}
            >
              {ENQUIRY_SERVICES.map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}
            </select>
          </label>

          {contact ? <label>
            <span>Who sent you? <small>optional</small></span>
            <input name="referred_by" autoComplete="off" placeholder="Their name, so I can thank them" disabled={submitState === 'sending'} />
          </label> : null}

          {contact ? null : <label>
            <span>What would be most useful next?</span>
            <select name="nextStep" defaultValue={DEFAULT_NEXT_STEP} disabled={submitState === 'sending'}>
              {ENQUIRY_NEXT_STEPS.map((option) => <option key={option}>{option}</option>)}
            </select>
          </label>}
        </div>
      </details>

      <label className="mw-honeypot" aria-hidden="true">
        <span>Website</span>
        <input name="_honey" tabIndex={-1} autoComplete="off" />
      </label>

      <div className="mw-form-submit">
        <button className="button button-dark" type="submit" disabled={submitState === 'sending' || submitState === 'sent'}>
          {submitState === 'sending' ? 'Sending…' : submitState === 'sent' ? 'Sent' : setup ? 'Send setup details' : previewing ? 'Get my free preview' : 'Send enquiry'}
        </button>
        <p>Sent directly from this form to my inbox. No account or booking step. <a href="/privacy">How I use your details</a>.</p>
        <p id="business-enquiry-error" className="mw-form-status mw-form-error" role="alert">{validationError}</p>
        <p className="mw-form-status" role="status" aria-live="polite">
          {submitState === 'sent' && (
            <>
              {sentAs === 'setup'
                ? `Setup details sent. I’ll check your payment and confirm the next steps by email within ${CHECK_REPLY_TIME}, before starting setup.`
                : sentAs === 'preview'
                  ? `Got it, thank you. ${confirmation ? 'Check your inbox. ' : ''}I’ll read it myself and send your preview and fixed price from ${CONTACT_EMAIL}, usually within ${CHECK_REPLY_TIME}. If it hasn’t arrived by then, check your junk folder.`
                  : 'Enquiry sent. I’ll reply by email.'}{' '}
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
