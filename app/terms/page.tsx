import type { Metadata } from 'next';
import { CARE_PLANS, CHANGES_WINDOW, PAYMENT_TERMS, THIRD_PARTY_NOTE } from '../offers';
import { fitDescription, OG_IMAGE } from '../seo';
import { CONTACT_EMAIL, SITE_URL } from '../site';
import { SiteFooter, SiteHeader } from '../site-chrome';

/**
 * Terms of work (2 Oct 2026). Plain English, built from the same values as the
 * price list in app/offers.ts so the two can never disagree. Protects both
 * sides: fixed scope, dated delays when content or access is late, staged
 * payment on bigger jobs, ownership on payment, and a liability cap.
 */
const PAGE_URL = `${SITE_URL}/terms`;
const UPDATED = '2 October 2026';

export const metadata: Metadata = {
  title: 'Terms of work',
  description: fitDescription('How working with Maz Works works: fixed quotes, what you provide, payment, changes after go-live, ownership, care plans and cancelling. Plain English.'),
  alternates: { canonical: PAGE_URL },
  openGraph: { title: 'Maz Works terms of work', url: PAGE_URL, images: [OG_IMAGE] },
};

const TERMS: { title: string; body: string[] }[] = [
  {
    title: 'The quote is the agreement',
    body: [
      'Before any work starts you get a written plan and one fixed price. Accepting it by email is our agreement.',
      'The plan lists what is included. Anything not in it is priced first, and nothing is added to your bill without your yes.',
    ],
  },
  {
    title: 'What I need from you',
    body: [
      'Access as a user on the accounts the job needs (never your passwords), and any words, photos or details the plan asks for.',
      'The delivery date counts from when I have everything. If something arrives late, the date moves by the same number of days.',
      'If I hear nothing for 30 days, the job pauses. We agree a new date when you are ready, and any finished stage is invoiced.',
    ],
  },
  {
    title: 'Payment',
    body: [
      PAYMENT_TERMS,
      'Invoices are due within 7 days. Work goes live, and ownership passes to you, once it is paid.',
      'For business clients, late invoices can carry statutory interest under the Late Payment of Commercial Debts (Interest) Act 1998. I would much rather talk first.',
    ],
  },
  {
    title: 'Changes after it goes live',
    body: [
      CHANGES_WINDOW.body,
      `Not covered: ${CHANGES_WINDOW.notCovered.map((item) => item.replace(/\.$/, '')).join('. ')}.`,
      CHANGES_WINDOW.howItWorks,
    ],
  },
  {
    title: 'Other companies’ apps',
    body: [
      THIRD_PARTY_NOTE,
      'If another company changes or breaks an app you use, that isn’t my build: I quote the fix first, or a care plan covers it.',
    ],
  },
  {
    title: 'Ownership',
    body: [
      'Once paid in full, everything built for your business is yours, and every account stays in your name.',
      'I keep my general know-how and reusable tools that are not specific to your business. I only show your project in my work with your permission.',
    ],
  },
  {
    title: 'Care plans',
    body: [
      `${CARE_PLANS.map((plan) => `${plan.name} is ${plan.price}`).join(' and ')}, paid monthly in advance.`,
      'Cancel any time by email: the plan ends at the end of the month you have paid for. Unused time does not roll over.',
    ],
  },
  {
    title: 'Cancelling a job',
    body: [
      'Before work starts there is nothing to pay. After it starts, you pay only for the work done so far, worked out fairly against the agreed stages.',
    ],
  },
  {
    title: 'Free previews and bigger-build previews',
    body: [
      'The free preview and any bigger-build preview cost nothing and commit you to nothing. A preview stays mine until you buy the work it shows, so please do not use it with real customers before then.',
    ],
  },
  {
    title: 'Responsibility',
    body: [
      'I do the work with reasonable care and skill. If something I built does not work as agreed, I fix it.',
      'My responsibility for any job is limited to the price you paid for it, and I am not responsible for lost profits or business. Nothing here limits anything the law does not allow to be limited.',
    ],
  },
  {
    title: 'Your customers’ details',
    body: [
      'If a job means handling your customers’ personal details, I use them only to do the job, keep them secure, and hand back or delete them at the end. How I handle your own details is on the privacy page.',
    ],
  },
  {
    title: 'The law',
    body: ['These terms are governed by the law of England and Wales.'],
  },
];

export default function TermsPage() {
  return (
    <main>
      <SiteHeader />
      <section className="mw-resource-hero" id="main-content" tabIndex={-1} aria-labelledby="terms-title">
        <p className="eyebrow">Terms of work</p>
        <h1 id="terms-title">The deal, in plain English.</h1>
        <p>{`Plain English, so you know exactly what you get. Last updated ${UPDATED}. Questions: `}<a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.</p>
      </section>
      <section className="mw-resource-list" aria-label="Terms">
        {TERMS.map((term, index) => (
          <article className="mw-resource-row" key={term.title}>
            <span className="mw-resource-index">{String(index + 1).padStart(2, '0')}</span>
            <div>
              <h2>{term.title}</h2>
              {term.body.map((line) => <p key={line}>{line}</p>)}
            </div>
          </article>
        ))}
      </section>
      <SiteFooter />
    </main>
  );
}
