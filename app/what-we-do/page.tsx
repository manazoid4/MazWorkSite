import type { Metadata } from 'next';
import { SiteFooter, SiteHeader } from '../site-chrome';
import { OFFERS } from '../offers';
import { ENQUIRY_CTA, SITE_URL } from '../site';
import { ServiceSchema } from '../service-schema';
import { ThreeBuckets } from '../three-buckets';

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
        <div className="s-actions"><a className="button button-signal s-button-lg" href="/contact?src=what-we-do#contact">{ENQUIRY_CTA}</a><a className="text-link" href="/proof">See real work and evidence →</a></div>
      </section>
      <ThreeBuckets compact showPrices />

      <section className="s-section" id="why" aria-labelledby="how-title">
        <p className="eyebrow">Clear scope, first</p><h2 id="how-title">Choose the next useful job.</h2>
        <p>One task can start with {OFFERS[0].price}. Larger work gets a written scope and a fixed quote before building. See it working before you pay. Professional reporting and complaints engagements are quoted to scope.</p>
        <h3>How I set it up</h3>
        <ul className="s-recipes">
          <li><strong>Built on what you already use</strong><span>Your booking app, email, calendar or accounts software.</span></li>
          <li><strong>I never need your passwords</strong><span>You add me as a user. Every account stays in your name.</span></li>
          <li><strong>What you own at the end</strong><span>The agreed build, plus a short guide to what runs and what to do if something changes.</span></li>
          <li><strong>What I need from you</strong><span>The job to solve, access as a user to the relevant tools, and examples to check it works.</span></li>
        </ul>
        <div className="s-actions"><a className="button button-signal" href="/contact?src=what-we-do#contact">{ENQUIRY_CTA}</a><a className="text-link" href="/free-plan?src=what-we-do">See how the free preview works →</a><a className="text-link" href="/professional-teams">I work in a professional team →</a></div>
      </section>
      <SiteFooter />
    </main>
  );
}
