import type { Metadata } from 'next';
import { fitDescription, OG_IMAGE } from '../seo';
import { MAIN_CTA, SITE_URL } from '../site';
import { COMPLAINT_DATA_HANDLING, COMPLAINT_EXTRAS_QUOTED, COMPLAINT_PACKAGES, type ComplaintPackage } from '../offers';
import { SiteFooter, SiteHeader } from '../site-chrome';
import { CampaignLink } from '../campaign-link';
import { BookCall } from '../booking-modal';
import { HealthReport } from './reports';
import { ActionTrackerSample, DashboardSample, SheetSample, SlideViewer } from './samples';
import { ChecklistSample, DecisionTreeSample, FlowchartSample, InfographicsSample } from './samples-workflow';
import '../b2b.css';
import './samples.css';

const PAGE_URL = `${SITE_URL}/complaints`;

export const metadata: Metadata = {
  title: 'Complaints Health Check and board reporting',
  description: fitDescription('Complaints Health Checks from £295, board reporting from £895 and staff workflows from £495, built from years of real complaints experience.'),
  alternates: { canonical: PAGE_URL },
  openGraph: { title: 'Complaints Health Check and board reporting — Maz Works', description: fitDescription('Find what your complaints are telling you, and report it clearly to management and the board.'), url: PAGE_URL, type: 'website', images: [OG_IMAGE] },
};

function PackageCard({ pack }: { pack: ComplaintPackage }) {
  return (
    <li className={`b2b-pack${pack.flagship ? ' is-flagship' : ''}`}>
      <span className="b2b-tag">{pack.flagship ? 'Flagship' : 'Package'}</span>
      <h3>{pack.name}</h3>
      <p className="b2b-price">{pack.price}</p>
      <p><strong>Solves:</strong> {pack.purpose}</p>
      <p className="b2b-easy">{pack.easy}</p>
      <p className="sx-sub">You receive</p>
      <ul className="b2b-list">{pack.receives.map((item) => <li key={item}>{item}</li>)}</ul>
      <p className="b2b-fine"><strong>Formats:</strong> {pack.formats}. <strong>Turnaround:</strong> {pack.turnaround} after I receive your data.</p>
      <details className="sx-details">
        <summary>What I need from you, and the limits</summary>
        <p className="sx-sub">From you</p>
        <ul className="b2b-list">{pack.needs.map((item) => <li key={item}>{item}</li>)}</ul>
        <p className="sx-sub">Scope limits</p>
        <ul className="b2b-list">{pack.limits.map((item) => <li key={item}>{item}</li>)}</ul>
      </details>
      <a href={`#${pack.id}`}>See an example →</a>
    </li>
  );
}

