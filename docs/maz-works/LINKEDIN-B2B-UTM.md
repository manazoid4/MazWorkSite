# LinkedIn → /b2b → assessment or call: links and tracking (19 Oct 2026)

The B2B journey for agencies, consultancies and professional practices:

```
LinkedIn post or DM → /b2b → recognise the problem → see a real deliverable → free assessment or 15-minute call → enquiry or booking
```

Two actions only: **Get a Free Business Assessment** (`/b2b/assessment`, instant result, no contact details) and **Book a 15-Minute Call** (Cal.com). Everything else on `/b2b` exists to earn one of those two taps.

## Link template (paste exactly)

```
https://www.mazworks.uk/b2b?src=linkedin-post&utm_source=linkedin&utm_medium=social&utm_campaign=b2b-post-01&utm_content=first-comment
```

Swap two parts per post and keep the rest fixed:

| Part | What to change | Example |
|---|---|---|
| `utm_campaign` | one value per post, never reused | `b2b-post-01`, `b2b-complaints-02` |
| `utm_content` | where the link sits | `first-comment`, `post-body`, `dm`, `profile` |
| `src` | keep `linkedin-post` (or `linkedin`, `linkedin-featured`, `linkedin-company`, `dm-<name>`) | `linkedin-post` |

Why both `src` and `utm_*`:

- `src` is the site's own first-touch campaign tag. It is remembered for the tab, survives every internal link (including the assessment link and the booking dialog), and appears as the enquiry `source` when it is a real tag.
- `utm_*` is the standard analytics label. It is captured once, stored for the tab, and forwarded to the owner email, the HubSpot message, the Telegram alert and the Cal.com booking (notes and `utm_*` fields).
- Only safe values are kept: lowercase letters, digits and `._-`, up to 40 characters. Anything else (spaces, `<`, `@`, newlines, over-long text) is dropped before it reaches any email, database or booking.

Full credit for the rules is in `app/linkedin-source.ts` (capture and sanitising) and `app/booking-link.ts` (Cal.com forwarding).

## Where each link sends people

| Place | Link |
|---|---|
| Post first comment (default) | `https://www.mazworks.uk/b2b?src=linkedin-post&utm_source=linkedin&utm_medium=social&utm_campaign=<post>&utm_content=first-comment` |
| Profile Featured item | `https://www.mazworks.uk/b2b?src=linkedin-featured&utm_source=linkedin&utm_medium=social&utm_campaign=b2b-featured&utm_content=featured` |
| Company page button | `https://www.mazworks.uk/b2b?src=linkedin-company&utm_source=linkedin&utm_medium=social&utm_campaign=b2b-company&utm_content=button` |
| Warm DM reply | `https://www.mazworks.uk/b2b?src=dm-<name>&utm_source=linkedin&utm_medium=social&utm_campaign=b2b-dm&utm_content=dm` |

Direct link to the assessment (only when the post is already about the assessment):

```
https://www.mazworks.uk/b2b/assessment?src=b2b-assessment&utm_source=linkedin&utm_medium=social&utm_campaign=<post>&utm_content=first-comment
```

## What you can see afterwards

Custom events (Vercel Web Analytics; on the free plan they are recorded but only visible on a paid plan):

| Event | Fires when | Useful detail |
|---|---|---|
| `Campaign visit` | a tagged link lands, once per tab | full attribution line |
| `Assessment started` | first answer is tapped | page |
| `Assessment completed` | the result is shown | score, biggest area, attribution |
| `Assessment submitted` | the result is sent with contact details | score, biggest area, source |
| `Booking opened` | the Cal.com dialog is opened or the link is clicked | attribution |
| `CTA clicked` | an assessment or free-preview link is clicked | placement, attribution |

Lead records:

- **Owner email** (Resend) includes `source` and the full `attribution` line.
- **HubSpot** contact message includes the same `Campaign:` line.
- **Telegram** alert (if configured) names the person and the need, never the email address.
- **Cal.com** booking notes read `From /b2b. Interested in: …. Campaign: source=linkedin; medium=social; campaign=…`, and the booking URL carries `utm_source`, `utm_medium`, `utm_campaign` and `utm_content`.

Reading a week: a post is working if `Campaign visit` moves and some of those visits produce `Assessment submitted` or `Booking opened`. A post with visits and no submissions means the offer copy, not the traffic, is the thing to change.

## Still to switch on (Maz's decisions or credentials)

1. **Cal.com embedding** has not been verified live. Confirm `cal.com/mazworks/quick-chat` is live and permits framing inside the dialog. If it refuses, the dialog's "Open in a new tab" link still works and still carries the notes and UTMs.
2. **HubSpot, Resend, Twilio and Telegram** production settings are unverified. The journey works without them: the enquiry still reaches the owner email when Resend is set, and the assessment result is always shown on screen.
3. **LinkedIn Insight Tag** stays off until a partner ID exists, `snap.licdn.com` / `px.ads.linkedin.com` are allowed in `vercel.json`, and a consent banner sets `localStorage["mw-ads-consent"]="yes"`. UK PECR needs that consent for the tag, so do not switch it on before the banner.
4. **Prices** on `/b2b`, `/b2b/assessment` and `/complaints` come from `app/offers.ts` and are still proposed (see `HANDOFF.md`). They need approval before merge.

Keep this file next to `LINKEDIN-FUNNEL.md` and `OUTREACH-TEMPLATES.md`: that one is the small-business path, this one is the B2B path.
