import type { MetadataRoute } from 'next';
import { NICHE_GUIDES } from './for/niches';
import { CUSTOMER_TYPES } from './customer-types';
import { SITE_URL } from './site';

export const dynamic = 'force-static';

// Priorities are a hint only and there is no analytics data behind them (see docs/reimagine/ROUTES.md).
// Order: the seven main pages first, then the pages kept for search and for people who arrive on them.
export default function sitemap(): MetadataRoute.Sitemap {
  const reimagined = new Date('2026-10-25');
  return [
    { url: SITE_URL, lastModified: reimagined, changeFrequency: 'monthly', priority: 1 },
    { url: `${SITE_URL}/what-we-do`, lastModified: reimagined, changeFrequency: 'monthly', priority: 0.95 },
    { url: `${SITE_URL}/prices`, lastModified: reimagined, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/proof`, lastModified: reimagined, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${SITE_URL}/tools`, lastModified: reimagined, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/research`, lastModified: new Date('2026-10-28'), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/research/scorensic`, lastModified: new Date('2026-10-31'), changeFrequency: 'weekly', priority: 0.6 },
    { url: `${SITE_URL}/tools/restaurant-tables`, lastModified: reimagined, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/contact`, lastModified: reimagined, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/about`, lastModified: reimagined, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/local-businesses`, lastModified: reimagined, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/website-design`, lastModified: reimagined, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/one-page-website`, lastModified: reimagined, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${SITE_URL}/missed-call-text-back`, lastModified: reimagined, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${SITE_URL}/website-cost`, lastModified: reimagined, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/professional-teams`, lastModified: reimagined, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${SITE_URL}/after-hours-receptionist`, lastModified: reimagined, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/for`, lastModified: reimagined, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/faq`, lastModified: reimagined, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/free-membership`, lastModified: new Date('2026-10-22'), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/site-map`, lastModified: reimagined, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${SITE_URL}/terms`, lastModified: new Date('2026-10-02'), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE_URL}/privacy`, lastModified: new Date('2026-10-02'), changeFrequency: 'yearly', priority: 0.3 },
    ...CUSTOMER_TYPES.map((type) => ({
      url: `${SITE_URL}/for/${type.id}`,
      lastModified: reimagined,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    ...NICHE_GUIDES.map((guide) => ({
      url: `${SITE_URL}/for/${guide.id}`,
      lastModified: reimagined,
      changeFrequency: 'monthly' as const,
      priority: 0.75,
    })),
  ];
}
