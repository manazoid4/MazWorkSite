import type { ReactNode } from 'react';
import { FooterConvert } from './footer-convert';
import { NavLinks } from './nav-links';
import { SiteMenu } from './site-menu';
import { CONTACT_EMAIL } from './site';
import { NAV_CTA } from './nav';
import './site-footer.css';

// Hard-coded: nav.ts belongs to another builder.
const FOOTER_LINKS = [['What I do', '/what-we-do'], ['Prices', '/prices'], ['Proof', '/proof'], ['About', '/about'], ['Contact', '/contact'], ['FAQ', '/faq'], ['Privacy', '/privacy'], ['Terms', '/terms']];

export function SiteHeader() {
  return (
    <header className="site-header mw-site-header">
      <a className="brand" href="/">
        <span className="brand-mark">MW</span>
        <span><strong>Maz Works</strong><small>Manazir Hussain</small></span>
      </a>
      <nav aria-label="Primary navigation">
        <NavLinks />
        <SiteMenu />
        <a className="mw-nav-cta" href="/contact?src=nav#contact">{NAV_CTA.label}</a>
      </nav>
    </header>
  );
}

export function SiteFooter({ conversion }: { conversion?: ReactNode } = {}) {
  return (
    <footer className="site-footer mw-site-footer mw-footer-clean">
      {conversion ?? <FooterConvert />}

      {/* Short on purpose (Maz, round 1A): one row of links plus the email. Every other page lives in the menu and on /site-map. */}
      <nav className="mw-footer-links" aria-label="Footer">
        {FOOTER_LINKS.map(([label, href]) => <a key={href} href={href}>{label}</a>)}
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
      </nav>
      <p className="mw-footer-bottom">© 2026 Maz Works · Fixed quotes · Not VAT-registered</p>
    </footer>
  );
}
