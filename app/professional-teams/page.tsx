import type { Metadata } from 'next';
import { fitDescription, OG_IMAGE } from '../seo';
import { MAIN_CTA, SITE_URL } from '../site';
import { SiteFooter, SiteHeader } from '../site-chrome';
import { COMPLAINT_DATA_HANDLING, COMPLAINT_PACKAGES, B2B_SYSTEMS } from '../offers';
import { ManazirLine } from '../manazir-line';
import { FICTION_NOTE } from '../complaints/reports';
import { ActionTrackerSample, DashboardSample } from '../complaints/samples';
import { DecisionTreeSample, FlowchartSample } from '../complaints/samples-workflow';
import '../b2b.css';
import '../complaints/samples.css';
import './professional-teams.css';

const PAGE_URL = `${SITE_URL}/professional-teams`;
const ENQUIRY = '/contact?src=professional-teams&service=reporting#contact';
const [health, board, flows, sprint] = COMPLAINT_PACKAGES;

export const metadata: Metadata = {
  title: 'Reporting and operational tools for teams',
  description: fitDescription('KPI dashboards, workload and deadline oversight, clearer reporting and practical process improvements for professional teams.'),
  alternates: { canonical: PAGE_URL },
  openGraph: { title: 'Reporting and operational tools for teams — Maz Works', description: fitDescription('Better oversight, clearer decisions and smoother operations for professional teams.'), url: PAGE_URL, type: 'website', images: [OG_IMAGE] },
};

const capabilities = [
  { number: '01', title: "See what's happening", text: 'Dashboards, KPIs, trends and management reports that show what needs attention.' },
  { number: '02', title: 'Stay on top of the work', text: 'Clear ownership, deadlines, handoffs and escalation visibility across a team.' },
  { number: '03', title: 'Find and fix the problem', text: 'Review repeated issues and improve the reporting, process or tools behind them.' },
];

