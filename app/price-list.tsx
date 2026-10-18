import { AFTER_HOURS, ALWAYS_INCLUDED, AUTOMATION_MENU, BUY_LINKS, CARE_PLANS, COMPARISON, DELIVERY_PROMISE, EXTRA_GROUPS, LADDER, LANES, MANAGED_PRESENCE, NOT_INCLUDED, OFFERS, RUNNING_COSTS_NOTE, runningCost, OWN_VS_RENT, PACKAGE_VALUE, PRICE_MATCH, formatPrice, PROMISES, STARTER_GUARANTEE, UPGRADE_CREDITS, type Offer } from './offers';
import { PackageLink } from './package-link';
import { NextSteps, TweaksTimeline } from './explainers';
import { CostCalculator } from './cost-calculator';
import { SystemBuilder } from './system-builder';
import { ChangesWindow } from './demo-path';
import { MAIN_CTA } from './site';
import { SolutionsPicker } from './solutions/solutions-picker';

/** Only offers with a configured Stripe payment link show "Buy now". */
export function BuyNow({ name }: { name: string }) {
  const href = BUY_LINKS[name];
  if (!href) return null;
  return <>
    {name === AFTER_HOURS.name ? <p className="s-small">Already heard your demo? Subscribe below. Your first month is charged at checkout.</p> : null}
    <a className="button button-dark s-buy-now" href={href} rel="noopener">Buy now</a>
  </>;
}

/** One package card with its full spec folded away, so phones stay short. */
export function OfferCard({ offer, checkHref }: { offer: Offer; checkHref: string }) {
  return (
    <article className={`s-price${offer.tag ? ' s-price-main' : ''}`} id={`offer-${offer.id}`}>
      {offer.tag ? <p className="s-price-tag">{offer.tag}</p> : null}
      <h3>{offer.name}</h3>
      <p className="s-price-amount">{offer.price}</p>
      <p>{offer.body}</p>
      <p className="s-small"><strong>Best for:</strong> {offer.forWho}</p>
      <p className="s-small"><strong>Running costs:</strong> {runningCost(offer)}</p>
      <p className="s-price-guarantee"><strong>What you’ll see working:</strong> {offer.successCheck}</p>
      <details className="s-offer-spec">
        <summary>What’s included, and what isn’t</summary>
        <dl className="s-price-facts">
          <div><dt>Time</dt><dd>{offer.delivery}</dd></div>
          <div><dt>You pay</dt><dd>{offer.payment}</dd></div>
        </dl>
        <PartsValue offer={offer} />
        {offer.guarantee ? <p className="s-price-guarantee"><strong>Promise:</strong> {offer.guarantee}</p> : null}
        <p><strong>Included</strong></p>
        <ul>{offer.includes.map((item) => <li key={item}>{item}</li>)}</ul>
        <p><strong>Always included</strong></p>
        <ul>{ALWAYS_INCLUDED.map((item) => <li key={item.title}>{item.title}</li>)}</ul>
        <p><strong>Not included</strong></p>
        <ul>{offer.excludes.map((item) => <li key={item}>{item}</li>)}</ul>
        <p><strong>Changes:</strong> {offer.changes}</p>
        <p><strong>Next step:</strong> {offer.upsell}</p>
      </details>
      <PackageLink href={checkHref} pick={offer.name}>Get my free preview <span aria-hidden="true">→</span></PackageLink>
      <BuyNow name={offer.name} />
    </article>
  );
}

/** "Bought one by one: £865" under the price, from the prices in offers.ts (Offer v12). */
function PartsValue({ offer }: { offer: Offer }) {
  const value = PACKAGE_VALUE[offer.id];
  if (!value || value.total <= offer.from) return null;
  return <p className="s-price-value">Bought one by one: <s>{formatPrice(value.total)}</s> <span>({value.parts.map((part) => part.label).join(', ')})</span></p>;
}

/** The fix ladder: five rungs, same for every kind of business. */
export function Ladder() {
  return (
    <ol className="s-ladder" aria-label="The fix ladder">
      {LADDER.map((rung, index) => (
        <li key={rung.step} style={{ ['--i' as string]: index }}>
          <a href={rung.href}><strong>{rung.step}</strong><span>{rung.what}</span><b>{rung.price}</b></a>
        </li>
      ))}
    </ol>
  );
}

