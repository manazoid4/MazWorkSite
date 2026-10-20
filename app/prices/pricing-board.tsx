import { AFTER_HOURS, CARE_PLANS, MANAGED_PRESENCE, OFFERS, CREATOR_OFFERS, WEB_OFFERS, PRICE_MATCH, STARTER_GUARANTEE, UPGRADE_CREDITS, type Offer } from '../offers';
import { PackageLink } from '../package-link';
import { BuyNow, OfferSpec } from '../price-list';

const CHECK = '/free-plan';

const split = (price: string) => {
  const match = price.match(/^(From )?(.*)$/);
  return { from: match?.[1] ? 'From' : '', amount: match?.[2] ?? price };
};

function Price({ price, unit }: { price: string; unit: string }) {
  const { from, amount } = split(price);
  return <p className="pz-price">{from ? <small>{from}</small> : null}<span>{amount}</span><em>{unit}</em></p>;
}

type Slot = { offer: Offer; kind: string; tone: string; span: string; anchor?: string };

function OneOff({ offer, kind, tone, span, anchor }: Slot) {
  return (
    <article className={`pz-card pz-${tone} ${span}`} id={`offer-${offer.id}`}>
      {anchor ? <span className="pz-anchor" id={anchor} /> : null}
      <p className="pz-kind">{kind}</p>
      <h3>{offer.name}</h3>
      <Price price={offer.price} unit="one-off" />
      <p className="pz-body">{offer.body}</p>
      <ul className="pz-list">{offer.bullets.map((item) => <li key={item}>{item}</li>)}</ul>
      <p className="pz-for"><b>Useful for</b> {offer.forWho}</p>
      <PackageLink href={CHECK} pick={offer.name} className="pz-link">Start with this<span className="s-visually-hidden">: {offer.name}</span> <span aria-hidden="true">→</span></PackageLink>
      <OfferSpec offer={offer} />
    </article>
  );
}

/** One-off builds: mixed widths so the small jobs, the joined-up system and the bespoke build each read differently. */
export function OneOffBoard() {
  const [starter, system, custom] = OFFERS;
  const [creatorStarter, launch] = CREATOR_OFFERS;
  const [website] = WEB_OFFERS;
  const slots: Slot[] = [
    { offer: starter, kind: 'Automation', tone: 'yellow', span: 'pz-s5' },
    { offer: system, kind: 'Automation, joined up', tone: 'cobalt', span: 'pz-s7' },
    { offer: creatorStarter, kind: 'For creators', tone: 'pink', span: 'pz-s4', anchor: 'creators' },
    { offer: launch, kind: 'One page', tone: 'lilac', span: 'pz-s4', anchor: 'websites' },
    { offer: website, kind: 'Five pages', tone: 'orange', span: 'pz-s4' },
  ];
  return (
    <>
      <div className="pz-board" id="systems">
        {slots.map((slot) => <OneOff key={slot.offer.id} {...slot} />)}
      </div>
      <article className="pz-card pz-custom" id={`offer-${custom.id}`}>
        <div className="pz-custom-head">
          <p className="pz-kind">Custom software · quoted to fit</p>
          <h3>{custom.name}</h3>
          <Price price={custom.price} unit="one-off, in signed-off stages" />
          <PackageLink href={CHECK} pick={custom.name} className="pz-link">Start with this<span className="s-visually-hidden">: {custom.name}</span> <span aria-hidden="true">→</span></PackageLink>
        </div>
        <div className="pz-custom-body">
          <p className="pz-body">{custom.body}</p>
          <ul className="pz-list">{custom.bullets.map((item) => <li key={item}>{item}</li>)}</ul>
          <p className="pz-for"><b>Useful for</b> {custom.forWho}</p>
          <OfferSpec offer={custom} />
        </div>
      </article>
      <p className="pz-note">{STARTER_GUARANTEE} {UPGRADE_CREDITS.join(' ')}</p>
      <p className="pz-note pz-match" id="price-match"><strong>UK price match.</strong> {PRICE_MATCH}</p>
    </>
  );
}

