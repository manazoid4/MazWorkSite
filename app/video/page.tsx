import type { Metadata } from 'next';
import { SiteFooter, SiteHeader } from '../site-chrome';
import { VIDEO_EDITS, VIDEO_PRICES, VIDEO_SCOPE, VIDEO_SERVICES, VIDEO_SHOOTS, formatPrice, videoQuote } from '../offers';
import { OG_IMAGE, fitDescription } from '../seo';
import { SITE_URL, WHATSAPP_DISPLAY, WHATSAPP_URL } from '../site';
import { VideoSelector } from './video-selector';

const PAGE_URL = `${SITE_URL}/video`;

const COMBOS = [
  { name: 'Half-day shoot + 4 edits', total: videoQuote('half', true).total },
  { name: 'Full-day shoot + 4 edits', total: videoQuote('full', true).total },
];

const FAQS = [
  { q: 'Do you work anywhere in the UK?', a: 'Yes. Shoots are UK-wide. Travel outside an agreed area is quoted before you book, so there are no surprises.' },
  { q: 'What do you film with?', a: 'Professional-grade cameras with a proper shooting setup. The result comes from planning the shots, filming them well and editing them clearly.' },
  { q: 'Does a shoot include edited videos?', a: 'No. Filming and editing are separate so you only pay for what you need. Add the four-video edit bundle and it is 20% off when booked with a shoot.' },
  { q: 'How long are the videos and how many changes can I ask for?', a: 'Short: 15 to 45 seconds by default. Each video includes one revision round. More complex requests are quoted separately.' },
  { q: 'Can I have the raw footage?', a: 'Not by default. Ask when you enquire and we agree it in writing before the shoot.' },
  { q: 'Can I use my own footage?', a: 'Yes. The four-video edit bundle works with footage you already have, at the full ' + VIDEO_EDITS.price + ' rate.' },
  { q: 'Why are the prices so low?', a: 'These are introductory prices while I build the video side of Maz Works. They may rise once the portfolio is established.' },
];

export const metadata: Metadata = {
  title: { absolute: 'Promotional Video & Filming, UK-wide | Maz Works' },
  description: fitDescription(`Promotional videos, Reels and on-location filming for small businesses across the UK. Half-day shoots from ${formatPrice(VIDEO_PRICES.halfDay)}, four edited videos ${VIDEO_EDITS.price}.`),
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
      ...VIDEO_SHOOTS.map(s => ({ '@type': 'Offer', name: s.name, priceCurrency: 'GBP', price: s.price.replace(/[^0-9]/g, '') })),
      { '@type': 'Offer', name: VIDEO_EDITS.name, priceCurrency: 'GBP', price: VIDEO_EDITS.price.replace(/[^0-9]/g, '') },
    ],
  },
};

export default function VideoPage() {
  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} />
      <SiteHeader />
      <section className="mw-resource-hero" id="main-content" tabIndex={-1} aria-labelledby="video-title">
        <p className="eyebrow">Video and filming · UK-wide</p>
        <h1 id="video-title">Promotional videos that make your business look as good as it is.</h1>
        <p>I come to your business, film it, and edit the footage into short videos for social media, your website and adverts. I also build websites and automation, so your video, website and enquiries work together.</p>
        <div className="mw-actions">
          <a className="button button-signal" href="#packages">Choose a package</a>
          <a className="button" href={WHATSAPP_URL} rel="noopener">WhatsApp {WHATSAPP_DISPLAY}</a>
        </div>
        <p className="mw-hero-note">Introductory prices while I build my video portfolio. Filming and editing are priced separately.</p>
      </section>

      <section className="mw-qw-section" aria-labelledby="video-what-title">
        <p className="eyebrow">What I make</p>
        <h2 id="video-what-title">Six ways video can help.</h2>
        <ul className="mw-qw-list">{VIDEO_SERVICES.map(s => <li key={s.title}><strong>{s.title}</strong> {s.body}</li>)}</ul>
      </section>

      <section className="mw-qw-section" id="packages" aria-labelledby="video-packages-title">
        <p className="eyebrow">Filming packages</p>
        <h2 id="video-packages-title">Pick a shoot. Add edits if you want them.</h2>
        <ul className="mw-qw-list">
          {VIDEO_SHOOTS.map(s => (
            <li key={s.id}><strong>{s.name} · {s.price}</strong> {s.hours}. {s.body}</li>
          ))}
          <li><strong>{VIDEO_EDITS.name} · {VIDEO_EDITS.price}</strong> {VIDEO_EDITS.body} That is {VIDEO_EDITS.each} per video.</li>
        </ul>
        <ul className="mw-qw-list">{VIDEO_EDITS.included.map(i => <li key={i}>{i}</li>)}</ul>
        <p className="mw-qw-lead">Book the edits with any shoot and they drop to {VIDEO_EDITS.withShoot}, saving {VIDEO_EDITS.saving}. The filming fee is never discounted.</p>
        <ul className="mw-qw-list">{COMBOS.map(c => <li key={c.name}><strong>{c.name}</strong> {formatPrice(c.total)}</li>)}</ul>
        <h3>Work out your total</h3>
        <VideoSelector />
      </section>

      <section className="mw-qw-section" aria-labelledby="video-samples-title">
        <p className="eyebrow">Sample work</p>
        <h2 id="video-samples-title">Real examples are coming.</h2>
        <p className="mw-qw-lead">I am building my video portfolio now. I will not show made-up clients or stock footage as my own, so real projects will appear here as they are finished. If you would like to see what I have so far, ask and I will send it.</p>
      </section>

      <section className="mw-qw-section" aria-labelledby="video-scope-title">
        <p className="eyebrow">Said plainly</p>
        <h2 id="video-scope-title">What is and is not included.</h2>
        <ul className="mw-qw-list">{VIDEO_SCOPE.map(i => <li key={i}>{i}</li>)}</ul>
      </section>

      <section className="mw-qw-section" aria-labelledby="video-portfolio-title">
        <p className="eyebrow">Portfolio projects</p>
        <h2 id="video-portfolio-title">Apply for a Portfolio Project.</h2>
        <p className="mw-qw-lead">Now and then I pick an independent business for an introductory project. Places are limited and I choose at my discretion. Applying does not mean you will be chosen or get free work. The paid packages above are the normal way to work with me.</p>
        <div className="mw-actions"><a className="button" href="/contact?service=portfolio-project#contact">Apply for a Portfolio Project</a></div>
        <p className="s-small">In your message, tell me your type of business, your website (if you have one), what is not working and what you want from the project.</p>
      </section>

      <section className="s-section" aria-labelledby="video-faq-title">
        <p className="eyebrow">Questions</p>
        <h2 id="video-faq-title">What owners ask about video.</h2>
        <div className="s-faq">{FAQS.map(f => <details key={f.q}><summary>{f.q}</summary><p>{f.a}</p></details>)}</div>
        <p className="s-small">More in the <a href="/privacy">privacy notice</a> and <a href="/terms">terms of work</a>.</p>
      </section>

      <section className="mw-resource-cta" id="video-cta" aria-labelledby="video-cta-title">
        <div>
          <p className="eyebrow">Next step</p>
          <h2 id="video-cta-title">Tell me about your business and what you want to show.</h2>
          <p>I will tell you honestly whether a shoot, edits or something else is right for you.</p>
        </div>
        <div className="mw-actions">
          <a className="button button-signal" href="/contact?service=video#contact">Send an enquiry</a>
          <a className="button" href={WHATSAPP_URL} rel="noopener">WhatsApp {WHATSAPP_DISPLAY}</a>
          <a className="button" href="/prices">See all prices</a>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
