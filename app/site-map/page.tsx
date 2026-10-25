import { fitDescription } from '../seo';
import type { Metadata } from 'next';
import { Breadcrumbs } from '../breadcrumbs';
import { NAV_GROUPS } from '../nav';
import { OG_IMAGE } from '../seo';
import { SiteFooter, SiteHeader } from '../site-chrome';

export const metadata: Metadata = {
  title: 'Site map',
  description: fitDescription('Every page on the Maz Works site in one list: what I do, prices, my work, tools and demos, guides by trade, and help.'),
  alternates: { canonical: '/site-map' },
  openGraph: { title: 'Site map — Maz Works', url: '/site-map', images: [OG_IMAGE] },
};

const EXTRA_GROUPS = [
  {
    title: 'Get started',
    links: [
      { href: '/contact', label: 'Free preview, enquiries and bigger jobs' },
    ],
  },
  {
    title: 'More of my work',
    links: [
      { href: '/proof#built', label: 'Internal projects' },
      { href: '/rotareason', label: 'RotaReason (internal project)' },
      { href: '/maz-core', label: 'MAZ Core (private console)' },
      { href: '/maz-pocket-ai', label: 'MAZ Pocket (private bridge)' },
      { href: '/complaints/sample/health-check', label: 'Sample complaints health check (invented data)' },
      { href: '/complaints/sample/board-report', label: 'Sample complaints board report (invented data)' },
    ],
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
