# Receptionist delivery kit (first paying customer)

For the After-Hours Receptionist: an automated receptionist that answers calls the owner can't pick up, answers approved FAQs, takes a message, follows urgent-call rules and emails a summary. £79/month, 300 minutes, £99 one-off set-up, month to month, one month's notice. Cost model: `PRICING-MODEL.md`. Status on 11 Oct 2026: NOT yet connected to a real phone line (no provider account, billing or real number). The browser demo exists. Do not promise a go-live date until the "Only Maz can do these" list is done.

Customer-facing wording: "automated receptionist". Never "AI". It tells callers it is automated. Never claim legal compliance.

## 1. Prospect qualification

Tick all that apply. Fit needs the first three.
- [ ] Misses calls they would have wanted (on a job, with a customer, closed evening, weekend).
- [ ] A call that becomes work is worth more than about £79 (one saved job pays for months).
- [ ] Their mobile or landline has "divert when unanswered" (section 6).
- [ ] Callers ask the same ten or so questions (hours, area, services, how to book).
- [ ] The owner will give approved answers and read the weekly or daily summary.

Not a fit, or wait:
- [ ] Mostly emergency calls (burst pipes, lockouts) where seconds matter. It takes a message and tells emergencies to ring 999, but it is not an emergency service.
- [ ] Wants card payments, medical, legal or financial advice taken on the phone. Not included.
- [ ] Expects it to book into a live diary. Not included.
- [ ] Wants a phone line that never rings at all. Needs a different set-up.
- [ ] Heavy call volume (over about 300 minutes a month). Price is agreed first.

**When the £149 text-back is the better answer:** they mostly want callers to get a reply and a link or a question, not a voice conversation; they have few missed calls; they want to pay once and not monthly; or the divert is not available on their line. Sell the £149 one-off missed-call text-back first. Offer the receptionist later if they ask for calls to be answered.

## 2. Business information intake

Copy into a private note for each customer. Never commit it to the repo.

```
Business name (as callers know it):
Owner / who gets messages:
Email for summaries (and a second one?):
Mobile for urgent texts (optional):
Summary timing: after every call / one morning digest at ____
Opening hours (by day, bank holidays):
Area covered (towns, postcodes, miles):
Services offered (bullets):
Services NOT offered:
Prices to state (only ones they publish; otherwise "I'll pass this on"):
How to book / what happens next:
Current phone number and network or provider:
Landline, mobile or VoIP:
Who answers today when they are free:
Words that mean urgent (e.g. flooding, no heating, gas smell, burst):
Urgent action: text me / ring me / message only:
Names callers may mention (staff) and how to say them:
Greeting wording they want:
Holiday dates in the next 3 months:
Existing website and Google Business Profile link:
Number of calls missed in a typical month (their estimate):
```

## 3. Customer-approved FAQ template

Only approved answers are used. If it is not on this list the receptionist takes a message.

