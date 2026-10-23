import type { Metadata } from 'next';
import { fitDescription, OG_IMAGE } from '../seo';
import { CONTACT_EMAIL, MAIN_CTA, SITE_URL } from '../site';
import { SiteFooter, SiteHeader } from '../site-chrome';
import { CaseStudyGrid, ScopeSheetPreview, TestimonialList } from '../proof-parts';
import './proof.css';

/**
 * Proof hub. The rule is absolute: never invent a client, logo, quote or
 * result. Short on purpose: the real work you can open, and a plain line on
 * what is not here yet. Real quotes get added under the work as they arrive,
 * each with the client's name and permission.
 */
const PAGE_URL = `${SITE_URL}/proof`;

export const metadata: Metadata = {
  title: 'Proof',
  description: fitDescription('Real work you can open and check today. Client quotes are added here once clients say yes.'),
  alternates: { canonical: PAGE_URL },
  openGraph: { title: 'Maz Works proof', description: fitDescription('Real work you can open and check today.'), url: PAGE_URL, type: 'website', images: [OG_IMAGE] },
};

/** Own products and prototypes (was /lab). Each label says what it really is. */
const BUILT = [
  { name: 'RotaReason', type: 'My own product · working demo', summary: 'Ask for rota changes in plain English, check staffing rules and preview safe changes before applying them.', href: '/rotareason', label: 'Open the demo' },
  { name: 'MAZ Core', type: 'My own tool · private console', summary: 'A console for talking to my own MAZ Core endpoint. You need your own endpoint to use it.', href: '/maz-core', label: 'Open the console' },
  { name: 'MAZ Pocket', type: 'In progress', summary: 'A pocket device to talk to your PC and approve its actions, linked through MAZ Core.', href: '/maz-pocket-ai', label: 'Open the bridge' },
  { name: 'Agent Nudge', type: 'Released', summary: 'Stops coding tools clashing over the same files.', href: 'https://agent-nudge-bay.vercel.app/demo/overview', label: 'Try the demo' },
  { name: 'OpenFlowKit', type: 'Open source', summary: 'Voice-to-text in the browser, cleaned up for you.', href: 'https://openflowkit-dusky.vercel.app', label: 'Try it' },
  { name: 'Khutba.io', type: 'Live prototype', summary: 'Live translated captions for mosque screens.', href: 'https://khutba-io.vercel.app/demo', label: 'Try the demo' },
  { name: 'Maz Works Objects', type: 'Concept · not yet made', summary: 'Tap-to-review stands and signs, fixed price from £29.', href: '/3d-printing', label: 'See the concept' },
];

export default function ProofPage() {
  return (
    <main>
      <SiteHeader />
      <section className="mw-resource-hero" id="main-content" tabIndex={-1} aria-labelledby="proof-title">
        <p className="eyebrow">Proof</p>
        <h1 id="proof-title">Real work. Open it and see.</h1>
        <p>Each item is labelled for what it is: my own product, a client build, or a demonstration with invented data.</p>
      </section>

      <section className="mw-info" aria-labelledby="proof-work-title">
        <h2 id="proof-work-title">Case studies and demos</h2>
        <CaseStudyGrid />
      </section>

      <section className="mw-info" id="built" aria-labelledby="proof-built-title">
        <h2 id="proof-built-title">Things I’ve built</h2>
        <p className="proof-intro">Products, prototypes and open-source tools of my own. Want something like this? <a href="/contact">Tell me what you need</a>.</p>
        <ul className="proof-built">
          {BUILT.map((item) => (
            <li key={item.name}>
              <span className="proof-tag">{item.type}</span>
              <h3>{item.name}</h3>
              <p>{item.summary}</p>
              <a href={item.href}>{item.label} <span aria-hidden="true">→</span></a>
            </li>
          ))}
        </ul>
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
          <a className="button button-signal" href="/contact">{MAIN_CTA}</a>
          <a className="button" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
