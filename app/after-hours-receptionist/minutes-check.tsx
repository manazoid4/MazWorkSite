'use client';

import { useState } from 'react';
import { AFTER_HOURS } from '../offers';

/**
 * "Will the included minutes cover me?": the visitor types their own missed
 * calls a week and a typical call length; the page does the sum. No claims
 * about how many calls anyone misses. Starting figures are placeholders.
 */
const WEEKS_PER_MONTH = 52 / 12;
const number = (value: string) => Math.max(0, Number(value.replace(/[^0-9.]/g, '')) || 0);

export function MinutesCheck() {
  const [calls, setCalls] = useState('15');
  const [length, setLength] = useState('2');
  const used = Math.round(number(calls) * number(length) * WEEKS_PER_MONTH);
  const share = Math.min(100, (used / AFTER_HOURS.minutes) * 100);
  const answer = used <= 0
    ? 'Type your own figures.'
    : used <= AFTER_HOURS.minutes
      ? `About ${used} minutes a month, inside the ${AFTER_HOURS.minutes} included.`
      : `About ${used} minutes a month, over the ${AFTER_HOURS.minutes} included. I’d agree a price with you first, before any extra is billed.`;

  return (
    <div className="ah-value">
      <label className="ah-value-input">
        <span>Calls you miss in a week</span>
        <span className="ah-pound"><input inputMode="numeric" value={calls} onChange={(event) => setCalls(event.target.value)} aria-label="Calls you miss in a week" /></span>
      </label>
      <label className="ah-value-input">
        <span>Typical call length, in minutes</span>
        <span className="ah-pound"><input inputMode="decimal" value={length} onChange={(event) => setLength(event.target.value)} aria-label="Typical call length in minutes" /></span>
      </label>
      <div className="ah-value-bars" aria-hidden="true">
        <span className="ah-bar ah-bar-cost" style={{ width: '100%' }}>{AFTER_HOURS.minutes} included</span>
        <span className="ah-bar ah-bar-job" style={{ width: `${Math.max(share, 8)}%` }}>{used}</span>
      </div>
      <p className="ah-value-answer" aria-live="polite">{answer}</p>
      <p className="ah-value-note">Your own figures, not a forecast.</p>
    </div>
  );
}
