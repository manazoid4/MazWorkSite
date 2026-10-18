import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Breadcrumbs } from '../../breadcrumbs';
import { CUSTOMER_TYPES } from '../../customer-types';
import { CHANGES_WINDOW, NOT_INCLUDED, OFFERS, STARTER_GUARANTEE, getMenuJob } from '../../offers';
import { OG_IMAGE, fitDescription } from '../../seo';
import { MAIN_CTA, SITE_URL } from '../../site';
import { SiteFooter, SiteHeader } from '../../site-chrome';
import { ScrollReveal } from '../../scroll-reveal';
import { SERVICE_JOBS, getServiceJob } from '../jobs';

export const dynamicParams = false;

export function generateStaticParams() {
  return SERVICE_JOBS.map((job) => ({ job: job.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ job: string }> }): Promise<Metadata> {
  const { job: id } = await params;
  const job = getServiceJob(id);
  if (!job) return {};
  const menu = getMenuJob(id);
  const description = fitDescription(`${menu.what} Starter Automation ${OFFERS[0].price}, fixed price, free preview first. For UK small businesses.`);
  return {
    title: { absolute: job.title },
    description,
    alternates: { canonical: `/services/${id}` },
    openGraph: { title: job.title, description, url: `/services/${id}`, type: 'website', images: [OG_IMAGE] },
  };
}

const json = (data: unknown) => JSON.stringify(data).replace(/</g, '\\u003c');

export default async function ServiceJobPage({ params }: { params: Promise<{ job: string }> }) {
  const { job: id } = await params;
  const job = getServiceJob(id);
  if (!job) notFound();
  const menu = getMenuJob(id);
  const starter = OFFERS[0];
  const ctaHref = `/free-plan?src=service-${id}&package=${encodeURIComponent(starter.name)}#leak-check-form`;
  const types = CUSTOMER_TYPES.filter((type) => menu.types.includes(type.id));
  const others = SERVICE_JOBS.filter((item) => item.id !== id).slice(0, 4);

  const service = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: menu.name,
    serviceType: menu.name,
    description: menu.what,
    provider: { '@id': `${SITE_URL}/#maz-works` },
    areaServed: { '@type': 'Country', name: 'United Kingdom' },
    url: `${SITE_URL}/services/${id}`,
    offers: { '@type': 'Offer', name: starter.name, price: starter.from, priceCurrency: 'GBP', url: `${SITE_URL}/services/${id}` },
  };
  const faqs = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: job.faqs.map((faq) => ({ '@type': 'Question', name: faq.q, acceptedAnswer: { '@type': 'Answer', text: faq.a } })),
  };

  return (
    <main>
      <SiteHeader />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json(service) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json(faqs) }} />

      <section className="mw-resource-hero" id="main-content" tabIndex={-1} aria-labelledby="job-title">
        <Breadcrumbs items={[{ href: '/services', label: 'Jobs I set up' }, { label: menu.name }]} />
        <p className="eyebrow">{menu.name}</p>
        <h1 id="job-title">{job.h1}</h1>
        <p>{job.lede}</p>
        <div className="mw-actions">
          <a className="button button-signal" href={ctaHref}>{MAIN_CTA}</a>
        </div>
        <p className="mw-hero-note">{`Free preview, no call needed. Starter Automation is ${starter.price}, fixed. Manazir plans and builds it himself.`}</p>
      </section>

      <section className="mw-qw-section" aria-labelledby="job-does-title">
        <p className="eyebrow">What it does</p>
        <h2 id="job-does-title">{menu.name}, in plain words.</h2>
        {job.does.map((text) => <p key={text}>{text}</p>)}
      </section>

      <section className="mw-qw-section" aria-labelledby="job-how-title">
        <p className="eyebrow">How it works</p>
        <h2 id="job-how-title">Three steps, and you do very little.</h2>
        <ol className="mw-qw-list">
          {job.steps.map((step, index) => (
            <li key={step.name} className="mw-example"><strong>{index + 1}. {step.name}</strong><p className="mw-example-seen">{step.body}</p></li>
          ))}
        </ol>
      </section>

      <section className="mw-qw-section" aria-labelledby="job-suits-title">
        <p className="eyebrow">Who it suits</p>
        <h2 id="job-suits-title">Is this for your business?</h2>
        <p>{job.suits}</p>
        <p className="mw-qw-lead">
          {types.map((type) => <a key={type.id} className="s-details-link" href={`/for/${type.id}`}>{type.name} →</a>)}{' '}
          <a className="s-details-link" href="/for">Every kind of business →</a>
        </p>
      </section>

      <section className="mw-qw-section" id="price" aria-labelledby="job-price-title">
        <p className="eyebrow">The price</p>
        <h2 id="job-price-title">{starter.name}: {starter.price}, fixed.</h2>
        <p>{`One job from the automation menu, set up to run by itself on the tools you already use, with two small set-ups free. ${STARTER_GUARANTEE} You get a written scope sheet and a fixed price before any work.`}</p>
        <p>{`After it goes live you get ${CHANGES_WINDOW.short} and a 90-day fix promise. `}<a className="s-details-link" href="/prices">See every price and what’s included →</a></p>
        <div className="mw-actions"><a className="button button-signal" href={ctaHref}>{MAIN_CTA}</a></div>
      </section>

      <section className="mw-qw-section" aria-labelledby="job-not-title">
        <p className="eyebrow">What’s not included</p>
        <h2 id="job-not-title">Said plainly, up front.</h2>
        <ul>
          {[...job.notIncluded, ...NOT_INCLUDED].map((item) => <li key={item}>{item}</li>)}
        </ul>
      </section>

      <section className="s-section" id="answers" aria-labelledby="job-faq-title">
        <p className="eyebrow">Questions</p>
        <h2 id="job-faq-title">What owners ask about {menu.name.toLowerCase()}.</h2>
        <div className="s-faq">
          {job.faqs.map((faq) => <details key={faq.q}><summary>{faq.q}</summary><p>{faq.a}</p></details>)}
        </div>
      </section>

      <p className="mw-related mw-related-quiet"><a href="/services"><strong>Other jobs I set up →</strong> <span>{others.map((item) => getMenuJob(item.id).name).join(', ')} and more.</span></a></p>

      <section className="mw-resource-cta" aria-labelledby="job-cta-title">
        <div>
          <p className="eyebrow">Free first step</p>
          <h2 id="job-cta-title">Want {menu.name.toLowerCase()} in your business?</h2>
          <p>Tell me the job. I’ll send a working preview and a fixed price.</p>
        </div>
        <div className="mw-actions">
          <a className="button button-signal" href={ctaHref}>{MAIN_CTA}</a>
        </div>
      </section>

      <SiteFooter /><ScrollReveal />
    </main>
  );
}
