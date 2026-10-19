# Session handover history (archived on 19 Oct 2026; includes entries before the latest three)

## 1 Oct: playbooks, simpler promises (PR #98)
- Maz confirmed Brand Kit at £395. "Half now, half later" wording removed everywhere (reads as desperate); promises are now free demo first, one fixed price, no contracts.
- Homepage About has a Connect on LinkedIn button; the footer already links the company page. Maz's personal profile URL is still needed.
- Five playbooks for other agents in `docs/playbooks/` (ship a change, offer and voice, design, forms and conversion, leads), linked from `AGENTS.md`. Claude usage resets Sunday 4 Oct; other agents should follow these until then.
- Maz to do: merge #98; send personal LinkedIn URL; decide #88.

## 30 Sep, late: Brand Kit for creators + About/LinkedIn (PR claude/brand-kit)
- PR #97 merged and live.
- New `/brand-kit` page for people who sell through social media (trainers, coaches, makers, bakers, stylists, artists). Brand Kit £395: your look, a one-page website, a profile that sells, 12 post templates, a buy button, Google listing. Six creator add-ons, three reusing standard add-on prices. All data in `BRAND_KIT*` in `app/offers.ts`; bright icons in `app/brand-kit/kit-icon.tsx`. Linked from the phone menu, footer and sitemap; `?package=Brand Kit` pre-fills the form. No lead names on the site (leads stay private).
- Homepage About now says Maz studied Computer Science at Swansea University and links to the Maz Works LinkedIn page.
- Next (queued, not done): add Maz's personal LinkedIn profile URL once he gives it (not found in any repo); add a LinkedIn follow link to the footer and `/brand-kit`; tag outbound LinkedIn links with UTM; a browser check of `/brand-kit` at 390px; a guard test for the Brand Kit page.
- Maz to decide: is £395 the right Brand Kit price?

