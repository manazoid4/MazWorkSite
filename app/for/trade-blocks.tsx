import type { ReactNode } from 'react';
import { Breadcrumbs } from '../breadcrumbs';
import { CampaignLink } from '../campaign-link';
import { IndustryProof } from './industry-proof';
import { INDUSTRY_PROOFS } from './industry-proof-data';
import { INDUSTRY_VOICE } from './industry-voice';
import { ManazirLine } from '../manazir-line';
import { KitIcon } from '../kit-icon';
import { AFTER_HOURS, AUTOMATION_MENU } from '../offers';
import { MAIN_CTA } from '../site';
import { buildTradeEnquiryHref } from '../trade-context';
import { encodeConfig } from '../receptionist-demo/engine.mjs';
import { presetConfig } from '../receptionist-demo/presets.mjs';
import { JOB_ICONS, TRADE_EXTRAS } from './trade-extras';
import './trade-pages.css';
import './industry-proof.css';

/** Icon for a package or add-on card (kit-icon names). */
export function iconFor(name: string): string {
  if (/^Starter/.test(name)) return 'bolt';
  if (/^Business System/.test(name)) return 'layers';
  if (/^Custom/.test(name)) return 'box';
  if (/^(Website|Launch)/.test(name)) return 'globe';
  const task = /^Add a second task: (.*)$/.exec(name)?.[1];
  const job = task ? AUTOMATION_MENU.find((item) => item.name === task) : undefined;
  return (job && JOB_ICONS[job.id]) || 'spark';
}

/** Split hero, like the homepage: words and the main button on the left, the industry's own playable example on the right. */
export function TradeHero({ crumbs, icon, eyebrow, title, lede, extra, cta, id, demoFor, note }: {
  crumbs: { href?: string; label: string }[]; icon: string; eyebrow: string; title: string; lede: string; extra?: string; cta: ReactNode; id: string; demoFor: string; note: string;
}) {
  const proof = INDUSTRY_PROOFS[demoFor];
  return (
    <section className="s-hero s-hero-split tp-hero" id="main-content" tabIndex={-1} aria-labelledby={id}>
      <div className="tp-crumbs"><Breadcrumbs items={crumbs} /></div>
      <div>
        <p className="eyebrow"><span className="tp-eyebrow-icon" aria-hidden="true"><KitIcon name={icon} size={16} /></span>{eyebrow}</p>
        <h1 id={id}>{title}.</h1>
        <p className="s-lede">{lede}</p>
        {extra ? <p className="tp-examples">{extra}</p> : null}
        <div className="s-actions">{cta}<a className="text-link" href="#day">See what changes <span aria-hidden="true">→</span></a></div>
        <p className="s-note">{note}</p>
        <ManazirLine />
      </div>
      {proof ? <IndustryProof proof={proof} /> : null}
    </section>
  );
}

export type CardItem = { key: string; icon: string; name: string; price: string; body: string; href: string };

/** Price cards in the homepage's card look: icon, name, one line, price badge, one link. Equal height. */
export function PriceCards({ items }: { items: CardItem[] }) {
  return (
    <ul className="tp-cards">
      {items.map((item) => (
        <li key={item.key}>
          <article className="tp-card">
            <div className="tp-card-top"><span className="tp-card-icon" aria-hidden="true"><KitIcon name={item.icon} /></span><b className="tp-price">{item.price}</b></div>
            <h3>{item.name}</h3>
            <p>{item.body}</p>
            <CampaignLink className="tp-card-go" href={item.href}>{MAIN_CTA} <span aria-hidden="true">→</span></CampaignLink>
          </article>
        </li>
      ))}
    </ul>
  );
}

/** The dark "New" card for the After-Hours Receptionist, with a "talk to it as a ___" demo link where a preset fits. */
export function ReceptionistCard({ page, level = 2 }: { page: string; level?: 2 | 3 }) {
  const Heading = level === 2 ? 'h2' : 'h3';
  const match = TRADE_EXTRAS[page]?.receptionist;
  const config = match ? presetConfig(match.business, match.preset) : null;
  const demoHref = match && config ? `/receptionist-demo#c=${encodeConfig(config)}` : null;
  return (
    <aside className="tp-after" aria-labelledby={`after-${page}`}>
      <div>
        <span className="s-teaser-tag">New · After-hours call answering</span>
        <Heading id={`after-${page}`}><a href={AFTER_HOURS.href}>{AFTER_HOURS.name} {AFTER_HOURS.price}</a></Heading>
        <p>Busy on a job, closed for the evening, or it’s a bank holiday? Calls you can’t pick up are answered, and you get a clear message to act on.</p>
      </div>
      <div className="tp-after-links">
        <CampaignLink className="button button-signal tp-after-go" href={buildTradeEnquiryHref(page, { package: AFTER_HOURS.name })}>{MAIN_CTA}</CampaignLink>
        {match && demoHref ? <a className="tp-after-demo" href={demoHref}>Talk to it as {match.as} <span aria-hidden="true">→</span></a> : null}
        <a className="tp-after-demo" href={AFTER_HOURS.href}>How it works <span aria-hidden="true">→</span></a>
      </div>
    </aside>
  );
}

/** What customers in this trade actually say, and the worry an owner would raise. Examples of language, not quotes from clients. */
export function VoiceBlock({ id, level = 3 }: { id: string; level?: 2 | 3 }) {
  const voice = INDUSTRY_VOICE[id];
  if (!voice) return null;
  const Heading = level === 2 ? 'h2' : 'h3';
  return (
    <div className="iv-voice">
      <Heading className="iv-title">{voice.week}</Heading>
      <p className="iv-label">What your customers say</p>
      <ul className="iv-words">{voice.words.map((line) => <li key={line}>{line}</li>)}</ul>
      <div className="iv-ask"><p className="iv-label">The worry</p><p className="iv-q">{voice.objection.q}</p><p>{voice.objection.a}</p></div>
    </div>
  );
}
