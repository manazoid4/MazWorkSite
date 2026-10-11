/**
 * The single source of truth for what Maz Works sells and what it costs.
 * Every page, the schema, the enquiry form and the tests read from here.
 * Never hard-code a price anywhere else.
 *
 * Positioning (Maz, 27 Sep 2026): Maz Works builds the systems small
 * businesses run on: automation, connected tools and custom software that win
 * customers and take admin off the owner. It is not a website-fix shop and not
 * a cheap web agency. Never describe it as "website repairs" or "small fixes".
 *
 * Offer v11 (2 Oct 2026, PROPOSED: prices need Maz's go before merge).
 * Built from the offer map and competitor teardown in the private handoff
 * folder `handoffs/2026-10-02-offer-v11/`. What changed and why:
 * - One fix ladder for every customer: Free demo £0 → One-day set-up £49 →
 *   Starter £149 → Business System from £595 → Custom from £2,450. A buyer
 *   picks their business type, sees their problems, then the step that fixes them.
 * - "Automation" is now a menu of 16 plain-English jobs (AUTOMATION_MENU).
 *   A Starter is one task from the menu; a Business System is three joined up
 *   plus the weekly report. No more guessing what automation means.
 * - Creators get their own two steps instead of three overlapping products:
 *   Creator Starter £149 (DM keyword → free resource → email list) and
 *   Creator Launch £595 (sales page + brand look + templates), replacing the
 *   £895 Sales Page, £595 Brand & Content Kit and £1,295 bundle.
 * - Prices came down (Starter £195→£149, System £795→£595, Custom £2,950→£2,450,
 *   Website £1,950→£1,495, Care £49/£195→£39/£149) because UK competitors sell
 *   missed-call text-back alone at ~£197 a month; we win on "own it once" and
 *   on visible value, not on being dear. Margin holds because every job is a
 *   templated recipe (docs/maz-works/OFFER-V11.md) and anything outside the
 *   menu is quoted or referred.
 * - Value that was always given but never shown is now on every card
 *   (ALWAYS_INCLUDED), plus five new items that cost ≤30 min per client
 *   once templated: walkthrough video, review QR card, 30-day check, written
 *   scope sheet before payment, and the "no working, no invoice" promise (9 Oct; was a money-back).
 * - Still true from v10: 30 days of tweaks (two rounds) + 90-day fix promise,
 *   never "unlimited"; one invoice when the client has seen it working; jobs of
 *   £1,000+ billed in stages; never "half now, half later".
 *
 * Offer v12 (2 Oct 2026, PROPOSED in a draft PR: Maz merges to approve).
 * Same headline prices, clearer and more in each box (Maz: "creator pricing
 * and website pricing are completely different"; "a lot more value"):
 * - One ladder for everyone. Creators use the same steps as every business:
 *   Starter £149 (theirs is comment-to-get-it) and Launch Page £595.
 * - Pages add up: a Launch Page is one page; a Website is a Launch Page plus
 *   four more pages (same inclusions), so £1,495 is visibly less than
 *   £595 + 4 × £295.
 * - Every package includes free one-day set-ups (Starter 2, bigger packages 3),
 *   because those are the items free tools and £30 gigs undercut on their own.
 * - Business System adds team training and a first month of Keep It Running,
 *   so it is clearly cheaper than buying the parts (PACKAGE_VALUE).
 * Competitor check behind it: docs/maz-works/PRICE-AUDIT-2026-10.md.
 * Approved by Maz (2 Oct) on top: a UK price match (PRICE_MATCH), one-day
 * set-ups no longer sold on their own (free inside packages, £49 each for
 * more), and Extra automation down from £145 to £99.
 *
 * AI (Maz, 27 Sep): may be used behind the scenes to build or run things, but
 * is never advertised or sold as an offer. No 'AI assistant' or 'AI agent' copy.
 */

export const POSITIONING = 'Automation, connected tools and custom software for UK small businesses.';

export const FREE_STEP = {
  name: 'Free Demo & Fixed Price',
  short: 'free demo and price',
  price: '£0',
  body: 'Tell me the job that eats your week or loses you customers. Usually within 1 working day you get a working demo of it with your business name on, plus a fixed price and a written scope sheet.',
} as const;

/** The four kinds of work. Every offer belongs to one, and the copy never blurs them. */
export type TrackId = 'brand' | 'web' | 'automation' | 'software';
export const TRACKS: { id: TrackId; name: string; is: string; example: string }[] = [
  { id: 'automation', name: 'Automation', is: 'Takes repeat tasks off you and joins up the customer journey.', example: 'Missed-call text-back, reminders, quotes that follow themselves up.' },
  { id: 'web', name: 'Sales pages and websites', is: 'Where attention turns into enquiries, bookings or sales.', example: 'A page people can book or buy from, a full website.' },
  { id: 'brand', name: 'Brand', is: 'How your business looks, sounds and shows up.', example: 'Colours, fonts, a profile that sells, post templates (part of Creator Launch).' },
  { id: 'software', name: 'Custom software', is: 'Built for jobs normal apps can’t handle.', example: 'Customer logins, staff tools, your own booking rules.' },
];

export type OfferId = 'starter' | 'business-system' | 'custom' | 'creator-starter' | 'creator-launch' | 'website';

export type Offer = {
  id: OfferId;
  track: TrackId;
  /** Stable `?service=` id used by the enquiry form (old outreach links use some of these). */
  service: 'repair' | 'automation' | 'software' | 'creator-starter' | 'sales-page' | 'website';
  name: string;
  price: string;
  /** Numeric floor for structured data and maths. */
  from: number;
  tag?: string;
  body: string;
  /** Three short lines for cards. */
  bullets: string[];
  forWho: string;
  includes: string[];
  excludes: string[];
  /** When it is working, said plainly. */
  delivery: string;
  /** When you pay, from the decided rule: under £1,000 one invoice before go-live; £1,000+ signed-off stages. */
  payment: string;
  /** Rounds of changes before launch, then the shared changes policy. */
  changes: string;
  /** The natural next step, so each sale can lead to the next. */
  upsell: string;
  /** Risk reversal specific to this offer, if any. */
  guarantee?: string;
};

const PAY_ONE_INVOICE = 'One invoice, once you’ve seen it working and before it goes live. Due within 7 days.';
const TWEAKS = '30 days of tweaks after go-live (two rounds), and anything not working as agreed fixed free for 90 days.';

/**
 * Value every package already gets but the site never said (offer map, 2 Oct).
 * Shown on every card. Each item is a template made once, then ≤30 min per client.
 */
