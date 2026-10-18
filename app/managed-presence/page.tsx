import type { Metadata } from 'next';
import { SiteFooter, SiteHeader } from '../site-chrome';
import { MANAGED_PRESENCE } from '../offers';
import { OG_IMAGE, fitDescription } from '../seo';
import { SITE_URL } from '../site';

const PAGE_URL = `${SITE_URL}${MANAGED_PRESENCE.href}`;
const ENQUIRY_URL = '/contact?service=managed-presence#contact';

export const metadata: Metadata = {
  title: { absolute: 'Managed content and online presence | Maz Works' },
  description: fitDescription(`Turn your existing job photos and clips into useful website, Google and social updates. ${MANAGED_PRESENCE.price}; set-up included.`),
  alternates: { canonical: PAGE_URL },
  openGraph: { title: 'Managed presence | Maz Works', description: MANAGED_PRESENCE.body, url: PAGE_URL, type: 'website', images: [OG_IMAGE] },
};

export default function ManagedPresencePage() {
  return (
    <main>
      <SiteHeader />
      <section className="mw-resource-hero" id="main-content" tabIndex={-1} aria-labelledby="managed-title">
        <p className="eyebrow">Monthly service</p>
        <h1 id="managed-title">I keep your website, Google listing and social posts current.</h1>
        <p>{MANAGED_PRESENCE.body} You send the raw material and check the facts. I handle the rest of the agreed monthly work.</p>
        <p className="s-price-amount">{MANAGED_PRESENCE.price}</p>
        <div className="mw-actions"><a className="button button-signal" href={ENQUIRY_URL}>Ask about managed presence</a></div>
        <p className="mw-hero-note">{MANAGED_PRESENCE.terms}</p>
      </section>

      <section className="mw-qw-section" aria-labelledby="managed-work-title">
        <p className="eyebrow">What I take on</p>
        <h2 id="managed-work-title">One handoff from you. A month of useful updates.</h2>
        <p className="mw-qw-lead">A finished job can answer a buyer’s question in more than one place. I choose the usable material, write it up, and ask you to approve the facts before anything is published.</p>
        <ul className="mw-qw-list">{MANAGED_PRESENCE.included.map(item => <li key={item}>{item}</li>)}</ul>
      </section>

      <section className="mw-qw-section" aria-labelledby="managed-fit-title">
        <p className="eyebrow">Scope and fit</p>
        <h2 id="managed-fit-title">What you need to provide</h2>
        <p className="mw-qw-lead">Send photos or clips you have permission to use, a few facts about the work, and one person who can approve the monthly batch. If you have little suitable material, I’ll tell you before we agree a plan.</p>
        <h3>Quoted separately</h3>
        <ul className="mw-qw-list">{MANAGED_PRESENCE.notIncluded.map(item => <li key={item}>{item}</li>)}</ul>
        <p className="mw-qw-lead">{MANAGED_PRESENCE.successCheck} The exact channels and first month’s work go in a written scope before you pay.</p>
        <div className="mw-actions"><a className="button button-signal" href={ENQUIRY_URL}>Ask about managed presence</a><a className="text-link" href="/prices">See all prices →</a></div>
      </section>
      <SiteFooter />
    </main>
  );
}
