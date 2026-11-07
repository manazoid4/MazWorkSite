import type { Metadata } from 'next';
import { fitDescription, OG_IMAGE } from '../seo';
import { SITE_URL } from '../site';
import { SiteFooter, SiteHeader } from '../site-chrome';
import { CaseStudyGrid, TESTIMONIALS, TestimonialList } from '../proof-parts';
import './proof.css';

const PAGE_URL = `${SITE_URL}/proof`;

export const metadata: Metadata = {
  title: 'My work: live builds and Nod',
  description: fitDescription('See what I have built: JobFilter, a client website, and Nod, the pocket device I am developing. Live work and work in progress are labelled clearly.'),
  alternates: { canonical: PAGE_URL },
  openGraph: { title: 'My work | Maz Works', description: fitDescription('Live work you can open, and Nod in development.'), url: PAGE_URL, type: 'website', images: [OG_IMAGE] },
};

export default function ProofPage() {
  return (
    <main>
      <SiteHeader />
      <section className="mw-resource-hero" id="main-content" tabIndex={-1} aria-labelledby="proof-title">
        <p className="eyebrow">My work</p>
        <h1 id="proof-title">A few things worth showing.</h1>
        <p>Live work you can inspect, plus one project in development.</p>
      </section>

      <section className="mw-info" id="client-work" aria-labelledby="proof-live-title">
        <h2 id="proof-live-title">Live work</h2>
        <CaseStudyGrid />
      </section>

      <section className="mw-info" id="built" aria-labelledby="proof-built-title">
        <h2 id="proof-built-title">Currently building: Nod</h2>
        <p className="proof-intro">A pocket-sized device for speaking to your AI assistant and approving actions on a paired computer. It is an early hardware build, not a finished product.</p>
        <p><a className="rx-link" href="https://github.com/manazoid4/nod" target="_blank" rel="noopener noreferrer">See Nod's progress and source code <span aria-hidden="true">↗</span></a></p>
      </section>

      {TESTIMONIALS.length > 0 && (
        <section className="mw-info" aria-labelledby="proof-quotes-title">
          <h2 id="proof-quotes-title">What clients say</h2>
          <TestimonialList />
        </section>
      )}

      <section className="mw-info" aria-labelledby="proof-terms-title">
        <h2 id="proof-terms-title">Before you pay</h2>
        <ul className="proof-terms">
          <li><strong>Clear scope, fixed price.</strong> We agree on the work before it starts.</li>
          <li><strong>See it working.</strong> I show you the agreed solution before payment.</li>
          <li><strong>Your accounts, your data.</strong> The work runs in accounts you control, with a short guide.</li>
        </ul>
      </section>
      <SiteFooter />
    </main>
  );
}
