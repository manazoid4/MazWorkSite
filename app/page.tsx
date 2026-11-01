import type { Metadata } from 'next';
import { SiteFooter, SiteHeader } from './site-chrome';
import { HomeFooterConvert } from './home-footer-convert';
import { FLAGSHIP_PROJECTS } from './projects';
import { CHECK_REPLY_TIME, DIRECT_LINE, ENQUIRY_CTA } from './site';
import { fitDescription, OG_IMAGE } from './seo';
import './home-transformation.css';

// The one real project on the home page. Text comes from app/projects.ts so it cannot drift. Links go straight to the live product.
const JOBFILTER = FLAGSHIP_PROJECTS.find((project) => project.id === 'jobfilter');

// Two doors, one way of working. Prices stay on /prices; the "No AI in the offer" rule still holds for the small-business door.
const DOORS = [
  {
    n: '01',
    who: 'Small and local businesses',
    title: 'Websites, bookings and follow-up',
    body: 'A website that brings enquiries, missed callers texted back, bookings reminded, quotes chased.',
    href: '/local-businesses',
    more: { href: '/prices', label: 'See prices' },
  },
  {
    n: '02',
    who: 'Teams handling complaints and customer cases',
    title: 'Clear the backlog. Hit every deadline.',
    body: 'Tracking and reporting that show what is due and what keeps going wrong. Where AI might help, I test it on your own examples first. A person stays in charge.',
    href: '/professional-teams',
    more: { href: '/research', label: 'How I test AI' },
  },
];

const STEPS = [
  { title: 'Tell me what’s not working', body: `A few lines is plenty. I usually reply within ${CHECK_REPLY_TIME}.` },
  { title: 'I find the pattern', body: 'What happens, how often, and what it costs you. The real problem is often one step earlier.' },
  { title: 'You see it working first', body: 'A preview on my own test set-up and a fixed price, before any work starts.' },
  { title: 'I build it and stand behind it', body: 'Using the tools you already have where I can, and fixing problems that turn up afterwards.' },
];

const TITLE = 'Websites, Customer Systems & Complaints Tools | Maz Works';
const DESCRIPTION = fitDescription('Websites, bookings and follow-up for UK small businesses, and deadline, reporting and tested AI tools for complaints teams. See it working before you pay.');

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: '/' },
  openGraph: { title: TITLE, description: DESCRIPTION, url: '/', type: 'website', images: [OG_IMAGE] },
};

