/**
 * The five audiences a visitor can pick (footer chooser, or set by visiting a
 * /for/<guide> page). Once picked, the footer shows only their own world:
 * their line, their example video, their demo link and their signup offer.
 */
export type TradeKey = 'salon' | 'garage' | 'clinic' | 'cafe' | 'trades';

export type Trade = {
  key: TradeKey;
  label: string;
  /** Niche guide id: the /for page and the `trade=` value the free-plan form accepts. */
  guide: string;
  line: string;
  /** What the signup sends them, in their words. */
  offer: string;
};

export const TRADES: Trade[] = [
  {
    key: 'salon', label: 'Salon', guide: 'salons-and-beauty',
    line: 'Mid colour when the Instagram DM comes in? It gets answered and booked while you work, and Saturday gets a reminder the night before.',
    offer: 'One short email a month: one salon job that can run on its own, and how.',
  },
  {
    key: 'garage', label: 'Garage', guide: 'garages',
    line: 'Under a car when the phone goes? The caller gets a text back, the parts quote gets followed up and the MOT reminder goes out by itself.',
    offer: 'One short email a month: one garage job that can run on its own, and how.',
  },
  {
    key: 'clinic', label: 'Clinic', guide: 'clinics-and-therapists',
    line: 'With a client all day? Tomorrow’s confirmations go out on their own and a cancelled slot goes to the waiting list.',
    offer: 'One short email a month: one clinic job that can run on its own, and how.',
  },
  {
    key: 'cafe', label: 'Cafe', guide: 'cafes-and-food',
    line: 'Lunch rush when the catering enquiry lands? It gets a reply, the table for 8 gets confirmed, and you look up when it is quiet.',
    offer: 'One short email a month: one cafe job that can run on its own, and how.',
  },
  {
    key: 'trades', label: 'Trades', guide: 'heating-and-plumbing',
    line: 'On a roof when they ring? The quote from Tuesday gets followed up and the unpaid invoice gets a polite nudge.',
    offer: 'One short email a month: one trade job that can run on its own, and how.',
  },
];

/** Trade guides that belong to an audience; the other guides leave the choice alone. */
const GUIDE_TO_TRADE: Record<string, TradeKey> = {
  'salons-and-beauty': 'salon', 'dog-groomers': 'salon', garages: 'garage', 'clinics-and-therapists': 'clinic',
  'cafes-and-food': 'cafe', 'heating-and-plumbing': 'trades', roofers: 'trades', builders: 'trades', electricians: 'trades',
};

export const tradeForGuide = (guide: string): TradeKey | undefined => GUIDE_TO_TRADE[guide];
export const getTrade = (key: string | null | undefined) => TRADES.find((trade) => trade.key === key);

export const TRADE_STORAGE_KEY = 'mw-trade';
