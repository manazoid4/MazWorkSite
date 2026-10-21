import './three-buckets.css';
import { OFFERS, getOffer } from './offers';

type Art = 'find' | 'serve' | 'improve';

/** The one source for the three customer-journey buckets (home and /what-we-do). */
const BUCKETS: {
  id: string;
  title: string;
  description: string;
  link: string;
  href: string;
  art: Art;
  examples: string[];
  price: string;
  priceHref: string;
  priceLink: string;
}[] = [
  {
    id: 'get-customers',
    title: 'Get Customers',
    description: 'Help people find you, understand what you offer and take the next step.',
    link: 'Websites, visibility & enquiries',
    href: '/local-businesses#find-customers',
    art: 'find',
    examples: ['Websites and landing pages', 'Google visibility', 'Video and content'],
    price: `${getOffer('creator-launch').name} ${getOffer('creator-launch').price} · Website ${getOffer('website').price}`,
    priceHref: '/prices#websites',
    priceLink: 'See prices and what’s included',
  },
  {
    id: 'serve-customers',
    title: 'Serve Customers',
    description: 'Make bookings, replies and follow-ups easier to manage, even on your busiest days.',
    link: 'Bookings, communication & workflows',
    href: '/local-businesses#serve-customers',
    art: 'serve',
    examples: ['Enquiries and missed calls', 'Bookings and reminders', 'Quotes and follow-ups'],
    price: `${OFFERS[0].name} ${OFFERS[0].price} · ${OFFERS[1].name} ${OFFERS[1].price}`,
    priceHref: '/prices#systems',
    priceLink: 'See prices and what’s included',
  },
  {
    id: 'keep-improve',
    title: 'Keep & Improve',
    description: 'See where work gets stuck, spot recurring problems and make better-informed decisions.',
    link: 'Reporting, processes & software',
    href: '/professional-teams#demonstrations',
    art: 'improve',
    examples: ['Dashboards, KPIs and deadlines', 'Customer feedback and complaints', 'Improvement actions'],
    price: 'Reporting and improvement: quoted to scope',
    priceHref: '/prices#keep-improve',
    priceLink: 'See how reporting is priced',
  },
];

function JourneyArt({ kind }: { kind: Art }) {
  return (
    <svg className={`mw-journey-art is-${kind}`} viewBox="0 0 180 120" aria-hidden="true" focusable="false">
      {kind === 'find' && <>
        <path className="mw-journey-stroke" d="M23 49 38 25h82l15 24v54H30V49m-7 0h119M49 103V70h25v33m17-33h26v17H91" />
        <path className="mw-journey-accent" d="M38 25h82l15 24H23z" />
        <circle className="mw-journey-badge" cx="148" cy="39" r="17" />
        <path className="mw-journey-stroke" d="M148 30v18m-9-9h18M17 108h137" />
      </>}
      {kind === 'serve' && <>
        <rect className="mw-journey-stroke" x="27" y="27" width="91" height="75" rx="4" />
        <path className="mw-journey-stroke" d="M27 48h91M45 21v13m55-13v13M43 64h18m14 0h18M43 80h18" />
        <circle className="mw-journey-badge-blue" cx="145" cy="71" r="18" />
        <path className="mw-journey-stroke" d="m136 71 6 6 12-14" />
      </>}
      {kind === 'improve' && <>
        <rect className="mw-journey-stroke" x="23" y="28" width="111" height="72" />
        <path className="mw-journey-stroke" d="M78 100v9m-29 0h59M39 82h19V66H39zm32 0h19V54H71zm32 0h19V41h-19z" />
        <path className="mw-journey-bars" d="M39 82h19V66H39zm32 0h19V54H71zm32 0h19V41h-19z" />
        <circle className="mw-journey-badge-peach" cx="143" cy="36" r="17" />
        <path className="mw-journey-stroke" d="m135 36 6 6 11-13M14 109h141" />
      </>}
    </svg>
  );
}

/** Home shows the short version; /what-we-do passes `detailed` for what's included and prices. */
export function ThreeBuckets({ detailed = false }: { detailed?: boolean }) {
  return (
    <section className={`mw-bucket-section${detailed ? ' is-detailed' : ''}`} id="customer-buckets" aria-labelledby="mw-buckets-title">
      <header className="mw-journey-heading">
        <h2 id="mw-buckets-title">Help at every part of the customer journey.</h2>
        <p>A better website is sometimes the answer. Sometimes it’s what happens after someone gets in touch.</p>
      </header>
      <ol className="mw-journey-grid">
        {BUCKETS.map((item) => (
          <li className="mw-journey-item" key={item.id} id={detailed ? item.id : undefined}>
            <JourneyArt kind={item.art} />
            <h3>{item.title}</h3>
            <p>{item.description}</p>
            {detailed && (
              <>
                <ul className="mw-journey-included">{item.examples.map((example) => <li key={example}>{example}</li>)}</ul>
                <p className="mw-journey-price">{item.price}</p>
              </>
            )}
            <a href={item.href}>{item.link}<span aria-hidden="true"> ↗</span></a>
            {detailed && <a className="mw-journey-price-link" href={item.priceHref}>{item.priceLink}</a>}
          </li>
        ))}
      </ol>
      {detailed && <p className="mw-journey-support">Need someone to look after the systems after they’re built? <a href="/prices#extras">See optional care and maintenance support</a>.</p>}
    </section>
  );
}
