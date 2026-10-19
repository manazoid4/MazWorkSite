import { LINKEDIN_URL, PERSON_NAME } from './site';
import { B2B_SYSTEMS, COMPLAINT_PACKAGES, GHL_PARTNER, OFFERS, formatPrice, ghlThreeYearGbp } from './offers';
import './b2b.css';

/**
 * The founder credential, worded exactly as the rest of the site words it
 * (see ManazirLine and /proof). Do not add dates, employers or case numbers here.
 */
export function FounderTrust() {
  return (
    <div className="b2b-founder">
      <img src="/maz.webp" alt={`${PERSON_NAME}`} width={72} height={72} />
      <p><strong>{PERSON_NAME}</strong>. Computer Science graduate (Swansea University), then five years in complaints and finance, including regulated work and ombudsman cases. I know what a complaint looks like from the other side of the desk, so the systems I build handle the awkward cases as well as the easy ones. I build every job myself.</p>
    </div>
  );
}

export function FounderMoat() {
  return (
    <section className="b2b-wrap" aria-labelledby="moat-title">
      <h2 id="moat-title">Why an ex-finance complaints specialist builds your systems</h2>
      <FounderTrust />
      <ul className="b2b-grid is-three">
        <li><strong>Careful logic</strong><span>Five years of regulated complaint work teaches you to ask “what if it goes wrong?” first. Each system is tested on the awkward cases before it goes live.</span></li>
        <li><strong>You own it</strong><span>Accounts and data are in your name, with a written guide. No platform rent, and no lock-in if you stop working with me.</span></li>
        <li><strong>Proper foundations</strong><span>A Computer Science degree (Swansea University) and plain, tested builds rather than a pile of fragile hacks.</span></li>
      </ul>
      <p className="b2b-fine"><a href={LINKEDIN_URL}>Maz Works on LinkedIn</a></p>
    </section>
  );
}

/** The practice lane on /prices: single tasks versus joined-up systems, and what renting a platform costs over three years. */
export function PracticeTier() {
  const [starter, system, custom] = OFFERS;
  return (
    <section className="s-section" id="practices" aria-labelledby="practices-title">
      <p className="eyebrow">For agencies and professional practices</p>
      <h2 id="practices-title">Two ways to start</h2>
      <details className="s-fold">
      <summary>Compare single tasks with joined-up systems, and owning with renting</summary>
      <div className="b2b-two">
        <div className="b2b-box">
          <h3>Single tasks and starters</h3>
          <p className="b2b-price">{starter.price}</p>
          <p>One repeat job automated, such as a follow-up or a reminder. Quick to start, and a good test of working together.</p>
        </div>
        <div className="b2b-box">
          <h3>Joined-up operations systems</h3>
          <p className="b2b-price">Business System: {system.price}</p>
          <p className="b2b-price">Custom Software: {custom.price}</p>
          <p className="b2b-fine">These are separate starting prices, not a combined price range.</p>
          <ul className="b2b-list">
            {COMPLAINT_PACKAGES.map((item) => <li key={item.id}>{item.name}: Quoted to scope</li>)}
            {B2B_SYSTEMS.map((item) => <li key={item.id}>{item.name}: Quoted to scope</li>)}
          </ul>
          <p className="b2b-fine"><a href="/b2b">More on the B2B page</a></p>
        </div>
      </div>
      <h3>Own it once, or rent it</h3>
      <div className="cx-table-wrap">
        <table className="cx-table">
          <caption className="s-visually-hidden">Owning a system compared with renting a platform</caption>
          <thead><tr><th scope="col"></th><th scope="col">Maz Works Business System</th><th scope="col">GoHighLevel partner</th></tr></thead>
          <tbody>
            <tr><th scope="row">Set-up</th><td>{system.price} once</td><td>from ${GHL_PARTNER.setupUsd}</td></tr>
            <tr><th scope="row">Monthly platform fee</th><td>None</td><td>from ${GHL_PARTNER.monthlyUsd}</td></tr>
            <tr><th scope="row">Over 3 years</th><td>{system.price}</td><td>about {formatPrice(ghlThreeYearGbp())}</td></tr>
            <tr><th scope="row">Who owns the accounts</th><td>You</td><td>Usually them</td></tr>
          </tbody>
        </table>
      </div>
      <p className="b2b-fine">GoHighLevel partner figures from gohighlevel.partners, checked 2 Oct 2026, converted at $1 = £0.75. The platforms do more than I would set up for you, so compare the job, not just the price.</p>
      </details>
    </section>
  );
}
