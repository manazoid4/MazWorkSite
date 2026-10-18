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
 * - One fix ladder for every customer: Free preview £0 → Small set-up £49 →
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
 * - Every package includes free small set-ups (Starter 2, bigger packages 3),
 *   because those are the items free tools and £30 gigs undercut on their own.
 * - Business System adds team training and a first month of Care plan,
 *   so it is clearly cheaper than buying the parts (PACKAGE_VALUE).
 * Competitor check behind it: docs/maz-works/PRICE-AUDIT-2026-10.md.
 * Approved by Maz (2 Oct) on top: a UK price match (PRICE_MATCH), one-day
 * set-ups no longer sold on their own (free inside packages, £49 each for
 * more), and Extra automation down from £145 to £99.
 *
 * Offer v13 (16 Oct 2026, Maz: "they can do that for a lot less than the
 * price I'm charging"). Items an owner can DIY on free tools came down:
 * creator Starter £149→£79, Launch Page £595→£295 (so Website £1,495→£1,295
 * stays cheaper than its parts), set-ups £49→£29, creator add-ons £99→£49,
 * Weekly report £145→£79, then Starter Automation £149→£99 (Maz: "149 isn't
 * justifiable for a simple automation"). System £595 and Custom £2,450 unchanged.
 *
 * AI (Maz, 27 Sep): may be used behind the scenes to build or run things, but
 * is never advertised or sold as an offer. No 'AI assistant' or 'AI agent' copy.
 */

export const POSITIONING = 'Automation, connected tools and custom software for UK small businesses.';

export const FREE_STEP = {
  name: 'Free Preview & Fixed Price',
  short: 'free preview and price',
  price: '£0',
  body: 'Tell me the job that eats your week or loses you customers. Usually within 1 working day you get a working preview of it with your business name on, plus a fixed price and a written scope sheet. It is built from a template on my own test setup, so it is not on your apps yet.',
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
  /** A concrete demonstration of the agreed work, not a promise of revenue. */
  successCheck: string;
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
  { title: 'Written scope sheet first', body: 'The job, the date, the price and the example we will use to check it works. You agree what is included before building starts.' },
  { title: 'Tested with you before it goes live', body: 'You see it work on real examples. The invoice comes then, not before.' },
  { title: 'Accounts in your name', body: 'No passwords shared. Add me as a user, remove me after. You own everything.' },
  { title: '2-minute walkthrough video', body: 'Recorded for you, so anyone on your team can see how it works.' },
  { title: 'Short written guide', body: 'One page: what runs, when, and what to do if something changes.' },
  { title: '30 days of tweaks + 90-day fix promise', body: 'Two rounds of tweaks, and anything I built that isn’t working as agreed is fixed free for 90 days.' },
  { title: '30-day “still working?” check', body: 'I check in a month later and fix anything that drifted.' },
  { title: 'No contracts, no monthly fee', body: 'One-off build price. Any app, text or hosting costs are agreed before work starts and paid by you straight to the provider. Care plans are optional and cancel any time.' },
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
    price: '£99',
    from: 99,
    tag: 'The easy way to start',
    body: 'Stop doing the same follow-up by hand. Pick one task, such as replying to a missed call, chasing a quote or requesting a review, and have it run on your existing tools.',
    bullets: [
      'Pick one: missed-call text-back, reminders, review requests, quote follow-up…',
      'Set up on the tools you already use, and tested with you',
      'Plus 2 small set-ups of your choice, free',
    ],
    forWho: 'Owners repeating one task by hand who want to start small.',
    successCheck: 'Trigger your chosen task with a test enquiry or booking. Watch the agreed message or update reach the right place without retyping it.',
    includes: [
      'One task from the automation menu: one thing starts it, then up to three things happen automatically',
      'Built on up to two apps you already use',
      'Tested on real examples with you, then switched on',
      'Two small set-ups of your choice, free (for example your Google listing tidy and a review QR card)',
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
    tag: 'For a joined-up customer journey',
    body: 'Keep enquiries, follow-ups and the next action together. Three connected tasks, one customer list and a weekly report help your team see who needs attention.',
    bullets: [
      'Three tasks joined up: for example missed calls, quotes and reviews',
      'A weekly email: what came in and what is due',
      'Team training, 3 set-ups and a month of care included',
    ],
    forWho: 'Owners who copy details between apps and chase customers by hand.',
    successCheck: 'Follow one test customer through all three agreed tasks. Check their details stay together and the weekly report shows the next action.',
    includes: [
      'Three connected tasks from the automation menu',
      'One customer list your team can see',
      'Weekly report email (worth the add-on price on its own)',
      'Team training: a one-hour call for your staff, plus a cheat sheet',
      'Three small set-ups of your choice, free',
      'First month of care free, then only if you want it',
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
    upsell: 'Care plan plus, to keep adding tasks each month.',
  },
  {
    id: 'custom',
    track: 'software',
    service: 'software',
    name: 'Custom Software',
    price: 'From £2,450',
    from: 2450,
    body: 'Give your team one place to do a job that spreadsheets and off-the-shelf apps cannot handle. Start with a clearly scoped tool, portal or workflow you own.',
    bullets: [
      'A page where customers log in to see their bookings or jobs',
      'A tool your staff use instead of spreadsheets',
      'Your own rules for bookings, quotes or stock',
    ],
    forWho: 'Businesses whose way of working no off-the-shelf app supports.',
    successCheck: 'Your team completes the agreed real-world job in each stage, including permissions and error cases, before signing that stage off.',
    includes: [
      'A written spec we agree before any building',
      'Built and tested in stages you sign off',
      'Hosted on accounts in your name, with the code yours',
      'Handover guide and a team walkthrough',
      'Everything in “always included” below',
    ],
    excludes: [
      'Features not in the agreed spec (priced first)',
      'Changes after the tweaks window, unless you have Care plan plus',
      'Hosting and third-party fees (at cost, paid by you)',
    ],
    delivery: 'A dated plan in your scope sheet, billed in stages.',
    payment: 'Two or three stages, each one signed off by you, as set out in your scope sheet.',
    changes: TWEAKS,
    upsell: 'Care plan plus for ongoing improvements.',
  },
];

/** Creators: coaches, trainers, makers, artists, musicians. Two steps, done for you, owned by you. */
export const CREATOR_OFFERS: Offer[] = [
  {
    id: 'creator-starter',
    track: 'automation',
    service: 'creator-starter',
    name: 'Starter for creators',
    price: '£79',
    from: 79,
    tag: 'Starter, creator job',
    body: 'Turn interest in a post into a follow-up you control. Send your resource, invite people onto your email list and welcome new subscribers without replying to each person by hand.',
    bullets: [
      'Keyword DM reply → free resource → email list + welcome email',
      'Plus 2 set-ups free: profile tidy and your link everywhere',
      'Usually working within 7 working days',
    ],
    forWho: 'Creators with followers who want a list they own and a path from a post to a sale.',
    successCheck: 'Use a test follower to request the resource, opt into your list and receive the welcome email. Check every step on your phone.',
    includes: [
      'One task from the menu: a keyword auto-reply on Instagram (or TikTok) that sends your free resource, adds them to your list and sends a welcome email written with you',
      'Email list in your name, so it leaves with you if an app changes its rules',
      'Two small set-ups free: profile tidy (bio, link, highlight covers) and your link added everywhere',
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
    price: '£295',
    from: 295,
    tag: 'One page that does the selling',
    body: 'Give people one clear place to understand your offer and book, buy or enquire. Copy, the page and the agreed follow-up are set up together, on accounts you own.',
    bullets: [
      'One page that books, sells up to three things, or takes enquiries',
      'Payments, bookings and emails go to your own accounts',
      'Brand tidy, 12 post templates and 2 set-ups included',
    ],
    forWho: 'Businesses or creators selling one offer: a service, appointment or download.',
    successCheck: 'Complete the agreed booking, test-mode purchase or enquiry on a phone. Check it reaches your account and the customer receives the right confirmation.',
    includes: [
      'One page on your own domain, written with you on a 45-minute call',
      'Book, buy or enquire on the page: up to three things, through your own accounts',
      'Digital resources sent automatically after payment, or an instant reply to every enquiry',
      'Email sign-up plus a 3-email welcome series, list in your name',
      'Brand tidy: colours, fonts and logo tidied; 12 Canva post templates; 3 launch posts; QR poster',
      'Two small set-ups of your choice, free',
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
    price: 'From £1,295',
    from: 1295,
    body: 'Help customers choose the right service and take the next step. Five pages, written for you, with enquiries or bookings connected to one list and an instant reply.',
    bullets: [
      'Everything in a Launch Page, plus four more pages (five in all)',
      'Enquiries land in one list with an instant reply (a Starter Automation, included)',
      'Google Maps listing, review QR card and 3 check-ups included',
    ],
    forWho: 'Businesses that need more than one page: several services, areas or audiences.',
    successCheck: 'Find a service on your phone and send a test enquiry or booking. Check it appears in your list, sends a reply and tells your team what to do next.',
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
    upsell: 'A Business System behind it, or Care plan plus.',
  },
];

/** Pages and websites, smallest first: a Website is a Launch Page plus four more pages. */
const LAUNCH_PAGE = CREATOR_OFFERS[1];
export const PAGE_OFFERS: Offer[] = [LAUNCH_PAGE, ...WEB_OFFERS];

/** Every offer, for selectors, schema and the "known packages" list. */
export const ALL_OFFERS: Offer[] = [...OFFERS, ...CREATOR_OFFERS, ...WEB_OFFERS];

/** The three lanes the price page is organised in. ≤7 headline prices in total. */
export const LANES: { id: string; title: string; offers: Offer[]; note: string }[] = [
  { id: 'systems', title: 'Automation and custom software', offers: OFFERS, note: `One task, three joined up, or something built for you. Creators: your Starter is comment-to-get-it, for ${CREATOR_OFFERS[0].price}.` },
  { id: 'websites', title: 'Pages and websites', offers: PAGE_OFFERS, note: 'Same prices for every business and creator. A Website is a Launch Page plus four more pages.' },
  { id: 'creator-tools', title: 'For creators with an audience', offers: [CREATOR_OFFERS[0]], note: 'Follow up on interest in your posts. Need a sales page too? See Launch Page above.' },
];

/**
 * The fix ladder: the same four steps for every kind of business, so a buyer
 * always knows what the next rung costs.
 */
export const LADDER: { step: string; what: string; price: string; href: string }[] = [
  { step: 'Free preview', what: 'A working preview with your business name, and a fixed price.', price: FREE_STEP.price, href: '/free-plan' },
  { step: 'Starter', what: 'One task from the automation menu that runs by itself, plus 2 small set-ups free.', price: OFFERS[0].price, href: '/prices#systems' },
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
 * Small set-ups (Offer v11): one small thing set up in a day for a fixed £49.
 * No automation, no ongoing work: templates and settings on tools the client
 * already has. Anything that needs to run on its own is a Starter. (Never
 * call these "quick fixes" in copy: positioning rule, 27 Sep.)
 * Add-ons add to a package (Extra automation only ever adds a job to one).
 */
export type Extra = { name: string; price: string; what: string };

export const SETUP_PRICE = '£29';

export const EXTRA_GROUPS: { id: string; title: string; note: string; items: Extra[] }[] = [
  {
    id: 'set-ups',
    title: 'Small set-ups, free with every package',
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
      { name: 'Weekly report', price: '£79', what: 'One simple email each week: enquiries, bookings, quotes waiting and money due. Included with a Business System.' },
      { name: 'Extra website page', price: '£295', what: 'One more page on your site or sales page, for a service or an offer, written and styled to match.' },
      { name: 'Team training', price: '£95', what: 'A one-hour video call showing your staff how everything works, plus a short written guide to keep.' },
    ],
  },
];

/** Flat list, for tests and anything that needs every add-on or set-up. */
export const EXTRAS: Extra[] = EXTRA_GROUPS.flatMap((group) => group.items);

/** Creators can DIY most of these on free plans (ManyChat, Calendly, shop emails), so they cost less than a business task (Maz, 16 Oct). */
export const CREATOR_EXTRA_PRICE = '£49';

/** Add-ons for people who sell through social media (creators page). */
export const CREATOR_EXTRAS: { icon: string; name: string; price: string; what: string }[] = [
  { icon: 'chat', name: 'Instant DM replies', price: CREATOR_EXTRA_PRICE, what: 'Prices, availability and your booking link answered in the DMs while you work. The DM app’s fee is paid by you.' },
  { icon: 'box', name: 'Order updates', price: CREATOR_EXTRA_PRICE, what: 'Buyers get “order received” and “it’s on its way” messages without you typing them.' },
  { icon: 'calendar', name: 'Online booking', price: CREATOR_EXTRA_PRICE, what: 'Clients book sessions, classes or collections themselves, day or night.' },
  { icon: 'star', name: 'Review requests', price: CREATOR_EXTRA_PRICE, what: 'Happy clients are asked for a review, so the next person trusts you faster.' },
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
  { day: 'Day 0', title: 'Free preview and fixed price', body: 'You tell me the job. Usually within 1 working day I send a working preview with your business name on, a fixed price and a written scope sheet. Nothing to pay.' },
  { day: 'Day 1', title: 'You say yes and add me to your apps', body: 'As a user, never with passwords. I confirm the messages and timings with you.' },
  { day: 'Day 3', title: 'Set up on your apps, shown working', body: 'You see it run on your own apps and your own phone, before you pay.' },
  { day: 'Day 7', title: 'Live, then care is optional', body: 'Invoice when you’ve seen it working. Then 30 days of tweaks (two rounds) and a 90-day fix promise. Ongoing care is only if you want it.' },
];

/**
 * The free preview (Maz, 30 Sep): not a self-serve toy and not a blanket promise.
 * Fenced 2 Oct: demos only for jobs from the Business System / Creator Launch up.
 * A demo for a £149 job costs more time than the job pays; small jobs get a written plan.
 */
export const DEMO_STEPS: { title: string; body: string; note: string }[] = [
  { title: 'Start with the free preview', body: 'Tell me the job in a few taps. I send a working preview with your business name and a fixed price, usually within 1 working day. No call needed.', note: 'Free' },
  { title: 'Bigger build? A preview', body: 'For a Business System, Launch Page, Website or Custom Software, your scope sheet says what the bigger-build preview shows and when you get it. Smaller jobs go straight to the fixed price, which is quicker for you.', note: 'Date in your scope sheet' },
  { title: 'Your bigger-build preview arrives', body: 'A clickable preview of one screen, built around your business, sent by the date we agreed. Try it on your own phone.', note: 'Free, no obligation' },
  { title: 'Happy with it? Your scope sheet', body: 'A written plan and one fixed price. Every item listed and invoiced clearly. No extra charges from me beyond the quote.', note: 'Nothing to pay yet' },
  { title: 'I build it, you see it working', body: 'You see it working before it goes live, then you get 30 days of tweaks.', note: 'Fixed price' },
];

export const PROMISES: { title: string; body: string }[] = [
  { title: 'Free preview first', body: 'A working preview and a fixed price, no call needed. Bigger builds also get a full-build preview. No charge.' },
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
    name: 'Care plan',
    price: '£39/month',
    body: 'Keep the system I built useful as your business changes. I check it keeps working, fix it if it breaks, and make one small change a month (up to 30 minutes), such as updating a message or opening hours. Reply within 2 working days, Monday to Friday. Cancel any time.',
  },
  {
    id: 'growing',
    name: 'Care plan plus',
    price: '£149/month',
    body: 'Keep improving the work that slows your team down. Everything in the Care plan, plus up to 3 hours a month of changes, new tasks or improvements. We choose the priority in a monthly 20-minute review call and agree what fits the time. Reply within 1 working day, Monday to Friday. Cancel any time.',
  },
] as const;

/** The entry care plan, for one-line mentions. */
export const CARE_PLAN = CARE_PLANS[0];

/** Monthly help turning a client's existing work into useful sales material. */
export const MANAGED_PRESENCE = {
  id: 'managed-presence',
  name: 'Managed presence',
  price: 'From £180/month',
  monthly: 180,
  href: '/managed-presence',
  body: 'I run your online presence for you: website updates, Google listing and social posts, all kept fresh from the photos and jobs you already have.',
  forWho: 'Businesses doing good work but rarely finding time to show it online.',
  successCheck: 'Each month, see the approved project story, Google updates and scheduled posts, with a short record of what went live.',
  included: [
    { title: 'Website update', body: 'One project story or proof update each month, plus one small change: a price, hours or photo.' },
    { title: 'Google listing', body: 'Two Google Business Profile updates, with fresh photos and your opening hours kept right.' },
    { title: 'Social posts', body: 'Up to eight posts on one channel of your choice, with captions and scheduling.' },
    { title: 'Review boost', body: 'A monthly nudge list of customers to ask for reviews, plus draft replies to the reviews you get.' },
    { title: 'Website health check', body: 'Monthly check for broken links, forms and slow pages, fixed where it is in scope.' },
    { title: 'Monthly report', body: 'One short page: what went live, what changed and the enquiries we can trace.' },
  ],
  notIncluded: [
    'Photography or filming on site; this can be quoted separately',
    'Daily inbox replies, paid ads or a promise of leads or rankings',
    'A new website or work beyond the agreed monthly scope',
  ],
  terms: 'Set-up included. Month to month; cancel with a month’s notice. You keep your accounts and content.',
} as const;

/**
 * Video and filming (Maz, 18 Oct 2026), replacing the flat £300 Content Day.
 * Introductory, portfolio-building prices. ONE place for every number: pages,
 * the package selector, schema and tests all read from here.
 * The 20% saving applies ONLY to the four-edit bundle and only when it is booked
 * with a shoot; the filming fee is never discounted and nothing stacks.
 * Maz (18 Oct): copy says professional-grade cameras; never say they are hired, never name models or claim cinema kit.
 * The full-day rate is a proposed introductory rate (Maz to confirm).
 */
/** What makes Maz Works different. One list, reused on the video, managed, FAQ and what-we-do pages. */
export const USPS = [
  { title: 'See it working before you pay', body: 'No working, no invoice.' },
  { title: 'One person, start to finish', body: 'You deal with me, not a queue of account managers.' },
  { title: 'Fixed price in writing', body: 'Agreed up front. No surprise bills.' },
  { title: 'Website, automation and video', body: 'One team for everything your customers see.' },
  { title: 'You own everything', body: 'Your accounts, your content, no lock-in.' },
  { title: 'UK-wide', body: 'Remote work, or on location for filming.' },
] as const;

/** Per-business hooks, written from the owner's side of the counter. */
export const AUDIENCES = [
  { name: 'Trades', video: 'Show finished jobs, not just promises. Before and after clips win quotes.', managed: 'Every finished job becomes a project story, Google update and post.' },
  { name: 'Salons and clinics', video: 'Let people see the room and the result before they book.', managed: 'Fresh results, opening hours and offers, always up to date.' },
  { name: 'Cafes and shops', video: 'Make people hungry or curious from their phone screen.', managed: 'New menus, stock and events posted without you lifting a finger.' },
  { name: 'Local services', video: 'Put a face and a place to your name so customers trust you faster.', managed: 'Reviews, hours and news kept current so you look open for business.' },
] as const;

export const VIDEO_PRICES = {
  halfDay: 150,
  fullDay: 250,
  editBundle: 200,
  editCount: 4,
  /** Whole percent off the edit bundle when booked with any shoot. */
  bundleDiscountPercent: 20,
} as const;

export type VideoShoot = 'none' | 'half' | 'full';

/** Integer pounds in, integer pounds out. No floats, so totals never drift. */
export function videoQuote(shoot: VideoShoot, withEdits: boolean) {
  const filming = shoot === 'half' ? VIDEO_PRICES.halfDay : shoot === 'full' ? VIDEO_PRICES.fullDay : 0;
  const editsFull = withEdits ? VIDEO_PRICES.editBundle : 0;
  const saving = withEdits && shoot !== 'none' ? Math.round((editsFull * VIDEO_PRICES.bundleDiscountPercent) / 100) : 0;
  const edits = editsFull - saving;
  return { filming, editsFull, saving, edits, total: filming + edits };
}

export const VIDEO_PER_VIDEO = VIDEO_PRICES.editBundle / VIDEO_PRICES.editCount;

export const VIDEO_SERVICES = [
  { title: 'Business promotional videos', body: 'Short videos that show what you do and why customers should choose you.' },
  { title: 'Reels and short-form content', body: 'Vertical clips made for Instagram, TikTok, Facebook and YouTube Shorts.' },
  { title: 'Premises and product filming', body: 'Your shop, workshop, kitchen or stock, shot so it looks as good as it is.' },
  { title: 'Website hero and intro videos', body: 'A short loop or introduction for the top of your website.' },
  { title: 'Editing and repurposing', body: 'Footage you already have, cut into clean short videos with captions.' },
  { title: 'Filming sessions', body: 'A planned session at your business anywhere in the UK. Travel is agreed before you book.' },
] as const;

export const VIDEO_SHOOTS = [
  {
    id: 'half' as const,
    name: 'Half-Day Content Shoot',
    price: formatPrice(VIDEO_PRICES.halfDay),
    hours: 'Up to 5 hours on location',
    body: 'I film your premises, products, services and the people behind them, using professional-grade cameras and a planned shot list. Made for small businesses.',
  },
  {
    id: 'full' as const,
    name: 'Full-Day Content Shoot',
    price: formatPrice(VIDEO_PRICES.fullDay),
    hours: 'Up to 8 hours on location',
    body: 'More time for several locations, a bigger range of products or longer filming. Same approach as the half day.',
  },
] as const;

export const VIDEO_EDITS = {
  name: '4 Promotional Videos',
  price: formatPrice(VIDEO_PRICES.editBundle),
  each: formatPrice(VIDEO_PER_VIDEO),
  withShoot: formatPrice(videoQuote('half', true).edits),
  saving: formatPrice(videoQuote('half', true).saving),
  body: 'Four short promotional videos, edited from the photos and footage I shoot at your business, plus your own assets. Ready for social, your website and adverts.',
  included: [
    'Four separate videos, 15 to 45 seconds each',
    'Made from your shoot photos, footage and logo',
    'Captions, colour and licensed music',
    'One revision round per video',
  ],
} as const;

export const VIDEO_SCOPE = [
  { title: 'You own it all', body: 'Every photo, clip and video from your shoot belongs to you. It is written into the agreement that comes with your invoice.' },
  { title: 'Raw footage is yours', body: 'Ask and you get the raw footage. Yes, even the take where I walk into a door.' },
  { title: 'Fast turnaround', body: 'Videos usually take 5 to 7 working days from your shoot.' },
  { title: 'One revision each', body: 'One round of changes per video. More complex animation is quoted separately.' },
  { title: 'Fair extras', body: 'A different crop, a resize or a logo swap? Reasonable asks are fine.' },
  { title: 'UK-wide', body: 'I come to you. Travel is agreed before you book, never a surprise.' },
  { title: 'Clean permissions', body: 'You confirm anyone filmed is happy to appear. I use licensed music.' },
] as const;
/**
 * Receptionist set-up fee: ONE switch for the whole site (copy, tests, docs).
 * LIVE value is 99, a one-off fee (approved by Maz, 18 Oct 2026). The cost
 * model (docs/maz-works/receptionist/PRICING-MODEL.md) shows a free set-up
 * takes about 7.0 months to pay back the founder's time; with a 99 fee it is
 * about 3.6 months. Change only this line and the docs that quote it.
 */
export const AFTER_HOURS_SETUP_FEE: number = 99;

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
  body: 'Give missed callers a way to explain what they need while you keep working. They hear your greeting, get answers from your information and leave a message for you to follow up.',
  forWho: 'Businesses where calls arrive while the owner is with a customer, on a job or away from the phone.',
  successCheck: 'Before subscribing, hear it answer as your business. Test a common question, a message and your urgent-call rule; check the summary reaches you.',
  price: '£79/month',
  monthly: 79,
  href: '/after-hours-receptionist',
  /** Fair-use minutes included each month. Over that, the price is agreed first, never billed by surprise. */
  minutes: 300,
  setupFee: AFTER_HOURS_SETUP_FEE,
  setup: AFTER_HOURS_SETUP_FEE > 0 ? `${formatPrice(AFTER_HOURS_SETUP_FEE)} set-up, once` : 'Set-up included',
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
export const PAYMENT_TERMS = 'A free preview, a written scope sheet and a fixed price before any work. You pay when you’ve seen it working, before it goes live. Bigger jobs are billed in stages you sign off. No VAT added.';

/**
 * What it keeps costing after the build, derived from CARE_PLANS (never typed).
 * Business System includes a first month of Care plan (Offer v12).
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
    starter: build([{ label: 'one automation task', price: OFFERS[0].from }, { label: '2 small set-ups', price: 2 * setup }]),
    'creator-starter': build([{ label: 'one automation task', price: CREATOR_OFFERS[0].from }, { label: '2 small set-ups', price: 2 * setup }]),
    'business-system': build([
      { label: 'first automation task', price: OFFERS[0].from },
      { label: '2 more tasks', price: 2 * extraJob },
      { label: 'weekly report', price: priceAmount(getExtra('Weekly report').price) },
      { label: 'team training', price: priceAmount(getExtra('Team training').price) },
      { label: '3 small set-ups', price: 3 * setup },
      { label: 'a month of care', price: priceAmount(CARE_PLANS[0].price) },
    ]),
    website: build([{ label: 'Launch Page', price: CREATOR_OFFERS[1].from }, { label: '4 more pages', price: 4 * page }]),
  };
})();

export const PRICE_RANGE = `${OFFERS[0].price}–${OFFERS[2].price.replace(/^From /, '')}+`;

/**
 * Stripe-hosted checkout links. Only configured offers show "Buy now".
 * The success URL is /start?package=<name>; payment is checked in Stripe.
 */
export const BUY_LINKS: Partial<Record<string, string>> = {
  // 'Starter Automation': 'https://buy.stripe.com/…',
  // 'Starter for creators': 'https://buy.stripe.com/…',
  [AFTER_HOURS.name]: 'https://buy.stripe.com/9B69ALam8eaJ2uweD6abK00',
  // (Small set-ups are not sold on their own since v12, so no link for them.)
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
/**
 * Referral reward, tiered by the job your referral buys (CRO Move 5, 18 Oct;
 * earlier a flat £50). The reward scales with the work, so the biggest jobs pay
 * the most. Nothing is paid until the referral pays their first invoice.
 */
export const REFERRAL_TIERS: { id: string; reward: string; job: string; note: string }[] = [
  { id: 'starter', reward: '£50', job: 'A Starter or a Launch Page', note: 'One task from the automation menu, or one page that books, sells or takes enquiries.' },
  { id: 'system', reward: '£150', job: 'A Business System, a Website or After-Hours call answering', note: 'Three jobs joined up, a five-page site, or calls answered when you can’t pick up.' },
  { id: 'custom', reward: '£300', job: 'Custom software', note: 'A portal, an app or a tool built around how you already work.' },
];
/** The reward most referrals earn: the Starter tier. Kept for copy that needs one number. */
export const REFERRAL_REWARD = REFERRAL_TIERS[0].reward;
/** Shown wherever the whole range is named. Derived, so the tiers stay the source. */
export const REFERRAL_RANGE = `${REFERRAL_TIERS[0].reward}–${REFERRAL_TIERS[REFERRAL_TIERS.length - 1].reward}`;

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

/** Small set-ups that come free with a Starter. */
const INCLUDED_SETUPS = 2;

/** Three or more tasks to build is a Business System, whatever the parts add up to. */
const BUSINESS_SYSTEM_JOBS = 3;

/**
 * Prices a set of chosen jobs by the offer rules above, for the
 * "Build my system" tool. Everything is read from this file:
 * - small set-ups are never sold alone: two ride free with a Starter, SETUP_PRICE each after that;
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
  // Small set-ups are not sold on their own (Maz, 2 Oct): they ride free with a Starter, SETUP_PRICE each beyond two.
  if (setups.length && !builds) { lines.unshift({ label: `${starter.name}: one task of your choice`, price: starter.price }); builds = 1; }
  setups.forEach((name, index) => lines.push({ label: `${name} (small set-up)`, price: index < INCLUDED_SETUPS ? 'Included' : SETUP_PRICE }));
  const total = lines.reduce((sum, line) => sum + priceAmount(line.price), 0);
  if (total > business.from) return packageQuote(business, `Your picks add up to ${formatPrice(total)} on their own, more than a ${business.name}, so I would quote that instead, with the weekly report included.`);
  if (builds >= BUSINESS_SYSTEM_JOBS) return packageQuote(business, `${builds} tasks to build is a ${business.name}: joined up, with the weekly report included.`);
  return { offer: builds ? starter : null, lines, total, totalLabel: formatPrice(total), workingBy: workingBy('starter'), note: 'Fixed price, agreed before any work starts. No VAT added.' };
}

/**
 * Complaints & Escalation Tracker (PROPOSED 19 Oct 2026, price needs Maz's go before it goes live).
 * A fixed-scope set-up on the tools the client already has: one intake form, an
 * acknowledgement email, a case log with deadline dates, escalation alerts and a
 * monthly summary. Drafting uses the client's own template wording and a person
 * approves every reply. It never promises regulatory compliance, resolution or savings.
 * Richer systems are quoted (Custom Software starts at £2,450).
 */
export const COMPLAINTS_SETUP = {
  id: 'complaints-tracker',
  name: 'Complaints & Escalation Tracker',
  price: 'From £795',
  from: 795,
  href: '/complaints',
  body: 'One place for every complaint, with replies and deadlines that stop slipping. Built on the tools you already use, and you see it working before you pay.',
  includes: [
    'An intake form (on your site, or a link) that logs each complaint the same way every time',
    'An automatic acknowledgement email in your wording',
    'A case log with your own acknowledge-by and reply-by dates',
    'Alerts to you or a colleague when a case is due soon or overdue',
    'Reply templates in your wording, drafted for a person to check and send',
    'A monthly summary: how many, what about, how long they took',
    'A written guide, one training session and 30 days of tweaks',
  ],
  notIncluded: [
    'Legal advice, or a promise that your process meets any regulator’s rules. Your own compliance lead or adviser decides that.',
    'Automatic replies or automatic resolution. A person approves every reply.',
    'Rebuilding your CRM or helpdesk, or moving old records (quoted separately).',
    'The monthly cost of the tools you choose, which you pay to those companies directly.',
  ],
  quoted: 'Several teams, a CRM or helpdesk integration, or evidence storage: quoted from a free scope call. Care from £39/month.',
} as const;

/**
 * B2B operations systems for professional practices (PROPOSED 19 Oct 2026 from Maz's brief;
 * every price here needs Maz's go before it goes live). One-off set-ups on the client's own
 * tools, sold through the same free preview and "no working, no invoice" terms as the ladder.
 * Wording rule: aims and typical times, never guarantees. Sending texts needs a paid texting
 * service the client pays directly.
 */
export const B2B_SYSTEMS = [
  { id: 'intake', name: 'Client Intake & Document Chaser', price: '£850', from: 850, tag: 'Accountants, solicitors, brokers',
    body: 'A secure upload link and a reminder every few days by email or text until the ID, proof of address and signed letters are in, filed to your Google Drive or OneDrive.' },
  { id: 'speed', name: 'Speed-to-Lead Reply', price: '£595', from: 595, tag: 'Anyone who pays for enquiries',
    body: 'A web-form or Google enquiry gets a text or email reply in about a minute, with your Cal.com booking link, and you are told.' },
  { id: 'proposal', name: 'Proposal Chaser', price: '£450–£750', from: 450, tag: 'Agencies and consultancies',
    body: 'A short run of polite follow-ups on quotes you sent from Xero, PandaDoc or DocuSign, stopped the moment they reply.' },
  { id: 'feedback', name: 'Feedback Filter', price: '£99', from: 99, tag: 'Add-on to any system',
    body: 'After a job, happy customers are sent to your Google review page and unhappy ones go to a private form that alerts you first.' },
  { id: 'digest', name: 'Monday Morning Digest', price: '£145', from: 145, tag: 'Add-on, or £79/month if you want it kept running',
    body: 'One email or WhatsApp message at 8am: money in, open proposals and new enquiries from the tools you already use.' },
] as const;

/** GoHighLevel partner pricing from docs/maz-works/PRICE-AUDIT-2026-10.md (gohighlevel.partners, checked 2 Oct 2026; $1 = £0.75, approximate). */
export const GHL_PARTNER = { setupUsd: 850, monthlyUsd: 38.8, usdToGbp: 0.75 } as const;
export const ghlThreeYearGbp = (): number => Math.round((GHL_PARTNER.setupUsd + GHL_PARTNER.monthlyUsd * 36) * GHL_PARTNER.usdToGbp / 10) * 10;
