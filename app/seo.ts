import { OFFERS } from './offers';
export const TITLE_LIMIT = 60;
export const DESCRIPTION_LIMIT = 155;
export function fitDescription(text: string, limit = DESCRIPTION_LIMIT): string {
  if (text.length <= limit) return text;
  return text.slice(0, limit - 1).replace(/\s+\S*$/, '').replace(/[,. :;]+$/, '') + '…';
}
export const SITE_TITLE = 'Small business automation UK: calls, bookings | Maz Works';
export const SITE_DESCRIPTION = `Turn enquiries into bookings and take admin off your plate. Automation from ${OFFERS[0].price}. Free preview and fixed price for UK small businesses.`;
export const OG_IMAGE = {url:'/og-card.png',width:1200,height:630,alt:`Maz Works: business systems and automation from ${OFFERS[0].price}.`};
