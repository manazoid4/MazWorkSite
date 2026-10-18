import type { Metadata } from 'next';
import { fitDescription, OG_IMAGE } from '../seo';
import { CONTACT_EMAIL, MAIN_CTA, SITE_URL } from '../site';
import { SiteFooter, SiteHeader } from '../site-chrome';

/**
 * Proof hub (CRO Move 2, 18 Oct 2026). The audit found the single biggest
 * constraint is proof: no real testimonials, named clients or review counts.
 * The rule is absolute: never invent a client, logo, quote or result. So this
 * page does two honest jobs: it shows the real work you can open today, and it
 * states plainly what is not here yet, with the Founding Client offer for the
 * first named case studies. As real quotes arrive, they are added under
 * "Named client quotes", each with the client's name and their permission.
 */
const PAGE_URL = `${SITE_URL}/proof`;

export const metadata: Metadata = {
  title: 'Proof: what’s real, and what isn’t',
  description: fitDescription('No invented testimonials, clients or results. Open the real work today, see what is not here yet, and read the honest Founding Client offer.'),
  alternates: { canonical: PAGE_URL },
  openGraph: { title: 'Maz Works proof', description: fitDescription('Open the real work, see what is not here yet, and read the honest Founding Client offer.'), url: PAGE_URL, type: 'website', images: [OG_IMAGE] },
};

/** The two things anyone can open today. Both already live on the site. */
const REAL_WORK = [
  { name: 'JobFilter', kind: 'My own product · software', body: 'Finds and filters public contracts for small trades firms. Live, with paid plans.', href: '/work/jobfilter' },
  { name: 'Scrap Finance Partners', kind: 'Client build · website', body: 'Designed and built for a specialist finance firm.', href: '/work/scrap-finance-partners' },
];

/** What the first named clients get, and what they give back. Bounded and honest. */
const FOUNDING_GIVES = [
  'A short quote I can publish under your name and business.',
  'A photo or logo you are happy to share.',
  'A review on Google, once it is working.',
];

export default function ProofPage() {
  return (
    <main>
      <SiteHeader />

      <section className="mw-resource-hero" id="main-content" tabIndex={-1} aria-labelledby="proof-title">
        <p className="eyebrow">Proof</p>
        <h1 id="proof-title">Proof: what’s real, and what isn’t.</h1>
        <p>I won’t show you a wall of reviews, because I don’t have one yet. Everything on this page is real and openable. Nothing here is invented.</p>
        <p className="mw-hero-note">Updated as real quotes arrive · no invented clients, logos or results, ever</p>
      </section>

      <section className="mw-resource-list" aria-labelledby="proof-real-title">
        <h2 id="proof-real-title" style={{ padding: '0 20px' }}>What you can open and check today</h2>
        {REAL_WORK.map((item, index) => (
          <article className="mw-resource-row" key={item.name}>
            <span className="mw-resource-index">{String(index + 1).padStart(2, '0')}</span>
            <div>
              <h2>{item.name}</h2>
              <p><strong>{item.kind}.</strong> {item.body}</p>
              <p><a href={item.href}>Open {item.name} →</a></p>
            </div>
          </article>
        ))}
      </section>

      <section className="mw-resource-list" aria-labelledby="proof-gap-title">
        <h2 id="proof-gap-title" style={{ padding: '0 20px' }}>What isn’t here yet, and why</h2>
        <article className="mw-resource-row">
          <span className="mw-resource-index">01</span>
          <div>
            <h2>Named client quotes and reviews</h2>
            <p>For the automation and systems work, there are no published client quotes yet: no names, no photos, no review count. I would rather show you none than make one up.</p>
            <p>When a client gives me a quote I can publish with their name, it goes on this page. Until then, this page says so.</p>
          </div>
        </article>
      </section>

      <section className="mw-resource-list" aria-labelledby="proof-founding-title">
        <h2 id="proof-founding-title" style={{ padding: '0 20px' }}>The Founding Client offer</h2>
        <article className="mw-resource-row">
          <span className="mw-resource-index">01</span>
          <div>
            <h2>Your first job at a founder’s discount</h2>
            <p>I’m building the first set of named case studies for this work. If you’re one of the first clients, your first job comes at a founder’s discount, agreed in writing in your scope sheet before you pay anything.</p>
            <p>In return, once it’s working and you’re happy with it, you give me three things:</p>
            <ul className="s-ticks" style={{ marginTop: 10 }}>
              {FOUNDING_GIVES.map((item) => <li key={item}>{item}</li>)}
            </ul>
            <p>You can say no to any of the three. If you’d rather stay anonymous, you keep the discounted price and nothing is published.</p>
          </div>
        </article>
        <article className="mw-resource-row">
          <span className="mw-resource-index">02</span>
          <div>
            <h2>What I’ll never do</h2>
            <p>Never invent a client, a logo, a result or a number. Never publish a quote, a photo or a name without your written yes. Take any of it down whenever you ask.</p>
          </div>
        </article>
      </section>

      <section className="mw-resource-hero" aria-labelledby="proof-cta-title">
        <h2 id="proof-cta-title">Want to be one of the first?</h2>
        <p>Tell me the job. You get a working demo with your business name and a fixed price first, then the Founding Client discount if you go ahead.</p>
        <div className="mw-actions">
          <a className="button button-signal" href="/free-plan#leak-check-form">{MAIN_CTA}</a>
          <a className="button" href="/prices">See the prices</a>
        </div>
        <p className="mw-hero-note">Questions: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a></p>
      </section>

      <SiteFooter />
    </main>
  );
}
