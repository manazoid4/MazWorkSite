import type { Metadata } from 'next';
import { Breadcrumbs } from '../breadcrumbs';
import { fitDescription, OG_IMAGE } from '../seo';
import { ENQUIRY_CTA, SITE_URL } from '../site';
import { SiteFooter, SiteHeader } from '../site-chrome';
import { MiniPlan } from './restaurant-tables/plan-art';
import './tools.css';

/**
 * Tools and demos hub. Every entry carries one of three labels, and the label is
 * the truth: a concept demo is never presented as client work.
 */
const PAGE_URL = `${SITE_URL}/tools`;
const TITLE = 'Tools and demos | Maz Works';
const DESCRIPTION = fitDescription('Working examples you can open and try: a restaurant table picker, a missed-calls calculator, a call-answering demo and my own products. Each one is labelled honestly.');

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: PAGE_URL, type: 'website', images: [OG_IMAGE] },
};

type Kind = 'client' | 'internal' | 'concept';
const LABELS: Record<Kind, { text: string; meaning: string }> = {
  client: { text: 'Real client work', meaning: 'Built for a client and live for their customers.' },
  internal: { text: 'Internal project', meaning: 'My own product or experiment. I run it myself.' },
  concept: { text: 'Interactive concept demo', meaning: 'A working example with made-up data. Not a live service.' },
};

const TOOLS: { name: string; kind: Kind; href: string; blurb: string }[] = [
  { name: 'Missed-calls calculator', kind: 'concept', href: '/local-businesses#missed-calls-calculator', blurb: 'Put in your own week and see roughly what the calls you miss add up to. An estimate from your numbers, not a promise.' },
  { name: 'After-hours receptionist demo', kind: 'concept', href: '/receptionist-demo', blurb: 'Have a pretend after-hours call out loud, in your browser, and see the summary the owner would get.' },
  { name: 'JobFilter', kind: 'internal', href: 'https://jobfilter.uk/find-jobs', blurb: 'My own live product. It helps small building firms find public contracts that fit their trade, area and deadline.' },
  { name: 'Scrap Finance Partners', kind: 'client', href: 'https://scrap-finance-partners.vercel.app', blurb: 'A website for a finance firm serving UK scrap and recycling businesses, with a short enquiry form built in.' },
  { name: 'Maz Works Objects', kind: 'concept', href: '/3d-printing', blurb: 'A concept for tap-to-review stands and signs. Not in production yet: it shows the idea and how ordering would work.' },
];

export default function ToolsPage() {
  return (
    <main className="tl-page">
      <SiteHeader />
      <Breadcrumbs items={[{ label: 'Tools and demos' }]} />

      <section className="tl-hero" id="main-content" tabIndex={-1} aria-labelledby="tools-title">
        <p className="rx-kicker">Tools and demos</p>
        <h1 id="tools-title">Try it before you talk to me.</h1>
        <p className="rx-lede">These are the small things I build when I spot a problem that keeps coming back. Some are for clients, some are my own, some are concepts. Each one says which.</p>
      </section>

      <dl className="tl-key" aria-label="What the labels mean">
        {(Object.keys(LABELS) as Kind[]).map((kind) => (
          <div key={kind}>
            <dt><span className="rx-tag" data-kind={kind}>{LABELS[kind].text}</span></dt>
            <dd>{LABELS[kind].meaning}</dd>
          </div>
        ))}
      </dl>

      <section className="rx-band rx-band--sky" aria-labelledby="tools-feature-title">
        <div className="tl-feature">
          <div className="tl-feature-copy">
            <span className="rx-tag" data-kind="concept">{LABELS.concept.text}</span>
            <h2 id="tools-feature-title">A table picker for a cafe or restaurant.</h2>
            <p className="rx-lede">Choose a table on a floor plan, filter by party size and see what the next step would look like. Made-up cafe, made-up diary: no real reservation is made.</p>
            <a className="button button-signal" href="/tools/restaurant-tables">Try the table picker</a>
          </div>
          <div className="tl-feature-art"><MiniPlan /></div>
        </div>
      </section>

      <section className="rx-section" aria-labelledby="tools-more-title">
        <h2 id="tools-more-title" className="tl-h2">More to open.</h2>
        <ul className="tl-index">
          {TOOLS.map((tool) => (
            <li className="tl-row" key={tool.name}>
              <span className="rx-tag" data-kind={tool.kind}>{LABELS[tool.kind].text}</span>
              <div>
                <h3><a href={tool.href}>{tool.name}</a></h3>
                <p>{tool.blurb}</p>
              </div>
              <span className="tl-row-go" aria-hidden="true">↗</span>
            </li>
          ))}
        </ul>
        <p className="rx-prose" style={{ marginTop: 24 }}>More experiments and prototypes are on <a className="rx-link" href="/proof">my work page</a>.</p>
        <p className="rx-prose" style={{ marginTop: 14 }}><strong>Engineering research:</strong> I am investigating the missing reliability layer around AI agents: outcome receipts, cross-agent collisions and recoverable runs. <a className="rx-link" href="/research">Read the research and inspect the source</a>.</p>
      </section>

      <section className="rx-band rx-band--peach tl-close" aria-labelledby="tools-close-title">
        <h2 id="tools-close-title" className="rx-title">Got a job that keeps coming back?</h2>
        <p className="rx-lede">Tell me what happens now and what you would like to happen instead. I will say plainly whether a small tool would help.</p>
        <a className="button button-signal" href="/contact?src=tools#contact">{ENQUIRY_CTA}</a>
      </section>

      <SiteFooter />
    </main>
  );
}
