# Maz Works — /brag film plan
**Created:** 11 October 2026
**Skill reviewed:** `latent-spaces/brag` at `skills/brag/SKILL.md`, with the lean render guidance in `skills/brag-slim/SKILL.md`.
**Status:** Conceptual 20-second film implemented as a browser-time-seekable animation on a *preview-only*, noindexed site route. No new customer results or paid media. The existing 30-second homepage video remains unchanged.

## Nine-question inspection
1. **What is it?** A founder-led UK small business systems shop building automation, connected tools, custom software and websites, with a free working test demo and fixed price.
2. **Claim worth showing:** a missed business call can trigger a helpful text and capture a new request, instead of the owner chasing every enquiry.
3. **Visual hook:** stark black type and a high-contrast orange missed-call card within two seconds.
4. **Actual site material:** homepage missed-call → text → booking/request explanation (`app/page.tsx`, `app/walkthrough-video.tsx`), site colour tokens (`app/globals.css`), named work proof JobFilter and Scrap Finance Partners.
5. **Length:** 20 seconds, five scenes, 1280×720, browser animation intended for event screens/LinkedIn; landscape chosen to match existing demo video and laptops.
6. **Tone:** polished, founder-led, no fake techno-visuals or generic software marketing.
7. **Audio:** restrained pulse and soft interaction cues in MP4 render; HTML site preview is caption-driven and silent. Voiceover off by default.
8. **Share caption:** A missed call shouldn't mean a missed opportunity. See an example of a useful workflow by Maz Works.
9. **User flow:** missed call → automatic text → enquiry/request captured for human review. This is a **labelled example**, not a working customer integration, actual revenue or confirmed live booking.

## Storyboard (20 seconds total)
| Seconds | Beat | Visual / message | Sound cue |
|---|---|---|---|
| 0.0–3.2 | Hook | "The phone rang. You were busy." White page, black serif-free typography, orange missed-call card. | Muted low tick |
| 3.2–6.7 | Response | "Let the follow-up happen." Dark split with an illustrative incoming/outgoing text. | Warm bass lift, soft tap |
| 6.7–12.8 | The thing working | Three stages in the actual Maz Works demo flow: missed call, helpful text, request captured. Labels appear sequentially and hold. | Three restrained percussive cues |
| 12.8–16.5 | Who built it | "Designed. Built. In-house." JobFilter shown as a *founder's product*, Scrap Finance Partners as a *client website*; no outcomes invented. | Music widens |
| 16.5–20.0 | Outro | "Show me the problem." "Get my free demo" and mazworks.uk/free-plan. | Quiet resolve, fade |

## Creative and safety rules
- **One concrete story** instead of listing fourteen services. Never invent money saved, call volumes, client outcomes or testimonials.
- **Accuracy:** a demo text is labelled illustrative; production automations and real telephony need paid implementation/approval. Never present the browser receptionist as an installed phone service.
- **Founder differentiation:** independent end-to-end building without publicising a private location, qualifications not confirmed, age, hardship narrative or imagined team.
- **Real proof taxonomy:** JobFilter = own product; Scrap Finance Partners = client website. Work links remain distinct from simulated automation.
- **Brand fidelity:** `--paper:#f6f6f3`, `--ink:#151615`, `--signal:#ff6b1a`, sans Aptos/Segoe + mono Cascadia/Consolas. No external media or fonts.
- **No copy/offer drift:** CTA is the exact `MAIN_CTA`; no new prices. Primary route to `/free-plan` with a campaign `src`. No nav or sitemap link to this concept during review.
- **Accessibility:** important copy remains readable, animation can be paused/replayed, reduced-motion begins on the end slate, transcript/caption follows in host page; no autoplay audio.
- **Licensing:** original code-generated artwork. The `brag` skill served as a process reference; its bundled third-party audio/assets were not reused.

## Outputs and exact status
- `app/brag/page.tsx` + `app/brag/brag.css` — a labelled promo review route with CTA, transcript, usage notes.
- `public/promo/brag/scene.html` — animation with `window.seek(seconds)` for reproducible frame capture and pause/replay controls, hosted from Vercel static assets.
- `scripts/render-brag.mjs` — source-based render script. **Does not run on Vercel build.** To generate an MP4 and poster, run on a machine with optional Playwright + FFmpeg. Audio (if available) is a deliberately subtle generated bed, not bundled third-party music.
- `assets/promo/brag/share-copy.txt` — draft social copy (not posted).
- `tests/brag-promo.test.mjs` — asserts route and brand/claim guardrails.
- No MP4 claimed published to Vercel until one is generated, committed separately and visually reviewed.

## Audit findings and next release gate
1. **Mismatch between capability and story.** The homepage provides a 30s workflow example but the site has no short reusable founder-branded promo. Remedy: 20s scene with real source-level claims and independently named work.
2. **Scope/claims risk.** The demo isn't a real customer result. Remedy: explicit example qualifiers within film and review page; no performance claims.
3. **Promotion bottleneck.** A marketing asset without post copy or a clear free-demo route loses value. Remedy: preview page, post caption, branded CTA, and NFC-event reuse instructions.
4. **Single-format limitation.** First version is landscape. For vertical Reels, recompose deliberately; do not crop tiny laptop UI.
5. **Audio/export gate.** Static motion preview uses no audio; rendered MP4 requires optional local tools and manual QA. Don't claim /brag Hyperframes check passed when Hyperframes was not run.

**Next:** open the preview at 390px and desktop, play once with captions/text, inspect one full loop, then run the render script for MP4 and check poster/audio before publication. Post nothing automatically.