export const ALWAYS_INCLUDED: { title: string; body: string }[] = [
  { title: 'Written scope sheet first', body: 'Exactly what is built, what isn’t, the date and the price, before you pay anything.' },
  { title: 'Tested with you before it goes live', body: 'You see it work on real examples. The invoice comes then, not before.' },
  { title: 'Accounts in your name', body: 'No passwords shared. Add me as a user, remove me after. You own everything.' },
  { title: '2-minute walkthrough video', body: 'Recorded for you, so anyone on your team can see how it works.' },
  { title: 'Short written guide', body: 'One page: what runs, when, and what to do if something changes.' },
  { title: '30 days of tweaks + 90-day fix promise', body: 'Two rounds of tweaks, and anything I built that isn’t working as agreed is fixed free for 90 days.' },
  { title: '30-day “still working?” check', body: 'I check in a month later and fix anything that drifted.' },
  { title: 'No contracts, no monthly fee', body: 'One-off price. Texts or app costs, if any, are a few pounds a month paid by you straight to the provider. Care plans are optional and cancel any time.' },
  { title: 'UK price match', body: 'Found the same done-for-you job cheaper from a UK business? Send me their written quote. I’ll match it, or tell you plainly what’s different.' },
];

/** Price match (Maz, 2 Oct): fenced to a written quote from a UK business for the same scope, as a one-off price. */
export const PRICE_MATCH = 'Found the same done-for-you job cheaper from a UK business? Send me their written quote for the same scope as a one-off price. I’ll match it, or tell you plainly what’s different.';

/**
 * The promise (Maz, 9 Oct): no free work, no refunds on finished work, but no risk for the client.
 * They see it working before they pay; if it can't be made to work as agreed, they don't pay.
 * Replaces the 30-day money-back, which depended on the client's own customers.
 */
export const STARTER_GUARANTEE = 'No working, no invoice. You see it working on your own phone before you pay anything. If I can’t get it working the way we agreed, you don’t pay.';

/**
 * The systems ladder: automation and custom software. Order matters (cards,
 * comparison columns and the schema read it): Starter, Business System, Custom.
 */
export const OFFERS: Offer[] = [
  {
    id: 'starter',
    track: 'automation',
    service: 'repair',
    name: 'Starter Automation',
    price: '£149',
    from: 149,
    tag: 'The easy way to start',
    body: 'One task from the menu, set up so it happens on its own.',
    bullets: [
      'Pick one: missed-call text-back, reminders, review requests, quote follow-up…',
      'Set up on the tools you already use, and tested with you',
      'Plus 2 one-day set-ups of your choice, free',
    ],
    forWho: 'Owners who want one boring task off their plate before committing to more.',
    includes: [
      'One task from the automation menu: one thing starts it, then up to three things happen automatically',
      'Built on up to two apps you already use',
      'Tested on real examples with you, then switched on',
      'Two one-day set-ups of your choice, free (for example your Google listing tidy and a review QR card)',
      'Everything in “always included” below',
    ],
    excludes: [
      'A second task (Extra automation, priced on its own)',
      'New paid apps or text costs (you pay those companies directly)',
      'Cleaning up old data or changes to your website',
    ],
    delivery: 'Usually working within 7 working days of you adding me to your apps and approving the messages.',
    payment: PAY_ONE_INVOICE,
    changes: TWEAKS,
    upsell: 'Its price comes off a Business System booked within 60 days.',
    guarantee: STARTER_GUARANTEE,
  },
  {
    id: 'business-system',
    track: 'automation',
    service: 'automation',
    name: 'Business System',
    price: 'From £595',
    from: 595,
    tag: 'Most value',
    body: 'Three tasks from the menu joined up, plus a weekly report, so a customer goes from first enquiry to paid without you chasing.',
    bullets: [
      'Three tasks joined up: for example missed calls, quotes and reviews',
      'A weekly email: what came in and what is due',
      'Team training, 3 set-ups and a month of care included',
    ],
    forWho: 'Owners who copy details between apps and chase customers by hand.',
    includes: [
      'Three connected tasks from the automation menu',
      'One customer list your team can see',
      'Weekly report email (worth the add-on price on its own)',
      'Team training: a one-hour call for your staff, plus a cheat sheet',
      'Three one-day set-ups of your choice, free',
      'First month of Keep It Running free, then only if you want it',
      'Everything in “always included” below',
    ],
    excludes: [
      'A fourth task or more (Extra automation each, or quoted together)',
      'A new website or custom software',
      'Moving more than 1,000 old records, or paid app costs',
    ],
    delivery: 'Date agreed in your scope sheet, usually 2 to 3 weeks after access.',
    payment: `${PAY_ONE_INVOICE} If your scope comes to £1,000 or more, it’s billed in signed-off stages instead.`,
    changes: TWEAKS,
    upsell: 'Keep It Growing, to keep adding tasks each month.',
  },
  {
    id: 'custom',
    track: 'software',
    service: 'software',
    name: 'Custom Software',
    price: 'From £2,450',
    from: 2450,
    body: 'Something built just for your business, when normal apps don’t fit.',
    bullets: [
      'A page where customers log in to see their bookings or jobs',
      'A tool your staff use instead of spreadsheets',
      'Your own rules for bookings, quotes or stock',
    ],
    forWho: 'Businesses whose way of working no off-the-shelf app supports.',
    includes: [
      'A written spec we agree before any building',
      'Built and tested in stages you sign off',
      'Hosted on accounts in your name, with the code yours',
      'Handover guide and a team walkthrough',
      'Everything in “always included” below',
    ],
    excludes: [
      'Features not in the agreed spec (priced first)',
      'Changes after the tweaks window, unless you have Keep It Growing',
      'Hosting and third-party fees (at cost, paid by you)',
    ],
    delivery: 'A dated plan in your scope sheet, billed in stages.',
    payment: 'Two or three stages, each one signed off by you, as set out in your scope sheet.',
    changes: TWEAKS,
    upsell: 'Keep It Growing for ongoing improvements.',
  },
];

