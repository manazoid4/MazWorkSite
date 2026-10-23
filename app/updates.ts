export type MazWorksUpdate = {
  id: string;
  publishedAt: string;
  label: 'NEW' | 'BETTER' | 'FIXED';
  title: string;
  summary: string;
  items: string[];
};

/**
 * Customer-facing changes only. Keep this newest-first and factual: no invented
 * outcomes, usage numbers or performance claims.
 */
const ALL_UPDATES: MazWorksUpdate[] = [
 { id:'after-hours-receptionist',publishedAt:'2026-10-09',label:'NEW',title:'After-Hours Receptionist: calls answered when you can’t',summary:'Calls you miss are answered in your business name, a clear message is taken and a summary lands in your email.',items:['£79 a month plus a £99 set-up, month to month with a month’s notice.','Hear it answering as your business before your first month is billed.','Play an example call on the page, or talk to a demo in your browser.'] },
 { id:'pick-your-business',publishedAt:'2026-10-02',label:'NEW',title:'Pick your kind of business, see your fix and price',summary:'Trades, appointment businesses, creators and small offices each get one short page: your problems, three fixed-price ways in and a demo business.',items:['One short page per kind of business, with the problem, the fix and the price.','Every price on one page, with the details folded away until you want them.','One main button everywhere: Get my free preview.'] },
 { id:'build-my-system',publishedAt:'2026-09-30',label:'NEW',title:'Build your own system and see the price',summary:'Pick your trade and what costs you time, and see the systems and a fixed price straight away.',items:['Build my system: tap your headaches and send the plan straight to the free plan form.','A cost calculator that uses only your own numbers.','The phone on the homepage now plays: call, get the text, book.','Each trade guide shows its three most useful systems working.','The free plan form is now two short steps with a summary before you send.'] },
 { id:'systems-and-free-plan',publishedAt:'2026-09-30',label:'BETTER',title:'See the system before you ask',summary:'A shorter homepage and a fuller walkthrough of each package.',items:['See what happens from first enquiry to the next action, with prices alongside.','Free-plan requests now use an instant confirmation email, with a personal reply within 1 working day.'] },
  {
    id: 'easier-navigation',
    publishedAt: '2026-09-27',
    label: 'BETTER',
    title: 'Easier to find your way around',
    summary: 'Every page now carries the same map of the site, so prices, trade guides and objects are one or two taps away.',
    items: [
      'Phones get a labelled Menu button with every page, grouped into What I do, Who it’s for and More.',
      'A new Who it’s for page lists every trade guide, and each guide shows where you are with a Home / Who it’s for trail.',
      'The homepage has an On this page bar that jumps straight to prices, add-ons, the example plan and questions.',
      'A plain site map, this page and a helpful not-found page, so a wrong link never leaves you stuck.',
    ],
  },
  {
    id: 'architecture-models-drawings',
    publishedAt: '2026-09-27',
    label: 'NEW',
    title: 'Architecture models and drawings',
    summary: 'Objects now shows simple printed models and clear presentation drawings for architects, developers and builders.',
    items: [
      'Four illustrative drawings: a massing model with a QR plaque, a site plan, a floor plan and a scaffold elevation.',
      'A three-step way to ask: send the file and scale, get a fixed price, receive it with a plaque that opens the project page.',
      'Presentation drawings only. Structural, planning and scaffold design stay with your engineer or contractor.',
    ],
  },
  {
    id: 'simpler-packages',
    publishedAt: '2026-09-27',
    label: 'BETTER',
    title: 'Simpler packages you can compare',
    summary: 'Three packages side by side, add-ons that each say plainly what you get, and a clear list of what is not included.',
    items: [
      'A low-cost starting package so any business can try one job first.',
      'Add-ons grouped by what they help with: winning customers, getting found, less admin and team help.',
      'Promises spelled out: one fixed price agreed first, no contracts, no VAT added.',
      'Trade guides now lead with outcomes, like turning enquiries into booked jobs.',
    ],
  },
  {
    id: 'proof-first-enquiries',
    publishedAt: '2026-09-21',
    label: 'BETTER',
    title: 'Proof first, shorter enquiries',
    summary: 'The homepage now gets to real work sooner and asks for less before someone can contact Maz Works.',
    items: [
      'JobFilter and Scrap Finance Partners now appear before the services section, so inspectable work comes before more claims.',
      'The main enquiry starts with just name, email and the problem. Business, service and preferred next step are optional details.',
      'Pricing cards now lead directly into a contextual enquiry instead of ending as information-only cards.',
      'Measurement language is compact and explicit: agree what matters first rather than promise an invented percentage.',
    ],
  },
  {
    id: 'enquiry-recovery',
    publishedAt: '2026-09-20',
    label: 'FIXED',
    title: 'Enquiries no longer disappear on a bad send',
    summary: 'The contact flow now protects what a visitor typed and only reports success when delivery is explicitly confirmed.',
    items: [
      'Changing service context no longer throws away a part-written enquiry.',
      'Timeout, network and provider rejection states are handled separately.',
      'A failed send offers a prefilled email fallback carrying the enquiry details.',
      'Whitespace-only required fields now get a visible message and focus instead of failing silently.',
    ],
  },
  {
    id: 'clearer-site-language',
    publishedAt: '2026-09-19',
    label: 'BETTER',
    title: 'Clearer services and more readable type',
    summary: 'The site was rewritten around business problems rather than a list of technologies, while the smallest text was raised to a usable floor.',
    items: [
      'Services now start with outcomes: enquiries, repetitive admin, useful tools and physical products linked to digital actions.',
      'Duplicate process and proof explanations were consolidated instead of repeating the same journey twice.',
      'Package boundaries are explicit so starting prices do not read as open-ended promises.',
      'Work in progress is labelled as such rather than presented like finished client proof.',
    ],
  },
];

/** Only the last three updates are shown (audit 2 Oct): this page stays short and current. */
export const MAZ_WORKS_UPDATES: MazWorksUpdate[] = ALL_UPDATES.slice(0, 3);

export const LATEST_MAZ_WORKS_UPDATE = MAZ_WORKS_UPDATES[0];

export function formatUpdateDate(isoDate: string) {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${isoDate}T12:00:00Z`));
}
