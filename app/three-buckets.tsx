import './three-buckets.css';
import { OFFERS, getOffer } from './offers';

type Bucket = {
  number: string;
  id: string;
  name: string;
  purpose: string;
  problem: string;
  examples: string[];
  href: string;
  link: string;
  art: 'find' | 'serve' | 'improve';
};

const BUCKETS: Bucket[] = [
  {
    number: '01',
    id: 'get-customers',
    name: 'Get customers',
    purpose: 'Help the right people find you and choose your business.',
    problem: '“People can’t find me online.”',
    examples: ['Websites and landing pages', 'Google visibility', 'Video and content'],
    href: '/local-businesses#find-customers',
    link: 'Ways to get found',
    art: 'find',
  },
  {
    number: '02',
    id: 'serve-customers',
    name: 'Serve customers',
    purpose: 'Make it easier to reply, book and follow up.',
    problem: '“I’m on the job when the phone rings.”',
    examples: ['Enquiries and missed calls', 'Bookings and reminders', 'Quotes and follow-ups'],
    href: '/local-businesses#serve-customers',
    link: 'Make the busy bits easier',
    art: 'serve',
  },
  {
    number: '03',
    id: 'keep-improve',
    name: 'Keep & improve',
    purpose: 'Use feedback and reporting to understand what needs to improve.',
    problem: '“I need to see what needs attention.”',
    examples: ['Dashboards, KPIs and deadlines', 'Customer feedback and complaints', 'Improvement actions'],
    href: '/professional-teams',
    link: 'See insight and improvement work',
    art: 'improve',
  },
];

const CUSTOMER_JOURNEY = [
  {
    title: 'Get Customers',
    description: 'Help people find you, understand what you offer and take the next step.',
    link: 'Websites, visibility & enquiries',
    href: '/local-businesses#find-customers',
    art: 'find' as const,
  },
  {
    title: 'Serve Customers',
    description: 'Make bookings, replies and follow-ups easier to manage, even on your busiest days.',
    link: 'Bookings, communication & workflows',
    href: '/local-businesses#serve-customers',
    art: 'serve' as const,
  },
  {
    title: 'Keep & Improve',
    description: 'See where work gets stuck, spot recurring problems and make better-informed decisions.',
    link: 'Reporting, processes & software',
    href: '/professional-teams#demonstrations',
    art: 'improve' as const,
  },
];

function JourneyArt({ kind }: { kind: Bucket['art'] }) {
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
        <path className="mw-journey-accent" d="M39 82h19V66H39zm32 0h19V54H71zm32 0h19V41h-19z" />
        <circle className="mw-journey-badge" cx="143" cy="36" r="17" />
        <path className="mw-journey-stroke" d="m135 36 6 6 11-13M14 109h141" />
      </>}
    </svg>
  );
}

function HomeCustomerJourney() {
  return (
    <section className="mw-bucket-section mw-bucket-journey" id="customer-buckets" aria-labelledby="mw-buckets-title">
      <header className="mw-journey-heading">
        <h2 id="mw-buckets-title">Help at every part of the customer journey.</h2>
        <p>A better website is sometimes the answer. Sometimes it’s what happens after someone gets in touch.</p>
      </header>
      <ol className="mw-journey-grid">
        {CUSTOMER_JOURNEY.map((item) => (
          <li className="mw-journey-item" key={item.title}>
            <JourneyArt kind={item.art} />
            <h3>{item.title}</h3>
            <p>{item.description}</p>
            <a href={item.href}>{item.link}<span aria-hidden="true"> ↗</span></a>
          </li>
        ))}
      </ol>
    </section>
  );
}

function BucketArt({ kind }: { kind: Bucket['art'] }) {
  return (
    <svg className={`mw-bucket-art is-${kind}`} viewBox="0 0 180 142" aria-hidden="true" focusable="false">
      <path className="mw-bucket-handle" d="M51 53c0-27 17-42 39-42s39 15 39 42" />
      <path className="mw-bucket-body" d="M37 49h106l-12 78H49z" />
      <path className="mw-bucket-rim" d="M32 48h116v12H32z" />
      {kind === 'find' && <g className="mw-bucket-content"><circle cx="73" cy="82" r="8" /><circle cx="104" cy="93" r="8" /><circle cx="78" cy="111" r="6" /><path d="M91 74v25m-8-8 8 8 8-8" /></g>}
      {kind === 'serve' && <g className="mw-bucket-content"><rect x="58" y="72" width="63" height="15" rx="2" /><rect x="58" y="94" width="63" height="15" rx="2" /><path d="M66 79h21m-21 22h36" /></g>}
      {kind === 'improve' && <g className="mw-bucket-content"><path d="m63 105 18-18 13 8 24-26" /><path d="M104 69h14v14" /><circle cx="63" cy="105" r="4" /><circle cx="81" cy="87" r="4" /><circle cx="94" cy="95" r="4" /></g>}
      <path className="mw-bucket-ground" d="M20 132h140" />
    </svg>
  );
}

export function ThreeBuckets({ compact = false, showPrices = false }: { compact?: boolean; showPrices?: boolean }) {
  if (!compact && !showPrices) return <HomeCustomerJourney />;

  return (
    <section className={`mw-bucket-section${compact ? ' is-compact' : ''}`} id="customer-buckets" aria-labelledby="mw-buckets-title">
      <header className="mw-bucket-heading">
        <p className="eyebrow">One purpose, three ways to help</p>
        <h2 id="mw-buckets-title">Making businesses better, one problem at a time.</h2>
        <p>Find customers, look after them and work out what needs to improve.</p>
      </header>
      <ol className="mw-bucket-grid">
        {BUCKETS.map((bucket) => (
          <li className="mw-bucket-card" key={bucket.number} id={bucket.id}>
            <div className="mw-bucket-card-top"><span>{bucket.number} / 03</span><BucketArt kind={bucket.art} /></div>
            <h3>{bucket.name}</h3>
            <p className="mw-bucket-purpose">{bucket.purpose}</p>
            <p className="mw-bucket-problem">{bucket.problem}</p>
            <ul>{bucket.examples.map((example) => <li key={example}>{example}</li>)}</ul>
            {showPrices && bucket.id === 'get-customers' && <p className="mw-bucket-price">{getOffer('creator-launch').name} {getOffer('creator-launch').price} · Website {getOffer('website').price}</p>}
            {showPrices && bucket.id === 'serve-customers' && <p className="mw-bucket-price">{OFFERS[0].name} {OFFERS[0].price} · {OFFERS[1].name} {OFFERS[1].price}</p>}
            {showPrices && bucket.id === 'keep-improve' && <p className="mw-bucket-price">Reporting and improvement: quoted to scope</p>}
            <a href={bucket.href}>{bucket.link} <span aria-hidden="true">→</span></a>
            {showPrices && <a className="mw-bucket-price-link" href={bucket.id === 'get-customers' ? '/prices#websites' : bucket.id === 'serve-customers' ? '/prices#systems' : '/prices#keep-improve'}>{bucket.id === 'keep-improve' ? 'Reporting and improvement are quoted to scope' : 'See prices and what’s included'}</a>}
          </li>
        ))}
      </ol>
      {showPrices && <p className="mw-bucket-support">Need someone to look after the systems after they’re built? <a href="/prices#extras">See optional care and maintenance support</a>.</p>}
    </section>
  );
}
