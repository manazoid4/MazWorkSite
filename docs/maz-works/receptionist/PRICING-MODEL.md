# Receptionist pricing model

Written 11 Oct 2026. Every number below is printed by `node scripts/receptionist-model.mjs` (tests: `node --test tests/receptionist-model.test.mjs`). Change an input in `ASSUMPTIONS` at the top of that file and re-run. Nothing here is a live price unless it says "approved".

## 1. What is verified and what is assumed

| Item | Value | Status | Source and date |
|---|---|---|---|
| Telnyx cost per answered minute | £0.0462 | Verified | Telnyx pricing page, 9 Oct 2026 ($0.05 engine + $0.0064 LLM + $0.0032 telephony + $0.002 API fee, $1 = £0.75) |
| Telnyx number | £0.75/month | Partly verified | Global "from $1". UK-specific price NOT verified |
| Twilio inbound + Vapi cost per minute | £0.0689 (lowest tiers), about £0.104 (high end) | Verified | Twilio and Vapi pricing pages, 9 Oct 2026. Only the UK inbound rate ($0.01/min) is UK-specific |
| Twilio UK number | £2.63/month | Verified | Twilio pricing page, 9 Oct 2026 ($3.50) |
| Twilio + OpenAI realtime, self-built | about £0.0435/min | Assumption-heavy | Tokens per minute are assumed. Forum reports say real bills run higher |
| ICO data protection fee, tier 1 | £52/year (£47 by direct debit) | Verified | ico.org.uk, 9 Oct 2026 |
| Competitor list prices | See section 8 | Verified | Their pricing pages, 9 Oct 2026 |
| SMS alert cost | £0.04 per UK text | Assumed | Not checked |
| Stripe UK card fee | 1.5% + 20p | Assumed | Not checked |
| Founder time value | £40/hour | Assumed | Maz's choice |
| Set-up time | 3 hours per customer | Assumed | Not yet measured |
| Monthly tuning | 30 minutes per customer | Assumed | Matches the site promise |
| Support | 15 minutes per customer per month | Assumed | Not yet measured |
| Winning a customer | £0 cash, 2 founder hours | Assumed | Not yet measured |
| Refund and failure contingency | 5% of revenue | Assumed | A guess |
| Email and hosting | £0 | Assumed | Free tiers |

No Telnyx spend-limit feature was found. The guard is a prepaid balance with auto top-up off.

## 2. Is £79 for 300 minutes viable?

Yes on cash, thin on time. The model assumes 10 urgent texts a month and, in the right-hand columns, charges founder time at £40/hour.

| One customer, standard £79 plan | Provider | Cost of calls and number | Contribution margin | Margin after founder labour |
|---|---|---|---|---|
| 150 minutes used | Telnyx | £8.08 | £65.58, 83.0% | £35.58 |
| 300 minutes used | Telnyx | £15.01 | £58.66, 74.2% | £28.66 |
| 150 minutes used | Twilio + Vapi | £13.37 | £60.30, 76.3% | £30.30 |
| 300 minutes used | Twilio + Vapi | £23.70 | £49.96, 63.2% | £19.96 |

At 300 Telnyx minutes the cost is £14.61 for calls and the number, then £0.40 for ten urgent texts, which gives the £15.01. Contribution margin is revenue minus calls, number, texts, card fees and the 5% contingency. It does not include Maz's time.

**First month, one customer, 300 minutes on Telnyx.** Net is -£74.03. Month one earns £28.66 after labour and the £99 set-up fee (about £97.31 net of card fees), but set-up (3 hours, £120) and winning the customer (2 hours, £80) cost £200. On Twilio + Vapi the first month is -£82.72.

**Payback.** 3.6 months on Telnyx at 300 minutes (2.9 months at 150 minutes). 5.1 months on Twilio + Vapi at 300 minutes. A customer who leaves before then loses Maz money. That is the real risk, more than call cost.

## 3. Founder hours

Monthly tuning plus support is 0.75 hours per customer, steady state. Set-up and winning time are one-off: 5 hours per new customer.

| Customers | Hours a month (tuning + support) | One-off set-up and winning hours if all won in one month |
|---|---|---|
| 1 | 0.75 | 5 |
| 5 | 3.75 | 25 |
| 10 | 7.50 | 50 |
| 20 | 15.00 | 100 |
| 50 | 37.50 | 250 |

At 5 hours a week (21.7 hours a month) one founder supports 28 customers in steady state, with no time left for new ones. My judgement, not modelled: about 15 to 20 customers while still selling and setting up. Beyond that, either raise the price or stop doing monthly tuning by hand.

