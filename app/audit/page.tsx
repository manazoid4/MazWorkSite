import type { Metadata } from 'next';
import { fitDescription, OG_IMAGE } from '../seo';
import { SITE_URL } from '../site';
import { SiteFooter, SiteHeader } from '../site-chrome';
import { BookCall } from '../booking-modal';
import { AutomationAudit } from './audit';
import '../b2b.css';

const PAGE_URL = `${SITE_URL}/audit`;

export const metadata: Metadata = {
  title: 'Free business automation audit',
  description: fitDescription('Tick the repeat jobs eating your week and see the hours they take, with three places to start. Free, instant, no sign-up to see the estimate.'),
  alternates: { canonical: PAGE_URL },
  openGraph: { title: 'Free business automation audit — Maz Works', description: fitDescription('See what repeat admin costs your team, from your own numbers.'), url: PAGE_URL, type: 'website', images: [OG_IMAGE] },
};

export default function AuditPage() {
  return (
    <main>
      <SiteHeader />
      <section className="mw-resource-hero" id="main-content" tabIndex={-1} aria-labelledby="au-title">
        <p className="eyebrow">Free audit</p>
        <h1 id="au-title">Where is your team’s time going?</h1>
        <p>Pick the repeat jobs that eat your week. You get an estimate of the hours and up to three sensible places to start before you share any details.</p>
        <p className="mw-hero-note">Your numbers only · nothing sent until you ask for the plan</p>
      </section>
      <section className="mw-qw-section" aria-label="The audit" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <AutomationAudit />
      </section>
      <section className="mw-resource-hero" aria-labelledby="au-cta">
        <h2 id="au-cta">Prefer to talk it through?</h2>
        <div className="b2b-cta"><BookCall interest="Free automation audit" /></div>
      </section>
      <SiteFooter />
    </main>
  );
}
