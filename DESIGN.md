# Maz Works design

Calm, soft and human. A cream page, peach and pale-blue cards, plum for links, one orange action. Evidence and plain words come before decoration.

## Tokens (`app/globals.css` :root)

Never add a new hex value in CSS. Use a token.

| Token | Use |
| --- | --- |
| `--cream` / `--surface` | Page and card background |
| `--peach`, `--sky-tint`, `--sun` | Soft card fills, bands, icon fills |
| `--ink`, `--muted`, `--line` | Text, quiet text, 1px dividers |
| `--plum` | Secondary buttons, links, icon strokes |
| `--signal` (= `--pop-orange`) | The one primary button, with `--ink` text, never white |
| `--pop-cobalt`, `--pop-yellow`, `--pop-pink`, `--pop-lilac`, `--pop-ink` | Pop moments only |

Legacy names (`--sage`, `--sand`, `--wheat`, `--clay`, `--mist`, `--slate`, `--charcoal`) are remapped to the palette. Do not use them in new code.

## Pop rules

- Maximum 2 pop moments per page, chosen from: a cobalt hero band (text `#fff` or `--cream`, never ink), a yellow highlight on one key word, pop price bars (`/prices` only), one pink or lilac badge.
- Home uses exactly two: the yellow highlight on one word in the hero h1, and the orange primary button. Nothing else is bold or loud.

## Components

- Cards and bands: soft radius 8 to 16px, no heavy border, no hard offset shadow. Use a 1px `--line` divider where structure is needed.
- Icons: line illustrations with `--plum` strokes and peach, sun or sky fills.
- Buttons: orange primary (`.button-signal`) for the main enquiry. Secondary actions are plum links with an arrow. Forms submit in plum.
- Headings: Manrope, `--ink`. Each section has one heading, one intro line and one primary action.
- Buckets (`app/three-buckets.tsx`): one data array drives the home overview and the detailed `/what-we-do` version. Soft peach-cream band, three open columns, one on mobile.
- Short bio (`app/manazir-line.tsx`): the only bio component. The line version sits under trade-page buttons. The `block` version is the home About section and links to `/about`.
- Footer (`app/site-chrome.tsx`): one row of links (What I do, Prices, Proof, About, Contact, FAQ, Privacy, Terms), the email and one legal line. The home page adds the pale-blue contact band above it.

## Readability

Body text 17px on desktop and 16px on mobile at least, prose max-width about 65ch, line-height 1.55 or more, at most 3 cards per row. Check at 375px and 1440px.

## Voice and truth

"I" for Maz, "you" for the visitor. Plain words, sentences of 25 words or fewer, no hype. Never invent testimonials, logos or numbers. Prices come only from `app/offers.ts`. No AI in the offer. Never publish Maz's location or personal email.

## Audience

Owner-managers and operations or sales leads of small businesses and professional teams. They need to see the problem fixed, that it is one person, real delivered work, a starting price and one clear way to enquire. This is a client site, not a job-seeking portfolio.

## Sub-brand

`/3d-printing` (Objects) keeps its own tactile signal-studio look, scoped to that route. Its generated imagery stays labelled "Illustrative sketch" until real photos replace it.
