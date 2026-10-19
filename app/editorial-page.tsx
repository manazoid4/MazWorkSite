import { BOOKING_URL, CONTACT_EMAIL, LINKEDIN_URL, MAIN_CTA } from './site';
import './editorial-home.css';

const projects = [
  {
    name: 'Scrap Finance Partners',
    category: 'Client website',
    description: 'A clearer digital home for a specialist finance business.',
    image: '/scrap-finance-partners.webp',
    alt: 'Screenshot of the Scrap Finance Partners website built by Maz Works',
    href: '/work/scrap-finance-partners',
  },
  {
    name: 'JobFilter',
    category: 'Independent software project',
    description: 'A focused product to help trades businesses filter public contract opportunities.',
    image: '/jobfilter-home.webp',
    alt: 'Screenshot of the JobFilter product built by Maz Works',
    href: '/work/jobfilter',
  },
] as const;

/** Editorial homepage. Real work and honest scope, not a catalogue of tools. */
export function EditorialHome() {
  return (
    <main className="mw-ed" id="main-content" tabIndex={-1}>
      <div className="mw-ed-dark">
        <header className="mw-ed-header">
          <a href="/" className="mw-ed-wordmark" aria-label="Maz Works homepage">maz<span>works</span><b aria-hidden="true">.</b></a>
          <nav className="mw-ed-nav" aria-label="Main navigation">
            <a href="#services">What I do</a>
            <a href="#work">Selected work</a>
            <a href="#about">About</a>
          </nav>
          <a className="mw-ed-nav-cta" href="/free-plan?src=home-header#leak-check-form">{MAIN_CTA} <span aria-hidden="true">↗</span></a>
        </header>
        <section className="mw-ed-hero" aria-labelledby="ed-hero-title">
          <div className="mw-ed-hero-copy">
            <p className="mw-ed-context">Independent digital studio <span aria-hidden="true">/</span> UK businesses</p>
            <h1 id="ed-hero-title">Make a better impression.<span>Run a better business.</span></h1>
            <p className="mw-ed-lede">Thoughtful websites and customer journeys. Clearer processes, complaints reporting and practical systems behind the scenes. Built around the work you actually do.</p>
            <div className="mw-ed-actions">
              <a href="/free-plan?src=home-hero#leak-check-form" className="mw-ed-action-primary">{MAIN_CTA}<span aria-hidden="true">↗</span></a>
              <a href="#work" className="mw-ed-action-secondary">Take a look at the work <span aria-hidden="true">↓</span></a>
            </div>
            <p className="mw-ed-first-step">Start with a working preview and a fixed quote. No obligation.</p>
          </div>
          <figure className="mw-ed-hero-project">
            <div className="mw-ed-project-window">
              <img src="/scrap-finance-partners.webp" alt="Real client website project for Scrap Finance Partners" width={1000} height={750} fetchPriority="high" />
            </div>
            <figcaption><span>From the studio</span><a href="/work/scrap-finance-partners">Scrap Finance Partners <span aria-hidden="true">↗</span></a></figcaption>
          </figure>
        </section>
        <div className="mw-ed-bottomline" aria-hidden="true"><span>Designed with purpose</span><span>Built to be useful</span><span>Made to last</span></div>
      </div>

      <section className="mw-ed-services" id="services" aria-labelledby="services-title">
        <div className="mw-ed-section-lead">
          <p className="mw-ed-small-heading">A sensible place to start</p>
          <h2 id="services-title">What needs to work better?</h2>
          <p>Not every problem needs a bigger platform. Sometimes it needs a clearer page, a more useful report, or a process that finally makes sense.</p>
        </div>
        <div className="mw-ed-service-list">
          <a href="/what-we-do" className="mw-ed-service">
            <span className="mw-ed-service-marker">Customer-facing</span>
            <span className="mw-ed-service-body"><strong>Make it easier for people to choose you.</strong><span>Websites, enquiry journeys and digital experiences that feel considered and work properly.</span></span>
            <span className="mw-ed-service-arrow" aria-hidden="true">↗</span>
          </a>
          <a href="/complaints" className="mw-ed-service">
            <span className="mw-ed-service-marker">Behind the scenes</span>
            <span className="mw-ed-service-body"><strong>Make it easier for your team to deliver.</strong><span>Complaints improvement, management reporting and carefully scoped customer workflows.</span></span>
            <span className="mw-ed-service-arrow" aria-hidden="true">↗</span>
          </a>
        </div>
        <p className="mw-ed-services-note">Not sure where yours fits? <a href="/contact">Tell me what’s happening.</a> I’ll suggest a sensible next step.</p>
      </section>

      <section className="mw-ed-work" id="work" aria-labelledby="work-title">
        <div className="mw-ed-work-heading">
          <div><p className="mw-ed-small-heading">Selected projects</p><h2 id="work-title">The work speaks first.</h2></div>
          <a className="mw-ed-text-link" href="/proof">View the proof <span aria-hidden="true">↗</span></a>
        </div>
        <div className="mw-ed-work-gallery">
          {projects.map((project, index) => (
            <article className={'mw-ed-work-piece mw-ed-work-piece-' + index} key={project.name}>
              <a className="mw-ed-work-image" href={project.href} aria-label={'Read about ' + project.name}>
                <img src={project.image} alt={project.alt} width={960} height={680} loading="lazy" />
              </a>
              <div className="mw-ed-work-caption">
                <div><span>{project.category}</span><h3><a href={project.href}>{project.name}</a></h3><p>{project.description}</p></div>
                <a href={project.href} className="mw-ed-work-open" aria-label={'Open ' + project.name + ' case study'}>↗</a>
              </div>
            </article>
          ))}
        </div>
        <p className="mw-ed-proof-note">One real client build and one independent product. No borrowed testimonials or made-up results.</p>
      </section>

      <section className="mw-ed-about" id="about" aria-labelledby="about-title">
        <div className="mw-ed-about-left"><p className="mw-ed-small-heading">A little about the person doing the work</p><h2 id="about-title">A studio with a name behind it.</h2></div>
        <div className="mw-ed-about-right">
          <div className="mw-ed-intro"><img src="/maz.webp" alt="Manazir Hussain" width={88} height={88} loading="lazy" /><p>I'm Manazir. I plan the work and build it myself.</p></div>
          <p>My background is in resolving complex financial complaints, working with business accounts across the UK and Europe, and turning operational information into decisions. I also have a Computer Science degree from Swansea University.</p>
          <p>That combination shapes Maz Works: understand the problem first, then make something useful, considered and straightforward to own.</p>
          <a className="mw-ed-text-link" href={LINKEDIN_URL} target="_blank" rel="me noopener noreferrer">Meet me on LinkedIn <span aria-hidden="true">↗</span></a>
        </div>
      </section>

      <section className="mw-ed-close" aria-labelledby="close-title">
        <p>Have something in mind?</p>
        <h2 id="close-title">Start with the problem.<br />We'll work out the rest.</h2>
        <div className="mw-ed-close-actions">
          <a className="mw-ed-action-primary" href="/free-plan?src=home-end#leak-check-form">{MAIN_CTA} <span aria-hidden="true">↗</span></a>
          <a className="mw-ed-action-secondary" href={BOOKING_URL} target="_blank" rel="noopener noreferrer">Or book a short call <span aria-hidden="true">↗</span></a>
        </div>
      </section>

      <footer className="mw-ed-footer">
        <div><a href="/" className="mw-ed-wordmark" aria-label="Maz Works homepage">maz<span>works</span><b aria-hidden="true">.</b></a><p>Considered work for better business.</p></div>
        <nav className="mw-footer-links mw-ed-footer-links" aria-label="Footer">
          <a href="/proof">Proof</a><a href="/prices">Prices</a><a href="/complaints">Complaints</a><a href="/contact">Contact</a><a href="/site-map">Everything else</a>
        </nav>
        <div className="mw-ed-footer-bottom"><span>© 2026 Maz Works · <a href="/privacy">Privacy</a> · <a href="/terms">Terms</a></span><a href={'mailto:' + CONTACT_EMAIL}>{CONTACT_EMAIL}</a></div>
      </footer>
    </main>
  );
}
