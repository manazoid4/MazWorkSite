import type { Metadata } from 'next';
import { fitDescription, OG_IMAGE } from '../seo';
import { CHECK_REPLY_TIME, MAIN_CTA, SITE_URL } from '../site';
import { B2B_SYSTEMS, COMPLAINT_PACKAGES, PROMISES, STARTER_GUARANTEE } from '../offers';
import { SiteFooter, SiteHeader } from '../site-chrome';
import { CampaignLink } from '../campaign-link';
import { BookCall } from '../booking-modal';
import { FounderMoat } from '../b2b-parts';
import { AutomationAudit } from '../audit/audit';
import { WorkflowSimulator } from '../workflow-sim';
import { SmsDemo } from '../sms-demo';
import '../b2b.css';

/**
 * Landing page for LinkedIn visitors who run agencies, consultancies, recruiters,
 * financial services firms and professional practices. Prices come from offers.ts.
 * Nothing here is a client result: there are none to quote yet.
 */
const PAGE_URL = `${SITE_URL}/b2b`;
const TITLE = 'Operations systems for professional practices';

export const metadata: Metadata = {
  title: TITLE,
  description: fitDescription('Complaints tracking, client onboarding and follow-up systems for agencies, consultancies and professional practices. Fixed price, and you see it working before you pay.'),
  alternates: { canonical: PAGE_URL },
  openGraph: { title: 'Maz Works for agencies and professional practices', description: fitDescription('Fixed-price systems that take admin off your team. See it working before you pay.'), url: PAGE_URL, type: 'website', images: [OG_IMAGE] },
};

const PROBLEMS = [
  { title: 'Complaints live in inboxes', body: 'Nobody owns them, dates get missed, and the same cause comes round again.' },
  { title: 'Onboarding is a chase', body: 'ID, signed letters and forms arrive late, in pieces, by email.' },
  { title: 'Proposals go quiet', body: 'The follow-up depends on someone remembering on a busy week.' },
  { title: 'Data is copied by hand', body: 'The same details typed into the CRM, the spreadsheet and the invoice.' },
];

export default function B2BPage() {
  return (
    <main>
      <SiteHeader />

      <section className="mw-resource-hero" id="main-content" tabIndex={-1} aria-labelledby="b2b-title">
        <p className="eyebrow">For agencies, consultancies and professional practices</p>
        <h1 id="b2b-title">Automate your practice operations without hiring more admin staff.</h1>
        <p>Complaints, client onboarding and follow-ups, set up once on the tools you already use. Fixed price, a written scope first, and you see it working before you pay.</p>
        <div className="b2b-cta">
          <CampaignLink className="button button-signal" href="/free-plan?src=b2b#leak-check-form">{MAIN_CTA}</CampaignLink>
          <CampaignLink className="button" href="#audit">Try the free audit</CampaignLink>
          <BookCall interest="Operations systems" />
        </div>
        <p className="mw-hero-note">Reply within {CHECK_REPLY_TIME} · no obligation · you keep your accounts and code</p>
      </section>

      <section className="b2b-wrap" aria-labelledby="b2b-problems">
        <h2 id="b2b-problems">Where the time goes</h2>
        <p className="b2b-lede">Small firms rarely lack tools. They lack the glue that stops work depending on someone remembering.</p>
        <ul className="b2b-grid">
          {PROBLEMS.map((item) => <li key={item.title}><strong>{item.title}</strong><span>{item.body}</span></li>)}
        </ul>
      </section>

      <section className="b2b-wrap" aria-labelledby="b2b-systems">
        <h2 id="b2b-systems">What I set up</h2>
        <p className="b2b-lede">Fixed prices, each built on tools you already use. You see it working before you pay.</p>
        <ul className="b2b-grid is-three">
          <li className="is-feature">
            <span className="b2b-tag">My specialism</span>
            <strong>Complaints Health Check, reporting and staff workflows</strong>
            <span className="b2b-price">{COMPLAINT_PACKAGES[0].price}</span>
            <span>Find what your complaints are telling you and report it clearly to management and the board. Four fixed-scope packages, with worked examples.</span>
            <a href="/complaints">See the examples →</a>
          </li>
          {B2B_SYSTEMS.slice(0, 3).map((item) => (
            <li key={item.id}>
              <span className="b2b-tag">{item.tag}</span>
              <strong>{item.name}</strong>
              <span className="b2b-price">{item.price}</span>
              <span>{item.body}</span>
            </li>
          ))}
          {B2B_SYSTEMS.slice(3).map((item) => (
            <li key={item.id}>
              <span className="b2b-tag">{item.tag}</span>
              <strong>{item.name}</strong>
              <span className="b2b-price">{item.price}</span>
              <span>{item.body}</span>
            </li>
          ))}
        </ul>
        <p className="b2b-fine">Larger or connected systems (several teams, a CRM or helpdesk integration) are quoted from a free scope call. Texting and app subscriptions are paid by you directly, and I tell you the figure first.</p>
      </section>

      <section className="b2b-wrap" aria-labelledby="b2b-own">
        <h2 id="b2b-own">Own it once, instead of renting it</h2>
        <p className="b2b-lede">Many agencies rent you a platform. For example, GoHighLevel partners list a set-up fee from $850 plus $38.80 a month (gohighlevel.partners, checked 2 Oct 2026), and the accounts stay theirs. Here you pay once, the accounts are in your name and it keeps running if you stop working with me.</p>
      </section>

      <section className="b2b-wrap" aria-labelledby="b2b-sim">
        <h2 id="b2b-sim">See how it works</h2>
        <WorkflowSimulator />
        <SmsDemo />
      </section>

      <FounderMoat />

      <section className="b2b-wrap" aria-labelledby="b2b-trust">
        <h2 id="b2b-trust">What you can count on</h2>
        <ul className="b2b-grid">
          <li><strong>No working, no invoice</strong><span>{STARTER_GUARANTEE}</span></li>
          {PROMISES.slice(0, 3).map((term) => <li key={term.title}><strong>{term.title}</strong><span>{term.body}</span></li>)}
        </ul>
        <p className="b2b-fine">Real work you can open: <a href="/proof">see the proof page</a>.</p>
      </section>

      <section className="b2b-wrap" id="audit" aria-labelledby="b2b-cta-title">
        <h2 id="b2b-cta-title">Not sure where to start?</h2>
        <p className="b2b-lede">Answer a few questions about repeat tasks and get an estimate of the time they take, before you share any contact details.</p>
        <AutomationAudit page="b2b" />
        <div className="b2b-cta"><BookCall interest="Operations systems" /></div>
      </section>

      <SiteFooter />
    </main>
  );
}
