import { FooterConvert } from './footer-convert';
import { NAV_GROUPS } from './nav';
import { NavLinks } from './nav-links';
import { SiteMenu } from './site-menu';
import { CONTACT_EMAIL, LINKEDIN_URL } from './site';

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
        <a className="mw-nav-cta" href="/free-plan?src=nav#leak-check-form">Free demo</a>
      </nav>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer mw-site-footer mw-footer-clean">
      <FooterConvert />

      <div className="mw-footer-brand">
        <strong>Maz Works</strong>
        <span>Automation, connected tools and custom software for UK small businesses, by Manazir Hussain.</span>
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
      </div>

      <div className="mw-footer-groups">
        {NAV_GROUPS.map((group) => (
          <nav key={group.title} aria-label={group.title}>
            <p>{group.title}</p>
            {group.links.map((link) => <a key={link.href} href={link.href}>{link.label}</a>)}
          </nav>
        ))}
        <nav aria-label="Get started">
          <p>Get started</p>
          <a href="/demos">Free demo</a>
          <a href={`mailto:${CONTACT_EMAIL}?subject=Maz%20Works%20feedback`}>Feedback</a>
          <a href={LINKEDIN_URL} target="_blank" rel="noreferrer">LinkedIn ↗</a>
        </nav>
      </div>

      <div className="mw-footer-bottom">
        <span>© 2026 Maz Works · <a href="/site-map">Site map</a> · <a href="/terms">Terms</a> · <a href="/privacy">Privacy</a></span>
        <a className="mw-back-top" href="#main-content">Back to top ↑</a>
        <span>Fixed quotes · No VAT added</span>
      </div>
    </footer>
  );
}
