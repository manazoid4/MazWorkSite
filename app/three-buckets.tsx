import './three-buckets.css';
import { CARE_PLANS, OFFERS, getOffer } from './offers';

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
    purpose: 'Understand what keeps going wrong and make the work better.',
    problem: '“We keep hearing the same complaint.”',
    examples: ['Customer feedback and reviews', 'Complaints insight', 'Reporting and improvement'],
    href: '/complaints-improvement',
    link: 'Improve the customer experience',
    art: 'improve',
  },
];

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
            {showPrices && bucket.id === 'keep-improve' && <p className="mw-bucket-price">Care {CARE_PLANS[0].price} or {CARE_PLANS[1].price} · Complaints quoted to scope</p>}
            <a href={bucket.href}>{bucket.link} <span aria-hidden="true">→</span></a>
            {showPrices && <a className="mw-bucket-price-link" href={bucket.id === 'get-customers' ? '/prices#websites' : bucket.id === 'serve-customers' ? '/prices#systems' : '/prices#care'}>See prices and what’s included</a>}
          </li>
        ))}
      </ol>
    </section>
  );
}
