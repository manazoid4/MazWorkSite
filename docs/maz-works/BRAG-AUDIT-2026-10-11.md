# /brag audit — Maz Works
11 October 2026 · Based on `latent-spaces/brag` skill plus source review of current `mazos-site/main`

## What /brag actually does
A promotional **15–25-second launch film**, not a standalone website/business auditor. `/brag` reads the code to find a hook, extracts brand assets and demonstrates a real entry → action → result flow. Classic mode hands composition to Hyperframes; slim mode builds a video with whatever tools are available. This pass followed its inspection, storyboarding, accurate-claims, tempo and share-copy principles, but **did not execute Hyperframes**, whose skills and CLI were not available in this connected environment.

## Findings prioritised by sales usefulness
| Issue | Priority | Evidence | Decision |
|---|---|---|---|
| Website home message is narrowed to calls/bookings while Maz Works has real broader software work | Medium | `app/page.tsx` + case studies | Brand the end slate "Designed. Built. In-house." and show distinct JobFilter/client categories without altering homepage positioning in this PR |
| Real business operator pain buried under multiple site features | High | `app/page.tsx` and 30s demo workflow | One 20s missed-call story, not a montage of 16 offers |
| Potential invented success / "already deployed" misconception | High | Receptionist browser demo is not an actual phone line | Demo-data disclosure in scene 2/3 and on the review page |
| Only a single existing 30s homepage walkthrough to demonstrate an automation | Medium | `app/walkthrough-video.tsx` | Code-rendered short launch film as an independent asset, no duplication of page video |
| A pretty clip with nowhere to send the prospect | High | `MAIN_CTA` and existing free-demo route | End at the approved free-demo action. URL source attribution for campaign |
| Physical NFC Proof Pass could link to an impractical video | Low | `docs/maz-works/EVENT-PROOF-PASS.md` | Provide lightweight HTML standalone scene to loop without sound at authorised business events |

## Things consciously NOT changed
Pricing, homepage hero, nav, schema, live enquiry API, receptionist voice prototype, draft PR #148/#149/#150, real outreach or paid accounts. Do not confuse this marketing sprint with merging the unrelated drafts. Commercial/safety policy remains in `AGENTS.md`, `GOALS.md`, and `app/offers.ts`.

## Release risks
- The code-rendered website animation is a **preview**, not a downloadable MP4 on Vercel until produced/uploaded.
- Needs actual browser playback QA, mobile viewport review and a manual check that no fake screenshots or promises are implied.
- No public YouTube, TikTok, Instagram or LinkedIn post is sent from this PR.
- Video audio is not from a verified licensed third-party track; local renderer uses an original generated low-level soundtrack.
- If offering /brag as a repeatable agency service later, create a narrow deliverable/pricing with owner signoff. This experiment is for Maz Works' own marketing.
