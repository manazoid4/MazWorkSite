# Routes: inventory and decisions (Agent A, 25 Oct 2026)

Branch `feat/site-reimagine`. Actions: KEEP (unchanged place, words may change), MERGE (content now lives on another page, old URL redirects), REIMAGINE (rebuilt), REMOVE (page deleted, URL redirects), HIDE (stays live, out of the primary nav, linked from a parent page or the site map).

**No analytics data was available.** Nothing here is based on traffic, rankings or conversion. Decisions rest on internal link counts (grep of `app/`, `tests/`, `scripts/`), the structure in `PLAN.md`, and what each page says. Sitemap priorities are a hint to crawlers only. Check Vercel Web Analytics and Search Console after launch before trusting any of it.

## Primary navigation (six links and one button)

| Label | URL | Action | Notes |
| --- | --- | --- | --- |
| What I do | `/what-we-do` | REIMAGINE | Four service areas A to D and a 3D printing strip. Data in `app/what-we-do/areas.ts`, exported as `SERVICE_AREAS` so the home page can reuse it. |
| My work | `/proof` | REIMAGINE | URL kept (many inbound links, `/lab` and `/work` redirect here). Three labels: Real client work, Internal project, Interactive concept demo. |
| Prices | `/prices` | KEEP, simplified top | Every price and term still comes from `app/offers.ts`. Hero, jump line and metadata rewritten. |
| Tools and demos | `/tools` | NEW (Agent B) | Linked from the header, menu, footer, `/what-we-do` and `/proof`. Added to the sitemap. |
| About | `/about` | REIMAGINE | Genuine background only. |
| Contact | `/contact` | KEEP, reworded | Form, `/api/enquiry`, call booking and referral section untouched. |
| (button) Free preview | `/contact?src=nav#contact` | KEEP | `NAV_CTA` in `app/nav.ts`. |

Phone menu (`MENU_LINKS`): the six, plus Who it's for (`/for`), FAQ and Everything else (`/site-map`). Footer (`FOOTER_LINKS`): the six, FAQ, Privacy, Terms, plus the email. Both live in `app/nav.ts`; `app/site-chrome.tsx` reads them.

## Every route

