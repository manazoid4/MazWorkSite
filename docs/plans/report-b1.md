# Report B1

Changed: home (hero yellow highlight on "Better", buckets, doors, proof, About block, contact band, short footer; order per brief), one BUCKETS array in three-buckets.tsx (soft band, old dark CSS deleted), condensed /what-we-do (buckets with inclusions and price links, "how I set it up" once; the footer band is its one CTA), new /about, ManazirLine now has a `block` variant (home About), short footer hard-coded in site-chrome.tsx (+ site-footer.css; default footer band restyled soft), DESIGN.md rewritten, home-reposition.css deleted (unused), home-visuals.css neo-brutal remnants softened, /about added to sitemap.ts (one line).
Routes removed: none.
Tests changed: static-export, homepage-repositioning, b2b, loops, objects, three-buckets, customer-journey-pages, leak-check, naming (footer no longer lists /refer, video, 3d-printing, lab, site-map; home About text moved to /about; free-preview home link now /contact; bucket-settle test removed).
Not done / notes: Turbopack rejects the node_modules link, so built with `next build --webpack`; 2 tests fail only because of that (chunk paths, analytics chunk). The eyebrow pill and hard-shadow buttons on non-home pages come from colour.css (not mine). Footer links to /about and /what-we-do rely on other builders keeping those routes.
Shots: Desktop\MazWorks\planning\shots\after-b1
