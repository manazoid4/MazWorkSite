# Maz Works: latest session handover (public copy)

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

> Start here: the private handoff index (`unified-memory-database/handoffs/LATEST.md`) holds research, plans and build prompts. This public file keeps only the last 3 entries; older ones are in `docs/archive/SESSION-HANDOVER-history.md`.

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
