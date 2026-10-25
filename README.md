# Maz Works

> ## 🎯 Goals: start here → [GOALS.md](GOALS.md)
> **More paid jobs per week with less of Maz's time.** Clear offer · trust without fake proof · one easy first step · fast reply and quote · leads worked every week.

> ## 📘 Playbooks: start here
> Working on this with any agent (Codex, Gemini, OpenCode, Claude)? Open **[PLAYBOOKS.md](PLAYBOOKS.md)**: one page with the start prompt and links to every playbook.
>
> | Job | Playbook |
> |-----|----------|
> | Find creator leads on Instagram + DMs | [6](docs/playbooks/6-instagram-creator-leads.md) |
> | LinkedIn owners, notes and posts | [7](docs/playbooks/7-linkedin-engine.md) |
> | Hand a coding task to an agent | [8](docs/playbooks/8-coding-tasks-for-agents.md) |
> | Monday review | [9](docs/playbooks/9-weekly-review.md) |
> | Ship a site change | [1](docs/playbooks/1-ship-a-site-change.md) |

> **Lead and sales work:** follow Lead Quality v2, see [`docs/maz-works/LEAD-QUALITY.md`](docs/maz-works/LEAD-QUALITY.md). Offers and prices live only in `app/offers.ts`.

Public portfolio and client-acquisition site for [Maz Works](https://mazworks.uk), Manazir Hussain's studio: automation, connected tools and custom software that win customers and take admin off small-business owners.

Maz Works is positioned around a simple idea: start with the real business problem, then build the smallest useful system that solves it. The site combines practical project proof with Manazir's earlier background in complaints, escalations and operations.

## Public routes

- `/` — digital services, selected work, founding offers and live-demo enquiry
- `/3d-printing` — Maz Works Objects, the Touch collection, interaction demonstration and product enquiry
- `/mazos` — no-index legacy handoff

## Homepage structure

Current order and copy live in `app/page.tsx`; the rules for them in `GOALS.md` and `AGENTS.md`. (The older section list that stood here described the 2025 portfolio site and was removed on 9 Oct 2026; see git history.)

Large project screenshots are deliberately omitted from the homepage so the work stays easy to scan. Deeper detail remains available through case-study and project links.

## Maz Works Objects — Touch

- **Touch One — £29:** one compact stand, one removable NFC disc, one destination, matching QR backup, plain-text business name, black-and-white finish and link setup.
- **Touch Three — £49:** one stand, three removable NFC discs, up to three destinations, one matching QR backup per destination, plain-text business name, black-and-white finish and link setup.
- **Touch + Carry — £79:** everything in Touch Three plus five matching NFC keyrings sharing one destination. Keyrings do not include QR codes.
- **Artwork add-on — +£10 per bundle:** one supplied artwork design reused across the bundle, basic placement and one proof revision. Complex redrawing, extra designs and detailed imagery are quoted separately.

Prices cover standard designs. Delivery and nonstandard requests are confirmed separately. Direct links to existing pages have no subscription; website creation, hosted pages, redirect services and ongoing changes are separate quotes.

Remaining manufacturing checks before physical-product delivery: print and fit the prototype; confirm the actual PLA filament; test disc retention and replacement; validate NFC read position across representative phones and cases; confirm the tag rewrite/lock policy; test every production NFC destination and printed QR backup; then agree packaging, delivery cost and timing. Product imagery on the page is labelled as a concept visual until those checks are complete.

The Objects display face is **Fredoka**, loaded through `next/font` and scoped to `/3d-printing`. Fredoka is released under the [SIL Open Font License 1.1](https://openfontlicense.org/open-font-license-official-text/) and permits commercial use, modification and redistribution under its licence terms.

## Current founding offers

- **Free live demo — £0** for a suitable first problem. The aim is a near-working demonstration around the real use case, not an abstract problem map.
- **Microsoft Teams walkthrough — available** for screen-sharing the demo, explaining the workflow and answering questions before a paid build is agreed.
- **Quick Win — £150 fixed** for one tightly scoped website, workflow or automation improvement; £75 to start and £75 on completion
- **Website Launch — from £299** for a focused small-business website or landing experience with a clear enquiry route and deployment
- **Growth System — from £499** for a website/customer journey plus one useful automation or AI-assisted workflow with sensible controls
- **Optional support — from £49/month** for agreed maintenance or small ongoing improvements; third-party usage costs are separate

Larger, unusual or ongoing builds are quoted separately after scope is understood. Pricing is intentionally transparent and should never be presented as covering unlimited work.

## Measurable business outcomes

The homepage now frames automation around operational measures a business owner, team leader or sales team can understand.

Examples include:

- lead and customer response time
- admin hours spent on repetitive work each week
- sales follow-up coverage and time to next action
- workload handled per employee
- overdue tasks and missed handoffs
- time-to-quote
- pipeline movement and recurring bottlenecks

These are targets to measure, not fabricated promises. Maz Works should never publish invented percentage improvements, guaranteed sales increases or ROI without real evidence.

## Live-demo contact flow

The site remains a static Next.js export, but the contact form no longer depends on the visitor having a working local email application.

The contact section asks only for:

- name
- email
- optional business name
- what the visitor wants to improve
- whether they prefer a demo link, Microsoft Teams walkthrough or either

`app/demo-request-form.tsx` sends the request in-page to the FormSubmit AJAX endpoint and shows clear sending, success and failure states. Email remains visible as a fallback. A honeypot field is included for basic spam reduction, and the CSP explicitly permits only the required FormSubmit connection in addition to same-origin requests.

FormSubmit requires the receiving email address to confirm a form on first use. After that one-time activation, submissions are forwarded to the Maz Works inbox. No Vercel credential, client-side secret, CRM login or visitor email application is required for normal submissions.

If enquiry volume later justifies dedicated infrastructure, the same front-end can be moved to a first-party Vercel endpoint plus a transactional email provider without redesigning the contact experience.

## Flagship positioning

### JobFilter

Construction-focused growth and automation tooling for small trades and maintenance firms. The product goes beyond showing public opportunities: it supports trade-fit qualification, alerts, calendar export, response templates and workflow around pursuing relevant work. It does not guarantee contract awards.

### Scrap Finance Partners

A **contract client build** for a specialist finance practice serving UK scrap and recycling firms. Work spans positioning, marketing implementation, web development, launch, lead capture, a secure client workspace and guarded acquisition automation with approval, dry-run, suppression and recipient-safety controls. No revenue or conversion outcomes are invented.

## Professional background

The homepage connects Manazir's earlier work in complaints and escalations to Maz Works without becoming a CV. Relevant transferable strengths include:

- problem investigation
- process improvement
- client communication
- operational ownership
- cross-team coordination
- regulated customer environments

## Client-acquisition principles

The operating playbook lives in [`docs/maz-works/CLIENT-ACQUISITION.md`](docs/maz-works/CLIENT-ACQUISITION.md).

Core rules:

- sell the outcome before the technology
- research the prospect before outreach
- identify one or two measurable operational targets when possible
- use a tailored live demo as the low-friction first step where suitable
- offer a Microsoft Teams screen-share walkthrough when seeing the workflow live will help
- show only the most relevant proof
- agree scope and price before implementation
- use AI with validation, approval or fallback controls where risk requires it
- ask for feedback, an approved testimonial and referrals only after successful delivery
- do not manufacture retainers, urgency, testimonials or performance claims

## Routes

- `/` — client-first portfolio and acquisition page
- `/mazos` — no-index legacy handoff; omitted from navigation and sitemap
- `app/demo-request-form.tsx` — live-demo form with in-page AJAX delivery and status feedback
- `app/projects.ts` — typed project truth; project links go straight to the live sites (no case-study pages, Maz 25 Oct)
- `app/site-chrome.tsx` — shared header/footer
- `app/site.ts` — canonical identity and contact constants
- `app/simplified.css` — client-first layout
- `app/credibility.css` — pricing, measurable outcomes, background, FAQ and live-demo form refinements
- `docs/maz-works/` — persistent project state and acquisition playbook

## Content rules

Use plain language on the homepage. Technical detail belongs in case studies, GitHub or product documentation when it helps the reader.

Do not add private client data, credentials, invented outcomes, unapproved testimonials/logos, revenue claims, performance claims or team members that do not exist.

## Stack

Next.js App Router · TypeScript · plain CSS · static export · Vercel Analytics

## Run

```bash
npm ci
npm run dev
npm run verify
npm start
```

`npm run verify` runs typecheck, production build, deterministic static HTML/link tests and a local-server smoke check. Security headers are defined in `vercel.json`.

## Project memory

The canonical cross-project knowledge system is **Maz Works Knowledge Vault**. It covers every Maz Works product, client, experiment and operating decision; JobFilter is one project inside it. Legacy `JobFilter-Obsidian-Vault` naming may remain as repository/archive provenance but must not be used as the vault's active identity. Repository-local continuation state lives in `docs/maz-works/`.