/** Creators: coaches, trainers, makers, artists, musicians. Two steps, done for you, owned by you. */
export const CREATOR_OFFERS: Offer[] = [
  {
    id: 'creator-starter',
    track: 'automation',
    service: 'creator-starter',
    name: 'Starter for creators',
    price: '£149',
    from: 149,
    tag: 'Same Starter, creator job',
    body: 'The same Starter Automation every business gets, with the creator job: someone comments a word, gets your free resource and joins an email list you own.',
    bullets: [
      'Keyword DM reply → free resource → email list + welcome email',
      'Plus 2 set-ups free: profile tidy and your link everywhere',
      'Usually working within 7 working days',
    ],
    forWho: 'Creators with followers who want a list they own and a path from a post to a sale.',
    includes: [
      'One task from the menu: a keyword auto-reply on Instagram (or TikTok) that sends your free resource, adds them to your list and sends a welcome email written with you',
      'Email list in your name, so it leaves with you if an app changes its rules',
      'Two one-day set-ups free: profile tidy (bio, link, highlight covers) and your link added everywhere',
      'Built on tools with free plans where they fit your size, so running it can cost £0 a month',
      'Everything in “always included” below',
    ],
    excludes: [
      'A sales page or payments (that’s a Launch Page)',
      'Writing your posts, running ads, or a DM app’s fee if you outgrow its free plan (paid by you, told up front)',
      'Brand design beyond colours you already use',
    ],
    delivery: 'Usually working within 7 working days of you adding me to your accounts.',
    payment: PAY_ONE_INVOICE,
    changes: TWEAKS,
    upsell: 'Its price comes off a Launch Page booked within 60 days.',
    guarantee: STARTER_GUARANTEE,
  },
  {
    id: 'creator-launch',
    track: 'web',
    service: 'sales-page',
    name: 'Launch Page',
    price: '£595',
    from: 595,
    tag: 'One page that does the selling',
    body: 'One page, written for you, where people book, buy or enquire, in a look that’s yours, with every customer added to your list. For any business or creator.',
    bullets: [
      'One page that books, sells up to three things, or takes enquiries',
      'Payments, bookings and emails go to your own accounts',
      'Brand tidy, 12 post templates and 2 set-ups included',
    ],
    forWho: 'Anyone with one thing to sell or book: a coaching call, a download, a service, a trade with no website yet.',
    includes: [
      'One page on your own domain, written with you on a 45-minute call',
      'Book, buy or enquire on the page: up to three things, through your own accounts',
      'Digital resources sent automatically after payment, or an instant reply to every enquiry',
      'Email sign-up plus a 3-email welcome series, list in your name',
      'Brand tidy: colours, fonts and logo tidied; 12 Canva post templates; 3 launch posts; QR poster',
      'Two one-day set-ups of your choice, free',
      'Launch checklist and a 30-day stats check',
      'Everything in “always included” below',
    ],
    excludes: [
      'More pages (a Website is a Launch Page plus four more pages), a shop with more than three products, a blog or a member area',
      'An illustrated logo, photography, writing your posts, or running ads',
      'App, domain and payment fees (paid by you, told up front)',
    ],
    delivery: 'Live within 15 working days of your content and access.',
    payment: PAY_ONE_INVOICE,
    changes: `Two rounds of changes before launch, then ${TWEAKS.charAt(0).toLowerCase()}${TWEAKS.slice(1)}`,
    upsell: 'A Website when you need more pages: the Launch Page price comes off within 60 days.',
  },
];

/** Websites: where attention becomes enquiries, bookings or sales. */
export const WEB_OFFERS: Offer[] = [
  {
    id: 'website',
    track: 'web',
    service: 'website',
    name: 'Website',
    price: 'From £1,495',
    from: 1495,
    body: 'Everything in a Launch Page, plus four more pages: a full website with enquiries and bookings built in, not just a brochure.',
    bullets: [
      'Everything in a Launch Page, plus four more pages (five in all)',
      'Enquiries land in one list with an instant reply (a Starter Automation, included)',
      'Google Maps listing, review QR card and 3 check-ups included',
    ],
    forWho: 'Businesses that need more than one page: several services, areas or audiences.',
    includes: [
      'Everything in a Launch Page: brand tidy, 12 post templates, email list and welcome series',
      'Up to five pages, copy written for you and built for phones',
      'Enquiry or booking flow with an instant reply and one list (Starter Automation included)',
      'Google Maps listing set up and basic search set-up',
      'Three scheduled check-ups in the first 90 days, plus a review QR card',
      'Built on accounts in your name, which you own',
      'Everything in “always included” below',
    ],
    excludes: [
      'Full brand design or a new logo (the brand tidy is included)',
      'A shop with more than ten products, a member area or customer logins (Custom Software)',
      'Blog posts, ongoing search work, ads, or domain and hosting fees',
    ],
    delivery: 'Live by the date in your scope sheet, usually 4 to 6 weeks, billed in two stages.',
    payment: 'Two stages, each one signed off by you, as set out in your scope sheet.',
    changes: `Two rounds of changes per page before launch, then ${TWEAKS.charAt(0).toLowerCase()}${TWEAKS.slice(1)}`,
    upsell: 'A Business System behind it, or Keep It Growing.',
  },
];

/** Pages and websites, smallest first: a Website is a Launch Page plus four more pages. */
const LAUNCH_PAGE = CREATOR_OFFERS[1];
export const PAGE_OFFERS: Offer[] = [LAUNCH_PAGE, ...WEB_OFFERS];

/** Every offer, for selectors, schema and the "known packages" list. */
export const ALL_OFFERS: Offer[] = [...OFFERS, ...CREATOR_OFFERS, ...WEB_OFFERS];

/** The three lanes the price page is organised in. ≤7 headline prices in total. */
export const LANES: { id: string; title: string; offers: Offer[]; note: string }[] = [
  { id: 'systems', title: 'Automation and custom software', offers: OFFERS, note: 'One task, three joined up, or something built for you. Creators: your Starter is comment-to-get-it, same price.' },
  { id: 'websites', title: 'Pages and websites', offers: PAGE_OFFERS, note: 'Same prices for every business and creator. A Website is a Launch Page plus four more pages.' },
];

/**
 * The fix ladder: the same four steps for every kind of business, so a buyer
 * always knows what the next rung costs.
 */
export const LADDER: { step: string; what: string; price: string; href: string }[] = [
  { step: 'Free demo', what: 'A working demo with your business name, and a fixed price.', price: FREE_STEP.price, href: '/free-plan' },
  { step: 'Starter', what: 'One task from the automation menu that runs by itself, plus 2 one-day set-ups free.', price: OFFERS[0].price, href: '/prices#systems' },
  { step: 'Business System', what: 'Three tasks joined up, plus a weekly report.', price: OFFERS[1].price.toLowerCase(), href: '/prices#systems' },
  { step: 'Custom', what: 'Software, a portal or an app built for you.', price: OFFERS[2].price.toLowerCase(), href: '/prices#systems' },
];

/**
 * The automation menu: what "automation" means, in plain English. A Starter is
 * one of these; a Business System is three joined up plus the weekly report.
 * `types` says which customer-type pages show it first.
 */
