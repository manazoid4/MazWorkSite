import type { Metadata } from 'next';
import { SiteFooter, SiteHeader } from '../site-chrome';
import { CHECK_REPLY_TIME, SITE_URL } from '../site';
import './about.css';

export const metadata: Metadata = {
  title: 'About Maz',
  description: 'Maz is 26, ran thousands of finance complaints, and now builds websites, workflows and reporting for businesses. One person, start to finish.',
  alternates: { canonical: `${SITE_URL}/about` },
};

export default function AboutPage() {
  return (
    <main className="s-home mw-about">
      <SiteHeader />
      <section className="mw-about-hero" id="main-content" tabIndex={-1} aria-labelledby="about-page-title">
        <img src="/maz.webp" alt="Manazir Hussain, who scopes and builds the work" width={160} height={160} />
        <div>
          <p className="eyebrow">About me</p>
          <h1 id="about-page-title">Hi, I’m Maz.</h1>
          <p className="s-lede">I’m 26, and I run Maz Works on my own. You deal with me from the first message to the finished job.</p>
        </div>
      </section>

      <section className="mw-about-section" aria-labelledby="story-title">
        <h2 id="story-title">Why I started</h2>
        <p>I started my own business because I love fixing problems and helping businesses succeed. A website is only one piece of that.</p>
        <p>I want to be there for the whole journey: how people find you, how you reply to them, and how you spot what needs to get better.</p>
        <p>Before this I worked in finance, handling complaints. I spoke to thousands of angry customers. I know what it feels like when something goes wrong, and what a good reply does.</p>
        <p>I’m just starting out, and I’d rather say so. In return you get my full attention, plain answers and a price agreed before any paid work.</p>
      </section>

      <section className="mw-about-section" aria-labelledby="background-title">
        <h2 id="background-title">My background</h2>
        <p>I’m a Computer Science graduate. I spent five years resolving complex financial complaints and managing business accounts across the UK and Europe.</p>
        <p>Now I build websites, automations and practical software, including dashboards and reporting, so customers can reach you and your day-to-day work gets easier.</p>
      </section>

      <section className="mw-about-section" aria-labelledby="how-title">
        <h2 id="how-title">How I work</h2>
        <ul className="mw-about-list">
          <li><strong>One person.</strong> I plan it and build it myself. No hand-offs.</li>
          <li><strong>Scope and price first.</strong> You get a clear scope and a fixed price before any paid work.</li>
          <li><strong>Your tools, your accounts.</strong> I work with what you already use, and I never need your passwords.</li>
          <li><strong>Quick replies.</strong> I usually reply within {CHECK_REPLY_TIME}.</li>
        </ul>
      </section>

      <SiteFooter />
    </main>
  );
}
