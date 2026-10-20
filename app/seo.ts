export const TITLE_LIMIT = 60;
export const DESCRIPTION_LIMIT = 155;
export function fitDescription(text: string, limit = DESCRIPTION_LIMIT): string {
  if (text.length <= limit) return text;
  return text.slice(0, limit - 1).replace(/\s+\S*$/, '').replace(/[,. :;]+$/, '') + '…';
}
export const SITE_TITLE = 'Business systems and complaints reporting | Maz Works';
export const SITE_DESCRIPTION = 'Maz Works helps businesses find and serve customers, improve how they work and understand complaints through practical websites, tools and reporting.';
export const OG_IMAGE = {url:'/og-card.png',width:1200,height:630,alt:'Maz Works builds practical customer systems, reporting and software.'};