export type CustomerTypeId = 'trades' | 'appointments' | 'creators' | 'offices';
export type MenuJob = { id: string; name: string; what: string; types: CustomerTypeId[] };
export const AUTOMATION_MENU: MenuJob[] = [
  { id: 'missed-call', name: 'Missed-call text-back', what: 'Miss a call and the caller gets a text with your booking or quote link, so they don’t ring someone else.', types: ['trades', 'appointments'] },
  { id: 'online-booking', name: 'Online booking', what: 'Customers book themselves, day or night, from your site, Google or Instagram. Up to 10 services.', types: ['appointments', 'creators'] },
  { id: 'reminders', name: 'Appointment reminders', what: 'A reminder the day before; customers confirm or move by text, so fewer no-shows.', types: ['appointments', 'trades'] },
  { id: 'rebooking', name: 'Rebooking reminders', what: 'Past customers get a nudge when they’re due back.', types: ['appointments'] },
  { id: 'waitlist', name: 'Waitlist fill', what: 'A cancellation texts the next person on the list, so the slot isn’t wasted.', types: ['appointments'] },
  { id: 'reviews', name: 'Review requests', what: 'After every job, the customer is asked for a Google review, and you’re told when one arrives.', types: ['trades', 'appointments', 'offices'] },
  { id: 'quote-follow-up', name: 'Quote follow-up', what: 'No reply to a quote? A friendly reminder goes out after 3 and 7 days.', types: ['trades', 'offices'] },
  { id: 'payment-reminders', name: 'Payment reminders', what: 'A nudge before and after the due date, with the pay link, so you stop chasing money.', types: ['trades', 'offices'] },
  { id: 'job-updates', name: 'Job update texts', what: '“Booked”, “on the way”, “done”: sent for you, so customers stop ringing for updates.', types: ['trades'] },
  { id: 'dm-replies', name: 'Instagram auto-replies', what: 'Prices, availability and your booking link answered in the DMs while you work.', types: ['appointments', 'creators'] },
  { id: 'keyword-dm', name: 'Keyword DM → free resource', what: 'Someone comments a word, gets your free resource, and joins your list.', types: ['creators'] },
  { id: 'email-list', name: 'Email list + welcome email', what: 'Every buyer and subscriber on a list in your name, with a welcome email that sells for you.', types: ['creators'] },
  { id: 'one-list', name: 'Enquiries into one list', what: 'Phone, email, forms and DMs land in one list with an instant reply.', types: ['offices', 'trades'] },
  { id: 'onboarding', name: 'Onboarding form + reminders', what: 'New clients fill one form, upload documents, and get reminded until it’s done.', types: ['offices'] },
  { id: 'milestones', name: 'Milestone updates', what: 'Clients get an update at each stage, automatically, so they stop chasing you.', types: ['offices'] },
  { id: 'weekly-report', name: 'Weekly report', what: 'One email each Monday: enquiries, bookings, quotes waiting and money due. Included in a Business System.', types: ['trades', 'appointments', 'offices'] },
];

export function getMenuJob(id: string): MenuJob {
  const job = AUTOMATION_MENU.find((item) => item.id === id);
  if (!job) throw new Error(`Unknown menu job: ${id}`);
  return job;
}

/**
 * One-day set-ups (Offer v11): one small thing set up in a day for a fixed £49.
 * No automation, no ongoing work: templates and settings on tools the client
 * already has. Anything that needs to run on its own is a Starter. (Never
 * call these "quick fixes" in copy: positioning rule, 27 Sep.)
 * Add-ons add to a package (Extra automation only ever adds a job to one).
 */
export type Extra = { name: string; price: string; what: string };

export const SETUP_PRICE = '£49';

export const EXTRA_GROUPS: { id: string; title: string; note: string; items: Extra[] }[] = [
  {
    id: 'set-ups',
    title: 'One-day set-ups, free with every package',
    note: `One small thing, set up in a day, on tools you already have. Two come free with a Starter or Launch Page, three with a Business System. Want more? ${SETUP_PRICE} each, added to a package. Not sold on their own.`,
    items: [
      { name: 'Booking link everywhere', price: SETUP_PRICE, what: 'Your booking or quote link added to Instagram, your Google listing and WhatsApp, with a voicemail that mentions it.' },
      { name: 'Google listing tidy', price: SETUP_PRICE, what: 'Your Google Maps listing checked and filled in properly: hours, photos, services and booking link.' },
      { name: 'Review QR card', price: SETUP_PRICE, what: 'A printed-ready card and sign that opens your Google review page, so happy customers leave one on the spot.' },
      { name: 'Quote template', price: SETUP_PRICE, what: 'A clean quote template with your terms and a pay link, ready to send from your phone.' },
      { name: 'Invoice template with pay link', price: SETUP_PRICE, what: 'An invoice template customers can pay from in one tap.' },
      { name: 'Saved replies', price: SETUP_PRICE, what: 'Your ten most-typed replies (prices, hours, directions, deposit policy) saved as one-tap replies on WhatsApp and Instagram.' },
      { name: 'Contact form that reaches you', price: SETUP_PRICE, what: 'A form on your site that asks the right questions and lands in your inbox, tested end to end.' },
      { name: 'Profile tidy', price: SETUP_PRICE, what: 'Bio, link and highlight covers tidied on one platform so new followers know what you do and how to buy.' },
    ],
  },
  {
    id: 'add-to-package',
    title: 'Add to a package',
    note: 'Bigger set-ups that only make sense alongside a package. They go on the same invoice.',
    items: [
      { name: 'Extra automation', price: '£99', what: 'One more task from the automation menu, added to a package.' },
      { name: 'Weekly report', price: '£145', what: 'One simple email each week: enquiries, bookings, quotes waiting and money due. Included with a Business System.' },
      { name: 'Extra website page', price: '£295', what: 'One more page on your site or sales page, for a service or an offer, written and styled to match.' },
      { name: 'Team training', price: '£95', what: 'A one-hour video call showing your staff how everything works, plus a short written guide to keep.' },
    ],
  },
];

/** Flat list, for tests and anything that needs every add-on or set-up. */
export const EXTRAS: Extra[] = EXTRA_GROUPS.flatMap((group) => group.items);

/** Add-ons for people who sell through social media (creators page). */
export const CREATOR_EXTRAS: { icon: string; name: string; price: string; what: string }[] = [
  { icon: 'chat', name: 'Instant DM replies', price: getExtra('Extra automation').price, what: 'Prices, availability and your booking link answered in the DMs while you work. The DM app’s fee is paid by you.' },
  { icon: 'box', name: 'Order updates', price: getExtra('Extra automation').price, what: 'Buyers get “order received” and “it’s on its way” messages without you typing them.' },
  { icon: 'calendar', name: 'Online booking', price: getExtra('Extra automation').price, what: 'Clients book sessions, classes or collections themselves, day or night.' },
  { icon: 'star', name: 'Review requests', price: getExtra('Extra automation').price, what: 'Happy clients are asked for a review, so the next person trusts you faster.' },
];

