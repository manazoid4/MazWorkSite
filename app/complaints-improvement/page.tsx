import type { Metadata } from 'next';
import { fitDescription, OG_IMAGE } from '../seo';
import { SITE_URL } from '../site';
import { COMPLAINT_PACKAGES, type ComplaintPackage } from '../offers';
import { FICTION_NOTE } from '../complaints/reports';
import { SiteFooter, SiteHeader } from '../site-chrome';
import '../b2b.css';

const PAGE_URL = `${SITE_URL}/complaints-improvement`;

export const metadata: Metadata = {
  title: 'Complaints analysis and improvement | Maz Works',
  description: fitDescription('Complaints health checks, reporting and practical improvement for professional teams. Scope and findings depend on agreed scope and anonymised data quality.'),
  alternates: { canonical: PAGE_URL },
  openGraph: { title: 'Complaints analysis and improvement — Maz Works', description: fitDescription('Understand complaint patterns, report them clearly and plan practical improvements.'), url: PAGE_URL, type: 'website', images: [OG_IMAGE] },
};

function Offer({ pack, number }: { pack: ComplaintPackage; number: string }) {
  return <li><span className="b2b-tag">{number}</span><h3>{pack.name}</h3><p className="b2b-price">Quoted to scope</p><p>{pack.purpose}</p><h4>What you receive</h4><ul className="b2b-list">{pack.receives.map((item) => <li key={item}>{item}</li>)}</ul><details><summary>Scope, inputs and limits</summary><p><strong>Inputs:</strong> {pack.needs.join('; ')}.</p><p><strong>Limits:</strong> {pack.limits.join('; ')}.</p><p><strong>Typical timing:</strong> {pack.turnaround} after agreed inputs are received.</p></details></li>;
}

export default function ComplaintsImprovementPage() {
  const [health, reporting, workflow] = COMPLAINT_PACKAGES;
  return (
    <main className="b2b-page">
      <SiteHeader />
      <section className="mw-resource-hero" id="main-content" tabIndex={-1} aria-labelledby="ci-title">
        <p className="eyebrow">Complaints analysis and improvement</p>
        <h1 id="ci-title">Turn complaint records into clear findings and practical action.</h1>
        <p>I have five years’ experience in complaints and finance, including regulated work and ombudsman cases. I now help teams review their records, report what they show and make agreed improvements to how work is handled.</p>
        <p>To enquire, describe your current process; no records are needed at this stage. Suitable anonymised extracts and data handling and retention terms are agreed in the written scope before any records are shared.</p>
        <p className="b2b-cta"><a className="button button-signal" href="/contact?src=complaints-improvement&amp;service=complaints#contact">Tell me what's not working</a></p>
        <p className="mw-hero-note">Engagements are quoted to scope. Examples use synthetic data.</p>
      </section>

      <section className="b2b-wrap" aria-labelledby="ci-offers">
        <p className="eyebrow">Three ways to work together</p>
        <h2 id="ci-offers">Start with the question your team needs answered.</h2>
        <p className="b2b-lede">Outputs and findings depend on the agreed scope and the quality, completeness and consistency of the anonymised data supplied.</p>
        <ul className="b2b-grid is-three"><Offer pack={health} number="01 · Complaints Health Check" /><Offer pack={reporting} number="02 · Reporting & Oversight" /><Offer pack={workflow} number="03 · Improvement & Implementation" /></ul>
      </section>

      <section className="b2b-wrap" aria-labelledby="ci-examples">
        <p className="eyebrow">Synthetic examples</p>
        <h2 id="ci-examples">See the shape of the work.</h2>
        <p>These are labelled fictional examples built from invented data. They are not client work or evidence of results.</p>
        <ul className="b2b-grid is-three">
          <li><h3>Complaints Health Check</h3><p>A sample review report showing scores, findings and ranked actions.</p><p className="b2b-fine">{FICTION_NOTE}</p><a href="/complaints/sample/health-check">View the sample Health Check →</a></li>
          <li><h3>Board reporting</h3><p>A sample report turning a fictional dataset into oversight and actions.</p><p className="b2b-fine">{FICTION_NOTE}</p><a href="/complaints/sample/board-report">View the sample board report →</a></li>
          <li><h3>Dashboard demonstration</h3><p>A synthetic dashboard and action tracker built from the fictional complaints dataset.</p><p className="b2b-fine">{FICTION_NOTE}</p><a href="/complaints#board-reporting">View the dashboard and reporting demonstration →</a></li>
          <li><h3>Synthetic workflow demonstration</h3><p>Illustrative process flow, escalation decision tree and staff guides.</p><p>Examples show possible formats, not client outcomes.</p><a href="/complaints#workflows">View workflow and staff guide demonstrations →</a></li>
        </ul>
        <p className="b2b-fine">Synthetic data disclaimer: Northgate Advisory and all records, people, events, figures and findings in these examples are fictional and invented for demonstration. They do not describe a real organisation or client outcome.</p>
      </section>

      <section className="b2b-wrap" aria-labelledby="ci-limits">
        <h2 id="ci-limits">Clear boundaries</h2>
        <ul className="b2b-list"><li>Analysis is based on the records and scope agreed with you; incomplete or inconsistent data can limit findings.</li><li>Work is not legal or regulatory advice and does not certify that a process meets any rules.</li><li>No reduction in complaints, savings or other outcome is promised.</li><li>Implementation is limited to the workflow and deliverables agreed in writing. Your team remains responsible for decisions and operational changes.</li></ul>
      </section>

      <section className="mw-resource-hero" aria-labelledby="ci-cta">
        <h2 id="ci-cta">Tell me what is not working.</h2>
        <p>Describe the reporting question or process that is taking time. We can agree what data is suitable and what a useful piece of work should include.</p>
        <p className="b2b-cta"><a className="button button-signal" href="/contact?src=complaints-improvement&amp;service=complaints#contact">Tell me what's not working</a></p>
      </section>
      <SiteFooter />
    </main>
  );
}
