import type { Metadata } from 'next';
import { Breadcrumbs } from '../breadcrumbs';
import { fitDescription, OG_IMAGE } from '../seo';
import { SITE_URL } from '../site';
import { SiteFooter, SiteHeader } from '../site-chrome';
import './research.css';

const PAGE_URL = `${SITE_URL}/research`;
const SCORENSIC = 'https://github.com/manazoid4/scorensic';
const RUN = 'https://github.com/manazoid4/scorensic/blob/main/validation/FIRST-REAL-RUN.md';
const DESCRIPTION = fitDescription('Open research from Maz Works: testing whether AI can really do a business job, such as answering complaints, before anyone relies on it.');

export const metadata: Metadata = {
  title: { absolute: 'Research: can AI do the job? | Maz Works' },
  description: DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  openGraph: { title: 'Can AI do the job? Test it before you rely on it.', description: DESCRIPTION, url: PAGE_URL, type: 'article', images: [OG_IMAGE] },
};

// Every figure here comes from the Scorensic repository (validation/FIRST-REAL-RUN.md, 1 Nov 2026). Update only with linked evidence.
const RESULTS = [
  { figure: '0 of 8', text: 'deadlines worked out correctly by either model.' },
  { figure: '0 of 2', text: 'regulated replies that met the ombudsman rules. One sounded compliant but wasn’t.' },
  { figure: '8 of 8', text: 'letters refused by one model. It called a gym cancellation reply a possible scam.' },
] as const;

const OTHER = [
  { name: 'Agent Nudge', what: 'Warns AI coding tools when they are about to work on the same files.', status: 'Working local proof', source: 'https://github.com/manazoid4/agent-nudge', demo: 'https://agent-nudge-bay.vercel.app/demo/overview' },
  { name: 'mazcraft', what: 'Gives longer AI jobs clear stopping points and handovers a person can review.', status: 'Open-source tool, testing ongoing', source: 'https://github.com/manazoid4/mazcraft', demo: null },
  { name: 'nod', what: 'A small device for approving important AI requests away from the desk.', status: 'Early hardware', source: 'https://github.com/manazoid4/nod', demo: null },
] as const;

