import type { Metadata } from 'next';
import { Breadcrumbs } from '../breadcrumbs';
import { fitDescription, OG_IMAGE } from '../seo';
import { SITE_URL } from '../site';
import { SiteFooter, SiteHeader } from '../site-chrome';
import './research.css';

const PAGE_URL = `${SITE_URL}/research`;
const DESCRIPTION = fitDescription('Engineering research by Manazir Hussain. Practical experiments in how AI agents coordinate, prove their work and keep people in control.');

export const metadata: Metadata = {
  title: { absolute: 'Engineering Research | Manazir Hussain | Maz Works' },
  description: DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: 'AI agents can do the work. How do we know it is done?',
    description: DESCRIPTION,
    url: PAGE_URL,
    type: 'article',
    images: [OG_IMAGE],
  },
};

const STUDIES = [
  {
    number: '01',
    name: 'Agent Nudge',
    question: 'What happens when two agents work on the same code?',
    approach: 'I built local checks that share relevant warnings, flag overlapping work and record task outcomes alongside their evidence.',
    finding: 'A warning can expose a conflict before a covered action. It does not, by itself, prove that a mistake was prevented.',
    status: 'Working local proof',
    source: 'https://github.com/manazoid4/agent-nudge',
    demo: 'https://agent-nudge-bay.vercel.app/demo/overview',
  },
  {
    number: '02',
    name: 'mazcraft',
    question: 'How can longer AI tasks stay organised and reviewable?',
    approach: 'I built a way to give coding agents tracked jobs, keep work separate and bring decisions and results back for review.',
    finding: 'Useful autonomy needs clear stopping points and handovers, not just more agents running at once.',
    status: 'Open-source CLI; platform testing ongoing',
    source: 'https://github.com/manazoid4/mazcraft',
    demo: null,
  },
  {
    number: '03',
    name: 'nod',
    question: 'How can a person stay in control away from their desk?',
    approach: 'I am exploring a small physical device for reviewing important agent requests and responding without opening a laptop.',
    finding: 'The approval experience needs to be understandable and safe when the device is unavailable. This remains an early build.',
    status: 'Early hardware research',
    source: 'https://github.com/manazoid4/nod',
    demo: null,
  },
] as const;

export default function ResearchPage() {
  return (
    <main className="ar-page">
      <SiteHeader />
      <div className="ar-wrap">
        <Breadcrumbs items={[{ label: 'Tools and demos', href: '/tools' }, { label: 'Research' }]} />
        <article className="ar-paper">
          <header className="ar-hero" id="main-content" tabIndex={-1}>
            <div className="ar-paper-meta">
              <span>Maz Works / Engineering research</span>
              <time dateTime="2026-10-28">28 October 2026</time>
            </div>
            <h1>AI agents can do the work. <em>How do we know it’s done?</em></h1>
            <p className="ar-byline">Research and engineering by <strong>Manazir Hussain</strong></p>
            <div className="ar-abstract">
              <p className="ar-kicker">Abstract</p>
              <p>As AI agents take on bigger tasks, a convincing answer is no longer enough. We need to know what actually happened, what was checked and when a person needs to decide. My work explores those questions through small, testable tools rather than another AI agent.</p>
            </div>
            <div className="ar-actions">
              <a className="button button-signal" href="#experiments">Explore the projects</a>
              <a className="ar-text-link" href="https://github.com/manazoid4" target="_blank" rel="noopener noreferrer">My GitHub <span aria-hidden="true">↗</span></a>
            </div>
          </header>

          <section className="ar-thesis" aria-labelledby="ar-question-title">
            <span className="ar-number">The research question</span>
            <h2 id="ar-question-title">What would make an agent’s work worth trusting?</h2>
            <p>My focus is the work around the model: coordination, evidence, recovery and human decisions. These projects test different parts of that problem.</p>
          </section>

          <section className="ar-experiments" id="experiments" aria-labelledby="ar-experiments-title">
            <div className="ar-section-heading">
              <p className="ar-kicker">Selected experiments</p>
              <h2 id="ar-experiments-title">Engineering, with the evidence linked.</h2>
              <p>Three projects. Each has a question, something built and a clear limit to what it proves.</p>
            </div>
            <div className="ar-studies">
              {STUDIES.map((study) => (
                <article className="ar-study" key={study.number}>
                  <div className="ar-study-top">
                    <span className="ar-number">{study.number} / Research note</span>
                    <span className="ar-status">{study.status}</span>
                  </div>
                  <h3>{study.name}</h3>
                  <p className="ar-study-question">{study.question}</p>
                  <p><strong>What I built.</strong> {study.approach}</p>
                  <p><strong>What it shows.</strong> {study.finding}</p>
                  <div className="ar-study-links">
                    <a href={study.source} target="_blank" rel="noopener noreferrer">Read the source <span aria-hidden="true">↗</span></a>
                    {study.demo && <a href={study.demo} target="_blank" rel="noopener noreferrer">See the recorded demo <span aria-hidden="true">↗</span></a>}
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="ar-proposal" aria-labelledby="ar-proposal-title">
            <div>
              <p className="ar-kicker">Working hypothesis</p>
              <h2 id="ar-proposal-title">Every agent task should leave a work receipt.</h2>
              <p>A simple, portable record of what was requested, what changed, which checks ran and what remains unknown could make it easier for people and other agents to review the outcome.</p>
              <p className="ar-caveat">This is a proposed direction, not a released standard or a finished cross-tool product.</p>
            </div>
            <div className="ar-receipt" aria-label="Four questions a proposed work receipt would answer">
              <p className="ar-receipt-title">WORK RECEIPT / CONCEPT</p>
              <div><span>01 / Task</span><strong>What was requested?</strong></div>
              <div><span>02 / Change</span><strong>What actually changed?</strong></div>
              <div><span>03 / Evidence</span><strong>What was checked?</strong></div>
              <div><span>04 / Limits</span><strong>What is still unverified?</strong></div>
            </div>
          </section>

          <footer className="ar-paper-footer">
            <div>
              <p className="ar-kicker">Further reading &amp; discussion</p>
              <h2>Open work, open questions.</h2>
              <p>I publish code and research notes so others can inspect the work, challenge the approach and build on it. I am also exploring process evidence through <a href="https://github.com/manazoid4/flowlens" target="_blank" rel="noopener noreferrer">FlowLens</a>.</p>
              <p className="ar-references">Related work: <a href="https://opentelemetry.io/" target="_blank" rel="noopener noreferrer">OpenTelemetry</a> · <a href="https://github.com/a2aproject/A2A" target="_blank" rel="noopener noreferrer">Agent2Agent</a></p>
            </div>
            <div className="ar-footer-actions">
              <a className="ar-text-link" href="https://github.com/manazoid4" target="_blank" rel="noopener noreferrer">Explore the repositories ↗</a>
              <a className="ar-text-link" href="mailto:info@mazworks.uk?subject=Engineering%20research">Discuss the research ↗</a>
            </div>
          </footer>
        </article>
      </div>
      <SiteFooter conversion={<></>} />
    </main>
  );
}
