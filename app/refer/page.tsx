import type { Metadata } from 'next';
import { fitDescription, OG_IMAGE } from '../seo';
import { CONTACT_EMAIL, MAIN_CTA, SITE_URL } from '../site';
import { REFERRAL_RANGE, REFERRAL_TIERS } from '../offers';
import { SiteFooter, SiteHeader } from '../site-chrome';

/**
 * Referral page (CRO Move 5, 18 Oct 2026). The audit found the referral reward
 * was buried in one FAQ answer and nothing in the delivered work invited the
 * next customer. So this is the plain home for it: what you get, tiered by the
 * size of the job your referral buys, what counts, and what does not. No new
 * promise is invented; the tiers read from offers.ts.
 */
const PAGE_URL = `${SITE_URL}/refer`;

export const metadata: Metadata = {
  title: 'Refer a business, earn £50–£300',
  description: fitDescription(`Introduce a UK business that isn't already talking to me, and earn ${REFERRAL_RANGE} when they pay their first invoice. Paid by bank transfer within 7 days.`),
  alternates: { canonical: PAGE_URL },
  openGraph: { title: 'Refer a business — Maz Works', description: fitDescription(`Introduce a business and earn ${REFERRAL_RANGE} when they pay their first invoice.`), url: PAGE_URL, type: 'website', images: [OG_IMAGE] },
};

/** The whole route, in three honest steps. */
const STEPS = [
  { title: 'You introduce them', body: 'Send them my way, or ask them to put your name in their first message. One line is enough.' },
  { title: 'They pay their first invoice', body: 'They start with a free preview and a fixed price. Nothing is owed until they see the work and pay.' },
  { title: 'You get paid', body: 'I send your reward by bank transfer within 7 days of their first invoice. No forms, no hoops.' },
];

/** What does not count, said plainly so nobody is disappointed. */
const RULES = [
  'The business must be new to me: not already talking to me, or already a client.',
  'Their first invoice must be for a package, not an add-on on its own or a care plan.',
  'No reward if the job is cancelled or refunded before the work is delivered.',
  'If you share this publicly, say plainly that you are paid for referrals.',
];

export default function ReferPage() {
  return (
    <main>
      <SiteHeader />

      <section className="mw-resource-hero" id="main-content" tabIndex={-1} aria-labelledby="refer-title">
        <p className="eyebrow">Refer a business</p>
        <h1 id="refer-title">Know someone who keeps losing jobs? Get paid for the introduction.</h1>
        <p>Most of my work comes from someone saying a good word. If you introduce a UK business that isn’t already talking to me, you get paid once they do — {REFERRAL_RANGE}, depending on the job they buy.</p>
        <p className="mw-hero-note">No limit on how many · paid by bank transfer within 7 days of their first invoice</p>
      </section>

      <section className="mw-resource-list" aria-labelledby="refer-steps-title">
        <h2 id="refer-steps-title" style={{ padding: '0 20px' }}>How it works</h2>
        {STEPS.map((step, index) => (
          <article className="mw-resource-row" key={step.title}>
            <span className="mw-resource-index">{String(index + 1).padStart(2, '0')}</span>
            <div>
              <h2>{step.title}</h2>
              <p>{step.body}</p>
            </div>
          </article>
        ))}
      </section>

      <section className="mw-resource-list" aria-labelledby="refer-tiers-title">
        <h2 id="refer-tiers-title" style={{ padding: '0 20px' }}>What you earn</h2>
        <p style={{ padding: '0 20px' }}>The reward scales with the job your referral buys, so the biggest builds pay the most.</p>
        {REFERRAL_TIERS.map((tier) => (
          <article className="mw-resource-row" key={tier.id}>
            <span className="mw-resource-index">{tier.reward}</span>
            <div>
              <h2>{tier.job}</h2>
              <p>{tier.note}</p>
            </div>
          </article>
        ))}
      </section>

      <section className="mw-resource-list" aria-labelledby="refer-rules-title">
        <h2 id="refer-rules-title" style={{ padding: '0 20px' }}>The honest rules</h2>
        <div style={{ padding: '0 20px' }}>
          <ul className="s-ticks">
            {RULES.map((rule) => <li key={rule}>{rule}</li>)}
          </ul>
          <p>Every system I ship carries a quiet “Built by Maz Works” line in the messages and the written handover, so the work keeps introducing itself. You get paid for the ones it brings in.</p>
        </div>
      </section>

      <section className="mw-resource-hero" aria-labelledby="refer-cta-title">
        <h2 id="refer-cta-title">Want the free preview first?</h2>
        <p>If you’re the one with the job that eats your week, start with a free preview and a fixed price. If you’re referring someone, send them this page.</p>
        <p>Not sure what lost work is costing them? <a href="/missed-calls-calculator">Work it out in a minute →</a></p>
        <div className="mw-actions">
          <a className="button button-signal" href="/free-plan#leak-check-form">{MAIN_CTA}</a>
          <a className="button" href="/prices">See the prices</a>
        </div>
        <p className="mw-hero-note">Questions about a referral: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a></p>
      </section>

      <SiteFooter />
    </main>
  );
}
