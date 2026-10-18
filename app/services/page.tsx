import type { Metadata } from 'next';
import { Breadcrumbs } from '../breadcrumbs';
import { AFTER_HOURS, OFFERS, getMenuJob } from '../offers';
import { OG_IMAGE, fitDescription } from '../seo';
import { MAIN_CTA, SITE_URL } from '../site';
import { SiteFooter, SiteHeader } from '../site-chrome';
import { ScrollReveal } from '../scroll-reveal';
import { SERVICE_JOBS } from './jobs';
import '../home-visuals.css';

const PAGE_URL = '/services';

export const metadata: Metadata = {
  title: { absolute: 'Automation jobs for UK small businesses | Maz Works' },
  description: fitDescription(`Missed-call text-back, appointment reminders, review requests, quote follow-up and more, set up for you. Starter Automation ${OFFERS[0].price}, free preview first.`),
  alternates: { canonical: PAGE_URL },
  openGraph: { title: 'Automation jobs for UK small businesses', description: fitDescription('Pick the job you want off your plate. Fixed price, free preview first.'), url: PAGE_URL, type: 'website', images: [OG_IMAGE] },
};

export default function ServicesPage() {
  const ctaHref = `/free-plan?src=services&package=${encodeURIComponent(OFFERS[0].name)}#leak-check-form`;
  const list = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Automation jobs for UK small businesses',
    itemListElement: SERVICE_JOBS.map((job, index) => ({ '@type': 'ListItem', position: index + 1, name: getMenuJob(job.id).name, url: `${SITE_URL}/services/${job.id}` })),
  };
  return (
    <main>
      <SiteHeader />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(list).replace(/</g, '\\u003c') }} />

      <section className="mw-resource-hero" id="main-content" tabIndex={-1} aria-labelledby="services-title">
        <Breadcrumbs items={[{ label: 'Jobs I set up' }]} />
        <p className="eyebrow">Jobs I set up</p>
        <h1 id="services-title">Automation jobs for UK small businesses.</h1>
        <p>Pick the job you want off your plate. I set it up on the tools you already use, so it runs by itself.</p>
        <div className="mw-actions">
          <a className="button button-signal" href={ctaHref}>{MAIN_CTA}</a>
        </div>
        <p className="mw-hero-note">{`Free preview, no call needed. One job is ${OFFERS[0].price} as a Starter Automation. Manazir plans and builds it himself.`}</p>
      </section>

      <section className="mw-qw-section" aria-labelledby="services-monthly-title">
        <p className="eyebrow">Monthly service · new</p>
        <h2 id="services-monthly-title">{AFTER_HOURS.name}, {AFTER_HOURS.price}.</h2>
        <a className="s-teaser" href={AFTER_HOURS.href}><span className="s-teaser-tag">{AFTER_HOURS.setup}</span><strong>Calls answered when you can’t pick up.</strong><span>Busy on a job or closed for the night, calls are answered in your business name, messages taken and a summary emailed to you.</span><span className="s-teaser-go" aria-hidden="true">→</span></a>
      </section>

      <section className="mw-qw-section" aria-labelledby="services-list-title">
        <p className="eyebrow">Most asked for</p>
        <h2 id="services-list-title">Choose a job.</h2>
        <ul className="mw-qw-list">
          {SERVICE_JOBS.map((job) => {
            const menu = getMenuJob(job.id);
            return (
              <li key={job.id} className="mw-example">
                <strong>{menu.name}</strong>
                <p className="mw-example-seen">{menu.what}</p>
                <a className="mw-example-fix" href={`/services/${job.id}`}>How it works →</a>
              </li>
            );
          })}
        </ul>
        <p className="mw-qw-lead"><a className="s-details-link" href="/prices">Every price and what’s included →</a> <a className="s-details-link" href="/for">Who it’s for →</a></p>
      </section>

      <section className="mw-resource-cta" aria-labelledby="services-cta-title">
        <div>
          <p className="eyebrow">Free first step</p>
          <h2 id="services-cta-title">Not sure which job?</h2>
          <p>Tell me what eats your time. I’ll send a working preview and a fixed price.</p>
        </div>
        <div className="mw-actions">
          <a className="button button-signal" href={ctaHref}>{MAIN_CTA}</a>
        </div>
      </section>

      <SiteFooter /><ScrollReveal />
    </main>
  );
}
