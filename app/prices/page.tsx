import { ServiceSchema } from '../service-schema';
import { fitDescription } from '../seo';
import type { Metadata } from 'next';
import { SiteFooter, SiteHeader } from '../site-chrome';
import { SITE_URL } from '../site';
import { OG_IMAGE } from '../seo';
import { PricingViewTracker } from '../analytics';
import { CARE_PLAN, OFFERS, getOffer } from '../offers';
import { PriceList } from '../price-list';
import { PracticeTier } from '../b2b-parts';
import '../b2b.css';
import { Hero } from './hero';
import './prices.css';

const PAGE_URL = `${SITE_URL}/prices`;

const [STARTER, SYSTEM, CUSTOM] = OFFERS;
const lower = (price: string) => price.replace(/^From/, 'from');

export const metadata: Metadata = {
  title: { absolute: 'Prices: websites, follow-up and custom tools | Maz Works' },
  description: fitDescription(`Every price in one place. ${STARTER.name} ${STARTER.price}, ${SYSTEM.name} ${lower(SYSTEM.price)}, ${CUSTOM.name} ${lower(CUSTOM.price)}, websites and monthly services. Fixed before I start. No VAT added.`),
  alternates: { canonical: PAGE_URL },
  openGraph: { title: 'Maz Works prices', description: fitDescription(`Automation from ${STARTER.price}. Free small set-ups with every package. UK price match. No VAT added.`), url: PAGE_URL, type: 'website', images: [OG_IMAGE] },
};

export default function PricesPage() {
  return (
    <main className="s-home">
      <SiteHeader /><ServiceSchema path="/prices" />
      <Hero />

      <section className="s-section" aria-labelledby="price-paths-title">
        <h2 id="price-paths-title" className="s-visually-hidden">Where to look</h2>
        <p><a href="#websites">A website</a> · <a href="#systems">Follow-up, booking and custom tools</a> · <a href="#monthly">Monthly services</a> · Not sure? <a href="/contact">Describe the problem</a>.</p>
        <p className="s-small" id="keep-improve">Dashboards, reporting and complaints improvement are quoted to scope: <a href="/professional-teams">see how that works</a>. Need care or maintenance? <a href="#extras">See options</a>.</p>
        <details className="s-fold"><summary>How work for professional teams is priced</summary><p>The quote sets out the data you will share, what I will deliver and any ongoing costs before you commit. <a href="/professional-teams#complaints">Explore specialist complaints work</a>.</p></details>
      </section>

      <section className="s-section" id="pricing" aria-labelledby="prices-list-title">
        <PricingViewTracker targetId="pricing" />
        <h2 id="prices-list-title" className="s-visually-hidden">Packages, add-ons and terms</h2>
        <PriceList checkHref="/contact" />
        <div className="s-actions">
          <a className="button button-signal" href="/contact?intent=preview&src=prices#leak-check-form">Get my free preview</a>
        </div>
      </section>
      <PracticeTier />
      <SiteFooter />
    </main>
  );
}
