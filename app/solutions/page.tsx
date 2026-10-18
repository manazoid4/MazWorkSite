import type { Metadata } from 'next';
import { Breadcrumbs } from '../breadcrumbs';
import { ServiceSchema } from '../service-schema';
import { SiteFooter, SiteHeader } from '../site-chrome';
import { CHECK_REPLY_TIME, MAIN_CTA, SITE_URL } from '../site';
import { OG_IMAGE, fitDescription } from '../seo';
import { OFFERS } from '../offers';
import { SolutionsPicker } from './solutions-picker';

const PAGE_URL = `${SITE_URL}/solutions`;
const [STARTER, SYSTEM] = OFFERS;

export const metadata: Metadata = {
  title: { absolute: 'Fix missed calls, no-shows and quiet quotes | Maz Works' },
  description: fitDescription(`Pick the problem: missed calls, no-shows, quotes that go quiet, reviews. See what you get, what it costs (${STARTER.name} ${STARTER.price} once, ${SYSTEM.name} ${SYSTEM.price.replace(/^From/, 'from')}) and what happens next. No VAT added.`),
  alternates: { canonical: PAGE_URL },
  openGraph: { title: 'Maz Works solutions: pick the problem', description: fitDescription(`Missed calls, no-shows, quiet quotes, reviews. Fixed prices from ${STARTER.price}, paid once. No VAT added.`), url: PAGE_URL, type: 'website', images: [OG_IMAGE] },
};

export default function SolutionsPage() {
  return (
    <main className="s-home">
      <SiteHeader /><ServiceSchema path="/solutions" />
      <section className="s-hero s-hero-short" id="main-content" tabIndex={-1} aria-labelledby="solutions-title">
        <Breadcrumbs items={[{ label: 'Solutions' }]} />
        <p className="eyebrow">Solutions</p>
        <h1 id="solutions-title">Pick the problem. See the answer.</h1>
        <p className="s-lede">Same four answers for every business: the problem, what you get, what it costs and what happens next. Fixed prices, no VAT added. The free preview reaches you within {CHECK_REPLY_TIME}.</p>
      </section>

      <section className="s-section" id="pick" aria-labelledby="solutions-pick-title">
        <h2 id="solutions-pick-title" className="s-visually-hidden">Solutions by problem</h2>
        <SolutionsPicker startOpen firstSelected />
        <div className="s-actions">
          <a className="button button-signal" href="/free-plan?src=solutions#leak-check-form">{MAIN_CTA}</a>
          <a className="text-link" href="/prices#systems">Every package and price <span aria-hidden="true">→</span></a>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
