'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';

/**
 * LinkedIn Insight Tag. Off until NEXT_PUBLIC_LINKEDIN_PARTNER_ID is set at build time AND the
 * visitor has agreed to marketing cookies (localStorage "mw-ads-consent" = "yes", to be set by a
 * consent banner). The CSP in vercel.json must also allow snap.licdn.com and px.ads.linkedin.com
 * when this is switched on; see HANDOFF.md.
 */
const PARTNER_ID = process.env.NEXT_PUBLIC_LINKEDIN_PARTNER_ID || '';

export function LinkedInInsight() {
  const [consent, setConsent] = useState(false);
  useEffect(() => { try { setConsent(localStorage.getItem('mw-ads-consent') === 'yes'); } catch { /* storage blocked */ } }, []);
  if (!/^\d{4,10}$/.test(PARTNER_ID) || !consent) return null;
  return (
    <Script id="linkedin-insight" strategy="afterInteractive">{`_linkedin_partner_id=${JSON.stringify(PARTNER_ID)};window._linkedin_data_partner_ids=window._linkedin_data_partner_ids||[];window._linkedin_data_partner_ids.push(_linkedin_partner_id);(function(l){if(!l){window.lintrk=function(a,b){window.lintrk.q.push([a,b])};window.lintrk.q=[]}var s=document.getElementsByTagName("script")[0];var b=document.createElement("script");b.type="text/javascript";b.async=true;b.src="https://snap.licdn.com/li.lms-analytics/insight.min.js";s.parentNode.insertBefore(b,s)})(window.lintrk);`}</Script>
  );
}
