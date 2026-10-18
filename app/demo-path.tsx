import { CHANGES_WINDOW, CARE_PLANS, DEMO_STEPS } from './offers';
import { BOOKING_URL, MAIN_CTA } from './site';
import './demo-path.css';
import { CampaignLink } from './campaign-link';

/**
 * The free preview route, as five plain numbered steps (Maz, 30 Sep).
 * Server-rendered, no animation: it should read like a promise, not a show.
 */
export function DemoPath({ source = 'site', compact = false }: { source?: string; compact?: boolean }) {
  return (
    <div className={`dp${compact ? ' dp-compact' : ''}`}>
      <ol className="dp-steps">
        {DEMO_STEPS.map((step, index) => (
          <li key={step.title} data-tone={index % 6}>
            <span className="dp-num" aria-hidden="true">{index + 1}</span>
            <div>
              <strong>{step.title}</strong>
              {compact ? null : <p>{step.body}</p>}
              <small>{step.note}</small>
            </div>
          </li>
        ))}
      </ol>
      <div className="dp-cta">
        <CampaignLink className="button button-signal s-button-lg" href={`/free-plan?src=${encodeURIComponent(source)}#leak-check-form`}>{MAIN_CTA}</CampaignLink>
        <p className="dp-micro"><CampaignLink className="text-link" href={`${BOOKING_URL}?utm_source=${encodeURIComponent(source)}`}>Prefer to talk? Book a 15-minute call →</CampaignLink></p>
      </div>
    </div>
  );
}

/** What the tweaks window and fix promise cover, and where the line is. */
export function ChangesWindow() {
  return (
    <div className="cw">
      <p className="cw-lede"><strong>{CHANGES_WINDOW.name}.</strong> {CHANGES_WINDOW.body}</p>
      <div className="cw-cols">
        <div className="cw-yes">
          <h3>Included</h3>
          <ul>{CHANGES_WINDOW.covered.map((item) => <li key={item}>{item}</li>)}</ul>
        </div>
        <div className="cw-no">
          <h3>Priced first, so it stays fair</h3>
          <ul>{CHANGES_WINDOW.notCovered.map((item) => <li key={item}>{item}</li>)}</ul>
        </div>
      </div>
      <p className="cw-how">{CHANGES_WINDOW.howItWorks} ({CARE_PLANS.map((plan) => `${plan.name}, ${plan.price}`).join('; ')}.)</p>
    </div>
  );
}
