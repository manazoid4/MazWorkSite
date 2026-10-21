import { ENQUIRY_CTA, VAT_NOTE } from '../site';
import { FREE_STEP, OFFERS } from '../offers';

const split = (price: string) => {
  const match = price.match(/^(From )?(.*)$/);
  return { from: match?.[1] ? 'From' : '', amount: match?.[2] ?? price };
};

/** The price ladder as a staircase: read from the offers, so no number is typed here. */
function Ladder() {
  const [starter, system, custom] = OFFERS;
  const steps = [
    { name: FREE_STEP.name.split(' & ')[0], note: 'Start here', price: FREE_STEP.price, href: '/contact?intent=preview&src=prices-ladder#leak-check-form', tone: 'yellow', h: 34 },
    { name: starter.name, note: 'One job', price: starter.price, href: '#offer-starter', tone: 'pink', h: 54 },
    { name: system.name, note: 'Three, joined up', price: system.price, href: '#offer-business-system', tone: 'orange', h: 76 },
    { name: custom.name, note: 'Built for you', price: custom.price, href: '#offer-custom', tone: 'lilac', h: 100 },
  ];
  return (
    <ol className="pz-ladder" id="price-ladder" aria-label="From the free preview to custom software">
      {steps.map((step, index) => {
        const { from, amount } = split(step.price);
        return (
          <li key={step.name} style={{ ['--h' as string]: `${step.h}%`, ['--i' as string]: index }}>
            <a className={`pz-step pz-${step.tone}`} href={step.href}>
              <span className="pz-step-name">{step.name}</span>
              <span className="pz-step-price">{from ? <small>{from}</small> : null}{amount}</span>
            </a>
          </li>
        );
      })}
    </ol>
  );
}

/** Pop moment 1 on /prices: the cobalt band. Pop moment 2: the price bars inside it. */
export function Hero() {
  return (
    <section className="pz-hero" id="main-content" tabIndex={-1} aria-labelledby="prices-title">
      <div className="pz-hero-copy">
        <h1 id="prices-title">Prices for getting customers, serving them and improving.</h1>
        <p className="pz-lede">One-off work and optional monthly support. {VAT_NOTE}</p>
        <div className="pz-actions">
          <a className="button button-signal s-button-lg" href="/contact?src=prices#contact">{ENQUIRY_CTA}</a>
          <a className="pz-textlink" href="/what-we-do#serve-customers">See how it works <span aria-hidden="true">→</span></a>
        </div>
      </div>
      <Ladder />
    </section>
  );
}
