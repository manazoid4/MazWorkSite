import { fitDescription } from '../seo';
import { OG_IMAGE } from '../seo';
import type { Metadata } from 'next';
import { SiteFooter, SiteHeader } from '../site-chrome';
import { DemoRequestForm } from '../demo-request-form';
import { CallLink } from '../analytics';
import { BOOKING_URL, CHECK_REPLY_TIME, CONTACT_EMAIL, SITE_URL } from '../site';

export const metadata: Metadata = {
  title: { absolute: 'Contact Maz Works' },
  description: fitDescription('Tell Maz what is not working in your business or what you want to improve. One line is enough to start a useful conversation.'),
  alternates: { canonical: `${SITE_URL}/contact` },
  openGraph: { images: [OG_IMAGE], title: 'Contact Maz Works', description: fitDescription('Tell me what you need help with. Fixed quote, no VAT added.'), url: `${SITE_URL}/contact`, type: 'website' },
};

export default function ContactPage() {
  return (
    <main className="s-home" id="main-content" tabIndex={-1}>
      <SiteHeader />
      <section className="s-section s-check mw-contact-landing" id="contact" aria-labelledby="contact-title">
        <div className="s-check-copy">
          <p className="eyebrow">Contact</p>
          <h1 id="contact-title">Tell me what needs to work better.</h1>
          <p className="s-lede">One line is enough. I usually reply within {CHECK_REPLY_TIME} with a useful next step.</p>
          <p className="s-small mw-contact-alternatives"><CallLink href={BOOKING_URL} placement="contact">Book a 15-minute call</CallLink><span aria-hidden="true"> · </span><a href={`mailto:${CONTACT_EMAIL}`}>Email {CONTACT_EMAIL}</a></p>
        </div>
        <DemoRequestForm />
      </section>
      <SiteFooter />
    </main>
  );
}
