'use client';

import { useState } from 'react';
import { OFFERS, getExtra, formatPrice, priceAmount } from './offers';
import { BUILD_CREDIT } from './site';
import './interactive.css';

/**
 * A clearly labelled, interactive example of the scope sheet and fixed price that follow the free preview.
 * The business is fictional; the kind of plan matches what a real reply looks like.
 * - Findings open and close (native <details>, so it works without JavaScript).
 * - The quote is a little builder: switch the add-on on or off and watch the
 *   total and the working date change, the way a real reply can be adjusted.
 * Every price comes from offers.ts.
 */
const FINDINGS = [
  {
    level: 'Fix now',
    title: 'Enquiries arrive in four places and some are missed',
    evidence: 'Phone, email, the website form and Instagram messages each go to a different place. Nobody sees them all in one list.',
    impact: 'A new client who messages on a busy Saturday may not hear back until Tuesday.',
  },
  {
    level: 'Fix soon',
    title: 'Reminders are sent by hand, when someone remembers',
    evidence: 'The booking tool can send reminders, but they are switched off. Staff text clients the night before instead.',
    impact: 'Missed reminders mean more no-shows, and the texting takes time every evening.',
  },
  {
    level: 'Working well',
    title: 'Online booking itself',
    evidence: 'The booking page is quick and clear on a phone.',
    impact: 'No change needed. The demo builds on it.',
  },
];

export function SampleReport() {
  const reminders = getExtra('Extra automation');
  const [withReminders, setWithReminders] = useState(true);
  const total = OFFERS[0].from + (withReminders ? priceAmount(reminders.price) : 0);

  return (
    <article className="s-report sp" aria-label="Example scope sheet and fixed price for a fictional business">
      <header>
        <span className="s-report-badge">Example</span>
        <p><strong>Scope sheet and fixed price: Hollybank Hair</strong></p>
        <p className="s-small">A fictional business, made up to show the format. Tap a finding to open it.</p>
      </header>
      <div className="sp-findings">
        {FINDINGS.map((finding, index) => {
          const tone = finding.level.split(' ')[0].toLowerCase();
          return (
            <details key={finding.title} className={`sp-finding sp-${tone}`} open={index === 0}>
              <summary>
                <span className={`s-level s-level-${tone}`}>{finding.level}</span>
                <strong>{finding.title}</strong>
              </summary>
              <p><em>What I found:</em> {finding.evidence}</p>
              <p><em>What it means:</em> {finding.impact}</p>
            </details>
          );
        })}
      </div>
      <p className="s-report-untested"><em>Not included:</em> a new website. The current one works, so there’s no reason to pay for one.</p>
      <footer>
        <p><strong>The quote.</strong> Switch the add-on to see how the total moves.</p>
        <ul className="sp-quote">
          <li><span><strong>{OFFERS[0].name}</strong> every enquiry lands in one list and gets an instant reply</span><b>{OFFERS[0].price}</b></li>
          <li className={withReminders ? 'is-on' : ''}>
            <label><input type="checkbox" checked={withReminders} onChange={(event) => setWithReminders(event.target.checked)} /><span><strong>Extra automation:</strong> appointment reminders switched on</span></label>
            <b>{reminders.price}</b>
          </li>
        </ul>
        <p className="sp-total" aria-live="polite"><strong>Total {formatPrice(total)}</strong> · No VAT added · Working within 7 working days of access.</p>
        <p className="s-small">If nothing is worth automating, I say so.</p>
        <a className="button" href="/contact?src=example-plan#leak-check-form">Get one like this for my business</a>
        <p className="s-small">{BUILD_CREDIT}</p>
      </footer>
    </article>
  );
}
