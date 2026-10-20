import { ServiceSchema } from '../service-schema';
import { fitDescription } from '../seo';
import type { Metadata } from 'next';
import { SiteFooter, SiteHeader } from '../site-chrome';
import { SITE_URL, VAT_NOTE } from '../site';
import { OG_IMAGE } from '../seo';
import { PricingViewTracker } from '../analytics';
import { CARE_PLAN, OFFERS, getOffer } from '../offers';
import { PriceFolds } from '../price-list';
import { SolutionsPicker } from '../solutions/solutions-picker';
import { Hero } from './hero';
import { Outcomes } from './outcomes';
import { OneOffBoard, MonthlyBoard } from './pricing-board';
import { Journey } from './journey';
import { Founder, Route } from './story';
import { PracticeTier } from '../b2b-parts';
import '../b2b.css';

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
    <main className="pz-main">
      <SiteHeader /><ServiceSchema path="/prices" />
      <Hero />
      <Outcomes />

      <section className="pz-section" id="pricing" aria-labelledby="prices-list-title">
        <PricingViewTracker targetId="pricing" />
        <h2 id="prices-list-title">What it costs</h2>
        <p className="pz-intro">Prices are for the finished work, agreed in writing before I start. {VAT_NOTE}</p>
        <h3 className="pz-group">Build it once. You own it.</h3>
        <OneOffBoard />
        <h3 className="pz-group">Or have it looked after every month.</h3>
        <MonthlyBoard />
      </section>
      <PracticeTier />

      <section className="pz-section pz-tools" aria-labelledby="tools-title">
        <h2 id="tools-title">Not sure what you need?</h2>
        <h3 className="pz-group" id="need">What problem do you want gone?</h3>
        <SolutionsPicker startOpen={false} firstSelected={false} />
        <div className="pz-folds">
          <PriceFolds checkHref="/free-plan" />
        </div>
      </section>

      <Journey />
      <Founder />
      <Route />
      <SiteFooter />
    </main>
  );
}
