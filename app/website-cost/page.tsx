import type { Metadata } from 'next';
import { Breadcrumbs } from '../breadcrumbs';
import { SiteFooter, SiteHeader } from '../site-chrome';
import { CARE_PLANS, CREATOR_OFFERS, EXTRAS, OFFERS, WEB_OFFERS } from '../offers';
import { OG_IMAGE } from '../seo';
import { SITE_URL, VAT_NOTE } from '../site';

const PAGE_URL = SITE_URL + '/website-cost';
const launch = CREATOR_OFFERS[1];
const website = WEB_OFFERS[0];
const business = OFFERS[1];
const extraPage = EXTRAS.find((extra) => /extra website page/i.test(extra.name));
const TITLE = 'How Much Does a Small Business Website Cost? | Maz Works';
const DESCRIPTION = `What drives the price of a small business website, and what I charge: one page ${launch.price}, five pages ${website.price.toLowerCase()}. No VAT added.`;

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: PAGE_URL, type: 'article', images: [OG_IMAGE] },
};

const questions = [
  {
    question: 'Is a website a one-off cost or a monthly cost?',
    answer: 'My builds are one-off, with no monthly fee. You will still pay the companies that provide your domain name, hosting or booking app directly, and I tell you those amounts before you commit. Optional care plans are month to month.',
  },
  {
    question: 'Do your prices include VAT?',
    answer: VAT_NOTE,
  },
  {
    question: 'Why is a quote better than a price list?',
    answer: 'Two businesses can both want "a website" and need very different things: one page or five, a booking link or a shop, written copy or existing text. The free preview and fixed quote show the exact scope and price before any paid work starts.',
  },
  {
    question: 'Can I pay in stages?',
    answer: 'Smaller jobs are one invoice after you have seen the work running and before it goes live. Larger builds, such as the Website, are billed in two stages that you sign off.',
  },
];

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: TITLE,
  url: PAGE_URL,
  about: { '@type': 'Service', name: 'Small business website design', provider: { '@id': SITE_URL + '/#maz-works' } },
};

export default function WebsiteCostPage() {
  return (
    <main className="s-home">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema).replace(/</g, '\\u003c') }} />
      <SiteHeader />
      <Breadcrumbs items={[{ href: '/website-design', label: 'Website design' }, { label: 'Website cost' }]} />

      <section className="s-hero s-hero-short" id="main-content" tabIndex={-1} aria-labelledby="cost-title">
        <p className="eyebrow">Plain-English pricing</p>
        <h1 id="cost-title">How much does a small business website cost?</h1>
        <p className="s-lede">It depends on how many pages you need and what the site has to do. Here is what changes the price, and what I charge for each size, so you can budget before you talk to anyone.</p>
        <p className="s-actions"><a className="button button-signal" href="/contact?src=website-cost#contact">Get my free preview</a> <a className="text-link" href="/prices#websites">Full price list</a></p>
        <p className="s-small">{VAT_NOTE}</p>
      </section>

      <section className="s-section" aria-labelledby="cost-mine-title">
        <h2 id="cost-mine-title">What I charge.</h2>
        <ul className="s-recipes">
          <li>
            <strong>{launch.name} · {launch.price}</strong>
            <span>One focused page that takes enquiries, bookings or sales. Read more on the <a href="/one-page-website">one-page website</a> page.</span>
          </li>
          <li>
            <strong>{website.name} · {website.price}</strong>
            <span>A Launch Page plus four more pages, with enquiries connected to one list and an instant reply. See <a href="/website-design">website design</a>.</span>
          </li>
          <li>
            <strong>{business.name} · {business.price}</strong>
            <span>For when the website is one part of a bigger job: three connected tasks and a weekly report.</span>
          </li>
        </ul>
        {extraPage ? <p className="s-small">Need one more page later? {extraPage.name} is {extraPage.price}.</p> : null}
      </section>

      <section className="s-section" aria-labelledby="cost-drivers-title">
        <h2 id="cost-drivers-title">What moves the price of any website.</h2>
        <ul className="s-recipes">
          <li><strong>Number of pages</strong><span>Each page needs planning, writing and testing. Many small businesses can start with one.</span></li>
          <li><strong>Who writes the words and supplies the photos</strong><span>If you already have clear text and good images, there is less to produce. My packages include writing the copy with you.</span></li>
          <li><strong>What visitors need to do</strong><span>Reading about you is simple. Booking, paying or being sent an instant reply means connecting accounts and testing them.</span></li>
          <li><strong>Shop, member area or logins</strong><span>Anything where customers sign in or buy many products is a software job, not a page, and is quoted separately.</span></li>
          <li><strong>Ongoing costs that are not mine</strong><span>Domain names, hosting and booking or texting apps are paid to those providers directly. Ask every supplier for these figures up front.</span></li>
        </ul>
      </section>

      <section className="s-section" aria-labelledby="cost-after-title">
        <h2 id="cost-after-title">After the site goes live.</h2>
        <p>Every package includes 30 days of tweaks and a 90-day fix promise. If you want regular updates or monitoring after that, optional care plans are {CARE_PLANS.map((plan) => plan.price).join(' and ')} (see the <a href="/prices#care">prices page</a> for what each covers). Search visibility takes time and cannot be guaranteed; I include basic search set-up and quote ongoing search work separately.</p>
      </section>

      <section className="s-section" aria-labelledby="cost-faq-title">
        <h2 id="cost-faq-title">Website cost questions.</h2>
        {questions.map(({ question, answer }) => <details className="s-fold" key={question}><summary>{question}</summary><p>{answer}</p></details>)}
        <p className="s-actions"><a className="button button-signal" href="/contact?src=website-cost-bottom#contact">Get my free preview</a> <a className="text-link" href="/proof">See my work</a></p>
      </section>

      <SiteFooter />
    </main>
  );
}
