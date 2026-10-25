import { ServiceSchema } from '../../service-schema';
import { ScrollReveal } from '../../scroll-reveal';
import { fitDescription } from '../../seo';
import { OG_IMAGE } from '../../seo';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SiteFooter, SiteHeader } from '../../site-chrome';
import { MAIN_CTA } from '../../site';
import { NICHE_GUIDES, getNicheGuide } from '../niches';
import { NICHE_ICONS } from '../../kit-icon';
import { BeforeAfter } from '../../before-after';
import { WorkSteps } from '../../work-steps';
import { StickyCheckCta } from '../../sticky-cta';
import { PriceCards, ReceptionistCard, TradeHero, VoiceBlock, iconFor, type CardItem } from '../trade-blocks';
import { INDUSTRY_PROOFS } from '../industry-proof-data';
import { buildTradeEnquiryHref } from '../../trade-context';
import { CampaignLink } from '../../campaign-link';
import { TRADE_EXTRAS } from '../trade-extras';
import { CUSTOMER_TYPES, getCustomerType } from '../../customer-types';
import { TypePage } from '../type-page';
import { OFFERS } from '../../offers';
import { StraightAnswers } from '../../straight-answers';
import { CalculatorReveal } from '../../calculator-reveal';
import { JobLinks } from '../../services/job-links';
import { RememberTrade } from '../../remember-trade';
import { tradeForGuide } from '../../trades';

export const dynamicParams = false;

/** Four customer-type pages (trades, appointments, creators, offices) plus the trade guides. */
export function generateStaticParams() {
  return [...CUSTOMER_TYPES.map((type) => ({ niche: type.id })), ...NICHE_GUIDES.map((guide) => ({ niche: guide.id }))];
}

export async function generateMetadata({ params }: { params: Promise<{ niche: string }> }): Promise<Metadata> {
  const { niche } = await params;
  const type = getCustomerType(niche);
  if (type) {
    return {
      title: `${type.shortName}: what to set up and the price`,
      description: fitDescription(`${type.lede} Named recipes from ${OFFERS[0].price}, what’s included, and a free preview.`),
      alternates: { canonical: `/for/${type.id}` },
      openGraph: { title: `${type.title} — Maz Works`, description: fitDescription(type.lede), url: `/for/${type.id}`, images: [OG_IMAGE] },
    };
  }
  const guide = getNicheGuide(niche);
  if (!guide) return {};
  return {
    title: `${guide.shortName}: business systems`,
    description: fitDescription(`${guide.lede} What I’d set up and the fixed price.`),
    alternates: { canonical: `/for/${guide.id}` },
    openGraph: { title: `${guide.title} — Maz Works`, description: fitDescription(guide.lede), url: `/for/${guide.id}`, images: [OG_IMAGE] },
  };
}

/** Shared clips that do not fit these pages (salon clip on dog groomers; clinic clip shows a health form): no video until a matching one exists. */
const VIDEO_TO_UPDATE: Record<string, string> = { 'dog-groomers': 'dog groomers', 'clinics-and-therapists': 'clinics and therapists (no health forms)' };