## 30 Sep, evening: menu, colour, free live demo, LinkedIn funnel (PR #97)
- Batches 1–3 and the Next 16.3.8 security bump (#96) are merged and live on www.mazworks.uk. #88 (older real-direction homepage) is still open: 22 conflicts with the batches, waiting on Maz to close it or cherry-pick from it.
- Phone menu is 7 links (`MENU_LINKS` in `app/nav.ts`); the full map stays in the footer and `/site-map`. The footer is two columns on phones, deep green, and no longer links GitHub (posting rules).
- Palette: the candy pastels are gone. The base is sand/sage/mist/clay/wheat, and a 15-site audit added a measured pop: deep green `--deep`, orange-tinted pill labels, a marker highlight on headline `<em>`, a glow behind phone mockups, and a tint per trade card. Orange stays the action colour.
- **Free demo = call first (Maz, 30 Sep).** The self-serve animated demo was removed. The route is:
  1. A 15-minute call.
  2. On the call, agree what the demo shows and the date it arrives.
  3. The free demo arrives by that date.
  4. If they're happy, the full plan with one fixed price, every item invoiced clearly and no extra charges.
  5. Build: half to start, the rest when it works.
  6. 2 months of unlimited changes from go-live.

  Source of truth: `DEMO_STEPS` and `CHANGES_WINDOW` in `app/offers.ts`.
  - Changes are fenced. Adjustments to what was built are unlimited; a new system, feature or app is priced first.
  - Tests in `tests/demos.test.mjs` guard this.
  - It is shown on `/demos`, `/what-we-do`, `/prices` and `/linkedin`, and in the homepage promises.
- `/what-we-do` is interactive:
  - a live estimator: sliders and share chips, no preset numbers;
  - "How I set it up" tabs;
  - a system picker that runs each system's steps;
  - an example plan whose findings open and whose quote recalculates.
- Section pills are bold multi-colour with dark text, and the hero no longer says "UK". The footer is back on the page colour. Animations are about 30% faster.
- `/linkedin` (noindex) is the one LinkedIn link: a hello, the free demo path and the promises. Copy pack: `docs/maz-works/LINKEDIN-FUNNEL.md`.
- Found, not touched:
  - The main checkout `C:\Users\manaz\mazos-site` has 9 uncommitted Objects files, on branch `agents/objects-sales-clarity` (from 8 Sep).
  - These local-only branches were never pushed: `agents/maz-works-enquiry-resilience-20260921` (3 commits), `agents/maz-works-client-funnel` (Aug) and `agents/lead-quality-v2-20260928` (its brief is already in main).
- Maz to do: merge #97; paste the LinkedIn headline, About, Featured, banner and Website link from the pack; post the launch post; decide #88.

## 30 Sep: Brief 3, all three batches (PRs stacked: Batch 1 → 2 → 3)
- Batch 1 (Codex, finished by Claude): `app/systems.ts` is the one source of truth for systems; the palette is hi-vis orange on off-white (lime and cream are gone, including the favicon, drawings and share images); the homepage has 5 sections; there is a new `/what-we-do`; `api/enquiry.js` sends an instant confirmation through Resend with FormSubmit as the fallback; reply time is 1 working day everywhere (`CHECK_REPLY_TIME`); trade-guide examples lead with the lost customer or lost time and name their system.
- Batch 2: "Build my system" (homepage, `/what-we-do`, every trade guide) priced by `quotePlan()` in `offers.ts`, unit-tested against the Offer v9 rules; the cost calculator uses only the visitor's own numbers; the hero phone is playable (Call, then Book); cards lift and draw their icon; scene tabs swipe; the compare table highlights a column; `<details>` open smoothly; scroll-driven reveal where supported.
- Batch 3: cross-document View Transitions (the header stays, a package card morphs into its section); trade guides show their top 3 scenes and a builder preset to the trade; the free plan form is 2 steps with a progress bar, a summary and a success tick (without JS it is still one form posting natively); a video slot stays hidden until Maz's file exists; the sticky CTA shows only after the hero and hides near the form and footer; CSS went from 10 global files to 4 (`globals`, `enquiry`, `sales`, `wayfinding`), with 50 full-page screenshots pixel-identical before and after.
- Maz to do: test the form on the preview with your own email (the confirmation must arrive); reply to every request within 1 working day; record the 60-second walkthrough and fill in `WALKTHROUGH_VIDEO` in `app/walkthrough-video.tsx`.

## 28 Sep, night: Lead Quality v2
Lead rules changed to Lead Quality v2 (brief: `docs/maz-works/LEAD-QUALITY.md`; canonical in the knowledge vault). Leads are found by a repeated business problem with evidence and a named paid fix, not by website cosmetics. Gold does not need a limited company; Ltd status only decides whether cold email is allowed. Existing leads were re-scored and a new batch of 20 (12 Gold, 8 Silver) was researched from dated job ads; all names and contacts stay in the private leads repo and HubSpot. No site code changed.

## 28 Sep, later: Codex plan audit (form truth, one-job Starter on guides)

- Confirmation email: a real test showed the form email reaches Maz's Gmail in seconds, but no auto-reply arrived. FormSubmit's docs confirm autoresponses do not work over AJAX. The in-page message no longer promises an email; the auto-reply stays only on the no-JavaScript route, where FormSubmit supports it.
- Trade guides: Starter £195 lines now describe one job only. The second job each guide mentioned is shown as its own priced add-on (reminders £79, missed-call text-back £95, quote follow-up £95, review requests £95, online booking £95). Prices come from `app/offers.ts`. Every line has a link that pre-fills the free plan form. A test blocks bundled Starter lines.
- Homepage: a one-line link to real work (JobFilter, Scrap Finance Partners) now sits beside the free plan form.
- Browser-checked: package pre-fill from /prices, guides and the homepage; unknown `?package=` ignored; problem buttons add and remove text without losing typed words; one POST on double-click; failed send keeps text and offers email; no-JavaScript form posts natively. No overflow at 320, 390, 768 or 1440px.
- Not done, on purpose: the petrol/green recolour (no evidence it lifts enquiries, high risk of churn), CSS merging (Next already ships one CSS file per page), paid analytics.

## 28 Sep: sales pass (shorter homepage, tap-to-pick)

- Maz confirmed Offer v9 stays; the older brief built on the retired £395 Repair was out of date and was not used. Most of that brief (one form, sticky CTA, example plan, trust strip, analytics events, schema) was already live, so only three new things shipped.
- Homepage prices now sell one first step: Starter £195, four popular add-ons, a short "Bigger jobs" list, promises and the guarantee. The comparison table, all twelve add-ons, care plan and "What's not included" moved to a new `/prices` page (in nav, sitemap and footer). Homepage on a 390px phone: 12,578px → about 10,270px tall. Homepage word budget lowered 1,900 → 1,600.
- Free plan form: `_autoresponse` added (later found to work only on the no-JavaScript route; see above). Research: only 23% of UK customers say they'd definitely try again after a slow reply (Moneypenny/Censuswide, 2026), and competitors promise replies in 2 to 24 hours.
- Free plan form: six tap-to-pick problems (Missed calls, Slow replies, No-shows, Chasing quotes, Reviews, Copying details) fill the text box, so owners type less on a phone. Price cards pre-fill "Asking about: <package>" through `?package=` (only real package/add-on names accepted).
- Location is not published anywhere (AGENTS.md rule, confirmed again by Maz 28 Sep).

## 27 Sep: navigation audit and architecture visuals

- Follow-up, six wayfinding helps: What's new (current, linked in every footer), human site map `/site-map`, helpful 404, header marks the current section (`aria-current`), homepage On this page jump bar, Back to top link.

- Audit: on phones the header showed only "Free quote"; trade guides were linked only from inside the quote page; Objects only from the footer; no breadcrumbs or trade hub.
- Fix (NN/g "combo" navigation, Xero-style grouped menu): desktop header shows Prices, Who it's for, Objects, FAQ plus Free quote; phones get Prices plus a labelled Menu button with every route in three groups. Footer uses the same groups (`app/nav.ts` is the one map). New `/for` hub, breadcrumbs with BreadcrumbList schema on guides, `/for` and Objects.
- Architecture: four illustrative CAD-style drawings in `public/architecture/` (massing model with QR plaque, site plan, floor plan, scaffold elevation), each labelled illustrative. Objects has a full Architecture & property section; the architects guide shows two drawings and links to it. Presentation drawings only, never structural or scaffold design.
- Tests: every main page links to the key routes and has the menu button; drawings labelled illustrative; shared nav chrome excluded from page word budgets; Objects budget 1,100.

## 27 Sep 2026 — Audit of the architects work (PR #75/#76)
Checked by Claude against AGENTS.md and the live site. Sound: no researched practice is named in this repo, architects stay a use case through `NICHE_GUIDES`, no new pricing tier. Improved: every trade guide (including architects) was headlined "Website leaks on…" / "Enquiry gaps on … websites", which contradicts the positioning, so all six now lead with the outcome (e.g. "Turn portfolio interest into qualified architecture projects"); fix lines now describe systems, not website repairs; "What fixing it costs" became "What I'd set up, and the price"; the architectural-models FAQ now says "simple concept or massing models, possibly" because no model has been printed yet. A new test blocks website-fix headlines and wording on the guides.

## 27 Sep 2026 — Offer v9: ManyPets-style clarity, consistent prices
Maz asked for the Google profile, website page and training prices to come down and for every service to be explained as clearly as ManyPets explains its insurance. The homepage now has a side-by-side "Compare packages" table (same rows for each package, plain answers), four short promise blocks (fixed price first, half now half when it works, no contracts, no VAT), add-ons grouped under Win and keep customers / Get found and trusted / Less admin / Help for your team, and a "What's not included" list. New prices: Google Business Profile setup £49, single website page £145, team training £39 (one-hour call plus a written guide). Consistency rules in `app/offers.ts`: standard add-ons can be bought alone; Extra automation only adds a second job to a package; the weekly report is included free in a Business System.

## 27 Sep 2026 — Offer v8 + architects test shipped

Claude session `01KHHDcykQuZunqoEKFvr7a5` completed through PR #74 before its limit was hit. Offer v8 was the source of truth at that point (now Offer v9, see above): Starter Automation £195, Business System from £795, Custom Software & Websites from £1,950, Keep It Running £19/month, with scoped optional add-ons; AI may be used behind the scenes but is never advertised or sold.

PR #75 is merged to `main` as `6467a46331766bc48f80859a8b9c25f0903f1ccb`. It adds `/for/architects` through the existing `NICHE_GUIDES` system using anonymised observations from live UK architecture-practice websites, maps the fixes onto Offer v8, and adds one restrained `Architecture & property` use case to Maz Works Objects for simple concept/massing/site/presentation models from suitable files, optionally linked by QR/tap. There is no claim that Maz has already produced an architectural model, no separate architect pricing, no new brand and no homepage architecture section.

The first protected CI run caught one useful issue: the Objects page reached 936 words against its existing 900-word budget. The new architect copy was shortened instead of weakening the guard; the second run passed typecheck, dependency audit, static build/export, all deterministic HTML/link tests and smoke, and Vercel also passed. Tests keep current Offer v8 prices, anonymity and physical-product truth limits enforced.

### Next agent
- Read `AGENTS.md`, current `app/offers.ts`, and the private architect context pack first; do not work from Offer v7 or older handoffs.
- Treat PR #75 as complete. Do not rebuild the architects page or broaden it into a print bureau, separate architecture brand, homepage section or new pricing model.
- If Maz wants to validate the physical angle, the next proof is one clearly labelled fictional/concept architectural demo linked to one project page — not a catalogue.
- Keep the main priority on first-client acquisition and the existing open sales/outreach to-dos.

### Standing guardrails
Maz Works remains a systems/automation/custom-software business for UK small businesses and teams, with websites and physical objects as routes inside the offer. Never invent clients, results or testimonials; never publish Maz's location, personal email or phone; never advertise AI; and use branch + PR rather than pushing directly to `main`.


---

## Entries moved from the public handover on 19 Oct 2026

## 18 Oct: receptionist flat price + £99 set-up, and a Content Day offer
- `/after-hours-receptionist` gains a "One flat price, not a meter" block that sets the flat fee against a metered service, and the **£99 one-off set-up is now live site-wide** from one switch in `app/offers.ts` (the receptionist page, `/services`, `/solutions`, `/prices` and the contact line all follow it). The in-page example call now answers as the visitor's own business, with no microphone and no phone line. Cost model updated: payback falls from 7.0 to 3.6 months.
- New offer and page `/content-day`: a flat **£300 day rate** for a full day on site — full photos and short clips, edited and sorted for the website, Google listing and social. Paired with a Launch Page at its live £295, the two come to **£595**. The page spells out the exact files, a named step-by-step process, a private review gallery, a plain usage licence and the honest limits.
- No competitor is named and no price is typed outside `app/offers.ts`; nothing about clients, results or testimonials is invented, and no camera-hire wording is used. `npm run verify` green (304 tests).

## 18 Oct: CRO Move 5 — the three loops
- New `/refer` page with a tiered reward: £50 for a Starter or a Launch Page, £150 for a Business System, a Website or After-Hours call answering, and £300 for custom software, paid by bank transfer within 7 days of the referral's first invoice. Linked in the menu and the footer. The tiers live in `REFERRAL_TIERS` in `offers.ts`; the FAQ keeps its short line and points at the page.
- New standalone `/missed-calls-calculator`: the visitor's own calls-a-week, share missed and job value give a monthly figure, and that number is gated behind the same two-field demo form as the hero, posting to the same place as `/free-plan`. Linked from `/refer` and the sitemap, and it keeps working without JavaScript.
- A quiet build-credit line ("Built by Maz Works") now sits in shipped artefacts: the example scope sheet and the demo-business message example, and it is explained on `/refer`. Nothing about clients, results or testimonials is invented.
- Homepage stays inside its 600-word budget (598). `npm run verify` green (300 tests, smoke pass). Before/after browser shots at 390px and 1280px in `docs/evidence/2026-10-18-cro-move5/`.

## 18 Oct: CRO Move 4 — the offer is named "free preview"
- "Free demo" is renamed to "free preview" site-wide, and the free step now carries the honest one-line explanation: it is built from a template on a test setup, so it is not on your apps yet. The honest line sits in `FREE_STEP`, on the homepage, `/free-plan` and the FAQ.
- The internal package labels are plain words now: "one-day set-ups" → "small set-ups", "Keep It Running" → "Care plan", "Keep It Growing" → "Care plan plus". The offer name, the primary CTA (`Get my free preview`), the enquiry emails and the API service whitelist all match.
- "Bigger build demos", "demo business" and private-demo-gating keep the word "demo" on purpose; those are examples, not the free offer. A new `tests/naming.test.mjs` locks the name, the honest line and the retired phrases.
- Homepage stays inside its 600-word budget (595). `npm run verify` green (296 tests, smoke pass). Before/after browser shots at 390px and 1280px in `docs/evidence/2026-10-18-cro-move4/`.

## 18 Oct: CRO Move 3 — a two-field start in the hero
- The homepage hero no longer sends people to a section to start. It asks for an email and a name (email first) and posts to the same place as /free-plan, with a "Book a time now →" slot for anyone who would rather talk. It is a real form, so it still posts without JavaScript, and no phone number is published.
- The full /free-plan form now asks for the email before the name. The hero carries the only booking link on the homepage; the duplicate call link in the "Your free demo" block is gone.
- Homepage stays inside its 600-word budget (589). `npm run verify` green (291 tests, smoke pass). Before/after browser shots at 390px and 1280px in `docs/evidence/2026-10-18-cro-move3/`.

## 18 Oct: CRO Move 2 — the proof gap, honestly
- New `/proof` page. It shows the two things anyone can open today (JobFilter, Scrap Finance Partners), states plainly that there are no published client quotes or reviews yet, and sets out the Founding Client offer (your first job at a founder's discount, agreed in writing, in exchange for a nameable quote, a photo and a review — all optional).
- Guardrail written into the page and locked by a test: never invent a client, logo, result or number. Linked from the footer, the homepage ("Proof →") and the sitemap.

## 18 Oct: CRO Move 1 — homepage hero names the pain
- The homepage hero now leads with the missed-call pain ("Miss a call and they get a text with a booking link, before they ring someone else"), one primary CTA ("Get my free demo"), and a risk-reversal line ("No working, no invoice.") above the fold. The secondary "Watch it work (22s)" hero link moved out; the 22-second example still sits in the "See it working" section.
- Homepage stays inside its 600-word budget (582). `npm run verify` green (287 tests, smoke pass). Before/after browser shots at 390px and 1280px in `docs/evidence/2026-10-18-cro-move1/`.

## 17 Oct: pricing explained through business jobs
- All six packages now explain the repeat work or customer journey they handle, who they suit and a practical sign-off check. Creator Starter has a full pricing card; receptionist demo checks appear on both pricing pages.
- Prices, included quantities and payment terms are unchanged. Care descriptions clarify the existing time limits; app, text and hosting costs are agreed before building.

## 17 Oct: Stripe receptionist checkout (#160)
- Created and verified the live GBP 79/month subscription Payment Link; wired it into the receptionist and prices cards. The first month is charged at checkout, after the customer has heard their demo. No secret key is stored in this repo.
- Setup intake uses neutral payment wording and asks for call-answering details. Payment must be confirmed in Stripe before setup; visiting `/start` proves nothing about payment.
- Awaiting merge approval. Phone service provisioning and a real payment transaction are outside this change.


---

## Remaining entries moved from the public handover on 19 Oct 2026

## 14 Oct: homepage video swapped
- Homepage example video replaced with the new 22 second Maz Works clip (quote chased, booking, invoice), 4:5 portrait, captions kept, labelled not a real customer.

## 11 Oct: event Proof Pass concept (documentation only)
- Reusable NFC networking card, "I owe you proof. Not a pitch.", with an agreed bounded test demo and optional seven-day personal return walkthrough. Full proposed brief: [EVENT-PROOF-PASS.md](EVENT-PROOF-PASS.md). Canonical strategy in the Maz Works Knowledge Vault. No card production, website feature, new free full-build offer or automation has been launched.

## 10 Oct: receptionist finish pass (#137 merged, #139 merged, #140)
- #137 merged the finish pass: call screen with a voice visual that follows the speech, call timer, message-style summary, "Try it as your business" (name + trade, no prices invented), a receptionist rebuilt after a 308-call stress test (urgent and danger handling, number checks, honest answers), site-wide readability fixes. #139 (Maz's call): the receptionist answers missed calls day or night, same £79.
- #140: fixes from an independent red-team pass (phone layout, Escape, link safety, details given in the first sentence). Before any paid line: phone provider with a spend cap, £79 payment link, ICO fee.

## 9 Oct: receptionist audit + demo fixes (draft PR #137)
- The talk-to-it demo now catches urgent calls at any step, checks and corrects the phone number, and doesn't hang up on "no". Personal links can't carry web addresses or premium numbers. Every screen says it's a demo, and "Get my free demo" sits inside the call summary.
- Waiting on Maz: phone test and merge; decide "after hours only" vs "answers when you can't"; spend-capped phone provider, £79 payment link and ICO fee before any paid line. Audit and plans are in the private memory repo (`handoffs/2026-10-09-receptionist-audit/`).

## 7 Oct: site sprint merged
- Live now:
  - heating and plumbing page (#120);
  - cost calculator on every /for page (#121);
  - "If you say yes to the plan" timeline on /free-plan (#122);
  - campaign tags that survive any route to the form (#123).
- Next tasks wait on Maz's answers: a demo phone line, Vercel Analytics, and a code-rendered demo video.

## 2 Oct: PR tidy (Claude)
- #103 friction pass rebased onto Offer v10. Brand Kit, FAQ and FAQ-page edits dropped in favour of v10/#108 copy; homepage, contact, leak-check and what-we-do shortening kept. 114 tests, typecheck and build pass.
- #104 outreach pack closed: it named real prospects in this public repo and used v9 prices. Full text kept privately in `unified-memory-database` (`spine/projects/mazworks-site/OUTREACH-COPY-PASTE-v9-PRIVATE.md`). Next: a templates-only pack that reads prices from `app/offers.ts`.
- #105 Social Cat creator-growth research merged (`docs/maz-works/SOCIAL-CAT-CREATOR-GROWTH-BUILD-HANDOFF-2026-10-01.md`); the build itself is still open. #106 closed as superseded.

## 2 Oct: Offer v10, commercial rebuild (Claude, branch `agents/offer-v10-commercial`)

Prices, packages and scope were rebuilt in `app/offers.ts`. **Read `OFFER-V10.md` before touching any price.** Four separate kinds of work: brand (Brand & Content Kit £595), sales pages and websites (Sales Page £895, Brand + Sales Page £1,295, Website from £1,950), automation (Starter £195, Business System from £795) and custom software (from £2,950). Add-ons start at £95. Care is £49 or £195 a month. "2 months of unlimited changes" is now 30 days of tweaks plus a 90-day fix promise. Every package shows who it's for, what's included and excluded, when it's ready, how changes work and the next step. The `/brand-kit` page is now the creators page (content → trust → offer → pay → email list). Typecheck, build, 112 tests and smoke pass; checked at 390px with no overflow. Open PRs #103 and #104 were written against v9 copy: rebase them and keep the v10 prices. Maz: the LinkedIn headline and banner in `LINKEDIN-FUNNEL.md` now say "30 days of tweaks"; update the live profile if you pasted the old line.

## LinkedIn four-goal update (Codex, 30 Sep)

Branch `agents/linkedin-four-goals` adds real-work links, the creator route, changes-scope disclosure and preservation of LinkedIn campaign tags. Prices and scope copy use `app/offers.ts`; the existing design is reused. Details and evidence: `LINKEDIN-FOUR-GOALS.md` and `docs/evidence/linkedin-four-goals/`. Maz: review the PR preview before merging; share the LinkedIn screenshots and personal profile URL when ready. Nothing was posted, sent or merged by this task.

This repo is public. The full handover, open to-dos and research source names live in the private memory repo: `manazoid4/unified-memory-database` → `spine/projects/mazworks-site/HANDOVER.md` and `ARCHITECTS-CONTEXT-PACK-2026-09-27.md`.

## 2 Oct: Offer v11 + site by customer type (Claude, PRs on `agents/offer-v11` and `agents/site-v11`, merged 2 Oct on Maz's go)

Offer v11 proposes lower prices and one fix ladder (free plan, £49 one-day set-up, Starter £149, Business System from £595, Custom from £2,450), a 16-job automation menu, Creator Starter £149 and Creator Launch £595, and "always included" on every card: see `OFFER-V11.md`. The site now asks "What do you run?" and sends trades, appointments, creators and offices to their own page with a pain table, named recipes, prices, a calculator preset, own-it vs rent-it and day-numbered next steps; `/brand-kit` moved to `/for/creators`. Sales engine pieces in `SALES-ENGINE.md`: the free-plan form sends a drafted reply, `/scope-sheet` prints a scope sheet from `app/offers.ts`, `/start` is the after-payment intake, and the enquiry function syncs HubSpot and schedules follow-ups once the env vars exist. 122 tests, smoke, 390px screenshots (`screenshots-v11/`) and mobile Lighthouse 94–96 pass. Maz approved and merged both; still to add: Stripe links and the two env vars.

- 2 Oct (late): `GOALS.md` added at the repo top; every PR now carries a "Test it yourself" checklist (`.github/pull_request_template.md`). Open PRs and Maz's to-dos are in the private memory repo handover.

- 2 Oct (polish, PR #115): type pages cut to 5 screens or fewer, /prices folded under 8,000px, homepage under 600 words, one main button "Get my free plan" everywhere, labelled demo businesses, 44px taps, /quick-win redirected, outreach templates added. Lighthouse 95+ on 7 pages.
- 2 Oct (later): Offer v12 draft: same prices, one ladder for every business and creator (Launch Page £595, Website = Launch Page + 4 pages), free set-ups in every package, parts-value on price cards, competitor price audit (docs/maz-works/PRICE-AUDIT-2026-10.md).
- 2 Oct (evening): PR #117 conversion fixes: free plan first everywhere, honest demo links, trade guides without website-fix examples, second task £99, 'task' wording, prices chooser, straight answers, research handbook + Playbook 10.
- 6 Oct: Ponytail coding plugin (YAGNI, smallest diff) enabled for all Claude sessions via `.claude/settings.json` in every repo; PC install steps live in the private memory repo `topics/ponytail.md`.
- 7 Oct: PR #127 adds a 30-second demo video made from code (missed call, instant text, booked; no face or voice, labelled as an example) in 'See it working'. The hero's second link jumps to it. Re-render with `node scripts/render-demo-video.mjs`.
- 9 Oct: PR #129: every main 'Get my free plan' button lands on the form (trade guides, prices, what-we-do, FAQ), and the form shows plain inline messages instead of browser tooltips. Found by a 390px three-journey audit; three design calls (home trade links, salon scene, /free-plan top) wait for Maz. Site is ready for Google Search Console.
- 9 Oct (seven goals): PR #129 grew into the seven-goals PR: price cards show time / when you pay / after, every main button lands on the form, reliable enquiry sends, /services + 8 job pages, homepage visuals that each answer one question, promo kit (now in assets/promo), GOALS.md as the single starting page. verify 139/139, Lighthouse mobile 99/100/100/100.
- 9 Oct (after-hours receptionist): new monthly service page /after-hours-receptionist (£79/month from offers.ts AFTER_HOURS), wired into home, /services, /prices, contact form, free-demo form, footer, sitemap and privacy. Example call demo runs in the browser; no real test line yet, so the PR waits for a phone provider + demo number before merge. Notes: docs/maz-works/AFTER-HOURS-RECEPTIONIST.md.
- 9 Oct: free talk-to-it receptionist demo at /receptionist-demo plus a link maker at /receptionist-demo/make (browser speech, rule-based answers, £0 to run, not indexed).
