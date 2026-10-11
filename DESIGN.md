# Maz Works Design Direction

## Industry journeys — 11 October 2026

The `/for` family uses the current homepage colour and type system. Its visual world is a small business's working day: a job card, appointment request, project brief or document checklist. The visitor should recognise the job before reading a service description.

- Immediate: industry, specific problem, canonical starting price, main CTA and one labelled example.
- On interaction: customer action, business-owner receipt and the human decision still required.
- On demand: calculator, detailed inclusions and related workflows.
- Composition: concise hero beside a useful artefact on desktop; natural reading order on mobile. Distinct workflow fields and actions give industries their identity.
- Colour: existing controlled sky, mint, sun and pink surfaces with ink text; orange remains the main action.
- Shape/type: existing readable display/sans/mono hierarchy, clear dividers and restrained borders. No new fonts, gradients, dashboard ornament or stock client photography.
- Truth: examples never imply live messages, confirmed appointments, clinical decisions or verified integrations. Existing software is checked before proposing a replacement.

This scoped direction supersedes older portfolio-era wording for industry pages; it does not restyle the homepage or Objects.

## Maz Works Objects — Tactile Signal Studio

The `/3d-printing` route is a deliberate sub-brand surface inside Maz Works rather than a global restyle.

| Decision | Objects contract |
| --- | --- |
| Product mode | Experience first, then persuade toward a short enquiry |
| Audience and cadence | Small hospitality, retail and service businesses making an occasional, non-technical product decision |
| Visual world | **Tactile Signal Studio** — an art-school product catalogue with useful, countable objects |
| Palette family | Existing Maz Works neon signal green with black, white and cool neutral studio surfaces |
| Type treatment | Fredoka for thick rounded display moments; the existing readable sans/mono system for body, labels and form copy |
| Composition | Oversized product photography, asymmetric editorial pairs, alternating range rows and a progressive enquiry |
| Shape language | Product-led circular cuts and low rounded masses; surrounding UI stays mostly crisp and structural |
| Anti-references | Generic SaaS cards, a conventional pricing table, stock installations, excessive glow, dense e-commerce controls and competitor imagery |

All object imagery is original generated concept work and must be a line sketch in the architecture-page style (ink lines, light grid, orange only as an accent fill), labelled **Illustrative sketch**, until real photos of physical prototypes replace it. Never use generated renders. Fredoka is available under the SIL Open Font License 1.1; its use is scoped through `next/font` so the existing site typography does not regress.

## Colour layer (30 Sep, Maz: "can't be bland")

Hi-vis orange stays the action colour. `app/colour.css` (loaded last) adds a modern-marketing supporting set: lilac, sky, mint, pink, sun and blue. Use them as full-bleed bands (hero lilac, free plan sun, about sky), card fills, pills and highlights, always with ink borders and hard offset shadows. Text stays ink or charcoal on these fills. No lime or cream hexes.

## Chosen direction — Quiet Framework

Maz Works should feel like a calm, evidence-led studio page for a hands-on software builder. The page is an evidence surface, not an agency funnel and not a product dashboard.

The current FRAMEWORK build is the foundation. The refinement is subtraction and hierarchy: fewer repeated explanations, fewer framed boxes, much less yellow, larger real project imagery, and a clearer human presence.

## Audience contract

> **Corrected 2026-09-19.** This section previously led with *Employers* and
> *Collaborators*, carrying over a job-hunting portfolio model that the site itself was
> deliberately reverted away from (see the 2026-08-26 entry in the unified-memory
> ledger: the site had drifted into a personal portfolio for junior applied-AI roles
> across three commits and was rebuilt as the client pitch). The code was fixed then;
> this document was not, and was still pointing later agents at the reverted model.
> The audiences below now match the positioning brief in
> `docs/maz-works/AGENT-HANDOFF-POSITIONING.md`.

- **Owner-managers and operations or sales leads** (1–50 people) should see, quickly:
  what problem this fixes, that it is one person and not an agency, real delivered
  work, a starting price, and one obvious way to enquire.
- **Local customer-facing businesses** should see that a physical product can lead to
  a review, booking or menu, and what that costs.
- **A sceptical buyer** should find honest limitations, no invented figures or
  testimonials, and scope agreed before any paid work.
- **LinkedIn visitors** should be able to move from a claim to a stable case study,
  live product or repository, and contact.

Employers and collaborators are not target audiences for this site. Do not reintroduce
a CV, a skills matrix, or role-seeking language.

