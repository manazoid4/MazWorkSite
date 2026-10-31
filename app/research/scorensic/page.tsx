import type { Metadata } from 'next';
import { Breadcrumbs } from '../../breadcrumbs';
import { fitDescription, OG_IMAGE } from '../../seo';
import { SITE_URL } from '../../site';
import { SiteFooter, SiteHeader } from '../../site-chrome';
import '../research.css';
import './scorensic.css';

const PAGE_URL = `${SITE_URL}/research/scorensic`;
const REPO = 'https://github.com/manazoid4/scorensic';
const DESCRIPTION = fitDescription('Scorensic: an open-source research project checking whether AI benchmark graders mark answers correctly. Offline, no API key, early research stage.');

export const metadata: Metadata = {
  title: { absolute: 'Scorensic: testing AI benchmark graders | Maz Works' },
  description: DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: 'Scorensic: who checks the benchmark’s grader?',
    description: DESCRIPTION,
    url: PAGE_URL,
    type: 'article',
    images: [OG_IMAGE],
  },
};

// Update these lists as work is verified. Stages only advance with linked evidence.
const UPDATED = { iso: '2026-10-31', label: '31 October 2026' };
const STAGES = ['Research initiated', 'First reproducible tests', 'MVP working', 'External benchmark validation', 'Public beta'];
const CURRENT_STAGE = 1;

const EVIDENCE = [
  { claim: 'A do-nothing agent scored 38% on tau-bench airline tasks.', source: 'Agentic Benchmark Checklist, 2025', href: 'https://arxiv.org/abs/2507.02825' },
  { claim: 'An inspect_evals scorer gave full marks to the string “yesno”. It was fixed by hand with a list of bad answers.', source: 'inspect_evals PR #2334', href: 'https://github.com/UKGovernmentBEIS/inspect_evals/pull/2334' },
  { claim: 'SWE-bench agents could read the fix from the repository’s git history.', source: 'SWE-bench issue #465', href: 'https://github.com/SWE-bench/SWE-bench/issues/465' },
  { claim: 'A contributor hand-built 21 cheats and 6 valid answers to test one Terminal-Bench verifier.', source: 'terminal-bench PR #2097', href: 'https://github.com/harbor-framework/terminal-bench/pull/2097' },
] as const;

const GAPS = [
  { tool: 'BenchJack', does: 'Scans benchmarks for exploits using a coding agent.', gap: 'Needs Claude Code or Codex to run.', ours: 'Runs offline, with no model and no API key.' },
  { tool: 'evalmut', does: 'Rigorous mutation testing of grader verdicts.', gap: 'No checks across repeated runs or for leaked answers.', ours: 'Re-scores each input in separate processes and scans what the agent can read.' },
  { tool: 'Harbor oracle and no-op agents', does: 'Checks that the reference passes and an empty agent fails.', gap: 'Its own manual says a passing oracle does not prove wrong answers fail.', ours: 'A reusable set of junk, hedged and known-wrong answers for every task.' },
  { tool: 'Hand-written fixes', does: 'Maintainers patch each bug after it is found.', gap: 'One-off. The same bug class returns in the next benchmark.', ours: 'One command that runs the same checks against any grader.' },
] as const;

const EXPERIMENTS = [
  { name: 'Synthetic grader faults', status: 'Done', detail: 'Six toy graders: a clean control and five with one deliberate fault each (accepts wrong answers, rejects valid ones, inconsistent scoring, leaked answers, a do-nothing agent passes). All five faults detected; the clean control shows no findings. Synthetic only.' },
  { name: 'Reproduce a real scorer bug', status: 'Next', detail: 'Run Scorensic against the inspect_evals scorer before and after PR #2334, and report what it catches and misses.' },
  { name: 'Benchmark adapters', status: 'Planned', detail: 'Connect to Inspect AI scorers and Harbor verifiers, so maintainers can run the checks without rewriting their graders.' },
] as const;

const LIMITS = [
  'No real benchmark has been validated yet. Every detection so far is on synthetic graders written to contain the fault.',
  'Passing every check does not prove a grader is correct. It only means these probes passed.',
  'The leaked-answer search is a plain text match. It cannot yet see git history, encoded or paraphrased leaks.',
  'It runs grader code in a separate process with a timeout. That is not a security sandbox.',
] as const;

