import type { Metadata } from 'next';
import { SiteFooter, SiteHeader } from '../site-chrome';
import { OFFERS } from '../offers';
import { SITE_URL } from '../site';
import { ServiceSchema } from '../service-schema';
import { SERVICE_AREAS } from './areas';

export const metadata: Metadata = {
  title: 'What I do: websites, follow-up, booking, tools',
  description: 'I find the jobs that keep eating your week, then build something practical to fix them: a website, follow-up, booking, or a small custom tool.',
  alternates: { canonical: `${SITE_URL}/what-we-do` },
};

export default function WhatWeDo() {
  return (
    <main className="s-home">
      <SiteHeader /><ServiceSchema path="/what-we-do" />
      <section className="s-hero s-hero-short" id="main-content" tabIndex={-1} aria-labelledby="what-title">
        <p className="eyebrow">What I do</p>
        <h1 id="what-title">I find the problem that keeps coming back, then build a way to make it easier.</h1>
        <p className="s-lede">Most businesses have a few jobs that eat time or lose customers. I work out which one costs you most and build something small and practical to fix it.</p>
      </section>

      <section className="s-section" id="areas" aria-labelledby="areas-title">
        <h2 id="areas-title">Four things I can help with</h2>
        <p>Pick the one that sounds like your week. If none does, <a href="/contact">just tell me the problem</a>.</p>
        <ol className="s-recipes">
          {SERVICE_AREAS.map((area) => (
            <li key={area.id} id={area.id}>
              <strong>{area.title}</strong>
              <span><em>{area.problem}</em> {area.what}</span>
              <span>{area.examples.join('. ')}.</span>
              <span><strong>{area.priceLine}</strong></span>
              <span>{area.links.map((link, index) => <span key={link.href}>{index ? ' · ' : ''}<a href={link.href}>{link.label}</a></span>)}</span>
            </li>
          ))}
        </ol>
        <p className="s-small">Photo to quote is one example of the kind of tool I mean, not a ready-made product. It starts as a conversation about your jobs.</p>
      </section>

      <section className="s-section" id="side" aria-labelledby="side-title">
        <h2 id="side-title">A small side project: 3D printing</h2>
        <p>Separate from everything above, I am developing small 3D-printed objects, such as tap-to-review stands for a counter. It is still a concept, with its own page: <a href="/3d-printing">see the 3D printing page</a>.</p>
      </section>

      <section className="s-section" id="who" aria-labelledby="who-title">
        <h2 id="who-title">Who I work with</h2>
        <p><a href="/local-businesses">Local businesses</a> that want fewer missed calls and less chasing. For a new site, see <a href="/website-design">website design options</a>. <a href="/professional-teams">Professional teams</a> that need to see what is due and what keeps going wrong. Or <a href="/for">find your kind of business</a>.</p>
      </section>

      <section className="s-section" id="why" aria-labelledby="how-title">
        <h2 id="how-title">How I set it up</h2>
        <p>One task can start with {OFFERS[0].price}. Larger work gets a written scope and a fixed quote before building. See it working before you pay.</p>
        <ul className="s-recipes">
          <li><strong>Built on what you already use</strong><span>Your booking app, email, calendar or accounts software.</span></li>
          <li><strong>I never need your passwords</strong><span>You add me as a user. Every account stays in your name.</span></li>
          <li><strong>What you own at the end</strong><span>The agreed build, plus a short guide to what runs and what to do if something changes.</span></li>
          <li><strong>What I need from you</strong><span>The job to solve, access as a user to the relevant tools, and examples to check it works.</span></li>
        </ul>
        <p className="s-actions"><a className="button button-signal" href="/contact?src=what-we-do#contact">Tell me what is not working</a> <a className="text-link" href="/prices">See the prices <span aria-hidden="true">→</span></a></p>
      </section>
      <SiteFooter />
    </main>
  );
}
