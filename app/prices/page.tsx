import { ServiceSchema } from '../service-schema';
import { fitDescription } from '../seo';
import type { Metadata } from 'next';
import { SiteFooter, SiteHeader } from '../site-chrome';
import { ENQUIRY_CTA, SITE_URL, VAT_NOTE } from '../site';
import { OG_IMAGE } from '../seo';
import { PricingViewTracker } from '../analytics';
import { CARE_PLAN, OFFERS, getOffer } from '../offers';
import { PriceList } from '../price-list';
import { PracticeTier } from '../b2b-parts';
import '../b2b.css';

const PAGE_URL = `${SITE_URL}/prices`;

const [STARTER, SYSTEM, CUSTOM] = OFFERS;
const lower = (price: string) => price.replace(/^From/, 'from');

export const metadata: Metadata = {
  title: { absolute: 'Maz Works prices for websites, systems and support' },
  description: fitDescription(`Every Maz Works price in one place: websites, customer workflows, software and monthly support. ${STARTER.name} ${STARTER.price}, ${SYSTEM.name} ${lower(SYSTEM.price)}, ${CUSTOM.name} ${lower(CUSTOM.price)}. Professional complaints work is quoted to scope. No VAT added.`),
  alternates: { canonical: PAGE_URL },
  openGraph: { title: 'Maz Works prices', description: fitDescription(`Automation from ${STARTER.price}. Free small set-ups with every package. UK price match. No VAT added.`), url: PAGE_URL, type: 'website', images: [OG_IMAGE] },
};

export default function PricesPage() {
  return (
    <main className="s-home">
      <SiteHeader /><ServiceSchema path="/prices" />
      <section className="s-hero s-hero-short" id="main-content" tabIndex={-1} aria-labelledby="prices-title">
        <p className="eyebrow">Prices</p>
        <h1 id="prices-title">Prices for getting customers, serving them and improving.</h1>
        <p className="s-lede">One-off work and optional monthly support. Reporting and complaints improvement are quoted to scope. {VAT_NOTE}</p>
        <div className="s-actions">
          <a className="button button-signal s-button-lg" href="/contact?src=prices#contact">{ENQUIRY_CTA}</a>
          <a className="text-link" href="/what-we-do#serve-customers">See how it works <span aria-hidden="true">→</span></a>
        </div>
      </section>

      <section className="s-section" aria-labelledby="price-paths-title">
        <h2 id="price-paths-title">What are you working on?</h2>
        <ul className="s-recipes">
          <li><strong>Get Customers</strong><span>Websites and online presence.</span><a href="#websites">See page options →</a></li>
          <li><strong>Serve Customers</strong><span>Bookings and follow-up.</span><a href="#systems">See automation and software →</a></li>
          <li id="keep-improve"><strong>Keep &amp; Improve</strong><span>Dashboards, reporting and complaints improvement: quoted to scope.</span><a href="/professional-teams">See reporting and improvement work →</a></li>
        </ul>
        <p className="s-small">Need care or maintenance? <a href="#extras">See options</a>.</p>
        <details className="s-fold"><summary>How professional work is priced</summary><p>The quote sets out the data sources, deliverables and any ongoing costs before you commit. <a href="/complaints-improvement">Explore specialist complaints work</a>.</p></details>
      </section>

      <section className="s-section" id="pricing" aria-labelledby="prices-list-title">
        <PricingViewTracker targetId="pricing" />
        <h2 id="prices-list-title" className="s-visually-hidden">Packages, add-ons and terms</h2>
        <PriceList checkHref="/free-plan" />
        <div className="s-actions">
          <a className="button button-signal" href="/free-plan?src=prices#leak-check-form">Get my free preview</a>
        </div>
      </section>
      <PracticeTier />
      <SiteFooter />
    </main>
  );
}
