import { fitDescription, OG_IMAGE } from '../seo';
import type { Metadata } from 'next';
import { SiteFooter, SiteHeader } from '../site-chrome';
import { DemoRequestForm } from '../demo-request-form';
import { CallLink } from '../analytics';
import { BOOKING_URL, CHECK_REPLY_TIME, CONTACT_EMAIL, DIRECT_LINE, PREVIEW_TIME, SITE_URL } from '../site';
import { ALWAYS_INCLUDED, FREE_STEP, OFFERS, PAYMENT_TERMS, REFERRAL_RANGE, REFERRAL_TIERS } from '../offers';
import { NICHE_GUIDES } from '../for/niches';
import { NextSteps } from '../explainers';
import { SampleReport } from '../sample-report';
import { AutomationAudit } from '../audit/audit';
import '../b2b.css';
import './contact.css';

export const metadata: Metadata = {
  title: { absolute: 'Contact Maz | Describe a problem, get a reply' },
  description: fitDescription(`Tell me what is not working in your business, in your own words. I usually reply within ${CHECK_REPLY_TIME}. A free preview and fixed price if it helps. No call needed.`),
  alternates: { canonical: `${SITE_URL}/contact` },
  openGraph: { images: [OG_IMAGE], title: 'Contact Maz Works', description: fitDescription('Tell me what is not working. I reply by email, and the price is fixed before any paid work.'), url: `${SITE_URL}/contact`, type: 'website' },
};

const RETURN = [
  'One focused preview of the fix: an example screen, a small workflow demo or a before-and-after',
  `A fixed price (one job starts from ${OFFERS[0].price}) and a written scope sheet, with any extras listed separately`,
  'What I would do first, and what I would leave alone',
  'Any software or text-message costs you would pay directly',
  'A date it would be live by',
];

const REFER_STEPS = [
  { title: 'You introduce them', body: 'Send them my way, or ask them to put your name in their first message. One line is enough.' },
  { title: 'They pay their first invoice', body: 'They start with a free preview and a fixed price. Nothing is owed until they see the work and pay.' },
  { title: 'You get paid', body: 'I send your reward by bank transfer within 7 days of their first invoice. No forms, no hoops.' },
];

const REFER_RULES = [
  'The business must be new to me: not already talking to me, or already a client.',
  'Their first invoice must be for a package, not an add-on on its own or a care plan.',
  'No reward if the job is cancelled or refunded before the work is delivered.',
  'If you share this publicly, say plainly that you are paid for referrals.',
];

