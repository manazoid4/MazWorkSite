
export const TITLE_LIMIT = 60;
export const DESCRIPTION_LIMIT = 155;
export function fitDescription(text: string, limit = DESCRIPTION_LIMIT): string {
  if (text.length <= limit) return text;
  return text.slice(0, limit - 1).replace(/\s+\S*$/, '').replace(/[,. :;]+$/, '') + '…';
}
export const SITE_TITLE = 'Practical business improvement | Maz Works';
export const SITE_DESCRIPTION = 'Practical help for customer journeys and business operations. Manazir Hussain: Computer Science graduate, five years in financial complaints and business accounts.';
export const OG_IMAGE = {url:'/og-card.png',width:1200,height:630,alt:'Practical business improvements from Maz Works.'};
