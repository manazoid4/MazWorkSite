import type { Metadata } from 'next';
import { SiteFooter, SiteHeader } from '../site-chrome';
import { CONTENT_DAY, CONTENT_DAY_BUNDLE } from '../offers';
import { OG_IMAGE, fitDescription } from '../seo';
import { MAIN_CTA, SITE_URL } from '../site';

const PAGE_URL = `${SITE_URL}${CONTENT_DAY.href}`;
const ENQUIRY_URL = '/contact?service=content-day#contact';
const CALL_URL = '/contact?service=content-day#contact';

const FAQS = [
  {
    q: 'What if the weather is bad?',
    a: 'The day is planned around the work, not the sun. Indoor, under cover or in the workshop still gives us the photos your site needs. If the whole day depends on being outside, we agree a backup date before you book.',
  },
  {
    q: 'Do I need to provide anything?',
    a: 'Just the business, the access and the people who are happy to be in the photos. You rent or buy nothing; the one price covers the day of shooting and all the editing.',
  },
  {
    q: 'How many photos do I get?',
    a: 'Every usable photo from the day is edited, not a set number held back. On a busy day that is a large set; on a quiet one it is smaller. You see the shots on the camera before I leave, so there are no surprises.',
  },
  {
    q: 'Can I use the photos anywhere?',
    a: 'Yes. Website, Google, social, print and ads, with no time limit and no extra charge for each use. I keep the copyright and ask to show a few in my own work.',
  },
  {
    q: 'Do you cover two days or come back?',
    a: 'Yes, and it costs less than the day rate twice. Tell me the plan and I will put a price in writing before you commit.',
  },
  {
    q: 'Who can be in the photos?',
    a: 'Whoever agrees to be. You tell me who is happy and any area to keep out, and I follow your site rules: sign-in, PPE and an escort where they are needed.',
  },
];

export const metadata: Metadata = {
  title: { absolute: 'Content Day: a day of photos for your business | Maz Works' },
  description: fitDescription(`One day with me: real photos and short clips of your work, edited and sorted for your website, Google and social. ${CONTENT_DAY.price}.`),
  alternates: { canonical: PAGE_URL },
  openGraph: { title: 'Content Day | Maz Works', description: CONTENT_DAY.body, url: PAGE_URL, type: 'website', images: [OG_IMAGE] },
};

export default function ContentDayPage() {
  return (
    <main>
      <SiteHeader />
      <section className="mw-resource-hero" id="main-content" tabIndex={-1} aria-labelledby="content-day-title">
        <p className="eyebrow">One day, one price</p>
        <h1 id="content-day-title">A day of real photos of your business, that actually get used.</h1>
        <p>{CONTENT_DAY.body} {CONTENT_DAY.forWho}</p>
        <p className="s-price-amount">{CONTENT_DAY.price}</p>
        <div className="mw-actions"><a className="button button-signal" href={ENQUIRY_URL}>Ask about a Content Day</a></div>
        <p className="mw-hero-note">{CONTENT_DAY.terms}</p>
      </section>

      <section className="mw-qw-section" aria-labelledby="content-day-what-title">
        <p className="eyebrow">What one day gives you</p>
        <h2 id="content-day-what-title">The whole day, the camera, and the editing.</h2>
        <p className="mw-qw-lead">{CONTENT_DAY.successCheck}</p>
        <ul className="mw-qw-list">{CONTENT_DAY.included.map(item => <li key={item.title}><strong>{item.title}</strong> {item.body}</li>)}</ul>
        <h3>The exact files</h3>
        <ul className="mw-qw-list">{CONTENT_DAY.formats.map(item => <li key={item}>{item}</li>)}</ul>
        <p className="mw-qw-lead">{CONTENT_DAY.turnaround}</p>
      </section>

      <section className="mw-qw-section" aria-labelledby="content-day-how-title">
        <p className="eyebrow">How the day runs</p>
        <h2 id="content-day-how-title">Every step, and when it happens.</h2>
        <ol className="mw-qw-list">{CONTENT_DAY.process.map(step => <li key={step.title}><strong>{step.title}</strong> <em>{step.when}</em>. {step.body}</li>)}</ol>
      </section>

      <section className="mw-qw-section" aria-labelledby="content-day-licence-title">
        <p className="eyebrow">What you can do with the photos</p>
        <h2 id="content-day-licence-title">Yours to use. No fuss.</h2>
        <ul className="mw-qw-list">{CONTENT_DAY.licence.map(item => <li key={item}>{item}</li>)}</ul>
        <h3>On the day</h3>
        <ul className="mw-qw-list">{CONTENT_DAY.onSite.map(item => <li key={item}>{item}</li>)}</ul>
      </section>

      <section className="mw-qw-section" aria-labelledby="content-day-bundle-title">
        <p className="eyebrow">The sensible pair</p>
        <h2 id="content-day-bundle-title">{CONTENT_DAY.name} and a page, {CONTENT_DAY_BUNDLE.price} the two.</h2>
        <p className="mw-qw-lead">{CONTENT_DAY_BUNDLE.body}</p>
        <ul className="mw-qw-list">
          <li><strong>{CONTENT_DAY.name}</strong> {CONTENT_DAY.price}: the full day and the edited set.</li>
          <li><strong>Launch Page</strong> built from the day’s photos, on your own domain, book or enquire in one tap.</li>
        </ul>
        <p className="mw-qw-lead">{CONTENT_DAY.repeat}</p>
        <div className="mw-actions"><a className="button button-signal" href={ENQUIRY_URL}>Ask about the pair</a><a className="text-link" href="/prices">See all prices →</a></div>
      </section>

      <section className="mw-qw-section" aria-labelledby="content-day-fit-title">
        <p className="eyebrow">Said plainly</p>
        <h2 id="content-day-fit-title">Not included</h2>
        <ul className="mw-qw-list">{CONTENT_DAY.notIncluded.map(item => <li key={item}>{item}</li>)}</ul>
      </section>

      <section className="s-section" aria-labelledby="content-day-faq-title">
        <p className="eyebrow">Questions</p>
        <h2 id="content-day-faq-title">What owners ask about a Content Day.</h2>
        <div className="s-faq">{FAQS.map(faq => <details key={faq.q}><summary>{faq.q}</summary><p>{faq.a}</p></details>)}</div>
        <p className="s-small">Photos are used only as agreed; more in the <a href="/privacy">privacy notice</a> and <a href="/terms">terms of work</a>.</p>
      </section>

      <section className="mw-resource-cta" id="content-day-cta" aria-labelledby="content-day-cta-title">
        <div>
          <p className="eyebrow">Next step</p>
          <h2 id="content-day-cta-title">Tell me the business, and I’ll say if a day is worth it.</h2>
          <p>If your photos are fine, I’ll tell you and save you the day. If they are holding you back, we pick a date and plan the shots that matter.</p>
        </div>
        <div className="mw-actions">
          <a className="button button-signal" href={ENQUIRY_URL}>Ask about a Content Day</a>
          <a className="button" href={CALL_URL}>Book a 15-minute call</a>
          <a className="button" href="/free-plan?src=content-day">{MAIN_CTA}</a>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
