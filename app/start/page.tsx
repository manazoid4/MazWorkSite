import type { Metadata } from 'next';
import { SiteFooter, SiteHeader } from '../site-chrome';
import { LeakCheckForm } from '../free-plan/leak-check-form';
import { CHECK_REPLY_TIME } from '../site';

/**
 * After "Buy now" (plan v3, C11): the Stripe payment link's success URL lands
 * here with ?package=<name>, and the same form collects the intake. No call
 * needed for small jobs.
 */
export const metadata: Metadata = {
  title: 'Tell me what you need set up',
  description: `Share what you need set up and I’ll confirm the details by email within ${CHECK_REPLY_TIME}.`,
  alternates: { canonical: '/start' },
  robots: { index: false, follow: true },
};

export default function StartPage() {
  return (
    <main>
      <SiteHeader />
      <section className="mw-resource-hero" id="main-content" tabIndex={-1} aria-labelledby="start-title">
        <p className="eyebrow">Next step</p>
        <h1 id="start-title">Tell me what you need set up.</h1>
        <p>Share a few details and I’ll confirm the setup by email within {CHECK_REPLY_TIME}.</p>
      </section>
      <section className="mw-qw-section" aria-labelledby="start-form-title">
        <p className="eyebrow">Your intake</p>
        <h2 id="start-form-title">What should I set up, and what does it need to work with?</h2>
        <p>For call answering, include your phone provider or line, business hours, common questions and what counts as urgent. For other work, describe the job and the apps you use.</p>
        <LeakCheckForm setup />
      </section>
      <section className="mw-qw-section" aria-labelledby="start-next-title">
        <p className="eyebrow">What happens next</p>
        <h2 id="start-next-title">We’ll agree the setup before it goes live.</h2>
        <ol className="mw-qw-list">
          <li><strong>Day 0: Share the details.</strong> Tell me what you need and how your current setup works.</li>
          <li><strong>Confirm the plan.</strong> I’ll reply by email within {CHECK_REPLY_TIME} with the next steps.</li>
          <li><strong>Test it together.</strong> We’ll check it works for your business before it goes live.</li>
        </ol>
      </section>
      <SiteFooter />
    </main>
  );
}