/** The creator customer journey Creator Launch is built around. */
export const CREATOR_JOURNEY: { step: string; what: string }[] = [
  { step: 'Content', what: 'People find you through your posts.' },
  { step: 'Trust', what: 'Your profile and page show who you help and why you.' },
  { step: 'Offer', what: 'A resource, product or session that fits where they are.' },
  { step: 'Book or pay', what: 'Straight from the page, into your own account.' },
  { step: 'Email list', what: 'Every buyer and subscriber is yours, not the app’s.' },
];

/**
 * Side-by-side comparison for the systems ladder, ManyPets style: same rows
 * for every package, plain answers. Column order matches OFFERS.
 */
export const COMPARISON: { row: string; values: [string, string, string] }[] = [
  { row: 'Price', values: [OFFERS[0].price, OFFERS[1].price, OFFERS[2].price] },
  { row: 'Best for', values: ['Trying it on one task', 'Owners buried in admin', 'When normal apps don’t fit'] },
  { row: 'Tasks from the menu', values: ['1', '3, joined up', 'Built to fit'] },
  { row: 'Uses the tools you already have', values: ['Yes', 'Yes', 'Where it makes sense'] },
  { row: 'Customer details in one place', values: ['No', 'Included', 'Included'] },
  { row: 'Weekly report email', values: [`Add-on, ${getExtra('Weekly report').price}`, 'Included', 'Included'] },
  { row: 'Promise', values: ['No working, no invoice', 'No working, no invoice', 'Each stage signed off before you pay'] },
  { row: 'When you pay', values: ['One invoice, before go-live', 'One invoice, before go-live', 'Signed-off stages'] },
  { row: 'Working by', values: ['7 working days', 'Date in your scope sheet', 'Date in your scope sheet'] },
  { row: 'You own everything', values: ['Yes', 'Yes', 'Yes'] },
];

/**
 * Own it vs rent it: the honest comparison with agencies that sell the same
 * automations on a monthly plan. Figures are public list prices seen in the
 * 2 Oct competitor teardown (UK trades agencies ~£197/month), rounded.
 */
export const RENT_MONTHLY = 197;
/** Pay-monthly trade websites (tradiesite.co.uk, £97 a month, checked 2 Oct 2026). */
export const WEBSITE_RENT_MONTHLY = 97;
export const OWN_VS_RENT: { row: string; own: string; rent: string }[] = [
  { row: 'Missed-call text-back', own: `${OFFERS[0].price} once`, rent: `about £${RENT_MONTHLY} a month` },
  { row: 'After one year', own: OFFERS[0].price, rent: `about £${(RENT_MONTHLY * 12).toLocaleString('en-GB')}` },
  { row: 'Minimum term', own: 'None', rent: 'Often 6 to 12 months' },
  { row: 'Who owns the accounts', own: 'You', rent: 'Usually them' },
  { row: 'If you stop paying', own: 'It keeps running', rent: 'It switches off' },
  { row: 'A website, over 3 years', own: `${WEB_OFFERS[0].price.replace(/^From /, 'from ')} once`, rent: `about £${(WEBSITE_RENT_MONTHLY * 36).toLocaleString('en-GB')} (£${WEBSITE_RENT_MONTHLY} a month)` },
];

/**
 * Changes after go-live (Offer v10, replaces "2 months of unlimited changes").
 * Generous where it builds trust (anything not working as agreed is fixed
 * free for 90 days) and fenced where it costs money (tweaks come in two
 * rounds within 30 days; anything new is priced first).
 */
export const CHANGES_WINDOW = {
  name: '30 days of tweaks and a 90-day fix promise',
  short: '30 days of tweaks',
  body: 'For 30 days after it goes live, send me tweaks to what I built, in up to two rounds. And for 90 days, anything I built that isn’t working the way we agreed is fixed free. If another company changes their app, that isn’t my build: I quote the fix first, or a care plan covers it.',
  covered: [
    'Wording, messages and email or text templates',
    'Timings, reminders, steps and who gets notified',
    'Small layout and colour tweaks to what I built',
    'Anything not working the way we agreed (for 90 days)',
  ],
  notCovered: [
    'A new page, task or feature: I price it first',
    'Connecting a new app, or rebuilding after you switch apps',
    'Paid app or text-message costs, which you pay directly',
  ],
  howItWorks: 'Send each round of tweaks in one email. I usually reply within 1 working day and agree a date. After 30 days, a care plan covers changes, or I price them first.',
} as const;

/**
 * What happens next, with day numbers, so nobody wonders what they signed up
 * for. Day 0 is the day the scope sheet is approved.
 */
export const NEXT_STEPS: { day: string; title: string; body: string }[] = [
  { day: 'Day 0', title: 'Free demo and fixed price', body: 'You tell me the job. Usually within 1 working day I send a working demo with your business name on, a fixed price and a written scope sheet. Nothing to pay.' },
  { day: 'Day 1', title: 'You say yes and add me to your apps', body: 'As a user, never with passwords. I confirm the messages and timings with you.' },
  { day: 'Day 3', title: 'Set up on your apps, shown working', body: 'You see it run on your own apps and your own phone, before you pay.' },
  { day: 'Day 7', title: 'Live, then care is optional', body: 'Invoice when you’ve seen it working. Then 30 days of tweaks (two rounds) and a 90-day fix promise. Ongoing care is only if you want it.' },
];

/**
 * The free demo (Maz, 30 Sep): not a self-serve toy and not a blanket promise.
 * Fenced 2 Oct: demos only for jobs from the Business System / Creator Launch up.
 * A demo for a £149 job costs more time than the job pays; small jobs get a written plan.
 */
export const DEMO_STEPS: { title: string; body: string; note: string }[] = [
  { title: 'Start with the free demo', body: 'Tell me the job in a few taps. I send a working demo with your business name and a fixed price, usually within 1 working day. No call needed.', note: 'Free' },
  { title: 'Bigger build? A preview', body: 'For a Business System, Launch Page, Website or Custom Software, your scope sheet says what the bigger-build preview shows and when you get it. Smaller jobs go straight to the fixed price, which is quicker for you.', note: 'Date in your scope sheet' },
  { title: 'Your bigger-build preview arrives', body: 'A clickable preview of one screen, built around your business, sent by the date we agreed. Try it on your own phone.', note: 'Free, no obligation' },
  { title: 'Happy with it? Your scope sheet', body: 'A written plan and one fixed price. Every item listed and invoiced clearly. No extra charges from me beyond the quote.', note: 'Nothing to pay yet' },
  { title: 'I build it, you see it working', body: 'You see it working before it goes live, then you get 30 days of tweaks.', note: 'Fixed price' },
];

