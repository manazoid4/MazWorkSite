import { fitDescription } from '../seo';
import { OG_IMAGE } from '../seo';
import type { Metadata } from 'next';
import { SiteFooter, SiteHeader } from '../site-chrome';
import { DemoRequestForm } from '../demo-request-form';
import { CallLink } from '../analytics';
import { BOOKING_URL, CHECK_REPLY_TIME, CONTACT_EMAIL, SITE_URL } from '../site';
import { ALL_OFFERS, FREE_STEP, OFFERS, PAYMENT_TERMS, LOWEST_EXTRA_PRICE } from '../offers';

export const metadata: Metadata = {
  title: { absolute: 'Contact Maz Works' },
  description: fitDescription(`Tell Manazir what you need: automation from ${OFFERS[0].price}, a joined-up business system, custom software or a website. One line is enough. Fixed quote, no VAT added.`),
  alternates: { canonical: `${SITE_URL}/contact` },
  openGraph: { images: [OG_IMAGE], title: 'Contact Maz Works', description: fitDescription('Tell me what you need built. Fixed quote, no VAT added.'), url: `${SITE_URL}/contact`, type: 'website' },
};

const BIGGER_JOBS = ALL_OFFERS.map((offer) => ({ name: offer.name, price: offer.price, body: offer.body }));

export default function ContactPage() {
  return (
    <main className="s-home">
      <SiteHeader />
      <section className="s-hero s-hero-short" id="main-content" tabIndex={-1} aria-labelledby="contact-page-title">
        <p className="eyebrow">Contact</p>
        <h1 id="contact-page-title">Tell me what you need built.</h1>
        <p className="s-lede">One line is enough. I usually reply within {CHECK_REPLY_TIME} with the next step; the fixed price follows once I understand the job.</p>
        <div className="s-actions">
          <a className="button button-signal s-button-lg" href="/free-plan?src=contact#leak-check-form">Get my free preview</a>
        </div>
        <p className="s-note">Want a bigger build or private demo? Use the form below.</p>
      </section>

      <section className="s-section s-check" id="contact" aria-labelledby="contact-title">
        <div className="s-check-copy">
          <h2 id="contact-title">Send it straight to me.</h2>
          <p><CallLink href={BOOKING_URL} placement="contact">Book a 15-minute call</CallLink> or email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.</p>
          <p className="s-small">{BIGGER_JOBS.map((job, index) => <span key={job.name}>{index ? ' · ' : ''}{job.name} {job.price}</span>)}</p>
          <p className="s-small">{FREE_STEP.name} is free. No VAT added.</p>
        </div>
        <DemoRequestForm />
      </section>
      <SiteFooter />
    </main>
  );
}