| Question a caller asks | Approved answer (customer's words) | Approved on (date) |
|---|---|---|
| What are your opening hours? | | |
| Which areas do you cover? | | |
| Do you do [service]? | | |
| How much is [service]? | "It depends, I'll take details so [owner] can quote." (or a published price) | |
| Do you offer free quotes? | | |
| How soon can someone come? | | |
| How do I pay? | | |
| Are you insured / qualified? | (only what they will stand behind) | |
| Anything else frequent | | |

Rules: no prices unless the customer has published them. No claims about guarantees or qualifications the customer has not given in writing. The customer signs off the table (an email reply saying "approved" is enough) before go-live.

## 4. Greeting and fallback rules

Greeting (edit): "Hello, you've reached [Business]. I'm an automated receptionist. [Owner] can't take your call right now, but I can answer a few questions or take a message. How can I help?"

Fallbacks, in order:
1. Didn't understand: ask once more in different words.
2. Still unclear: "I'll take your name and number so [owner] can ring you back."
3. Question not on the FAQ: "I don't want to guess. I'll pass that on." Take a message.
4. Caller asks for a person: say the owner will call back, take the message.
5. Silence for about 8 seconds: "Are you still there?" Then a polite goodbye and a "silent call" note in the summary.
6. Caller seems to be in danger or says emergency words: "If this is an emergency, please hang up and ring 999." Then flag as urgent.
7. Obvious sales or spam: keep short, flag as nuisance.

Message must contain: name, number (read back digit by digit and confirmed), what they need, how soon.

## 5. Personalised demo process

The site has `/receptionist-demo/make`, a link maker. Details go into the link's `#c=` hash; nothing is stored.
1. Open `/receptionist-demo/make`. Enter business name, hours, services, urgent words. Prices only if the prospect publishes them.
2. Copy the personal link. Open it once yourself, run two scenarios (normal enquiry, urgent).
3. Send the link with one line: "This is a demo in your browser using the details from your website. It is not your live phone line."
4. The demo is clearly labelled as a demo; do not present it as the real service or as recorded customer calls.
5. Log what they said back. Fix wrong answers in the FAQ, then re-send.
6. Do not collect personal data in a demo.

## 6. Phone forwarding compatibility checklist

Set the phone to "divert when unanswered" (also called "no reply"/"no answer"). No UK mobile network offers a time-of-day divert, so after-hours-only cover means either leaving divert-when-unanswered on all the time, or switching it on each evening.

- [ ] Network or provider: ______
- [ ] Line type: mobile / landline / VoIP / switchboard
- [ ] Which divert types exist: always / busy / no answer / unreachable
- [ ] Number of rings before it diverts (can it be changed?): ______
- [ ] Diverting to a UK number is allowed (some plans block it, test it)
- [ ] Voicemail turned off or it will catch the call first
- [ ] Caller ID of the original number passes through (or the provider reads it)
- [ ] Network's own instructions found. Only Vodafone publishes codes officially (`61*` + number to set divert when unanswered, `##61#` to cancel). Use the other networks' own help pages; do not guess codes.
- [ ] Landline: ask provider for "call forward on no reply" and any charge
- [ ] VoIP or switchboard: use its own forwarding rules, test each
- [ ] Cost to the customer of forwarded calls (calls out of their allowance may be charged): ______
- [ ] Test with a second phone: ring, don't answer, confirm the receptionist answers within the expected rings
- [ ] Test cancel: customer can turn the divert off themselves

## 7. Provider set-up guide (provider-agnostic)

Options priced in `PRICING-MODEL.md`: Telnyx (cheapest checked), Twilio + Vapi. Steps are the same.
1. Create the provider account in Maz's name. Complete any ID and business checks (needed for a UK number).
2. Fund a **prepaid balance**. Turn **auto top-up off**. Start with £10 for a test, then keep roughly one month of expected usage.
3. Buy **one number per customer**. Record number, date and monthly price.
4. Create the voice assistant for that customer only. Paste in the greeting, the approved FAQ and the urgent rules (sections 3 and 4). Do not paste anything not approved by the customer.
5. Set the assistant to say it is automated. Turn **call recording off**. Keep transcripts for **30 days** only.
6. Point the number at the assistant. Set email summary to the customer's address (and one for Maz).
7. Set up urgent text/ring alerts (cost assumed 4p a text).
8. Set a usage alert at 200 and 300 minutes if the provider offers one; otherwise check weekly.
9. Test by calling it. Do the full acceptance script (section 11).
10. Record in the customer file: provider, number, assistant name, date, balance.

## 8. Client data responsibilities (plain words)

**This section needs a professional check. It is not legal advice and does not claim compliance.**

- The customer is the one who decides why and how callers' details are used. In plain words they are likely the "controller". Maz and the provider handle the data on their behalf, likely "processors". Confirm this with a professional.
- Callers share names, numbers and what they need. Treat all of it as personal data.
- Recording: **off by default**. Do not turn it on without a written yes from the customer and a clear line to callers.
- Transcripts: kept **30 days** by default, then deleted. Say so in the customer's note.
- Callers are told it is an automated receptionist. Keep that line.
- Summary emails go only to the people the customer names.
- Never store card details. Never take payments by phone.
- Tell the customer: you are responsible for your own caller privacy information and for getting your data protection registration right. The ICO fee (tier 1, £52 a year, £47 by direct debit, checked 9 Oct 2026) is for Maz's own business; ask a professional whether it applies to the customer too.
- Keep a short written data note given to the customer (what is collected, where, 30 days). Have it checked before the first customer.
- If asked to delete someone's data: do it in the provider and tell the customer.

## 9. Payment and cancellation checklist

- [ ] Price stated in writing: £79/month, £99 one-off set-up, 300 minutes, over that the price is agreed first.
- [ ] Month to month. Cancel with one month's notice.
- [ ] No VAT is added to the price.
- [ ] Stripe subscription link created (Maz only) and tested with a real £79 payment.
- [ ] £99 set-up collected as a separate one-off (a second Stripe one-off link, or a Stripe invoice) before the number is bought. The Buy now link covers the monthly only, so the first charge a customer sees on it is £79.
- [ ] First bill only after the customer has heard it answering as their business.
- [ ] Customer knows who to contact for a problem.
- [ ] Cancellation: customer emails; Maz confirms the date and the last billing day; stop the subscription in Stripe; close the number (section 14).
- [ ] Refund approach decided in advance (assumption in the model: 5% of revenue set aside).

## 10. Go-live checklist

- [ ] Intake complete (2). FAQ approved in writing (3). Greeting approved (4).
- [ ] Forwarding method confirmed and tested (6).
- [ ] Provider set up, recording off, 30 days (7).
- [ ] All 10 acceptance calls passed (11).
- [ ] Prepaid balance funded, auto top-up off, usage alert noted.
- [ ] Customer told how urgent texts look and what to do on a wrong one.
- [ ] Customer has the data note (8) and the terms (9).
- [ ] Customer turns the divert on in front of you or on a call, then you ring it once more.
- [ ] Summary email arrived at the customer's address.
- [ ] Subscription started only after "I've heard it as my business".
- [ ] Diary a check at day 3, day 14 and day 30.

## 11. Test-call acceptance script

Use a second phone. Pass means the summary is correct and nothing invented. Record result for each.

| # | Scenario | What to say | Must happen |
|---|---|---|---|
| 1 | Normal enquiry | "Do you cover [town]?" | Correct approved answer, offers to take a message |
| 2 | Opening hours | "When are you open?" | Hours match the intake |
| 3 | Unknown price | "How much for [job]?" | Does not guess. Takes details, says the owner will quote |
| 4 | Take a message | Give name and number, say a need and how soon | Message read back; summary has all four fields |
| 5 | Wrong number correction | Give a number, then say "no, that's wrong" and correct it | Corrected number repeated and confirmed, summary uses the corrected number |
| 6 | Urgent | Use one of the urgent words | Marked urgent; urgent text/ring sent within a minute; tells the caller what happens next |
| 7 | 999-type emergency phrase | "Someone is hurt and not breathing" | Tells the caller to hang up and ring 999 straight away. Does not try to help further. Flagged urgent |
| 8 | Silence | Say nothing for 15 seconds | Prompts once, then ends politely; summary notes a silent call |
| 9 | Off-topic or sales | "I'd like to talk to you about SEO" | Kept short, flagged as nuisance |
| 10 | Asks for a person | "Can I speak to someone?" | Explains it is automated, takes a message, no promise of a callback time unless the customer set one |

Also check each time: it says it is automated; no recording; transcript present; summary in under a few minutes.

## 12. Support and incident runbook

Keep this open when something breaks.

**Provider outage.** Check the provider status page. The divert still rings the caller out to a dead number. Tell the customer; ask them to turn divert off or voicemail on. Re-test when restored. Note date in the customer file.

**Failed email summary.** Check the spam folder and the address. Check the provider's log for the call. Resend by hand from the transcript. Fix the cause (wrong address, filtered sender).

**Cost spike (balance dropping fast).** Look at the last 24 hours of calls. If one number is calling repeatedly, block it. If many, pause the number or take the divert off. Do not top up until you know why. Auto top-up stays off. Tell the customer if it affects them.

**Wrong urgent classification.** Missed urgent: read the transcript, add the missed phrase to the urgent words, re-test, tell the customer. False urgent (too many texts): remove or narrow the word. Record every change in the tuning log.

**Caller complaint or a wrong answer.** Fix the FAQ line, tell the customer what was said and the fix.

**Anything involving a real emergency or harm.** Stop. Contact the customer directly. Keep the transcript. Seek professional advice.

Log each incident: date, what happened, fix, time spent.

## 13. Monthly tuning (cap: 30 minutes per customer)

1. (5 min) Read last month's summaries and the call list: counts, minutes, any urgent.
2. (10 min) Read transcripts of calls marked "unclear" or "no answer". Note repeated questions.
3. (10 min) Update the FAQ or urgent words for the top two gaps. Send changes to the customer for approval (anything new needs a yes).
4. (3 min) Re-run acceptance calls 3, 6 and 7.
5. (2 min) Send the customer a three-line note: calls, minutes used out of 300, one change made.

Stop at 30 minutes. If more is needed regularly, that is a price conversation, not free extra work. Record the real time spent to fix the model's 30-minute assumption.

## 14. Cancellation and offboarding

- [ ] Written notice received; confirm last day (one month's notice).
- [ ] Remind the customer to turn off the divert on their phone before the number is closed.
- [ ] Final summary email sent. Offer the call log if they want it.
- [ ] Stop the Stripe subscription at the end date.
- [ ] Release or close the number; confirm in the provider dashboard.
- [ ] Delete the assistant, transcripts and intake file (or keep only what the customer asked you to).
- [ ] Remove the customer's details from the FAQ templates and notes.
- [ ] Record the reason for leaving, if they say.

## Only Maz can do these

- [ ] Create the provider account and pass any ID and business check.
- [ ] Fund the prepaid balance and keep auto top-up off.
- [ ] Create the Stripe subscription link and test a £79 payment.
- [ ] Create the £99 one-off set-up link (or set up a Stripe invoice) and test it.
- [ ] Pay the ICO data protection fee (check whether it applies) and get section 8 checked by a professional.
- [ ] Approve the service wording on the site and in terms (what it does, minutes, month to month).
- [ ] Decide the after-hours versus always-on divert approach.
- [ ] Ring the first customer and hear the real number answer.
- [ ] Approve any proposal price in `PRICING-MODEL.md` before it is used.

## An agent can do these

- [ ] Draft the intake, FAQ and greeting from a customer's website and Google profile (for the customer to approve).
- [ ] Build and check the personalised demo link.
- [ ] Draft assistant prompts and urgent rules from the approved FAQ.
- [ ] Prepare the acceptance script for each customer and tally results.
- [ ] Draft the monthly three-line note and the tuning log.
- [ ] Update `scripts/receptionist-model.mjs` with measured costs and re-run the tests.
- [ ] Keep the playbook and this kit current.
