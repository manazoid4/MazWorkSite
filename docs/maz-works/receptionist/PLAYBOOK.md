# Receptionist playbook (one page)

Status on 11 Oct 2026: the browser demo works; the real phone line does not exist yet (no provider account, billing or real number).

## Free first (Maz, 11 Oct 2026)
Nothing paid for now: no phone line, number, provider credit or subscription. Sell and prove with what costs nothing: the browser demo, a personal demo link, the "four ways" comparison and the £149 text-back. Spend money only when it is crucial, which means one of two things:
1. **A prospect has said yes in writing** to the receptionist. Then open the provider account with the smallest prepaid top-up, auto top-up off.
2. **An exhibition or event is coming** and a live number would be shown there. Set it up the week before, prepaid, and switch it off after.

Until then, agents do not propose a provider account or a real number as the next step.

## Files
- Price and promises: `app/offers.ts` (`AFTER_HOURS`: £79/month, 300 minutes, £99 one-off set-up, month to month, one month's notice).
- Background, decisions and honest-by-design rules: `docs/maz-works/AFTER-HOURS-RECEPTIONIST.md`.
- Demo answers: `app/receptionist-demo/engine.mjs` (rules, only the business's own details, never guesses a price). Tests: `tests/receptionist-demo.test.mjs`.
- Costs and recommendation: `docs/maz-works/receptionist/PRICING-MODEL.md`. Model: `scripts/receptionist-model.mjs`. Tests: `tests/receptionist-model.test.mjs`.
- First customer kit: `docs/maz-works/receptionist/DELIVERY-KIT.md`.

## How it is sold
Say "automated receptionist", never "AI". Lead with the problem (missed calls), not the tool. Default first answer is the £149 missed-call text-back (one-off); the receptionist (£79/month) is the monthly option. No free trial is claimed. The promise is: you hear it answering as your business before your first month is billed. Over 300 minutes the price is agreed first.

## How the demo works
`/receptionist-demo` is a pretend call in the browser, using the browser's own speech tools. Answers come from `engine.mjs`. `/receptionist-demo/make` builds a personal link with the prospect's details in the URL hash (nothing stored). It is labelled as a demo, not their real line.

## How to qualify
Use section 1 of the delivery kit. Fit: misses calls worth more than £79, has divert-when-unanswered, asks repeated questions. Not a fit: mostly emergencies, payments on the phone, live diary booking.

## How to estimate cost
Run `node scripts/receptionist-model.mjs`. At 300 minutes on Telnyx the standard plan costs £15.01 a month per customer and keeps a 74.2% contribution margin; on Twilio + Vapi, £23.70 and 63.2%. Founder time (assumed 0.75 hours a customer a month) is the bigger cost. Change inputs in `ASSUMPTIONS`; unverified numbers are marked there.

## Needed before go-live (Maz only, and only once a trigger above is met)
Provider account and ID check; prepaid balance with auto top-up off; Stripe £79 subscription link; ICO fee check; professional check of the data note; approval of the service wording. Full list at the end of the delivery kit.

## When the cheaper option fits
Callers only need a reply or a link, there are few missed calls, they want to pay once, or divert-when-unanswered is not available: sell the £149 text-back (see `app/offers.ts` Starter Automation).

## How a future agent resumes
1. Read `docs/maz-works/AFTER-HOURS-RECEPTIONIST.md`, then this folder.
2. Run `node --test tests/receptionist-model.test.mjs tests/receptionist-demo.test.mjs`.
3. Never invent customers, results or prices. Proposal prices (Lite £49, Busy £129, Owned £295) are not live until Maz approves them.
4. Replace assumed numbers with measured ones after the first customer. No paid provider test before a trigger in "Free first" is met.
