/**
 * The end-of-call summary laid out as the message the owner would receive.
 * Built only from the engine's summary(): nothing the caller did not say.
 * @param {{ title: string, urgent: boolean, rows: [string, string][] }} summary
 * @param {{ business: string, time: string, seconds: number }} meta
 */
export function ownerMessage(summary, { business, time, seconds }) {
  const get = (/** @type {string} */ key) => summary.rows.find(([name]) => name === key)?.[1] ?? '';
  const caller = get('Caller');
  const cut = caller.lastIndexOf(' · ');
  const hasNumber = cut > -1 && /\d/.test(caller.slice(cut));
  const who = hasNumber ? caller.slice(0, cut) : caller;
  const number = hasNumber ? caller.slice(cut + 3) : '';
  const check = get('Number check');
  /** @type {{ label: string, value: string, tone?: 'urgent' }[]} */
  const rows = [
    { label: 'Who', value: who || 'No details left' },
    { label: 'Number', value: number ? (check ? `${number} (${check.toLowerCase()})` : number) : 'None left' },
    { label: 'Needs', value: get('Wants') || 'Just a question' },
    summary.urgent ? { label: 'Urgency', value: 'Urgent: ring back now', tone: 'urgent' } : { label: 'Urgency', value: 'Not urgent' },
    { label: 'Answered', value: get('Answered') || 'Nothing needed answering' },
    { label: 'Next step', value: get('Next step') },
  ];
  const mins = Math.floor(seconds / 60);
  const length = mins ? `${mins} min ${seconds % 60} sec` : `${seconds} sec`;
  return { subject: summary.title, urgent: summary.urgent, business, time, length, rows };
}
