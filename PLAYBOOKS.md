# Maz Works playbooks

Guides and copy-paste prompts so any agent (Codex, Gemini, Hermes, OpenCode, another Claude) can keep the same quality. Read `AGENTS.md` first, then the playbook for your job. Full folder: `docs/playbooks/`.

## Start any agent with this
Paste this as the first message, then add the task:

```
You are working for Maz Works (repo manazoid4/mazos-site). Read AGENTS.md and PLAYBOOKS.md, then the playbook for this task. Follow its steps and quality bar exactly. Work on a branch and open a PR; merge it to main once the checks are green. Never publish lead names, Maz's location, personal email or phone. No AI in the offer. Finish with: what you did, proof (command output, test result, screenshot or URL), and what Maz must do next, in plain words.

Task: <what you want>
```

## Guides (how we work)
| # | Playbook | Use it when |
|---|----------|-------------|
| 1 | [Ship a site change](docs/playbooks/1-ship-a-site-change.md) | any code or copy change |
| 2 | [Offer, prices and voice](docs/playbooks/2-offer-prices-and-voice.md) | touching prices, packages, words |
| 3 | [Design and pages](docs/playbooks/3-design-and-pages.md) | new page, component, colour, icon |
| 4 | [Forms and conversion](docs/playbooks/4-forms-and-conversion.md) | forms, funnels, tracking |
| 5 | [Leads and outreach](docs/playbooks/5-leads-and-outreach.md) | lead rules, HubSpot, email |
| 10 | [Research and CRO](docs/playbooks/10-research-and-cro.md) | any research, audit or "why aren't people enquiring?" question (method: `docs/maz-works/RESEARCH-HANDBOOK.md`) |

## Daily engines (copy-paste prompts)
| # | Playbook | Output | Best agent |
|---|----------|--------|------------|
| 6 | [Instagram creator leads](docs/playbooks/6-instagram-creator-leads.md) | 10 creator leads + DMs a day | any with web browsing |
| 7 | [LinkedIn engine](docs/playbooks/7-linkedin-engine.md) | owner leads, connection notes, 3 posts a week | any with web browsing |
| 8 | [Coding tasks for agents](docs/playbooks/8-coding-tasks-for-agents.md) | a ready brief for Codex or OpenCode | any |
| 9 | [Weekly review](docs/playbooks/9-weekly-review.md) | what worked, what to cut, next week's plan | any |

## Suggested week (about 1 hour a day for Maz)
- Mon: playbook 9 (review) → pick the week's 3 goals.
- Daily: playbook 6 or 7 finds leads and drafts messages → Maz reviews and sends by hand (10–20 min).
- Tue/Thu: one coding task via playbook 8 → Maz merges the PR after checking the preview.
- Mon/Wed/Fri: one LinkedIn post from playbook 7.

## Golden rules
- Branch + PR, then merge to main once the checks are green.
- Never invent clients, results or testimonials.
- Lead data stays in the private `maz-works-leads` repo and HubSpot, never in this public repo.
- Never publish Maz's location, personal email or phone. Public contact: info@mazworks.uk.
- No AI in the offer.
- Maz sends every message himself. Agents draft; they never send, post, follow or DM.
- Proof before "done". End with a plain-words summary and Maz's open to-dos.
