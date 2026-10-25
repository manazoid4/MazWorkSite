import type { Metadata } from 'next';
import { SiteFooter, SiteHeader } from '../site-chrome';
import { AFTER_HOURS, AUDIENCES, CREATOR_OFFERS, MANAGED_PRESENCE, OFFERS, REFERRAL_RANGE, VIDEO_EDITS, VIDEO_PRICES, VIDEO_SCOPE, VIDEO_SERVICES, VIDEO_SHOOTS, formatPrice, getOffer, videoQuote } from '../offers';
import { fitDescription, OG_IMAGE } from '../seo';
import { MAIN_CTA, SITE_URL, WHATSAPP_DISPLAY, WHATSAPP_URL } from '../site';
import { VideoSelector } from './video-selector';
import { MissedCallsCalculator } from './missed-calls-calculator';
import './local-businesses.css';

const starter = OFFERS[0];
const system = OFFERS[1];
const custom = OFFERS[2];
const launch = CREATOR_OFFERS[1];
const website = getOffer('website');
const PAGE_URL = `${SITE_URL}/local-businesses`;

export const metadata: Metadata = {
  title: 'Less chasing for local businesses',
  description: fitDescription(`Missed calls, quiet quotes, bookings that need chasing? I set up the follow-up on the tools you already use. Also video and filming from ${formatPrice(VIDEO_PRICES.halfDay)}.`),
  alternates: { canonical: '/local-businesses' },
  openGraph: { title: 'Less chasing for local businesses | Maz Works', description: fitDescription('Missed calls, quotes, bookings, video and managed presence for local businesses.'), url: PAGE_URL, type: 'website', images: [OG_IMAGE] },
};

const industries = [
  { href: '/for/trades', label: 'Trades', text: 'Calls, quotes and job updates' },
  { href: '/for/appointments', label: 'Appointment businesses', text: 'Bookings, reminders and rebooking' },
  { href: '/for/garages', label: 'Garages', text: 'Enquiries, booked-in jobs and reviews' },
  { href: '/for/cafes-and-food', label: 'Food businesses', text: 'Orders, enquiries and repeat visits' },
];

const VIDEO_FAQS = [
  { q: 'Do you work anywhere in the UK?', a: 'Yes. I come to you. Travel is agreed before you book.' },
  { q: 'What do you film with?', a: 'Professional-grade cameras and a proper shooting setup. The result comes from planning the shots, filming them well and editing them clearly.' },
  { q: 'Does a shoot include the videos?', a: `No. Filming and the four promotional videos are priced separately, so you only pay for what you need. Add the videos to a shoot and they are ${VIDEO_PRICES.bundleDiscountPercent}% off.` },
  { q: 'Can I have the raw footage?', a: 'Yes, just ask. Everything from the shoot is yours.' },
  { q: 'Who owns the photos, footage and videos?', a: 'You do. Every asset from your shoot belongs to you, and it is written into the agreement sent with your invoice.' },
  { q: 'Can I use my own footage?', a: `Yes. The four videos can be built from your own photos and clips at ${VIDEO_EDITS.price}.` },
];

const videoSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Promotional video and filming for small businesses',
  provider: { '@id': `${SITE_URL}/#maz-works` },
  areaServed: 'United Kingdom',
  url: `${PAGE_URL}#video`,
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Video packages',
    itemListElement: [
      ...VIDEO_SHOOTS.map((s) => ({ '@type': 'Offer', name: s.name, priceCurrency: 'GBP', price: String(s.id === 'half' ? VIDEO_PRICES.halfDay : VIDEO_PRICES.fullDay) })),
      { '@type': 'Offer', name: VIDEO_EDITS.name, priceCurrency: 'GBP', price: String(VIDEO_PRICES.editBundle) },
    ],
  },
  mainEntity: { '@type': 'FAQPage', mainEntity: VIDEO_FAQS.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) },
};

