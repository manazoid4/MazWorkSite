# Site-unity brief (shared by all builders) -- branch feat/site-unity-2026-10 @ 961d583

Owner: Maz (solo, 26, ex-finance + complaints). Live: https://www.mazworks.uk. Next.js app router, output:'export' (no next redirects; use vercel.json).

## Look (non-negotiable)
- Tokens are in app/globals.css :root: --cream --peach --sky-tint --plum --sun --pop-cobalt --pop-orange --pop-yellow --pop-pink --pop-lilac --pop-ink, plus --ink #302535, --muted, --line, --signal (= orange, primary button). Legacy --sage/--sand/--wheat/--clay/--mist/--slate/--charcoal are remapped to the new palette. NEVER add new hex values in CSS; use tokens.
- Base everywhere: cream background, peach / pale-blue cards (soft radius 8-16px, no heavy borders, no hard offset shadows), line icons, Manrope headings, ink text.
- Primary CTA: orange (--signal) with --ink text (never white on orange). Secondary buttons + links: plum.
- Pop moments: max 2 per page, from: cobalt hero band (text on it must be #fff/--cream, never ink), yellow highlight on ONE key word, pop price bars (/prices only), pink/lilac badge.
- Remove neo-brutal remnants in files you own: 2-3px ink borders -> 1px var(--line) or none; hard offset box-shadows -> none or soft.
- Readability: body >= 17px desktop / 16px mobile, max-width ~65ch on prose, line-height 1.55+, max 3 cards per row, one heading + one intro line + one primary action per section.

## Copy voice
"I" for Maz, "you" for visitor. Plain words, sentences <= 25 words, FK grade <= 8. No hype (leading, cutting-edge, seamless, unlock, elevate, solutions). Never invent testimonials, logos or numbers. Cut repetition, never facts/prices/services. Prices only come from app/offers.ts.

## Maz's decisions (round 1A)
- About block on home links to a new short /about (single source for the bio).
- /brand-kit -> redirect /for/creators (creators service stays at /for/creators). app/brand-kit/kit-icon.tsx is imported elsewhere: move it to app/kit-icon.tsx and update imports; do not lose it.
- /linkedin, /brag -> redirect /.
- /rotareason, /maz-core, /maz-pocket-ai: keep pages, remove from nav, add one card each on /proof ("Things I've built").
- One enquiry form on /contact (free preview is an option in it); /free-plan, /start -> /contact.
- /video, /managed-presence (and /missed-calls-calculator) fold into /local-businesses as sections with prices; old URLs -> /local-businesses#<section-id>.
- /b2b, /b2b/assessment, /complaints, /complaints-improvement, /audit fold into /professional-teams; keep /complaints/sample/board-report and /complaints/sample/health-check as sub-pages.
- Short footer: What I do, Prices, Proof, About, Contact, FAQ, Privacy, Terms + email.
- Also: /solutions + /services(+/services/[job]) fold into /for; /demos + /receptionist-demo* fold under /after-hours-receptionist; /work/* + /lab fold into /proof.

## Rules for removing a page
Before deleting a route: copy every fact, price, service, contact detail and useful demo into its target page, then add a row to your redirects file (docs/plans/redirects-<you>.json: [{"source":"/old","destination":"/new"}]) and to docs/plans/content-map-<you>.md (old route | what moved | new home). Update links pointing at removed routes (grep). Update/remove tests that assert removed routes. Never delete content without a home.

## Comment targets
docs/plans/comment-checklists.md; target PNGs in C:\Users\Maz\Desktop\MazWorks\Screenshots_With_Improvments\ (Read them).
