import type { Metadata } from 'next';
import { Breadcrumbs } from '../breadcrumbs';
import { fitDescription, OG_IMAGE } from '../seo';
import { ENQUIRY_CTA, SITE_URL } from '../site';
import { SiteFooter, SiteHeader } from '../site-chrome';
import { MiniPlan } from './restaurant-tables/plan-art';
import './tools.css';

const PAGE_URL = `${SITE_URL}/tools`;
const TITLE = 'Tools and demos | Maz Works';
const DESCRIPTION = fitDescription('Try practical interactive examples: a restaurant table picker, a missed-calls calculator and a call-answering demo. Demonstrations use sample information.');

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: PAGE_URL, type: 'website', images: [OG_IMAGE] },
};

const TOOLS = [
  { name: 'Missed-calls calculator', href: '/local-businesses#missed-calls-calculator', blurb: 'Estimate what missed calls could be costing your business using your own figures.' },
  { name: 'After-hours receptionist demo', href: '/receptionist-demo', blurb: 'Try a sample phone conversation and see the summary an owner would receive.' },
] as const;

export default function ToolsPage() {
  return (
    <main className="tl-page">
      <SiteHeader />
      <Breadcrumbs items={[{ label: 'Tools and demos' }]} />

      <section className="tl-hero" id="main-content" tabIndex={-1} aria-labelledby="tools-title">
        <p className="rx-kicker">Tools and demos</p>
        <h1 id="tools-title">Try it before you talk to me.</h1>
        <p className="rx-lede">A few interactive examples of what a useful tool can do. They are demonstrations, not live customer systems.</p>
      </section>

      <section className="rx-band rx-band--sky" aria-labelledby="tools-feature-title">
        <div className="tl-feature">
          <div className="tl-feature-copy">
            <span className="rx-tag" data-kind="concept">Interactive concept demo</span>
            <h2 id="tools-feature-title">Choose a table in a restaurant.</h2>
            <p className="rx-lede">Pick a table on a floor plan and see how a booking system could work. It uses a made-up cafe and sample availability; no reservation is made.</p>
            <a className="button button-signal" href="/tools/restaurant-tables">Try the table picker</a>
          </div>
          <div className="tl-feature-art"><MiniPlan /></div>
        </div>
      </section>

      <section className="rx-section" aria-labelledby="tools-more-title">
        <h2 id="tools-more-title" className="tl-h2">Two more to try.</h2>
        <ul className="tl-index">
          {TOOLS.map((tool) => (
            <li className="tl-row" key={tool.name}>
              <span className="rx-tag" data-kind="concept">Demo</span>
              <div>
                <h3><a href={tool.href}>{tool.name}</a></h3>
                <p>{tool.blurb}</p>
              </div>
              <span className="tl-row-go" aria-hidden="true">↗</span>
            </li>
          ))}
        </ul>
        <p className="rx-prose" style={{ marginTop: 24 }}>Want to see completed work instead? <a className="rx-link" href="/proof">See my work</a>.</p>
      </section>

      <section className="rx-band rx-band--peach tl-close" aria-labelledby="tools-close-title">
        <h2 id="tools-close-title" className="rx-title">Got a job that keeps coming back?</h2>
        <p className="rx-lede">Tell me what happens now. I'll suggest the simplest practical next step.</p>
        <a className="button button-signal" href="/contact?src=tools#contact">{ENQUIRY_CTA}</a>
      </section>

      <SiteFooter />
    </main>
  );
}
