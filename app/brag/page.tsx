import type { Metadata } from 'next';
import { SiteFooter, SiteHeader } from '../site-chrome';
import { MAIN_CTA } from '../site';
import './brag.css';

export const metadata: Metadata = {
  title: 'Maz Works · 20-second film (preview)',
  description: 'A short Maz Works film: missed call, automatic reply, request captured. Illustrative workflow, not client results.',
  robots: { index: false, follow: false },
};

export default function BragPreview() {
  return (
    <main className="brag-page" id="main-content" tabIndex={-1}>
      <SiteHeader />
      <div className="brag-top">
        <div className="brag-headline">
          <p className="eyebrow">Maz Works / The 20-second film</p>
          <h1>Less chasing. <em>More doing.</em></h1>
          <p className="brag-lede">A quick look at what one connected customer workflow could do. Built in the Maz Works house style, with a real demonstration flow rather than invented customer results.</p>
        </div>
        <span className="brag-issue">FILM 001 <span>↗</span> 2026</span>
      </div>

      <section className="brag-premiere" aria-labelledby="brag-premiere-title">
        <div className="brag-premiere-label"><h2 id="brag-premiere-title">The film</h2><span>20 SEC / 16:9 / MOTION PREVIEW</span></div>
        <div className="brag-screen">
          <iframe title="Maz Works 20-second brand film — animated transcript provided below" loading="eager" src="/promo/brag/scene.html" allow="autoplay" />
        </div>
        <div className="brag-below">
          <p><strong>What you&apos;re watching:</strong> an illustrative missed-call flow, followed by independently verifiable work. No real customer data or guaranteed results are shown.</p>
          <a href="/promo/brag/scene.html" target="_blank" rel="noopener noreferrer">Open film fullscreen ↗</a>
        </div>
      </section>

      <section className="brag-materials" aria-labelledby="brag-materials-title">
        <div>
          <p className="eyebrow">The share kit</p>
          <h2 id="brag-materials-title">One film. <em>Three ways to use it.</em></h2>
          <p>Bring the film to founder meetups on a laptop, pair it with a physical NFC Proof Pass, or post the prepared short copy with the finished render. The sample workflow should never be described as a completed client installation.</p>
          <a className="button button-signal" href="/free-plan?src=brag-preview#leak-check-form">{MAIN_CTA}</a>
        </div>
        <div className="brag-kit-list">
          <div><span>01</span><strong>Show it</strong><p>Use the 20-second loop at a business or tech meetup. No sound is required to understand it.</p></div>
          <div><span>02</span><strong>Make it personal</strong><p>Tap an NFC Proof Pass to the existing free-demo form. Agree just one bounded example with the person.</p></div>
          <div><span>03</span><strong>Follow through</strong><p>Show a working test example or an honest storyboard, then a clear fixed quote for any real installation.</p></div>
        </div>
      </section>

      <section className="brag-copy" aria-labelledby="brag-copy-title">
        <p className="eyebrow">Post-ready writing</p>
        <h2 id="brag-copy-title">The caption</h2>
        <blockquote>
          A missed call shouldn&apos;t mean a missed opportunity. Here&apos;s an example of the kind of simple, connected system I build at Maz Works: a helpful reply, a customer request, and a clear next step. Built independently, with a working demo before any quote becomes a job.
        </blockquote>
        <p className="brag-disclaimer">Film made from a code-rendered illustrative workflow. Proof shown here is a concept, not a client result. Read the <a href="/work/jobfilter">JobFilter product</a> and <a href="/work/scrap-finance-partners">Scrap Finance Partners work</a> separately for published work examples.</p>
      </section>
      <SiteFooter />
    </main>
  );
}
