# UX execution status (feat/ux-obsidian-p0)

| Task | Status | Files | Commit |
|---|---|---|---|
| P0-03 nav + menu | done; header CTA kept as "Free preview" (existing tests leak-check.test.mjs require it; handoff asked "Get a Quote") | app/nav.ts | see git log |
| P0-04 headings + 65ch measure | done | app/globals.css | see git log |
| P0-02 menu drawer + scroll lock | done | app/site-menu.tsx, app/wayfinding.css | see git log |
| P0-01 obsidian tokens, bands removed (also covers P1-01 card striping) | done | app/colour.css | see git log |
| P1-01 card striping | covered by P0-01 (pastel tokens collapsed) | - | - |
| P1-02 footer font | no monospace rule on .mw-footer-convert found; footer inputs dark via P1-03 | - | - |
| P1-03 inputs | done | app/enquiry.css | see git log |

Tests after P0-03: typecheck OK; typography + site-polish 7/7 pass.
Next: merge PR once checks green.
Tests after P0-04: typecheck OK; build OK; 7\/7 pass.
Tests after P0-02: typecheck OK; build OK; typography+polish+static-export 44/44 pass.
Tests after P0-01: typecheck OK; build OK; 7/7 pass; 390px \/prices screenshot checked (readable, no horizontal scroll).
Final: npm run verify green, 327 pass 0 fail. /demos kept in menu (demos + objects tests need it).
