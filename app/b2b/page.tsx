import type { Metadata } from 'next';
import { fitDescription, OG_IMAGE } from '../seo';
import { CHECK_REPLY_TIME, SITE_URL } from '../site';
import { B2B_SYSTEMS, COMPLAINT_PACKAGES, PROMISES, STARTER_GUARANTEE } from '../offers';
import { SiteFooter, SiteHeader } from '../site-chrome';
import { CampaignLink } from '../campaign-link';
import { BookCall } from '../booking-modal';
import { CaseStudyGrid } from '../proof-parts';
import { FounderMoat } from '../b2b-parts';
import { SmsDemo } from '../sms-demo';
import { ProblemPicker } from './problem-picker';
import { Deliverables } from './deliverables';
import { StickyJourney } from './sticky-journey';
import '../b2b.css';
import '../light-system.css';
import './b2b-refresh.css';

/**
 * Landing page for LinkedIn visitors who run agencies, consultancies,
 * recruiters, financial services firms and professional practices. The journey
 * is: recognise the problem → see a real deliverable → check the proof → take
 * the free assessment or book 15 minutes. Prices come from offers.ts; nothing
 * here is a client result that has not happened.
 */
const PAGE_URL = `${SITE_URL}/b2b`;
const TITLE = 'Clearer operations for professional teams';

export const metadata: Metadata = {
  title: TITLE,
  description: fitDescription('Complaints, client intake, reporting and follow-up systems for agencies, consultancies and professional practices. Free 2-minute assessment or a 15-minute call. Fixed price and you see it working before you pay.'),
  alternates: { canonical: PAGE_URL },
  openGraph: { title: 'Maz Works for agencies and professional practices', description: fitDescription('Fixed-price systems that take admin off your team. Free assessment or a 15-minute call.'), url: PAGE_URL, type: 'website', images: [OG_IMAGE] },
};

const [health] = COMPLAINT_PACKAGES;

const STEPS = [
  { title: 'See the problem in numbers', body: 'Take the free 2-minute assessment. You get a score, the hours your answers point to and the first two fixes, before you share any contact details.' },
  { title: 'Get a fixed-scope plan', body: 'Send the result or book 15 minutes. I reply with a written scope, a fixed price and what I would leave alone.' },
  { title: 'See it working before you pay', body: 'I build it on your tools, show you the test, and you pay once it works. No working, no invoice.' },
];

