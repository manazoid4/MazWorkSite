# HANDOFF: B2B and complaints launch (19 Oct 2026)

Branch `feat/b2b-complaints-launch` in `mazos-site` (not `MazWorkSite`, which sits on an old feature branch and is behind). **Nothing is deployed or merged.** Preview link: see the PR.

## What was built
| Ticket | Where | State |
|---|---|---|
| MW-01 B2B landing page | `/b2b` (`app/b2b/page.tsx`) | Done. Headline from the brief, complaints + 3 B2B systems + 2 add-ons, own-vs-rent, founder block, audit, simulator, SMS demo, booking. |
| Complaints packages | `/complaints` (`app/complaints/*`), data in `sample-data.ts`, copy in `COMPLAINT_PACKAGES` | **Reworked 20 Oct.** Four packages (Health Check from £295, Post-Complaints Analysis & Board Reporting from £895, Workflows & Staff Toolkit from £495, Improvement Sprint from £1,495), each with a worked sample: scorecard + ranked fixes, filterable dashboard, tracker, board slides, action tracker, flowchart, decision tree, staff guides, checklist. All from one fictional dataset. Two sample PDFs are downloadable. No Excel/tool names or AI wording in the copy. |
| MW-02 Audit tool | `/audit`, embedded on `/b2b` and in a fold on `/free-plan` | Done. Result shows before any contact details; kept in `sessionStorage` and prefilled into the `/free-plan` form via `?audit=1`. |
| MW-03 Cal.com booking | `app/booking-modal.tsx` (`<BookCall>`) | Done as a native `<dialog>` + iframe, no new dependency. CSP now allows `frame-src` for cal.com. Notes and `utm_source` are prefilled. **Live Cal.com frame not tested** (see below). |
| MW-04 Workflow simulator | `app/workflow-sim.tsx` on `/b2b` and `/what-we-do` | Done. SVG + CSS, 3 presets, example timings labelled as illustrations. |
| MW-05 Proof | `/proof` via `app/proof-parts.tsx` | Done, honestly: problem / what was built / "what you can check". No results are published because none are confirmed. The demo is labelled "not a client". Add real quotes to `TESTIMONIALS`. |
| MW-06 Nav | `app/nav.ts`, footer | Header: Solutions, Prices, What we do, Proof. Video, Objects and Lab sit under "Lab / Physical products". |
| MW-07 Practice tier | `PracticeTier` on `/prices` (folded) | Done. Own-vs-rent uses the 2 Oct price-audit figures. Folded to respect the page word-budget test. |
| MW-08 SMS demo | `app/sms-demo.tsx`, `api/demo-trigger.js` | Built and unit-tested. **Sends nothing until Twilio settings exist**; otherwise shows the on-screen preview. |
| MW-09 Founder moat | `FounderMoat` on `/b2b`, `/what-we-do` | Done, using only the existing approved credential wording. No `/about` page exists, so not added there. |
| MW-10 Tracking and alerts | `app/linkedin-source.ts` (UTM + LinkedIn referrer), `api/enquiry.js` | UTM capture, owner email, HubSpot message and optional Telegram alert are done. The Insight Tag component exists but is **off** (below). A separate `/api/lead` was not needed: `/api/enquiry` is already the lead route. |

## Tests
- `npm run verify` on the branch: typecheck, build, **318/318 tests**, smoke all pass. Baseline on `main` was 305/305.
- 13 new tests in `tests/b2b.test.mjs`: working-day maths, demo case states, audit sums, UTM sanitising, a mocked test enquiry reaching owner email + HubSpot + Telegram (campaign data included, email address not in the Telegram text), forged-attribution rejection, the SMS endpoint (consent, UK numbers, simulated mode, per-number limit) and the built pages.
- Two older tests changed on purpose: the header "current section" check now uses `/prices` (the header no longer holds `/for`).
- Browser QA by an independent agent at 390 px and 1440 px: see the PR.

