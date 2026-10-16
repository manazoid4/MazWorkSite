'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { encodeConfig } from './engine.mjs';
import { PRESETS, presetConfig } from './presets.mjs';

type Config = NonNullable<ReturnType<typeof presetConfig>>;

/**
 * "Try it as your business": name + trade (+ hours) make a demo straight away.
 * Sits inside the call card (opened from its header, before or after a call).
 * Nothing is stored or sent. The details go into the link's #hash so the page can be shared.
 */
export function TryYours({ onMade, onClose, onReset, custom }: { onMade: (config: Config) => void; onClose: () => void; onReset: () => void; custom: boolean }) {
  const [error, setError] = useState('');
  const name = useRef<HTMLInputElement>(null);
  useEffect(() => { name.current?.focus({ preventScroll: true }); }, []);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const config = presetConfig(String(data.get('name') ?? ''), String(data.get('type') ?? ''), String(data.get('hours') ?? ''));
    if (!config) { setError('Use just the business name, without a web address or phone number.'); return; }
    setError('');
    try { window.history.replaceState(null, '', `#c=${encodeConfig(config)}`); } catch { /* the demo still works without a shareable link */ }
    onMade(config);
  };

  return (
    <form className="vd-try" onSubmit={submit} aria-label="Try it as your business">
      <div className="vd-try-top">
        <strong>Try it as your business</strong>
        <button type="button" className="vd-quiet" onClick={onClose}>Close</button>
      </div>
      <label>Business name
        <input id="vd-try-name" ref={name} name="name" required maxLength={40} autoComplete="organization" aria-describedby={error ? 'vd-try-err' : undefined} aria-invalid={error ? true : undefined} />
      </label>
      <label>Type of business
        <select name="type" defaultValue={PRESETS[0].id}>
          {PRESETS.map((preset) => <option key={preset.id} value={preset.id}>{preset.label}</option>)}
        </select>
      </label>
      <label>Opening hours (optional)
        <input name="hours" maxLength={80} placeholder="e.g. Monday to Friday 8am to 6pm" />
      </label>
      {error ? <p id="vd-try-err" role="alert" className="vd-try-err">{error}</p> : null}
      <div className="vd-try-actions">
        <button type="submit" className="vd-btn vd-btn-sun">Make my demo</button>
        {custom ? <button type="button" className="vd-quiet" onClick={onReset}>Back to the example garage</button> : null}
      </div>
    </form>
  );
}
