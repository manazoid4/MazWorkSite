# Trade sprint status

**WIP handover (usage limit hit).** Done: 14 hand-written industry examples wired into every /for hero (`IndustryProof`, styled); own voice block per page; all CTAs carry industry, origin page and job; enquiry API sanitises and limits context; form step 1 slimmer; new `tests/trade-journey.test.mjs`. Browser-checked: all 15 pages at 320 and 390 (no overflow, 44px targets); roofers to form pre-fill verified; 4 pages (hub, roofers, salons, offices) looked at by eye. Tests: 231 of 233 pass; the 2 red are homepage tests broken by main (#144 price-list), not this branch.
NOT done: 11 pages not eyeballed; only 4 AFTER screenshots committed; desktop shot not viewed; `npm run smoke` not run; dead hero-phone copy left in `trade-extras.ts`.

Takeover of Codex's unfinished sprint (11 Oct 2026). Table 1 is what was found at commit `6880b62`, checked by reading the files and running the tests. Table 2 (bottom) is what this branch finished.

## As found (before this branch)

| Planned item | State | Evidence |
|---|---|---|
| Research | complete | `research.md` |
| Plan, pre-mortem, scope | complete | `plan.md` |
| Before screenshots, Lighthouse baseline | complete | `docs/evidence/trade-sprint/` |
| Proof component `IndustryProof` | partial: drafted, never imported by any page, no CSS at all (no `ip-` rule exists) | `app/for/industry-proof.tsx`, grep for `ip-` in `app/*.css` returns nothing |
| Proof data for 14 pages | partial: one generic 3-step template with a noun swapped (same step titles and shape everywhere) | `app/for/industry-proof-data.ts` `scenario()` helper |
| Proof state logic and its tests | complete | `industry-proof-state.ts`, `tests/trade-proof.test.mjs` (1 of 4 tests red: it expects the hero to use it) |
| Hyperpersonalised `/for` pages | missing: no page text changed | `git diff 39ada10 6880b62` touches no `/for` page |
| Context handoff URL (`trade-context.ts`) | complete, tested | `tests/trade-context.test.mjs` |
| Form reads and edits context | partial: done, but two older tests now red; no friction cut (4 optional fields on step 1) | `leak-check-form.tsx` |
| Enquiry API carries context | partial: fields pass through; `trade`, `industry`, `problem_id`, free-text fields only length-checked at 4000 | `api/enquiry.js` |
| Niche/type CTAs carry context | missing: pages still link with bare `src=` and `trade=` | `app/for/[niche]/page.tsx` |
| Calculator disclosure accessibility | complete | `calculator-reveal.tsx` |
| Windows CRLF-tolerant tests | complete | commit `39ada10` |
| Test run on `npm ci && build` | 5 red of 226 (1 homepage word count from main, 2 form assertions, 1 offer wiring, 1 hero) | `npm test` |
