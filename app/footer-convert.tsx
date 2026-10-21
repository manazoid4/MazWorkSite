import { NewsletterSignup } from './newsletter-signup';
import { ENQUIRY_CTA } from './site';

/**
 * The last thing every visitor scrolls past, so it asks one question ("which one
 * are you?") and then shows only their world: their line, their example video,
 * a tagged demo link and the mailing list. The pick is remembered on this device.
 */
export function FooterConvert() {
  return (
    <div className="mw-footer-convert">
      <div className="mw-footer-pick">
        <p className="eyebrow">Start with what’s not working</p>
        <p className="mw-footer-ask">You don’t need to name the right service.</p>
        <p className="mw-footer-line">Tell me what happens today and what you would like to change. I’ll read it myself and reply with a sensible next step.</p>
        <p className="mw-footer-actions">
          <a className="button button-signal" href="/contact?src=footer-convert#contact">{ENQUIRY_CTA}</a>
          <a className="text-link" href="/contact?src=footer-convert">See how the free preview works</a>
        </p>
      </div>
      <NewsletterSignup
        id="footer-signup"
        source="footer"
        title="Not ready to talk yet?"
        text="One email a month: a practical business improvement and how it works."
      />
    </div>
  );
}
