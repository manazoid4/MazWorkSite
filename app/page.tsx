import { CONTACT_EMAIL, LINKEDIN_URL } from './site';
import { WalkthroughVideo } from './walkthrough-video';
import { SiteFooter, SiteHeader } from './site-chrome';
import { LeakCheckForm } from './free-plan/leak-check-form';
import { StickyCheckCta } from './sticky-cta';
import { HeroDemo } from './hero-demo';
import { HeroQuickForm } from './hero-quick-form';
import './home-visuals.css';
import { ScrollReveal } from './scroll-reveal';
import { CUSTOMER_TYPES } from './customer-types';
import { KitIcon } from './brand-kit/kit-icon';
import { AFTER_HOURS, FREE_STEP, MANAGED_PRESENCE, OFFERS, getMenuJob } from './offers';
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
    <p className="s-lede">Start with one task for {STARTER.price}. Free preview first.</p>
    <HeroQuickForm />
   <ManazirLine />
   </div><HeroDemo />
  </section>
  <section className="s-section" id="build" aria-labelledby="build-title">
   <p className="eyebrow">What do you run?</p><h2 id="build-title">Choose your business.</h2>
   <ul className="s-types" aria-label="Kinds of business">{CUSTOMER_TYPES.map(type => <li key={type.id}><a href={`/for/${type.id}`}>
    <span className="s-type-icon" aria-hidden="true"><KitIcon name={type.icon} /></span>
    <strong>{type.name}</strong><span>{type.examples}</span><em>{type.recipes[0].name.split(': ')[1]?.trim() ?? type.recipes[0].name} · {type.recipes[0].offer.price}</em>
   </a></li>)}</ul>
   <p><a className="s-details-link" href="/prices">Every price and what’s included →</a></p>
   <a className="s-teaser s-teaser-slim" href="/video"><span className="s-teaser-tag">Video</span><strong>Show customers what you do</strong><span>For websites and socials.</span><span className="s-teaser-go" aria-hidden="true">→</span></a>
   <a className="s-teaser s-teaser-slim" href={AFTER_HOURS.href}><span className="s-teaser-tag">Calls · {AFTER_HOURS.price}</span><strong>Answer calls when you can’t pick up</strong><span>Your greeting and messages.</span><span className="s-teaser-go" aria-hidden="true">→</span></a>
   <a className="s-teaser s-teaser-slim" href={MANAGED_PRESENCE.href}><span className="s-teaser-tag">Online · {MANAGED_PRESENCE.price}</span><strong>Stay visible without doing the posting</strong><span>Website, Google and social updates.</span><span className="s-teaser-go" aria-hidden="true">→</span></a>
  </section>
  <section className="s-section" id="how" data-reveal aria-labelledby="how-title">
   <p className="eyebrow">See it working</p><h2 id="how-title">One quote, chased for you.</h2><WalkthroughVideo />
   <h3 className="hv-h3" id="changes-title">What changes for you</h3>
   <BeforeAfter rows={CHANGES.map(c => ({ key: c.job, icon: c.icon, before: c.before, name: getMenuJob(c.job).name, after: c.after }))} />
   <p className="s-small">Example of what changes, not a client result.</p>
  </section>
  <section className="s-section s-check" id="check" aria-labelledby="check-title">
   <div className="s-check-copy"><p className="eyebrow">Your free preview</p><h2 id="check-title">Tell me the job. I’ll send a working preview and a price.</h2>
    <ul className="s-check-list">
     <li><strong>{FREE_STEP.name}: {FREE_STEP.price}.</strong> A working preview of your first job, made on my own test setup, or a straight answer if it isn’t.</li>
     <li><strong>A written scope sheet and fixed price</strong> before you pay anything.</li>
    </ul>
   </div><LeakCheckForm />
   <WorkSteps />
  </section>
      <section className="s-section s-about" id="about" aria-labelledby="about-title">
        <div className="s-about-head">
          <img className="s-face" src="/maz.webp" alt="Manazir Hussain, who plans and builds every job" width={96} height={96} loading="lazy" />
          <div>
            <p className="eyebrow">Who you’re dealing with</p>
            <h2 id="about-title">I’m Manazir. I plan it and build it myself.</h2>
            <div className="s-about-bio">
              <p><strong>My background.</strong> Computer Science graduate. Five years resolving complex financial complaints and managing business accounts across the UK and Europe.</p>
              <p><strong>What I build.</strong> Websites, automations and practical software that save time and help customers reach you.</p>
            </div>
            <div className="s-about-actions">
              <a href={`mailto:${CONTACT_EMAIL}`}>Email {CONTACT_EMAIL}</a>
              <a className="button button-dark s-linkedin" href={LINKEDIN_URL} rel="me noopener" target="_blank">Connect on LinkedIn</a>
            </div>
          </div>
        </div>
        <h3 className="s-about-work-title">Work you can see</h3>
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
        <p className="s-small"><a href="/lab">Other things I’ve built →</a> · <a href="/proof">Proof →</a></p>
      </section>

<SiteFooter /><StickyCheckCta href="#check" hideWhenVisible="check" /><ScrollReveal />
 </main>;
}