export default function ResearchPage() {
  return (
    <main className="ar-page">
      <SiteHeader />
      <div className="ar-wrap">
        <Breadcrumbs items={[{ label: 'Research' }]} />
        <article className="ar-paper">
          <header className="ar-hero" id="main-content" tabIndex={-1}>
            <div className="ar-paper-meta">
              <span>Maz Works / Open research</span>
              <time dateTime="2026-11-01">Updated 1 November 2026</time>
            </div>
            <h1>Can AI do the job? <em>Test it before you rely on it.</em></h1>
            <div className="ar-abstract">
              <p className="ar-kicker">In short</p>
              <p>AI is being sold for customer work. I test whether it can actually do the job, on real tasks, and publish what I find.</p>
            </div>
            <div className="ar-actions">
              <a className="button button-signal" href="#scorensic">See the first results</a>
              <a className="ar-text-link" href="/contact?src=research#contact">Have your own tasks tested <span aria-hidden="true">→</span></a>
            </div>
          </header>

          <section className="ar-thesis" aria-labelledby="why-title">
            <span className="ar-number">Why it matters</span>
            <h2 id="why-title">A confident wrong answer costs more than no answer.</h2>
            <p>A missed deadline or a non-compliant reply can go to the ombudsman: <a href="https://www.financial-ombudsman.org.uk/businesses/resolving-complaint/case-fees" target="_blank" rel="noopener noreferrer">£680 a case</a> once a firm’s free allowance is used.</p>
          </section>

          <section className="ar-experiments" id="scorensic" aria-labelledby="sc-title">
            <div className="ar-section-heading">
              <p className="ar-kicker">Flagship project</p>
              <h2 id="sc-title">Scorensic: a test pack for real jobs.</h2>
              <p>Your tasks in, a one-page report card out: right, confidently wrong, and whether your data left the building. Letters are checked against what they must and must never say.</p>
            </div>
            <div className="ar-studies">
              <article className="ar-study">
                <div className="ar-study-top"><h3>First test: UK complaints handling</h3><span className="ar-status">Early results</span></div>
                <p className="ar-study-question">62 tasks from invented complaints, run on two small AI models.</p>
                <ul className="rs-results">
                  {RESULTS.map((r) => <li key={r.figure}><strong>{r.figure}</strong> {r.text}</li>)}
                </ul>
                <p>Lesson: calculate dates with ordinary software, check every letter, keep a person in charge.</p>
                <p className="ar-caveat">Larger models are not tested yet. A first result, not a verdict.</p>
                <div className="ar-study-links">
                  <a className="ar-text-link" href={RUN} target="_blank" rel="noopener noreferrer">Read the full results ↗</a>
                  <a className="ar-text-link" href="/research/scorensic">Project page →</a>
                  <a className="ar-text-link" href={SCORENSIC} target="_blank" rel="noopener noreferrer">Source code ↗</a>
                </div>
              </article>
            </div>
          </section>

          <section className="ar-proposal" aria-labelledby="use-title">
            <div>
              <p className="ar-kicker">Use it or get involved</p>
              <h2 id="use-title">Bring 10 to 20 real examples.</h2>
              <p>I’ll show you where AI helps, where it doesn’t, and what a safe set-up looks like.</p>
            </div>
            <div className="ar-footer-actions">
              <a className="button button-signal" href="/contact?src=research#contact">Tell me what your team handles</a>
              <a className="ar-text-link" href={SCORENSIC} target="_blank" rel="noopener noreferrer">Run it yourself ↗</a>
            </div>
          </section>

          <section className="ar-experiments" aria-labelledby="other-title">
            <details className="rs-more">
              <summary id="other-title">Other experiments: keeping AI tools organised and people in control</summary>
              <ul className="rs-other">
                {OTHER.map((o) => (
                  <li key={o.name}>
                    <div className="ar-study-top"><h3>{o.name}</h3><span className="ar-status">{o.status}</span></div>
                    <p>{o.what}</p>
                    <p className="ar-study-links">
                      <a className="ar-text-link" href={o.source} target="_blank" rel="noopener noreferrer">Source ↗</a>
                      {o.demo && <a className="ar-text-link" href={o.demo} target="_blank" rel="noopener noreferrer">Recorded demo ↗</a>}
                    </p>
                  </li>
                ))}
              </ul>
            </details>
            <details className="rs-more">
              <summary>For engineers: how it works</summary>
              <p>Scorensic started as a checker for AI benchmark graders. It feeds a grader answers whose verdict is already known (blank, hedged, reformatted, near-miss), re-runs them in separate processes and searches what the agent can see for leaked answers. On a real scorer bug in inspect_evals (PR #2334) it caught 2 of 3 known problem types, with no false alarms on the fixed versions. The complaints pack checks its own marking first: it rejects all 460 deliberately wrong answers before scoring.</p>
              <p>Working idea across these projects: every AI task should leave a short record of what was asked, what changed, what was checked and what is still unverified. A direction, not a released standard. Related work: <a href="https://opentelemetry.io/" target="_blank" rel="noopener noreferrer">OpenTelemetry</a>, <a href="https://github.com/a2aproject/A2A" target="_blank" rel="noopener noreferrer">Agent2Agent</a>. Repository: <a href={SCORENSIC} target="_blank" rel="noopener noreferrer">github.com/manazoid4/scorensic</a>.</p>
            </details>
          </section>

          <footer className="ar-paper-footer">
            <div>
              <p className="ar-kicker">Open by default</p>
              <h2>Inspect it, run it, challenge it.</h2>
            </div>
            <div className="ar-footer-actions">
              <a className="ar-text-link" href="https://github.com/manazoid4" target="_blank" rel="noopener noreferrer">All repositories ↗</a>
              <a className="ar-text-link" href="mailto:info@mazworks.uk?subject=Research">Discuss the research ↗</a>
            </div>
          </footer>
        </article>
      </div>
      <SiteFooter conversion={<></>} />
    </main>
  );
}
