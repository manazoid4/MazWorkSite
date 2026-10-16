# Trade personalisation sprint — 11 October 2026

Status: implementation underway; no production change authorised. Baseline: `12d267a`, feature branch `agents/trade-conversion-sprint`.

## Reconciled current state

| Area | Already complete on main | Gap selected for this sprint |
|---|---|---|
| Inventory | Hub, four broad types, ten specialist niches; sitemap driven by data | Regression coverage for all 15 routes |
| Design | Homepage colours, trade split heroes, BeforeAfter, price cards | Long repeated proof; more specific operational artefacts |
| Proof | HeroDemo, DemoBusiness, receptionist presets, calculator | Most flows resemble a phone/booking sequence; no common context handoff |
| Conversion | Two-step form, package preselection, campaign retention, error recovery | Industry/problem/demo/source provenance not consistently retained or editable |
| Delivery | Native enquiry endpoint and FormSubmit fallback; provider acknowledgement required | Fixture verification, safe source metadata; actual inbox receipt outside this test |
| Commercial | Canonical offers in offers.ts, main CTA agreed | Avoid implying several tasks fit one Starter; keep existing software where suitable |
| SEO | Unique canonical routes, generated sitemap, service schema | Check all rendered metadata, headings and internal links |
| Existing work | #137–142 merged; #143 is event-proof planning | No receptionist-engine overlap; recheck PRs before push |

## Direction and scope

One useful workflow per industry, immediately after a short hero: an enquiry/job card for trades, appointment request for booking businesses, project brief for architects, document checklist for offices, permission-based resource delivery for creators. Existing Maz Works typography, orange actions, controlled coloured surfaces and clear ink borders. No new animation dependency, model call, microphone, CRM or analytics. Simulated examples remain visibly labelled; requested slots are not confirmed bookings.

Use one configuration-driven proof component with explicit progression and replay, customer view and owner outcome. Keep crawlable first-state content. Reuse existing before/after and pricing where they answer a different question; remove redundant demonstration repeats. One-task starting price comes from offers.ts; explicit package clicks alone preselect an offer.

The handoff URL carries only allowlisted industry, problem, proof and source-page IDs. Campaign attribution remains separate. Form visitors can change their mind. Their message and contact details never belong in a generated public URL. Existing delivery infrastructure remains authoritative for success/failure.

## Pre-mortem

| Failure | Likelihood | Impact | Early signal | Prevention | Recovery |
|---|---|---|---|---|---|
| Pages still interchangeable | High | High | Same owner artefact everywhere | Different fields, decisions and workflow triggers | Rewrite weak scenarios, not more sections |
| First screen too dense | High | High | CTA/price below 844px | Short hero, secondary detail later | Cut prose before shrinking type |
| Animation confuses | Medium | High | Visitor cannot identify next step | Manual progression, clear labels | Remove timing/animation |
| Service remains vague | Medium | High | Customer cannot describe outcome | Show customer action and owner receipt | Simplify to one operational job |
| Price appears inconsistent | Medium | High | Multi-task demo reads as Starter scope | Canonical prices, one-task caveat, explicit selection | Rescope proposal before payment |
| Industry claims inaccurate | Medium | High | Practitioner challenges terminology | Source research, illustrative labels | Correct configuration and regression test |
| Form adds friction | High | High | Context fields dominate contact step | Optional choices, two existing steps | Remove unnecessary questions |
| Demo implies live integration | High | High | Fake booking looks confirmed | Simulation label, request/confirmation distinction | Remove misleading state |
| Mobile performance degrades | Medium | High | Increased JS/LCP, low audit score | No dependency or network demo | Reduce client content and media |
| SEO duplication | Medium | Medium | Same title/description across routes | Distinct problem copy and metadata checks | Consolidate thin content |
| Low-value engineering expands | High | High | New orchestration or CRM infrastructure | Reuse native tools and existing delivery | Cut optional infrastructure |
| Parallel changes regress | Medium | High | Same files owned twice | Disjoint workers, fresh main and PR check | Integrate deliberately, rerun affected tests |
| Query poisoning/stale choice | Medium | High | Wrong trade or private text in email source | Allowlist IDs, reset dependent context | Reject invalid combinations |
| Duplicate booking/reminder software | High | Medium | Prospect already owns this capability | Ask about current tools, check compatibility | Configure existing software instead |

