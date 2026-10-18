import type { Metadata } from 'next';
import { fitDescription, OG_IMAGE } from '../seo';
import { CONTACT_EMAIL, SITE_URL } from '../site';
import { SiteFooter, SiteHeader } from '../site-chrome';

/**
 * Privacy notice (2 Oct 2026). Describes only flows that exist in this repo:
 * api/enquiry.js (Resend, FormSubmit fallback), api/subscribe.js (Resend
 * contacts), @vercel/analytics (no cookies), api/demo-gate.js (one session
 * cookie on private client demos), Cal.com bookings, and Maz's inbox/CRM.
 * Update it whenever a form, processor or tracker changes.
 */
const PAGE_URL = `${SITE_URL}/privacy`;
const UPDATED = '9 October 2026';

export const metadata: Metadata = {
  title: 'Privacy',
  description: fitDescription('What Maz Works collects when you use this site or work with me, why, who helps process it, how long it is kept and your rights. Plain English.'),
  alternates: { canonical: PAGE_URL },
  openGraph: { title: 'Maz Works privacy notice', url: PAGE_URL, images: [OG_IMAGE] },
};

const SECTIONS: { title: string; body: string[] }[] = [
  {
    title: 'Who is responsible',
    body: [`Maz Works, run by Manazir Hussain, decides how your details are used. Contact: ${CONTACT_EMAIL}.`],
  },
  {
    title: 'What I collect',
    body: [
      'Enquiry and free preview forms: your name, email, and anything you choose to add (phone, business, website, the job you describe, the package you picked).',
      'Mailing list: your email address, only if you sign up.',
      'Calls: if you book a call, the booking tool (Cal.com) collects your name, email and chosen time.',
      'Visits: simple, anonymous visit counts (Vercel Web Analytics). No advertising trackers and no tracking cookies.',
      'Private client demos: one essential cookie keeps you signed in to your demo, and nothing else.',
      'Clients: the details needed to plan, build, invoice and support your job.',
      'Outreach research: public business details, such as your website, Google listing and Companies House record, so I can suggest something specific.',
    ],
  },
  {
    title: 'After-hours call answering',
    body: [
      'If you ring a business that uses my After-Hours Receptionist, the call is answered for that business. The business decides what is asked and is responsible for your details; I run the service for them.',
      'What is kept: your name and number, what you asked for, and a written summary sent to the business by email. Calls are recorded only if the business turns recording on, and then you are told at the start of the call.',
      'Call audio is handled by a telephone provider and a speech-processing provider chosen for the service. Transcripts are kept for 30 days by default, then deleted, unless the business asks for a different period.',
    ],
  },
  {
    title: 'Why, and the legal basis',
    body: [
      'Replying to your enquiry and preparing a plan or quote: steps you asked for before a contract.',
      'Doing the work and invoicing: our contract, and the law (tax records).',
      'Mailing list: your consent. Every email has an unsubscribe link, or just reply "stop".',
      'Business outreach and visit counts: legitimate interests. Cold emails go only to limited companies, and any "no" is final and recorded so you are not contacted again.',
    ],
  },
  {
    title: 'Who helps me',
    body: [
      'Resend (sending email and the mailing list), FormSubmit (backup for the enquiry form), Google Gmail and ImprovMX (my inbox), HubSpot (customer records), Cal.com (bookings), Vercel (hosting and visit counts) and Supabase (private client demos).',
      'Some of these are based outside the UK. They protect transfers with the UK’s approved safeguards, such as standard contract clauses.',
      'I never sell your details or share them for anyone else’s marketing.',
    ],
  },
  {
    title: 'How long I keep it',
    body: [
      'Enquiries that do not become work: up to 24 months, then deleted.',
      'Client and invoice records: 6 years, as the tax rules require.',
      'Mailing list: until you unsubscribe.',
    ],
  },
  {
    title: 'Your rights',
    body: [
      `You can ask to see, correct or delete your details, or object to how they are used. Email ${CONTACT_EMAIL} and I will reply within one month.`,
      'If you are unhappy with my answer, you can complain to the Information Commissioner’s Office at ico.org.uk.',
    ],
  },
];

export default function PrivacyPage() {
  return (
    <main>
      <SiteHeader />
      <section className="mw-resource-hero" id="main-content" tabIndex={-1} aria-labelledby="privacy-title">
        <p className="eyebrow">Privacy</p>
        <h1 id="privacy-title">What happens to your details.</h1>
        <p>{`Short and plain. Last updated ${UPDATED}.`}</p>
      </section>
      <section className="mw-resource-list" aria-label="Privacy notice">
        {SECTIONS.map((section, index) => (
          <article className="mw-resource-row" key={section.title}>
            <span className="mw-resource-index">{String(index + 1).padStart(2, '0')}</span>
            <div>
              <h2>{section.title}</h2>
              {section.body.map((line) => <p key={line}>{line}</p>)}
            </div>
          </article>
        ))}
      </section>
      <SiteFooter />
    </main>
  );
}
