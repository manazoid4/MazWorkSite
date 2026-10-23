export const TITLE_LIMIT = 60;
export const DESCRIPTION_LIMIT = 155;
export function fitDescription(text: string, limit = DESCRIPTION_LIMIT): string {
  if (text.length <= limit) return text;
  return text.slice(0, limit - 1).replace(/\s+\S*$/, '').replace(/[,. :;]+$/, '') + '…';
}
export const SITE_TITLE = 'Customer systems for UK businesses | Maz Works';
export const SITE_DESCRIPTION = 'I help UK businesses get customers, serve them well and see what needs fixing, with practical websites, connected tools, reporting and software.';
export const OG_IMAGE = {url:'/og-card.png',width:1200,height:630,alt:'Maz Works builds practical customer systems, reporting and software.'};
