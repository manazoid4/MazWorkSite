import { OFFERS, USPS } from '../offers';
import { fitDescription } from '../seo';
import { OG_IMAGE } from '../seo';
import type { Metadata } from 'next';
import { MAZ_WORKS_FAQS } from '../faqs';
import { CONTACT_EMAIL, SITE_URL } from '../site';
import { SiteFooter, SiteHeader } from '../site-chrome';
import { Cards, InfoSection } from '../infographic';

const PAGE_URL = `${SITE_URL}/faq`;

export const metadata: Metadata = {
  title: 'FAQ: prices, timing and ownership',
  description: fitDescription(`Plain answers: what the free preview is, what ${OFFERS[0].name} at ${OFFERS[0].price} does, how long it takes, how payment works and who owns what. No VAT added.`),
  alternates: { canonical: PAGE_URL },
  openGraph: { images: [OG_IMAGE],
    title: 'Maz Works FAQ',
    description: fitDescription('Straight answers about working with Maz Works.'),
    url: PAGE_URL,
    type: 'website',
  },
};

export default function FaqPage() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: MAZ_WORKS_FAQS.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, '\\u003c') }}
      />
      <SiteHeader />

      <section className="mw-resource-hero" id="main-content" tabIndex={-1} aria-labelledby="faq-title">
        <p className="eyebrow">FAQ</p>
        <h1 id="faq-title">Questions people ask me.</h1>
        <p>Tap a question. If yours is not here, ask it. No call needed.</p>
        <div className="mw-actions">
          <a className="button button-signal" href="/contact#leak-check-form">Get my free preview</a>
        </div>
      </section>

      <InfoSection eyebrow="How I work" title="What you can count on">
        <Cards items={USPS.map(u => ({ title: u.title, body: u.body }))} />
      </InfoSection>

      <section className="s-section" aria-label="Frequently asked questions">
        <div className="s-faq">
          {MAZ_WORKS_FAQS.map((faq) => {
            const slug = faq.question.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            return (
              <details id={slug} key={faq.question}>
                <summary>{faq.question}</summary>
                <p dangerouslySetInnerHTML={{ __html: faq.answer }} />
              </details>
            );
          })}
        </div>
      </section>

      <section className="mw-resource-cta" aria-labelledby="faq-still-title">
        <div>
          <p className="eyebrow">Still unsure?</p>
          <h2 id="faq-still-title">Not here? Ask me.</h2>
          <p>Send it by email, or use the form.</p>
        </div>
        <div className="mw-actions">
          <a className="button button-dark" href={`mailto:${CONTACT_EMAIL}?subject=Maz%20Works%20question`}>Email me</a>
          <a className="text-link" href="/contact#contact">Use the enquiry form <span aria-hidden="true">→</span></a>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
