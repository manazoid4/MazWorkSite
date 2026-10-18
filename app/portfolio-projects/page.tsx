import type { Metadata } from 'next';
import { SiteFooter, SiteHeader } from '../site-chrome';
import { Cards, Chips, InfoSection, Steps } from '../infographic';
import { OG_IMAGE, fitDescription } from '../seo';
import { SITE_URL } from '../site';

const PAGE_URL = `${SITE_URL}/portfolio-projects`;
const APPLY = '/contact?service=portfolio-project#contact';
/** Places per month. Change here only; Maz's call. */
const PLACES_PER_MONTH = 3;

export const metadata: Metadata = {
  title: { absolute: 'Free Portfolio Projects for UK Businesses | Maz Works' },
  description: fitDescription('A few independent UK businesses each month get a free half-day shoot and two promo videos. Apply in two minutes.'),
  alternates: { canonical: PAGE_URL },
  openGraph: { title: 'Free Portfolio Projects | Maz Works', description: 'Apply for a free half-day shoot and two promo videos.', url: PAGE_URL, type: 'website', images: [OG_IMAGE] },
};

export default function PortfolioProjects() {
  return (
    <main>
      <SiteHeader />
      <section className="mw-resource-hero" id="main-content" tabIndex={-1} aria-labelledby="pp-title">
        <p className="eyebrow">{PLACES_PER_MONTH} places a month · UK-wide</p>
        <h1 id="pp-title">Get a free half-day shoot and two promo videos.</h1>
        <p>I pick a few independent businesses each month to film. You get the content free. I get to show the work.</p>
        <div className="mw-actions"><a className="button button-signal" href={APPLY}>Apply in two minutes</a></div>
        <Chips items={['No cost to you', 'You own every asset', 'Chosen by me', 'UK-wide']} />
      </section>

      <InfoSection eyebrow="What you get" title="Free, and properly done">
        <Cards items={[
          { title: 'Half-day shoot', body: 'Up to 5 hours on location with professional-grade cameras.' },
          { title: 'Two promo videos', body: 'Edited from your shoot photos and footage, ready to post.' },
          { title: 'You own it all', body: 'Every asset is yours, in writing. Raw footage on request.' },
        ]} />
      </InfoSection>

      <InfoSection eyebrow="In return" title="What I ask">
        <Cards items={[
          { title: 'Let me show the work', body: 'I can share the videos in my portfolio and on LinkedIn.' },
          { title: 'A short review', body: 'A few honest words once you have seen the videos.' },
          { title: 'Be easy to work with', body: 'Show up, tell me what matters and approve quickly.' },
        ]} />
      </InfoSection>

      <InfoSection eyebrow="How it works" title="Apply, get chosen, get filmed">
        <Steps four items={[
          { title: 'Apply', body: 'Business type, website, what is not working, what you want.' },
          { title: 'I choose', body: 'I pick the best fits. Not everyone is chosen, and I reply either way.' },
          { title: 'We film', body: 'We plan the shots and I come to you.' },
          { title: 'You get your videos', body: 'Two promo videos, edited and yours to use.' },
        ]} />
        <p className="mw-note">Places are limited and chosen at my discretion. Applying does not mean you will be chosen.</p>
      </InfoSection>

      <section className="mw-resource-cta" aria-labelledby="pp-cta-title">
        <div>
          <p className="eyebrow">Next step</p>
          <h2 id="pp-cta-title">Tell me about your business.</h2>
          <p>It takes two minutes.</p>
        </div>
        <div className="mw-actions">
          <a className="button button-signal" href={APPLY}>Apply for a Portfolio Project</a>
          <a className="button" href="/video">See paid video packages</a>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