export default function LocalBusinessesPage() {
  const halfPlus = videoQuote('half', true);
  const fullPlus = videoQuote('full', true);
  return (
    <main className="s-home lb-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(videoSchema).replace(/</g, '\\u003c') }} />
      <SiteHeader />

      <section className="lb-hero" id="main-content" tabIndex={-1} aria-labelledby="lb-title">
        <div className="lb-hero-copy">
          <p className="eyebrow">For local businesses</p>
          <h1 id="lb-title">You’re serving customers. The admin can wait.</h1>
          <p className="lb-lede">A missed call, a quote nobody chased or a booking to confirm can cost you the next job. I set up the follow-up on the tools you already use, so it happens without you remembering.</p>
          <a className="button button-signal lb-primary" href="/contact?src=local-businesses">{MAIN_CTA}</a>
          <p className="lb-note">One person to deal with. A written scope and fixed price before any paid work.</p>
        </div>
        <aside className="lb-example" aria-label="Illustrative example of a connected customer enquiry">
          <p className="lb-example-label">A simple example · illustrative</p>
          <div className="lb-flow">
            <span>Customer calls while you’re busy</span><b aria-hidden="true">↓</b>
            <span>They get a useful next step</span><b aria-hidden="true">↓</b>
            <span>You pick up the conversation when free</span>
          </div>
          <p className="lb-example-foot">What can be connected depends on the tools you already use. We check that first.</p>
        </aside>
      </section>

      <nav className="lb-jump" aria-label="On this page">
        <a href="#serve-customers">Everyday jobs</a>
        <a href="#ways-to-start">Prices</a>
        <a href="#find-customers">Website and Google</a>
        <a href="#video">Video and filming</a>
        <a href="#managed-presence">Managed presence</a>
        <a href="#missed-calls-calculator">Missed-calls calculator</a>
      </nav>

      <section className="lb-section" id="serve-customers" aria-labelledby="lb-start-title">
        <div className="lb-section-intro">
          <h2 id="lb-start-title">Four jobs I set up most.</h2>
          <p>Pick the one that costs you most. Each one runs by itself once it is set up.</p>
        </div>
        <ul className="lb-jobs">
          <li><a href="/for#job-missed-call"><strong>Missed calls</strong><span>Give callers a clear next step while your hands are full.</span><em>See missed-call text-back →</em></a></li>
          <li><a href="/for#job-quote-follow-up"><strong>Quotes gone quiet</strong><span>Send a polite follow-up without remembering to chase.</span><em>See quote follow-up →</em></a></li>
          <li><a href="/for#job-reminders"><strong>Bookings and no-shows</strong><span>Help customers confirm or move an appointment.</span><em>See appointment reminders →</em></a></li>
          <li><a href="/for#job-reviews"><strong>Remembering to ask for reviews</strong><span>Ask real customers at the right point after a job.</span><em>See review requests →</em></a></li>
        </ul>
      </section>

      <section className="lb-offers" id="ways-to-start" aria-labelledby="lb-offers-title">
        <div>
          <h2 id="lb-offers-title">Start with one job. Build from there.</h2>
          <p>Tell me what is getting in the way and we will work out what fits. I do not assume a package.</p>
        </div>
        <ul>
          <li><strong>{starter.name}</strong><span>{starter.price} · one task set up to run itself</span></li>
          <li><strong>{system.name}</strong><span>{system.price} · connected jobs for the wider workflow</span></li>
          <li><strong>{custom.name}</strong><span>{custom.price} · a small tool built for one job, when off-the-shelf apps don’t fit</span></li>
          <li><strong>{launch.name}</strong><span>{launch.price} · a page for bookings, enquiries or sales</span></li>
          <li><strong>{AFTER_HOURS.name}</strong><span>{AFTER_HOURS.price} · calls answered when you can’t pick up. <a href={AFTER_HOURS.href}>How it works</a></span></li>
        </ul>
        <a className="lb-text-link" href="/prices">See what each option includes and all prices →</a>
      </section>

      <section className="lb-section lb-industries" aria-labelledby="lb-industries-title">
        <div className="lb-section-intro">
          <h2 id="lb-industries-title">Made around the work you do.</h2>
          <p>These are examples. If yours is different, tell me about it.</p>
        </div>
        <ul className="lb-industry-list">{industries.map((industry) => <li key={industry.href}><a href={industry.href}><strong>{industry.label}</strong><span>{industry.text}</span><b aria-hidden="true">↗</b></a></li>)}</ul>
        <a className="lb-text-link" href="/for">See all business types and trades →</a>
      </section>

      <section className="lb-section" id="find-customers" aria-labelledby="lb-find-title">
        <div className="lb-section-intro">
          <h2 id="lb-find-title">Your website and Google listing.</h2>
          <p>No one can promise a particular search position. What I can do is make the page clear and keep your details right. See <a href="/website-design">website design options</a> if you need a new site.</p>
        </div>
        <ul className="lb-find-list">
          <li><strong>{launch.name} · {launch.price}</strong><span>One page that explains what you do and makes it easy to enquire, book or buy.</span><a href="/prices#websites">See page options →</a></li>
          <li><strong>Website · {website.price.toLowerCase()}</strong><span>A Launch Page plus four more pages, with enquiries built in.</span><a href="/prices#websites">See website options →</a></li>
          <li><strong>Managed presence · {MANAGED_PRESENCE.price.toLowerCase()}</strong><span>I keep your website, Google listing and social posts up to date each month.</span><a href="#managed-presence">Read on below →</a></li>
        </ul>
        <div className="lb-work-evidence" aria-label="Examples of real work">
          <span>See my work</span>
          <a href="/proof">JobFilter, my own live product →</a>
        </div>
      </section>

      <section className="lb-feature lb-sky" id="video" aria-labelledby="video-title">
        <div className="lb-section-intro">
          <p className="eyebrow">Video and filming · UK-wide</p>
          <h2 id="video-title">I film your business and edit promo videos.</h2>
          <p>I shoot the photos and footage at your business, then edit them into promotional videos. You own every asset, in writing. Professional-grade cameras, raw footage is yours.</p>
        </div>
        <ul className="lb-cards">
          <li><span className="lb-big">{VIDEO_SHOOTS[0].price}</span><strong>{VIDEO_SHOOTS[0].name}</strong><span>{VIDEO_SHOOTS[0].hours}. Premises, products, services and behind the scenes.</span></li>
          <li><span className="lb-big">{VIDEO_SHOOTS[1].price}</span><strong>{VIDEO_SHOOTS[1].name}</strong><span>{VIDEO_SHOOTS[1].hours}. Several locations or a bigger range.</span></li>
          <li><span className="lb-big">{VIDEO_EDITS.price}</span><strong>{VIDEO_EDITS.name}</strong><span>{VIDEO_EDITS.each} each. {VIDEO_EDITS.withShoot} when booked with a shoot.</span></li>
        </ul>
        <p className="lb-fine">Half day plus 4 videos: <strong>{formatPrice(halfPlus.total)}</strong> (save {formatPrice(halfPlus.saving)}). Full day plus 4 videos: <strong>{formatPrice(fullPlus.total)}</strong> (save {formatPrice(fullPlus.saving)}). Filming and videos are priced separately.</p>
        <h3>Work out your total</h3>
        <VideoSelector />
        <div className="lb-twocol">
          <div>
            <h3>What the videos include</h3>
            <ul className="lb-ticks">{VIDEO_EDITS.included.map((item) => <li key={item}>{item}</li>)}</ul>
          </div>
          <div>
            <h3>What I make</h3>
            <ul className="lb-ticks">{VIDEO_SERVICES.map((s) => <li key={s.title}><strong>{s.title}.</strong> {s.body}</li>)}</ul>
          </div>
        </div>
        <details className="lb-fold"><summary>Simple terms</summary><ul className="lb-ticks">{VIDEO_SCOPE.map((s) => <li key={s.title}><strong>{s.title}.</strong> {s.body}</li>)}</ul></details>
        <details className="lb-fold"><summary>Questions about filming</summary><div className="lb-faq">{VIDEO_FAQS.map((f) => <p key={f.q}><strong>{f.q}</strong><br />{f.a}</p>)}</div></details>
        <details className="lb-fold"><summary>Portfolio projects</summary><p>A few places each season for independent businesses. I choose at my discretion, and applying does not mean a place is certain. Tell me your business type, website, what is not working and what you want from the project.</p><p><a className="button" href="/contact?service=portfolio-project#contact">Apply for a Portfolio Project</a></p></details>
        <div className="lb-actions">
          <a className="button button-signal" href="/contact?service=video#contact">Enquire about a shoot</a>
          <a className="button" href={WHATSAPP_URL} rel="noopener">WhatsApp {WHATSAPP_DISPLAY}</a>
        </div>
      </section>

      <section className="lb-feature lb-peach" id="managed-presence" aria-labelledby="managed-title">
        <div className="lb-section-intro">
          <p className="eyebrow">Monthly service</p>
          <h2 id="managed-title">I run your online presence. You run your business.</h2>
          <p>Website, Google listing and social posts, kept fresh every month. Send me what you have; I do the rest.</p>
          <p className="lb-price">{MANAGED_PRESENCE.price}</p>
          <p className="lb-fine">{MANAGED_PRESENCE.terms}</p>
        </div>
        <h3>Every month</h3>
        <ul className="lb-cards">{MANAGED_PRESENCE.included.map((item) => <li key={item.title}><strong>{item.title}</strong><span>{item.body}</span></li>)}</ul>
        <div className="lb-twocol">
          <div>
            <h3>Three steps. One of them is yours.</h3>
            <ol className="lb-ticks">
              <li><strong>You send.</strong> Photos, clips, job notes. Whatever you already have.</li>
              <li><strong>I write and schedule.</strong> Captions, selection and scheduling, all done for you.</li>
              <li><strong>You approve.</strong> One quick look before anything goes live. Then back to work.</li>
            </ol>
          </div>
          <div>
            <h3>Not included</h3>
            <ul className="lb-ticks">{MANAGED_PRESENCE.notIncluded.map((item) => <li key={item}>{item}</li>)}</ul>
            <p className="lb-fine">Filming on site is quoted separately: see <a href="#video">video and filming</a>.</p>
          </div>
        </div>
        <details className="lb-fold">
          <summary>What video and managed presence look like for your business</summary>
          <ul className="lb-ticks">{AUDIENCES.map((a) => <li key={a.name}><strong>{a.name}.</strong> Managed: {a.managed} Video: {a.video}</li>)}</ul>
        </details>
        <div className="lb-actions"><a className="button button-signal" href="/contact?service=managed-presence#contact">Ask about managed presence</a></div>
      </section>

      <section className="lb-feature" id="missed-calls-calculator" aria-labelledby="mcc-page-title">
        <div className="lb-section-intro">
          <p className="eyebrow">Missed-calls calculator</p>
          <h2 id="mcc-page-title">What are the calls you miss costing you?</h2>
          <p>You can’t answer with your hands in a boiler, mid-appointment, or up a ladder. Most of those callers ring the next name on the list. Put in your own week and see what it adds up to. Your numbers only, nothing saved, no industry figure assumed.</p>
        </div>
        <div className="lb-calc"><MissedCallsCalculator /></div>
        <p className="lb-fine"><a href={AFTER_HOURS.href}>Want those calls answered? The {AFTER_HOURS.name} answers in your business name, takes the details and emails you a summary: {AFTER_HOURS.price}, month to month.</a> Prefer a text back instead? Missed-call text-back is {starter.price} once, and you see it working before you pay. Know someone who loses calls? <a href="/contact#refer">Refer them and earn {REFERRAL_RANGE}</a>.</p>
      </section>

      <section className="lb-close" aria-labelledby="lb-close-title">
        <h2 id="lb-close-title">What’s taking too much time, or losing you work?</h2>
        <p>Tell me what happens today and what you would like to happen instead. I will look at the tools you use and suggest a next step.</p>
        <a className="button button-signal lb-primary" href="/contact?src=local-businesses">{MAIN_CTA}</a>
      </section>

      <SiteFooter />
    </main>
  );
}
