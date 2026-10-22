'use client';

import { useState } from 'react';
import { REFERENCE_RATES, compensation, lateInterest, referenceRate } from './late-payment';

const money = (n: number) => `£${n.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const today = () => new Date().toLocaleDateString('en-CA'); // local YYYY-MM-DD, not UTC

export function LatePaymentCalculator() {
  const [amount, setAmount] = useState('1200');
  const [due, setDue] = useState('');
  const [paid, setPaid] = useState(''); // blank = today; avoids baking the build date into the static page
  const [rate, setRate] = useState(String(REFERENCE_RATES[REFERENCE_RATES.length - 1].rate));
  const [rateEdited, setRateEdited] = useState(false);
  const known = due ? referenceRate(due) : undefined;

  const value = Number(amount);
  const days = due ? Math.round((Date.parse(paid || today()) - Date.parse(due)) / 86400000) : 0;
  const ready = value > 0 && days > 0 && rate !== '' && Number.isFinite(Number(rate));
  const interest = ready ? lateInterest(value, Number(rate), days) : 0;
  const fixed = ready ? compensation(value) : 0;

  return (
    <div className="mw-calc">
      <div className="mw-calc-fields">
        <label>Invoice amount (£)
          <input type="number" inputMode="decimal" min="0" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} />
        </label>
        <label>Due date
          <input type="date" value={due} onChange={(e) => { setDue(e.target.value); const r = referenceRate(e.target.value); if (!rateEdited) setRate(r === undefined ? '' : String(r)); }} />
        </label>
        <label>Paid on (blank = today)
          <input type="date" value={paid} onChange={(e) => setPaid(e.target.value)} />
        </label>
        <label>Reference Bank Rate (%)
          <input type="number" inputMode="decimal" min="0" step="0.01" value={rate} onChange={(e) => { setRate(e.target.value); setRateEdited(true); }} />
        </label>
      </div>
      <output className="mw-calc-result" aria-live="polite">
        {ready ? (
          <>
            <span><b>{days}</b> days late</span>
            <span>Interest at {8 + Number(rate)}%: <b>{money(interest)}</b></span>
            <span>Fixed compensation: <b>{money(fixed)}</b></span>
            <span className="mw-calc-total">You can claim: <b>{money(value + interest + fixed)}</b></span>
          </>
        ) : (
          <span>{!due || !(value > 0) ? 'Enter the invoice amount and the date it was due.' : days <= 0 ? 'The paid on date must be after the due date.' : 'Enter the Bank Rate.'}</span>
        )}
      </output>
      <p className="mw-calc-note">{due && known === undefined
        ? 'Enter the Bank of England base rate on the 30 June or 31 December just before this debt went overdue.'
        : 'The rate is filled in from the due date: Bank Rate on the 30 June or 31 December before the debt went overdue, plus 8%. Business customers only.'}</p>
    </div>
  );
}
