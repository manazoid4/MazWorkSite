# Copy guide: how Maz Works sounds

Written 25 Oct 2026 for the reimagination. Read this before you write or change any visible words. It sits under `DESIGN.md` ("Voice and truth") and `PLAN.md`; if they disagree, `PLAN.md` wins.

## The one idea

> I find recurring problems in businesses and build practical ways to make them easier.

Every page should make a visitor think: "this is one person who understands my problem and will make it easier". It should never read like an agency, a consultancy, a SaaS product or an insurer.

## Who is talking

- Maz, in the first person: "I". The visitor is "you". Never "we", "our team", "our clients" for Maz Works. It is one person.
- Founder-led and honest about being new: "I am just starting out, and I would rather say so."
- British English: organisation, colour, whilst is fine but not needed, "cheque", "mobile", "ring" not "call" when natural.

## Voice rules

1. **Start with the problem, not the tool.** "A quote nobody chased" beats "automated quote follow-up workflow".
2. **Short sentences.** 25 words or fewer. One idea each. Break long lists into lines.
3. **Concrete nouns.** Missed call, quote, booking, review, spreadsheet, deadline. Not "touchpoints", "workflows", "assets".
4. **Say what happens, in order.** "A missed caller gets a text. You see it in one list."
5. **Say what it costs and what you get.** Prices only from `app/offers.ts`. Never type a number that lives there.
6. **Admit limits.** "No one can promise a Google position." "It is not an emergency service." "Sometimes the answer is: this isn't worth automating yet."
7. **Prove it or leave it out.** No result, testimonial, customer number, qualification, employer or percentage unless Maz has confirmed it is true. When in doubt, add it to "Needs Maz to confirm" in `docs/reimagine/ROUTES.md`.
8. **Plain buttons.** Say what happens next: "Tell me what is not working", "Get my free preview", "See the prices".
9. **No AI in the offer.** AI may help behind the scenes. The site never advertises or sells it. The receptionist is "an automated receptionist".
10. **Never publish** Maz's town, address or personal email. The public contact is `info@mazworks.uk`; the WhatsApp number on `app/site.ts` is the one approved exception.

## Words we use, and words we do not

Use these terms the same way everywhere.

| Term | Means | Never use it for |
| --- | --- | --- |
| **Free preview** | A working version of your first job with your business name on it, built by Maz on his own test setup, plus a fixed price. | A live demo for the public. |
| **Working preview** | Same thing, when you need to stress that it works. | Anything on the site you can click without asking. |
| **Example** or **concept demo** | A made-up business or made-up data that shows the idea. Always labelled. | Client work. |
| **Real client work** | Built for a business that is not Maz Works and is live. | A prototype, a concept, or an internal project. |
| **Internal project** | A product or experiment Maz made and runs himself. | Client work. |
| **Interactive concept demo** | A working example with made-up data. Not a live service. | Client work. |
| **Fixed price** | The price in the written scope sheet. | An estimate. |
| **Quoted to scope** | The price is agreed after Maz has seen the job. | Anything with a public price. |

### Banned or avoid

These make the site sound like every other agency. Rewrite them.

- Hype: unlock, seamless, empower, revolutionise, cutting-edge, leverage, game-changing, supercharge, world-class, best-in-class, transform (as a verb about the visitor's business).
- Corporate and insurance-style: solutions-driven, tailored solutions, comprehensive, end-to-end, holistic, robust, streamline, stakeholders, oversight, operational excellence, proactive, peace of mind, dedicated team, bespoke, "we are committed to".
- Agency filler: "customer journey" (say what the customer does), "touchpoints", "digital presence" (say website or Google listing), "scalable", "optimise".
- Cheap-web-shop language: "quick fix", "website repair", "quick win".
- Unprovable: "trusted by", "award-winning", "thousands of", "never miss a call", "guaranteed results", "double your enquiries".

A word on the list can appear if it is a quoted fact or a legal term. Otherwise rewrite it.

## Before and after

These are real rewrites from the reimagination.

| Before | After | Why |
| --- | --- | --- |
| Better oversight. Clearer decisions. Smoother operations. | See what is due, what is late and what keeps going wrong. | Says what the visitor sees, not a corporate slogan. |
| Prices for getting customers, serving them and improving. | Plain prices, fixed before I start. | The page is about price, not a three-bucket framework. |
| Get customers. Serve customers. Keep improving. | I find the problem that keeps coming back, then build a way to make it easier. | The central idea, in one sentence. |
| I spent five years handling complaints and escalations in regulated finance, including ombudsman cases, so I write scopes that cannot be misread. | I spent five years handling financial complaints and escalations, so I know how a vague promise turns into a dispute. I write scopes that are hard to misread. | Keeps what is true, drops what cannot be proved, shows the reason rather than boasting. |
| At an internet service provider I was the main contact for escalations from business park owners and company directors on accounts worth hundreds of thousands of pounds. | (removed) | Unverifiable figures and an unnamed employer. |
| Website, automation and video. One team for everything your customers see. | Websites, follow-up and filming. One person for everything your customers see. | There is no team. |
| Most of my work comes from someone saying a good word. | (removed) | Maz is new; do not imply a track record that is not there. |
| Tell me the job. I'll send a demo and a fixed price. | Tell me the job. I'll send a working preview and a fixed price. | "Demo" is for made-up examples; the thing Maz builds for you is a preview. |
| Hear your demo | Hear it answer as you | Same reason. |
| Founder-led work | One person, start to finish | Plainer. |
| Practical, proportionate improvements | Keep it simple | No consultancy voice. |
| Bring me the report, deadline or process that is causing friction. | Bring me the report, deadline or process that keeps causing trouble. | Everyday words. |
| Maz sets it up himself. | I set it up myself. | Maz is the narrator. |
| (a visible "To update: add a showreel here" box) | (removed) | Notes to self never go on a public page. |

## Labels for work

Anything shown as "my work" carries exactly one of:

- **Real client work**: for a client, live for their customers. Today: Scrap Finance Partners. Do not hint at payment either way (see the truth rule in `app/projects.ts`).
- **Internal project**: made and run by Maz. Today: JobFilter, Agent Nudge, OpenFlowKit, Khutba.io, MAZ Core, MAZ Pocket.
- **Interactive concept demo**: made-up data, not a live service. Today: RotaReason, the complaints samples, the dashboards, the restaurant table picker, Maz Works Objects.

If something is new and fits none of these, it does not go on the My work or Tools pages until Maz says which it is.

## Page checklist

Before you ship a page:

1. One H1 that says what the page is for, in plain words.
2. Title 60 characters or fewer **including** the " — Maz Works" suffix from the layout template (use `title: { absolute: ... }` to control it). Description 155 or fewer. `alternates.canonical` set.
3. One primary button. Plain label.
4. No banned words. Read it aloud; if you would not say it to an owner across a counter, change it.
5. Every claim is either a fact in code (`offers.ts`, `projects.ts`), a fact Maz confirmed, or labelled as an example.
6. A test that asserts the headline and the label, so a later edit cannot quietly undo it.
