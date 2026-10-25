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
        <svg className="brand-mark" viewBox="0 0 48 48" aria-hidden="true"><polygon points="9,9 39,9 39,39 9,39" fill="#FF6A1F" /><polygon points="24,2.79 45.21,24 24,45.21 2.79,24" fill="#FF6A1F" /><circle cx="24" cy="24" r="4.8" fill="currentColor" /></svg>
        <span><strong>MAZ WORKS</strong><small>Manazir Hussain</small></span>
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
