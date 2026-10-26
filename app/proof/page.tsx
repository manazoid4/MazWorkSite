import type { Metadata } from 'next';
import { fitDescription, OG_IMAGE } from '../seo';
import { SITE_URL } from '../site';
import { SiteFooter, SiteHeader } from '../site-chrome';
import { CaseStudyGrid, KIND_LABEL, TESTIMONIALS, TestimonialList } from '../proof-parts';
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

/** Everything else I have made, demos included (was /lab). `kind` is one of the three labels; `status` says how finished it is. */
const BUILT = [
  { name: 'RotaReason', kind: 'demo', status: 'Sample data', summary: 'Ask for rota changes in plain English, check staffing rules and preview safe changes before applying them.', href: '/rotareason', label: 'Open the demo' },
  { name: 'Agent Nudge', kind: 'own', status: 'Released', summary: 'Stops coding tools clashing over the same files.', href: 'https://agent-nudge-bay.vercel.app/demo/overview', label: 'Try the demo' },
  { name: 'OpenFlowKit', kind: 'own', status: 'Open source', summary: 'Voice-to-text in the browser, cleaned up for you.', href: 'https://openflowkit-dusky.vercel.app', label: 'Try it' },
  { name: 'Khutba.io', kind: 'own', status: 'Live prototype', summary: 'Live translated captions for mosque screens.', href: 'https://khutba-io.vercel.app/demo', label: 'Try the demo' },
  { name: 'MAZ Core', kind: 'own', status: 'Private console', summary: 'A console for talking to my own MAZ Core endpoint. You need your own endpoint to use it.', href: '/maz-core', label: 'Open the console' },
  { name: 'MAZ Pocket', kind: 'own', status: 'In progress', summary: 'A pocket device to talk to your PC and approve its actions, linked through MAZ Core.', href: '/maz-pocket-ai', label: 'Open the bridge' },
  { name: 'Complaints dashboard and board report', kind: 'demo', status: 'Invented data', summary: 'Turns complaint records into decisions for managers and the board. No client uses these.', href: '/professional-teams#more-demos', label: 'See the sample' },
  { name: 'Maz Works Objects', kind: 'demo', status: 'Concept, not yet made', summary: 'Tap-to-review stands and signs for a counter. Still a concept.', href: '/3d-printing', label: 'See the concept' },
] as const;

export default function ProofPage() {
  return (
    <main>
      <SiteHeader />
      <section className="mw-resource-hero" id="main-content" tabIndex={-1} aria-labelledby="proof-title">
        <p className="eyebrow">My work</p>
        <h1 id="proof-title">What I have built. Open it and see.</h1>
        <p>Client work, my own products and demos. Each one says which it is.</p>
      </section>

      <section className="mw-info" id="client-work" aria-labelledby="proof-live-title">
        <h2 id="proof-live-title">Live and in use</h2>
        <CaseStudyGrid />
      </section>

      <section className="mw-info" id="built" aria-labelledby="proof-built-title">
        <h2 id="proof-built-title">More things I have made</h2>
        <p className="proof-intro">None of these is client work. Want something like one? <a href="/contact">Tell me what you need</a>.</p>
        <ul className="proof-built">
          {BUILT.map((item) => (
            <li key={item.name}>
              <h3>{item.name}</h3>
              <p className="proof-tag">{KIND_LABEL[item.kind]} · {item.status}</p>
              <p>{item.summary}</p>
              <a href={item.href}>{item.label} <span aria-hidden="true">→</span></a>
            </li>
          ))}
        </ul>
      </section>

      {TESTIMONIALS.length > 0 && (
        <section className="mw-info" aria-labelledby="proof-quotes-title">
          <h2 id="proof-quotes-title">What clients say</h2>
          <TestimonialList />
        </section>
      )}

      <section className="mw-info" aria-labelledby="proof-terms-title">
        <h2 id="proof-terms-title">Before you pay</h2>
        <ul className="proof-terms">
          <li><strong>Fixed price, written scope.</strong> You know what you get and what it costs before any work. <a href="/contact#scope">View a scope sheet</a>.</li>
          <li><strong>Pay after you have seen it work.</strong> If I cannot get it working as agreed, you do not pay.</li>
          <li><strong>Your accounts, your data.</strong> Everything runs in accounts in your name, with a written guide.</li>
          <li><strong>Written by someone who has handled complaints.</strong> Five years of financial complaints taught me how vague promises turn into disputes.</li>
        </ul>
      </section>
      <SiteFooter />
    </main>
  );
}
