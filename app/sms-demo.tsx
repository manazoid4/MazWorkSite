'use client';

import { useId, useState, type FormEvent } from 'react';
import './b2b.css';

const SAMPLE = 'Hi, this is the Maz Works demo. If you were a customer who had just rung and nobody picked up, this is the text you would get straight away. Tap to pick a time: [your booking link]';
type State = 'idle' | 'sending' | 'sent' | 'preview' | 'invalid' | 'limit';

/**
 * "Feel the speed" widget. The on-screen text always shows. A real text goes out
 * only when the visitor gives a UK mobile and ticks consent, and only if the
 * server has a texting account set up; otherwise they still see the preview.
 */
export function SmsDemo() {
  const uid = useId();
  const [state, setState] = useState<State>('idle');

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const phone = String(data.get('phone') || '').trim();
    if (!/^(?:\+44|0044|0)[\s-]?7[\d\s-]{9,12}$/.test(phone) || data.get('consent') !== 'on') { setState('invalid'); return; }
    setState('sending');
    try {
      const response = await fetch('/api/demo-trigger', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ phone, consent: true, _honey: String(data.get('_honey') || '') }), signal: AbortSignal.timeout(15000) });
      const result = await response.json().catch(() => null) as { ok?: boolean; simulated?: boolean } | null;
      if (response.status === 429) setState('limit');
      else if (response.ok && result?.ok && result.simulated === false) setState('sent');
      else setState('preview');
    } catch { setState('preview'); }
  }

  return (
    <div className="b2b-box" role="group" aria-labelledby={`${uid}-t`}>
      <h3 id={`${uid}-t`}>Test the missed-call text in 10 seconds</h3>
      <form onSubmit={submit} noValidate className="cx-panel">
        <div className="cx-field">
          <label htmlFor={`${uid}-p`}>Your UK mobile</label>
          <input id={`${uid}-p`} name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="07…" disabled={state === 'sending'} />
        </div>
        <label className="au-check"><input type="checkbox" name="consent" style={{ width: 22, height: 22, flex: 'none' }} /><span>Send me one demo text now. I understand it is a single message, my number is not stored or used for anything else, and I can reply STOP.</span></label>
        <label className="mw-honeypot" aria-hidden="true"><input name="_honey" tabIndex={-1} autoComplete="off" /></label>
        <div><button className="button button-signal" type="submit" disabled={state === 'sending'}>{state === 'sending' ? 'Sending…' : 'Text me the demo'}</button></div>
      </form>
      <p className="cx-note" role="status" aria-live="polite">
        {state === 'invalid' && 'Enter a UK mobile starting 07 and tick the box.'}
        {state === 'sent' && 'Sent. It should arrive within a few seconds.'}
        {state === 'limit' && 'The demo text has been used from this connection or number today. The preview below shows the message.'}
        {state === 'preview' && 'Live texting is not switched on here, so here is the message as it would arrive.'}
        {state === 'idle' && 'One text, to your own number only. Nothing is sent until you tick the box.'}
      </p>
      <pre className="cx-pre" aria-label="Example text message">{SAMPLE}</pre>
    </div>
  );
}