/** What every package gets, said once. */
export function AlwaysIncluded() {
  return (
    <ul className="s-always" aria-label="Always included">
      {ALWAYS_INCLUDED.map((item) => <li key={item.title}><strong>{item.title}</strong><span>{item.body}</span></li>)}
    </ul>
  );
}

/** Own it once vs rent it monthly. */
export function OwnVsRent() {
  return (
    <div className="s-own" id="own-vs-rent">
      <h3>Own it, or rent it?</h3>
      <p className="s-small">Agencies rent the same missed-call text-back, and pay-monthly websites, by the month. Here it’s yours after one payment.</p>
      <table>
        <thead><tr><th scope="col"><span className="s-visually-hidden">Row</span></th><th scope="col">Maz Works</th><th scope="col">Monthly agency</th></tr></thead>
        <tbody>{OWN_VS_RENT.map((row) => <tr key={row.row}><th scope="row">{row.row}</th><td className="s-own-yes">{row.own}</td><td>{row.rent}</td></tr>)}</tbody>
      </table>
      <p className="s-small">Monthly figures are UK list prices seen in October 2026, not a quote from any one company.</p>
    </div>
  );
}

/** The 16 tasks "automation" means. */
export function AutomationMenu({ checkHref, only }: { checkHref: string; only?: string[] }) {
  const jobs = only ? AUTOMATION_MENU.filter((job) => only.includes(job.id)) : AUTOMATION_MENU;
  return (
    <ul className="s-menu" id="menu" aria-label="Automation menu">
      {jobs.map((job) => (
        <li key={job.id}><strong>{job.name}</strong><span>{job.what}</span><PackageLink href={checkHref} pick={OFFERS[0].name}>Start with this <span aria-hidden="true">→</span></PackageLink></li>
      ))}
    </ul>
  );
}

/**
 * The full price list: the ladder, three lanes with every package and its
 * spec, the automation menu, the systems comparison, quick fixes and add-ons,
 * own-vs-rent, care plans and what's not included.
 * Lives on /prices so the homepage can stay a short page that sells one first step.
 */
/** A folded section on /prices (audit 2 Oct: lanes first, everything else one tap away). */
function Fold({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <details className="s-fold" id={id}>
      <summary>{title}</summary>
      <div>{children}</div>
    </details>
  );
}

