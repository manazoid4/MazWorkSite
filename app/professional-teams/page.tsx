import type { Metadata } from 'next';
import { fitDescription, OG_IMAGE } from '../seo';
import { SITE_URL } from '../site';
import { SiteFooter, SiteHeader } from '../site-chrome';
import '../b2b.css';

const PAGE_URL = `${SITE_URL}/professional-teams`;

export const metadata: Metadata = {
  title: 'Systems for professional teams | Maz Works',
  description: fitDescription('Clearer complaints reporting and practical workflows for professional teams. Scope and findings depend on agreed scope and anonymised data quality.'),
  alternates: { canonical: PAGE_URL },
  openGraph: { title: 'Systems for professional teams — Maz Works', description: fitDescription('Turn complaint records into clear findings, reporting and practical next steps.'), url: PAGE_URL, type: 'website', images: [OG_IMAGE] },
};

export default function ProfessionalTeamsPage() {
  return (
    <main className="b2b-page">
      <SiteHeader />
      <section className="mw-resource-hero" id="main-content" tabIndex={-1} aria-labelledby="teams-title">
        <p className="eyebrow">For professional teams</p>
        <h1 id="teams-title">Make complaints easier to understand and act on.</h1>
        <p>I build clear reporting and practical workflows from the records and processes your team already has. The work is scoped with you, and findings depend on the quality of the anonymised data available.</p>
        <p className="b2b-cta"><a className="button button-signal" href="/contact?src=professional-teams&amp;service=complaints#contact">Tell me what's not working</a></p>
      </section>
      <section className="b2b-wrap" aria-labelledby="teams-work">
        <p className="eyebrow">Where I can help</p>
        <h2 id="teams-work">From scattered records to a useful next step.</h2>
        <ul className="b2b-grid is-three">
          <li><h3>Complaints insight</h3><p>Review anonymised cases to identify handling patterns and prioritise improvements.</p></li>
          <li><h3>Reporting and oversight</h3><p>Turn an agreed dataset into a clear dashboard, board presentation and action tracker.</p></li>
          <li><h3>Workflows and staff guides</h3><p>Make an existing process easier to follow with a flowchart, decision tree and practical guides.</p></li>
        </ul>
        <p><a href="/complaints-improvement">See complaints improvement services and examples →</a></p>
      </section>
      <section className="b2b-wrap" aria-labelledby="teams-background">
        <h2 id="teams-background">Built from hands-on complaints work.</h2>
        <p>Manazir Hussain is a Computer Science graduate (Swansea University) with five years in complaints and finance, including regulated work and ombudsman cases. He builds every job himself.</p>
        <p>These services support analysis, reporting and implementation. They are not legal or regulatory advice, and no particular outcome is promised.</p>
      </section>
      <section className="mw-resource-hero" aria-labelledby="teams-cta">
        <h2 id="teams-cta">Start with what is getting in the way.</h2>
        <p>Share the process you want to improve and the kind of records available. We can agree the scope from there.</p>
        <p className="b2b-cta"><a className="button button-signal" href="/contact?src=professional-teams&amp;service=complaints#contact">Tell me what's not working</a></p>
      </section>
      <SiteFooter />
    </main>
  );
}
