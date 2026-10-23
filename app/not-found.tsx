import type { Metadata } from 'next';
import { SiteFooter, SiteHeader } from './site-chrome';

export const metadata: Metadata = { title: 'Page not found', robots: { index: false } };

const ROUTES = [
  { href: '/', label: 'Home', body: 'What I do and how it works.' },
  { href: '/prices', label: 'Prices', body: 'Packages, add-ons and what’s included.' },
  { href: '/for', label: 'Who it’s for', body: 'Trades, salons and clinics, creators and small offices.' },
  { href: '/contact', label: 'Free preview and fixed price', body: 'Tell me the job; get a working preview and a fixed price.' },
  { href: '/site-map', label: 'Site map', body: 'Every page in one list.' },
];

export default function NotFound() {
  return (
    <main>
      <SiteHeader />
      <section className="mw-resource-hero" id="main-content" tabIndex={-1} aria-labelledby="nf-title">
        <p className="eyebrow">Page not found</p>
        <h1 id="nf-title">That page has moved or never existed.</h1>
        <p>These are the pages most people are looking for.</p>
      </section>
      <ul className="mw-hub">
        {ROUTES.map((route) => (
          <li key={route.href}>
            <a href={route.href}><strong>{route.label}</strong><span className="mw-hub-go">{route.body}</span></a>
          </li>
        ))}
      </ul>
      <SiteFooter />
    </main>
  );
}
