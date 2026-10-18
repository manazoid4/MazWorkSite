import type { Metadata } from 'next';
import { SiteFooter, SiteHeader } from '../site-chrome';
import { AUDIENCES, USPS, VIDEO_EDITS, VIDEO_PRICES, VIDEO_SCOPE, VIDEO_SERVICES, VIDEO_SHOOTS, formatPrice, videoQuote } from '../offers';
import { Cards, Chips, InfoSection, Steps } from '../infographic';
import { OG_IMAGE, fitDescription } from '../seo';
import { SITE_URL, WHATSAPP_DISPLAY, WHATSAPP_URL } from '../site';
import { VideoSelector } from './video-selector';

const PAGE_URL = `${SITE_URL}/video`;

const FAQS = [
  { q: 'Do you work anywhere in the UK?', a: 'Yes. I come to you. Travel is agreed before you book.' },
  { q: 'What do you film with?', a: 'Professional-grade cameras and a proper shooting setup. The result comes from planning the shots, filming them well and editing them clearly.' },
  { q: 'Does a shoot include the videos?', a: 'No. Filming and the four promotional videos are priced separately, so you only pay for what you need. Add the videos to a shoot and they are 20% off.' },
  { q: 'Can I have the raw footage?', a: 'Yes, just ask. Everything from the shoot is yours.' },
  { q: 'Who owns the photos, footage and videos?', a: 'You do. Every asset from your shoot belongs to you, and it is written into the agreement sent with your invoice.' },
  { q: 'Can I use my own footage?', a: `Yes. The four videos can be built from your own photos and clips at ${VIDEO_EDITS.price}.` },
];

export const metadata: Metadata = {
  title: { absolute: 'Promotional Video & Filming, UK-wide | Maz Works' },
  description: fitDescription(`Filming days from ${formatPrice(VIDEO_PRICES.halfDay)} and four promotional videos for ${VIDEO_EDITS.price}. UK-wide, for small businesses.`),
  alternates: { canonical: PAGE_URL },
  openGraph: { title: 'Promotional Video & Filming | Maz Works', description: VIDEO_EDITS.body, url: PAGE_URL, type: 'website', images: [OG_IMAGE] },
};

const schema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Promotional video and filming for small businesses',
  provider: { '@id': `${SITE_URL}/#maz-works` },
  areaServed: 'United Kingdom',
  url: PAGE_URL,
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Video packages',
    itemListElement: [
      ...VIDEO_SHOOTS.map(s => ({ '@type': 'Offer', name: s.name, priceCurrency: 'GBP', price: String(s.id === 'half' ? VIDEO_PRICES.halfDay : VIDEO_PRICES.fullDay) })),
      { '@type': 'Offer', name: VIDEO_EDITS.name, priceCurrency: 'GBP', price: String(VIDEO_PRICES.editBundle) },
    ],
  },
  mainEntity: { '@type': 'FAQPage', mainEntity: FAQS.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) },
};

