import type { Metadata } from 'next';
import { SiteFooter, SiteHeader } from '../site-chrome';
import { OFFERS, MANAGED_PRESENCE, AFTER_HOURS } from '../offers';
import { MAIN_CTA, SITE_URL } from '../site';
import { ServiceSchema } from '../service-schema';

export const metadata: Metadata = {
  title: 'What I do: get customers, serve them and improve',
  description: 'Practical systems for getting customers, serving them well, and improving how your business runs.',
  alternates: { canonical: `${SITE_URL}/what-we-do` },
};

export default function WhatWeDo() {
  return (
    <main className="s-home">
      <SiteHeader /><ServiceSchema path="/what-we-do" />
      <section className="s-hero s-hero-short" id="main-content" tabIndex={-1} aria-labelledby="what-title">
        <p className="eyebrow">What I do</p>
        <h1 id="what-title">Get customers. Serve customers. Keep improving.</h1>
        <p className="s-lede">I build connected tools and custom software that help small businesses bring in work, look after customers and spend less time chasing admin.</p>
        <div className="s-actions"><a className="button button-signal s-button-lg" href="/free-plan?src=what-we-do#leak-check-form">{MAIN_CTA}</a><a className="text-link" href="/proof">See real work and evidence →</a></div>
      </section>

      <section className="s-section" id="get-customers" aria-labelledby="get-title">
        <p className="eyebrow">01 · Get customers</p>
        <h2 id="get-title">Help the right people find you and take the next step.</h2>
        <ul className="s-recipes">
          <li><strong>Pages that explain your offer</strong><span>A Launch Page or a fuller website gives visitors a clear way to enquire, book or buy.</span><a href="/prices#websites">See page and website options →</a></li>
          <li><strong>Follow-up that keeps a conversation moving</strong><span>Reply to enquiries, remind people about quotes and make booking straightforward with connected tools.</span><a href="/prices#systems">See automation and software options →</a></li>
          <li><strong>Show work you have already done</strong><span>Keep your website, Google listing and social posts current using approved photos and project details.</span><a href={MANAGED_PRESENCE.href}>{MANAGED_PRESENCE.name} →</a></li>
        </ul>
      </section>

      <section className="s-section" id="serve-customers" aria-labelledby="serve-title">
        <p className="eyebrow">02 · Serve customers</p>
        <h2 id="serve-title">Make it easier to book, get an answer and know what happens next.</h2>
        <ul className="s-recipes">
          <li><strong>Bookings and reminders</strong><span>Let customers choose a time, receive confirmation and get a reminder before an appointment.</span><a href="/prices#systems">Explore customer workflows →</a></li>
          <li><strong>Calls answered when you are busy</strong><span>Give callers a way to ask common questions and leave details for you to follow up.</span><a href={AFTER_HOURS.href}>{AFTER_HOURS.name} →</a></li>
          <li><strong>Complaints insight and staff workflows</strong><span>Review anonymised cases, make reporting easier to read and turn an agreed process into practical staff guides.</span><a href="/complaints-improvement">Professional complaints services and synthetic examples →</a></li>
        </ul>
      </section>

      <section className="s-section" id="keep-improve" aria-labelledby="improve-title">
        <p className="eyebrow">03 · Keep &amp; Improve</p>
        <h2 id="improve-title">Keep the system useful as your business changes.</h2>
        <ul className="s-recipes">
          <li><strong>Care after a build</strong><span>Get checks, fixes and a defined amount of monthly improvements, if you want ongoing help.</span><a href="/prices#care">Compare care options →</a></li>
          <li><strong>Reporting you can act on</strong><span>See what is happening in your enquiries, bookings or complaint records, then agree a practical next step.</span><a href="/complaints-improvement">See complaints reporting examples →</a></li>
          <li><strong>Real work, clear limits</strong><span>Review published product and client work, with honest notes about what each example does and does not show.</span><a href="/proof">Open the proof page →</a></li>
        </ul>
      </section>

      <section className="s-section" id="why" aria-labelledby="how-title">
        <p className="eyebrow">Clear scope, first</p><h2 id="how-title">Choose the next useful job.</h2>
        <p>One task can start with {OFFERS[0].price}. Larger work gets a written scope and a fixed quote before building. See it working before you pay. Professional complaints engagements are quoted to scope.</p>
        <h3>How I set it up</h3>
        <ul className="s-recipes">
          <li><strong>Built on what you already use</strong><span>Your booking app, email, calendar or accounts software.</span></li>
          <li><strong>I never need your passwords</strong><span>You add me as a user. Every account stays in your name.</span></li>
          <li><strong>What you own at the end</strong><span>The agreed build, plus a short guide to what runs and what to do if something changes.</span></li>
          <li><strong>What I need from you</strong><span>The job to solve, access as a user to the relevant tools, and examples to check it works.</span></li>
        </ul>
        <div className="s-actions"><a className="button button-signal" href="/free-plan?src=what-we-do#leak-check-form">{MAIN_CTA}</a><a className="text-link" href="/prices">See prices and what is included →</a><a className="text-link" href="/contact?src=what-we-do">Something else? Tell me about it →</a></div>
      </section>
      <SiteFooter />
    </main>
  );
}
