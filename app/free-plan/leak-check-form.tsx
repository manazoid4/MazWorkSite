'use client';

import { Suspense, useCallback, useEffect, useRef, useState, type FormEvent } from 'react';
import { useSearchParams } from 'next/navigation';
import { CHECK_REPLY_TIME, CONTACT_EMAIL, MAIN_CTA } from '../site';
import { trackConversion } from '../analytics';
import { EnquiryRecovery } from '../enquiry-recovery';
import { NATIVE_FORM_ENDPOINT, buildRecoveryMailto, sendPlanEnquiry } from '../enquiry';
import { CHECK_PICK_EVENT } from '../package-link';
import { FREE_STEP } from '../offers';
import { HEADACHE_PICKS, SYSTEMS } from '../systems';
import { rememberedCampaign } from '../linkedin-source';
import { changeTrade, contextSearch, enquirySource, KNOWN_PACKAGES, problemsForTrade, readTradeContext, safeEnquiryPageUrl, TRADE_CHOICES, TRADE_PROBLEMS, tradeContextFields, tradeLabel, type TradeContext } from '../trade-context';
import { draftFreePlan } from './draft';

type SubmitState = 'idle' | 'sending' | 'sent' | 'error';
type FailureReason = 'rejected' | 'timeout' | 'network' | 'invalid' | 'busy';

const FAILURE_COPY: Record<FailureReason, string> = {
  rejected: 'Delivery was not confirmed.',
  invalid: 'Something in the form was not accepted. Please check your email address and that your name and message are filled in, then try again.',
  busy: 'Lots of requests just now. Please wait a minute and try again.',
  timeout: 'That took too long to send.',
  network: 'That could not reach me — your connection may have dropped.',
};

type FieldName = 'problem' | 'name' | 'email';

const FIELD_MESSAGES = {
  problem: 'Tap at least one problem above, or add a line about the job, so I know what to build your demo around.',
  name: 'Add your name so I know who to reply to.',
  email: 'Add an email so I can send your demo.',
  emailFormat: 'That email looks incomplete. It should look like name@example.co.uk.',
} as const;

// The browser's own type=email rule (HTML spec), plus a dot in the domain so "sam@gmail" is caught too.
const EMAIL_PATTERN = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

function fieldMessage(field: FieldName, value: string, setup = false): string {
  const text = value.trim();
  if (!text) return field === 'problem' && setup
    ? 'Add a line about what you need set up.'
    : field === 'email' && setup ? 'Add an email so I can confirm the setup.' : FIELD_MESSAGES[field];
  if (field === 'email' && !EMAIL_PATTERN.test(text)) return FIELD_MESSAGES.emailFormat;
  return '';
}

const SERVICE_LABEL = FREE_STEP.name;
const SETUP_SERVICE_LABEL = 'Setup intake';
const SETUP_NEXT_STEP = 'Confirm payment in Stripe before setup; the package query is not proof of payment';

/** One tap instead of typing: the problems owners name most. Each adds a line to the text box. */
export const QUICK_PICKS = [
  'Missed calls',
  'Slow replies to enquiries',
  'No-shows',
  'Chasing quotes',
  'Chasing invoices',
  'Paperwork and forms',
  'Getting more reviews',
  'Copying details between apps',
  'Orders only by DM',
  'No website to send people to',
] as const;

/** Isolated under Suspense so the native form remains in the static HTML. */
function ContextLocationSync({ onChange }: { onChange: (search: string) => void }) {
  const params = useSearchParams();
  const search = params.toString();
  useEffect(() => { onChange(search); }, [search, onChange]);
  return null;
}

/**
 * Auto-reply for the no-JavaScript route only. FormSubmit does not send
 * autoresponses for AJAX submissions (checked 28 Sep: none arrived; its docs
 * say so), so the in-page route never promises an email confirmation.
 */
