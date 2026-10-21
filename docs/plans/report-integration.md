# Report integration

Merged b1, b2, b3 into feat/site-unity-2026-10.

Conflicts (5): app/sitemap.ts (took b3's sitemap, kept b1's /about line, dropped /free-plan and /solutions); tests/b2b (header six links + footer eight links kept together); tests/objects (Objects page now checked on /proof, home-link and /demos assertions dropped because the short footer and the redirect removed them); tests/site-polish (b2 route list minus /linkedin); tests/static-export (b3 route list, "free plan" link check now /contact).

Redirects: 29 merged from b2 and b3 into vercel.json (permanent) plus /leak-check repointed to /contact?intent=preview; docs/plans/redirects.json is the merged list. Existing /demos/:slug rewrites kept. /receptionist-demo and /receptionist-demo/make were NOT redirected: B2 kept them as live pages (mic Permissions-Policy is path based) and they are linked from /after-hours-receptionist. /work/[slug] kept by B3.

Links: header CTA is now "Free preview" (NAV_CTA, /contact?src=nav#contact); footer already the short eight links + email. Repointed in app/: /free-plan -> /contact, /services/* -> /for#job-*, /lab -> /proof#built, /demos -> /after-hours-receptionist#bigger-builds, /scope-sheet, /refer, /complaints-improvement, /managed-presence to their new homes.

Tests: new tests/redirects.test.mjs (every removed route redirects, no destination is removed). Updated to the new reality: after-hours, local-businesses, customer-journey-pages, loops (referral on /contact#refer), leak-check (nav CTA "Free preview"), newsletter, niche-guides, site-v11, solutions, trade-context, trade-journey, objects. No price, contact, accessibility or analytics assertion was weakened. Vercel Analytics chunk test passes under Turbopack (it was a webpack artefact).

Verify: `npm run verify` green: typecheck, build, 337/337 tests, smoke.