export default function VideoPage() {
  const halfPlus = videoQuote('half', true);
  const fullPlus = videoQuote('full', true);
  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} />
      <SiteHeader />
      <section className="mw-resource-hero" id="main-content" tabIndex={-1} aria-labelledby="video-title">
        <p className="eyebrow">Video and filming · UK-wide</p>
        <h1 id="video-title">I film your business. You get promotional videos that bring in customers.</h1>
        <p>I shoot the photos and footage at your business, then edit them into promotional videos. You own every asset, in writing. Plus the website and automation to turn views into enquiries.</p>
        <div className="mw-actions">
          <a className="button button-signal" href="/contact?service=video#contact">Enquire about a shoot</a>
          <a className="button" href={WHATSAPP_URL} rel="noopener">WhatsApp {WHATSAPP_DISPLAY}</a>
        </div>
        <Chips items={['Professional-grade cameras', 'You own every asset', 'Raw footage is yours', 'UK-wide']} />
      </section>

      <InfoSection eyebrow="How it works" title="From shoot day to promo videos">
        <Steps four items={[
          { title: 'Book a shoot', body: 'Half day or full day. We plan the shots together.' },
          { title: 'I film on location', body: 'Photos and video of your premises, products and people.' },
          { title: 'I edit your videos', body: 'Four promo videos edited from the shoot photos and footage.' },
          { title: 'You post, they enquire', body: 'Your content goes live and customers get in touch.' },
        ]} />
      </InfoSection>

      <InfoSection id="packages" eyebrow="Packages" title="Pick a shoot. Add your videos.">
        <Cards items={[
          { big: VIDEO_SHOOTS[0].price, title: VIDEO_SHOOTS[0].name, body: `${VIDEO_SHOOTS[0].hours}. Premises, products, services and behind the scenes.` },
          { big: VIDEO_SHOOTS[1].price, title: VIDEO_SHOOTS[1].name, body: `${VIDEO_SHOOTS[1].hours}. Several locations or a bigger range.` },
          { big: VIDEO_EDITS.price, title: VIDEO_EDITS.name, body: `${VIDEO_EDITS.each} each. ${VIDEO_EDITS.withShoot} when booked with a shoot.`, highlight: true },
        ]} />
        <Cards two items={[
          { big: formatPrice(halfPlus.total), title: 'Half day + 4 videos', body: `Save ${formatPrice(halfPlus.saving)} on the videos.` },
          { big: formatPrice(fullPlus.total), title: 'Full day + 4 videos', body: `Save ${formatPrice(fullPlus.saving)} on the videos.` },
        ]} />
        <h3>Work out your total</h3>
        <VideoSelector />
      </InfoSection>

      <InfoSection eyebrow="Included in the videos" title="What you get">
        <Cards items={VIDEO_EDITS.included.map(title => ({ title }))} />
      </InfoSection>

      <InfoSection eyebrow="What I make" title="Video that does a job">
        <Cards items={VIDEO_SERVICES.map(s => ({ title: s.title, body: s.body }))} />
      </InfoSection>

      <InfoSection eyebrow="Made for" title="Video that fits your business">`n        <Cards items={AUDIENCES.map(a => ({ title: a.name, body: a.video }))} />`n      </InfoSection>`n`n      <InfoSection eyebrow="Why Maz Works" title="More than a camera">
        <Cards items={USPS.map(u => ({ title: u.title, body: u.body }))} />
      </InfoSection>

      <InfoSection eyebrow="Style" title="A Maz Works promo, made in-house">
        <video className="mw-video" controls preload="none" playsInline src="/assets/video/vertical.mp4" aria-label="Maz Works promotional video" />
      </InfoSection>

      <InfoSection eyebrow="Simple terms" title="No small print surprises">
        <Cards items={VIDEO_SCOPE.map(s => ({ title: s.title, body: s.body }))} />
      </InfoSection>

      <InfoSection eyebrow="Portfolio projects" title="Apply for a Portfolio Project">
        <p className="mw-note">A few places each season for independent businesses. I choose at my discretion, and applying does not mean a place is certain.</p>
        <div className="mw-actions"><a className="button" href="/contact?service=portfolio-project#contact">Apply for a Portfolio Project</a></div>
        <p className="s-small">Tell me your business type, website, what is not working and what you want from the project.</p>
      </InfoSection>

      <section className="s-section" aria-labelledby="video-faq-title">
        <p className="eyebrow">Questions</p>
        <h2 id="video-faq-title">Quick answers</h2>
        <div className="s-faq">{FAQS.map(f => <details key={f.q}><summary>{f.q}</summary><p>{f.a}</p></details>)}</div>
      </section>

      <section className="mw-resource-cta" id="video-cta" aria-labelledby="video-cta-title">
        <div>
          <p className="eyebrow">Next step</p>
          <h2 id="video-cta-title">Tell me about your business.</h2>
          <p>I will tell you honestly what is worth filming.</p>
        </div>
        <div className="mw-actions">
          <a className="button button-signal" href="/contact?service=video#contact">Send an enquiry</a>
          <a className="button" href={WHATSAPP_URL} rel="noopener">WhatsApp {WHATSAPP_DISPLAY}</a>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
