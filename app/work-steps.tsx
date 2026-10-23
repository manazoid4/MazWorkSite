import './home-visuals.css';
import { CARE_PLAN } from './offers';
import { CHECK_REPLY_TIME } from './site';

const STEPS = [
  { title: 'Free preview', body: `A working preview with your business name, usually within ${CHECK_REPLY_TIME}.` },
  { title: 'Fixed price', body: 'In a written scope sheet.' },
  { title: 'Built, then shown', body: 'Working before you pay.' },
  { title: 'Care is optional', body: `Only if you want it, from ${CARE_PLAN.price}.` },
] as const;

/** "How working together goes": the four-step strip, shared by the homepage and the trade pages. */
export function WorkSteps({ level = 3 }: { level?: 2 | 3 }) {
  const Heading = level === 2 ? 'h2' : 'h3';
  return (
    <div className="hv-steps-wrap"><Heading className={level === 2 ? 'tp-h2' : 'hv-h3'} id="steps-title">How working together goes.</Heading>
      <ol className="hv-steps" aria-labelledby="steps-title">{STEPS.map((step, i) => <li key={step.title}><span className="hv-n" aria-hidden="true">{i + 1}</span><strong>{step.title}</strong><span>{step.body}</span></li>)}</ol></div>
  );
}
