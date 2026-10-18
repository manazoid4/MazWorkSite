import { ServiceSchema } from '../service-schema';
import { fitDescription } from '../seo';
import type { Metadata } from 'next';
import { SiteFooter, SiteHeader } from '../site-chrome';
import { CHECK_REPLY_TIME, SITE_URL } from '../site';
import { OG_IMAGE } from '../seo';
import { PricingViewTracker } from '../analytics';
import { CARE_PLAN, FREE_STEP, OFFERS, getOffer } from '../offers';
import { PriceList } from '../price-list';

const PAGE_URL = `${SITE_URL}/prices`;

const [STARTER, SYSTEM, CUSTOM] = OFFERS;
const lower = (price: string) => price.replace(/^From/, 'from');

export const metadata: Metadata = {
  title: { absolute: 'Automation prices for UK small businesses | Maz Works' },
  description: fitDescription(`Every Maz Works price in one place. ${STARTER.name} ${STARTER.price}, ${SYSTEM.name} ${lower(SYSTEM.price)}, ${CUSTOM.name} ${lower(CUSTOM.price)}, ${getOffer('creator-launch').name} ${getOffer('creator-launch').price}, free small set-ups and ${CARE_PLAN.name} ${CARE_PLAN.price}. Fixed quote first, no VAT added.`),
  alternates: { canonical: PAGE_URL },
  openGraph: { title: 'Maz Works prices', description: fitDescription(`Automation from ${STARTER.price}. Free small set-ups with every package. UK price match. No VAT added.`), url: PAGE_URL, type: 'website', images: [OG_IMAGE] },
};

export default function PricesPage() {
  return (
    <main className="s-home">
      <SiteHeader /><ServiceSchema path="/prices" />
      <section className="s-hero s-hero-short" id="main-content" tabIndex={-1} aria-labelledby="prices-title">
        <p className="eyebrow">Prices</p>
        <h1 id="prices-title">Choose a one-off build or monthly help.</h1>
        <p className="s-lede">I can build a system once, keep your online presence current each month, or answer calls you miss. The scope and price are agreed before work starts. No VAT added.</p>
        <p className="s-small">Start with a {FREE_STEP.short}, within {CHECK_REPLY_TIME}. Choose one useful job; add more when you need it.</p>
        <div className="s-actions">
          <a className="button button-signal s-button-lg" href="/free-plan?src=prices-hero#leak-check-form">Get my free preview</a>
          <a className="text-link" href="/what-we-do#systems">See how it works <span aria-hidden="true">→</span></a>
        </div>
      </section>

      <section className="s-section" id="pricing" aria-labelledby="prices-list-title">
        <PricingViewTracker targetId="pricing" />
        <h2 id="prices-list-title" className="s-visually-hidden">Packages, add-ons and terms</h2>
        <PriceList checkHref="/free-plan" />
        <div className="s-actions">
          <a className="button button-signal" href="/free-plan?src=prices#leak-check-form">Get my free preview</a>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
