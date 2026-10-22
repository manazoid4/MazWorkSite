/** Late payment maths, kept free of React so tests can import it. */

/**
 * Late payment reference rate: Bank Rate on 31 December (for interest starting
 * 1 Jan to 30 Jun) or 30 June (1 Jul to 31 Dec), per SI 2002/1675 art. 4.
 * Source: bankofengland.co.uk Bank Rate history. Add a row each half year.
 */
export const REFERENCE_RATES: { from: string; rate: number }[] = [
  { from: '2025-01-01', rate: 4.75 },
  { from: '2025-07-01', rate: 4.25 },
  { from: '2026-01-01', rate: 3.75 },
  { from: '2026-07-01', rate: 3.75 },
];

/** Late Payment of Commercial Debts (Interest) Act 1998: fixed sum by debt size. */
export function compensation(amount: number) {
  return amount < 1000 ? 40 : amount < 10000 ? 70 : 100;
}

/** Simple interest at 8% over the reference rate, from the day after the due date. */
export function lateInterest(amount: number, baseRate: number, days: number) {
  return amount * ((8 + baseRate) / 100) * (Math.max(0, days) / 365);
}

/** Reference Bank Rate for a debt: fixed by the half year in which interest starts (the day after the due date). */
export function referenceRate(due: string) {
  if (Number.isNaN(Date.parse(due))) return undefined;
  const start = new Date(Date.parse(due) + 86400000).toISOString().slice(0, 10);
  const last = REFERENCE_RATES[REFERENCE_RATES.length - 1];
  const row = [...REFERENCE_RATES].reverse().find((r) => start >= r.from);
  // Only the half year that starts at the last row is known; later or earlier dates need the user's figure.
  const end = new Date(Date.parse(last.from) + 184 * 86400000).toISOString().slice(0, 10);
  return row && start < end ? row.rate : undefined;
}
