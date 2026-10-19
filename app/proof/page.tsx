import type { Metadata } from 'next';
import { fitDescription, OG_IMAGE } from '../seo';
import { CONTACT_EMAIL, MAIN_CTA, SITE_URL } from '../site';
import { SiteFooter, SiteHeader } from '../site-chrome';
import { CaseStudyGrid, ScopeSheetPreview, TestimonialList } from '../proof-parts';

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

export default function ProofPage() {
  return (
    <main>
      <SiteHeader />
      <section className="mw-resource-hero" id="main-content" tabIndex={-1} aria-labelledby="proof-title">
        <p className="eyebrow">Proof</p>
        <h1 id="proof-title">Real work. Open it and see.</h1>
        <p>Each item is labelled for what it is: my own product, a client build, or a demonstration with invented data.</p>
      </section>

      <section className="mw-info" aria-label="Real work">
        <CaseStudyGrid />
      </section>

      <section className="mw-info" aria-labelledby="proof-quotes-title">
        <h2 id="proof-quotes-title">What clients say</h2>
        <TestimonialList />
      </section>

      <section className="mw-info" aria-labelledby="proof-scope-title">
        <h2 id="proof-scope-title">What you get before you pay</h2>
        <ScopeSheetPreview />
      </section>

      <section className="mw-info" aria-labelledby="proof-terms-title">
<h2 id="proof-terms-title">Why the terms are safe</h2>
<ul className="mw-cards mw-two">
<li><strong>Fixed price, written scope</strong><span>You know what you get and what it costs before any work.</span></li>
<li><strong>Pay after you have seen it work</strong><span>If I cannot get it working as agreed, you do not pay.</span></li>
<li><strong>Your accounts, your data</strong><span>Everything runs in accounts in your name, with a written guide.</span></li>
<li><strong>Written by someone who has been on the other side</strong><span>Five years in complaints and finance, including regulated work and ombudsman cases.</span></li>
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
