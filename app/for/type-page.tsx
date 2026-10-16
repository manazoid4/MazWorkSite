import { SiteFooter, SiteHeader } from '../site-chrome';
import { ServiceSchema } from '../service-schema';
import { StickyCheckCta } from '../sticky-cta';
import { DemoBusiness } from '../demo-business';
import { CampaignLink } from '../campaign-link';
import { CASE_STUDIES } from '../case-studies';
import { MAIN_CTA } from '../site';
import { OFFERS, STARTER_GUARANTEE, getMenuJob } from '../offers';
import { StraightAnswers } from '../straight-answers';
import { JobLinks } from '../services/job-links';
import { BeforeAfter } from '../before-after';
import { WorkSteps } from '../work-steps';
import { PriceCards, ReceptionistCard, TradeHero, VoiceBlock, iconFor, type CardItem } from './trade-blocks';
import { INDUSTRY_PROOFS } from './industry-proof-data';
import { buildTradeEnquiryHref } from '../trade-context';
import { JOB_ICONS } from './trade-extras';
import { CalculatorReveal } from '../calculator-reveal';
import { NICHE_GUIDES } from './niches';
import type { CustomerType } from '../customer-types';

/**
 * One page per kind of customer (plan v3, B4): pain table → recipe → price →
 * what's included → one button. Ten seconds to "this is me, this is the fix,
 * this is the price".
 */
export function TypePage({ type }: { type: CustomerType }) {
  const problem = INDUSTRY_PROOFS[type.id]?.problem;
  const checkHref = buildTradeEnquiryHref(type.id, { problem });
  const niches = NICHE_GUIDES.filter((guide) => type.niches.includes(guide.id));
  const studies = CASE_STUDIES.filter((study) => study.type === type.id);

  const pains = type.pains.filter((row) => row.starter).slice(0, 3);
  const rows = pains.map((row) => ({ key: row.starter!, icon: JOB_ICONS[row.starter!] ?? 'spark', before: row.pain, name: getMenuJob(row.starter!).name, after: getMenuJob(row.starter!).what }));
  const cards: CardItem[] = type.recipes.map((recipe) => ({
    key: recipe.name,
    icon: recipe.jobs.length === 1 ? (JOB_ICONS[recipe.jobs[0]] ?? iconFor(recipe.offer.name)) : iconFor(recipe.offer.name),
    name: recipe.name,
    price: recipe.offer.price,
    body: recipe.what,
    href: buildTradeEnquiryHref(type.id, { problem, package: recipe.offer.name }),
  }));

  return (
    <main className="s-home">
      <SiteHeader /><ServiceSchema path={`/for/${type.id}`} />

      <TradeHero
        id="type-title"
        demoFor={type.id}
        crumbs={[{ href: '/for', label: 'Who it’s for' }, { label: type.shortName }]}
        icon={type.icon}
        eyebrow={type.name}
        title={type.title}
        lede={type.lede}
        extra={type.examples}
        cta={<CampaignLink className="button button-signal s-button-lg" href={checkHref}>{MAIN_CTA}</CampaignLink>}
        note={`Free demo, no call needed. Most start with one task at ${OFFERS[0].price}.`}
      />

      <section className="s-section" id="pains" aria-labelledby="type-pains-title">
        <p className="eyebrow">Sound familiar?</p>
        <h2 id="type-pains-title">Your problem, and the task that fixes it.</h2>
        <div id="day" className="tp-ba"><BeforeAfter rows={rows} /></div>
        <VoiceBlock id={type.id} />
        <JobLinks typeId={type.id} who={type.shortName} inline />
      </section>

      <section className="s-section" id="recipes" aria-labelledby="type-recipes-title">
        <p className="eyebrow">Three ways in</p>
        <h2 id="type-recipes-title">Each with a fixed price.</h2>
        <PriceCards items={cards} />
        <p className="s-small">{STARTER_GUARANTEE} <a href="/prices#always-included">What’s always included →</a></p>
        <WorkSteps />
        <ReceptionistCard page={type.id} level={3} />
      </section>

      <section className="s-section" id="how" aria-labelledby="type-how-title">
        <p className="eyebrow">See it working</p>
        <h2 id="type-how-title">What changes in your day.</h2>
        <DemoBusiness type={type.id} />
        <div id="cost"><CalculatorReveal preset={type.calculator} trade={type.id} /></div>
        {studies.map((study) => (
          <blockquote className="s-study" key={study.business}>
            <strong>{study.business}</strong> · {study.built}
            {study.result ? <p>{study.result}</p> : null}
            {study.quote ? <p>“{study.quote}”</p> : null}
            {study.href ? <a href={study.href}>Read the case study →</a> : null}
          </blockquote>
        ))}
      </section>

      <section className="mw-resource-cta" aria-labelledby="type-cta-title">
        <div>
          <p className="eyebrow">Free first step</p>
          <h2 id="type-cta-title">Tell me the job. I’ll send a demo and a fixed price.</h2>
          <p>
            <a className="s-details-link" href="/prices">See the details: every task, what’s included and what happens next →</a>
          </p>
          {niches.length ? <p><a className="s-details-link" href={`/for/${niches[0].id}`}>Guide for {niches.map((guide) => guide.shortName).join(', ')} →</a></p> : null}
          <StraightAnswers inline />
        </div>
        <div className="mw-actions">
          <CampaignLink className="button button-signal" href={checkHref}>{MAIN_CTA}</CampaignLink>
        </div>
      </section>

      <SiteFooter /><StickyCheckCta href={checkHref} />
    </main>
  );
}
