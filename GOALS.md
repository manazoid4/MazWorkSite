# Maz Works site: goals

**North star: more paid jobs per week with less of Maz's time.**
Every change must help a visitor understand, trust or buy faster, or help Maz reply, quote or deliver faster. If it doesn't, it doesn't ship.

## Start here (current work, 19 Oct 2026)
- **Live work:** the open PR on `ccr-13ded85e-8hqfpk` ("seven goals"); its body has the task list and "Test it yourself".
- **Quality bar:** [`docs/maz-works/REFERENCE-BRIEF.md`](docs/maz-works/REFERENCE-BRIEF.md) (references, patterns, acceptance criteria).
- **Prices:** `app/offers.ts` only; decisions in [`docs/maz-works/PRICE-AUDIT-2026-10.md`](docs/maz-works/PRICE-AUDIT-2026-10.md) (Offer v12; `OFFER-V11.md` is history).
- **Latest handover:** [`docs/maz-works/SESSION-HANDOVER.md`](docs/maz-works/SESSION-HANDOVER.md) (public); the full one with to-dos is in the private memory repo.
- **How to work:** [`AGENTS.md`](AGENTS.md) (rules) · [`PLAYBOOKS.md`](PLAYBOOKS.md) (how-tos).

## The seven goals (Maz, 9 Oct 2026)
| # | Goal | Done when |
|---|---|---|
| 1 | **Design.** Mobile layout, infographics, homepage video, interactive examples. | Every visual answers one distinct question, is labelled as a demo, and reads well at 390px; Lighthouse mobile ≥ 95. |
| 2 | **Clarity.** What connects the work, who it helps and the next step. | At 390px the visitor sees the shared purpose, the three customer journeys and a clear enquiry action. |
| 3 | **Pricing.** Packages, inclusions, exclusions, upfront and ongoing costs. | Each package card shows what's in, what's not, when you pay, and what it costs after; no price outside `app/offers.ts`. |
| 4 | **Lead conversion.** Real proof, simple enquiry that works for both audiences. | The main journey uses “Tell me what’s not working” and a short direct form; the separate free preview stays available where appropriate; source and delivery recovery are preserved. |
| 5 | **Google visibility.** Service pages, foundations, internal links, buying questions. | A page per main job, unique titles in the buyer's words, FAQ answers to cost/time/breaks/tie-in, valid schema. |
| 6 | **Promotion and sales.** Infographics, reusable posts, prospect research, enquiry → quote → follow-up. | Finished assets + copy in `assets/promo/`, process written down, nothing posted without Maz. |
| 7 | **Repository clarity.** One starting point. | This page links current work; old plans marked done / superseded; history kept. |

## Rules that never change
- Maz Works makes the customer side of businesses work better: get customers, serve them well, and keep improving. Websites, connected tools, reporting and software support that purpose.
- Lead with practical outcomes and keep the audience broad. “Keep & Improve” means learning from feedback and fixing repeated problems.
- The main visitor action is “Tell me what’s not working”; the free preview remains a separate, honest offer for suitable small-business work.
- No AI in the offer; it may be used behind the scenes, never sold.
- Never invent testimonials, clients or results. Never publish Maz's location, personal email or phone; the public contact is info@mazworks.uk.
- Offers and prices live only in `app/offers.ts`; professional complaints work is quoted to scope unless a public price is approved. Branch + PR, then merge to main once the checks are green.

## Not doing (cut on purpose)
Funnel tracking (skipped by Maz, 2 Oct 2026). "Unlimited changes". Narrowing the site to one niche.

How to work on this repo: [`PLAYBOOKS.md`](PLAYBOOKS.md) · agent rules: [`AGENTS.md`](AGENTS.md) · latest session: [`docs/maz-works/SESSION-HANDOVER.md`](docs/maz-works/SESSION-HANDOVER.md)
