# Maz Works — editorial art direction (19 October 2026)

This is a **workable specification**, not instructions to turn Maz Works into a restaurant. It is also the brief to paste into the already-running, self-hosted [OpenDesign](https://github.com/nexu-io/open-design) project. **Do not call cloud models or spend the user's $0.50 unless expressly approved and the local instance is actually connected.**

## References studied
- https://raccoonweb.co.uk — client-first entry routes, plain-spoken outcomes, honest project storytelling. Adapt the thinking, not the design/assets.
- https://blanchettesoho.co.uk — atmosphere, strong editorial pacing, considered typography, bespoke visual character. **Do not reuse its food, bistro identity, image rights, branding, or address.**
- https://impeccable.style/slop/ — anti-pattern catalogue: repetitive rounded cards, AI-purple gradients, neon/glow, meaningless decorative grids, fake metrics, pill badges above headings, giant bland headlines, generic icons, bad mobile hierarchy, microscopic labels.

## Identity
Independent studio, not a multi-service marketplace. Two clear ways to begin:
1. Customer-facing: websites, digital presence and the customer journey.
2. Behind the scenes: operational reporting, complaints improvement and carefully scoped workflows.

Keep the existing business packages, prices and deeper routes intact until Maz approves changes. Do not narrow the whole company to complaints only without approval; complaints remain a differentiating specialist capability. Work examples must distinguish a **client** build (Scrap Finance Partners) from an **own project** (JobFilter). No imaginary numbers or testimonials.

## Visual direction
Dark botanical ink #151D1A; deep ink #111713; off-white #F0ECDF; muted bronze #C4A079; pale chalk section #E5E0D5; burnt clay portrait section #B99370. Distinctive editorial serif for headlines and clean readable sans for function. Substantial whitespace and alternating section rhythm. One hero project **real screenshot**; work is displayed large like a gallery. Flat colors, clean edges, very restrained motion. No stock photos, stock mascots, generated data, neon, auroras, fake phone frames, liquid blobs, infinite marquee or glass cards.

## OpenDesign prompt — copy verbatim if using the local UI
Design two alternative, high-quality responsive art directions for Maz Works, an independent UK business studio, using the live code in manazoid4/MazWorkSite and the website references in this file. Bring the art direction of a carefully designed boutique editorial brand, but not a restaurant theme. Keep truthful product labels and real photography/screenshot assets from the repository. Focus on intentional typography, crop, hierarchy, and rhythm. The visitor must immediately know Maz Works improves both customer-facing websites/journeys and the internal complaints/reporting processes that back them up. Show a full desktop at 1440px and mobile at 390px. Use no purple gradients, glow, pill chips, repeated icon cards, generic AI hero text, artificial metrics or imaginary clients. Ask for critique based on the Impeccable anti-pattern rules; choose the better of two distinct compositions. Output edit-ready HTML/CSS or a grounded implementation plan, not an image-only mockup. Use only a free local model, no paid credits, unless explicitly instructed otherwise.

## Implementation choices in branch
- Editorial homepage isolated to \`app/page.tsx\` and \`app/editorial-home.css\`; other product and service pages still use legacy styles and deserve gradual migration.
- All CTAs are links to working existing enquiry/booking routes; no dummy controls.
- Home has two service lanes and two verifiable projects. Secondary products are accessible via site map.
- Headline, feature work, evidence, about, and CTA appear in deliberate order.
- No site-wide CSS override piling: this is a *scoped* transition until a second PR replaces the legacy global design system.
- Accessibility: logical headings, labelled navigation, visible focus, real alt text, >=44px prominent actions, reduced-motion support.

## QA gates
1. Typecheck and production build.
2. Screenshot at 1440x900 and 390x844 with actual assets loaded, assert no horizontal overflow.
3. All three primary CTA positions land on /free-plan and contact and booking links work.
4. Check no new claims or fake social proof were introduced.
5. Confirm static export and existing forms are not broken.
6. Review old snapshot-copy tests; update only those whose requirements the owner deliberately superseded.
