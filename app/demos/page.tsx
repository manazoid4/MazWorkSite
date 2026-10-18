import { fitDescription } from '../seo';
import { OG_IMAGE } from '../seo';
import type { Metadata } from 'next';
import { SiteFooter, SiteHeader } from '../site-chrome';
import { CHANGES_WINDOW, DELIVERY_PROMISE } from '../offers';
import { CHECK_REPLY_TIME } from '../site';
import { DemoPath } from '../demo-path';

const DEMO_DESCRIPTION = 'Bigger build? Start with the free preview, then see a full-build preview before you pay. One fixed price, 30 days of tweaks.';

export const metadata: Metadata = {
  title: 'Bigger build demos',
  description: DEMO_DESCRIPTION,
  alternates: { canonical: '/demos' },
  openGraph: { images: [OG_IMAGE],
    title: 'Bigger build demos — Maz Works',
    description: fitDescription('Start with the free preview, then see a full-build preview before you pay.'),
    url: '/demos',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bigger build demos — Maz Works',
    description: fitDescription('Start with the free preview, then see a full-build preview before you pay.'),
    images: [OG_IMAGE.url],
  },
};

const FAQ = [
  ['Is the preview really free?', 'Yes. You pay nothing for the free preview or the bigger-build preview, and you are under no obligation to go ahead.'],
  ['When do I get it?', 'The date is in your scope sheet, based on what the preview needs to show. Prefer to talk it through? A 15-minute call is optional.'],
  ['What if a preview won’t help?', 'Some jobs are clearer as the free preview and a fixed price alone. If so, that is all you need.'],
  ['What happens after the preview?', 'If you like it, I send the full scope sheet with one fixed price. Every item is listed and invoiced clearly, with no extra charges later.'],
  ['What counts as a tweak in the 30 days?', 'Anything that adjusts what I built: wording, timings, steps, notifications, small layout changes, in up to two rounds. Anything not working as agreed is fixed free for 90 days. Something new, like another page, system or app, is priced first so it stays fair.'],
];

export default function DemosPage() {
  return (
    <main className="s-home">
      <SiteHeader />

      <section className="s-hero s-hero-short" id="main-content" tabIndex={-1} aria-labelledby="demos-title">
        <p className="eyebrow">Bigger build demos</p>
        <h1 id="demos-title">Bigger build? <em>See it working</em> before you pay.</h1>
        <p className="s-lede">Start with the free preview: no call needed. If your job is a Business System, Launch Page, Website or Custom Software, a full-build preview comes next, by a date we agree. Smaller jobs go straight from the free preview to a fixed price.</p>
        <DemoPath source="demos" />
        <p className="s-small">I usually reply within {CHECK_REPLY_TIME}.</p>
      </section>

      <p className="s-section s-small"><a className="s-details-link" href="/prices#next">After it goes live: {CHANGES_WINDOW.name} →</a></p>

      <section className="s-section" id="questions" aria-labelledby="questions-title">
        <p className="eyebrow">Straight answers</p>
        <h2 id="questions-title">Questions people ask first.</h2>
        <div className="dp-faq">
          {FAQ.map(([question, answer]) => (
            <details key={question}><summary>{question}</summary><p>{answer}</p></details>
          ))}
        </div>
        <p className="s-small">Your demo sits behind a private link and access code. Only the people you choose see it.</p>
      </section>

      <SiteFooter />
    </main>
  );
}
