import type { Metadata } from 'next';
import { fitDescription, OG_IMAGE } from '../../seo';
import { SITE_URL } from '../../site';
import { SiteFooter, SiteHeader } from '../../site-chrome';
import { BookCall } from '../../booking-modal';
import { BusinessAssessment } from './assessment';
import '../../b2b.css';
import './assessment.css';

const PAGE_URL = `${SITE_URL}/b2b/assessment`;

export const metadata: Metadata = {
  title: 'Free business assessment',
  description: fitDescription('Six questions about how work moves through your business. See the admin hours, the first two fixes and what to do next before you share any contact details.'),
  alternates: { canonical: PAGE_URL },
  openGraph: { title: 'Free business assessment — Maz Works', description: fitDescription('Find the admin costing you most. Instant result, no contact details needed.'), url: PAGE_URL, type: 'website', images: [OG_IMAGE] },
};

const RETURN = [
  'A score showing where your operations are joined up and where they are held together by hand',
  'The hours a year your own answers point to, with the hourly value and planning assumption shown',
  'The first two jobs worth fixing, with a fixed starting price and what each one includes',
  'Three free fixes you can do this week without buying anything',
  'A plain-text summary you can send me for a written scope and fixed price, or keep for yourself',
];

export default function AssessmentPage() {
  return (
    <main>
      <SiteHeader />

      <section className="as-hero" id="main-content" tabIndex={-1} aria-labelledby="as-title">
        <p className="eyebrow">Free business assessment</p>
        <h1 id="as-title">Find the admin costing you most. In two minutes.</h1>
        <p>Six questions about how enquiries, documents, complaints, reporting and follow-up really work in your business. You get the result straight away, before you share a contact detail.</p>
        <div className="b2b-cta">
          <a className="button button-signal" href="#assessment">Start the free assessment</a>
          <BookCall className="button button-dark" interest="Business assessment">Book a 15-Minute Call</BookCall>
        </div>
        <p className="mw-hero-note">Instant result · no sign-up · built by Manazir Hussain, who does the work himself</p>
      </section>

      <section className="as-shell" id="assessment" aria-label="The free business assessment">
        <BusinessAssessment />
      </section>

      <section className="as-return" aria-labelledby="as-return-title">
        <p className="eyebrow">What you get back</p>
        <h2 id="as-return-title">Useful whether or not you hire me.</h2>
        <ul>
          {RETURN.map((item) => <li key={item}>{item}</li>)}
        </ul>
      </section>

      <section className="as-quiet" aria-label="Other ways to start">
        <p><a href="/b2b">← Back to the B2B page</a></p>
        <p>Not here for operations systems? <a href="/solutions">See all Maz Works services</a>.</p>
      </section>

      <SiteFooter />
    </main>
  );
}