## Twelve-lens prioritisation

Scores are relative 1–5; confidence is evidence confidence, not a conversion forecast. Higher effort/risk is more costly.

| Lens | Finding / priority | Impact | Effort | Confidence | Risk | Evidence |
|---|---|---:|---:|---:|---:|---|
| Owner | Recognisable enquiry in first meaningful proof | 5 | 3 | 4 | 2 | Existing near-identical phone sequences |
| Sceptical buyer | Simulation and limits must be explicit | 5 | 1 | 5 | 1 | Current proof has outcome-like booking text |
| Trade expert | Requests need different qualification fields | 5 | 3 | 3 | 2 | Source matrix; patterns are inferred |
| Conversion | Preserve interest, never infer an order | 5 | 3 | 5 | 2 | CTA and form code audit |
| Visual designer | Shorten repeated demonstrations | 4 | 2 | 4 | 2 | Baseline pages 6,846–7,921px at 390px |
| Accessibility | Manual controls, stable disclosure, keyboard | 4 | 2 | 5 | 1 | Calculator removes its trigger on expand |
| Engineer | Shared core and typed industry configuration | 4 | 3 | 5 | 2 | Existing shared /for templates |
| Financial controller | Keep current tools; one scoped task first | 5 | 1 | 4 | 1 | Canonical Starter scope and vendor features |
| Search | Crawlable unique content, correct internal links | 3 | 1 | 5 | 1 | Existing data-driven sitemap |
| Security/privacy | Validate context and remove arbitrary URL query | 5 | 2 | 5 | 2 | Raw src/_url in enquiry audit |
| Founder | Clear industry/problem/request summary | 5 | 2 | 4 | 1 | Current free-text triage burden (inferred) |
| Competitor | Sector fluency is weak if proof stays generic | 4 | 3 | 3 | 2 | Existing configurable text on same phone flow |

## Execution and proof

1. Three Luna read-only audits (research/design/conversion), then two Sol 6.1 medium builders with disjoint ownership; coordinator integrates.
2. Builder A owns /for and proof configurations; Builder B owns form/context/delivery metadata. Neither changes offers or receptionist engines.
3. Coordinator owns screenshots, cross-route browser regression, portability fixes, evidence, independent red-team reproduction and memory.
4. Run typecheck, production build, existing/new tests and smoke; check 320/390/768/1280, reduced motion, keyboard, no-JS content, mocked success/failure and source safety.
5. Independent Astra review; fix reproduced findings; draft PR and existing-platform preview only. Production remains untouched.

Baseline `npm run verify`: typecheck/build pass, 190/192 tests pass. Two failures are Windows CRLF assumptions in WEBVTT and reduced-motion test regexes, not observed product defects. Portable regex fixes preserve assertions. Browser baseline has no horizontal overflow on sampled routes. Screenshots and exact measurements: `docs/evidence/trade-sprint/`.

## Capability and cost audit

Codex CLI 0.162.1; `codex login status` reports ChatGPT authentication. Native spawn tool exposes GPT-6.1 Sol, GPT-6 Astra, GPT-6 Sol and GPT-6 Luna with effort selection. Three Luna audits actually ran; two Sol medium builders assigned. No claim of switching this parent model. Token caps are prompt budgets, not a verified hard runtime enforcement feature.

Local hardware: 12 logical processors, about 40 GiB RAM, GTX 1660 Ti 6 GiB. Existing ILM routing is Gemini/free external fallbacks, so it is not invoked for this OpenAI-only assignment. Read its saved relevant research instead. No custom orchestrator, local-model installation, external model API or paid credits used.

Unified Memory project slug is `mazos-site`, not `mazworks-site`; start session `mem_20261011t131511_d0065fe8`. Original memory checkout has unrelated local changes; isolated worktree starts at current origin/main. Canonical vault pull was blocked by an unrelated untracked session note; preserve it and sync via an isolated worktree. Remote memory supersedes stale local handover entries.
