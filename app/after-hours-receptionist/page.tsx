import type { Metadata } from 'next';
import { Breadcrumbs } from '../breadcrumbs';
import { AFTER_HOURS, MISSED_CALL_OPTIONS } from '../offers';
import { OG_IMAGE, fitDescription } from '../seo';
import { MAIN_CTA, SITE_URL } from '../site';
import { SiteFooter, SiteHeader } from '../site-chrome';
import { BuyNow } from '../price-list';
import { ScrollReveal } from '../scroll-reveal';
import { StickyCheckCta } from '../sticky-cta';
import { BEST_FOR, CHIPS, COMPARE, COST_MODEL, EMERGENCY_NOTE, FAQS, NEXT, STEPS, TRUST } from './content';
import { NightCall } from './night-call';
import { CallDemo } from './call-demo';
import { ValueCheck } from './value-check';
import { MinutesCheck } from './minutes-check';
import './receptionist.css';

const TITLE = 'After-hours call answering for small businesses | Maz Works';
const DESCRIPTION = fitDescription(`Stop sending missed calls to voicemail. When you can’t pick up, day or night, calls are answered in your business name, messages taken and a summary emailed to you. ${AFTER_HOURS.price}, free preview first.`);

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: AFTER_HOURS.href },
  openGraph: { title: 'Calls answered when you can’t pick up', description: DESCRIPTION, url: AFTER_HOURS.href, type: 'website', images: [OG_IMAGE] },
};

const json = (data: unknown) => JSON.stringify(data).replace(/</g, '\\u003c');

/** Small line icons for the trust cards (own paths, 24px grid). */
const TRUST_ICONS: Record<string, string> = {
  rules: 'M5 4h14v16H5zM8 9h8M8 13h8M8 17h5',
  urgent: 'M12 3l9 16H3zM12 10v4M12 17h.01',
  honest: 'M4 5h16v11H9l-5 4zM9 10h6',
  clear: 'M6 3h4l2 5-3 2a11 11 0 0 0 5 5l2-3 5 2v4a2 2 0 0 1-2 2A17 17 0 0 1 4 5a2 2 0 0 1 2-2z',
  record: 'M12 3a3 3 0 0 1 3 3v6a3 3 0 0 1-6 0V6a3 3 0 0 1 3-3zM5 11a7 7 0 0 0 14 0M12 18v3',
  control: 'M4 7h10M18 7h2M4 17h4M12 17h8M16 5v4M10 15v4',
};

