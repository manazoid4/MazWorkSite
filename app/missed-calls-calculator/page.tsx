import type { Metadata } from 'next';
import { fitDescription, OG_IMAGE } from '../seo';
import { CONTACT_EMAIL, MAIN_CTA, SITE_URL } from '../site';
import { OFFERS, REFERRAL_RANGE } from '../offers';
import { SiteFooter, SiteHeader } from '../site-chrome';
import { MissedCallsCalculator } from './calculator';

/**
 * Standalone missed-calls calculator (CRO Move 5, 18 Oct 2026). A top-of-funnel
 * tool: the visitor puts in their own week, and the number is gated behind the
 * same two-field form as the hero, posting to the same place as /free-plan.
 * No location, no phone number, nothing invented.
 */
const PAGE_URL = `${SITE_URL}/missed-calls-calculator`;

export const metadata: Metadata = {
  title: 'What are missed calls costing you?',
  description: fitDescription('Put in your own numbers and see what missed calls and unanswered enquiries cost your business each month. Free, no sign-up, and the number is yours.'),
  alternates: { canonical: PAGE_URL },
  openGraph: { title: 'Missed-calls calculator — Maz Works', description: fitDescription('See what missed calls cost you each month, by your own numbers.'), url: PAGE_URL, type: 'website', images: [OG_IMAGE] },
};

export default function MissedCallsCalculatorPage() {
  return (
    <main>
      <SiteHeader />

      <section className="mw-resource-hero" id="main-content" tabIndex={-1} aria-labelledby="mcc-page-title">
        <p className="eyebrow">Missed-calls calculator</p>
        <h1 id="mcc-page-title">What are the calls you miss costing you?</h1>
        <p>You can’t answer with your hands in a boiler, mid-appointment, or up a ladder. Most of those callers ring the next name on the list. Put in your own week and see what it adds up to.</p>
        <p className="mw-hero-note">Your numbers only · nothing saved · no industry figure assumed</p>
      </section>

      <section className="mw-qw-section" aria-labelledby="mcc-tool-title" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h2 id="mcc-tool-title" className="s-visually-hidden">The calculator</h2>
        <MissedCallsCalculator />
      </section>

      <section className="mw-resource-hero" aria-labelledby="mcc-cta-title">
        <h2 id="mcc-cta-title">Want it answered for you?</h2>
        <p>Missed-call text-back is one task from the automation menu: a caller who can’t get you gets a text with your booking or quote link straight away. It starts at {OFFERS[0].price}, and you see it working before you pay.</p>
        <div className="mw-actions">
          <a className="button button-signal" href="/free-plan#leak-check-form">{MAIN_CTA}</a>
          <a className="button" href="/prices">See the prices</a>
        </div>
        <p className="mw-hero-note">Know someone who loses calls? <a href="/refer">Refer them and earn {REFERRAL_RANGE}</a> · Questions: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a></p>
      </section>

      <SiteFooter />
    </main>
  );
}
