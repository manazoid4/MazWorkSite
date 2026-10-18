import type { Metadata } from 'next';
import { SiteFooter, SiteHeader } from '../site-chrome';
import { CREATOR_OFFERS, CHANGES_WINDOW, OFFERS, PROMISES } from '../offers';
import { DemoPath } from '../demo-path';
import { CampaignLink } from '../campaign-link';
import { CHECK_REPLY_TIME, MAIN_CTA } from '../site';

const STARTER = OFFERS[0];

/**
 * LinkedIn landing page (30 Sep): the one link in Maz's profile, Featured
 * section and first comments. It says hello, shows the free preview route and
 * the promises. Links are tagged so leads show where they came from.
 * Kept out of search and the sitemap: it is a channel page, not new content.
 */
export const metadata: Metadata = {
  title: 'Hello from LinkedIn',
  description: 'Get a free written plan and a fixed price for your business. No call needed.',
  alternates: { canonical: '/linkedin' },
  robots: { index: false, follow: true },
};

export default function LinkedInPage() {
  return (
    <main className="s-home">
      <SiteHeader />

      <section className="s-hero s-hero-short li-hello" id="main-content" tabIndex={-1} aria-labelledby="li-title">
        <img className="li-photo" src="/maz.webp" alt="Manazir Hussain" width={96} height={96} />
        <div>
          <p className="eyebrow">You found me on LinkedIn</p>
          <h1 id="li-title">Hi, I’m Maz. I build the systems that stop enquiries slipping away.</h1>
          <p className="s-lede">{`Missed calls, slow replies, no-shows, chasing quotes. I set it up once so it runs on its own. From ${STARTER.price}, fixed price agreed first.`}</p>
          <div className="s-actions"><CampaignLink className="button button-signal s-button-lg" href="/free-plan?src=linkedin#leak-check-form">{MAIN_CTA}</CampaignLink></div>
          <p className="s-small">Trainer, maker or creator? <CampaignLink href="/for/creators?src=linkedin">{`See ${CREATOR_OFFERS[0].name} · ${CREATOR_OFFERS[0].price}`}</CampaignLink>.</p>
        </div>
      </section>

      <section className="s-section" aria-labelledby="li-demo-title">
        <p className="eyebrow">See it before you pay</p>
        <h2 id="li-demo-title">Start with a free preview.</h2>
        <DemoPath source="linkedin" />
        <p className="s-small">I usually reply within {CHECK_REPLY_TIME}.</p>
        <div className="s-faq"><details>
          <summary>What do the 30 days of tweaks cover?</summary>
          <p>{CHANGES_WINDOW.body}</p>
          <ul>{CHANGES_WINDOW.notCovered.map((item) => <li key={item}>{item}</li>)}</ul>
        </details></div>
      </section>

      <section className="s-section" aria-labelledby="li-work-title">
        <p className="eyebrow">Work you can open yourself</p>
        <h2 id="li-work-title">A real product. A real client build.</h2>
        <div className="s-proof">
          <a className="s-proof-card" href="/work/jobfilter">
            <span>My own product · software</span>
            <strong>JobFilter</strong>
            <span>Finds and filters public contracts for small trades firms. Live, with paid plans.</span>
          </a>
          <a className="s-proof-card" href="/work/scrap-finance-partners">
            <span>Client build · website</span>
            <strong>Specialist finance firm</strong>
            <span>A website I designed and built. See the actual work.</span>
          </a>
        </div>
      </section>

      <section className="s-section" aria-labelledby="li-why-title">
        <p className="eyebrow">Why owners pick this</p>
        <h2 id="li-why-title">What you can count on.</h2>
        <ul className="s-trust">{PROMISES.map((term) => <li key={term.title}><strong>{term.title}</strong><span>{term.body}</span></li>)}</ul>
      </section>

      <SiteFooter />
    </main>
  );
}
