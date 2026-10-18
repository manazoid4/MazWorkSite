import { FooterConvert } from './footer-convert';
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
        <a className="mw-nav-cta" href="/free-plan?src=nav#leak-check-form">Free preview</a>
      </nav>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer mw-site-footer mw-footer-clean">
      <FooterConvert />

      {/* Minimal on purpose (Maz, 15 Oct): one hook, a short line of links. Every page link lives in the menu and on /site-map. */}
      <div className="mw-footer-brand">
        <p className="mw-footer-hook">Every enquiry answered. Every booking confirmed. You stay on the job.</p>
        <span>Automation, connected tools and custom software for UK small businesses, by Manazir Hussain. <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a></span>
      </div>

      <nav className="mw-footer-links" aria-label="Footer">
        <a href="/prices">Prices</a>
        <a href="/what-we-do">How it works</a>
        <a href="/for">Who it’s for</a>
        <a href="/proof">Proof</a>
        <a href="/faq">FAQ</a>
        <a href="/refer">Refer a business</a>
        <a href="/work/scrap-finance-partners">Client work</a>
        <a href="/contact">Contact</a>
      </nav>

      <div className="mw-footer-bottom">
        <span>© 2026 Maz Works · <a href="/site-map">Site map</a> · <a href="/terms">Terms</a> · <a href="/privacy">Privacy</a> · <a href={LINKEDIN_URL} target="_blank" rel="noreferrer">LinkedIn ↗</a></span>
        <span>Fixed quotes · No VAT added · <a href="/3d-printing">Objects</a> · <a href="/lab">Lab</a> · <a className="mw-back-top" href="#main-content">Back to top ↑</a></span>
      </div>
    </footer>
  );
}