| Old URL | New home | Action | Reason and SEO note |
| --- | --- | --- | --- |
| `/` | `/` | KEEP (Agent B rewrites) | Highest priority in the sitemap. Not edited here. |
| `/what-we-do` | same | REIMAGINE | Old page was the three "buckets" plus a how-it-works block. The how-it-works block (`#why`) is kept word for word because tests and the nav point at it. Old anchors `#get-customers`, `#serve-customers`, `#keep-improve` were only used by the old page and tests. |
| `/prices` | same | KEEP | Highest-intent page. Title now says what is on it. `#websites`, `#systems`, `#monthly`, `#extras`, `#care`, `#keep-improve`, `#after-hours` all kept. |
| `/proof` | same | REIMAGINE | Keeps `#built`. New anchors `#client-work`, `#own-product`, `#concept-demos`. |
| `/about` | same | REIMAGINE | Short; links to `/contact` and `/proof`. |
| `/contact` | same | KEEP | Anchors `#contact`, `#free-preview`, `#scope`, `#refer`, `#leak-check-form` kept (redirects from `/refer`, `/scope-sheet`, `/free-plan` depend on them). |
| `/faq` | same | KEEP, reworded | FAQPage JSON-LD built from `app/faqs.ts`, still valid. Reached from the menu and footer. |
| `/tools`, `/tools/restaurant-tables` | same | NEW (Agent B) | Added to `app/sitemap.ts` and `NAV_GROUPS`. |
| `/local-businesses` | same | HIDE | Linked from `/what-we-do`, `/for` pages, `/after-hours-receptionist`, `/site-map`. Several old URLs redirect into its anchors (`#video`, `#managed-presence`, `#missed-calls-calculator`), so it must stay. Removed from the header. Sitemap priority 0.9 kept because it is a strong landing page for "missed calls" searches (assumption, not data). |
| `/professional-teams` | same | HIDE | Same reasoning. `/b2b`, `/complaints`, `/audit` redirect into it. Headline rewritten to drop the corporate slogan. |
| `/after-hours-receptionist` | same | HIDE | A product page with its own price (`AFTER_HOURS`). Linked from `/what-we-do`, `/local-businesses`, `/prices`, every `/for` page. Stripped "Maz sets it up himself" and "demo" wording. |
| `/for`, `/for/{trades,appointments,creators,offices}` | same | HIDE | Four type pages. Linked from the menu ("Who it's for"), `/what-we-do`, `/site-map` and service-job links. |
| `/for/{heating-and-plumbing,roofers,builders,electricians,salons-and-beauty,dog-groomers,garages,cafes-and-food,clinics-and-therapists,architects}` | same | HIDE | Ten trade pages. Reachable from `/for` and `/site-map`. Kept for long-tail search. Removed two visible "To update" placeholder boxes (dog groomers, clinics). |
| `/free-membership` | same | HIDE | Linked from `/site-map`; `/free-templates` and `/free-toolkit` redirect here. Not edited. |
| `/3d-printing` | same | HIDE | Strip on `/what-we-do` links to it. Stays out of the sitemap, menu and footer (decision of 22 Oct, asserted in `tests/objects.test.mjs`). Not edited. |
| `/work/jobfilter`, `/work/scrap-finance-partners` | same | KEEP | Case-study pages, in the sitemap (0.8). Not edited. |
| `/site-map` | same | KEEP | Reads `NAV_GROUPS`. Small edit to its extra groups (labels, retired link removed). |
| `/terms`, `/privacy` | same | KEEP | Not rewritten. See "Privacy and terms check" below. |
| `/whats-new` | `/proof` | REMOVE, 301 | A changelog of site changes from 27 Sep to 2 Oct. Nothing a buyer needs. Inbound internal links were only the site map and two QA scripts, all updated. Page and `app/updates.ts` deleted. Test in `tests/redirects.test.mjs`. |
| `/mazos` | `/proof#built` | REMOVE, 301 | Already a noindex "this page has moved" stub that pointed at `/proof#built`. A real 301 is better than a stub. Only inbound link was `scripts/smoke.mjs` (updated). Test added. |
| `/rotareason` | same | HIDE | noindex demo. Listed on `/proof` as an Interactive concept demo and on the site map. Redirecting would break it. |
| `/maz-core`, `/maz-pocket-ai` | same | HIDE | noindex private consoles. Listed on `/proof` as Internal projects. |
| `/receptionist-demo` | same | HIDE | noindex voice demo linked from `/after-hours-receptionist` and trade pages. Mic permission is path based (`vercel.json`), so the path cannot move. |
| `/receptionist-demo/make` | same | HIDE | Maz's own link-maker. noindex, no inbound links. Keep. |
| `/complaints/sample/health-check`, `/complaints/sample/board-report` | same | HIDE | noindex printable samples. Linked from `/professional-teams` and used by `scripts/make-complaint-samples.mjs` to make the PDFs. Keep. |
| `/promo/brag/scene.html` | same | HIDE | Static promo file under `public/`. Not touched. |
| `/demos`, `/demos/*` | gate | KEEP | Rewrite to `api/demo-gate`. Not touched. `/demos` itself redirects to `/after-hours-receptionist#bigger-builds`. |

### Redirects added (vercel.json)

| Source | Destination | Permanent | Test |
| --- | --- | --- | --- |
| `/mazos` | `/proof#built` | yes | `tests/redirects.test.mjs` |
| `/whats-new` | `/proof` | yes | `tests/redirects.test.mjs` |

No other URL was merged or removed. All existing redirects are untouched.

## SEO notes

- **Titles and descriptions.** Every page I own has a title that fits 60 characters **after** the layout adds " — Maz Works", and a description of 155 or fewer. `tests/nav.test.mjs` checks this for ten pages. Canonical metadata is kept or set on all of them.
- **Sitemap** (`app/sitemap.ts`). Ordered by importance. Added `/tools` (0.8) and `/tools/restaurant-tables` (0.6). Removed `/whats-new`. `/3d-printing`, `/receptionist-demo`, `/rotareason`, `/maz-core` and `/maz-pocket-ai` stay out. Dates on rewritten pages set to 25 Oct 2026.
- **Internal links.** The six header links each point at a page that is in the sitemap. Hidden pages are linked from at least two live pages (checked by grep). Dead anchors from the old `/what-we-do` (`#get-customers` and friends) were only referenced by the old page.
- **Structured data.** FAQPage on `/faq` and `/after-hours-receptionist`, Service on `/what-we-do`, `/prices`, `/for/*`, `/local-businesses` (video) and the receptionist. Left as they were. The `/faq` answers changed, so the markup changed with them.
- **Headings.** One H1 per page. `/what-we-do` has H1, then H2s per section.
- **Risk.** Renaming "Proof" to "My work" in the header changes anchor text only, not URLs. The word "proof" no longer appears in the primary nav; the URL still contains it. If you want the URL to match the label later, add a redirect from `/proof` and update the many tests and inbound links.

## Privacy and terms check (not rewritten)

I read `app/privacy/page.tsx` and `app/terms/page.tsx` for consistency with the new site. They still match, with these notes:

