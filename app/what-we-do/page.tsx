import type { Metadata } from 'next';
import { SiteFooter, SiteHeader } from '../site-chrome';
import { CHANGES_WINDOW, NEXT_STEPS, OFFERS, workingBy } from '../offers';
import { CHECK_REPLY_TIME, MAIN_CTA } from '../site';
import { SampleReport } from '../sample-report';
import { ScrollReveal } from '../scroll-reveal';
import { ServiceSchema } from '../service-schema';
import { SystemExplorer } from '../system-explorer';
import { DeliveryTabs } from '../delivery-tabs';
import { StickyCheckCta } from '../sticky-cta';
export const metadata: Metadata = {
 title: 'What we do: systems that work for you',
 description: 'See how enquiries, bookings and follow-ups work together. Three packages, clear prices, and a free preview for your business.',
 alternates: {canonical:'/what-we-do'},
};
export default function WhatWeDo() {
 return <main className="s-home"><SiteHeader /><ServiceSchema path="/what-we-do" />
  <section className="s-hero s-hero-short" id="main-content" tabIndex={-1}>
   <p className="eyebrow">What we do</p><h1>The systems your business runs on.</h1>
   <p className="s-lede">Enquiries answered. Bookings confirmed. Follow-ups sent. Less chasing for you.</p>
   <div className="s-actions"><a className="button button-signal s-button-lg" href="/free-plan#leak-check-form">{MAIN_CTA}</a></div>
   <nav className="s-actions" aria-label="Choose a package">{OFFERS.map(offer=><a className="button" key={offer.id} href={`#${offer.id}`}>{offer.name} · {offer.price}</a>)}</nav>
  </section>
  <section className="s-section" id="packages" aria-labelledby="packages-title"><p className="eyebrow">Three sizes of job</p><h2 id="packages-title">Pick the size, see the price.</h2>
   <ul className="s-recipes">{OFFERS.map((offer)=><li key={offer.id} id={offer.id}><strong>{offer.name}</strong><b>{offer.price}</b><span>{offer.body}</span><small>Working by: {workingBy(offer.id)}.</small></li>)}</ul>
  </section>
  <p className="s-section s-small"><a href="/prices">See every price, add-on and what’s not included →</a></p>
  <section className="s-section" id="systems"><p className="eyebrow">Tasks you can hand over</p><h2>Pick a task. Watch it run.</h2>
   <p>Use the tools you already have where possible. Anything bigger gets a fixed quote first.</p>
   <SystemExplorer />
  </section>
  <section className="s-section" id="process"><p className="eyebrow">From free preview to live</p><h2>How it works.</h2>
   <ol className="mw-qw-list">{NEXT_STEPS.map((step) => <li key={step.day}><strong>{step.day}: {step.title}.</strong> {step.body}</li>)}</ol>
   <p className="s-small">Want to see it first? Bigger jobs can start with a <a href="/demos">free preview</a>.</p>
   <DeliveryTabs />
   <p><a className="s-details-link" href="/prices#next">{CHANGES_WINDOW.name}, what’s included and the cost calculator →</a></p>
  </section>
  <section className="s-section" id="example"><h2>An example of the scope sheet and price you get.</h2><SampleReport /></section>
  <section className="s-final"><h2>Start with the job that costs you time.</h2><p>A personal reply, usually within {CHECK_REPLY_TIME}.</p><a className="button button-signal" href="/free-plan#leak-check-form">{MAIN_CTA}</a></section>
  <SiteFooter /><StickyCheckCta href="/free-plan#leak-check-form" /><ScrollReveal />
 </main>;
}