export default function ContactPage() {
  return (
    <main className="ct" id="main-content" tabIndex={-1}>
      <SiteHeader />

      <section className="ct-band" id="contact" aria-labelledby="contact-title">
        <div className="ct-copy">
          <p className="eyebrow">Contact</p>
          <h1 id="contact-title">You know your business. Let’s work out what would help.</h1>
          <p>Tell me what is not working, in your own words. A missed call, a messy process, or a feeling that something should be easier. You do not need the technical answer, or a plan.</p>
          <p>I reply by email, usually within {CHECK_REPLY_TIME}. Scope and price are agreed before any paid work.</p>
          <p className="mw-contact-alternatives"><a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a><span aria-hidden="true"> · </span><CallLink href={BOOKING_URL} placement="contact">Book a 15-minute call</CallLink> (only if you would rather talk)<span aria-hidden="true"> · </span><a href="#refer">Refer a business</a></p>
        </div>
        <div className="ct-card">
          <DemoRequestForm contact formId="leak-check-form" kicker="Your name, email and a few lines about the problem. No service choice needed." />
        </div>
      </section>

      <section className="ct-section" id="free-preview" aria-labelledby="free-preview-title">
        <div className="ct-head">
          <p className="eyebrow">{FREE_STEP.name} · {FREE_STEP.price}</p>
          <h2 id="free-preview-title">What the free preview is.</h2>
          <p>{FREE_STEP.body} Pick “A free preview and fixed price” in the form above. It is free for any UK business.</p>
          <p><strong>{DIRECT_LINE}</strong></p>
        </div>
        <div className="ct-cols">
          <div className="ct-tile ct-peach">
            <h3>What you get back</h3>
            <ul className="ct-list">{RETURN.map((item) => <li key={item}>{item}</li>)}</ul>
            <h3>What it is not</h3>
            <ul className="ct-list">{FREE_STEP.limits.map((item) => <li key={item}>{item}</li>)}</ul>
          </div>
          <div className="ct-tile ct-sky">
            <h3>If you say yes</h3>
            <p>I reply within {CHECK_REPLY_TIME}; the preview and price usually follow within {PREVIEW_TIME}. Nothing happens unless you reply yes. Days are counted from the day you approve the scope sheet.</p>
            <NextSteps />
          </div>
        </div>
        <p className="ct-fine">Sometimes the answer is: “This isn’t worth automating yet.” If a tool you already pay for can do it, I will say so.</p>
        <p className="ct-fine">Built for any business that runs on customers: {NICHE_GUIDES.map((guide, index) => (
          <span key={guide.id}>{index ? ' · ' : ''}<a href={`/for/${guide.id}`}>{guide.shortName}</a></span>
        ))}</p>
        <details className="ct-more">
          <summary>See an example of what I send back</summary>
          <div className="ct-more-body"><SampleReport /></div>
        </details>
        <details className="ct-more">
          <summary>Not sure what to ask for? Try the one-minute audit</summary>
          <div className="ct-more-body">
            <p className="s-small">Tick the repeat jobs eating your week. Your result carries over to the form above.</p>
            <AutomationAudit page="contact" />
            <p className="s-small"><a href="/contact?audit=1#leak-check-form">Use this result in the form</a></p>
          </div>
        </details>
      </section>

      <section className="ct-section" id="scope" aria-labelledby="scope-title">
        <div className="ct-head">
          <p className="eyebrow">Before you pay</p>
          <h2 id="scope-title">Every quote comes as a scope sheet.</h2>
          <p>It says what is built, what isn’t, the date and the price. Nothing to pay until you’ve seen it working. {PAYMENT_TERMS}</p>
        </div>
        <ul className="ct-grid">{ALWAYS_INCLUDED.map((item) => <li key={item.title}><strong>{item.title}</strong><span>{item.body}</span></li>)}</ul>
      </section>

      <section className="ct-section" id="refer" aria-labelledby="refer-title">
        <div className="ct-head">
          <p className="eyebrow">Refer a business</p>
          <h2 id="refer-title">Know a business that could use this? Get paid for the introduction.</h2>
          <p>If you introduce a UK business that isn’t already talking to me, you get paid once they do: {REFERRAL_RANGE}, depending on the job they buy. No limit on how many. Paid by bank transfer within 7 days of their first invoice.</p>
        </div>
        <ol className="ct-grid ct-steps">{REFER_STEPS.map((step, index) => <li key={step.title}><span aria-hidden="true">{index + 1}</span><strong>{step.title}</strong><span>{step.body}</span></li>)}</ol>
        <h3 className="ct-sub">What you earn</h3>
        <p className="ct-fine">The reward scales with the job your referral buys, so the biggest builds pay the most.</p>
        <ul className="ct-grid">{REFERRAL_TIERS.map((tier) => <li key={tier.id}><strong>{tier.reward} · {tier.job}</strong><span>{tier.note}</span></li>)}</ul>
        <h3 className="ct-sub">The honest rules</h3>
        <ul className="ct-list">{REFER_RULES.map((rule) => <li key={rule}>{rule}</li>)}</ul>
        <p className="ct-fine">Every system I ship carries a quiet “Built by Maz Works” line in the messages and the written handover, so the work keeps introducing itself. You get paid for the ones it brings in. Questions about a referral: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. If you’re referring someone, send them this page.</p>
      </section>

      <SiteFooter />
    </main>
  );
}