export default function B2BPage() {
  return (
    <main className="b2b-page b2b-refresh mw-light">
      <SiteHeader />

      <section className="b2b-hero" id="main-content" tabIndex={-1} aria-labelledby="b2b-title">
        <div className="b2b-hero-grid">
          <div className="b2b-hero-copy">
            <p className="b2b-audience">For operations, finance and professional teams</p>
            <h1 id="b2b-title">Know what’s due. Who owns it. What needs attention.</h1>
            <p className="b2b-hero-lede">When the work lives across inboxes, spreadsheets and people’s heads, even simple questions take time. I build practical systems for clearer workloads, reliable follow-up and reporting you can use.</p>
            <p className="b2b-hero-founder"><strong>You work directly with Manazir Hussain.</strong> A Computer Science graduate with five years in financial complaints and business accounts. I understand the handoffs as well as the software.</p>
            <div className="b2b-hero-actions">
              <CampaignLink className="button button-signal" href="/b2b/assessment?src=b2b-assessment">Get a Free Business Assessment</CampaignLink>
              <BookCall className="button button-dark" interest="Business systems">Book a 15-Minute Call</BookCall>
            </div>
            <p className="mw-hero-note">Assessment: about 2 minutes, instant result, no contact details needed. Call: 15 minutes, no pitch deck, no obligation.</p>
          </div>
          <figure className="b2br-workload" aria-labelledby="workload-title">
            <figcaption><span className="b2br-example">Illustrative workflow · fictional data</span><h2 id="workload-title">The work, in one place.</h2><p>A shared view of the next action, not another spreadsheet to reconcile.</p></figcaption>
            <div className="b2br-table-scroll" role="region" aria-label="Sample team workload, scroll horizontally for all columns" tabIndex={0}>
              <table>
                <caption className="s-visually-hidden">Fictional workload: task, owner, deadline and status</caption>
                <thead><tr><th scope="col">Task</th><th scope="col">Owner</th><th scope="col">Deadline</th><th scope="col">Status</th></tr></thead>
                <tbody>
                  <tr><th scope="row">Approve supplier invoice<small>Finance · approval needed</small></th><td>Aisha</td><td>Today, 14:00</td><td><span className="b2br-status is-attention">Needs review</span></td></tr>
                  <tr><th scope="row">Follow up client documents<small>Operations · onboarding</small></th><td>Sam</td><td>Today, 16:00</td><td><span className="b2br-status is-waiting">Waiting on client</span></td></tr>
                  <tr><th scope="row">Respond to service query<small>Client service · SLA deadline</small></th><td>Jo</td><td>Tomorrow, 10:00</td><td><span className="b2br-status is-progress">In progress</span></td></tr>
                  <tr><th scope="row">Check weekly KPI report<small>Reporting · source checks</small></th><td>Aisha</td><td>Friday, 12:00</td><td><span className="b2br-status">Scheduled</span></td></tr>
                </tbody>
              </table>
            </div>
            <p className="b2br-workload-note">A sample of the clarity to aim for. Your tools, permissions, data and reporting needs determine the actual build.</p>
          </figure>
        </div>
      </section>

      <section className="b2b-wrap b2br-problems" aria-labelledby="b2br-problems-title">
        <div><h2 id="b2br-problems-title">Less chasing. A clearer working day.</h2><p className="b2b-lede">For agencies, consultancies, finance teams and professional practices. Start with the point where work gets stuck, not a new platform.</p></div>
        <dl className="b2br-needs">
          <div><dt>Operations &amp; workload</dt><dd>Make ownership, capacity, deadlines and SLA risks visible before a handoff gets missed.</dd></div>
          <div><dt>Finance &amp; admin</dt><dd>Give invoices, approvals and document requests a clear next step, with a person accountable for it.</dd></div>
          <div><dt>KPI &amp; management reporting</dt><dd>Bring fragmented data into a useful view, with agreed definitions and checks against the source.</dd></div>
          <div><dt>Client follow-up &amp; service</dt><dd>Keep enquiries, outstanding actions and complaints moving without relying on someone remembering.</dd></div>
        </dl>
      </section>

      <section className="b2b-steps" aria-labelledby="b2b-steps-title">
        <div className="b2b-wrap">
          <h2 id="b2b-steps-title" className="s-visually-hidden">How it works</h2>
          <ol>
            {STEPS.map((step, index) => (
              <li key={step.title}>
                <span aria-hidden="true">0{index + 1}</span>
                <strong>{step.title}</strong>
                <p>{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="b2b-wrap" id="systems" aria-labelledby="b2b-systems">
        <h2 id="b2b-systems">Start with one useful improvement.</h2>
        <p className="b2b-lede">These are starting points, not a limit on what we can discuss. First I check your existing tools, the data available and who needs to use the result. Then we agree a written scope and price.</p>
        <details className="b2br-picker-details"><summary>Find a starting point for your team</summary><ProblemPicker /></details>
        <ul className="b2b-grid is-three b2b-systems-grid">
          <li className="is-feature">
            <span className="b2b-tag">My specialism</span>
            <h3>{health.name}</h3>
            <span className="b2b-price">{health.price}</span>
            <span>{health.purpose}</span>
            <span className="b2b-easy">{health.easy}</span>
            <a href="/complaints">See the report, dashboard and staff guides →</a>
          </li>
          {B2B_SYSTEMS.map((item) => (
            <li key={item.id}>
              <span className="b2b-tag">{item.tag}</span>
              <h3>{item.name}</h3>
              <span className="b2b-price">{item.price}</span>
              <span>{item.body}</span>
            </li>
          ))}
        </ul>
        <p className="b2b-fine">Larger or connected systems (several teams, a CRM or helpdesk integration) are quoted from a free scope call. Texting and app subscriptions are paid by you directly, and I tell you the figure first.</p>
      </section>

      <section className="b2b-wrap" aria-labelledby="b2b-deliverables-title">
        <h2 id="b2b-deliverables-title">Examples you can inspect.</h2>
        <p className="b2b-lede">These complaints samples show how I structure a report, an operational view and a staff guide. They are examples of the approach, not a ready-made enterprise platform or a replacement for your finance, CRM or case-management system.</p>
        <Deliverables />
      </section>

      <section className="b2b-wrap" id="proof" aria-labelledby="b2b-proof">
        <p className="eyebrow">Real work you can open</p>
        <h2 id="b2b-proof">Proof, not promises.</h2>
        <p className="b2b-lede">Two real builds and one labelled demonstration. No invented logos, quotes or results: open each one and judge it yourself.</p>
        <CaseStudyGrid />
        <p className="b2b-fine"><a href="/proof">See all proof, the scope sheet and what clients say →</a></p>
      </section>

      <section className="b2b-wrap" id="instant-reply" aria-labelledby="b2b-sms">
        <p className="eyebrow">Try the system</p>
        <h2 id="b2b-sms">See the instant reply on your own phone.</h2>
        <p className="b2b-lede">This is the Speed-to-Lead build for missed calls and new enquiries. It sends one demo text only if you ask for it; otherwise you still see the message on screen.</p>
        <SmsDemo />
      </section>

      <FounderMoat />

      <section className="b2b-wrap" aria-labelledby="b2b-own">
        <p className="eyebrow">Own it, do not rent it</p>
        <h2 id="b2b-own">The accounts stay in your name.</h2>
        <p className="b2b-lede">Keep the tools that already work. Accounts stay in your name, and any ongoing software costs are made clear before the build. We agree access, data handling, handover and the limits of the system as part of the scope.</p>
      </section>

      <section className="b2b-wrap" aria-labelledby="b2b-trust">
        <p className="eyebrow">What you can count on</p>
        <h2 id="b2b-trust">The terms are part of the product.</h2>
        <ul className="b2b-grid">
          <li><strong>No working, no invoice</strong><span>{STARTER_GUARANTEE}</span></li>
          {PROMISES.slice(0, 3).map((term) => <li key={term.title}><strong>{term.title}</strong><span>{term.body}</span></li>)}
        </ul>
      </section>

      <section className="b2b-assessment-teaser" id="assessment" aria-labelledby="b2b-assessment-title">
        <div className="b2b-wrap b2b-assessment-grid">
          <div>
            <p className="eyebrow">Free business assessment</p>
            <h2 id="b2b-assessment-title">Not sure which one is worth fixing first?</h2>
            <p className="b2b-lede">Six questions about how work really moves through your business. You get a score, the hours your own answers point to, the first two jobs worth fixing and three free fixes. The result shows before any contact details.</p>
            <ul className="b2b-list">
              <li>About 2 minutes, one question at a time.</li>
              <li>Your own numbers, with the hourly value and planning assumption visible.</li>
              <li>No sign-up, no call and no obligation to see the result.</li>
            </ul>
            <div className="b2b-cta">
              <CampaignLink className="button button-signal" href="/b2b/assessment?src=b2b-assessment">Get a Free Business Assessment</CampaignLink>
              <BookCall className="button button-dark" interest="Business assessment">Book a 15-Minute Call</BookCall>
            </div>
          </div>
          <div className="b2b-sample-result" aria-label="Example assessment result, not a client result">
            <p className="b2b-tag">Example result</p>
            <p className="b2b-sample-band">Mostly manual</p>
            <p className="b2b-sample-score"><strong>58</strong><span>/100</span></p>
            <ul>
              <li><span>18h</span> a week on the jobs you picked</li>
              <li><span>828h</span> a year, at 46 working weeks</li>
              <li><span>£13,248</span> time value if 40% is removed, at £40/h</li>
            </ul>
            <p className="b2b-sample-fix"><strong>Example next step:</strong> make the owner and next action visible for each outstanding task.</p>
            <p className="b2b-fine">An example of the format, not a real assessment or a promise of savings.</p>
          </div>
        </div>
      </section>

      <section className="b2b-final" id="b2b-final" aria-labelledby="b2b-final-title">
        <div className="b2b-wrap b2b-final-grid">
          <div>
            <p className="eyebrow">Next step</p>
            <h2 id="b2b-final-title">Two ways to start. Both free.</h2>
            <p>Take the assessment if you want to see the numbers first. Book the call if you would rather talk it through. Either way, I reply within {CHECK_REPLY_TIME}.</p>
          </div>
          <div className="b2b-cta">
            <CampaignLink className="button button-signal" href="/b2b/assessment?src=b2b-assessment">Get a Free Business Assessment</CampaignLink>
            <BookCall className="button" interest="Business systems">Book a 15-Minute Call</BookCall>
          </div>
        </div>
        <div className="b2b-wrap b2b-elsewhere">
          <p>Not here for operations systems? <a href="/solutions">See all Maz Works services →</a></p>
        </div>
      </section>

      <SiteFooter />
      <StickyJourney />
    </main>
  );
}