export default function Page() {
  return (
    <main className="s-home mw-home">
      <SiteHeader />

      <section className="mw-home-hero" id="main-content" tabIndex={-1} aria-labelledby="home-title">
        <div className="mw-home-hero-copy">
          <p className="eyebrow">Maz Works · independent, working UK-wide</p>
          <h1 id="home-title">Find what keeps going wrong. <mark>Fix it.</mark></h1>
          <p className="mw-home-lede">From a small firm’s bookings to a complaints team’s deadlines, I find the pattern behind the problem, then build a practical way to make it easier. You see it working before you pay.</p>
          <p className="mw-home-direct">{DIRECT_LINE}</p>
          <div className="mw-home-actions">
            <a className="button button-signal" href="/contact?src=home#contact">{ENQUIRY_CTA}</a>
            <a className="mw-home-secondary" href="/tools">Try the tools and demos <span aria-hidden="true">↗</span></a>
          </div>
          <p className="mw-home-reassurance">I usually reply within {CHECK_REPLY_TIME}.</p>
        </div>

        {JOBFILTER && (
          <aside className="hm-note" aria-labelledby="note-title">
            <p className="hm-note-kicker" id="note-title">A real example, from my own product</p>
            <div className="hm-note-row">
              <span>Kept happening</span>
              <p>Small building firms lose hours checking tender sites by hand.</p>
            </div>
            <svg className="hm-note-loop" viewBox="0 0 124 60" aria-hidden="true" focusable="false">
              <path d="M30 42C6 42 6 12 30 12c26 0 30 36 56 36h24" />
              <path d="m100 39 11 9-11 9" />
            </svg>
            <div className="hm-note-row is-fix">
              <span>Made easier</span>
              <p>{JOBFILTER.name} checks each public contract against the firm’s trade, area and deadline, then sends alerts.</p>
            </div>
            <a className="rx-link" href={JOBFILTER.links[0].href}>Try it live <span aria-hidden="true">↗</span></a>
          </aside>
        )}
      </section>

      <section className="mw-do rx-section" id="what-i-do" aria-labelledby="do-title">
        <header className="rx-split">
          <div>
            <p className="rx-kicker">What I do</p>
            <h2 id="do-title" className="rx-title">Two kinds of business. One way of working.</h2>
          </div>
          <p className="rx-lede">Start with what keeps going wrong, build the smallest thing that fixes it, and prove it works.</p>
        </header>
        <ol className="mw-areas mw-doors">
          {DOORS.map((door) => (
            <li className="mw-area" key={door.n}>
              <span className="mw-area-n" aria-hidden="true">{door.n}</span>
              <p className="mw-door-who">{door.who}</p>
              <h3><a href={door.href}>{door.title}</a></h3>
              <p>{door.body}</p>
              <p className="mw-door-more"><a href={door.more.href}>{door.more.label} <span aria-hidden="true">→</span></a></p>
            </li>
          ))}
        </ol>
        <p className="mw-do-foot">Need a website? <a href="/website-design">See website design options</a>. Want to see something first? <a href="/tools/restaurant-tables">Try the table picker</a>. Interactive concept demo. No real reservation is made. Or see <a href="/what-we-do">everything I do</a>.</p>
      </section>

      {JOBFILTER?.image && (
        <section className="rx-band rx-band--sky mw-work" aria-labelledby="proof-title">
          <p className="rx-kicker">My work</p>
          <h2 id="proof-title" className="rx-title">Made to be used.<br />Have a look around.</h2>
          <div className="mw-work-grid">
            <a className="mw-work-shot" href={JOBFILTER.links[0].href} aria-label={`View ${JOBFILTER.name}`}>
              <img src={JOBFILTER.image.src} alt={JOBFILTER.image.alt} width={JOBFILTER.image.width} height={JOBFILTER.image.height} loading="lazy" />
            </a>
            <div className="mw-work-copy">
              <span className="rx-tag" data-kind="internal">Internal project</span>
              <h3><a href={JOBFILTER.links[0].href}>{JOBFILTER.name}</a></h3>
              <p className="mw-work-meta">Maz Works product · live</p>
              <p>Finding relevant public contracts for small trades firms.</p>
              <p className="mw-work-limit">{JOBFILTER.limitation}</p>
              <a className="rx-link" href={JOBFILTER.links[0].href}>Try a free scan <span aria-hidden="true">↗</span></a>
            </div>
          </div>
          <div className="mw-test-card">
            <span className="rx-tag" data-kind="internal">Open research</span>
            <h3><a href="/research">Can AI answer a complaint properly?</a></h3>
            <p>Two small AI models wrote replies to UK financial complaints. Neither met the regulator’s rules. So I test on real examples before anything reaches a customer.</p>
            <p className="mw-work-limit">Invented test complaints and two small models: a first test result, not a verdict on every AI model.</p>
            <a className="rx-link" href="/research">See the test <span aria-hidden="true">→</span></a>
          </div>
          <p className="mw-work-more">More, including client websites, on <a href="/proof">my work page</a>. Complaints-reporting examples use synthetic data and are labelled demonstrations: <a href="/professional-teams#demonstrations">see them</a>.</p>
        </section>
      )}

      <section className="rx-band rx-band--peach mw-founder" aria-labelledby="about-title">
        <div className="mw-founder-grid">
          <img src="/maz.webp" alt="Manazir Hussain, who scopes and builds the work" width={240} height={240} loading="lazy" />
          <div>
            <h2 id="about-title" className="rx-title">Hi, I’m Maz.</h2>
            <p className="mw-founder-lead">I spent five years in finance handling complaints and escalations, with thousands of unhappy customers. I know what it’s like when something goes wrong.</p>
            <p>It taught me to look for the cause, not just the complaint. I’m a Computer Science graduate and I build every job myself.</p>
            <a className="rx-link" href="/about">More about me <span aria-hidden="true">→</span></a>
          </div>
        </div>
      </section>

      <section className="mw-how rx-section" aria-labelledby="how-title">
        <p className="rx-kicker">Working with me</p>
        <h2 id="how-title" className="rx-title">How it goes.</h2>
        <ol className="hm-steps">
          {STEPS.map((step, index) => (
            <li key={step.title}>
              <span className="hm-step-n" aria-hidden="true">{index + 1}</span>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </li>
          ))}
        </ol>
        <a className="rx-link" href="/prices">See what is included and what it costs <span aria-hidden="true">↗</span></a>
      </section>

      <SiteFooter conversion={<HomeFooterConvert />} />
    </main>
  );
}
