# Report B2

**Changed**
- /contact: one form (DemoRequestForm, `contact` mode) with the next-step choice visible; "A free preview and fixed price" uses api/enquiry with trade/package/source context and draft reply. `?intent=setup` is the old /start intake. Sections: #free-preview, #scope, #refer. Form id `leak-check-form` kept so old hashes land.
- /prices: cobalt hero + pop price-ladder bars (mapped to --pop-* tokens); bucket list replaced by a link to /what-we-do; PriceList links go to /contact.
- /local-businesses: sections #video, #managed-presence, #missed-calls-calculator (prices from offers.ts), plain website/Google list; restyled.
- /after-hours-receptionist: restyled (no hard borders/shadows, plum night card); #bigger-builds folds /demos. /receptionist-demo and /receptionist-demo/make stay at their URLs (mic Permissions-Policy in vercel.json is path based); restyled.

**Routes removed** (rows in docs/plans/redirects-b2.json, content-map-b2.md): /free-plan, /start, /scope-sheet, /refer, /video, /managed-presence, /missed-calls-calculator, /content-day, /demos. /make does not exist.

**Tests changed**: video, demos, contact-landing, checkout-intake, leak-check, loops, local-businesses, after-hours, enquiry, site-v11, site-polish, naming, niche-guides, three-buckets, customer-journey-pages, static-export (route lists and form source moved to /contact).

**Still failing (not mine)**: sitemap and nav/home links to removed routes (sitemap.ts, nav.ts, site-map, home, lab, system-explorer, many `/free-plan?...` links rely on the redirects); bucket illustration CSS test; Vercel Analytics chunk test (build used `next build --webpack` because turbopack rejects the linked node_modules).

**Not done / risks**
- Printable scope-sheet generator dropped (page text kept on /contact#scope).
- Free-preview quick-pick chips and two-step wizard dropped; deep-link context (package, trade, audit, business, referred_by) is kept.
- Redirect for /free-plan and /start assumes Vercel merges the original query string into the destination query; verify on preview. The redirects are not yet in vercel.json.
