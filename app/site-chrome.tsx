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
        <svg className="brand-mark" viewBox="0 0 48 48" aria-hidden="true"><defs><clipPath id="mw-tile"><rect width="48" height="48" rx="12" /></clipPath></defs><rect width="48" height="48" rx="12" fill="#653e58"/><g clipPath="url(#mw-tile)"><polygon points="2,2 10,2 10,10 2,10" fill="#9683ff"/><polygon points="6,0.34 11.66,6 6,11.66 0.34,6" fill="#9683ff"/><circle cx="6" cy="6" r="1.36" fill="#653e58"/><polygon points="38,2 46,2 46,10 38,10" fill="#9683ff"/><polygon points="42,0.34 47.66,6 42,11.66 36.34,6" fill="#9683ff"/><circle cx="42" cy="6" r="1.36" fill="#653e58"/><polygon points="2,38 10,38 10,46 2,46" fill="#9683ff"/><polygon points="6,36.34 11.66,42 6,47.66 0.34,42" fill="#9683ff"/><circle cx="6" cy="42" r="1.36" fill="#653e58"/><polygon points="38,38 46,38 46,46 38,46" fill="#9683ff"/><polygon points="42,36.34 47.66,42 42,47.66 36.34,42" fill="#9683ff"/><circle cx="42" cy="42" r="1.36" fill="#653e58"/><polygon points="14,14 34,14 34,34 14,34" fill="#fbf8f2"/><polygon points="24,9.86 38.14,24 24,38.14 9.86,24" fill="#fbf8f2"/><circle cx="24" cy="24" r="3.4" fill="#653e58"/></g></svg>
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
