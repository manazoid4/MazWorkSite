export const TITLE_LIMIT = 60;
export const DESCRIPTION_LIMIT = 155;
export function fitDescription(text: string, limit = DESCRIPTION_LIMIT): string {
  if (text.length <= limit) return text;
  return text.slice(0, limit - 1).replace(/\s+\S*$/, '').replace(/[,. :;]+$/, '') + '…';
}
export const SITE_TITLE = 'Websites & Customer Operations | Maz Works';
export const SITE_DESCRIPTION = 'Thoughtful websites, customer journeys, complaints reporting and practical business workflows. Maz Works delivers considered work and fixed quotes.';
export const OG_IMAGE = {url:'/og-card.png',width:1200,height:630,alt:'Maz Works: websites, customer operations and practical business systems.'};
