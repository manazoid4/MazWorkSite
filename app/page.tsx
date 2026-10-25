import type { Metadata } from 'next';
import { SiteFooter, SiteHeader } from './site-chrome';
import { HomeFooterConvert } from './home-footer-convert';
import { MiniPlan } from './tools/restaurant-tables/plan-art';
import { FLAGSHIP_PROJECTS } from './projects';
import { CHECK_REPLY_TIME, ENQUIRY_CTA } from './site';
import { fitDescription, OG_IMAGE } from './seo';
import './tools/tools.css';
import './home-transformation.css';

// The one real project on the home page. Text comes from app/projects.ts so it cannot drift. Links go straight to the live product.
const JOBFILTER = FLAGSHIP_PROJECTS.find((project) => project.id === 'jobfilter');

// The four places a recurring problem usually shows up. Links go to /what-we-do; point each at its own anchor there if wanted.
const AREAS = [
  { n: '01', title: 'Websites and digital experiences', body: 'A clear site that explains what you do, answers the obvious questions and makes the next step easy to take.', href: '/website-design' },
  { n: '02', title: 'Customer enquiries and follow-up', body: 'Calls, messages and quotes get an answer, and nothing quietly slips through the gaps.', href: '/what-we-do' },
  { n: '03', title: 'Booking and operational improvements', body: 'Bookings, reminders and hand-offs that stop depending on one person remembering.', href: '/what-we-do' },
  { n: '04', title: 'Focused custom tools', body: 'When off-the-shelf software does not fit, a small tool built around one job.', href: '/what-we-do' },
];

const STEPS = [
  { title: 'Tell me what’s not working', body: `A few lines is plenty. No jargon, and you do not need to know the answer. I usually reply within ${CHECK_REPLY_TIME}.` },
  { title: 'I look for the pattern', body: 'I ask what happens, how often and what it costs you in time. Sometimes the real problem is one step before the one you noticed.' },
  { title: 'You get a preview and a fixed price', body: 'The free preview is a working example on my own test set-up, not your live tools. Scope and price are agreed before any work starts.' },
  { title: 'I build it and stand behind it', body: 'I use the tools you already have where I can, show you it working, and fix problems that turn up afterwards.' },
];

const TITLE = 'Websites & Business Systems in Derbyshire | Maz Works';
const DESCRIPTION = fitDescription('Websites, booking and customer follow-up for small businesses in Derbyshire, Nottingham and across the UK. Practical tools, fixed quotes, one person to deal with.');

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
          <p className="eyebrow">Maz Works · one person, practical fixes</p>
          <h1 id="home-title">Less hassle. <mark>Better</mark> business.</h1>
          <p className="mw-home-lede">Missed enquiries, the same details typed twice, a list checked by hand every week. I find the pattern behind the problem, then build a practical way to make it easier.</p>
          <div className="mw-home-actions">
            <a className="button button-signal" href="/contact?src=home#contact">{ENQUIRY_CTA}</a>
            <a className="mw-home-secondary" href="/tools">Try the tools and demos <span aria-hidden="true">↗</span></a>
          </div>
          <p className="mw-home-reassurance">One person to deal with, and I usually reply within {CHECK_REPLY_TIME}.</p>
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
            <h2 id="do-title" className="rx-title">Four places problems usually show up.</h2>
          </div>
          <p className="rx-lede">I start with what keeps going wrong, not with a list of services. Pick the one that sounds like your week.</p>
        </header>
        <ol className="mw-areas">
          {AREAS.map((area) => (
            <li className="mw-area" key={area.n}>
              <span className="mw-area-n" aria-hidden="true">{area.n}</span>
              <h3><a href={area.href}>{area.title}</a></h3>
              <p>{area.body}</p>
              <span className="mw-area-go" aria-hidden="true">↗</span>
            </li>
          ))}
        </ol>
        <p className="mw-do-foot">Need <a href="/website-design">website design in Derbyshire or Nottingham</a>? Start there. Running a local or independent business? <a href="/local-businesses">See what that looks like</a>. Part of a professional team? <a href="/professional-teams">Start here</a>. Prices are on the <a href="/prices">prices page</a>.</p>
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
              <ul>{JOBFILTER.built.slice(0, 3).map((line) => <li key={line}>{line}</li>)}</ul>
              <p className="mw-work-limit">{JOBFILTER.limitation}</p>
              <a className="rx-link" href={JOBFILTER.links[0].href}>Try a free scan <span aria-hidden="true">↗</span></a>
            </div>
          </div>
          <p className="mw-work-more">More, including client websites and prototypes, on <a href="/proof">my work page</a>. Complaints-reporting examples use synthetic data and are labelled demonstrations: <a href="/professional-teams#demonstrations">see them</a>.</p>
        </section>
      )}

      <section className="rx-band rx-band--plum mw-tools" aria-labelledby="tools-title">
        <div className="tl-feature">
          <div className="tl-feature-copy">
            <span className="rx-tag" data-kind="concept">Interactive concept demo</span>
            <h2 id="tools-title">Pick a table, in a cafe that does not exist.</h2>
            <p className="rx-lede">A table picker I built to show what a better booking step could feel like: choose a table on a floor plan, filter by party size, see what comes next. No real reservation is made.</p>
            <div className="mw-tools-actions">
              <a className="button mw-btn-cream" href="/tools/restaurant-tables">Try the table picker</a>
              <a className="rx-link" href="/tools">All tools and demos <span aria-hidden="true">↗</span></a>
            </div>
          </div>
          <div className="tl-feature-art"><MiniPlan /></div>
        </div>
      </section>

      <section className="rx-band rx-band--peach mw-founder" aria-labelledby="about-title">
        <div className="mw-founder-grid">
          <img src="/maz.webp" alt="Manazir Hussain, who scopes and builds the work" width={240} height={240} loading="lazy" />
          <div>
            <h2 id="about-title" className="rx-title">Hi, I’m Maz.</h2>
            <p className="mw-founder-lead">I spent five years in finance handling complaints and escalations, with thousands of unhappy customers. I know what it’s like when something goes wrong.</p>
            <p>That job taught me to look for the cause behind a complaint, not just the complaint. It is the habit I bring to your business: find the thing that keeps happening, then make it easier.</p>
            <p>I’m a Computer Science graduate and I build every job myself. I’m just starting out, and I’ll always be honest about what I can and can’t do.</p>
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
