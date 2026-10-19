import type { Metadata } from 'next';
import { SiteFooter, SiteHeader } from '../site-chrome';
import { CREATOR_OFFERS, OFFERS } from '../offers';
import { fitDescription } from '../seo';
import './local-businesses.css';

const starter = OFFERS[0];
const system = OFFERS[1];
const custom = OFFERS[2];
const launch = CREATOR_OFFERS[1];

export const metadata: Metadata = {
  title: 'Systems for local businesses | Maz Works',
  description: fitDescription('Missed calls, quiet quotes and bookings that need chasing? Maz Works connects the tools you already use, so more enquiries turn into customers and less admin lands in your evening.'),
  alternates: { canonical: '/local-businesses' },
};

const industries = [
  { href: '/for/trades', label: 'Trades', text: 'Calls, quotes and job updates' },
  { href: '/for/appointments', label: 'Appointment businesses', text: 'Bookings, reminders and rebooking' },
  { href: '/for/garages', label: 'Garages', text: 'Enquiries, booked-in jobs and reviews' },
  { href: '/for/cafes-and-food', label: 'Food businesses', text: 'Orders, enquiries and repeat visits' },
];

export default function LocalBusinessesPage() {
  return (
    <main className="s-home lb-page">
      <SiteHeader />

      <section className="lb-hero" id="main-content" tabIndex={-1} aria-labelledby="lb-title">
        <div className="lb-hero-copy">
          <p className="eyebrow">For local businesses</p>
          <h1 id="lb-title">You’re serving customers. The admin can wait.</h1>
          <p className="lb-lede">Missed calls, quiet quotes and bookings to chase can cost you the next job. I connect the tools you already use, so customers get a clear next step and you spend less time keeping things moving.</p>
          <a className="button button-signal lb-primary" href="/contact?src=local-businesses">Tell me what's not working</a>
          <p className="lb-note">One person to deal with. A clear scope and fixed price before any paid work.</p>
        </div>
        <aside className="lb-example" aria-label="Illustrative example of a connected customer enquiry">
          <p className="lb-example-label">A simple example · illustrative</p>
          <div className="lb-flow">
            <span>Customer calls while you’re busy</span><b aria-hidden="true">↓</b>
            <span>They get a useful next step</span><b aria-hidden="true">↓</b>
            <span>You pick up the conversation when free</span>
          </div>
          <p className="lb-example-foot">What can be connected depends on the tools you already use. We check that first.</p>
        </aside>
      </section>

      <section className="lb-section" aria-labelledby="lb-start-title">
        <div className="lb-section-intro">
          <p className="eyebrow">Start with the job</p>
          <h2 id="lb-start-title">A better way to handle the busy bits.</h2>
        </div>
        <ul className="lb-jobs">
          <li><a href="/services/missed-call"><strong>Missed calls</strong><span>Give callers a clear next step while your hands are full.</span><em>See missed-call text-back →</em></a></li>
          <li><a href="/services/quote-follow-up"><strong>Quotes gone quiet</strong><span>Send a polite follow-up without remembering to chase.</span><em>See quote follow-up →</em></a></li>
          <li><a href="/services/reminders"><strong>Bookings and no-shows</strong><span>Help customers confirm or move an appointment.</span><em>See appointment reminders →</em></a></li>
          <li><a href="/services/reviews"><strong>Remembering to ask for reviews</strong><span>Ask real customers at the right point after a job.</span><em>See review requests →</em></a></li>
        </ul>
      </section>

      <section className="lb-offers" aria-labelledby="lb-offers-title">
        <div>
          <p className="eyebrow">Ways to start</p>
          <h2 id="lb-offers-title">Start with one job. Build from there.</h2>
          <p>We’ll work out what fits after you tell me what’s getting in the way. No package is assumed.</p>
        </div>
        <ul>
          <li><strong>{starter.name}</strong><span>{starter.price} · one task set up to run itself</span></li>
          <li><strong>{system.name}</strong><span>{system.price} · connected jobs for the wider workflow</span></li>
          <li><strong>{custom.name}</strong><span>{custom.price} · when off-the-shelf tools don’t fit</span></li>
          <li><strong>{launch.name}</strong><span>{launch.price} · a page for bookings, enquiries or sales</span></li>
        </ul>
        <a className="lb-text-link" href="/prices">See what each option includes and all prices →</a>
      </section>

      <section className="lb-section lb-industries" aria-labelledby="lb-industries-title">
        <div className="lb-section-intro">
          <p className="eyebrow">A few starting points</p>
          <h2 id="lb-industries-title">Made around the work you do.</h2>
          <p>These are examples. If yours is different, tell me about it.</p>
        </div>
        <ul className="lb-industry-list">{industries.map((industry) => <li key={industry.href}><a href={industry.href}><strong>{industry.label}</strong><span>{industry.text}</span><b aria-hidden="true">↗</b></a></li>)}</ul>
        <a className="lb-text-link" href="/for">See all business types and trades →</a>
      </section>

      <section className="lb-close" aria-labelledby="lb-close-title">
        <p className="eyebrow">Tell me where it sticks</p>
        <h2 id="lb-close-title">What’s taking too much time, or losing you work?</h2>
        <p>Tell me what happens today and what you’d like to happen instead. I’ll look at the tools you use and suggest a sensible next step.</p>
        <a className="button button-signal lb-primary" href="/contact?src=local-businesses">Tell me what's not working</a>
      </section>

      <SiteFooter />
    </main>
  );
}
