import type { Metadata } from 'next';
import { Breadcrumbs } from '../breadcrumbs';
import { SiteFooter, SiteHeader } from '../site-chrome';
import { AFTER_HOURS, ALWAYS_INCLUDED, OFFERS } from '../offers';
import { OG_IMAGE } from '../seo';
import { SERVICE_JOBS } from '../services/jobs';
import { SITE_URL, VAT_NOTE } from '../site';

const PAGE_URL = SITE_URL + '/missed-call-text-back';
const starter = OFFERS[0];
const job = SERVICE_JOBS.find((item) => item.id === 'missed-call')!;
const TITLE = 'Missed-Call Text-Back for UK Small Businesses | Maz Works';
const DESCRIPTION = `Reply to every missed call with a text carrying your booking or quote link. Set up on your own phone system for ${starter.price}; you pay once you have seen it working.`;

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: PAGE_URL, type: 'website', images: [OG_IMAGE] },
};

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Missed-call text-back set-up',
  serviceType: 'Business automation',
  provider: { '@id': SITE_URL + '/#maz-works' },
  areaServed: { '@type': 'Country', name: 'United Kingdom' },
  url: PAGE_URL,
  offers: { '@type': 'Offer', name: starter.name, price: starter.from, priceCurrency: 'GBP', url: PAGE_URL },
};

export default function MissedCallTextBackPage() {
  return (
    <main className="s-home">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema).replace(/</g, '\\u003c') }} />
      <SiteHeader />
      <Breadcrumbs items={[{ href: '/what-we-do', label: 'What I do' }, { label: 'Missed-call text-back' }]} />

      <section className="s-hero s-hero-short" id="main-content" tabIndex={-1} aria-labelledby="missed-title">
        <p className="eyebrow">{starter.name} · {starter.price}</p>
        <h1 id="missed-title">{job.h1}.</h1>
        <p className="s-lede">{job.lede}</p>
        <p className="s-actions"><a className="button button-signal" href="/contact?src=missed-call-text-back#contact">Get my free preview</a> <a className="text-link" href="/prices#systems">See what else can be connected</a></p>
        <p className="s-small">{starter.price} once · No working, no invoice · {VAT_NOTE}</p>
      </section>

      <section className="s-section" aria-labelledby="missed-does-title">
        <h2 id="missed-does-title">What it does.</h2>
        {job.does.map((line) => <p key={line}>{line}</p>)}
        <p>Who it suits: {job.suits}</p>
      </section>

      <section className="s-section" aria-labelledby="missed-steps-title">
        <h2 id="missed-steps-title">How it is set up.</h2>
        <ol className="s-recipes">
          {job.steps.map((step) => <li key={step.name}><strong>{step.name}</strong><span>{step.body}</span></li>)}
        </ol>
        <p className="s-small">{starter.successCheck}</p>
      </section>

      <section className="s-section" aria-labelledby="missed-options-title">
        <h2 id="missed-options-title">Text-back, or someone to answer?</h2>
        <p>A text works when callers are happy to book or reply in writing. If they would rather speak to someone, or ask questions before booking, the <a href="/after-hours-receptionist">{AFTER_HOURS.name}</a> answers calls for {AFTER_HOURS.price}. If missed calls are only one of several things you chase by hand, the <a href="/prices#systems">Business System</a> connects calls, quotes and reviews in one list.</p>
        <p>Not included: {job.notIncluded.join(' ')} Texts are sent through a service you pay directly; I give you the cost in your scope sheet before you pay me.</p>
      </section>

      <section className="s-section" aria-labelledby="missed-faq-title">
        <h2 id="missed-faq-title">Missed-call text-back questions.</h2>
        {job.faqs.map(({ q, a }) => <details className="s-fold" key={q}><summary>{q}</summary><p>{a}</p></details>)}
        <details className="s-fold"><summary>What else do I get?</summary><p>{ALWAYS_INCLUDED.slice(0, 4).map((item) => item.title).join(', ')}. Details are on the <a href="/prices">prices page</a>.</p></details>
        <p className="s-actions"><a className="button button-signal" href="/contact?src=missed-call-text-back-bottom#contact">Get my free preview</a> <a className="text-link" href="/for/trades">Examples for trades</a></p>
      </section>

      <SiteFooter />
    </main>
  );
}