export default async function NichePage({ params }: { params: Promise<{ niche: string }> }) {
  const { niche } = await params;
  const type = getCustomerType(niche);
  if (type) return <TypePage type={type} />;
  const guide = getNicheGuide(niche);
  if (!guide) notFound();
  const problem = INDUSTRY_PROOFS[guide.id]?.problem;
  const checkHref = buildTradeEnquiryHref(guide.id, { problem });
  const parent = CUSTOMER_TYPES.find((item) => item.niches.includes(guide.id));
  const extras = TRADE_EXTRAS[guide.id];
  const trade = tradeForGuide(guide.id);
  const cards: CardItem[] = guide.fixes.map((fix) => ({ key: fix.name, icon: iconFor(fix.name), name: fix.name, price: fix.price, body: fix.body, href: buildTradeEnquiryHref(guide.id, { problem, package: fix.pick }) }));

  return (
    <main className="s-home">
      <SiteHeader /><ServiceSchema path={`/for/${guide.id}`} />
      {trade ? <RememberTrade trade={trade} /> : null}

      <TradeHero
        id="niche-title"
        demoFor={guide.id}
        crumbs={[{ href: '/for', label: 'Who it’s for' }, ...(parent ? [{ href: `/for/${parent.id}`, label: parent.shortName }] : []), { label: guide.shortName }]}
        icon={NICHE_ICONS[guide.id] ?? 'spark'}
        eyebrow={guide.name}
        title={guide.title}
        lede={guide.lede}
        cta={<CampaignLink className="button button-signal s-button-lg" href={checkHref}>{MAIN_CTA}</CampaignLink>}
        note={`Free preview, no call needed. Most start with one task at ${OFFERS[0].price}.`}
      />

      <section className="s-section" aria-label="After-hours call answering"><ReceptionistCard page={guide.id} /></section>

      <section className="s-section" id="week" aria-label="In your week"><VoiceBlock id={guide.id} level={2} /></section>

      <section className="s-section" id="day" aria-labelledby="niche-day-title">
        <p className="eyebrow">See it working</p>
        <h2 id="niche-day-title">What changes in your day.</h2>
        {guide.id in VIDEO_TO_UPDATE ? null : trade ? (
          <figure className="tp-trade-video">
            <video src={`/video/for/${trade}.mp4`} poster={`/video/for/${trade}.webp`} controls muted playsInline preload="metadata"
              aria-label="22 second example: messages answered, followed up and confirmed while the owner works. Example, not a real customer." />
            <figcaption className="s-small">22 seconds, no sound needed. Example. Not a real customer.</figcaption>
          </figure>
        ) : null}
        <div className="tp-ba"><BeforeAfter rows={extras.changes} /></div>
        <p className="s-small">Examples of what changes, not client results.</p>
      </section>

      <section className="s-section" id="price" aria-labelledby="niche-fix-title">
        <p className="eyebrow">What I’d set up, and the price</p>
        <h2 id="niche-fix-title">Fixed prices, agreed first.</h2>
        <PriceCards items={cards} />
        <p className="s-small"><a className="s-details-link" href="/prices">See the details: every price and what’s included →</a>{parent ? <> <a className="s-details-link" href={`/for/${parent.id}`}>Every fix for {parent.shortName.toLowerCase()} →</a></> : null}</p>
      </section>

      {parent ? (
        <section className="s-section" id="cost" aria-label="What missed enquiries cost you">
          <CalculatorReveal preset={parent.calculator} trade={guide.id} />
        </section>
      ) : null}

      {parent ? <JobLinks typeId={parent.id} who={guide.shortName} /> : null}

      {guide.visuals ? (
        <section className="s-section" aria-labelledby="niche-visuals-title">
          <p className="eyebrow">What it can look like</p>
          <h2 id="niche-visuals-title">Drawings and models, linked to the project.</h2>
          <div className="mw-figures">
            {guide.visuals.map((visual) => (
              <figure key={visual.src}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={visual.src} alt={visual.alt} width={800} height={560} loading="lazy" />
                <figcaption>{visual.caption}</figcaption>
              </figure>
            ))}
          </div>
          <p className="s-small">Illustrations made for this page, not client work.</p>
        </section>
      ) : null}

      {guide.related ? (
        <p className="mw-related tp-related"><a href={guide.related.href}><strong>{guide.related.label} →</strong> <span>{guide.related.body}</span></a></p>
      ) : null}

      <section className="s-section" aria-label="How working together goes"><p className="eyebrow">Working together</p><WorkSteps level={2} /></section>

      <StraightAnswers />

      <p className="mw-related mw-related-quiet tp-related"><a href="/for"><strong>Other trades →</strong> <span>{(() => { const others = NICHE_GUIDES.filter((item) => item.id !== guide.id).map((item, index) => (index ? item.shortName.split(' ').map((word) => (/^[A-Z]{2,}$/.test(word) ? word : word.toLowerCase())).join(' ') : item.shortName)); return `${others.slice(0, -1).join(', ')} and ${others.at(-1)}.`; })()}</span></a></p>

      <section className="mw-resource-cta" aria-labelledby="niche-cta-title">
        <div>
          <p className="eyebrow">Free first step</p>
          <h2 id="niche-cta-title">Not sure where to start?</h2>
          <p>Tell me the job. I&apos;ll send a working preview and a fixed price.</p>
        </div>
        <div className="mw-actions">
          <CampaignLink className="button button-signal" href={checkHref}>{MAIN_CTA}</CampaignLink>
        </div>
      </section>

      <SiteFooter /><StickyCheckCta href={checkHref} /><ScrollReveal />
    </main>
  );
}
