import type { Metadata } from 'next';
import { SiteFooter, SiteHeader } from './site-chrome';
import { ThreeBuckets } from './three-buckets';
import { HomeFooterConvert } from './home-footer-convert';
import { ManazirLine } from './manazir-line';
import { ENQUIRY_CTA } from './site';
import { OG_IMAGE } from './seo';
import './home-transformation.css';


const PROOF = [
  {
    name: 'Scrap Finance Partners',
    label: 'Client website',
    body: 'A clear digital home for a specialist finance business.',
    href: '/work/scrap-finance-partners',
    img: '/scrap-finance-partners.webp',
    alt: 'Scrap Finance Partners website, designed for a specialist finance firm',
    tone: 'peach',
  },
  {
    name: 'JobFilter',
    label: 'Maz Works product',
    body: 'Finding relevant public contracts for small trades firms.',
    href: '/work/jobfilter',
    img: '/jobfilter-home.webp',
    alt: 'JobFilter helps small trades firms find relevant public contracts',
    tone: 'sky',
  },
];

function AudienceIcon({ kind }: { kind: 'local' | 'team' }) {
  return (
    <svg className={`mw-door-icon is-${kind}`} viewBox="0 0 96 76" aria-hidden="true" focusable="false">
      {kind === 'local' ? <>
        <rect x="9" y="13" width="48" height="48" rx="3" />
        <path d="M9 26h48M20 8v11m26-11v11M20 37h11m8 0h9M20 47h11" />
        <circle className="mw-door-icon-badge" cx="70" cy="47" r="15" />
        <path d="m63 47 5 5 9-10" />
      </> : <>
        <rect x="7" y="13" width="62" height="43" />
        <path d="M38 56v8m-18 0h36M17 47h12V36H17zm20 0h12V28H37zm20 0h7V20h-7z" />
        <circle className="mw-door-icon-badge" cx="77" cy="15" r="12" />
        <path d="m72 15 4 4 7-8" />
      </>}
    </svg>
  );
}

export const metadata: Metadata = {
  title: { absolute: 'Maz Works | Making businesses better, one problem at a time' },
  description: 'Maz Works helps businesses win customers, serve them well and improve how they work through websites, connected tools, reporting and custom software.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Maz Works | Making businesses better, one problem at a time',
    description: 'Practical websites, customer workflows, reporting and complaints insight for businesses and teams.',
    url: '/',
    type: 'website',
    images: [OG_IMAGE],
  },
};

export default function Page() {
  return (
    <main className="s-home mw-home">
      <SiteHeader />

      <section className="mw-home-hero" id="main-content" tabIndex={-1} aria-labelledby="home-title">
        <div className="mw-home-hero-copy">
          <p className="eyebrow">Making businesses better, one problem at a time.</p>
          <h1 id="home-title">Less hassle. <mark>Better</mark> business.</h1>
          <p className="mw-home-lede">I build websites, customer workflows and reporting tools that help businesses win work, look after customers and see what needs attention.</p>
          <div className="mw-home-actions">
            <a className="button button-signal" href="/contact?src=home#contact">{ENQUIRY_CTA}</a>
            <a className="mw-home-secondary" href="/proof">See my work <span aria-hidden="true">↗</span></a>
          </div>
          <p className="mw-home-reassurance">One person to deal with. I usually reply within 1 working day. Clear scope and price before paid work. <a href="/contact?src=home#contact">Ask for a free preview</a>.</p>
        </div>

      </section>

      <ThreeBuckets />

      <section className="mw-home-doors" aria-labelledby="doors-title">
        <header><h2 id="doors-title">Different businesses.<br />Real problems worth solving.</h2></header>
        <div className="mw-door-grid">
          <article className="mw-door-card mw-door-local">
            <AudienceIcon kind="local" />
            <div className="mw-door-copy">
              <h3>Local &amp; independent businesses</h3>
              <p>You’re busy looking after customers. Your website, enquiries and bookings should make that easier.</p>
              <a href="/local-businesses">Find help for your business <span aria-hidden="true">↗</span></a>
            </div>
          </article>
          <article className="mw-door-card mw-door-professional">
            <AudienceIcon kind="team" />
            <div className="mw-door-copy">
              <h3>Professional teams &amp; organisations</h3>
              <p>Clearer reporting, visible workloads and fewer manual hand-offs, built around the tools you already use.</p>
              <a href="/professional-teams">Explore help for your team <span aria-hidden="true">↗</span></a>
            </div>
          </article>
        </div>
      </section>

      <section className="mw-home-proof" aria-labelledby="proof-title">
        <header>
          <h2 id="proof-title">Made to be used.<br />Have a look around.</h2>
          <p>Client work and a product of my own. Open an example and see the thinking behind it.</p>
        </header>
        <div className="mw-home-proof-grid">
          {PROOF.map((item) => (
            <article className="mw-home-proof-card" key={item.name}>
              <a className={`mw-home-proof-image is-${item.tone}`} href={item.href} aria-label={`View ${item.name}`}>
                <img src={item.img} alt={item.alt} width={1440} height={1000} loading="lazy" />
              </a>
              <span className="relationship">{item.label}</span>
              <h3><a href={item.href}>{item.name}<span aria-hidden="true"> ↗</span></a></h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
        <details className="mw-home-proof-more">
          <summary>Explore workflow demonstrations</summary>
          <div>
            <p>Complaints examples use synthetic data and are labelled demonstrations. <a href="/complaints/sample/board-report">See a sample report ↗</a></p>
            <p>For professional teams: <a href="/professional-teams#demonstrations">see dashboard and workflow demonstrations ↗</a></p>
          </div>
        </details>
      </section>

      <ManazirLine block />

      <SiteFooter conversion={<HomeFooterConvert />} />
    </main>
  );
}
