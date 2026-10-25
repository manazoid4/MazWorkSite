# Maz Works reimagination - shared plan (25 Oct 2026)

Branch: feat/site-reimagine (from main 45d066c). NEVER merge to main or deploy: Maz must approve.
Open PR #198 (feat/audit-fixes-2, 43 files, 23 Oct) is unmerged: do not touch; list anything worth porting in the report.

## Central idea (drives all copy)
"I find recurring problems in businesses and build practical ways to make them easier."
Founder-led, CS background, real experience handling financial complaints and escalations.
NOT: website agency, AI automation agency, corporate consultancy, SaaS, insurance-style services firm.

## Architecture: 7 primary pages, everything else kept reachable (HIDE not delete), no URL breaks
Primary nav (labels): What I do (/what-we-do) | My work (/proof) | Prices (/prices) | Tools and demos (/tools, NEW) | About (/about) | Contact (/contact). Logo = Home.
Four core service areas on /what-we-do: A websites and digital experiences, B customer enquiries and follow-up, C booking and operational improvements, D focused custom tools. 3D printing = separate small specialist strip linking /3d-printing.
Kept, but out of the primary nav (linked from What I do / footer / sitemap): /local-businesses, /professional-teams, /after-hours-receptionist, /for and /for/* (4 types, 10 niches), /faq, /free-membership, /3d-printing, /work/*, /terms, /privacy, /site-map.
Candidates to MERGE or REDIRECT (agent A decides with evidence; every redirect needs a test in tests/redirects.test.mjs): /whats-new, /maz-core, /mazos, /maz-pocket-ai, /rotareason, /receptionist-demo/make, /complaints/sample/*.
NEW: /tools hub (demos index, each labelled REAL CLIENT WORK / INTERNAL PROJECT / INTERACTIVE CONCEPT DEMO) and /tools/restaurant-tables (table picker demo).
Do NOT use /demos/* (vercel rewrite to api/demo-gate).

## Ownership (no overlap)
Agent A (information, words, SEO): app/nav.ts, app/site-chrome.tsx (footer), app/sitemap.ts, app/seo.ts, vercel.json redirects, app/what-we-do/**, app/prices/**, app/about/**, app/contact/**, app/faq/**, app/faqs.ts, app/proof/**, app/local-businesses/**, app/professional-teams/**, app/after-hours-receptionist/** copy, app/for/** copy, app/offers.ts COPY ONLY (never prices), metadata on every page, tests for these.
Agent B (visual, frontend, demo): app/page.tsx (home, incl. its copy), app/reimagine.css (NEW, imported once in app/layout.tsx; only B edits layout.tsx), app/home-*.css, app/tools/** (NEW), docs/restaurant-table-picker.md, DESIGN.md, tests for these.
Lead (me): build, full test run, screenshots, BUILD_STATUS.md, integration, PR.
Shared files (globals.css, sales.css): B may APPEND at the end only; A must not edit CSS except appending to a section marked /* A: ... */.

## Hard rules
- Keep colours: tokens in app/globals.css :root (cream, peach, sky-tint, sun, ink, plum, orange signal, cobalt, yellow, pink, lilac). No new hex values; change how they are applied.
- Prices ONLY from app/offers.ts. Do not change numbers. Do not invent testimonials, results, customer numbers, qualifications.
- Natural British English. "I" for Maz, "you" for the visitor. Avoid: unlock, seamless, empower, revolutionise, cutting-edge, leverage, solutions-driven.
- Preserve: enquiry form + /api/enquiry, analytics, receptionist demo, calculators, privacy copy (do not rewrite legal text without checking accuracy), redirects (only add), canonical metadata, JSON-LD.
- Do not run `npm run build` or `npm run verify` (parallel writers share out/.next). Run `npx tsc --noEmit` and targeted `node --test tests/<file>` only; lead runs the full build + all tests.
- Tests assert copy: when copy changes, update the asserting test in the same change, keeping the intent of the test.
- Static export (Next 16, output: export). CSP: no external scripts/fonts/images. No new dependencies.
- Distinguish REAL CLIENT WORK / INTERNAL PROJECT / INTERACTIVE CONCEPT DEMO. Never present a prototype as client work.
- Terminal/report output ASCII only.
