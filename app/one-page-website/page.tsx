import type { Metadata } from 'next';
import { Breadcrumbs } from '../breadcrumbs';
import { SiteFooter, SiteHeader } from '../site-chrome';
import { ALWAYS_INCLUDED, CREATOR_OFFERS, WEB_OFFERS } from '../offers';
import { OG_IMAGE } from '../seo';
import { SITE_URL, VAT_NOTE } from '../site';

const PAGE_URL = SITE_URL + '/one-page-website';
const launch = CREATOR_OFFERS[1];
const website = WEB_OFFERS[0];
const TITLE = `One-Page Website for Small Businesses, ${launch.price} | Maz Works`;
const DESCRIPTION = `A single clear page that takes bookings, sales or enquiries, ${launch.price} with a free preview first. Written with you, built for phones, on accounts you own.`;

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: PAGE_URL, type: 'website', images: [OG_IMAGE] },
};

const questions = [
  {
    question: 'Is one page enough for my business?',
    answer: 'Often, yes. If you sell one service, one offer or one kind of appointment, a single focused page can do the whole job: say what you do, show proof, and make the next step obvious. If you have several distinct services or areas, a five-page Website fits better, and the Launch Page price comes off it if you upgrade within 60 days.',
  },
  {
    question: 'Will a one-page website show up on Google?',
    answer: 'It can appear for searches that match what the page says, but nobody can promise a position. The page gets a clear title, headings and basic search set-up. Ongoing search work, such as regular new content, is separate and I quote it on its own.',
  },
  {
    question: 'What do I need to give you?',
    answer: 'About 45 minutes on a call to talk through what you offer, plus any photos, prices and details you already have. I write the page with you, so you do not need finished copy.',
  },
  {
    question: 'Who owns the page and the domain?',
    answer: 'You do. The page, domain and payment or booking accounts are in your name. Domain and any app fees are paid by you directly to the provider, and I tell you the cost before you commit.',
  },
  {
    question: 'How long does it take?',
    answer: launch.delivery,
  },
  {
    question: 'What if it is not what I wanted?',
    answer: 'You see a free preview and a fixed written quote before any paid work. After launch you get two rounds of changes plus 30 days of tweaks, and anything I built that is not working as agreed is fixed free for 90 days.',
  },
];

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'One-page website for small businesses',
  serviceType: 'Single page website design',
  provider: { '@id': SITE_URL + '/#maz-works' },
  areaServed: { '@type': 'Country', name: 'United Kingdom' },
  url: PAGE_URL,
  offers: { '@type': 'Offer', name: launch.name, price: launch.from, priceCurrency: 'GBP', url: PAGE_URL },
};

export default function OnePageWebsitePage() {
  return (
    <main className="s-home">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema).replace(/</g, '\\u003c') }} />
      <SiteHeader />
      <Breadcrumbs items={[{ href: '/prices', label: 'Prices' }, { label: 'One-page website' }]} />

      <section className="s-hero s-hero-short" id="main-content" tabIndex={-1} aria-labelledby="one-page-title">
        <p className="eyebrow">Launch Page · {launch.price}</p>
        <h1 id="one-page-title">A one-page website for your small business, {launch.price}.</h1>
        <p className="s-lede">{launch.body}</p>
        <p className="s-actions"><a className="button button-signal" href="/contact?src=one-page-website#contact">Get my free preview</a> <a className="text-link" href="/prices#websites">See the full price list</a></p>
        <p className="s-small">Free preview and fixed written quote before any paid work · {VAT_NOTE}</p>
      </section>

      <section className="s-section" aria-labelledby="one-page-fit-title">
        <h2 id="one-page-fit-title">When one page is the right size.</h2>
        <p>Many small businesses do not need a ten-page site. They need one place that answers three questions quickly: what do you do, can I trust you, and how do I get in touch or book?</p>
        <ul className="s-recipes">
          <li><strong>One main service</strong><span>A dog groomer, a driving instructor or a local cleaner can explain the whole offer on one scrolling page.</span></li>
          <li><strong>A launch or a single offer</strong><span>A new class, a seasonal service or a product drop needs a dedicated page, not a rebuild of everything.</span></li>
          <li><strong>A first website</strong><span>If you only have social media or a listing today, one good page is a low-cost first step that you can grow from.</span></li>
        </ul>
        <p>If you need separate pages for several services or areas, look at a <a href="/prices#pricing">full website</a> instead.</p>
      </section>

      <section className="s-section" aria-labelledby="one-page-includes-title">
        <h2 id="one-page-includes-title">What the {launch.price} Launch Page includes.</h2>
        <ul className="s-recipes">
          {launch.includes.filter((item) => !item.startsWith('Everything in')).map((item) => <li key={item}><span>{item}</span></li>)}
        </ul>
        <h3>Not included</h3>
        <ul className="s-recipes">
          {launch.excludes.map((item) => <li key={item}><span>{item}</span></li>)}
        </ul>
        <p className="s-small">The full scope, including what every package comes with, is on the <a href="/prices#websites">prices page</a>. Compare with the {website.name} ({website.price}), which is a Launch Page plus four more pages.</p>
      </section>

      <section className="s-section" aria-labelledby="one-page-promise-title">
        <h2 id="one-page-promise-title">What you can rely on.</h2>
        <ul className="s-recipes">
          {ALWAYS_INCLUDED.slice(0, 4).map(({ title, body }) => <li key={title}><strong>{title}</strong><span>{body}</span></li>)}
        </ul>
        <p>Want to see the quality first? Browse <a href="/proof">live work and demos</a>, or see <a href="/for">examples by type of business</a>.</p>
      </section>

      <section className="s-section" aria-labelledby="one-page-faq-title">
        <h2 id="one-page-faq-title">One-page website questions.</h2>
        {questions.map(({ question, answer }) => <details className="s-fold" key={question}><summary>{question}</summary><p>{answer}</p></details>)}
        <p className="s-actions"><a className="button button-signal" href="/contact?src=one-page-website-bottom#contact">Get my free preview</a> <a className="text-link" href="/website-cost">How website costs are worked out</a></p>
      </section>

      <SiteFooter />
    </main>
  );
}