export const PROMISES: { title: string; body: string }[] = [
  { title: 'Free demo first', body: 'A working demo and a fixed price, no call needed. Bigger builds also get a working preview. No charge.' },
  { title: 'One fixed price', body: 'A written scope sheet before any work, so you know the full cost.' },
  { title: 'No contracts', body: 'Every package is a one-off you own. Care plans are monthly, cancel any time.' },
];

/** What's not included, said plainly. */
export const NOT_INCLUDED = [
  'Paid apps or text-message costs. You pay those companies directly, and I tell you the cost up front.',
  'Changes after the 30-day tweaks window, unless you have a care plan.',
  'New features beyond the agreed scope sheet. Those get their own fixed price first.',
];

/** Monthly care (Offer v11). Recurring, cancel any time, never required. */
export const CARE_PLANS = [
  {
    id: 'running',
    name: 'Keep It Running',
    price: '£39/month',
    body: 'I check everything I built keeps working, fix it if it breaks, and make one small change a month (up to 30 minutes). Reply within 2 working days, Monday to Friday. Cancel any time.',
  },
  {
    id: 'growing',
    name: 'Keep It Growing',
    price: '£149/month',
    body: 'Everything in Keep It Running, plus up to 3 hours a month of changes, new tasks or improvements, and a monthly 20-minute review call. Reply within 1 working day, Monday to Friday. Cancel any time.',
  },
] as const;

/** The entry care plan, for one-line mentions. */
export const CARE_PLAN = CARE_PLANS[0];

/**
 * After-Hours Receptionist (launched 9 Oct 2026): a monthly call-answering
 * service, separate from the one-off packages. Answers any call the owner
 * can't pick up: busy on a job in the day, or closed at night (Maz, 9 Oct:
 * "answers when you can't, but also after hours"). Works by the phone's
 * "divert when unanswered" setting, so one set-up covers day and night. Takes
 * details, answers the owner's own FAQs and emails a summary. Bounded on
 * purpose: no payments, no advice, not an emergency service. Never call it AI on the site.
 */
export const AFTER_HOURS = {
  id: 'after-hours-receptionist',
  name: 'After-Hours Receptionist',
  price: '£79/month',
  monthly: 79,
  href: '/after-hours-receptionist',
  /** Fair-use minutes included each month. Over that, the price is agreed first, never billed by surprise. */
  minutes: 300,
  setup: 'Set-up included',
  terms: 'Month to month. No long contract. Cancel with a month’s notice.',
  guarantee: 'You hear it answering as your business before your first month is billed.',
  included: [
    { title: 'Answers when you can’t', body: 'Busy on a job in the day, or closed in the evening, at weekends and on bank holidays. Any call you don’t pick up goes to it.' },
    { title: 'Your own greeting', body: 'In your business name, worded the way you’d say it.' },
    { title: 'Common questions answered', body: 'Opening hours, areas, services and prices, only from what you give me.' },
    { title: 'Clear messages', body: 'Name, number, what they need and how soon, read back to the caller to check.' },
    { title: 'Summary by email', body: 'After every call, or one tidy digest first thing in the morning.' },
    { title: 'Urgent-call rules', body: 'You decide what counts as urgent and whether it texts or rings you.' },
    { title: 'Holidays and opening hours', body: 'Closed for a week? Tell me and the greeting and hours change.' },
    { title: 'Nuisance calls kept short', body: 'Obvious sales and spam calls are kept short and flagged where it can tell.' },
    { title: 'Monthly tuning', body: 'I review your calls each month and improve the answers where callers got stuck.' },
  ],
  notIncluded: [
    'Taking payments or card details.',
    'Medical, legal or financial advice. It takes a message instead.',
    'Replacing emergency services. Callers in an emergency are told to ring 999 or the right service.',
  ],
} as const;

/**
 * "What do you need?" (conversion fixes, 2 Oct): four plain starting points at
 * the top of /prices, so someone who only wants a website isn't sent through
 * the automation ladder first. Prices read from the offers above. (Sits below
 * AFTER_HOURS because the missed-calls row reads it.)
 */
export const CHOOSER: { need: string; answer: string; href: string }[] = [
  { need: 'Stop chasing customers and admin', answer: `${OFFERS[0].name} ${OFFERS[0].price}, or a ${OFFERS[1].name} ${OFFERS[1].price.toLowerCase()}`, href: '#systems' },
  { need: 'Somewhere to send people to book or buy', answer: `${CREATOR_OFFERS[1].name} ${CREATOR_OFFERS[1].price}, or a ${WEB_OFFERS[0].name} ${WEB_OFFERS[0].price.toLowerCase()}`, href: '#websites' },
  { need: 'Stop losing callers to voicemail', answer: `Text-back ${OFFERS[0].price} once, or calls answered for ${AFTER_HOURS.price}`, href: '#monthly' },
  { need: 'Something built just for you', answer: `${OFFERS[2].name} ${OFFERS[2].price.toLowerCase()}`, href: '#systems' },
];
export const SAME_PRICE_NOTE = `Two things cost ${CREATOR_OFFERS[1].price}: a ${CREATOR_OFFERS[1].name} is one page that books or sells; a ${OFFERS[1].name} is three tasks joined up behind your business.`;

/**
 * How the prices are organised (11 Oct 2026): pay once by default, pay monthly
 * only where something genuinely costs money every month. No new prices here:
 * every figure is read from the offers above.
 */
export const WAYS_TO_PAY: { id: string; title: string; price: string; body: string; href: string }[] = [
  { id: 'once', title: 'Pay once, own it', price: `${OFFERS[0].price} to ${OFFERS[2].price.replace(/^From /, '')}+`, body: 'One fixed price, paid once you’ve seen it working. Yours for good.', href: '#systems' },
  { id: 'monthly', title: 'Pay monthly, for a live service', price: AFTER_HOURS.price, body: `Only the ${AFTER_HOURS.name}: a phone line costs money by the minute.`, href: '#monthly' },
];

/**
 * Prices by problem: the same approved prices, found by what is going wrong
 * instead of by package name. Missed calls is the only problem with a monthly
 * answer as well as a one-off one.
 */
