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
import '../light-system.css';
import './for-refresh.css';

function BusinessScene({ office = false }: { office?: boolean }) {
  return <svg className="for-scene" viewBox="0 0 440 280" fill="none" aria-hidden="true" focusable="false">
    <path d="M20 252H420" stroke="currentColor" strokeWidth="3" />
    {office ? <>
      <rect x="255" y="24" width="140" height="100" rx="4" fill="#fbf8f2" stroke="currentColor" strokeWidth="3" />
      <path d="M275 48H350M280 101V78M310 101V65M340 101V84M370 101V56" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
      <path d="M45 174H390M68 174V251M365 174V251" stroke="currentColor" strokeWidth="6" />
      <rect x="160" y="105" width="105" height="60" rx="4" fill="#ddecf5" stroke="currentColor" strokeWidth="3" />
      <path d="M150 170H275M180 125H242M180 140H220" stroke="currentColor" strokeWidth="3" />
      <circle cx="105" cy="90" r="24" fill="#f5d3bf" stroke="currentColor" strokeWidth="3" />
      <path d="M81 87C75 53 133 53 130 90L108 74Z" fill="currentColor" />
      <path d="M62 165C62 118 147 117 150 165" fill="#eaa69b" stroke="currentColor" strokeWidth="3" />
      <path d="M103 188V236L128 249M145 188V230" stroke="currentColor" strokeWidth="10" strokeLinecap="round" />
      <path d="M58 187H150M60 187V248" stroke="currentColor" strokeWidth="5" />
      <rect x="300" y="145" width="27" height="26" rx="3" fill="#f4df91" stroke="currentColor" strokeWidth="3" />
    </> : <>
      <path d="M55 154V77C55 13 176 13 176 77V154Z" fill="#ddecf5" stroke="currentColor" strokeWidth="3" />
      <path d="M74 112L139 47M90 132L158 64" stroke="#fbf8f2" strokeWidth="7" strokeLinecap="round" />
      <path d="M36 164H197M48 164V251M185 164V251" stroke="currentColor" strokeWidth="5" />
      <rect x="63" y="139" width="17" height="22" rx="3" fill="#eaa69b" stroke="currentColor" strokeWidth="2" />
      <rect x="230" y="148" width="99" height="61" rx="15" fill="#eaa69b" stroke="currentColor" strokeWidth="3" />
      <path d="M218 164V206H343V164M281 210V247M254 249H309" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
      <rect x="252" y="30" width="82" height="82" rx="4" fill="#fbf8f2" stroke="currentColor" strokeWidth="3" />
      <circle cx="278" cy="81" r="8" stroke="currentColor" strokeWidth="3" /><circle cx="308" cy="81" r="8" stroke="currentColor" strokeWidth="3" />
      <path d="M284 75L310 49M302 75L276 49" stroke="currentColor" strokeWidth="3" />
      <path d="M382 225V159M382 197C351 191 358 166 382 182M382 177C410 171 409 146 382 160" fill="#f4df91" stroke="currentColor" strokeWidth="3" />
      <path d="M366 221H400L394 251H372Z" fill="#f4df91" stroke="currentColor" strokeWidth="3" />
    </>}
  </svg>;
}

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
    <main className="s-home mw-light for-refresh">
      <SiteHeader />
      <section className="s-hero s-hero-short tp-hero tp-hero-hub" id="main-content" tabIndex={-1} aria-labelledby="for-title">
        <div className="tp-crumbs"><Breadcrumbs items={[{ label: 'Who it’s for' }]} /></div>
        <h1 id="for-title">Different businesses.<br /><span>A better working day.</span></h1>
        <p className="s-lede">Behind a salon chair, out on a job or running a busy team. I help sort the enquiries, admin and everyday processes that get in the way of your work.</p>
        <nav className="for-jump" aria-label="Find your business"><a href="#for-types-title">Small & local businesses ↓</a><a href="#for-team-title">Professional teams ↓</a></nav>
      </section>

      <section className="s-section" aria-labelledby="for-types-title">
        <div className="for-feature"><div><h2 id="for-types-title">More time for the work people come to you for.</h2><p>A clearer website. A simpler way to book. A follow-up that doesn’t depend on remembering it after a long day.</p><p>Already have tools that work? I start there, not with a replacement.</p></div><div className="for-art"><BusinessScene /></div></div>
        <ul className="tp-tiles tp-tiles-4" aria-label="Kinds of business">
          {CUSTOMER_TYPES.map((type) => <Tile key={type.id} href={`/for/${type.id}`} icon={type.icon} name={type.name} line={`${INDUSTRY_VOICE[type.id].hook} ${type.examples}`} />)}
        </ul>
      </section>

      <section className="s-section for-team" aria-labelledby="for-team-title">
        <div className="for-feature"><div className="for-art for-art-office"><BusinessScene office /></div><div><h2 id="for-team-title">A clearer picture.<br />A team that can act on it.</h2><p>For professional services, finance and operations teams: practical help with the work between the inbox, the spreadsheet and the next person in the process.</p><a className="for-primary" href="/b2b">Explore help for professional teams ↗</a></div></div>
        <dl className="for-capabilities">
          <div><dt>Workloads & handovers</dt><dd>Make ownership, outstanding work and next steps visible, so tasks don’t sit between teams.</dd></div>
          <div><dt>Reporting & dashboards</dt><dd>Turn scattered spreadsheets into a useful view of volumes, backlogs and where attention is needed.</dd></div>
          <div><dt>Service levels & deadlines</dt><dd>Track service-level agreements (SLAs), flag approaching deadlines and clarify escalation routes.</dd></div>
          <div><dt>Finance admin & client care</dt><dd>Simplify document chasing, invoice follow-ups and client updates, with complaints support where it’s needed.</dd></div>
        </dl>
        <p>Work directly with me, Manazir. We agree the problem, scope and price before the work starts.</p>
      </section>
      <section className="s-section for-directory" aria-labelledby="for-trades-title">
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
