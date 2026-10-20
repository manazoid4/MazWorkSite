import type { Metadata } from 'next';
import { ConversionTracker } from './analytics';
import { LinkedInInsight } from './linkedin-insight';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';
import './enquiry.css';
import './sales.css';
import './wayfinding.css';
import './colour.css';
import { CONTACT_EMAIL, GITHUB_URL, LINKEDIN_URL, PERSON_NAME, SITE_NAME, SITE_URL } from './site';
import { OG_IMAGE, SITE_DESCRIPTION, SITE_TITLE } from './seo';
import { ALL_OFFERS, FREE_STEP, PRICE_RANGE } from './offers';

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Person',
      '@id': `${SITE_URL}/#person`,
      name: PERSON_NAME,
      jobTitle: 'Founder and Software Builder',
      url: `${SITE_URL}/`,
      address: { '@type': 'PostalAddress', addressCountry: 'GB' },
      sameAs: [GITHUB_URL, LINKEDIN_URL],
    },
    {
      '@type': 'ProfilePage',
      '@id': `${SITE_URL}/#website`,
      url: `${SITE_URL}/`,
      name: `${SITE_NAME} — ${PERSON_NAME}`,
      about: { '@id': `${SITE_URL}/#person` },
    },
    {
      '@type': ['Organization', 'ProfessionalService'],
      '@id': `${SITE_URL}/#maz-works`,
      name: SITE_NAME,
      url: `${SITE_URL}/`,
      email: CONTACT_EMAIL,
      image: `${SITE_URL}${OG_IMAGE.url}`,
      logo: `${SITE_URL}/email/mw-logo.png`,
      founder: { '@id': `${SITE_URL}/#person` },
      address: { '@type': 'PostalAddress', addressCountry: 'GB' },
      areaServed: { '@type': 'Country', name: 'United Kingdom' },
      priceRange: PRICE_RANGE,
      description: 'Maz Works helps UK businesses find and serve customers through websites, Google Business Profile, booking and enquiry workflows, automation and software. It also provides complaints reporting, customer growth systems and digital rebuilds.',
      makesOffer: [
        { '@type': 'Offer', name: FREE_STEP.name, price: '0', priceCurrency: 'GBP', url: `${SITE_URL}/free-plan` },
        ...ALL_OFFERS.map((offer) => ({
          '@type': 'Offer',
          name: offer.name,
          url: `${SITE_URL}/prices`,
          priceSpecification: { '@type': 'PriceSpecification', minPrice: offer.from, priceCurrency: 'GBP' },
        })),
      ],
    },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_TITLE, template: '%s — Maz Works' },
  description: SITE_DESCRIPTION,
  alternates: { canonical: '/' },
  authors: [{ name: PERSON_NAME }],
  creator: PERSON_NAME,
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    type: 'website',
    url: '/',
    siteName: SITE_NAME,
    locale: 'en_GB',
    images: [OG_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [OG_IMAGE.url],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
        <a className="skip-link" href="#main-content">Skip to main content</a>
        {children}
        <Analytics /><ConversionTracker />
        <LinkedInInsight />
      </body>
    </html>
  );
}
