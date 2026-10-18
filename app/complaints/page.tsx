import type { Metadata } from 'next';
import { fitDescription, OG_IMAGE } from '../seo';
import { MAIN_CTA, SITE_URL } from '../site';
import { COMPLAINTS_SETUP } from '../offers';
import { SiteFooter, SiteHeader } from '../site-chrome';
import { CampaignLink } from '../campaign-link';
import { BookCall } from '../booking-modal';
import { FounderTrust } from '../b2b-parts';
import { ComplaintsDemo } from './demo';
import '../b2b.css';

const PAGE_URL = `${SITE_URL}/complaints`;

export const metadata: Metadata = {
  title: 'Complaints tracking and escalation set-up',
  description: fitDescription(`Log every complaint the same way, keep your own deadlines and alert the right person. ${COMPLAINTS_SETUP.price}, fixed scope, built by someone with five years in complaints.`),
  alternates: { canonical: PAGE_URL },
  openGraph: { title: 'Complaints & Escalation Tracker — Maz Works', description: fitDescription('One place for every complaint, with replies and deadlines that stop slipping.'), url: PAGE_URL, type: 'website', images: [OG_IMAGE] },
};

const HOW = [
  { title: 'A complaint comes in', body: 'By form, link or forwarded email. It is logged the same way every time, with a case number.' },
  { title: 'The client hears from you', body: 'An acknowledgement goes out in your wording, with the date you will reply by.' },
  { title: 'Nothing slips quietly', body: 'You set the dates. You or a colleague get an alert when a case is due soon or overdue.' },
  { title: 'A person decides the reply', body: 'A draft from your own template wording is ready to check, edit and send. Nothing goes out unapproved.' },
  { title: 'You see the pattern', body: 'A monthly summary shows how many, about what, and how long they took.' },
];

export default function ComplaintsPage() {
  return (
    <main>
      <SiteHeader />

      <section className="mw-resource-hero" id="main-content" tabIndex={-1} aria-labelledby="cp-title">
        <p className="eyebrow">Complaints management</p>
        <h1 id="cp-title">Handle every complaint the same way, and never miss a date.</h1>
        <p>Most small firms handle complaints from an inbox and someone’s memory. I set up a simple, reliable process on the tools you already use. I spent five years on the receiving end of complaints in finance, so I know where they go wrong.</p>
        <div className="b2b-cta">
          <CampaignLink className="button button-signal" href="/free-plan?src=complaints#leak-check-form">{MAIN_CTA}</CampaignLink>
          <BookCall interest="Complaints & Escalation Tracker" />
        </div>
        <p className="mw-hero-note">{COMPLAINTS_SETUP.price} · fixed scope · you see it working before you pay</p>
      </section>

      <section className="b2b-wrap" aria-labelledby="cp-how">
        <h2 id="cp-how">How it works</h2>
        <ol className="b2b-grid" style={{ listStyle: 'none' }}>
          {HOW.map((step, index) => <li key={step.title}><span className="b2b-tag">Step {index + 1}</span><strong>{step.title}</strong><span>{step.body}</span></li>)}
        </ol>
      </section>

      <section className="b2b-wrap" aria-labelledby="cp-demo">
        <h2 id="cp-demo">See it before you buy it</h2>
        <p className="b2b-lede">A small working demo with invented data. Log a complaint, watch the dates, check a draft reply.</p>
        <ComplaintsDemo />
      </section>

      <section className="b2b-wrap" aria-labelledby="cp-price">
        <h2 id="cp-price">What it costs</h2>
        <div className="b2b-two">
          <div className="b2b-box">
            <p className="b2b-price">{COMPLAINTS_SETUP.price}</p>
            <p>{COMPLAINTS_SETUP.body}</p>
            <h3>Included</h3>
            <ul className="b2b-list">{COMPLAINTS_SETUP.includes.map((item) => <li key={item}>{item}</li>)}</ul>
            <p className="b2b-fine">{COMPLAINTS_SETUP.quoted}</p>
          </div>
          <div className="b2b-box">
            <h3>What it is not</h3>
            <ul className="b2b-list">{COMPLAINTS_SETUP.notIncluded.map((item) => <li key={item}>{item}</li>)}</ul>
            <p className="b2b-fine">Running costs that aren’t mine: the apps you choose are paid by you directly, and I tell you the figure before you commit. Typically a spreadsheet or low-cost database plus an automation tool.</p>
          </div>
        </div>
      </section>

      <section className="b2b-wrap" aria-labelledby="cp-trust">
        <h2 id="cp-trust">Why a business can trust this</h2>
        <FounderTrust />
        <p className="b2b-fine">No client results are quoted here because there are none to publish yet. The <a href="/proof">proof page</a> shows what exists today.</p>
      </section>

      <section className="mw-resource-hero" aria-labelledby="cp-cta-title">
        <h2 id="cp-cta-title">Want to see it on your own process?</h2>
        <p>Tell me how complaints reach you today and I’ll send a working preview and a fixed price.</p>
        <div className="b2b-cta">
          <CampaignLink className="button button-signal" href="/free-plan?src=complaints#leak-check-form">{MAIN_CTA}</CampaignLink>
          <CampaignLink className="button" href="/audit?src=complaints">Try the free audit</CampaignLink>
          <BookCall interest="Complaints & Escalation Tracker" />
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