export default function ComplaintsPage() {
  const [health, board, flows, sprint] = COMPLAINT_PACKAGES;
  return (
    <main>
      <SiteHeader />

      <section className="mw-resource-hero" id="main-content" tabIndex={-1} aria-labelledby="cp-title">
        <p className="eyebrow">Complaints analysis and reporting</p>
        <h1 id="cp-title">Complaints findings your managers can see, understand and act on.</h1>
        <p>In a previous role I kept the complaints tracking, analysed the outcomes and presented the reporting to the board. I now do that work for other firms: clear findings, honest root causes and a short list of what management should do next.</p>
        <div className="b2b-cta">
          <CampaignLink className="button button-signal" href="/free-plan?src=complaints#leak-check-form">{MAIN_CTA}</CampaignLink>
          <BookCall interest="Complaints analysis" />
        </div>
        <p className="mw-hero-note">Fixed prices from £295 · works alongside the case system you already use · all examples below use invented data</p>
      </section>

      <section className="b2b-wrap" aria-labelledby="cp-why">
        <h2 id="cp-why">Easy to see. Easy to understand. Easy to act on.</h2>
        <p className="b2b-lede">A report only helps if people can follow it and do something with it. Everything I produce is built to that standard, because findings nobody can act on are wasted.</p>
        <ul className="b2b-grid is-three">
          <li><strong>1. See it</strong><span>One idea per page. A chart shows one thing, with the answer written above it in a single sentence. No walls of figures.</span></li>
          <li><strong>2. Understand it</strong><span>Plain English, no jargon. Each finding says what happened, how we know and why it matters, so a new board member gets it first time.</span></li>
          <li><strong>3. Act on it</strong><span>Every finding comes with a first step, an owner and a date. Putting it into practice is not a second project.</span></li>
        </ul>
        <div className="b2b-box">
          <h3>The two-minute test</h3>
          <p>Hand any page to a manager who has never seen it. If they cannot say what is going wrong and what happens next within two minutes, I have not finished.</p>
        </div>
        <h3>Why this is not something you can download or generate</h3>
        <p className="b2b-lede">A template or a free tool can draw a chart. It cannot know which patterns matter, what a board will ask, or what a handler will really do on a busy Tuesday. That comes from having handled the cases, spotted the patterns and had to explain them to a board. Your categories, your outcomes and your procedure shape every deliverable, and I do not replace the case system you already use.</p>
      </section>

      <section className="b2b-wrap" aria-labelledby="cp-packs">
        <h2 id="cp-packs">Four packages, fixed scope</h2>
        <ul className="b2b-grid b2b-packs">
          <PackageCard pack={health} />
          <PackageCard pack={board} />
          <PackageCard pack={flows} />
          <PackageCard pack={sprint} />
        </ul>
        <p className="b2b-fine">“From” prices cover the scope shown. Quoted separately: {COMPLAINT_EXTRAS_QUOTED.join('; ').toLowerCase()}. No VAT is added.</p>
      </section>

      <section className="b2b-wrap" id="health-check" aria-labelledby="cp-health">
        <p className="eyebrow">Example: {health.name}</p>
        <h2 id="cp-health">A Health Check report, from 15 cases</h2>
        <p className="b2b-lede">A short report that scores how complaints are handled, and ranks what to fix. The sample below is the kind of PDF you receive.</p>
        <div className="sx-card sx-paper"><HealthReport /></div>
        <p><a className="button button-signal" href="/samples/complaints/sample-health-check-report.pdf" download>Download the sample report (PDF)</a></p>
        <div className="sx-before-after" aria-label="Before and after, illustrative">
          <div><h3>Before</h3><ul className="b2b-list"><li>Complaints arrive by email, phone and post and are logged in different places.</li><li>Closing a case means writing the reply; the cause is rarely written down.</li><li>Management hears about complaints when a customer escalates.</li></ul></div>
          <div><h3>After a Health Check</h3><ul className="b2b-list"><li>One agreed set of categories and a root-cause field on every case.</li><li>A checklist before every reply, and a holding reply when a case will run late.</li><li>A short ranked list management can act on.</li></ul></div>
        </div>
        <p className="b2b-fine">An illustration of the kind of change a review points towards. Not a client result, and not a promise of one.</p>
      </section>

      <section className="b2b-wrap" id="board-reporting" aria-labelledby="cp-board">
        <p className="eyebrow">Example: {board.name}</p>
        <h2 id="cp-board">From 120 records to a board paper</h2>
        <p className="b2b-lede">This is the part I have done for real, and the part that is hardest to copy. Try the dashboard, look at the tracker, flick through the board slides and tick off the actions.</p>
        <h3>The dashboard</h3>
        <DashboardSample />
        <h3>The complaints tracker</h3>
        <SheetSample />
        <h3>The board slides</h3>
        <SlideViewer />
        <h3>The action tracker</h3>
        <ActionTrackerSample />
      </section>

      <section className="b2b-wrap" id="workflows" aria-labelledby="cp-flows">
        <p className="eyebrow">Example: {flows.name}</p>
        <h2 id="cp-flows">Staff who know what to do next</h2>
        <p className="b2b-lede">Built from your actual procedure: a process chart, a decision tree for escalation, one-page guides for staff and a checklist.</p>
        <div className="b2b-two">
          <div><h3>Process flowchart</h3><FlowchartSample /></div>
          <div><h3>Escalation decision tree</h3><DecisionTreeSample /></div>
        </div>
        <h3>Three staff guides</h3>
        <InfographicsSample />
        <h3>Employee checklist</h3>
        <ChecklistSample />
      </section>

      <section className="b2b-wrap" id="sprint" aria-labelledby="cp-sprint">
        <p className="eyebrow">{sprint.name}</p>
        <h2 id="cp-sprint">All of it, in one fixed piece of work</h2>
        <div className="b2b-two">
          <div className="b2b-box">
            <p className="b2b-price">{sprint.price}</p>
            <p>{sprint.purpose}</p>
            <ul className="b2b-list">{sprint.receives.map((item) => <li key={item}>{item}</li>)}</ul>
          </div>
          <div className="b2b-box">
            <h3>Limits that keep it fixed</h3>
            <ul className="b2b-list">{sprint.limits.map((item) => <li key={item}>{item}</li>)}</ul>
            <p className="b2b-fine"><strong>Turnaround:</strong> {sprint.turnaround} after I receive your data.</p>
          </div>
        </div>
      </section>

      <section className="b2b-wrap" aria-labelledby="cp-data">
        <h2 id="cp-data">How your complaint records are handled</h2>
        <ul className="b2b-list">{COMPLAINT_DATA_HANDLING.map((item) => <li key={item}>{item}</li>)}</ul>
        <p className="b2b-fine">This is a summary, not legal advice. The written agreement in your scope sheet sets out the exact terms.</p>
      </section>

      <section className="b2b-wrap" aria-labelledby="cp-limits">
        <h2 id="cp-limits">What this is not</h2>
        <ul className="b2b-list">
          <li>Not legal or regulatory advice, and no promise that your process meets any regulator’s rules. Your own compliance lead or adviser decides that.</li>
          <li>Not a case-management system. I work with the one you have, or a simple log if you have none.</li>
          <li>No promised reduction in complaints, savings or outcomes. I show you what the records say and what to do about it.</li>
        </ul>
      </section>

      <section className="mw-resource-hero" aria-labelledby="cp-cta-title">
        <h2 id="cp-cta-title">Start with a conversation</h2>
        <p>Tell me how complaints reach you today and what your board or managers ask for. I will recommend the smallest package that helps, with a fixed price.</p>
        <div className="b2b-cta">
          <CampaignLink className="button button-signal" href="/free-plan?src=complaints#leak-check-form">{MAIN_CTA}</CampaignLink>
          <BookCall interest="Complaints analysis" />
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
