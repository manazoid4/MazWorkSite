import { OFFERS, FREE_STEP } from '../offers';
import { fitDescription } from '../seo';
import type { Metadata } from 'next';
import { SiteFooter, SiteHeader } from '../site-chrome';
import { SITE_URL, BOOKING_URL, CHECK_REPLY_TIME, MAIN_CTA } from '../site';
import { OG_IMAGE } from '../seo';
import { CallLink } from '../analytics';
import { StickyCheckCta } from '../sticky-cta';
import { SampleReport } from '../sample-report';
import { LeakCheckForm } from './leak-check-form';
import { NICHE_GUIDES } from '../for/niches';
import { NextSteps } from '../explainers';

const PAGE_URL = `${SITE_URL}/free-plan`;

export const metadata: Metadata = {
  title: { absolute: 'Free preview and fixed price | Maz Works' },
  description: fitDescription(`Tell me the job that eats your week or loses you customers. I usually reply within ${CHECK_REPLY_TIME} with a working preview with your business name on, and a fixed price from ${OFFERS[0].price}. Free, no obligation, no call needed.`),
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: `${FREE_STEP.name} — Maz Works`,
    description: fitDescription('Tell me the job you want off your plate. A working preview and fixed price, usually within 1 working day.'),
    url: PAGE_URL,
    type: 'website',
    images: [OG_IMAGE],
  },
};

const RETURN = [
  'A working preview of your first job with your business name on it, to try on your phone',
  'A fixed price and written scope sheet for setting it up on your own apps',
  'What to automate first, and why',
  'What I would leave alone, and why',
  `A fixed price, starting from ${OFFERS[0].price}, with any optional extras listed separately`,
  'Any software or text-message costs you would pay directly',
  'A date it would be live by',
];

export default function LeakCheckPage() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: `Maz Works ${FREE_STEP.name}`,
    description: fitDescription('A free working preview and fixed price for automating a job a small business does by hand.'),
    url: PAGE_URL,
    provider: { '@type': 'Organization', name: 'Maz Works', url: SITE_URL },
    areaServed: [
      { '@type': 'Country', name: 'United Kingdom' },
    ],
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'GBP' },
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, '\\u003c') }}
      />
      <SiteHeader />

      <section className="mw-resource-hero" id="main-content" tabIndex={-1} aria-labelledby="leak-check-title">
        <p className="eyebrow">{FREE_STEP.name} · {FREE_STEP.price}</p>
        <h1 id="leak-check-title">Tell me the job. I’ll send a working preview and a price.</h1>
        <p>Tell me what you keep chasing, copying or doing by hand. I’ll build a working preview with your business name on it and tell you what it costs. It’s a template on my test setup, not on your apps yet.</p>
        <div className="mw-actions">
          <a className="button button-signal" href="#leak-check-form">{MAIN_CTA}</a>
          <a className="button" href="#leak-check-return-title">See an example</a>
        </div>
        <p className="mw-hero-note">Made by me · usually sent within {CHECK_REPLY_TIME} · no call needed</p>
      </section>

      <section className="mw-qw-section" aria-labelledby="leak-check-send-title">
        <p className="eyebrow">Your free preview</p>
        <h2 id="leak-check-send-title">Tap what’s costing you.</h2>
        <p className="mw-qw-lead">A few taps is enough. Free for any UK business, in any trade.</p>
        <LeakCheckForm />
        <p className="mw-qw-lead">Prefer to talk? <CallLink href={BOOKING_URL} placement="leak-check-walkthrough">Book a free 15-minute call</CallLink>.</p>
      </section>

      <section className="mw-qw-section" aria-labelledby="leak-check-return-title">
        <p className="eyebrow">What you get back</p>
        <h2 id="leak-check-return-title">A demo you can try, and a price you can act on.</h2>
        <ul className="mw-qw-list">
          {RETURN.map((item) => <li key={item}>{item}</li>)}
        </ul>
        <h3 style={{ marginTop: 28 }}>If you say yes</h3>
        <p className="mw-qw-lead">Your demo and price usually arrive within {CHECK_REPLY_TIME}. Nothing happens unless you reply yes. Then it runs like this: demo, fixed price, set up on your apps and shown working before you pay, and care only if you want it. Days are counted from the day you approve the scope sheet:</p>
        <NextSteps />
        <div className="s-report-wrap"><SampleReport /></div>
        <p className="mw-qw-lead">Sometimes the answer is: &quot;This isn&apos;t worth automating yet.&quot; If the tool you already pay for can do it, I’ll tell you.</p>
        <p className="mw-qw-lead">Built for any business that runs on customers: {NICHE_GUIDES.map((guide, index) => (
          <span key={guide.id}>{index ? ' · ' : ''}<a href={`/for/${guide.id}`}>{guide.shortName}</a></span>
        ))}</p>
      </section>

      <SiteFooter />
      <StickyCheckCta href="#leak-check-form" hideWhenVisible="leak-check-form" />
    </main>
  );
}
