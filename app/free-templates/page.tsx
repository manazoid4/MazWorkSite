import type { Metadata } from 'next';
import { fitDescription, OG_IMAGE } from '../seo';
import { SITE_URL } from '../site';
import { SiteFooter, SiteHeader } from '../site-chrome';
import { CopyButton } from './copy-button';

/**
 * Free copy-paste templates (22 Oct 2026, Maz): the useful part of a paid
 * membership library, free forever. Start small and get each one right before
 * adding more. Late-payment figures follow the Late Payment of Commercial
 * Debts (Interest) Act 1998 as set out on GOV.UK; recheck them if that changes.
 */
const PAGE_URL = `${SITE_URL}/free-templates`;

export const metadata: Metadata = {
  title: 'Free templates',
  description: fitDescription('Free copy-and-paste templates for UK small businesses: invoice payment terms, late payment reminders, a final demand letter, a complaint reply and a review request. Free forever.'),
  alternates: { canonical: PAGE_URL },
  openGraph: { title: 'Free templates for small businesses', url: PAGE_URL, images: [OG_IMAGE] },
};

type Template = { id: string; title: string; when: string; text: string };

const TEMPLATES: Template[] = [
  {
    id: 'payment-terms',
    title: 'Payment terms for your invoices',
    when: 'Put this at the bottom of every invoice to a business customer.',
    text: `Payment terms: please pay within [30] days of the invoice date.

Bank transfer to: [Account name]
Sort code: [00-00-00]
Account number: [00000000]
Reference: [Invoice number]

If payment is late, we may claim interest and compensation under the Late Payment of Commercial Debts (Interest) Act 1998.`,
  },
  {
    id: 'friendly-reminder',
    title: 'Friendly payment reminder',
    when: 'A few days after the due date. Most late payers just forgot.',
    text: `Subject: Invoice [number] – friendly reminder

Hi [Name],

Just a quick reminder that invoice [number] for £[amount] was due on [due date].

I've attached a copy in case it got lost. You can pay by bank transfer to:
[Account name], sort code [00-00-00], account [00000000], reference [invoice number].

If it's already on its way, please ignore this.

Thanks,
[Your name]
[Business name]`,
  },
  {
    id: 'second-reminder',
    title: 'Second reminder (overdue)',
    when: 'About 14 days late, if the first reminder got no reply or payment.',
    text: `Subject: Invoice [number] – now [X] days overdue

Hi [Name],

Invoice [number] for £[amount] was due on [due date] and is now [X] days overdue.

Please pay it by [date, 7 days from today].

If payment is not received by then, I will add statutory interest and a fixed compensation charge, as allowed under the Late Payment of Commercial Debts (Interest) Act 1998.

If there's a problem with the invoice or the work, please tell me today so we can sort it out.

Thanks,
[Your name]
[Business name]`,
  },
  {
    id: 'final-demand',
    title: 'Final demand (letter before action)',
    when: 'The last step before court, for a business customer. If your customer is a sole trader or an individual, give them 30 days and follow the Pre-Action Protocol for Debt Claims instead.',
    text: `Subject: Final demand – invoice [number]

Dear [Name],

Invoice [number] for £[amount], due on [due date], is still unpaid despite my reminders on [dates].

Under the Late Payment of Commercial Debts (Interest) Act 1998, I am now claiming:

Unpaid invoice: £[amount]
Fixed compensation: £[40 / 70 / 100]
Interest at 8% above the Bank of England base rate, from [due date]: £[interest so far]
Total now due: £[total]

Please pay the total within 14 days of the date of this letter.

If I do not receive payment or hear from you by [date], I will start a court claim to recover the debt without further notice. This may add court fees and costs to what you owe.

Yours sincerely,
[Your name]
[Business name]
[Address]`,
  },
  {
    id: 'complaint-reply',
    title: 'Reply to a complaint',
    when: 'Send within a day. Short, calm and specific beats long and defensive.',
    text: `Hi [Name],

Thank you for telling me about [the problem in their words]. I'm sorry this happened.

Here's what I'm going to do: [the fix], by [date].

If that doesn't put it right, reply to this email or call me on [number] and I'll deal with it personally.

Thanks for giving me the chance to fix it.

[Your name]
[Business name]`,
  },
  {
    id: 'review-request',
    title: 'Asking a happy customer for a review',
    when: 'The same day the job is done, while they are still pleased.',
    text: `Hi [Name],

Thanks again for choosing [Business name]. I'm really glad [the job] went well.

Would you mind leaving a short review? It takes about a minute and helps other people find us:
[Review link]

Thank you,
[Your name]`,
  },
];

export default function FreeTemplatesPage() {
  return (
    <main>
      <SiteHeader />

      <section className="mw-resource-hero" id="main-content" tabIndex={-1} aria-labelledby="free-templates-title">
        <p className="eyebrow">Free templates</p>
        <h1 id="free-templates-title">Free templates for small businesses</h1>
        <p>This is free, forever. I&rsquo;m committed to pushing this out for businesses.</p>
      </section>

      <section className="s-section" aria-label="Templates">
        <div className="mw-templates">
          {TEMPLATES.map((t) => (
            <article className="mw-template" id={t.id} key={t.id} aria-labelledby={`${t.id}-title`}>
              <div className="mw-template-head">
                <div>
                  <h2 id={`${t.id}-title`}>{t.title}</h2>
                  <p>{t.when}</p>
                </div>
                <CopyButton text={t.text} />
              </div>
              <pre>{t.text}</pre>
            </article>
          ))}
        </div>
        <p className="mw-template-note">
          Templates, not legal advice. Fill in the [brackets] before sending. Late payment rules:{' '}
          <a href="https://www.gov.uk/late-commercial-payments-interest-debt-recovery">GOV.UK</a>.
        </p>
      </section>

      <SiteFooter />
    </main>
  );
}