Total profit after labour for the standard plan at 300 Telnyx minutes: 1 customer £28.66, 5 £143.27, 10 £286.55, 20 £573.10, 50 £1,432.75 a month. The model's founder time is a cost, so this is what is left after paying Maz £40 an hour.

## 4. Maximum safe included minutes

Most minutes the £79 plan can include and still hold the target contribution margin (whole minutes):

| Target margin | Telnyx | Twilio + Vapi |
|---|---|---|
| 70% | 372 | not run |
| 60% | 543 | 337 |
| 50% | 714 | 451 |
| 0% (break-even) | 1,569 | 1,025 |

So 300 minutes is safe on both providers at a 60% target. Proposed plans at the same 60% target (Telnyx / Twilio + Vapi): Lite £49 can include 326 / 191 minutes, so 100 minutes is very safe. Busy £129 can include 906 / 580, so 600 minutes is safe.

## 5. What abusive usage does, and the guard

Someone (or a spam caller, or a loop) running 3,000 minutes costs £139.75 on Telnyx and £209.73 on Twilio + Vapi against £79 of revenue: a contribution of -£66.08 and -£136.06. The standard plan breaks even at 1,569 Telnyx minutes and 1,025 Twilio + Vapi minutes. At 1,000 minutes it is still positive on Telnyx (margin 33.3%) but already negative after labour (-£3.68).

Guards, in order:
1. One provider account per customer or per number, funded by a **prepaid balance with auto top-up off**. The worst case is the balance, not an open bill.
2. The site already says: "over 300 minutes the price is agreed first". Keep that wording. No automatic overage billing.
3. Check usage in the provider dashboard on the first of each month and after any cost-spike alert (see the delivery kit, runbook).
4. Block repeat nuisance numbers at the provider if one number causes the spike.

## 6. Four structures compared

All figures: Telnyx, 300 minutes, one customer, assumptions as above. "PROPOSAL, not live" marks anything the owner has not approved.

| | A. Standalone £79 | B. Solutions by problem | C. Customer-owned one-off | D. Text-back first, receptionist second |
|---|---|---|---|---|
| Idea | Sell the receptionist alone at £79/month | Customer picks the problem. Missed-call text-back (£149 once) is the default answer. Receptionist is the monthly option for those who want calls answered | Maz sets it up on the customer's own provider account for a one-off fee. Customer pays the provider directly. Optional care plan | Start every missed-call conversation with the £149 text-back. Offer the receptionist after it has proved useful |
| Prices | £79/month, 300 minutes (approved) | £149 once (approved), £79/month (approved) | £295 set-up (PROPOSAL, not live), £39/month care (approved care plan price, but not yet for this use) | Same as B |
| First-month net | -£74.03 | Text-back: not modelled, build time unknown. Receptionist: -£74.03 | +£96.64 (set-up fee covers the £200 of time) | As B |
| Monthly profit after labour | £28.66 | £28.66 on receptionist customers only | £6.27 (care plan only) | As B |
| Cash risk to Maz | Prepaid balance per customer | Same, but only for the smaller group who need the receptionist | None for usage; customer holds the account | Low |
| Founder time | 0.75 h/month each, forever | Text-back is one-off; monthly time only where the receptionist is sold | Set-up time up front, little after unless care taken | As B |
| Main weakness | Hard sell to a cold prospect. Payback 3.6 months | Needs the solutions pages to be clear | Customers must create a provider account and pass ID checks; harder for non-technical owners | Two sales steps |

C is attractive for cash but a poor fit for trades and small shops who will not create a Twilio or Telnyx account. Keep it as a fallback for the technical customer who asks for it.

## 7. Recommendation

**Choose B, and use D as the sales path.**

- Lead with the problem ("I miss calls when I'm on a job"). The default answer is the **£149 missed-call text-back, once** (approved price). It is one-off and cheap for the customer. Its own running costs (a texting service) are not modelled here and need checking.
- When the customer wants calls actually answered, or an enquiry needs more than a text, offer the **After-Hours Receptionist at £79/month, 300 minutes** (approved price).
- Do not sell the receptionist cold as a standalone first purchase. Payback of 3.6 months on a customer Maz has never worked with is still the weakest part of the business.

