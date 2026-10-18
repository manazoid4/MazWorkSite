import { fitDescription } from '../seo';
import type { Metadata } from 'next';
import { SiteFooter, SiteHeader } from '../site-chrome';
import { SITE_URL } from '../site';

export const metadata: Metadata = {
  title: 'Other builds',
  description: fitDescription('Products, prototypes, open-source tools and a client website built by Manazir Hussain, founder of Maz Works.'),
  alternates: { canonical: `${SITE_URL}/lab` },
};

const PROJECTS = [
  { name: 'JobFilter', type: 'My own product · built and launched', summary: 'Finds public contracts that suit small trades firms.', links: [{ label: 'Case study', href: '/work/jobfilter' }, { label: 'Try it', href: 'https://jobfilter.uk/find-jobs' }] },
  { name: 'Scrap Finance Partners', type: 'Client website', summary: 'A website for a specialist finance practice.', links: [{ label: 'Case study', href: '/work/scrap-finance-partners' }, { label: 'View site', href: 'https://scrap-finance-partners.vercel.app' }] },
  { name: 'Agent Nudge', type: 'Released', summary: 'Stops coding tools clashing over the same files.', links: [{ label: 'Try the demo', href: 'https://agent-nudge-bay.vercel.app/demo/overview' }, { label: 'View code', href: 'https://github.com/manazoid4/agent-nudge' }] },
  { name: 'OpenFlowKit', type: 'Open source', summary: 'Voice-to-text in the browser, cleaned up for you.', links: [{ label: 'Try it', href: 'https://openflowkit-dusky.vercel.app' }] },
  { name: 'Khutba.io', type: 'Live prototype', summary: 'Live translated captions for mosque screens.', links: [{ label: 'Try the demo', href: 'https://khutba-io.vercel.app/demo' }] },
  { name: 'MAZ Pocket', type: 'In progress', summary: 'A pocket device to talk to your PC and approve its actions.', links: [{ label: 'Ask about this build', href: '/contact?service=software#contact' }] },
  { name: 'Maz Works Objects', type: 'Concept · not yet made', summary: 'Tap-to-review stands and signs, fixed price from £29.', links: [{ label: 'See the concept', href: '/3d-printing' }] },
];

export default function LabPage() {
  return (
    <main className="s-home">
      <SiteHeader />
      <section className="s-hero s-hero-short" id="main-content" tabIndex={-1} aria-labelledby="lab-title">
        <p className="eyebrow">Other builds</p>
        <h1 id="lab-title">Products and tools I’ve built.</h1>
        <p className="s-lede">Products, prototypes and open-source tools. Each is labelled with what it really is. Want something like this? <a href="/contact">Tell me what you need</a>.</p>
      </section>
      <section className="s-section" aria-label="Projects">
        <ul className="s-lab">
          {PROJECTS.map((project) => (
            <li key={project.name}>
              <span className="relationship">{project.type}</span>
              <h2>{project.name}</h2>
              <p>{project.summary}</p>
              <p className="s-lab-links">{project.links.map((link) => <a href={link.href} key={link.href}>{link.label} <span aria-hidden="true">→</span></a>)}</p>
            </li>
          ))}
        </ul>
        <p className="s-small">Want to see a private working preview of an idea first? <a href="/demos">How the free preview works →</a></p>
      </section>
      <SiteFooter />
    </main>
  );
}