export const AUTO_REPLY = `Thanks, I've got your message. I'll read it myself and email you a working demo with your business name and a fixed price, usually within ${CHECK_REPLY_TIME}. No call needed and no obligation. If anything changes, email ${CONTACT_EMAIL}. Manazir, Maz Works`;
const SETUP_AUTO_REPLY = `Thanks, I've got your setup details. I'll check your payment and confirm the next steps by email before starting setup. If anything changes, email ${CONTACT_EMAIL}. Manazir, Maz Works`;

export function LeakCheckForm({ setup = false }: { setup?: boolean }) {
  const requestId = useRef('');
  const sending = useRef(false);
  const started = useRef(false);
  const [confirmationSent, setConfirmationSent] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const [submitState, setSubmitState] = useState<SubmitState>('idle');
  // One inline message per field, shown right under it. Empty string = valid.
  const [errors, setErrors] = useState<Record<FieldName, string>>({ problem: '', name: '', email: '' });
  const [failureReason, setFailureReason] = useState<FailureReason>('rejected');
  const [recoveryHref, setRecoveryHref] = useState(`mailto:${CONTACT_EMAIL}`);
  const [picked, setPicked] = useState<string[]>([]);
  const [context, setContext] = useState<TradeContext>(() => readTradeContext(''));
  const contextRef = useRef(context);
  const pkg = context.package;
  // Picks carried over from "Build my system" (?systems= with JS, ?headache= without).
  const [plan, setPlan] = useState({ systems: '', ids: '' });
  // Without JavaScript the chips can't submit, so the text box stays required
  // until the form hydrates; after that a tap is enough (validated in submitRequest).
  const [hydrated, setHydrated] = useState(false);
  // Batch 3: with JavaScript the form is two short steps (the job, then who to
  // reply to) with a summary before sending. Without it, every field shows at once.
  const [step, setStep] = useState<1 | 2>(1);
  const [summary, setSummary] = useState({ task: '', website: '' });

  useEffect(() => { setHydrated(true); requestId.current = crypto.randomUUID(); }, []);

  const readLocation = useCallback((search: string) => {
    const next = readTradeContext(search);
    if (next.trade !== contextRef.current.trade) setPicked([]);
    contextRef.current = next;
    setContext(next);
    const params = new URLSearchParams(search);
    const ids = [...new Set([...(params.get('systems') || '').split(','), ...params.getAll('headache').map(id => HEADACHE_PICKS.find(pick => pick.id === id)?.system || '')])].filter(id => SYSTEMS.some(system => system.id === id));
    setPlan({ systems: ids.map(id => SYSTEMS.find(system => system.id === id)!.name).join(', '), ids: ids.join(',') });
  }, []);

  function updateContext(next: TradeContext, clearSystems = false) {
    contextRef.current = next;
    setContext(next);
    const params = new URLSearchParams(contextSearch(window.location.search, next));
    if (clearSystems) { params.delete('systems'); params.delete('headache'); setPlan({ systems: '', ids: '' }); }
    window.history.replaceState(null, '', `${window.location.pathname}${params.size ? `?${params}` : ''}${window.location.hash}`);
  }

  useEffect(() => {
    const choose = (name: string | null) => {
      if (name && KNOWN_PACKAGES.includes(name)) updateContext({ ...contextRef.current, package: name });
    };
    const params = new URLSearchParams(window.location.search);
    readLocation(window.location.search);
    // Links from elsewhere on the site can pass on what the visitor already typed.
    for (const [param, field] of [['website', 'website'], ['name', 'name']] as const) {
      const input = formRef.current?.querySelector<HTMLInputElement>(`[name="${field}"]`);
      const value = params.get(param)?.replace(/[<>]/g, '').slice(0, 80);
      if (input && value && !input.value) input.value = value;
    }
    const business = params.get('business')?.replace(/[<>]/g, '').slice(0, 80);
    const website = formRef.current?.querySelector<HTMLInputElement>('[name="website"]');
    if (website && business && !website.value) website.value = business;
    const onPick = (event: Event) => choose((event as CustomEvent<string>).detail);
    window.addEventListener(CHECK_PICK_EVENT, onPick);
    return () => window.removeEventListener(CHECK_PICK_EVENT, onPick);
  }, []);

  function jobText(message: string): string {
    return [TRADE_PROBLEMS.find(item => item.id === context.problem)?.label, ...picked, plan.systems ? `From Build my system: ${plan.systems}` : '', message.trim()].filter(Boolean).join('\n');
  }

  function togglePick(label: string) {
    if (!started.current) { started.current = true; trackConversion('Form started', { placement: window.location.pathname }); }
    const on = !picked.includes(label);
    setPicked(on ? [...picked, label] : picked.filter((item) => item !== label));
    if (on) setErrors((current) => (current.problem ? { ...current, problem: '' } : current));
  }

  function goToDetails() {
    const box = formRef.current?.querySelector<HTMLTextAreaElement>('[name="problem"]');
    const site = formRef.current?.querySelector<HTMLInputElement>('[name="website"]');
    const task = jobText(box?.value || '');
    if (!task) {
      setErrors((current) => ({ ...current, problem: FIELD_MESSAGES.problem }));
      focusField('problem');
      return;
    }
    setErrors((current) => ({ ...current, problem: '' }));
    setSummary({ task, website: site?.value.trim() || '' });
    setStep(2);
    window.setTimeout(() => focusField('name'), 0);
  }

  function focusField(name: string) {
    formRef.current?.querySelector<HTMLElement>(`[name="${name}"]`)?.focus();
  }

  async function submitRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending.current || submitState === 'sending') return;

    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get('name') || '').trim();
    const email = String(data.get('email') || '').trim();
    const ownMessage = String(data.get('problem') || '').trim();
    const task = jobText(ownMessage);
    const existingTools = String(data.get('existing_tools') || '').trim();
    const website = String(data.get('website') || '').trim();
    const referredBy = String(data.get('referred_by') || '').trim();
    const honey = String(data.get('_honey') || '').trim();
    // First touch wins: a LinkedIn/outreach tag from landing survives any route to the form (sticky bar, calculator, menu).
    const campaign = rememberedCampaign();
    const source = enquirySource(window.location.search, campaign);

    const found: Record<FieldName, string> = {
      problem: fieldMessage('problem', task, setup),
      name: fieldMessage('name', name),
      email: fieldMessage('email', email, setup),
    };
    const firstInvalid = (['problem', 'email', 'name'] as const).find((field) => found[field]);
    if (firstInvalid) {
      if (firstInvalid === 'problem') setStep(1);
      setErrors(found);
      // Wait a tick so a step change has revealed the field before it takes focus.
      window.setTimeout(() => focusField(firstInvalid), 0);
      return;
    }

    setErrors({ problem: '', name: '', email: '' });

    const subject = `Maz Works — ${setup ? 'setup details' : 'free demo and price'} — ${website || name}`;
    setRecoveryHref(buildRecoveryMailto(subject, [
      ['Name', name],
      ['Email', email],
      ['The job', task],
      ['Customer message', ownMessage || 'No additional message'],
      ['Existing tools', existingTools],
      ['Website', website],
      ['Referred by', referredBy],
      ...tradeContextFields(context),
      ['Source', source],
    ]));

    setSubmitState('sending');
    sending.current = true;

    const draft = setup ? { subject: '', text: '' } : draftFreePlan({ name, trade: context.trade, systems: plan.ids, package: pkg, problem: task });
    const reviewNote = setup ? '' : `Owner review required: this is a demo enquiry, not an order. ${pkg ? `Explicit package interest: ${pkg}.` : 'No package selected; the suggestion below is provisional.'} Check the customer’s existing tools before proposing new functionality.`;
    const result = await sendPlanEnquiry({
      request_id: requestId.current,
      ...(setup
        ? { draft: `Owner action: ${SETUP_NEXT_STEP}. The return URL and package query are not payment verification.` }
        : { draft: `${reviewNote}\n\n${draft.subject}\n\n${draft.text}` }),
      name,
      email,
      website,
      referred_by: referredBy,
      service: setup ? SETUP_SERVICE_LABEL : SERVICE_LABEL,
      problem: task,
      customer_message: ownMessage,
      existing_tools: existingTools,
      interested_in: pkg || 'Not chosen',
      systems: plan.systems,
      trade: context.trade,
      industry: tradeLabel(context.trade),
      problem_id: context.problem,
      proof_id: context.proof,
      source_page: context.sourcePage,
      next_step: setup ? SETUP_NEXT_STEP : 'Send a free demo and fixed price; not an order',
      source,
      _replyto: email,
      _subject: subject,
      _template: 'table',
      _honey: honey,
      _url: safeEnquiryPageUrl(window.location.href),
    });
    sending.current = false;

    if (result.ok) {
      form.reset();
      setPicked([]);
      setStep(1);
      setConfirmationSent(result.confirmationSent === true);
      setSubmitState('sent');
      trackConversion('Form submitted', { source });
      if (result.confirmationSent) trackConversion('Confirmation sent', { source });
      requestId.current = crypto.randomUUID();
      trackConversion('Check submitted', { source });
      return;
    }

    setFailureReason(result.status === 400 ? 'invalid' : result.status === 429 ? 'busy' : result.reason);
    setSubmitState('error');
  }

  return (
    <form
      className="mw-demo-form"
      id="leak-check-form"
      data-step={hydrated && submitState !== 'sent' ? step : undefined}
      data-sent={submitState === 'sent' || undefined}
      action={NATIVE_FORM_ENDPOINT}
      method="post"
      ref={formRef}
      onSubmit={submitRequest}
      // With JavaScript the messages below replace the browser's generic tooltips.
      // Without it the browser's own required/email checks still run.
      noValidate={hydrated}
      onInput={(event) => {
        if (!started.current) { started.current = true; trackConversion('Form started', { placement: window.location.pathname }); }
        const target = event.target as HTMLInputElement;
        const field = target.name as FieldName;
        if (field === 'problem' || field === 'name' || field === 'email') {
          // Clear the message as soon as the field is valid again.
          setErrors((current) => (current[field] && !fieldMessage(field, target.value) ? { ...current, [field]: '' } : current));
        }
      }}
    >
      <Suspense fallback={null}><ContextLocationSync onChange={readLocation} /></Suspense>
      <input type="hidden" name="_subject" value={`Maz Works — ${setup ? 'setup details' : 'free demo and price'}`} />
      <input type="hidden" name="_template" value="table" />
      <input type="hidden" name="service" value={setup ? SETUP_SERVICE_LABEL : SERVICE_LABEL} />
      <input type="hidden" name="_autoresponse" value={setup ? SETUP_AUTO_REPLY : AUTO_REPLY} />
      <input type="hidden" name="interested_in" value={pkg || 'Not chosen'} />
      <input type="hidden" name="systems" value={plan.systems} />
      <input type="hidden" name="trade" value={context.trade} />
      <input type="hidden" name="industry" value={tradeLabel(context.trade)} />
      <input type="hidden" name="proof_id" value={context.proof} />
      <input type="hidden" name="problem_id" value={context.problem} />
      <input type="hidden" name="source_page" value={context.sourcePage} />
      <input type="hidden" name="next_step" value={setup ? SETUP_NEXT_STEP : 'Send a free demo and fixed price; not an order'} />
      <p className="mw-form-kicker">{setup ? 'Share what needs setting up and where to send the confirmation.' : 'Tap what fits, then tell me where to send your demo. No call needed.'}</p>
      {context.trade && !setup ? <p className="mw-form-picked">Your <strong>{tradeLabel(context.trade)}{context.problem ? ` · ${TRADE_PROBLEMS.find(item => item.id === context.problem)?.label}` : ''}</strong> demo enquiry. A free example and fixed price, not an order.</p> : null}
      {context.proof ? <p className="mw-form-picked">Demo context: <strong>{tradeLabel(context.proof)}</strong> — an illustrative example, not client results. <button type="button" className="text-link" disabled={submitState === 'sending'} onClick={() => updateContext({ ...context, proof: '' })}>Clear demo context</button></p> : null}
      {plan.systems ? <p className="mw-form-picked">Your demo: <strong>{plan.systems}</strong></p> : null}

      {hydrated && submitState !== 'sent' ? (
        <div className="mw-form-progress" aria-hidden="true">
          <span>Step {step} of 2 · {step === 1 ? 'The job' : `Where to send ${setup ? 'your confirmation' : 'your demo'}`}</span>
          <i><b style={{ transform: `scaleX(${step / 2})` }} /></i>
        </div>
      ) : null}
      <div className="mw-form-part" data-part="1">
        {hydrated ? <details>
          <summary>Change industry or package</summary>{/* Options render after hydration: they are choices for JavaScript visitors and must not bloat every page that embeds the form. */}
          <label>
          <span>Industry <small>(optional)</small></span>
          <select name="industry_choice" value={context.trade} disabled={submitState === 'sending'} onChange={event => { if (event.target.value !== context.trade) setPicked([]); updateContext(changeTrade(context, event.target.value), event.target.value !== context.trade); setErrors(current => ({ ...current, problem: '' })); }}>
            <option value="">Choose your industry, or leave open</option>
            {hydrated ? <>{TRADE_CHOICES.map(item => <option key={item.id} value={item.id}>{item.label}</option>)}
            <option value="creator">Creator</option>
            <option value="other">Something else</option></> : null}
          </select>
        </label>
        <label>
          <span>Package preference <small>{setup ? '(from your link)' : '(optional, not an order)'}</small></span>
          <select name="package_choice" value={pkg} disabled={submitState === 'sending'} onChange={event => updateContext({ ...context, package: event.target.value })}>
            <option value="">Not chosen — help me decide</option>
            {hydrated ? KNOWN_PACKAGES.map(name => <option key={name} value={name}>{name}</option>) : null}
          </select>
        </label>
        </details> : null}
        <fieldset className="mw-quick-picks">
          <legend>{setup ? 'What should be set up?' : 'What’s costing you customers or time?'} <small>{setup ? 'Tap any that fit, or add details below' : 'Tap any that fit'}</small></legend>
          <div>
            {context.trade ? problemsForTrade(context.trade).map(item => (
              <button type="button" key={item.id} aria-pressed={context.problem === item.id} disabled={submitState === 'sending'} onClick={() => {
                updateContext({ ...context, problem: context.problem === item.id ? '' : item.id });
                setErrors(current => ({ ...current, problem: '' }));
              }}>{item.label}</button>
            )) : QUICK_PICKS.map((label) => (
              <button type="button" key={label} aria-pressed={picked.includes(label)} onClick={() => togglePick(label)} disabled={submitState === 'sending'}>
                {label}
              </button>
            ))}
          </div>
        </fieldset>

        <label>
          <span>{hydrated ? <>Anything else I should know? <small>(optional)</small></> : setup ? 'What do you need set up?' : 'What job do you want off your plate?'}</span>
          <textarea
            name="problem"
            rows={3}
            required={!hydrated}
            placeholder={setup ? 'For call answering: your phone line, hours, common questions and urgent-call rules' : 'For example: orders come by DM, customers forget appointments, chasing quotes'}
            aria-invalid={errors.problem ? true : undefined}
            aria-describedby={errors.problem ? 'leak-check-err-problem' : undefined}
            disabled={submitState === 'sending'}
          />
        </label>
        <p id="leak-check-err-problem" className="mw-field-error" role="alert">{errors.problem}</p>

        <details className="mw-more">
          <summary>Details</summary>
        {hydrated ? <label>
          <span>Tools you use <small>(optional)</small></span>
          <input name="existing_tools" maxLength={500} placeholder="Fresha, GarageHive, a calendar? I will check what they do first." disabled={submitState === 'sending'} />
        </label> : null}

        <label>
          <span>Business name or website <small>(optional)</small></span>
          <input
            name="website"
            inputMode="url"
            autoComplete="url"
            placeholder="Smith Plumbing or yourbusiness.co.uk"
            disabled={submitState === 'sending'}
          />
        </label>
        </details>

        {hydrated ? <button type="button" className="button button-dark mw-form-next" onClick={goToDetails} disabled={submitState === 'sending'}>Next: where to send it</button> : null}
      </div>

      <div className="mw-form-part" data-part="2">
        {hydrated && summary.task ? (
          <div className="mw-form-summary">
            <p><strong>Your job:</strong> {summary.task}</p>
            {summary.website ? <p><strong>Website:</strong> {summary.website}</p> : null}
            {tradeContextFields(context).filter(([label, value]) => !['Source page', 'Request'].includes(label) && !value.startsWith('Not ')).map(([label, value]) => <p key={label}><strong>{label}:</strong> {value}</p>)}
            <button type="button" className="text-link" onClick={() => { setStep(1); window.setTimeout(() => focusField('problem'), 0); }}>Change</button>
          </div>
        ) : null}
        <div className="mw-form-row">
          <label>
            <span>Email</span>
            <input
              name="email"
              type="email"
              autoComplete="email"
              required
              aria-invalid={errors.email ? true : undefined}
              aria-describedby={errors.email ? 'leak-check-err-email' : undefined}
              disabled={submitState === 'sending'}
            />
            <span id="leak-check-err-email" className="mw-field-error" role="alert">{errors.email}</span>
          </label>
          <label>
            <span>Name</span>
            <input
              name="name"
              autoComplete="name"
              required
              aria-invalid={errors.name ? true : undefined}
              aria-describedby={errors.name ? 'leak-check-err-name' : undefined}
              disabled={submitState === 'sending'}
            />
            <span id="leak-check-err-name" className="mw-field-error" role="alert">{errors.name}</span>
          </label>
        </div>
        <label>
          <span>Who sent you? (optional)</span>
          <input name="referred_by" autoComplete="off" placeholder="Their name, so I can thank them" disabled={submitState === 'sending'} />
        </label>


        <label className="mw-honeypot" aria-hidden="true">
          <span>Company website</span>
          <input name="_honey" tabIndex={-1} autoComplete="off" />
        </label>

        <div className="mw-form-submit">
          <button className="button button-dark" type="submit" disabled={submitState === 'sending' || submitState === 'sent'}>
            {submitState === 'sending' ? 'Sending…' : submitState === 'sent' ? 'Sent' : setup ? 'Send setup details' : MAIN_CTA}
          </button>
          <p>{setup ? `I’ll check your payment and confirm the next steps by email within ${CHECK_REPLY_TIME}, before starting setup. ` : `I usually reply myself within ${CHECK_REPLY_TIME} with a working demo of your first job and a fixed price. Free, no obligation. `}<a href="/privacy">How I use your details</a>.</p>
          <p className="mw-form-status" role="status" aria-live="polite">
            {submitState === 'sent' && (
              <>
                <span className="mw-form-tick" aria-hidden="true">✓</span> <strong>Got it, thank you.</strong> {setup
                  ? `${confirmationSent ? 'Check your inbox. ' : 'Your details arrived, but the confirmation email did not go out. '}I’ll check your payment and confirm the next steps by email within ${CHECK_REPLY_TIME}, before starting setup. `
                  : `${confirmationSent ? 'Check your inbox. The confirmation is the same kind of instant reply I set up for clients. ' : 'Your request arrived safely. The instant confirmation email did not go out this time. '}What happens next: I read it myself, look at how you work now, and send your demo and fixed price from ${CONTACT_EMAIL}, usually within ${CHECK_REPLY_TIME}. Nothing to pay and no call unless you want one. If it hasn’t arrived by then, check your junk folder. `}{' '}
                <button type="button" className="text-link" onClick={() => { setSubmitState('idle'); setStep(1); window.setTimeout(() => focusField('problem'), 0); }}>Send another</button>
              </>
            )}
            {submitState === 'error' && (
              <>
                {FAILURE_COPY[failureReason]} Nothing you typed has been lost —{' '}
                <a href={recoveryHref}>send it by email instead</a>, or email{' '}
                <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
              </>
            )}
          </p>
          {submitState === 'error' && <EnquiryRecovery href={recoveryHref} />}
        </div>
      </div>
    </form>
  );
}
