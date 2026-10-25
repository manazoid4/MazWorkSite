import type { ReactNode } from 'react';
import { FooterConvert } from './footer-convert';
import { NavLinks } from './nav-links';
import { SiteMenu } from './site-menu';
import { CONTACT_EMAIL } from './site';
import { FOOTER_LINKS, NAV_CTA } from './nav';
import './site-footer.css';

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

      {/* One row of links plus the email (list in nav.ts). Every other page is on /site-map. */}
      <nav className="mw-footer-links" aria-label="Footer">
        {FOOTER_LINKS.map(({ label, href }) => <a key={href} href={href}>{label}</a>)}
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
      </nav>
      <p className="mw-footer-bottom">© 2026 Maz Works · Fixed quotes · Not VAT-registered</p>
    </footer>
  );
}