export default function ScorensicPage() {
  return (
    <main className="ar-page">
      <SiteHeader />
      <div className="ar-wrap">
        <Breadcrumbs items={[{ label: 'Tools and demos', href: '/tools' }, { label: 'Research', href: '/research' }, { label: 'Scorensic' }]} />
        <article className="ar-paper">
          <header className="ar-hero" id="main-content" tabIndex={-1}>
            <div className="ar-paper-meta">
              <span>Maz Works / Open-source research</span>
              <time dateTime={UPDATED.iso}>Updated {UPDATED.label}</time>
            </div>
            <h1>Scorensic. <em>Who checks the grader?</em></h1>
            <p className="ar-byline">Making AI agent evaluations more reproducible, transparent and trustworthy.</p>
            <div className="ar-abstract">
              <p className="ar-kicker">Abstract</p>
              <p>An independent open-source engineering project investigating how AI benchmarks can produce misleading results through flawed grading, inconsistent execution, leaked answers and other evaluation errors. It builds lightweight tools that detect and reproduce these failures on an ordinary laptop, with no expensive computing.</p>
            </div>
            <div className="ar-actions">
              <a className="button button-signal" href={REPO} target="_blank" rel="noopener noreferrer">View the repository</a>
              <span className="sc-stage">Status: {STAGES[CURRENT_STAGE]} (research and development)</span>
            </div>
          </header>

          <section className="ar-thesis" aria-labelledby="sc-problem">
            <span className="ar-number">The problem</span>
            <h2 id="sc-problem">A benchmark score is only as good as the code that marks the answers.</h2>
            <p>Leaderboards compare models, but the grader itself is rarely tested. When it accepts empty answers, rejects correct ones or lets the agent read the answer key, the score measures the grader’s bug, not the model.</p>
          </section>

          <section className="ar-thesis" aria-labelledby="sc-investigating">
            <span className="ar-number">What we’re investigating</span>
            <h2 id="sc-investigating">Feed the grader answers whose verdict is already known.</h2>
            <p>Scorensic gives a grader the correct answer, harmless reformattings, empty output, refusals, known-wrong and slightly altered answers. It repeats each one in separate runs, and searches what the agent can see for the answer key. Every disagreement is reported as a specific input you can rerun, not a single score.</p>
          </section>

          <section className="ar-experiments" aria-labelledby="sc-gaps">
            <div className="ar-section-heading">
              <p className="ar-kicker">Where it fits</p>
              <h2 id="sc-gaps">Built for the gaps other tools leave.</h2>
              <p>Good tools already exist. Scorensic credits them and aims at what they don’t cover.</p>
            </div>
            <div className="sc-table" role="table" aria-label="Existing tools and the gaps Scorensic targets">
              <div className="sc-row sc-head" role="row"><span role="columnheader">Existing work</span><span role="columnheader">Does well</span><span role="columnheader">Leaves open</span><span role="columnheader">Scorensic’s aim</span></div>
              {GAPS.map((g) => (
                <div className="sc-row" role="row" key={g.tool}><strong role="cell">{g.tool}</strong><span role="cell">{g.does}</span><span role="cell">{g.gap}</span><span role="cell">{g.ours}</span></div>
              ))}
            </div>
          </section>

          <section className="ar-experiments" aria-labelledby="sc-experiments">
            <div className="ar-section-heading">
              <p className="ar-kicker">Current experiments</p>
              <h2 id="sc-experiments">What has been tested, and what hasn’t.</h2>
            </div>
            <div className="ar-studies">
              {EXPERIMENTS.map((x) => (
                <article className="ar-study" key={x.name}>
                  <div className="ar-study-top"><h3 className="sc-h3">{x.name}</h3><span className="ar-status">{x.status}</span></div>
                  <p>{x.detail}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="ar-experiments" aria-labelledby="sc-evidence">
            <div className="ar-section-heading">
              <p className="ar-kicker">Research evidence</p>
              <h2 id="sc-evidence">Real grader failures, from primary sources.</h2>
              <p>Found by others and linked to the original report. These are the motivation, not Scorensic results.</p>
            </div>
            <ul className="sc-evidence">
              {EVIDENCE.map((e) => (
                <li key={e.href}>{e.claim} <a href={e.href} target="_blank" rel="noopener noreferrer">{e.source} <span aria-hidden="true">↗</span></a></li>
              ))}
            </ul>
          </section>

          <section className="ar-proposal" aria-labelledby="sc-progress">
            <div>
              <p className="ar-kicker">Development progress</p>
              <h2 id="sc-progress">Stage {CURRENT_STAGE + 1} of {STAGES.length}.</h2>
              <p>A stage only moves forward when the evidence for it is published in the repository.</p>
              <p className="ar-caveat">Open source under Apache-2.0. Runs offline on a 16 GB laptop. No API key needed.</p>
            </div>
            <ol className="ar-receipt sc-stages" aria-label="Project stages">
              {STAGES.map((s, i) => (
                <li key={s} aria-current={i === CURRENT_STAGE ? 'step' : undefined}>
                  <span>{i < CURRENT_STAGE ? 'Done' : i === CURRENT_STAGE ? 'Current' : 'Not yet'}</span><strong>{s}</strong>
                </li>
              ))}
            </ol>
          </section>

          <section className="ar-thesis" aria-labelledby="sc-limits">
            <span className="ar-number">Known limitations</span>
            <h2 id="sc-limits">What this does not show yet.</h2>
            <ul className="sc-limits">{LIMITS.map((l) => <li key={l}>{l}</li>)}</ul>
          </section>

          <footer className="ar-paper-footer">
            <div>
              <p className="ar-kicker">Open-source repository</p>
              <h2>Inspect it, run it, challenge it.</h2>
              <p>Code, tests, research notes and every source are public. Maz Works maintains the project; you don’t need Maz Works to use it.</p>
            </div>
            <div className="ar-footer-actions">
              <a className="ar-text-link" href={REPO} target="_blank" rel="noopener noreferrer">github.com/manazoid4/scorensic ↗</a>
              <a className="ar-text-link" href="/research">All research ↗</a>
            </div>
          </footer>
        </article>
      </div>
      <SiteFooter conversion={<></>} />
    </main>
  );
}