1. Privacy lists forms, anonymous visit counts, private client demos (essential cookie), the receptionist and the missed-calls calculator. The new `/tools` pages store nothing (no storage, fetch or form in `app/tools/`), so no change is needed. If Agent B adds a form or storage there later, privacy must change.
2. Terms mention "bigger-build previews", which refers to the gated `/demos` area. That area still exists. Consistent.
3. Nothing in either document names a page I removed.
4. Both documents still reflect the claim "I never need your passwords" and "accounts in your name", as the new pages do.

## Needs Maz to confirm

Claims I could not verify from the repo. None was invented by me; most already existed. Each needs a yes, a change, or removal.

1. **"Five years" in complaints and finance.** Kept on `/about`, `/faq` ("Why should I trust you?", "What if we disagree"), `/proof` and `/professional-teams`, and in `app/manazir-line.tsx`. Confirm the number and whether "financial complaints and customer escalations" is the right description.
2. **Removed because I could not verify them:** age (26), "thousands of angry customers", the internet service provider story with "accounts worth hundreds of thousands of pounds", "regulated finance" and "ombudsman cases". `app/manazir-line.tsx` (the home About block, Agent B's) still says "I'm 26" and "thousands of angry customers". Decide and align.
3. **Computer Science, Swansea University.** Allowed by `AGENTS.md`. The About page says "Computer Science graduate (Swansea University)". Confirm he wants the university named on the new About.
4. **Photo to quote.** Shown on `/what-we-do` as one example of a custom tool, clearly "not a ready-made product". No such tool or demo exists in the repo. Confirm he is happy to name it, or whether a demo should be built for `/tools`.
5. **Scrap Finance Partners as "Real client work".** `app/projects.ts` says the client did not pay; the label avoids any mention of payment. Confirm the client agrees to be listed and that "Real client work" is fair for an unpaid build.
6. **JobFilter as "Internal project".** It is Maz Works' own product. No customer count or result is claimed. Confirm the label.
7. **3D printing status.** `/proof` says "Concept, not yet made". `/3d-printing` shows bundles with prices and an enquiry form. `/what-we-do` says "I am developing... It is still a concept". Confirm which is true. I removed the "fixed price from £29" line from `/proof` because it is a price outside `offers.ts`.
8. **Monthly review promise.** After-Hours Receptionist copy says "I review calls each month" and "Monthly tuning included". Confirm he will do it.
9. **Competitor claims** in `app/after-hours-receptionist/content.ts` (`COST_MODEL`: "some call-answering services... charge for every extra call... prices shown before VAT") and `OWN_VS_RENT` in `app/price-list.tsx` ("UK list prices seen in October 2026"). Generic, hedged, and not sourced in the repo. Keep only if he has the evidence on file.
10. **Reply time.** `CHECK_REPLY_TIME` ("1 working day") is quoted in several places. Confirmed 27 Sep per tests; reconfirm it is still realistic.
11. **"Free for any UK business".** Kept on `/contact`. The old text added "in any trade". Confirm there are no exclusions.
12. **Video Full-Day Shoot £250** is marked "proposed, Maz to confirm" in `AGENTS.md`. Still live on `/local-businesses`. Not changed.
13. **Header button wording.** `AGENTS.md` says the shared primary action is "Tell me what's not working". `ENQUIRY_CTA` in `app/site.ts` is "Get my free preview", and many tests assert that. I kept `NAV_CTA` as "Free preview". Decide which label wins, then change `site.ts` and the tests together.

## For the lead

- `npx tsc --noEmit` reports two errors from the stale shared `.next/types` (`app/mazos/page.js`, `app/whats-new/page.js`). They disappear after the next build.
- I deleted `app/mazos/`, `app/whats-new/` and `app/updates.ts` in the working tree (not committed, not staged).
- Files outside my list that I touched, minimally: `app/site-map/page.tsx` (labels, retired link), `app/proof-parts.tsx` (labels and grouping, used only by `/proof`), `app/price-list.tsx` (not touched), `scripts/smoke.mjs`, `scripts/verify-customer-path.cjs`, `scripts/verify-marketing-accessibility.cjs` (retired routes). Tests changed: `redirects`, `static-export`, `site-polish`, `proof`, `professional-offering`, `b2b`, `customer-journey-pages`, `leak-check`, `objects`; new `tests/nav.test.mjs`.
- `app/three-buckets.tsx` is no longer used by `/what-we-do`. The home page may still use it. If Agent B drops it, delete the file and `tests/three-buckets.test.mjs` in the same change.
- Not reviewed: PR #198 (`feat/audit-fixes-2`). I did not open it, so I cannot say what is worth porting.