## Reference translation

- [John Pawson](https://www.johnpawson.com/architecture): repetition, proportion, light, and a quiet project index. Borrow the rhythm, not architectural imagery.
- [Pentagram Work](https://www.pentagram.com/work/): let strong work and project imagery lead; keep browsing structure legible.
- [Build, Memory](https://www.pentagram.com/work/build-memory-1): use a flexible editorial grid so dense information can breathe.
- [Pienso](https://www.pentagram.com/work/pienso/story): make technical work understandable with real use cases and product visuals.
- [Lee Robinson on programming portfolios](https://archive.leerob.io/blog/beginners-guide-to-the-programming-portfolio): borrow only the evidence principle — show live work, decisions and clear writing rather than asserting skill. This is a client site, not a job-seeking portfolio.

These are principles, not templates. Do not imitate another studio's identity, scale, claims, or visual assets.

## Founder-led peer translation

`docs/maz-works/PEER-BENCHMARK.md` compares ten current small/founder-led software and automation firms using their first-party sites. The repeated patterns worth applying are structural rather than stylistic:

- work appears before a services catalogue;
- the founder is named early instead of hidden behind invented studio scale;
- one or two case studies carry most of the proof;
- services are expressed through recognizable workflow problems;
- the commercial next step is bounded and concrete;
- client ownership and handoff are stated;
- contact is simple and singular.

Maz Works adapts those patterns to its own evidence and settled offer. It does not copy peer layouts, brand assets, language, testimonials, claims, or agency posture.

## Visual system

- Warm ivory/off-white canvas and near-black ink remain the base.
- Signal yellow should occupy very little visual area: focus states, a status mark, a short underline, or one primary action. Never use it as a large pricing panel or repeated card fill.
- Use 1px dividers for structure and whitespace for grouping. Reserve 2px frames for the outer shell or a deliberate flagship moment.
- Prefer one strong image at a useful size over several small equal cards.
- Keep corners square and avoid shadows, glow, glass, gradients, pills, novelty terminals, and technology badge walls.
- Motion is optional and minimal. The page must remain complete with reduced motion.

## Type and spacing

- Use one distinctive, readable grotesk family plus mono only for labels or metadata. If the current stack is replaced, self-host an OFL font and measure the performance cost.
- The hero should be large but not consume most of a mobile viewport. Aim for roughly 2.75–3.25rem on narrow mobile and 5–6rem on wide desktop.
- Keep prose widths near 60–70 characters and use short, plainspoken copy.
- Use a consistent 12-column desktop grid, a simple single-column mobile flow, and generous section spacing instead of boxed padding everywhere.

## Information hierarchy

1. Compact header: Maz Works / Manazir Hussain, Work, About, Client, Contact; move secondary external links to the footer on narrow screens.
2. Short hero: identity, canonical value statement, one primary action, one quiet secondary action, and one proof line.
3. Image-led JobFilter flagship.
4. Image-led Scrap Finance Partners client-work flagship.
5. Compact selected-work index for Agent Nudge and OpenFlowKit.
6. One merged “What I build / How I work” section.
7. A restrained client offer: packages and prices come only from `app/offers.ts` (see `docs/maz-works/PRICE-AUDIT-2026-10.md`).
8. Short About and one contact block with Hire / Client / Collaborate routes.
9. Footer with GitHub and, only when verified, LinkedIn.

Remove the separate hero proof ledger, proof strip, repeated services grid, and three large pathway cards once their essential information is carried by the structure above.

## Project story rule

Homepage summaries should be short: problem, intervention, proof, and current limitation. The two flagships may receive dedicated case-study routes using the full sequence:

Problem → Insight → What I built → How it works → Proof → Status → Limitation

Technology lists remain secondary to decisions and evidence.

## First-five-seconds contract

Visitors should see Maz Works, Manazir Hussain, “automation, connected tools and custom software for small businesses” (no AI in the offer: AGENTS.md), a clear route into selected work, and credible shipped evidence without reading a ledger of claims.

## Directions evaluated

- Quiet Framework — selected; best balance of authority, warmth, proof, and commercial clarity.
- Evidence Index — highly scannable and technical, but too cold as the primary identity.
- Builder's Journal — personal and editorial, but too slow to establish shipped proof.

Evidence Index can influence the selected-work list. Builder's Journal can influence About copy and future project notes. Neither should replace Quiet Framework.
