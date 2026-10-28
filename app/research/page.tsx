import type { Metadata } from 'next';
import { Breadcrumbs } from '../breadcrumbs';
import { fitDescription, OG_IMAGE } from '../seo';
import { SITE_URL } from '../site';
import { SiteFooter, SiteHeader } from '../site-chrome';
import './research.css';

const PAGE_URL = `${SITE_URL}/research`;
const DESCRIPTION = fitDescription('Maz Works research into a missing layer for AI agents: outcome receipts, collision prevention, recoverable sessions, capability tests and human approvals.');

export const metadata: Metadata = {
  title: { absolute: 'Research: reliable AI agent infrastructure | Maz Works' },
  description: DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  openGraph: { title: 'The missing layer for AI agents | Maz Works', description: DESCRIPTION, url: PAGE_URL, type: 'website', images: [OG_IMAGE] },
};

const INVESTIGATIONS = [
  {
    number: '01',
    label: 'Evidence of completion',
    title: 'Receipts, not “done” messages',
    problem: 'An agent reports success. But did the change actually work?',
    work: 'Agent Nudge already records versioned, ownership-checked outcome receipts separately from delivery and links to supporting evidence.',
    next: 'Explore an open, portable receipt format other agent runtimes could emit and independently verify.',
    status: 'Working local proof · portable format proposed',
    link: 'https://github.com/manazoid4/agent-nudge',
    linkText: 'Agent Nudge source',
  },
  {
    number: '02',
    label: 'Cooperation without collisions',
    title: 'Shared work claims and useful warnings',
    problem: 'Two agents change the same file or repeat a failure that another agent already diagnosed.',
    work: 'Agent Nudge has local task/path claims, conflict warnings, scoped context sharing and suppression of irrelevant updates.',
    next: 'Stress-test expiring claims and recovery across independently running agent tools, not just a rehearsed scenario.',
    status: 'Local SQLite proof · recorded public demo',
    link: 'https://agent-nudge-bay.vercel.app/demo/overview',
    linkText: 'Try the recorded scenario',
  },
  {
    number: '03',
    label: 'Continuity and recovery',
    title: 'A session should survive its agent',
    problem: 'A long task stalls or hits a usage limit. The next agent starts from scratch, or repeats unsafe work.',
    work: 'mazcraft explores bounded job queues, worktrees and review. My private cross-agent memory work stores compact project state, evidence and handovers.',
    next: 'Design a small recovery capsule: last verified state, open questions, blocked actions and the next safe step.',
    status: 'Existing private implementations · shared format proposed',
    link: null,
    linkText: null,
  },
  {
    number: '04',
    label: 'Trust boundaries',
    title: 'Test what an agent can really enforce',
    problem: 'A provider may claim to support approvals, sandboxing or recovery while an adapter silently lacks that capability.',
    work: 'Agent Nudge uses provider capability manifests and distinguishes unsupported, observed, advisory and enforced behaviour.',
    next: 'Publish a reusable conformance test harness for the promises that matter before a workflow is trusted.',
    status: 'Assurance primitives in repo · wider test harness proposed',
    link: 'https://github.com/manazoid4/agent-nudge',
    linkText: 'Inspect capability contracts',
  },
  {
    number: '05',
    label: 'Human decisions',
    title: 'Approvals at the moment they matter',
    problem: 'An agent is about to send, buy, delete or deploy, but its owner is away from the terminal.',
    work: 'nod is an early open-source hardware project investigating a remote approval path with a local hub and a physical device.',
    next: 'Make requests understandable, time-bound and auditable; preserve the native approval flow if the device is unavailable.',
    status: 'Early hardware and firmware project',
    link: 'https://github.com/manazoid4/nod',
    linkText: 'Explore nod',
  },
  {
    number: '06',
    label: 'Process evidence',
    title: 'Check the process, not only the final output',
    problem: 'The end result looks plausible, but important procedural checks were skipped.',
    work: 'FlowLens models observed steps as reviewable, versioned processes and has working Markdown/JSON exports from its fixture-based preview.',
    next: 'Research how an agent run could attach evidence to each required step without logging private content.',
    status: 'Interactive preview · live capture not shipped',
    link: 'https://github.com/manazoid4/flowlens',
    linkText: 'FlowLens source',
  },
] as const;