Approved prices used above: £79/month for 300 minutes, £149 one-off, Business System from £595, Keep It Running £39/month.
Proposals needing Maz's approval before anything uses them:
- Lite £49/month, 100 minutes. PROPOSAL, not live.
- Busy £129/month, 600 minutes. PROPOSAL, not live.
- Owned: £295 one-off set-up on the customer's own provider account, with the £39/month care plan. PROPOSAL, not live.
- Any overage price. Today the site says only that the price is agreed first.

Lite is probably not worth offering: at 100 minutes it earns £9.84 a customer a month after labour on Telnyx, and only £0.61 at 300 minutes. Busy looks good: £75.40 per customer after labour at 300 minutes on Telnyx (though 129 vs 79 is a large step).

## 8. Competitors (list prices, read 9 Oct 2026)

Fasthosts £39/£69/£99 a month with one month free. Rosie $49 for 250 minutes. Goodcall $79 for about 150 calls. Upfirst $24.95 for 30 calls, $59.95 for 90 calls, with a 14-day trial on real calls. Smith.ai $300 for 30 calls. Moneypenny UK price is hidden. £79 for 300 minutes sits in the middle of this field.

## 9. Uncertainty and the cheap experiment for each

| Unknown | Why it matters | Cheapest experiment |
|---|---|---|
| Real cost per minute on Telnyx | The whole margin rests on £0.0462 | Put £10 prepaid on Telnyx with auto top-up off, make 20 test calls, read the invoice |
| UK number price | Assumed £0.75 | Check the UK number price in the Telnyx portal before buying (free to look) |
| Spend control | No spend-limit feature found | Confirm that a prepaid balance stops service at zero, during the £10 test |
| Real minutes a small business uses | 300 may be far too many or just right | First paying customers: record minutes monthly. The 150-minute case in this model is a guess, not an observed fact |
| SMS cost | Assumed 4p | Send 5 test texts and read the charge |
| Set-up and tuning time | The labour cost dominates | Time the first customer's set-up and first tuning, with a clock |
| Divert behaviour on the customer's network | Whether calls reach the line | Test-call checklist in the delivery kit |
| Churn | 5% monthly churn turns 12-month profit on 10 customers from £1,438.60 to £238.60; 10% churn makes it -£961.40 | Nothing cheap; watch the first six months |
| Stripe fee | Assumed | Read the first payout |
| Compliance wording | Not legal advice | Have a professional check the client data note before the first customer |

## 10. Model limits

It does not model VAT (none added), seasonal usage, the cost of the Telnyx number if a UK number needs identity verification, text-back build time, or tax. The ICO fee (£52/year) is a fixed business cost, about £4.33 a month, and is not split per customer. Treat the output as a planning tool, not a forecast.

## 11. The £99 set-up fee (approved and live, 18 Oct 2026)

The live receptionist charges a one-off £99 set-up fee (Maz, 18 Oct 2026), so the first month loses less and payback is shorter. This section keeps both sides side by side, with the monthly price unchanged (£79, 300 minutes). Every figure comes from `paybackMonths` and `firstMonth` in `scripts/receptionist-model.mjs`, run with `{ ...PLANS.standard, setupFee: 0 }` and `{ ...PLANS.standard, setupFee: 99 }` (the fee is net of Stripe's 1.5% + 20p):

| Provider, minutes used | Payback, no fee | Payback, £99 fee | First-month net, no fee | First-month net, £99 fee |
|---|---|---|---|---|
| Telnyx, 150 | 5.6 months | 2.9 months | -£164.42 | -£67.10 |
| Telnyx, 300 | 7.0 months | 3.6 months | -£171.34 | -£74.03 |
| Twilio + Vapi, 150 | 6.6 months | 3.4 months | -£169.70 | -£72.39 |
| Twilio + Vapi, 300 | 10.0 months | 5.1 months | -£180.03 | -£82.72 |

To reproduce:

```
node --input-type=module -e "import { paybackMonths, PLANS } from './scripts/receptionist-model.mjs'; for (const fee of [0, 99]) console.log(fee, paybackMonths({ plan: { ...PLANS.standard, setupFee: fee }, minutesUsed: 300 }).toFixed(1))"
```

The fee roughly halves payback, and it is live: `AFTER_HOURS_SETUP_FEE` in `app/offers.ts` is `99`, so pages say "£99 set-up, once" instead of "Set-up included". A customer who leaves in the first three months can still lose Maz money, and a fee may put off a cold prospect; both were accepted on 18 Oct 2026. To reverse it, set the one line back to `0` and update the two set-up lines in `DELIVERY-KIT.md` and `PLAYBOOK.md`.
