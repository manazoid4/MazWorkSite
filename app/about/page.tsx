import type { Metadata } from 'next';
import { SiteFooter, SiteHeader } from '../site-chrome';
import { CHECK_REPLY_TIME, SITE_URL } from '../site';
import './about.css';

export const metadata: Metadata = {
  title: 'About Maz',
  description: 'I studied Computer Science, then spent years handling financial complaints and escalations. Now I fix problems that keep coming back in small businesses.',
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
          <p className="s-lede">I run Maz Works on my own. You deal with me from the first message to the finished job.</p>
        </div>
      </section>

      <section className="mw-about-section" aria-labelledby="story-title">
        <h2 id="story-title">What I do, and why</h2>
        <p>I like finding the thing in a business that keeps going wrong, then building a practical way to make it easier.</p>
        <p>Sometimes that is a website. More often it is what happens after someone gets in touch: the missed call, the quote nobody chased, the booking that lives in a text thread.</p>
        <p>I am just starting out, and I would rather say so. In return you get my full attention, plain answers and a price agreed before any paid work.</p>
      </section>

      <section className="mw-about-section" aria-labelledby="background-title">
        <h2 id="background-title">Where I learned it</h2>
        <p>I am a Computer Science graduate (Swansea University).</p>
        <p>Before Maz Works I spent five years resolving complex financial complaints and handling customer escalations. The job was working out what had gone wrong, talking to people who were upset, and fixing the cause so it did not happen again.</p>
        <p>That is what I do for small businesses now, with software: dashboards and reporting, follow-up that happens on its own, and tools that take the awkward jobs off your plate.</p>
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

      <section className="mw-about-section" aria-labelledby="next-title">
        <h2 id="next-title">Want to talk?</h2>
        <p>Describe the problem in a few lines. You do not need to know what the fix is. <a href="/contact">Tell me what is not working</a>, or see <a href="/proof">my work</a> first.</p>
      </section>

      <SiteFooter />
    </main>
  );
}