/** Monthly services: rounder, dashed and unshadowed, so they never read as a build. */
export function MonthlyBoard() {
  const [care, plus] = CARE_PLANS;
  const first = (text: string) => text.split('. ')[0] + '.';
  return (
    <div className="pz-monthly" id="monthly">
      <span className="pz-anchor" id="after-hours" />
      <article className="pz-ticket pz-pink" id="offer-after-hours">
        <p className="pz-kind">Every month · cancel any time</p>
        <h3>{AFTER_HOURS.name}</h3>
        <Price price={AFTER_HOURS.price} unit={`plus ${AFTER_HOURS.setup}`} />
        <p className="pz-body">{AFTER_HOURS.body}</p>
        <ul className="pz-list">{AFTER_HOURS.included.slice(0, 4).map((item) => <li key={item.title}>{item.title}</li>)}</ul>
        <p className="pz-for"><b>Useful for</b> {AFTER_HOURS.forWho}</p>
        <div className="pz-row">
          <a className="pz-link" href={AFTER_HOURS.href}>How it works <span aria-hidden="true">→</span></a>
          <PackageLink href={CHECK} pick={AFTER_HOURS.name} className="pz-link">Start with this<span className="s-visually-hidden">: {AFTER_HOURS.name}</span> <span aria-hidden="true">→</span></PackageLink>
        </div>
        <details className="s-offer-spec">
          <summary>What’s included and how it works</summary>
          <p>{AFTER_HOURS.minutes} call minutes included. {AFTER_HOURS.setup}. {AFTER_HOURS.terms}</p>
          <p><strong>What you’ll hear first:</strong> {AFTER_HOURS.successCheck}</p>
          <p><strong>Promise:</strong> {AFTER_HOURS.guarantee}</p>
          <p><strong>Everything included</strong></p>
          <ul>{AFTER_HOURS.included.map((item) => <li key={item.title}>{item.title}: {item.body}</li>)}</ul>
          <p><strong>Not included</strong></p>
          <ul>{AFTER_HOURS.notIncluded.map((item) => <li key={item}>{item}</li>)}</ul>
        </details>
        <BuyNow name={AFTER_HOURS.name} />
      </article>

      <article className="pz-ticket pz-yellow" id="offer-managed-presence">
        <p className="pz-kind">Every month · cancel with a month’s notice</p>
        <h3>{MANAGED_PRESENCE.name}</h3>
        <Price price={MANAGED_PRESENCE.price.replace(/\/month$/, '')} unit="a month" />
        <p className="pz-body">{MANAGED_PRESENCE.body}</p>
        <ul className="pz-list">{MANAGED_PRESENCE.included.slice(0, 4).map((item) => <li key={item.title}>{item.title}</li>)}</ul>
        <p className="pz-for"><b>Useful for</b> {MANAGED_PRESENCE.forWho}</p>
        <div className="pz-row">
          <a className="pz-link" href={MANAGED_PRESENCE.href}>What’s included <span aria-hidden="true">→</span></a>
          <a className="pz-link" href="/contact?service=managed-presence#contact">Ask about managed presence <span aria-hidden="true">→</span></a>
        </div>
        <details className="s-offer-spec">
          <summary>What’s included and how it works</summary>
          <p><strong>What you’ll see each month:</strong> {MANAGED_PRESENCE.successCheck}</p>
          <ul>{MANAGED_PRESENCE.included.map((item) => <li key={item.title}>{item.title}: {item.body}</li>)}</ul>
          <p><strong>Not included</strong></p>
          <ul>{MANAGED_PRESENCE.notIncluded.map((item) => <li key={item}>{item}</li>)}</ul>
          <p>{MANAGED_PRESENCE.terms}</p>
        </details>
      </article>

      <article className="pz-ticket pz-lilac pz-care" id="care">
        <p className="pz-kind">After it’s built · optional</p>
        <h3>Care plans</h3>
        <ul className="pz-care-list">
          <li><span>{care.name}</span><b>{care.price}</b><p>{first(care.body)}</p></li>
          <li><span>{plus.name}</span><b>{plus.price}</b><p>{first(plus.body)}</p></li>
        </ul>
        <details className="s-offer-spec">
          <summary>What each plan covers</summary>
          {CARE_PLANS.map((plan) => <p key={plan.id}><strong>{plan.name}, {plan.price}.</strong> {plan.body}</p>)}
        </details>
      </article>
    </div>
  );
}
