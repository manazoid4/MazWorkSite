# UK-wide SEO: recovery and plan (26 Oct 2026)

Maz Works is positioned UK-wide. No page, title, schema or doc in this repo targets a town, county or region. This branch (`seo/uk-wide-recovery`) recovers the useful work from PRs #207, #209 and #198 on top of current `main`, with the geography rewritten.

## Evidence rules
Nothing below claims search volume, keyword difficulty, rankings or traffic: none of it was measured. Search results were sampled with a US-based tool on 25 Oct 2026 (result lists only, no UK rank order, no People Also Ask). Search Console is not set up yet, so there is no first-party data. Anything marked *inference* is a judgement from who appeared in those samples.

## PR disposition
| PR | What it was | Recommendation |
|---|---|---|
| #207 | `/website-design` page aimed at two named places | **Close, superseded.** Page, nav links, schema, sitemap entry and tests are recovered here, rewritten for UK small businesses. The URL was already location-free, so no redirect is needed. |
| #209 | `/one-page-website`, `/missed-call-text-back`, `/website-cost`, organic attribution, `seo:audit`, `seo:vitals`, regression tests, canonical fixes | **Close, superseded.** All of it is recovered here unchanged except the docs, which are replaced by this file. |
| #198 | Older audit: wording, schema, a11y, plus a yellow hero and price-ladder styling | **Close, superseded.** The still-missing schema, a11y and first-person wording fixes are recovered here (13 files, `tests/tech-health.test.mjs`). Visual, pricing and removed-route changes were left out. |
| #211 | Logo and colour change | **Separate decision.** Not part of SEO; untouched. |

## Page intent check
| Page | Visitor problem | Distinct intent? | Action |
|---|---|---|---|
| `/website-design` | Needs a small business website, wants to know who builds it and how | Yes: "small business website design UK" | Keep (rewritten UK-wide) |
| `/one-page-website` | Wants a cheap single page, not a full site | Yes: purchase-led, Launch Page £295 (*inference*: few UK pages show a one-page price) | Keep |
| `/website-cost` | Researching price before contacting anyone | Yes: informational with buying intent | Keep |
| `/missed-call-text-back` | Losing callers when busy | Yes: few UK-specific results seen, mostly US SaaS (*inference*) | Keep |
| `/after-hours-receptionist` | Calls out of hours | Yes | Keep, linked from the new pages |
| `/local-businesses`, `/what-we-do`, `/prices` | Broad: what does Maz Works do and cost | Hub pages | Keep |
| `/for/*` (4 types, 10 trades) | Trade-specific problems | Yes, but thin-risk if multiplied | Keep; build no more until Search Console shows demand |

Skipped on purpose: town or county pages (doorway risk, and against the privacy rule), head terms like "business automation" and "booking system" (sampled results were SaaS and enterprise vendors, wrong intent for a one-person service, *inference*), and any generated article series.

## Route inventory
All 34 sitemap routes: **KEEP**. Eight deliberately **NOINDEX** demo or sample routes (`/receptionist-demo`, `/receptionist-demo/make`, `/maz-core`, `/maz-pocket-ai`, `/rotareason`, `/promo/brag/scene`, two `/complaints/sample/*`) keep self-referencing canonicals. `/3d-printing` stays indexable but out of the sitemap and menus (concept, 22 Oct decision). Retired pages already 301 through `vercel.json`; none redirect to the homepage. Revisit with Search Console data before removing or merging anything.

## Structured data
- Sitewide: `Organization` (was `Organization` + `ProfessionalService`, a LocalBusiness subtype that implies premises) with `addressCountry: GB` and `areaServed: United Kingdom` only. `priceRange` was dropped because it is not an Organization property. `WebSite` replaces `ProfilePage`.
- Service pages: `Service` with `areaServed: Country United Kingdom` and offers read from `app/offers.ts`.
- Never added: street address, town, opening hours, ratings, reviews, LocalBusiness.

## Checks that keep this from regressing
- `npm run seo:audit` (run by `tests/seo-regression.test.mjs`): one h1, unique titles and descriptions, canonicals, JSON-LD parses, alt text, internal links, sitemap and robots.
- `tests/seo-landing.test.mjs`: `/website-design` is UK-wide, with no place names, and its schema says United Kingdom.
- `tests/static-export.test.mjs`: hashed personal-detail check on every exported file, now with no exceptions, and no premises-based schema.
- `node scripts/seo-vitals.mjs`: a mobile lab check that needs a running static export.

## What only Maz can do (about 15 minutes)
1. Search Console: add `www.mazworks.uk`, submit `https://www.mazworks.uk/sitemap.xml`, then request indexing for the four landing pages once merged.
2. After 2 to 4 weeks, export queries and pages. That data, not this file, decides the next page.
3. Google Business Profile, if wanted: service-area business with the address hidden. Check the "service area" setting does not list a town.
