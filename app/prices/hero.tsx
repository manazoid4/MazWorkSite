import { CHECK_REPLY_TIME, VAT_NOTE } from '../site';
import { FREE_STEP, OFFERS } from '../offers';

const split = (price: string) => {
  const match = price.match(/^(From )?(.*)$/);
  return { from: match?.[1] ? 'From' : '', amount: match?.[2] ?? price };
};

/** The price ladder as a staircase: read from the offers, so no number is typed here. */
function Ladder() {
  const [starter, system, custom] = OFFERS;
  const steps = [
    { name: FREE_STEP.name.split(' & ')[0], note: 'Start here', price: FREE_STEP.price, href: '/free-plan?src=prices-ladder#leak-check-form', tone: 'yellow', h: 34 },
    { name: starter.name, note: 'One job', price: starter.price, href: '#offer-starter', tone: 'pink', h: 54 },
    { name: system.name, note: 'Three, joined up', price: system.price, href: '#offer-business-system', tone: 'orange', h: 76 },
    { name: custom.name, note: 'Built for you', price: custom.price, href: '#offer-custom', tone: 'lilac', h: 100 },
  ];
  return (
    <div className="pz-ladder-wrap">
      <svg className="pz-ladder-arrow" viewBox="0 0 120 80" aria-hidden="true" focusable="false">
        <path d="M6 14 C 40 2, 78 10, 96 52" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M80 50 L97 56 L104 38" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <ol className="pz-ladder" id="ladder" aria-label="From the free preview to custom software">
        {steps.map((step, index) => {
          const { from, amount } = split(step.price);
          return (
            <li key={step.name} style={{ ['--h' as string]: `${step.h}%`, ['--i' as string]: index }}>
              <a className={`pz-step pz-${step.tone}`} href={step.href}>
                <span className="pz-step-note">{step.note}</span>
                <span className="pz-step-name">{step.name}</span>
                <span className="pz-step-price">{from ? <small>{from}</small> : null}{amount}</span>
              </a>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export function Hero() {
  return (
    <section className="pz-band pz-hero" id="main-content" tabIndex={-1} aria-labelledby="prices-title">
      <div className="pz-hero-copy">
        <h1 id="prices-title">Let’s <em>fix</em> what’s slowing your business down.</h1>
        <p className="pz-lede">Websites, customer journeys, practical software and steady improvements, built around the problem you actually have. Every price is on this page, and the scope is agreed in writing before any work starts.</p>
        <div className="pz-actions">
          <a className="button button-signal s-button-lg" href="/free-plan?src=prices-hero#leak-check-form">Get my free preview</a>
          <a className="pz-textlink" href="#pricing">Jump to the prices <span aria-hidden="true">↓</span></a>
        </div>
        <p className="pz-fine">Start with a {FREE_STEP.short}, back within {CHECK_REPLY_TIME}. You pay once you’ve seen it working. {VAT_NOTE}</p>
      </div>
      <Ladder />
    </section>
  );
}