export default function ProfessionalTeamsPage() {
  return (
    <main className="b2b-page pt-page">
      <SiteHeader />
      <section className="mw-resource-hero pt-hero" id="main-content" tabIndex={-1} aria-labelledby="teams-title">
        <p className="eyebrow">For managers and professional teams</p>
        <h1 id="teams-title">Better oversight. Clearer decisions. Smoother operations.</h1>
        <p>I help professional teams make better use of their information, stay on top of deadlines and improve how work gets done. From KPI dashboards and SLA tracking to reporting, complaints analysis and practical internal tools.</p>
        <p className="b2b-cta"><a className="button button-signal" href={ENQUIRY}>{MAIN_CTA}</a></p>
        <p className="pt-proofline">Founder-led work · scoped around the way your team already works</p>
      </section>

      <section className="pt-capabilities" aria-label="Three ways I help professional teams">
        {capabilities.map((item) => (
          <article className="pt-capability" key={item.number}>
            <span className="pt-number">{item.number}</span>
            <h2>{item.title}</h2>
            <p>{item.text}</p>
          </article>
        ))}
      </section>

      <section className="pt-setup" id="what-i-set-up" aria-labelledby="pt-setup-title">
        <header className="pt-section-head">
          <p className="eyebrow">What I set up</p>
          <h2 id="pt-setup-title">Complaints work and office systems, scoped to your team.</h2>
          <p>Each job is a written scope and a fixed price before I start. Complaints analysis is my specialism: five years in complaints and finance, including regulated work and ombudsman cases.</p>
        </header>
        <ul className="pt-cards" id="complaints">
          {[health, board, flows, sprint].map((pack) => (
            <li key={pack.id}>
              <h3>{pack.name}</h3>
              <p className="pt-price">{pack.price}</p>
              <p>{pack.purpose}</p>
              <details>
                <summary>What you receive, and the limits</summary>
                <ul className="b2b-list">{pack.receives.map((item) => <li key={item}>{item}</li>)}</ul>
                <p><strong>I need:</strong> {pack.needs.join('; ')}.</p>
                <p><strong>Limits:</strong> {pack.limits.join('; ')}.</p>
                <p><strong>Typical timing:</strong> {pack.turnaround} after I have the agreed inputs.</p>
              </details>
            </li>
          ))}
        </ul>
        <h3 className="pt-sub" id="systems">Office systems</h3>
        <ul className="pt-cards">
          {B2B_SYSTEMS.map((item) => (
            <li key={item.id}>
              <p className="pt-tag">{item.tag}</p>
              <h3>{item.name}</h3>
              <p className="pt-price">{item.price}</p>
              <p>{item.body}</p>
            </li>
          ))}
        </ul>
        <p className="pt-fine">No VAT is added. Larger or connected systems (several teams, a CRM or helpdesk) are quoted after a free scope call. Texting and app subscriptions are paid by you directly, and I tell you the figure first.</p>
      </section>

      <section className="pt-samples" id="samples" aria-labelledby="pt-samples-title">
        <header className="pt-section-head">
          <p className="eyebrow">Sample reports</p>
          <h2 id="pt-samples-title">See what you would receive.</h2>
          <p>{FICTION_NOTE}</p>
        </header>
        <ul className="pt-cards pt-cards-two">
          <li><h3>Complaints Health Check</h3><p>Scores, findings and ranked actions from a review of 15 invented cases.</p><a className="button" href="/complaints/sample/health-check">View the sample Health Check</a></li>
          <li><h3>Board report</h3><p>A fictional dataset turned into oversight, root causes and actions.</p><a className="button" href="/complaints/sample/board-report">View the sample board report</a></li>
        </ul>
      </section>

      <section className="pt-demo-section" id="demonstrations" aria-labelledby="pt-demos-title">
        <header className="pt-section-head">
          <p className="eyebrow">Illustrative demonstrations</p>
          <h2 id="pt-demos-title">Useful at a glance. Clear about what to do next.</h2>
          <p>Fictional department and synthetic data. These examples show the shape of the work, not client results or a live system.</p>
        </header>

        <section className="pt-demo" aria-labelledby="pt-performance-title">
          <div className="pt-demo-heading">
            <div><p className="pt-demo-label">01 / Department performance</p><h3 id="pt-performance-title">Customer operations · four weeks to 20 October 2026</h3></div>
            <span className="pt-synthetic">Synthetic data · as at 20 Oct 2026</span>
          </div>
          <dl className="pt-metrics">
            <div><dt>Received</dt><dd>124</dd><dd className="pt-metric-note">over four weeks</dd></div>
            <div><dt>Completed</dt><dd>108</dd><dd className="pt-metric-note">over four weeks</dd></div>
            <div><dt>Open backlog</dt><dd>36</dd><dd className="pt-metric-note">20 opening + 124 in − 108 out</dd></div>
            <div><dt>Closed on time</dt><dd>94%</dd><dd className="pt-metric-note">102 of 108 completed</dd></div>
          </dl>
          <div className="pt-dashboard-lower">
            <div className="pt-trend">
              <h4>Four-week flow</h4>
              <p>Items received and completed each week</p>
              <div className="pt-legend"><span><i className="pt-key pt-key-in" />Received</span><span><i className="pt-key pt-key-out" />Completed</span></div>
              <div className="pt-weeks" role="list" aria-label="Weekly received and completed counts">
                {[['Week 1', 28, 26], ['Week 2', 31, 28], ['Week 3', 30, 25], ['Week 4', 35, 29]].map(([week, received, completed]) => (
                  <div className="pt-week" role="listitem" key={week}>
                    <span>{week}</span>
                    <div className="pt-bars" role="img" aria-label={`${received} received, ${completed} completed`}>
                      <i className="pt-bar-in" style={{ width: `${Number(received) / 35 * 100}%` }} />
                      <i className="pt-bar-out" style={{ width: `${Number(completed) / 35 * 100}%` }} />
                    </div>
                    <span className="pt-week-count">{received} / {completed}</span>
                  </div>
                ))}
              </div>
            </div>
            <aside className="pt-actions" aria-label="Example manager actions">
              <h4>Manager actions</h4>
              <ul>
                <li><strong>Assign 6 unowned items</strong><span>Give each open item a clear next owner.</span></li>
                <li><strong>Review 3 overdue cases</strong><span>Check the blocker and agree an update.</span></li>
                <li><strong>Plan 7 near deadlines</strong><span>Rebalance work due in the next two days.</span></li>
              </ul>
            </aside>
          </div>
          <p className="pt-demo-foot">An agreed target and reliable source data are needed to interpret performance measures.</p>
        </section>

        <section className="pt-demo pt-demo-queue" aria-labelledby="pt-queue-title">
          <div className="pt-demo-heading">
            <div><p className="pt-demo-label">02 / SLA and workload oversight</p><h3 id="pt-queue-title">Who owns the next step?</h3></div>
            <span className="pt-synthetic">Synthetic data</span>
          </div>
          <div className="pt-queue-summary" aria-label="Open work summary">
            <p><strong>36</strong><span>open items</span></p><p><strong>3</strong><span>overdue</span></p><p><strong>7</strong><span>due within 2 days</span></p><p><strong>6</strong><span>unassigned</span></p>
          </div>
          <div className="pt-queue-grid">
            <div className="pt-table-wrap" role="region" aria-label="Example priority queue table" tabIndex={0}>
              <table>
                <caption>Priority queue · 6 example exceptions</caption>
                <thead><tr><th scope="col">Work item</th><th scope="col">Owner</th><th scope="col">Due</th><th scope="col">Status</th><th scope="col">Next step</th></tr></thead>
                <tbody>
                  <tr><th scope="row">CX-204</th><td>Amina</td><td>19 Oct</td><td><span className="pt-status is-late">Overdue</span></td><td>Agree response today</td></tr>
                  <tr><th scope="row">CX-216</th><td>Priya</td><td>19 Oct</td><td><span className="pt-status is-late">Overdue</span></td><td>Escalate to team lead</td></tr>
                  <tr><th scope="row">CX-218</th><td>Lewis</td><td>19 Oct</td><td><span className="pt-status is-late">Overdue</span></td><td>Escalate blocker</td></tr>
                  <tr><th scope="row">CX-221</th><td>Unassigned</td><td>20 Oct</td><td><span className="pt-status is-unassigned">Needs owner</span></td><td>Assign case lead</td></tr>
                  <tr><th scope="row">CX-229</th><td>Priya</td><td>21 Oct</td><td><span className="pt-status is-due">Due soon</span></td><td>Request missing detail</td></tr>
                  <tr><th scope="row">CX-233</th><td>Tom</td><td>22 Oct</td><td><span className="pt-status is-due">Due soon</span></td><td>Check draft reply</td></tr>
                </tbody>
              </table>
            </div>
            <aside className="pt-workload">
              <h4>Open work by owner</h4>
              <ul><li><span>Priya</span><strong>9</strong></li><li><span>Lewis</span><strong>8</strong></li><li><span>Amina</span><strong>7</strong></li><li><span>Tom</span><strong>6</strong></li><li className="is-unowned"><span>Unassigned</span><strong>6</strong></li></ul>
              <p>36 open items in total</p>
            </aside>
          </div>
          <p className="pt-demo-foot">Visibility supports earlier action; it cannot guarantee that an SLA will never be missed.</p>
        </section>
      </section>

      <details className="pt-more" id="more-demos">
        <summary>More synthetic demonstrations: complaints dashboard and staff workflow</summary>
        <h3>Complaints dashboard</h3>
        <DashboardSample />
        <h3>Action tracker</h3>
        <ActionTrackerSample />
        <div className="b2b-two">
          <div><h3>Process flowchart</h3><FlowchartSample /></div>
          <div><h3>Escalation decision tree</h3><DecisionTreeSample /></div>
        </div>
      </details>

      <section className="pt-practice" aria-labelledby="pt-practice-title">
        <div><p className="eyebrow">Practical, proportionate improvements</p><h2 id="pt-practice-title">Start with the work. Use the simplest useful tool.</h2></div>
        <div>
          <p>I can improve an existing spreadsheet or report, make repeated handoffs easier to follow, or build a tailored internal tool when current software is not enough. I agree the scope and price with you before work starts.</p>
          <p>For sensitive workflows, we agree suitable access, permissions, review, escalation, data handling and retention terms before records are shared. I do not provide legal or regulatory advice.</p>
          <ul className="b2b-list">{COMPLAINT_DATA_HANDLING.map((item) => <li key={item}>{item}</li>)}</ul>
          <p className="pt-fine">This is a summary, not legal advice. Nothing here promises fewer complaints, savings or any other outcome.</p>
        </div>
      </section>

      <section className="mw-resource-hero pt-bottom-cta" aria-labelledby="teams-cta">
        <p className="eyebrow">Work directly with me</p>
        <h2 id="teams-cta">Bring me the report, deadline or process that is causing friction.</h2>
        <p>Describe the problem in a few lines. No records are needed to ask.</p>
        <ManazirLine />
        <p className="b2b-cta"><a className="button button-signal" href={ENQUIRY}>{MAIN_CTA}</a></p>
        <p className="pt-fine">Professional engagements are quoted to scope. We agree what data is suitable and its handling and retention terms before you share records.</p>
      </section>
      <SiteFooter />
    </main>
  );
}
