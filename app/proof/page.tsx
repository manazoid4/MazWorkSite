import type { Metadata } from 'next';
import { fitDescription, OG_IMAGE } from '../seo';
import { CONTACT_EMAIL, MAIN_CTA, SITE_URL } from '../site';
import { SiteFooter, SiteHeader } from '../site-chrome';
import { CaseStudyGrid, KIND_LABEL, ScopeSheetPreview, TestimonialList } from '../proof-parts';
import './proof.css';

/**
 * My work. The rule is absolute: never invent a client, logo, quote or
 * result, and never present a prototype as client work. Every item carries one
 * of three labels (KIND_LABEL in proof-parts.tsx). Real quotes get added under
 * the work as they arrive, each with the client's name and permission.
 */
const PAGE_URL = `${SITE_URL}/proof`;

export const metadata: Metadata = {
  title: 'My work: client work, my projects, demos',
  description: fitDescription('What I have built, labelled honestly: real client work, my own projects, and concept demos with made-up data. Client quotes are added once clients agree.'),
  alternates: { canonical: PAGE_URL },
  openGraph: { title: 'My work | Maz Works', description: fitDescription('What I have built, labelled honestly. Open it and check.'), url: PAGE_URL, type: 'website', images: [OG_IMAGE] },
};

/** Smaller projects of my own (was /lab). `kind` is one of the three labels; `status` says how finished it is. */
const BUILT = [
  { name: 'RotaReason', kind: 'demo', status: 'Working demo, sample data', summary: 'Ask for rota changes in plain English, check staffing rules and preview safe changes before applying them.', href: '/rotareason', label: 'Open the demo' },
  { name: 'Agent Nudge', kind: 'own', status: 'Released', summary: 'Stops coding tools clashing over the same files.', href: 'https://agent-nudge-bay.vercel.app/demo/overview', label: 'Try the demo' },
  { name: 'OpenFlowKit', kind: 'own', status: 'Open source', summary: 'Voice-to-text in the browser, cleaned up for you.', href: 'https://openflowkit-dusky.vercel.app', label: 'Try it' },
  { name: 'Khutba.io', kind: 'own', status: 'Live prototype', summary: 'Live translated captions for mosque screens.', href: 'https://khutba-io.vercel.app/demo', label: 'Try the demo' },
  { name: 'MAZ Core', kind: 'own', status: 'Private console', summary: 'A console for talking to my own MAZ Core endpoint. You need your own endpoint to use it.', href: '/maz-core', label: 'Open the console' },
  { name: 'MAZ Pocket', kind: 'own', status: 'In progress', summary: 'A pocket device to talk to your PC and approve its actions, linked through MAZ Core.', href: '/maz-pocket-ai', label: 'Open the bridge' },
  { name: 'Maz Works Objects', kind: 'demo', status: 'Concept, not yet made', summary: 'Tap-to-review stands and signs for a counter. Still a concept.', href: '/3d-printing', label: 'See the concept' },
] as const;

export default function ProofPage() {
  return (
    <main>
      <SiteHeader />
      <section className="mw-resource-hero" id="main-content" tabIndex={-1} aria-labelledby="proof-title">
        <p className="eyebrow">My work</p>
        <h1 id="proof-title">What I have built. Open it and see.</h1>
        <p>Every item has one of three labels: <strong>{KIND_LABEL.client}</strong> (built for a business that is not me), <strong>{KIND_LABEL.own}</strong> (something I made and run myself) or <strong>{KIND_LABEL.demo}</strong> (shows how I would approach a problem, with made-up data). Only the first is client work.</p>
      </section>

      <section className="mw-info" id="client-work" aria-labelledby="proof-client-title">
        <h2 id="proof-client-title">{KIND_LABEL.client}</h2>
        <CaseStudyGrid show="client" />
      </section>

      <section className="mw-info" id="own-product" aria-labelledby="proof-own-title">
        <h2 id="proof-own-title">{KIND_LABEL.own}: my main product</h2>
        <CaseStudyGrid show="own" />
      </section>

      <section className="mw-info" id="built" aria-labelledby="proof-built-title">
        <h2 id="proof-built-title">More things I have made</h2>
        <p className="proof-intro">Smaller projects of my own, and a few concepts. None of these is client work. Want something like one of them? <a href="/contact">Tell me what you need</a>. Interactive examples are collected on <a href="/tools">Tools and demos</a>.</p>
        <ul className="proof-built">
          {BUILT.map((item) => (
            <li key={item.name}>
              <span className="proof-tag">{KIND_LABEL[item.kind]} · {item.status}</span>
              <h3>{item.name}</h3>
              <p>{item.summary}</p>
              <a href={item.href}>{item.label} <span aria-hidden="true">→</span></a>
            </li>
          ))}
        </ul>
      </section>

      <section className="mw-info" id="concept-demos" aria-labelledby="proof-demo-title">
        <h2 id="proof-demo-title">{KIND_LABEL.demo}s</h2>
        <CaseStudyGrid show="demo" />
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
          <li><strong>Written by someone who has handled the complaints</strong><span>Five years dealing with financial complaints and escalations taught me how vague promises turn into disputes.</span></li>
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