export function PriceList({ checkHref }: { checkHref: string }) {
  return (
    <>
      <h3 className="s-track-title">One-off or monthly</h3>
      <p className="s-small"><a href="#systems">One-off prices</a> · <a href="#monthly">Monthly services</a></p>
      <h3 className="s-track-title" id="need">What problem do you want gone?</h3>
      <SolutionsPicker startOpen={false} firstSelected={false} />

      <span id="systems" />
      <h3 className="s-track-title" id="ladder">Four steps, one for every size of job</h3>
      <Ladder />

      {LANES.map((lane) => (
        <div key={lane.id}>
          {lane.id === 'websites' ? <span id="creators" /> : null}
          <h3 className="s-track-title" id={lane.id}>{lane.title}</h3>
          <p className="s-small">{lane.note}</p>
          <div className="s-prices">
            {lane.offers.map((offer) => <OfferCard offer={offer} checkHref={checkHref} key={offer.id} />)}
          </div>
        </div>
      ))}
      <span id="after-hours" />
      <h3 className="s-track-title" id="monthly">Monthly service</h3>
      <div className="s-prices">
        <article className="s-price" id="offer-managed-presence">
          <h3>{MANAGED_PRESENCE.name}</h3>
          <p className="s-price-amount">{MANAGED_PRESENCE.price}</p>
          <p>You send existing photos. I keep your website, Google and social posts current.</p>
          <details className="s-offer-spec">
            <summary>What’s included and how it works</summary>
            <p>{MANAGED_PRESENCE.body}</p>
            <p><strong>Best for:</strong> {MANAGED_PRESENCE.forWho}</p>
            <p><strong>What you’ll see each month:</strong> {MANAGED_PRESENCE.successCheck}</p>
            <p>{MANAGED_PRESENCE.terms}</p>
          </details>
          <a className="text-link" href={MANAGED_PRESENCE.href}>What’s included →</a>
          <a className="mw-service-link" href="/contact?service=managed-presence#contact">Ask about managed presence →</a>
        </article>
        <article className="s-price" id="offer-after-hours">
          <h3>{AFTER_HOURS.name}</h3>
          <p className="s-price-amount">{AFTER_HOURS.price}</p>
          <p>{AFTER_HOURS.body}</p>
          <details className="s-offer-spec">
            <summary>What’s included and how it works</summary>
            <p><strong>Best for:</strong> {AFTER_HOURS.forWho}</p>
            <p>{AFTER_HOURS.minutes} call minutes included. {AFTER_HOURS.setup}. {AFTER_HOURS.terms}</p>
            <p><strong>What you’ll hear first:</strong> {AFTER_HOURS.successCheck}</p>
          </details>
          <a className="text-link" href={AFTER_HOURS.href}>How it works <span aria-hidden="true">→</span></a>
          <PackageLink href={checkHref} pick={AFTER_HOURS.name}>Get my free preview <span aria-hidden="true">→</span></PackageLink>
          <BuyNow name={AFTER_HOURS.name} />
        </article>
      </div>
      <p className="s-small">{STARTER_GUARANTEE} {UPGRADE_CREDITS.join(' ')}</p>
      <p className="s-guarantee" id="price-match"><strong>UK price match.</strong> {PRICE_MATCH}</p>

      <Fold id="automation-menu" title="The automation menu: what each job does">
        <p className="s-small">A Starter is one of these. A Business System is three joined up, plus the weekly report.</p>
        <AutomationMenu checkHref={checkHref} />
      </Fold>

      <Fold id="always-included" title="Always included, whichever step you pick">
        <AlwaysIncluded />
        <ul className="s-promises" aria-label="Included with every package">
          {PROMISES.map((promise) => <li key={promise.title}><strong>{promise.title}</strong><span>{promise.body}</span></li>)}
        </ul>
        <div className="s-guarantee">
          <strong>Dates and upgrades.</strong> {DELIVERY_PROMISE} You own everything I build.
        </div>
        <div className="s-not-included">
          <h3>What’s not included</h3>
          <ul>{NOT_INCLUDED.map((item) => <li key={item}>{item}</li>)}</ul>
          <p className="s-small">{RUNNING_COSTS_NOTE}</p>
        </div>
      </Fold>

      <Fold id="compare" title="Compare the three packages">
        <div className="s-compare-scroll" tabIndex={0} role="region" aria-label="Package comparison table">
          <table>
            <thead>
              <tr><th scope="col"><span className="s-visually-hidden">What you get</span></th>{OFFERS.map((offer) => <th scope="col" key={offer.id}>{offer.name}</th>)}</tr>
            </thead>
            <tbody>
              {COMPARISON.map(({ row, values }) => (
                <tr key={row}><th scope="row">{row}</th>{values.map((value, index) => <td key={OFFERS[index].id}>{value}</td>)}</tr>
              ))}
            </tbody>
          </table>
        </div>
      </Fold>

      <Fold id="extras" title="Small set-ups, add-ons and care">
        <div className="s-extras">
          {EXTRA_GROUPS.map((group) => (
            <div className="s-extras-group" key={group.id} id={group.id}>
              <h4>{group.title}</h4>
              <p className="s-small">{group.note}</p>
              <ul>
                {group.items.map((extra) => <li key={extra.name}><div><strong>{extra.name}</strong><span>{extra.what}</span><PackageLink href={checkHref} pick={extra.name}>{MAIN_CTA} <span aria-hidden="true">→</span></PackageLink></div><strong className="s-extras-price">{extra.price}</strong></li>)}
              </ul>
            </div>
          ))}
          <div className="s-extras-care" id="care">
            <h4>After it’s built</h4>
            {CARE_PLANS.map((plan) => <p key={plan.id}><strong>{plan.name}, {plan.price}.</strong> {plan.body}</p>)}
          </div>
        </div>
      </Fold>

      <Fold id="numbers" title="What is it costing you now? Own it vs rent it">
        <CostCalculator />
        <OwnVsRent />
      </Fold>

      <Fold id="next" title="What happens next, and the 30 days of tweaks">
        <NextSteps />
        <TweaksTimeline />
        <ChangesWindow />
      </Fold>

      <Fold id="build" title="Build your own: tap your headaches, see the price">
        <SystemBuilder />
      </Fold>

    </>
  );
}
