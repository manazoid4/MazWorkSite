# Maz Works event acquisition — Proof Pass (plan only)

**Status:** Proposed, not built or advertised · **Recorded:** 2026-10-11

**Canonical long-form concept:** [Maz Works Knowledge Vault — Proof Pass](https://github.com/manazoid4/maz-works-knowledge-vault/blob/main/wiki/projects/maz-works/EVENT-PROOF-PASS.md). This page is a site-repo implementation handoff, not another source of business policy.

## Outcome

At founder, technology and local business-owner meetups, use a reusable **NFC Proof Pass** marked with a real problem and return date to create a memorable second conversation. Pitch: **"I owe you proof. Not a pitch."** Existing Maz Works free demo proves one bounded example on test data; the visitor returns within **7 days** for a personal walkthrough, in person or online. **No free full implementation is promised**. The everyday free demo never expires with the card.

## First event pilot — no code

- At most five cards if Maz can fulfil five concrete demos. Write each business's problem, proposed *test demonstration*, and real return date on a removable sleeve. Do not write confidential data or personal contact details permanently on the NFC card.
- NFC and printed QR both point to `https://www.mazworks.uk/free-plan?src=event-proof-pass` (the live existing route). Test on Android, iPhone and with NFC unavailable. No new visitor account.
- Ask permission before following up; collect details via the existing form if the visitor chooses. The separate private CRM/lead records contain consent, delivery promise, status and source. Do not put identifiable lead information in this public repo.
- Bring the card back / book a return to see an existing test demo and one practical next step. Only propose priced production work after scoping.
- Ask the organiser before displaying a banner, demo table or doing a presentation. Target tech-founder and local-owner events, not public-market stalls.

## Implementation brief after measured pilot and explicit owner GO

1. **Reuse existing infrastructure:** `/free-plan`, `app/free-plan/leak-check-form.tsx`, `api/enquiry.js`, `?src=` attribution, `app/site.ts` (MAIN_CTA, CHECK_REPLY_TIME, BOOKING_URL) and `app/offers.ts` (all prices). No duplicate offers, pricing or uncontrolled marketing mail.
2. **Visitor path (optional):** small noindexed, accessible card page with proof number, *only safe public placeholder copy*, claim/free-demo action, how the test example differs from a live installation, seven-day return option, online return fallback and date labelled as actual calendar date. Physical card reusable; QR fallback. The initial NFC should stay a generic public URL.
3. **Owner path (optional):** limited private card workflow with `issued > claimed > scoped > prepared > presented > returned/closed` and declined / can't-fulfil; a human approves the promise and the outgoing message. No scan-triggered CRM record or email.
4. **Security/privacy:** opaque unguessable tokens if individual public claim links become necessary; treat token as a secret bearer link, expiry and revocation, no PII or names in links, URLs, metadata, logs or analytics. Personal contact information only in an authorised private record with explicit consent and removal capability.
5. **UX:** visually designed, small screen first (390px), clear NFC + QR equivalent, usable without JavaScript or microphone. Never call a storyboard a working product.
6. **Test gate:** unknown/expired tokens, no NFC, duplicate claims, missing consent, full capacity, form failure, quote integrity, lead-source preservation, mobile keyboard and screen reader; execute `npm run verify` and the site repo PR checklist. Show evidence before claiming anything deployed.

## Source-of-truth constraints

- No public AI-assistant/AI-agent offer. Sell specific business outcomes. No claimed clients, uptake or performance without evidence.
- Don't alter the primary `Get my free demo` CTA. The seven-day invite is **only** for an *additional individual walkthrough*, not a deadline for obtaining the ordinary free demo.
- Follow `AGENTS.md` + `PLAYBOOKS.md`; branch + PR, never push site work directly to `main`. This doc alone should not trigger a Vercel deployment.
- Do not give away 3D-printed promotional gifts: existing 3D gift rules reserve free items for paying customers. Reusable NFC cards are loaned.
- No automated outreach or additional spend without the owner's approval.

## Pilot decision

Record at two events: relevant conversations, proof passes issued, suitable demos scoped/delivered within the existing one-working-day target, return walkthroughs, quotes, paid starts and time cost. **Next action:** test a single reusable card and the existing form; only commission a card-specific site feature if return demand is demonstrated.