const STARTER_ONCE = `${OFFERS[0].name}, ${OFFERS[0].price} once`;
export const SOLUTIONS: { id: string; problem: string; fix: string; once: string; monthly?: string; href: string }[] = [
  { id: 'missed-calls', problem: 'Calls go to voicemail', fix: 'A text back with your booking link, or the call answered for you.', once: `Missed-call text-back: ${STARTER_ONCE}`, monthly: `${AFTER_HOURS.name}, ${AFTER_HOURS.price}`, href: AFTER_HOURS.href + '#which' },
  { id: 'no-shows', problem: 'No-shows and empty slots', fix: 'Online booking, reminders and a waitlist that fills cancellations.', once: STARTER_ONCE, href: '#systems' },
  { id: 'quotes', problem: 'Quotes go quiet', fix: 'A friendly follow-up after 3 and 7 days, sent for you.', once: STARTER_ONCE, href: '#systems' },
  { id: 'reviews', problem: 'Not enough reviews', fix: 'Every customer asked for a Google review after the job.', once: STARTER_ONCE, href: '#systems' },
  { id: 'payments', problem: 'Chasing money', fix: 'Reminders before and after the due date, with the pay link.', once: STARTER_ONCE, href: '#systems' },
  { id: 'joined-up', problem: 'All of it, joined up', fix: 'Three tasks working together, plus a weekly report.', once: `${OFFERS[1].name}, ${OFFERS[1].price.toLowerCase()} once`, href: '#systems' },
];

/**
 * Four ways to deal with a missed call, cheapest first, said honestly. Shown on
 * the receptionist page so a buyer can pick the smaller fix if that is all they need.
 */
export const MISSED_CALL_OPTIONS: { id: string; name: string; price: string; caller: string; you: string; fits: string; href?: string }[] = [
  { id: 'voicemail', name: 'Voicemail', price: '£0', caller: 'Hears a beep. Many hang up.', you: 'A missed-call list and the odd message.', fits: 'You ring everyone back within minutes anyway.' },
  { id: 'text-back', name: 'Missed-call text-back', price: `${OFFERS[0].price} once`, caller: 'Gets a text with your booking or quote link.', you: 'The enquiry in writing. Texts cost a few pence each, paid to the provider.', fits: 'Your callers are happy to book or reply by text.', href: '/services/missed-call' },
  { id: 'receptionist', name: AFTER_HOURS.name, price: AFTER_HOURS.price, caller: 'Is answered, gets common questions answered and leaves details.', you: 'A summary of every call, and urgent ones passed on.', fits: 'Callers want to speak to someone, or ask questions before they book.', href: '#price' },
  { id: 'system', name: OFFERS[1].name, price: `${OFFERS[1].price} once`, caller: 'Gets the text back, then reminders and follow-ups.', you: 'Calls, quotes and reviews in one list, with a weekly report.', fits: 'Missed calls are one of several things you chase by hand.', href: '/prices#systems' },
];

/** How the work is actually set up, in plain words (homepage "How I set it up"). */
export const DELIVERY: { title: string; body: string }[] = [
  { title: 'Built on what you already use', body: 'Your booking app, email, calendar or accounts software. If a new app is needed, you pay that company directly and I tell you the cost first.' },
  { title: 'You add me as a user', body: 'I never need your passwords. Every account stays in your name, and you remove me when it’s done.' },
  { title: 'Tested, then switched on', body: 'I test it on real examples. You see it working before it goes live, and the invoice comes then.' },
  { title: 'Help afterwards if you want it', body: `${CARE_PLANS[0].name} (${CARE_PLANS[0].price}) keeps it checked. ${CARE_PLANS[1].name} (${CARE_PLANS[1].price}) keeps improving it.` },
];

/** Shown on the site. Internal detail: under £1,000 = one invoice before go-live, 7-day terms; £1,000+ = two or three signed-off stages. */
export const PAYMENT_TERMS = 'A free demo, a written scope sheet and a fixed price before any work. You pay when you’ve seen it working, before it goes live. Bigger jobs are billed in stages you sign off. No VAT added.';

/**
 * What it keeps costing after the build, derived from CARE_PLANS (never typed).
 * Business System includes a first month of Keep It Running (Offer v12).
 */
export function runningCost(offer: Offer): string {
  const care = `${CARE_PLANS[0].name} is optional, ${CARE_PLANS[0].price}.`;
  if (offer.id === 'business-system') return `First month of ${CARE_PLANS[0].name} included, then optional care at ${CARE_PLANS[0].price}.`;
  if (offer.id === 'creator-launch' || offer.id === 'website') return `Nothing monthly from me. ${care} Domain and hosting are paid by you.`;
  if (offer.id === 'custom') return `Nothing monthly from me. ${care} Hosting and other tools are paid by you at cost.`;
  return `Nothing monthly from me. ${care}`;
}

/** Running costs that are never ours, in one line. No figures: each is quoted in the scope sheet. */
export const RUNNING_COSTS_NOTE = 'Running costs that aren’t ours: texts, booking apps, domain and hosting are paid by you directly to those companies. Each one is quoted in your scope sheet before you pay anything.';

export const THIRD_PARTY_NOTE = 'If you need a paid app, like a texting service, you pay that company directly and I tell you the cost up front. You own everything.';

/** A delivery promise, not a payment guarantee (no "you don't pay the rest" wording: Maz, 1 Oct). */
export const DELIVERY_PROMISE = 'Starter Automation is usually working within 7 working days of you adding me to your apps. Every other job has a date in its scope sheet.';

/** Upgrade credits that make the next sale the natural one. */
export const UPGRADE_CREDITS = [
  `Starter Automation’s ${OFFERS[0].price} comes off a ${OFFERS[1].name} booked within 60 days.`,
  `The creator Starter’s ${CREATOR_OFFERS[0].price} comes off a ${CREATOR_OFFERS[1].name} booked within 60 days.`,
  `A ${CREATOR_OFFERS[1].name}’s ${CREATOR_OFFERS[1].price} comes off a ${WEB_OFFERS[0].name} booked within 60 days.`,
];

/**
 * What each package's parts would cost bought one by one, from the prices in
 * this file (Offer v12). Shown on the price cards so the package is visibly
 * the better deal. Only priced parts count; the brand tidy, templates and
 * "always included" items are extra on top.
 */