export default function AfterHoursPage() {
  const demoHref = `/free-plan?src=after-hours&package=${encodeURIComponent(AFTER_HOURS.name)}#leak-check-form`;
  const service = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: AFTER_HOURS.name,
    serviceType: 'Missed-call and after-hours call answering',
    description: 'Calls the owner can’t pick up, day or night, answered in the business’s name: common questions answered, messages taken, urgent-call rules followed and a summary emailed to the owner.',
    provider: { '@id': `${SITE_URL}/#maz-works` },
    areaServed: { '@type': 'Country', name: 'United Kingdom' },
    url: `${SITE_URL}${AFTER_HOURS.href}`,
    offers: {
      '@type': 'Offer',
      name: AFTER_HOURS.name,
      price: AFTER_HOURS.monthly,
      priceCurrency: 'GBP',
      priceSpecification: { '@type': 'UnitPriceSpecification', price: AFTER_HOURS.monthly, priceCurrency: 'GBP', unitCode: 'MON', referenceQuantity: { '@type': 'QuantitativeValue', value: 1, unitCode: 'MON' } },
      url: `${SITE_URL}${AFTER_HOURS.href}`,
    },
  };
  const faqs = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((faq) => ({ '@type': 'Question', name: faq.q, acceptedAnswer: { '@type': 'Answer', text: faq.a } })),
  };

  return (
    <main className="ah">
      <SiteHeader />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json(service) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json(faqs) }} />

      <section className="ah-hero" id="main-content" tabIndex={-1} aria-labelledby="ah-title">
        <div className="ah-hero-copy">
          <Breadcrumbs items={[{ href: '/services', label: 'Jobs I set up' }, { label: AFTER_HOURS.name }]} />
          <p className="eyebrow">{AFTER_HOURS.name} · new</p>
          <h1 id="ah-title">Calls answered when <em>you can’t pick up</em>.</h1>
          <p className="ah-lede">Busy on a job in the day or closed at night, your calls are answered in your business name. Common questions get answered, details get taken, and you get a clear summary by email.</p>
          <p className="ah-price"><strong>{AFTER_HOURS.price}</strong><span>{AFTER_HOURS.setup} · month to month</span></p>
          <div className="mw-actions">
            <a className="button button-signal" href={demoHref}>{MAIN_CTA}</a>
            <a className="button" href="/receptionist-demo">Talk to the receptionist</a>
          </div>
          <p className="mw-hero-note">{`${AFTER_HOURS.guarantee} Manazir sets it up himself.`}</p>
        </div>
        <NightCall />
      </section>

      <section className="ah-strip" aria-label="What’s included at a glance">
        <ul className="ah-chips">{CHIPS.map((chip) => <li key={chip}>{chip}</li>)}</ul>
        <p className="ah-bestfor"><span>Best for</span>{BEST_FOR.map((item) => <a key={item.label} href={item.href}>{item.label}</a>)}</p>
      </section>

      <section className="ah-section" data-reveal aria-labelledby="ah-compare-title">
        <p className="eyebrow">Before and after</p>
        <h2 id="ah-compare-title">Voicemail loses the caller. An answer keeps them.</h2>
        <div className="ah-compare">
          <div className="ah-compare-col ah-before"><h3>Voicemail</h3><ul>{COMPARE.map((row) => <li key={row.before}>{row.before}</li>)}</ul></div>
          <div className="ah-compare-col ah-after"><h3>With your receptionist</h3><ul>{COMPARE.map((row) => <li key={row.after}>{row.after}</li>)}</ul></div>
        </div>
      </section>

      <section className="ah-section" data-reveal aria-labelledby="ah-how-title">
        <p className="eyebrow">How it works</p>
        <h2 id="ah-how-title">Four steps. You do very little.</h2>
        <ol className="ah-steps">{STEPS.map((step, index) => <li key={step.title} style={{ ['--i' as string]: index }}><span className="ah-n" aria-hidden="true">{index + 1}</span><strong>{step.title}</strong><span>{step.body}</span></li>)}</ol>
      </section>

      <section className="ah-section ah-pricing" id="price" data-reveal aria-labelledby="ah-price-title">
        <p className="eyebrow">What’s included</p>
        <h2 id="ah-price-title">Everything for {AFTER_HOURS.price}.</h2>
        <div className="ah-price-grid">
          <article className="ah-card">
            <header>
              <h3>{AFTER_HOURS.name}</h3>
              <p className="ah-card-price"><strong>{AFTER_HOURS.price}</strong><span>{AFTER_HOURS.setup}. No VAT added.</span></p>
            </header>
            <ul className="ah-included">{AFTER_HOURS.included.map((item) => <li key={item.title}><strong>{item.title}</strong><span>{item.body}</span></li>)}</ul>
            <p className="ah-card-terms"><strong>What you’ll hear first:</strong> {AFTER_HOURS.successCheck}</p>
            <p className="ah-card-terms">{`${AFTER_HOURS.minutes} call minutes a month included. ${AFTER_HOURS.terms}`}</p>
            <a className="button button-signal ah-card-cta" href={demoHref}>{MAIN_CTA}</a>
            <BuyNow name={AFTER_HOURS.name} />
            <p className="ah-card-terms">{AFTER_HOURS.guarantee}</p>
          </article>
          <div className="ah-side">
            <h3>Would one booked job cover it?</h3>
            <ValueCheck />
            <h3 className="ah-side-h">Will {AFTER_HOURS.minutes} minutes cover you?</h3>
            <MinutesCheck />
            <h3 className="ah-side-h">Not included, said plainly</h3>
            <ul className="ah-not">{AFTER_HOURS.notIncluded.map((item) => <li key={item}>{item}</li>)}</ul>
          </div>
        </div>
      </section>

      <section className="ah-section" id="why-price" data-reveal aria-labelledby="ah-cost-title">
        <p className="eyebrow">Why it costs what it costs</p>
        <h2 id="ah-cost-title">{COST_MODEL.title}</h2>
        <p className="ah-sub">{COST_MODEL.lede}</p>
        <div className="ah-cost">
          <article className="ah-cost-col ah-cost-them">
            <h3>{COST_MODEL.them.title}</h3>
            <ul>{COST_MODEL.them.points.map((point) => <li key={point}>{point}</li>)}</ul>
          </article>
          <article className="ah-cost-col ah-cost-ours">
            <h3>{COST_MODEL.ours.title}</h3>
            <ul>{COST_MODEL.ours.points.map((point) => <li key={point}>{point}</li>)}</ul>
          </article>
        </div>
        <p className="ah-cost-close">{COST_MODEL.close} <strong>{AFTER_HOURS.price}</strong>.</p>
      </section>

      <section className="ah-section" id="which" data-reveal aria-labelledby="ah-which-title">
        <p className="eyebrow">Pick the smallest fix that works</p>
        <h2 id="ah-which-title">Four ways to handle a missed call.</h2>
        <p className="ah-sub">Cheapest first. If a text back is all your callers need, buy that once and skip the monthly fee.</p>
        <ul className="ah-which">{MISSED_CALL_OPTIONS.map((option) => (
          <li key={option.id} className={option.id === 'receptionist' ? 'ah-which-this' : undefined}>
            <h3>{option.name}</h3>
            <p className="ah-which-price">{option.price}</p>
            <dl>
              <div><dt>The caller</dt><dd>{option.caller}</dd></div>
              <div><dt>You get</dt><dd>{option.you}</dd></div>
              <div><dt>Fits when</dt><dd>{option.fits}</dd></div>
            </dl>
            {option.href ? <a className="text-link" href={option.href}>{option.id === 'receptionist' ? 'What’s included' : 'See this one'} <span aria-hidden="true">→</span></a> : null}
          </li>
        ))}</ul>
      </section>

      <section className="ah-section ah-try" id="try" aria-labelledby="ah-try-title">
        <p className="eyebrow">Try it</p>
        <h2 id="ah-try-title">Play an example call.</h2>
        <p className="ah-sub">Pick a caller. Watch how the call goes, then see the summary the owner gets.</p>
        <CallDemo />
        <p className="ah-talk"><a className="button" href="/receptionist-demo">Talk to it out loud</a> <span>Have the call yourself, in your browser, with your microphone.</span></p>
      </section>

      <section className="ah-section" id="safety" data-reveal aria-labelledby="ah-trust-title">
        <p className="eyebrow">Safety and privacy</p>
        <h2 id="ah-trust-title">Helpful, but kept on a short lead.</h2>
        <ul className="ah-trust">{TRUST.map((item) => (
          <li key={item.title}>
            <span className="ah-trust-icon" aria-hidden="true"><svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={TRUST_ICONS[item.icon]} /></svg></span>
            <strong>{item.title}</strong><span>{item.body}</span>
          </li>
        ))}</ul>
        <p className="ah-note" role="note">{EMERGENCY_NOTE}</p>
      </section>

      <section className="ah-section" data-reveal aria-labelledby="ah-next-title">
        <p className="eyebrow">What happens next</p>
        <h2 id="ah-next-title">From free preview to answered calls.</h2>
        <ol className="ah-steps ah-next">{NEXT.map((step, index) => <li key={step.title} style={{ ['--i' as string]: index }}><span className="ah-n" aria-hidden="true">{index + 1}</span><strong>{step.title}</strong><span>{step.body}</span></li>)}</ol>
      </section>

      <section className="s-section" id="answers" aria-labelledby="ah-faq-title">
        <p className="eyebrow">Questions</p>
        <h2 id="ah-faq-title">What owners ask about it.</h2>
        <div className="s-faq">{FAQS.map((faq) => <details key={faq.q}><summary>{faq.q}</summary><p>{faq.a}</p></details>)}</div>
        <p className="s-small">More detail in the <a href="/privacy">privacy notice</a> and <a href="/terms">terms of work</a>.</p>
      </section>

      <section className="mw-resource-cta" id="get-demo" aria-labelledby="ah-cta-title">
        <div>
          <p className="eyebrow">Free first step</p>
          <h2 id="ah-cta-title">See if it would work for your business.</h2>
          <p>Tell me your business and hours. I’ll send a free preview answering as you, and tell you plainly if your phone setup works with it.</p>
        </div>
        <div className="mw-actions">
          <a className="button button-signal" href={demoHref}>{MAIN_CTA}</a>
          <a className="button" href="#try">Play an example call</a>
        </div>
      </section>

      <SiteFooter /><StickyCheckCta href={demoHref} hideWhenVisible="get-demo" /><ScrollReveal />
    </main>
  );
}
