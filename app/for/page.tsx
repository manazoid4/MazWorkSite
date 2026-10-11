import { MAIN_CTA } from '../site';
import { fitDescription } from '../seo';
import type { Metadata } from 'next';
import { Breadcrumbs } from '../breadcrumbs';
import { OG_IMAGE } from '../seo';
import { SiteFooter, SiteHeader } from '../site-chrome';
import { NICHE_GUIDES } from './niches';
import { OFFERS } from '../offers';
import { CUSTOMER_TYPES } from '../customer-types';
import { KitIcon, NICHE_ICONS } from '../brand-kit/kit-icon';
import { INDUSTRY_VOICE } from './industry-voice';
import './trade-pages.css';

export const metadata: Metadata = {
  title: 'Who it’s for: pick your business',
  description: fitDescription(`Trades, appointments, creators or offices: pick yours and see your problems, what I’d set up and the price. Named recipes from ${OFFERS[0].price}, plus guides by trade.`),
  alternates: { canonical: '/for' },
  openGraph: { title: 'Who it’s for — Maz Works', url: '/for', images: [OG_IMAGE] },
};

/** One tile: icon chip, name, one line, "See what I’d set up →". */
function Tile({ href, icon, name, line, tag }: { href: string; icon: string; name: string; line: string; tag?: string }) {
  return (
    <li>
      <a className="tp-tile" href={href}>
        <span className="tp-card-icon" aria-hidden="true"><KitIcon name={icon} /></span>
        {tag ? <small className="tp-tile-tag">{tag}</small> : null}
        <strong>{name}</strong>
        <span>{line}</span>
        <em>See what I’d set up <span aria-hidden="true">→</span></em>
      </a>
    </li>
  );
}

export default function ForHubPage() {
  // One even grid of every trade, each labelled with its kind of business (grouped rows left half-empty lines).
  const typeOf = (id: string) => CUSTOMER_TYPES.find((type) => type.niches.includes(id))?.shortName;
  return (
    <main className="s-home">
      <SiteHeader />
      <section className="s-hero s-hero-short tp-hero tp-hero-hub" id="main-content" tabIndex={-1} aria-labelledby="for-title">
        <div className="tp-crumbs"><Breadcrumbs items={[{ label: 'Who it’s for' }]} /></div>
        <p className="eyebrow">Who it’s for</p>
        <h1 id="for-title">What do you run?</h1>
        <p className="s-lede">Pick the one that sounds like you. Each page shows your problems, the step that fixes each one, and the price.</p>
      </section>

      <section className="s-section" aria-labelledby="for-types-title">
        <p className="eyebrow">Pick yours</p>
        <h2 id="for-types-title">Four kinds of business.</h2>
        <ul className="tp-tiles tp-tiles-4" aria-label="Kinds of business">
          {CUSTOMER_TYPES.map((type) => <Tile key={type.id} href={`/for/${type.id}`} icon={type.icon} name={type.name} line={`${INDUSTRY_VOICE[type.id].hook} ${type.examples}`} />)}
        </ul>
      </section>

      <section className="s-section" aria-labelledby="for-trades-title">
        <p className="eyebrow">Or by trade</p>
        <h2 id="for-trades-title">Go straight to your trade.</h2>
        <ul className="tp-tiles tp-tiles-4" aria-label="Trades">
          {NICHE_GUIDES.map((guide) => <Tile key={guide.id} href={`/for/${guide.id}`} icon={NICHE_ICONS[guide.id] ?? 'spark'} name={guide.shortName} line={INDUSTRY_VOICE[guide.id].hook} tag={typeOf(guide.id)} />)}
          <li><a className="tp-tile tp-tile-else" href="/free-plan?src=for-hub&trade=other#leak-check-form"><span className="tp-card-icon" aria-hidden="true"><KitIcon name="spark" /></span><strong>Something else?</strong><span>Every kind of business is welcome. Tell me what you do.</span><em>{MAIN_CTA} <span aria-hidden="true">→</span></em></a></li>
        </ul>
        
      </section>

      <SiteFooter />
    </main>
  );
}