export const PACKAGE_VALUE: Partial<Record<OfferId, { parts: { label: string; price: number }[]; total: number }>> = (() => {
  const setup = priceAmount(SETUP_PRICE);
  const extraJob = priceAmount(getExtra('Extra automation').price);
  const page = priceAmount(getExtra('Extra website page').price);
  const build = (parts: { label: string; price: number }[]) => ({ parts, total: parts.reduce((sum, part) => sum + part.price, 0) });
  return {
    starter: build([{ label: 'one automation task', price: OFFERS[0].from }, { label: '2 one-day set-ups', price: 2 * setup }]),
    'creator-starter': build([{ label: 'one automation task', price: CREATOR_OFFERS[0].from }, { label: '2 one-day set-ups', price: 2 * setup }]),
    'business-system': build([
      { label: 'first automation task', price: OFFERS[0].from },
      { label: '2 more tasks', price: 2 * extraJob },
      { label: 'weekly report', price: priceAmount(getExtra('Weekly report').price) },
      { label: 'team training', price: priceAmount(getExtra('Team training').price) },
      { label: '3 one-day set-ups', price: 3 * setup },
      { label: 'a month of Keep It Running', price: priceAmount(CARE_PLANS[0].price) },
    ]),
    website: build([{ label: 'Launch Page', price: CREATOR_OFFERS[1].from }, { label: '4 more pages', price: 4 * page }]),
  };
})();

export const PRICE_RANGE = `${OFFERS[0].price}–${OFFERS[2].price.replace(/^From /, '')}+`;

/**
 * Buy-now links (Stripe payment links) for the two self-serve steps. Empty
 * until Maz creates the links in Stripe; a card only shows "Buy now" when a
 * link exists. The success URL should be /start?package=<name>.
 */
export const BUY_LINKS: Partial<Record<string, string>> = {
  // 'Starter Automation': 'https://buy.stripe.com/…',
  // 'Starter for creators': 'https://buy.stripe.com/…',
  // (One-day set-ups are not sold on their own since v12, so no link for them.)
};

export function getOffer(id: OfferId): Offer {
  const offer = ALL_OFFERS.find(item => item.id === id);
  if (!offer) throw new Error(`Unknown offer: ${id}`);
  return offer;
}
export function getExtra(name: string): Extra {
  const extra = EXTRAS.find(item => item.name === name);
  if (!extra) throw new Error(`Unknown extra: ${name}`);
  return extra;
}
export function workingBy(id: OfferId): string {
  return id === 'starter' || id === 'creator-starter' ? 'Usually within 7 working days of you adding me to your apps' : 'Date agreed in your scope sheet';
}
/** Scales with the job, costs nothing unless a sale happens (Offer v10; was a flat £40). */
export const REFERRAL_REWARD = '£50';

export function priceAmount(price: string): number { return Number(price.replace(/[^0-9.]/g, '')); }
export function formatPrice(amount: number): string { return `£${amount.toLocaleString('en-GB')}`; }
export const LOWEST_EXTRA_PRICE = formatPrice(Math.min(...EXTRAS.map(extra => priceAmount(extra.price))));
export const EXAMPLE_PLAN_TOTAL = formatPrice(OFFERS[0].from + priceAmount(getExtra('Extra automation').price));

export type PlanJob = { name: string; offerName: string };
export type PlanQuote = {
  offer: Offer | null;
  lines: { label: string; price: string }[];
  total: number;
  totalLabel: string;
  workingBy: string;
  note: string;
};

/** One-day set-ups that come free with a Starter. */
const INCLUDED_SETUPS = 2;

/** Three or more tasks to build is a Business System, whatever the parts add up to. */
const BUSINESS_SYSTEM_JOBS = 3;

/**
 * Prices a set of chosen jobs by the offer rules above, for the
 * "Build my system" tool. Everything is read from this file:
 * - one-day set-ups are never sold alone: two ride free with a Starter, £49 each after that;
 * - a task from the automation menu is Starter Automation, and each further
 *   one is Extra automation (which only ever adds to a package);
 * - asking for a package (Business System, Custom) quotes that package;
 * - the weekly report is included in a Business System;
 * - when the parts cost more than a Business System, or need three builds,
 *   recommend that instead.
 */
export function quotePlan(jobs: PlanJob[]): PlanQuote {
  const starter = getOffer('starter');
  const business = getOffer('business-system');
  const extraJob = getExtra('Extra automation');
  const unique = jobs.filter((job, index) => jobs.findIndex(other => other.offerName === job.offerName && other.name === job.name) === index);
  const packageJob = [...OFFERS].reverse().find(offer => offer.id !== 'starter' && unique.some(job => job.offerName === offer.name));
  const packageQuote = (offer: Offer, note: string): PlanQuote => ({
    offer, lines: [{ label: offer.name, price: offer.price }], total: offer.from, totalLabel: offer.price, workingBy: workingBy(offer.id), note,
  });
  if (packageJob) return packageQuote(packageJob, packageJob.id === 'business-system' ? 'Everything you picked joined up, with the weekly report included. Exact price in your scope sheet.' : 'Scoped with you first. Exact price in your scope sheet.');
  if (!unique.length) return { offer: starter, lines: [{ label: `${starter.name}: one task of your choice`, price: starter.price }], total: starter.from, totalLabel: starter.price, workingBy: workingBy('starter'), note: 'Pick what costs you time and the plan builds itself.' };
  const lines: PlanQuote['lines'] = [];
  const setupNames = new Set(EXTRA_GROUPS[0].items.map(item => item.name));
  const setups: string[] = [];
  let builds = 0;
  for (const job of unique) {
    const extra = EXTRAS.find(item => item.name === job.offerName && item.name !== extraJob.name);
    if (extra && setupNames.has(extra.name)) { setups.push(extra.name); continue; }
    if (extra) { lines.push({ label: extra.name, price: extra.price }); continue; }
    lines.push(builds === 0 ? { label: `${starter.name}: ${job.name.toLowerCase()}`, price: starter.price } : { label: `${extraJob.name}: ${job.name.toLowerCase()}`, price: extraJob.price });
    builds++;
  }
  // One-day set-ups are not sold on their own (Maz, 2 Oct): they ride free with a Starter, £49 each beyond two.
  if (setups.length && !builds) { lines.unshift({ label: `${starter.name}: one task of your choice`, price: starter.price }); builds = 1; }
  setups.forEach((name, index) => lines.push({ label: `${name} (one-day set-up)`, price: index < INCLUDED_SETUPS ? 'Included' : SETUP_PRICE }));
  const total = lines.reduce((sum, line) => sum + priceAmount(line.price), 0);
  if (total > business.from) return packageQuote(business, `Your picks add up to ${formatPrice(total)} on their own, more than a ${business.name}, so I would quote that instead, with the weekly report included.`);
  if (builds >= BUSINESS_SYSTEM_JOBS) return packageQuote(business, `${builds} tasks to build is a ${business.name}: joined up, with the weekly report included.`);
  return { offer: builds ? starter : null, lines, total, totalLabel: formatPrice(total), workingBy: workingBy('starter'), note: 'Fixed price, agreed before any work starts. No VAT added.' };
}
