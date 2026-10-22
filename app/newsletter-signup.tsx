'use client';

import { useEffect, useState, type FormEvent } from 'react';

type State = 'idle' | 'sending' | 'done' | 'error';

/**
 * One-field mailing-list signup. Posts to `/api/subscribe`, which forwards to
 * Resend. Without JavaScript the same form does a normal POST and the server
 * redirects back with `?subscribed=1` or `0`, which is read here on load.
 */
type Props = {
  /** Unique per page: the footer and /lab both render a signup. */
  id?: string;
  /** Where the signup happened (`footer`, `lab`); reaches Maz's signup email. */
  source?: string;
  trade?: string;
  title?: string;
  text?: string;
  /** Shown after a successful signup. */
  doneText?: string;
  /** Runs after a successful signup, with or without JavaScript. */
  onDone?: () => void;
};

export function NewsletterSignup({ id = 'newsletter', source = 'lab', trade, title = 'Not ready yet?', text = 'Occasional updates on what I build. Unsubscribe any time.', doneText = 'You’re on the list. Thanks.', onDone }: Props = {}) {
  const [state, setState] = useState<State>('idle');
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Two signups can share a page (footer and /lab): only the one the no-JS redirect points at shows the outcome.
    if (window.location.hash !== `#${id}`) return;
    const outcome = new URLSearchParams(window.location.search).get('subscribed');
    if (outcome === '1') {
      setState('done');
      onDone?.();
    }
    if (outcome === '0') {
      setState('error');
      setMessage('That didn’t go through. Please try again.');
    }
  }, []);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value.trim();
    if (!email || !form.checkValidity()) {
      setState('error');
      setMessage('Please enter a valid email address.');
      return;
    }
    setState('sending');
    setMessage('');
    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'content-type': 'application/json', accept: 'application/json' },
        body: JSON.stringify({ email, website: (form.elements.namedItem('website') as HTMLInputElement).value, source, trade }),
      });
      const result = (await response.json().catch(() => null)) as { ok?: boolean; reason?: string } | null;
      if (result?.ok === true) {
        setState('done');
        onDone?.();
        return;
      }
      setState('error');
      setMessage(result?.reason === 'invalid-email' ? 'Please enter a valid email address.' : 'That didn’t go through. Please try again.');
    } catch {
      setState('error');
      setMessage('That didn’t go through. Please try again.');
    }
  }

  return (
    <section className="mw-newsletter" id={id} aria-labelledby={`${id}-title`}>
      <div className="mw-newsletter-copy">
        <h2 id={`${id}-title`}>{title}</h2>
        <p>{text}</p>
      </div>
      {state === 'done' ? (
        <p className="mw-newsletter-done" role="status">{doneText}</p>
      ) : (
        <form className="mw-newsletter-form" method="post" action="/api/subscribe" onSubmit={onSubmit} noValidate>
          <div className="mw-newsletter-row">
            <input id={`${id}-email`} aria-label="Email address" name="email" type="email" autoComplete="email" required maxLength={254} placeholder="you@business.co.uk" aria-describedby={message ? `${id}-message` : undefined} />
            <button className="button" type="submit" disabled={state === 'sending'}>{state === 'sending' ? 'Joining…' : 'Join'}</button>
          </div>
          {/* Honeypot: hidden from people and screen readers, filled only by bots. */}
          {/* Without JavaScript the server needs these to tag the signup and send the visitor back to this form. */}
          <input type="hidden" name="source" value={source} />
          {trade ? <input type="hidden" name="trade" value={trade} /> : null}
          <input type="hidden" name="return" value={id} />
          <input className="mw-newsletter-trap" name="website" type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" />
          <p className="s-small">Unsubscribe any time. <a href="/privacy">Privacy</a>.</p>
          {message ? <p className="mw-newsletter-error" id={`${id}-message`} role="alert">{message}</p> : null}
        </form>
      )}
    </section>
  );
}