## Needs Maz (credentials and decisions)
1. **Approve prices before merge.** Complaints packages from £295 / £895 / £495 / £1,495 (your starting prices, in `COMPLAINT_PACKAGES`); Intake £850; Speed-to-Lead £595; Proposal Chaser £450–£750; Feedback Filter £99; Digest £145 (`B2B_SYSTEMS`). **Margin flag:** my delivery estimates are about 7h / 21h / 11.5h / 28h, i.e. roughly £42 / £43 / £43 / £53 an hour. The market research (section 7 of `RESEARCH-HANDOFF.md`, proxy prices only, no UK complaints consultancy publishes rates) suggests publishing Health Check from £395, Board Reporting from £1,195, Workflows from £595 and the Sprint from £1,995, keeping your figures as an intro offer for the first 2 or 3 clients. Your call.
2. **Telegram alert:** create a bot with @BotFather and set `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` in Vercel. Until then the owner email (Resend) and HubSpot are the alerts. I could not check that the Resend and HubSpot settings exist in production.
3. **SMS demo:** needs a Twilio account (costs per text): `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM`. The one-per-number-per-24h rule is held in memory per server instance (best effort) plus a 40-a-day cap; a hard limit needs shared storage such as Vercel KV. Consider leaving it off.
4. **LinkedIn Insight Tag:** set `NEXT_PUBLIC_LINKEDIN_PARTNER_ID`; add `https://snap.licdn.com` to `script-src` and `https://px.ads.linkedin.com` to `img-src` and `connect-src` in `vercel.json`; add a consent banner that sets `localStorage["mw-ads-consent"]="yes"` (UK PECR needs consent for this tag). The component does nothing until all of that exists.
5. **Cal.com:** confirm `cal.com/mazworks/quick-chat` is live and allows embedding. If it refuses framing, the "Open in a new tab" link in the dialog still works.
6. The LinkedIn link in the founder block is the **company** page. Send me the personal profile URL if you want that instead.

## Deliberate departures from the brief
- Prices come from `offers.ts`, not the table in the brief (its Launch Page £295 / Website £1,295 / Starter £99 are older figures).
- "Guarantees sub-60-second follow-up" became "about a minute"; "compliance-grade" became "careful logic". No "AI" wording anywhere; complaint reply drafts are described as template wording a person approves.
- The primary button stays "Get my free preview" on every page (site rule); the audit and booking are secondary buttons.
- No case-study metrics, quotes or "practice architectures" presented as client work: nothing is published that has not happened.

## Known gaps
- No demand evidence yet (the research found none). Do about 10 buyer conversations before more building.
- Bank holidays are not in the demo's working-day maths.
- `/demos` stays in the phone menu because existing tests and links expect it; `/video` is out of the header.

## Next commands
`cd C:\Users\Maz\repos\mazos-site; git switch feat/b2b-complaints-launch; npm run verify; npm start`

## Complaints packages: update of 20 Oct
- Source of truth: `COMPLAINT_PACKAGES`, `COMPLAINT_EXTRAS_QUOTED` and `COMPLAINT_DATA_HANDLING` in `app/offers.ts`. Change a price or scope there only.
- Samples: `app/complaints/sample-data.ts` generates 120 fictional records from a fixed seed. Findings and slide headlines are computed from them, so charts and words cannot disagree (tested). The "Northgate Advisory" name and every figure are invented and labelled as such on the page and in both PDFs.
- Downloads: `public/samples/complaints/sample-health-check-report.pdf` (2 pages) and `sample-board-report.pdf` (4 pages), printed from `/complaints/sample/*` by `scripts/make-complaint-samples.mjs`. Rerun the script after changing the data (it needs Playwright installed outside the repo; instructions at the top of the script).
- Positioning per your steer: "easy to see, easy to understand, easy to act on", the two-minute test, and why a template or free tool cannot replace experience. The page never names Excel, PowerPoint or similar tools, and never mentions AI.
- Needs your confirmation: the 30-day deletion of working copies in `COMPLAINT_DATA_HANDLING` is my proposal; get a proper data-handling agreement (UK GDPR processor terms) before the first client shares records. The research notes the ICO guidance to follow.
- Your claim "I kept the complaints tracking, analysed outcomes and reported to the board" is taken from you, and worded without naming an employer. Please confirm you are happy with it being public.
- Turnaround times (about 5 / 10 / 7 / 15 working days) are my estimates.
- Not built: a real Excel tracker download (removed on purpose to keep the offer about judgement and clarity, not tools). The delivered format for the tracker and dashboard is decided per client.
