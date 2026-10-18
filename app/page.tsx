import { BOOKING_URL, CONTACT_EMAIL, LINKEDIN_URL, MAIN_CTA } from './site';
import { WalkthroughVideo } from './walkthrough-video';
import { SiteFooter, SiteHeader } from './site-chrome';
import { LeakCheckForm } from './free-plan/leak-check-form';
import { CallLink } from './analytics';
import { StickyCheckCta } from './sticky-cta';
import { HeroDemo } from './hero-demo';
import './home-visuals.css';
import { ScrollReveal } from './scroll-reveal';
import { CUSTOMER_TYPES } from './customer-types';
import { KitIcon } from './brand-kit/kit-icon';
import { AFTER_HOURS, FREE_STEP, OFFERS, getMenuJob } from './offers';
import { BeforeAfter } from './before-after';
import { WorkSteps } from './work-steps';
import { ManazirLine } from './manazir-line';
const STARTER = OFFERS[0];
/** Before / after: one row per Starter job (ids are menu jobs in offers.ts). */
const CHANGES = [
  { job: 'missed-call', icon: 'phone', before: 'Missed calls ring someone else.', after: 'The caller gets a text with your booking link.' },
  { job: 'reminders', icon: 'calendar', before: 'You send reminders by hand.', after: 'Reminders go out on their own.' },
  { job: 'reviews', icon: 'star', before: 'Reviews never get asked for.', after: 'A review request follows every job.' },
] as const;
const PROOF = [
  {
    name: 'JobFilter',
    label: 'My own product · software',
    body: 'Finds and filters public contracts for small trades firms. Live, with paid plans.',
    href: '/work/jobfilter',
    img: '/jobfilter-home-mobile.webp',
    alt: 'JobFilter homepage on a phone',
  },
  {
    name: 'Scrap Finance Partners',
    label: 'Client build · website',
    body: 'Designed and built for a specialist finance firm.',
    href: '/work/scrap-finance-partners',
    img: '/scrap-finance-partners-mobile.webp',
    alt: 'Scrap Finance Partners website on a phone',
  },
];

export default function Page() {
 return <main className="s-home">
  <SiteHeader />
  <section className="s-hero s-hero-split" id="main-content" tabIndex={-1} aria-labelledby="intro-title">
   <div><p className="eyebrow">For small businesses and teams, in any trade</p>
    <h1 id="intro-title">Miss a call and they get a text with a booking link, <em>before they ring someone else</em>.</h1>
    <p className="s-lede">Missed-call text-back, reminders and follow-ups on the apps you already use. Start with one task for {STARTER.price}, after a free demo.</p>
    <div className="s-actions"><a className="button button-signal s-button-lg" href="#check">{MAIN_CTA}</a></div>
    <p className="s-note">No working, no invoice.</p>
   <ManazirLine />
   </div><HeroDemo />
  </section>
  <section className="s-section" id="build" aria-labelledby="build-title">
   <p className="eyebrow">What do you run?</p><h2 id="build-title">Pick yours. See the problems, set-up and price.</h2>
   <ul className="s-types" aria-label="Kinds of business">{CUSTOMER_TYPES.map(type => <li key={type.id}><a href={`/for/${type.id}`}>
    <span className="s-type-icon" aria-hidden="true"><KitIcon name={type.icon} /></span>
    <strong>{type.name}</strong><span>{type.examples}</span><em>{type.recipes[0].name.split(': ')[1]?.trim() ?? type.recipes[0].name} · {type.recipes[0].offer.price}</em>
   </a></li>)}</ul>
   <p><a className="s-details-link" href="/prices">Every price and what’s included →</a></p>
   <a className="s-teaser s-teaser-slim" href={AFTER_HOURS.href}><span className="s-teaser-tag">New</span><strong>After-hours call answering {AFTER_HOURS.price}</strong><span className="s-teaser-go" aria-hidden="true">→</span></a>
  </section>
  <section className="s-section" id="how" data-reveal aria-labelledby="how-title">
   <p className="eyebrow">See it working</p><h2 id="how-title">One quote, chased for you.</h2><WalkthroughVideo />
   <h3 className="hv-h3" id="changes-title">What changes for you</h3>
   <BeforeAfter rows={CHANGES.map(c => ({ key: c.job, icon: c.icon, before: c.before, name: getMenuJob(c.job).name, after: c.after }))} />
   <p className="s-small">Example of what changes, not a client result.</p>
  </section>
  <section className="s-section s-check" id="check" aria-labelledby="check-title">
   <div className="s-check-copy"><p className="eyebrow">Your free demo</p><h2 id="check-title">Tell me the job. I’ll send a working demo and a price.</h2>
    <ul className="s-check-list">
     <li><strong>{FREE_STEP.name}: {FREE_STEP.price}.</strong> A working demo of your first job, or a straight answer if it isn’t worth it.</li>
     <li><strong>A written scope sheet and fixed price</strong> before you pay anything.</li>
    </ul>
    <p className="s-small"><CallLink href={BOOKING_URL} className="text-link" placement="free-plan">Prefer to talk? Book a 15-minute call →</CallLink></p>
   </div><LeakCheckForm />
   <WorkSteps />
  </section>
      <section className="s-section s-about" id="about" aria-labelledby="about-title">
        <div className="s-about-head">
          <img className="s-face" src="/maz.webp" alt="Manazir Hussain, who plans and builds every job" width={96} height={96} loading="lazy" />
          <div>
            <p className="eyebrow">Who you’re dealing with</p>
            <h2 id="about-title">I’m Manazir. I plan it and build it myself.</h2>
            <p>Email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.</p>
            <p><a className="button button-dark s-linkedin" href={LINKEDIN_URL} rel="me noopener" target="_blank">Connect on LinkedIn</a></p>
          </div>
        </div>
        <p className="s-small">Work you can open yourself:</p>
        <div className="s-proof">
          {PROOF.map((item) => (
            <a className="s-proof-card" href={item.href} key={item.name}>
              <img src={item.img} alt={item.alt} width={390} height={600} loading="lazy" />
              <span className="relationship">{item.label}</span>
              <strong>{item.name}</strong>
              <span>{item.body}</span>
            </a>
          ))}
        </div>
        <p className="s-small"><a href="/lab">Other things I’ve built →</a></p>
      </section>

<SiteFooter /><StickyCheckCta href="#check" hideWhenVisible="check" /><ScrollReveal />
 </main>;
}
