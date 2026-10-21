import type { Metadata } from 'next';
import { AFTER_HOURS } from '../offers';
import { MAIN_CTA } from '../site';
import { SiteFooter, SiteHeader } from '../site-chrome';
import { VoiceDesk } from './voice-desk';
import './voice-desk.css';

/**
 * Talk-to-it demo for the After-Hours Receptionist. Free to run: the browser
 * does the speech, engine.mjs does the answers. Each prospect gets their own
 * link from /receptionist-demo/make (details travel in the link's #hash, so
 * nothing is stored). Not indexed: the links are made per business.
 */
export const metadata: Metadata = {
  title: { absolute: 'Talk to an after-hours receptionist demo | Maz Works' },
  description: 'Have a pretend after-hours call out loud, in your browser, and see the summary the owner would get.',
  alternates: { canonical: '/receptionist-demo' },
  robots: { index: false, follow: true },
};

export default function ReceptionistDemoPage() {
  const demoHref = `/contact?intent=preview&src=voice-demo&package=${encodeURIComponent(AFTER_HOURS.name)}#leak-check-form`;
  return (
    <main className="vd-page">
      <SiteHeader />
      <section className="vd-hero" id="main-content" tabIndex={-1} aria-labelledby="vd-title">
        <p className="eyebrow">{AFTER_HOURS.name} · demo</p>
        <h1 id="vd-title">Ring it after hours. Out loud.</h1>
        <p>Press start and talk like a customer would. Or type, or tap a suggestion.</p>
      </section>
      <VoiceDesk />
      <section className="mw-resource-cta" aria-labelledby="vd-cta-title">
        <div>
          <p className="eyebrow">{AFTER_HOURS.price}</p>
          <h2 id="vd-cta-title">Want this answering your phone when you can’t?</h2>
          <p>{`${AFTER_HOURS.guarantee} `}<a href={AFTER_HOURS.href}>How it works →</a></p>
        </div>
        <div className="mw-actions"><a className="button button-signal" href={demoHref}>{MAIN_CTA}</a></div>
      </section>
      <SiteFooter />
    </main>
  );
}
