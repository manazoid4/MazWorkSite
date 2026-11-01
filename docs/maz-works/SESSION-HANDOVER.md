# Maz Works: latest session handover (public copy)

## 19 Oct: customer journey and complaints reporting transformation
- The homepage now explains Maz Works through three customer journeys and routes visitors to local-business or professional-team pages. The contact form starts immediately; its first field is visible at 390 × 844, and complaints links preselect the service.
- Professional pricing with no approval was removed. Complaints work is quoted to scope, examples use synthetic data, and process details are enough for an initial enquiry; retention terms are agreed in writing before records are shared. Optional maintenance is separate from “Keep & Improve.”
- npm run verify passed: production build, 340 tests and static smoke checks. Browser QA at 390, 768 and 1440 px found no tested horizontal overflow; screenshots are in docs/evidence/2026-10-19-mazworks-transformation/.
- Feature branch codex/mazworks-transformation-2026-10-19 is pushed. A pull request and production deployment are still pending; the branch is ready at [Create pull request](https://github.com/manazoid4/MazWorkSite/pull/new/codex/mazworks-transformation-2026-10-19).

## 18 Oct: founder bio readability
- The homepage founder section keeps its two factual paragraphs but gives each a bold lead-in and more space. The heading is calmer, contact links sit together, and the proof heading is clearer. At phone width, the photo stacks above the copy.
- `npm run verify` passed (305 tests). Browser screenshots at 390px and 1440px are in `docs/evidence/2026-10-18-founder-bio/`; neither width scrolls horizontally.

## 18 Oct: homepage colour and offer cards
- The homepage now fades from the sand hero through sage to the paper background. Its three extra offer links use light cards, clearer outcome-led wording and a small hover/focus movement. The receptionist and managed-presence prices still come from `app/offers.ts`.
- `npm run verify` passed (305 tests). Rendered screenshots at 390px and 1440px are in `docs/evidence/2026-10-18-home-colour/`; neither width scrolls horizontally.

## 1 Nov 2026: homepage and research repositioned
Homepage now leads with "Find what keeps going wrong. Fix it." and two doors: small businesses, and teams handling complaints and customer cases. /research was rebuilt around Scorensic's first real-model results (50% less body copy). Research replaced Tools in the header; Tools is still in the menu and footer. The AI rule is narrowed to "AI is tested before use" only, pending Maz's confirmation. Strategy: `docs/maz-works/STRATEGY-2026-11.md`. `npm run verify` green (370 tests); no horizontal scroll at 320px, 390px or 1440px.

> Start here: the private handoff index (`unified-memory-database/handoffs/LATEST.md`) holds research, plans and build prompts. This public file keeps only the last 3 entries; older ones are in `docs/archive/SESSION-HANDOVER-history.md`.
