import type { Metadata } from 'next';
import { fitDescription, OG_IMAGE } from '../seo';
import { CONTACT_EMAIL, MAIN_CTA, SITE_URL } from '../site';
import { SiteFooter, SiteHeader } from '../site-chrome';

/**
 * Proof hub. The rule is absolute: never invent a client, logo, quote or
 * result. Short on purpose: the real work you can open, and a plain line on
 * what is not here yet. Real quotes get added under the work as they arrive,
 * each with the client's name and permission.
 */
const PAGE_URL = `${SITE_URL}/proof`;

export const metadata: Metadata = {
  title: 'Proof | Maz Works',
  description: fitDescription('Real work you can open and check today. Client quotes are added here once clients say yes.'),
  alternates: { canonical: PAGE_URL },
  openGraph: { title: 'Maz Works proof', description: fitDescription('Real work you can open and check today.'), url: PAGE_URL, type: 'website', images: [OG_IMAGE] },
};

const REAL_WORK = [
  { name: 'JobFilter', kind: 'My own product', body: 'Finds and filters public contracts for small trades firms. Live, with paid plans.', href: '/work/jobfilter' },
  { name: 'Scrap Finance Partners', kind: 'Client website', body: 'Designed and built for a specialist finance firm.', href: '/work/scrap-finance-partners' },
];

export default function ProofPage() {
  return (
    <main>
      <SiteHeader />
      <section className="mw-resource-hero" id="main-content" tabIndex={-1} aria-labelledby="proof-title">
        <p className="eyebrow">Proof</p>
        <h1 id="proof-title">Real work. Open it and see.</h1>
        <p>Everything here is real. Client quotes go up as clients agree to them.</p>
      </section>

      <section className="mw-info" aria-label="Real work">
        <ul className="mw-cards mw-two">
          {REAL_WORK.map(item => (
            <li key={item.name}>
              <strong>{item.name}</strong>
              <span>{item.kind}. {item.body}</span>
              <a href={item.href}>Open {item.name} →</a>
            </li>
          ))}
        </ul>
      </section>

      <section className="mw-resource-cta" aria-labelledby="proof-cta-title">
        <div>
          <h2 id="proof-cta-title">Want to see what I would do for you?</h2>
          <p>You get a working preview and a fixed price first.</p>
        </div>
        <div className="mw-actions">
          <a className="button button-signal" href="/free-plan#leak-check-form">{MAIN_CTA}</a>
          <a className="button" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
