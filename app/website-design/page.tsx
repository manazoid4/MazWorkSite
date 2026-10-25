import type { Metadata } from 'next';
import { SiteFooter, SiteHeader } from '../site-chrome';
import { CREATOR_OFFERS, WEB_OFFERS } from '../offers';
import { OG_IMAGE } from '../seo';
import { SITE_URL } from '../site';

const PAGE_URL = SITE_URL + '/website-design';
const launch = CREATOR_OFFERS[1];
const website = WEB_OFFERS[0];

export const metadata: Metadata = {
  title: { absolute: 'Website Design in Derbyshire & Nottingham | Maz Works' },
  description: 'Small business website design in Derbyshire and Nottingham. Clear, mobile-friendly pages, enquiries and bookings, a free preview and a fixed quote.',
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: 'Website Design in Derbyshire & Nottingham | Maz Works',
    description: 'Practical websites for local businesses, with enquiry or booking routes that work. See packages, real work and how to get a free preview.',
    url: PAGE_URL,
    type: 'website',
    images: [OG_IMAGE],
  },
};

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Website design for small businesses',
  serviceType: 'Small business website design',
  provider: { '@id': SITE_URL + '/#maz-works' },
  areaServed: [
    { '@type': 'AdministrativeArea', name: 'Derbyshire' },
    { '@type': 'City', name: 'Nottingham' },
  ],
  url: PAGE_URL,
  offers: [
    { '@type': 'Offer', name: launch.name, price: launch.from, priceCurrency: 'GBP', url: SITE_URL + '/prices#websites' },
    { '@type': 'Offer', name: website.name, priceSpecification: { '@type': 'PriceSpecification', minPrice: website.from, priceCurrency: 'GBP' }, url: SITE_URL + '/prices#websites' },
  ],
};

const questions = [
  {
    question: 'Do you work with businesses outside Derbyshire and Nottingham?',
    answer: 'Yes. Most website work can be done remotely, so I can help businesses elsewhere in the UK too.',
  },
  {
    question: 'Can you improve my existing website instead?',
    answer: 'Yes. Tell me what is not working and I will check whether improving the current site makes more sense than rebuilding it.',
  },
  {
    question: 'Will my new website be number one on Google?',
    answer: 'Nobody can guarantee a position in Google. I include basic search set-up in the website package and explain what ongoing SEO would involve separately.',
  },
  {
    question: 'Who owns the finished site?',
    answer: 'The agreed build and accounts are in your name. Any ongoing domain, hosting or app fees are explained before you commit.',
  },
];

export default function WebsiteDesignPage() {
  return (
    <main className="s-home">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema).replace(/</g, '\\u003c') }} />
      <SiteHeader />

      <section className="s-hero s-hero-short" id="main-content" tabIndex={-1} aria-labelledby="web-title">
        <p className="eyebrow">Website design · Derbyshire and Nottingham</p>
        <h1 id="web-title">Website design for small businesses in Derbyshire and Nottingham.</h1>
        <p className="s-lede">A website should make it easy for someone to find you, understand what you offer and get in touch. I design clear, phone-friendly sites and connect the next step: an enquiry, booking or sale.</p>
        <p className="s-actions"><a className="button button-signal" href="/contact?src=website-design#contact">Get my free preview</a> <a className="text-link" href="/proof">See work and examples</a></p>
        <p className="s-small">One person to deal with · A written scope and fixed quote before any paid work · No VAT added</p>
      </section>

      <section className="s-section" aria-labelledby="website-problems-title">
        <h2 id="website-problems-title">What your customers need from your website.</h2>
        <p>For a café in Nottingham, a visitor might want the menu, opening hours and a booking link. For a Derbyshire trades business, they may need to see the work you do and request a quote quickly. The right website starts with that customer journey, not a long list of features.</p>
        <ul className="s-recipes">
          <li><strong>Easy to use on a phone</strong><span>Clear services, readable information and a simple next step without pinching and zooming.</span></li>
          <li><strong>Enquiries that reach you</strong><span>Contact forms, booking links or quote requests set up around how your business actually responds.</span></li>
          <li><strong>Information people can trust</strong><span>Accurate opening hours, services, pricing where appropriate, and genuine examples of your work.</span></li>
          <li><strong>A foundation for Google Search</strong><span>Descriptive page titles, sensible page structure and basic search set-up. Rankings cannot be guaranteed.</span></li>
        </ul>
      </section>

      <section className="s-section" aria-labelledby="website-prices-title">
        <h2 id="website-prices-title">Choose a page or a fuller website.</h2>
        <p>You do not need a five-page build if one focused page will do the job. I will recommend the smaller option when it fits.</p>
        <ul className="s-recipes">
          <li>
            <strong>{launch.name} · {launch.price}</strong>
            <span>A focused page for enquiries, bookings or sales. A good starting point for one service, offer or launch.</span>
            <span><a href="/prices#websites">See exactly what the Launch Page includes</a></span>
          </li>
          <li>
            <strong>{website.name} · {website.price}</strong>
            <span>Up to five pages, mobile-first content and an enquiry or booking flow with an instant reply. Useful if you have several services or customer groups.</span>
            <span><a href="/prices#websites">See the Website package and exclusions</a></span>
          </li>
        </ul>
        <p className="s-small">Hosting, domain fees and third-party app charges are separate when applicable. The quote explains what is included before work begins.</p>
      </section>

      <section className="s-section" aria-labelledby="web-local-title">
        <h2 id="web-local-title">Built for local businesses, not a generic template pitch.</h2>
        <p>I work with the needs of small businesses across Derbyshire and Nottingham: trades, garages, salons, dog groomers, cafés and other independent teams. The starting point is the actual task a customer wants to complete.</p>
        <p>Browse <a href="/for">examples by industry</a>, <a href="/local-businesses">other ways to make enquiries easier</a>, or <a href="/proof">work and demos with their limitations clearly labelled</a>. I also work remotely with businesses elsewhere in the UK.</p>
      </section>

      <section className="s-section" aria-labelledby="web-process-title">
        <h2 id="web-process-title">How a website project starts.</h2>
        <ol className="s-recipes">
          <li><strong>Tell me what the site needs to do</strong><span>Your business, the customers you want to reach and what is frustrating about the current setup.</span></li>
          <li><strong>See a free preview</strong><span>I show you a working example on my own test setup, with no access to your live accounts.</span></li>
          <li><strong>Agree the scope and cost</strong><span>You receive a written fixed quote, what is included and what happens after launch.</span></li>
        </ol>
      </section>

      <section className="s-section" aria-labelledby="web-faq-title">
        <h2 id="web-faq-title">Website design questions.</h2>
        {questions.map(({ question, answer }) => <details className="s-fold" key={question}><summary>{question}</summary><p>{answer}</p></details>)}
        <p className="s-actions"><a className="button button-signal" href="/contact?src=website-design-bottom#contact">Get my free preview</a> <a className="text-link" href="/prices#websites">Compare the packages</a></p>
      </section>

      <SiteFooter />
    </main>
  );
}
