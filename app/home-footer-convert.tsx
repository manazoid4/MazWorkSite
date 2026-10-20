import { DemoRequestForm } from './demo-request-form';
import { CHECK_REPLY_TIME, CONTACT_EMAIL } from './site';

export function HomeFooterConvert() {
  return (
    <section className="mw-home-footer-convert" aria-labelledby="home-enquiry-title">
      <div className="mw-home-footer-copy">
        <h2 id="home-enquiry-title">You know your business. Let’s work out what would help.</h2>
        <p>A website idea, an awkward process or a problem you haven’t quite pinned down? Start there. You don’t need to know the technical answer.</p>
        <p>I usually reply within {CHECK_REPLY_TIME}. Scope and price are agreed before work starts.</p>
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
      </div>
      <div className="mw-home-footer-form">
        <DemoRequestForm
          kicker="Just your name, email and what you need."
          problemPlaceholder="For example: New enquiries get missed, the same task keeps being repeated, or customers are unsure what to do next."
        />
      </div>
    </section>
  );
}
