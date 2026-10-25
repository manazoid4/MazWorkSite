# BUILD_STATUS - site reimagination

Branch: `feat/site-reimagine` (from main 45d066c). Not merged, not deployed to production: Maz must approve.

## Phase
Build complete, verified locally, PR open for Maz's review on the Vercel preview.

## Milestones done
- Plan and ownership contract: `docs/reimagine/PLAN.md`.
- Route audit, old-to-new mapping, items for Maz to confirm: `docs/reimagine/ROUTES.md`.
- Copy rules for future work: `docs/reimagine/COPY-GUIDE.md`. Design direction: `DESIGN.md`.
- Nav cut to six links: What I do, My work, Prices, Tools and demos, About, Contact.
- Wording rewritten on home, what-we-do (four areas + 3D strip), prices, about, contact, faq, proof, and the hidden audience pages.
- New `/tools` hub with honest labels (client work / internal project / concept demo).
- New `/tools/restaurant-tables` table picker (data in `layout-data.ts`, logic in `logic.ts`, isometric tilt from 900px, flat on phones). Docs: `docs/restaurant-table-picker.md`.
- Removed `/mazos` and `/whats-new` with 301s (`/proof#built`, `/proof`).
- Fixed the 8px sideways scroll at 768px (footer newsletter breakpoint).

## Evidence (25 Oct 2026)
- `npm run build` ok, `npx tsc --noEmit` ok, `npm test` 361/361, `npm run smoke` ok.
- Playwright: 8 pages x 390/768/1440 px, 0px horizontal overflow, 0 console errors.
- Table picker clicked through (select, reserve demo) at 390 and 1440 px.

## Known open items
- Prices numbers untouched; `price-list.tsx` layout not restructured.
- Header button still "Free preview"; AGENTS.md says the primary action is "Tell me what's not working" - Maz to choose (ROUTES.md item 13).
- PR #198 (feat/audit-fixes-2) not reviewed for porting.
- No analytics or Search Console data was available for the SEO decisions; no indexed URL was removed without a redirect.
- `three-buckets.tsx` and the block variant of `manazir-line.tsx` are now unused on home.

## Recovery
```
cd C:/Users/Maz/repos/MazWorkSite && git checkout feat/site-reimagine && git pull
npm ci && npm run verify
```
