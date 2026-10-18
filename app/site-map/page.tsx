import { fitDescription } from '../seo';
import type { Metadata } from 'next';
import { Breadcrumbs } from '../breadcrumbs';
import { NAV_GROUPS } from '../nav';
import { CASE_STUDY_PROJECTS } from '../projects';
import { OG_IMAGE } from '../seo';
import { SiteFooter, SiteHeader } from '../site-chrome';

export const metadata: Metadata = {
  title: 'Site map',
  description: fitDescription('Every page on the Maz Works site in one list: packages and prices, trade guides, objects, work and help.'),
  alternates: { canonical: '/site-map' },
  openGraph: { title: 'Site map — Maz Works', url: '/site-map', images: [OG_IMAGE] },
};

const EXTRA_GROUPS = [
  {
    title: 'Get started',
    links: [
      { href: '/free-plan', label: 'Get my free preview' },
      { href: '/contact', label: 'Bigger jobs and contact' },
      { href: '/demos', label: 'Bigger build demos' },
      { href: '/whats-new', label: 'What’s new' },
    ],
  },
  {
    title: 'Work',
    links: CASE_STUDY_PROJECTS.map((project) => ({ href: `/work/${project.id}`, label: project.name })),
  },
];

export default function SiteMapPage() {
  const groups = [...NAV_GROUPS, ...EXTRA_GROUPS];
  return (
    <main>
      <SiteHeader />
      <section className="mw-resource-hero" id="main-content" tabIndex={-1} aria-labelledby="sitemap-title">
        <Breadcrumbs items={[{ label: 'Site map' }]} />
        <p className="eyebrow">Site map</p>
        <h1 id="sitemap-title">Every page, in one list.</h1>
      </section>
      <div className="mw-sitemap">
        {groups.map((group) => (
          <section key={group.title} aria-label={group.title}>
            <h2>{group.title}</h2>
            <ul>
              {group.links.map((link) => <li key={link.href}><a href={link.href}>{link.label}</a></li>)}
            </ul>
          </section>
        ))}
      </div>
      <SiteFooter />
    </main>
  );
}
