# Maz Works strategy: positioning decision (1 Nov 2026)

Status: implemented on the homepage and /research (PR "Reposition homepage and research"). Evidence-labelled; nothing here is a customer or revenue claim.

## Audit: what was wrong
- **Homepage said "small web shop".** "Less hassle. Better business." plus three generic service rows. The founder's rarest asset (five years in UK financial complaints, plus building AI test tooling) sat below the fold and was never connected to an offer.
- **Research was an island.** It was reached via "Tools and demos", written like a paper ("Abstract", agent coordination), with no line from research to anything a business would buy.
- **Four equal research projects** (Scorensic, Agent Nudge, mazcraft, nod) with no flagship, so none stood out.
- **What is real today:** websites, booking/follow-up set-ups, the receptionist demo, complaints reporting packages (quoted to scope), JobFilter (live product), and Scorensic (working open-source tool with first real-model results). There are no paying complaints-team clients yet.

## Three directions considered
| Direction | Strength | Weakness |
|---|---|---|
| A. Small-business web and automation studio (status quo) | Revenue now, simple to explain | Crowded and price-driven; nothing defensible; no route to a product |
| B. AI evaluation / dev-tools company | Credible to engineers, open-source IP | No revenue path for a solo founder; well-funded competitors (Inspect, evalmut, Braintrust and others) |
| **C. Customer operations, checked (chosen)** | Joins the founder's complaints background, the services that already sell, and Scorensic into one story: find what goes wrong with customers, fix it, prove it works, test AI before it touches customers | Two audiences on one site; complaints teams have long sales cycles |

**Why C:** It keeps the small-business revenue door open (A) and gives the research a buyer (B). The moat is the combination: regulated-complaints knowledge, plus test packs that show whether AI can do the job, plus someone who can build the fix. Generic AI consultancies sell demos. This sells evidence.

## The answer to "what would we build from scratch?"
A UK company that **certifies AI for customer work before it is used**. It would sell readiness audits now, using its own test packs. Later it sells the packs and report card as software that operations and compliance teams run themselves. Websites and small-business systems fund it and keep the founder close to real customer problems.

## Most promising overlooked opportunity
**"Can AI do this job?" audits for regulated complaints teams** (financial services first; the FCA's DISP rules and the £680 ombudsman case fee make the cost of mistakes concrete). The deliverable is a fixed-scope test of the firm's own examples on the models they are considering, plus a safe set-up plan. Nobody local and affordable sells this with published, reproducible marking.

## Strongest flagship product
**Scorensic workload packs + report card.** Today: an open-source CLI, a UK complaints pack (54 tasks, 8 letters) and self-checking marking. Path: more packs (invoices/VAT, booking requests, trade quotes), then a hosted report card with packs licensed to firms and vendors.

## Deliberately preserved
All URLs, prices (`app/offers.ts`), the small-business journey, the enquiry form, JobFilter proof, the founder section, tools and demos (moved from the header to the menu and footer, URL unchanged), the complaints demonstrations, sitemap/SEO, the no-location rule, and "never sell AI as a product".

## Rule change to confirm (Maz)
The 27 Sep rule "no AI on the site" is narrowed. The homepage may now say AI is *tested* before use. "AI assistant/agent/powered" sales copy stays banned everywhere, and prices, contact and trade pages stay AI-free. Tests enforce this. To revert, restore the `\bAI\b` checks in `tests/site-polish.test.mjs` and `tests/static-export.test.mjs`.

## Next experiments (cheapest first)
1. Ask 3 UK complaints/ops leads one question: "Would a report card like this change whether you buy an AI tool?" (no build needed).
2. Run the complaints pack on 8B local models and one cloud model, and publish the comparison.
3. Offer one fixed-price "Can AI do this job?" audit to a friendly firm; capture the result as the first case study only with written permission.
4. Second pack: invoices/VAT (most common small-business admin job).
