# SEO Phase 2: organic customer acquisition (25 Oct 2026)

Originally drafted by another agent on top of a location-named landing page (PR #207). Maz, 26 Oct: no location on the site, so that page and its research notes were dropped and these pages were moved onto main on their own.

## What the research supports (and does not)
Search results were sampled, not measured: no search volumes, UK rank order or People Also Ask data were observable. Everything ranked below is an inference from who appears and what they show.

| Rank | Opportunity | Why | Built |
|---|---|---|---|
| 1 | Cheap one-page website (UK small business) | Maz's Launch Page £295 is below the one agency seen showing a one-page price (£479); intent is purchase-led | `/one-page-website` |
| 3 | Missed-call text-back for UK small businesses | One UK trades result seen, mostly US SaaS; matches the £99 Starter | `/missed-call-text-back` (reuses `SERVICE_JOBS`) |
| 4 | Small business website cost | Cost-guide format ranks for trades; prices here come from `app/offers.ts` only | `/website-cost` |
| 5 | Answering service (UK) | Established incumbents; compete on automated plus booking, not price | Already `/after-hours-receptionist`, linked from the new pages |
| skip | "business automation", "booking system", "enquiry management" head terms | Dominated by SaaS and enterprise vendors; wrong intent for a freelancer | none |

Not built on purpose: per-town pages (thin), a trade cost guide (needs real market data we do not have), pages for the other nine automation jobs (kept consolidated on `/for` per the October route decisions).

## Changes
- Three new pages with unique titles, canonicals, Service schema, breadcrumbs, FAQs and a free-preview CTA. Prices are read from `app/offers.ts`.
- Internal links: `/prices` (closed fold), `/local-businesses`, grouped nav and `/site-map`.
- Sitemap: three pages added. `/3d-printing` stays out on purpose.
- Self-referencing canonicals on five noindex pages that inherited the homepage canonical.
- Attribution: `src` values for the new pages were being dropped by `cleanEnquirySource`, so enquiries from them had no source. Fixed. Visits arriving from Google, Bing, DuckDuckGo, Ecosia or Yahoo now carry `referrer=organic-search` into the enquiry's `Campaign:` line and the "Campaign visit" event.
- Tests and tools: `scripts/seo-audit.mjs` (`npm run seo:audit`: titles, descriptions, canonicals, one h1, JSON-LD, alt text, broken internal links, sitemap and robots) is run by `tests/seo-regression.test.mjs`. `scripts/seo-vitals.mjs` is a mobile lab check (needs a running static export).

## Verification (local)
`tsc` clean; `next build` OK; `npm test` 364/364; `npm run smoke` OK; `seo:audit` 44 pages, 0 errors (8 intentional noindex notices). Mobile lab at 390px: LCP 350 to 440 ms, CLS 0.000, no horizontal overflow, no console errors. Axe was not installed, so automated accessibility checks did not run.

## Search Console: what only Maz can do (about 15 minutes)
1. Open Search Console and add `www.mazworks.uk` as a Domain property (DNS TXT record), or a URL-prefix property with the HTML tag method if DNS is awkward.
2. Sitemaps, submit `https://www.mazworks.uk/sitemap.xml`.
3. URL Inspection, request indexing for `/one-page-website`, `/missed-call-text-back` and `/website-cost` after the PRs are merged.
4. After 2 to 4 weeks, open Performance and export queries and pages. Those figures, not this document, decide what to build next.
5. In HubSpot or the lead notes, tag any enquiry whose `Campaign:` line says `organic-search`.

## Next three actions
1. Do the Search Console steps above.
2. Get a real Google Business Profile verified (service-area business, no street address shown) and ask real past customers for reviews. Local pack visibility depends on it far more than on page copy.
3. After about a month of Search Console data, double down on whichever page earns impressions, and write one genuine case page from a real finished job.
