# Content map (B2)

| Old route | What moved | New home |
|---|---|---|
| /free-plan | free-preview form (now a next-step choice in the one form), what you get back, if-you-say-yes steps, sample report, one-minute audit, niche links, `?package/trade/src/audit` context | /contact (#free-preview, form id `leak-check-form`) |
| /start | post-payment setup intake (Stripe success URL) | /contact?intent=setup (form switches to setup mode) |
| /scope-sheet | what a scope sheet lists, always-included, payment terms. The printable generator is dropped | /contact#scope |
| /refer | steps, reward tiers, rules | /contact#refer |
| /video | prices, selector, steps, what you get, services, terms, FAQ, promo video, portfolio projects, WhatsApp | /local-businesses#video |
| /managed-presence | price, included, steps, not included, audience hooks | /local-businesses#managed-presence |
| /missed-calls-calculator | calculator, referral link | /local-businesses#missed-calls-calculator |
| /content-day | stub only | /local-businesses#video |
| /demos | bigger-build preview path, FAQ | /after-hours-receptionist#bigger-builds |
| /receptionist-demo, /receptionist-demo/make | kept at the same URLs (microphone Permissions-Policy in vercel.json targets that path); linked from /after-hours-receptionist | unchanged |
