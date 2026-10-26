import { AFTER_HOURS, CHANGES_WINDOW, NOT_INCLUDED, OFFERS, STARTER_GUARANTEE, getMenuJob } from '../offers';
import { SERVICE_JOBS } from '../services/jobs';
import { SITE_URL } from '../site';

/** One Service per job plus one FAQPage of all the job questions, so each job is described to search engines. */
function jobsSchema(from: number) {
  const faqs = SERVICE_JOBS.flatMap((job) => job.faqs);
  return {
    '@context': 'https://schema.org',
    '@graph': [
      ...SERVICE_JOBS.map((job) => {
        const menu = getMenuJob(job.id);
        return {
          '@type': 'Service',
          name: menu.name,
          description: menu.what,
          provider: { '@id': `${SITE_URL}/#maz-works` },
          areaServed: 'United Kingdom',
          url: `${SITE_URL}/for#job-${job.id}`,
          offers: { '@type': 'Offer', priceCurrency: 'GBP', price: String(from) },
        };
      }),
      { '@type': 'FAQPage', mainEntity: faqs.map((faq) => ({ '@type': 'Question', name: faq.q, acceptedAnswer: { '@type': 'Answer', text: faq.a } })) },
    ],
  };
}

/** The jobs I set up, one fold-out per job (was /services and /services/[job]). Price comes from OFFERS. */
export function JobsSection() {
  const starter = OFFERS[0];
  return (
    <section className="s-section" id="jobs" aria-labelledby="for-jobs-title">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jobsSchema(starter.from)).replace(/</g, '\\u003c') }} />
      <p className="eyebrow">Jobs I set up</p>
      <h2 id="for-jobs-title">Pick the job you want off your plate.</h2>
      <p className="s-lede">{`I set it up on the tools you already use. A job is ${starter.name} at ${starter.price}. The price is fixed, with a free preview first.`}</p>
      <p><a className="text-link" href={AFTER_HOURS.href}><strong>{AFTER_HOURS.name}, {AFTER_HOURS.price}.</strong> Calls answered in your business name when you can’t pick up. {AFTER_HOURS.setup} <span aria-hidden="true">→</span></a></p>
      <div className="s-faq">
        {SERVICE_JOBS.map((job) => {
          const menu = getMenuJob(job.id);
          return (
            <details key={job.id} id={`job-${job.id}`}>
              <summary>{menu.name}</summary>
              <p>{menu.what}</p>
              {job.does.map((text) => <p key={text}>{text}</p>)}
              <ol>{job.steps.map((step) => <li key={step.name}><strong>{step.name}.</strong> {step.body}</li>)}</ol>
              <p><strong>Who it suits.</strong> {job.suits}</p>
              <p><strong>Not included.</strong> {[...job.notIncluded, ...NOT_INCLUDED].join(' ')}</p>
              <p>{`${STARTER_GUARANTEE} After it goes live you get ${CHANGES_WINDOW.short} and a 90-day fix promise.`}</p>
              {job.faqs.map((faq) => <p key={faq.q}><strong>{faq.q}</strong> {faq.a}</p>)}
              <p><a className="button button-signal" href={`/contact?src=service-${job.id}&package=${encodeURIComponent(starter.name)}#contact`}>Get my free preview</a></p>
            </details>
          );
        })}
      </div>
      <p className="s-small"><a href="/prices">Every price and what’s included →</a></p>
    </section>
  );
}
