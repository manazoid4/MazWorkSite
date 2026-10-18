import type { Metadata } from 'next';
import { SiteFooter, SiteHeader } from '../site-chrome';
import { MANAGED_PRESENCE, USPS } from '../offers';
import { Cards, InfoSection, Steps } from '../infographic';
import { OG_IMAGE, fitDescription } from '../seo';
import { SITE_URL } from '../site';

const PAGE_URL = `${SITE_URL}${MANAGED_PRESENCE.href}`;
const ENQUIRY_URL = '/contact?service=managed-presence#contact';

export const metadata: Metadata = {
  title: { absolute: 'Managed website, Google and social | Maz Works' },
  description: fitDescription(`I run your website updates, Google listing and social posts for you. ${MANAGED_PRESENCE.price}, set-up included.`),
  alternates: { canonical: PAGE_URL },
  openGraph: { title: 'Managed presence | Maz Works', description: MANAGED_PRESENCE.body, url: PAGE_URL, type: 'website', images: [OG_IMAGE] },
};

export default function ManagedPresencePage() {
  return (
    <main>
      <SiteHeader />
      <section className="mw-resource-hero" id="main-content" tabIndex={-1} aria-labelledby="managed-title">
        <p className="eyebrow">Monthly service</p>
        <h1 id="managed-title">I run your online presence. You run your business.</h1>
        <p>Website, Google listing and social posts, kept fresh every month. Send me what you have; I do the rest.</p>
        <p className="s-price-amount">{MANAGED_PRESENCE.price}</p>
        <div className="mw-actions"><a className="button button-signal" href={ENQUIRY_URL}>Ask about managed presence</a></div>
        <p className="mw-hero-note">Set-up included · month to month · you keep your accounts</p>
      </section>

      <InfoSection eyebrow="Every month" title="What I take off your plate">
        <Cards items={[
          { title: 'Website', body: 'A fresh project story or update.' },
          { title: 'Google listing', body: 'Two updates, so you show up and stay current.' },
          { title: 'Social', body: 'Up to eight posts on one channel of your choice.' },
        ]} />
      </InfoSection>

      <InfoSection eyebrow="How it works" title="Three steps. One of them is yours.">
        <Steps items={[
          { title: 'You send', body: 'Photos, clips, job notes. Whatever you already have.' },
          { title: 'I write and schedule', body: 'Captions, selection and scheduling, all done for you.' },
          { title: 'You approve', body: 'One quick look before anything goes live. Then back to work.' },
        ]} />
        <p className="mw-note">Go on, get on with the actual work. Someone has to be good at it, and it is you. The posting is my job.</p>
      </InfoSection>

      <InfoSection eyebrow="Why Maz Works" title="What you get with me">
        <Cards items={USPS.slice(0, 3).map(u => ({ title: u.title, body: u.body }))} />
      </InfoSection>

      <InfoSection eyebrow="Good to know" title="Not included">
        <Cards two items={[
          { title: 'Filming on site', body: 'Quoted separately. See the video packages.' },
          { title: 'Ads, inbox replies, promised results', body: 'No daily inbox cover, no paid ads, no promised leads or rankings.' },
        ]} />
        <div className="mw-actions"><a className="button button-signal" href={ENQUIRY_URL}>Ask about managed presence</a><a className="text-link" href="/video">See video and filming →</a></div>
      </InfoSection>
      <SiteFooter />
    </main>
  );
}