export default function ResearchPage() {
  return (
    <main className="ar-page">
      <SiteHeader />
      <Breadcrumbs items={[{ label: 'Tools and demos', href: '/tools' }, { label: 'Research' }]} />
      <header className="ar-hero" id="main-content" tabIndex={-1}>
        <div className="ar-hero-copy">
          <p className="ar-eyebrow">Maz Works / Engineering research</p>
          <h1>Agents can act.<br /><em>Who checks the work?</em></h1>
          <p className="ar-intro">I am not building another agent runner or chatbot. I am exploring the layer around agents: <strong>did the work happen, can we prove it, can the next agent pick up safely, and who approved it?</strong></p>
          <div className="ar-actions">
            <a className="button button-signal" href="#work">See the research</a>
            <a className="ar-link" href="https://github.com/manazoid4" target="_blank" rel="noopener noreferrer">My GitHub <span aria-hidden="true">↗</span></a>
          </div>
        </div>
        <div className="ar-flow" aria-label="Proposed agent reliability workflow">
          <p className="ar-flow-label">Proposed reliability layer</p>
          <div className="ar-flow-step"><span>01</span><strong>Agent takes action</strong><small>Any compatible runtime</small></div>
          <div className="ar-flow-step"><span>02</span><strong>Rules and approval</strong><small>What is actually enforced?</small></div>
          <div className="ar-flow-step"><span>03</span><strong>Independent checks</strong><small>Tests, diff, artifact, outcome</small></div>
          <div className="ar-flow-step"><span>04</span><strong>Portable receipt</strong><small>Evidence for the next person or agent</small></div>
          <p className="ar-flow-foot">A design direction, not a claim that a unified platform is already deployed.</p>
        </div>
      </header>

      <section className="ar-difference" aria-labelledby="ar-difference-title">
        <div>
          <p className="ar-eyebrow">Where I think the gap is</p>
          <h2 id="ar-difference-title">Don't compete with the engines. Build what they can use.</h2>
        </div>
        <div className="ar-difference-copy">
          <p><a href="https://opencode.ai/" target="_blank" rel="noopener noreferrer">OpenCode</a> already handles coding agents, multiple sessions and subagents. <a href="https://github.com/odysseus-dev/odysseus" target="_blank" rel="noopener noreferrer">Odysseus</a> offers a local-first AI workspace. Rebuilding either would add little.</p>
          <p><strong>My focus is different:</strong> an external reliability layer that can work with multiple runtimes and leave inspectable proof after a task ends.</p>
          <p className="ar-honesty">Not a claim of first-in-the-world novelty. This is a specific direction I can test and contribute to through existing engineering work.</p>
        </div>
      </section>

      <section className="ar-section" id="work" aria-labelledby="ar-work-title">
        <div className="ar-section-head">
          <p className="ar-eyebrow">Six concrete lines of research</p>
          <h2 id="ar-work-title">Infrastructure problems worth solving.</h2>
          <p>Each area is tied to an actual repository or private implementation. Existing work, working demos and proposed next steps are kept separate.</p>
        </div>
        <div className="ar-list">
          {INVESTIGATIONS.map((item) => (
            <article className="ar-item" key={item.number}>
              <div className="ar-item-index"><span>{item.number}</span><small>{item.label}</small></div>
              <div className="ar-item-body">
                <h3>{item.title}</h3>
                <p className="ar-problem">{item.problem}</p>
                <p><strong>Existing work:</strong> {item.work}</p>
                <p><strong>Research direction:</strong> {item.next}</p>
                <p className="ar-status">{item.status}</p>
                {item.link && <a className="ar-link" href={item.link} rel="noopener noreferrer" target="_blank">{item.linkText} <span aria-hidden="true">↗</span></a>}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="ar-receipt" aria-labelledby="ar-receipt-title">
        <div>
          <p className="ar-eyebrow">A potential public contribution</p>
          <h2 id="ar-receipt-title">An agent work receipt.</h2>
          <p>A proposed portable output that answers five questions: <strong>What was requested? What changed? Which checks actually ran? What approval was given? What remains unverified?</strong></p>
          <p>Existing observability can record what tools were called. I want to explore a small format for <em>outcome evidence</em>, compatible with existing standards instead of replacing them.</p>
          <p className="ar-quiet">Proposal only. The example opposite illustrates the contract; it is not a receipt from a real agent run.</p>
        </div>
        <div className="ar-receipt-card" role="img" aria-label="Illustrative work receipt showing a verified test, recorded approval, and an unverified deployment">
          <div className="ar-receipt-bar"><span>WORK RECEIPT / EXAMPLE</span><span>v0 idea</span></div>
          <div className="ar-receipt-line"><span>Requested</span><strong>Fix duplicate submissions</strong></div>
          <div className="ar-receipt-line"><span>Change</span><strong>Patch + diff reference</strong></div>
          <div className="ar-receipt-line"><span>Check</span><strong>PASS · test evidence attached</strong></div>
          <div className="ar-receipt-line"><span>Approval</span><strong>Human decision recorded</strong></div>
          <div className="ar-receipt-line"><span>Still unknown</span><strong>Production outcome not observed</strong></div>
        </div>
      </section>

      <section className="ar-standards" aria-labelledby="ar-standards-title">
        <h2 id="ar-standards-title">Build on standards, not around them.</h2>
        <p>OpenTelemetry already describes agent and tool traces; Agent2Agent defines tasks and artifacts. My research should complement those systems with practical checks and compact outcome evidence, rather than inventing a competing agent protocol.</p>
        <div className="ar-standards-links">
          <a href="https://github.com/open-telemetry/semantic-conventions-genai" target="_blank" rel="noopener noreferrer">OpenTelemetry GenAI conventions ↗</a>
          <a href="https://github.com/a2aproject/A2A" target="_blank" rel="noopener noreferrer">Agent2Agent protocol ↗</a>
        </div>
      </section>

      <section className="ar-last" aria-labelledby="ar-last-title">
        <p className="ar-eyebrow">Research, not a sales pitch</p>
        <h2 id="ar-last-title">Interested in making agent work more trustworthy?</h2>
        <p>Read the source, test the scenarios, or get in touch with a concrete failure case. Contributions and critical feedback are welcome.</p>
        <div className="ar-actions">
          <a href="https://github.com/manazoid4/agent-nudge" className="button button-signal" target="_blank" rel="noopener noreferrer">Start with Agent Nudge</a>
          <a href="/contact" className="ar-link">Contact Maz Works <span aria-hidden="true">↗</span></a>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
