import type { Metadata } from 'next';
import { ShadowCameo } from './shadow-cameo';
import { SiteFooter, SiteHeader } from './site-chrome';
import { ThreeBuckets } from './three-buckets';
import { CONTACT_EMAIL, ENQUIRY_CTA } from './site';
import { OG_IMAGE } from './seo';
import './home-transformation.css';
import './shadow-cameo.css';

const PROOF = [
  {
    name: 'Scrap Finance Partners',
    label: 'Client work · website',
    body: 'A website designed and built for a specialist finance firm.',
    href: '/work/scrap-finance-partners',
    img: '/scrap-finance-partners-mobile.webp',
    alt: 'Scrap Finance Partners website shown on a phone',
  },
  {
    name: 'JobFilter',
    label: 'Maz Works product · software',
    body: 'A live tool that helps small firms find and filter public contracts.',
    href: '/work/jobfilter',
    img: '/jobfilter-home-mobile.webp',
    alt: 'JobFilter product homepage shown on a phone',
  },
];

export const metadata: Metadata = {
  title: { absolute: 'Maz Works | Making businesses better, one problem at a time' },
  description: 'Maz Works helps businesses win customers, serve them well and improve how they work through websites, connected tools, reporting and custom software.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Maz Works | Making businesses better, one problem at a time',
    description: 'Practical websites, customer workflows, reporting and complaints insight for businesses and teams.',
    url: '/',
    type: 'website',
    images: [OG_IMAGE],
  },
};

export default function Page() {
  return (
    <main className="s-home mw-home">
      <SiteHeader />

      <section className="mw-home-hero" id="main-content" tabIndex={-1} aria-labelledby="home-title">
        <div className="mw-home-hero-copy">
          <p className="eyebrow">Making businesses better, one problem at a time.</p>
          <h1 id="home-title">Less hassle. <em>Better business.</em></h1>
          <p className="mw-home-lede">I build websites, customer workflows and reporting tools that help businesses win work, look after customers and see what needs attention.</p>
          <div className="mw-home-actions">
            <a className="button button-signal" href="/contact?src=home#contact">{ENQUIRY_CTA}</a>
            <a className="mw-home-secondary" href="/proof">See my work <span aria-hidden="true">↗</span></a>
          </div>
          <p className="mw-home-reassurance">One person to deal with. I usually reply within 1 working day. Clear scope and price before paid work. <a href="/free-plan?src=home">See how the free preview works</a>.</p>
        </div>
        <aside className="mw-home-demo" aria-label="Example of a customer enquiry workflow">
          <p className="mw-home-demo-label"><span>One useful job</span><span>Illustrative workflow</span></p>
          <div className="mw-flow-card">
            <div className="mw-flow-step"><span>01</span><strong>A customer gets in touch</strong><small>Call · message · enquiry</small></div>
            <div className="mw-flow-connector" aria-hidden="true">↓</div>
            <div className="mw-flow-step is-highlight"><span>02</span><strong>They get a clear next step</strong><small>A useful reply or booking route</small></div>
            <div className="mw-flow-connector" aria-hidden="true">↓</div>
            <div className="mw-flow-step"><span>03</span><strong>You can see what needs attention</strong><small>Owner · next step · due date</small></div>
          </div>
          <ShadowCameo />
          <p className="mw-home-demo-link"><a href="/professional-teams#demonstrations">See reporting and workload examples →</a></p>
          <p className="mw-home-demo-note">An illustrative workflow, shaped around the tools and people already in your business. <a href="/after-hours-receptionist">Need help answering calls? See the option</a>.</p>
        </aside>
      </section>

      <ThreeBuckets />

      <section className="mw-home-doors" aria-labelledby="doors-title">
        <header>
          <p className="eyebrow">Two ways in</p>
          <h2 id="doors-title">Start with the work you know.</h2>
          <p>You don’t need to know which service or tool you need. Tell me what is getting in the way.</p>
        </header>
        <div className="mw-door-grid">
          <article className="mw-door-card mw-door-local">
            <p className="eyebrow">For the person doing the job</p>
            <h3>I run a local business.</h3>
            <p>Missed calls, quiet quotes, bookings to chase or a website that no longer does its job. Start with one practical improvement.</p>
            <a href="/local-businesses">Explore help for local businesses <span aria-hidden="true">→</span></a>
          </article>
          <article className="mw-door-card mw-door-professional">
            <p className="eyebrow">For teams and organisations</p>
            <h3>I work in a professional team.</h3>
            <p>Scattered reports, approaching deadlines or recurring complaints. Get clearer oversight and practical tools around the way your team works.</p>
            <a href="/professional-teams">Explore work for professional teams <span aria-hidden="true">→</span></a>
          </article>
        </div>
      </section>

      <section className="mw-home-about" aria-labelledby="about-title">
        <img src="/maz.webp" alt="Manazir Hussain, who scopes and builds the work" width={112} height={112} loading="lazy" />
        <div>
          <p className="eyebrow">Who you’re dealing with</p>
          <h2 id="about-title">I’m Manazir. I plan it and build it myself.</h2>
          <p><strong>My background.</strong> Computer Science graduate with five years resolving complex financial complaints and managing business accounts across the UK and Europe.</p>
          <p><strong>What I build.</strong> Websites, automations and practical software, including dashboards and reporting, to help customers reach you and make day-to-day work easier.</p>
          <a href={`mailto:${CONTACT_EMAIL}`}>Email {CONTACT_EMAIL}</a>
        </div>
      </section>

      <section className="mw-home-proof" aria-labelledby="proof-title">
        <header>
          <p className="eyebrow">Work you can see</p>
          <h2 id="proof-title">Real projects. Clearly labelled.</h2>
          <p>Client work and Maz Works products are shown separately, so you can see what each example represents.</p>
        </header>
        <div className="mw-home-proof-grid">
          {PROOF.map((item) => (
            <a className="mw-home-proof-card" href={item.href} key={item.name}>
              <img src={item.img} alt={item.alt} width={390} height={600} loading="lazy" />
              <span className="relationship">{item.label}</span>
              <strong>{item.name}</strong>
              <span>{item.body}</span>
              <b aria-hidden="true">See the project →</b>
            </a>
          ))}
        </div>
        <p className="mw-home-proof-note">Complaints work examples use synthetic data and are labelled as demonstrations. <a href="/complaints-improvement">See the sample reports →</a></p>
        <p className="mw-home-proof-note">For professional teams: <a href="/professional-teams#demonstrations">see dashboard and workflow demonstrations →</a></p>
      </section>

      <section className="mw-home-close" aria-labelledby="home-close-title">
        <p className="eyebrow">Tell me what’s getting in the way</p>
        <h2 id="home-close-title">You don’t need the answer before you ask.</h2>
        <p>Explain what happens today and what you’d like to happen instead. I’ll reply personally with a sensible next step.</p>
        <a className="button button-signal" href="/contact?src=home-close#contact">{ENQUIRY_CTA}</a>
      </section>

      <SiteFooter />
    </main>
  );
}
