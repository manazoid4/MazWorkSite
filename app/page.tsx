import { CHECK_REPLY_TIME, CONTACT_EMAIL, LINKEDIN_URL } from './site';
import { SiteFooter, SiteHeader } from './site-chrome';
import { DemoRequestForm } from './demo-request-form';
import { StickyCheckCta } from './sticky-cta';
import { HeroDemo } from './hero-demo';
import { WalkthroughVideo } from './walkthrough-video';
import './home-visuals.css';
import './shadow-cameo.css';
import './home-reposition.css';
import { OFFERS } from './offers';

const STARTER = OFFERS[0];
const PROOF = [
  { name: 'JobFilter', label: 'Maz Works product · live', body: 'Finds and filters public contracts for small trades firms. Live, with paid plans.', href: '/work/jobfilter', img: '/jobfilter-home-mobile.webp', alt: 'JobFilter homepage on a phone' },
  { name: 'Scrap Finance Partners', label: 'Client build · website', body: 'Designed and built for a specialist finance firm.', href: '/work/scrap-finance-partners', img: '/scrap-finance-partners-mobile.webp', alt: 'Scrap Finance Partners website on a phone' },
] as const;
const SNAGS = [
  'A promising enquiry lands, but nobody owns the next reply.',
  'The same complaint is handled again, without the pattern becoming clear.',
  'People copy the same details between inboxes, spreadsheets and other tools.',
  'Visitors reach your website but cannot see the next step.',
] as const;
const OUTCOMES = [
  { title: 'Help customers move forward', body: 'Make it easier to understand what you do, get in touch, book or buy.' },
  { title: 'Keep important work moving', body: 'Make recurring steps and hand-offs clearer, with less manual chasing.' },
  { title: 'Learn from difficult customer moments', body: 'Make complaints and repeat issues easier to understand and act on.' },
] as const;

export default function Page() {
  return (
    <div className="s-home s-home-reposition">
      <SiteHeader ctaHref="#enquiry" ctaLabel="Tell me what’s not working" />
      <main className="s-home-main">
      <section className="s-hero s-home-hero" id="main-content" tabIndex={-1} aria-labelledby="intro-title">
        <div className="s-home-hero-copy">
          <h1 id="intro-title">Make the hard parts of business work better.</h1>
          <p className="s-lede">When customers get stuck or work keeps doubling back, I find where the problem starts and make a practical improvement that fits.</p>
          <a className="button button-signal s-button-lg" href="#enquiry">Tell me what’s not working</a>
          <p className="s-note">One real problem to start. No package or call needed.</p>
          <p className="s-home-founder"><img src="/maz.webp" alt="" width={56} height={56} /><span><strong>Manazir Hussain</strong><br />Computer Science graduate · five years working with complex financial complaints and business accounts across the UK and Europe.</span></p>
        </div>
        <aside className="s-home-note" aria-label="How a business problem becomes a practical improvement">
          <h2>Start with the part that keeps getting in the way.</h2>
          <ol>
            <li><span className="s-home-step">01</span><div><strong>Find the snag</strong><p>Where customers lose their way, or work repeats.</p></div></li>
            <li><span className="s-home-step">02</span><div><strong>Agree the useful change</strong><p>Decide what to improve before choosing how.</p></div></li>
            <li><span className="s-home-step">03</span><div><strong>Set a clear next step</strong><p>See the scope and price that fit the job.</p></div></li>
          </ol>
          <figure className="s-shadow-cameo"><img src="/shadow-mascot.png" alt="A small illustration of a curled-up grey cat." width={900} height={721} /><figcaption>Shadow, keeping watch. Mostly naps.</figcaption></figure>
        </aside>
      </section>
      <section className="s-section s-home-signals" id="signals" aria-labelledby="signals-title">
        <h2 id="signals-title">Things that shouldn’t take this much effort.</h2>
        <ul className="s-home-snag-list">{SNAGS.map((snag) => <li key={snag}>{snag}</li>)}</ul>
        <div className="s-home-routes" aria-label="Choose a route for your business">
          <article><h3>Small and local businesses</h3><p>Make it easier for people to find you, understand what you do and take the next step.</p><a href="/for">Explore customer-facing businesses →</a></article>
          <article><h3>Professional teams</h3><p>Make complaints, reporting and recurring work clearer for the people who handle them.</p><a href="/b2b">Explore work for professional teams →</a></article>
        </div>
      </section>
      <section className="s-section s-home-outcomes" id="outcomes" aria-labelledby="outcomes-title">
        <h2 id="outcomes-title">The fix depends on what’s getting in the way.</h2>
        <ul>{OUTCOMES.map((outcome) => <li key={outcome.title}><h3>{outcome.title}</h3><p>{outcome.body}</p></li>)}</ul>
      </section>
      <section className="s-section s-home-work" id="work" aria-labelledby="work-title">
        <h2 id="work-title">Work you can inspect.</h2>
        <div className="s-home-projects">{PROOF.map((item) => (
          <article className="s-home-project" key={item.name}>
            <a href={item.href} aria-label={`See ${item.name}`}><img src={item.img} alt={item.alt} width={390} height={600} loading="lazy" /></a>
            <div><p className="relationship">{item.label}</p><h3><a href={item.href}>{item.name}</a></h3><p>{item.body}</p></div>
          </article>
        ))}</div>
        <div className="s-home-examples">
          <article className="s-home-example s-home-missed-call"><div><p className="relationship">Demonstration · not a client result</p><h3>A missed call can still get a helpful next step.</h3><p>One small customer-facing example—not the whole business.</p></div><HeroDemo /></article>
          <article className="s-home-example s-home-quote-demo"><div><p className="relationship">Demonstration · not a client result</p><h3>See a quote-follow-up flow.</h3><p>A short example of recurring work moving along without a manual chase.</p></div><WalkthroughVideo /></article>
        </div>
        <p className="s-home-sample"><span className="relationship">Fictional sample · complaints reporting</span> <a href="/complaints/sample/board-report">Read a sample complaints board report →</a></p>
        <p className="s-home-other-work"><a href="/lab">More projects and experiments →</a></p>
      </section>
      <section className="s-section s-home-about" id="about" aria-labelledby="about-title">
        <div>
          <h2 id="about-title">I’m Manazir. I understand the customer side and the systems behind it.</h2>
          <p>For five years I resolved complex financial complaints and managed business accounts across the UK and Europe. I saw how small process gaps affect real customers, identified recurring problems and contributed to improvements. My Computer Science background helps me turn that understanding into practical changes—not technology for its own sake.</p>
          <p>I plan and build the work myself. You speak directly with the person doing it.</p>
          <p className="s-home-about-links"><a href={`mailto:${CONTACT_EMAIL}`}>Email {CONTACT_EMAIL}</a><a href={LINKEDIN_URL} rel="me noopener" target="_blank">Connect on LinkedIn</a></p>
        </div>
      </section>
      <section className="s-section s-home-enquiry" id="enquiry" aria-labelledby="enquiry-title">
        <h2 id="enquiry-title">Tell me what’s not working.</h2>
        <p>One sentence is enough. I usually reply within {CHECK_REPLY_TIME} with an honest next step—no call or ready-made package required.</p>
        <p className="s-home-price">Selected one-task builds start at {STARTER.price}. Larger projects and specialist consultancy are scoped separately.</p>
        <DemoRequestForm />
      </section>
      </main>
      <SiteFooter homepage />
      <StickyCheckCta href="#enquiry" hideWhenVisible="enquiry" label="Tell me what’s not working" note={`One message · reply within ${CHECK_REPLY_TIME}`} />
    </div>
  );
}
