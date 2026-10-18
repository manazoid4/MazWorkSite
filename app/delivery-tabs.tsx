'use client';

import { useEffect, useState } from 'react';
import { DELIVERY } from './offers';
import './interactive.css';

const OWN = 'Your accounts, your customer data, and everything I build. A written handover explains how it works. You can remove my access.';
const NEED = 'Add me as a user to the tools we agree on; never send passwords. Allow one setup call if the job needs it, and sign off the test before launch. You do not need a call to request your free preview.';

const TABS = [
  ...DELIVERY.map((item) => ({ title: item.title, body: item.body })),
  { title: 'What you own at the end', body: OWN },
  { title: 'What I need from you', body: NEED },
];

/**
 * "How I set it up": six short answers as tappable chips, one visible at a
 * time. Every answer is in the page for search and for no-JavaScript readers;
 * with JavaScript only the chosen one shows.
 */
export function DeliveryTabs() {
  const [active, setActive] = useState(0);
  const [live, setLive] = useState(false);
  useEffect(() => setLive(true), []);
  return (
    <div className="dt" data-live={live || undefined}>
      <h3>How I set it up</h3>
      <div className="dt-chips" role="tablist" aria-label="How I set it up">
        {TABS.map((tab, index) => (
          <button key={tab.title} type="button" role="tab" id={`dt-tab-${index}`} aria-selected={active === index} aria-controls={`dt-panel-${index}`} className={`dt-chip${active === index ? ' is-on' : ''}`} data-tone={index % 6} onClick={() => setActive(index)}>{tab.title}</button>
        ))}
      </div>
      {TABS.map((tab, index) => (
        <div key={tab.title} role="tabpanel" id={`dt-panel-${index}`} aria-labelledby={`dt-tab-${index}`} className="dt-panel" data-tone={index % 6} hidden={live && active !== index}>
          <strong>{tab.title}</strong>
          <p>{tab.body}</p>
          <button type="button" className="dt-next" onClick={() => setActive((index + 1) % TABS.length)}>Next: {TABS[(index + 1) % TABS.length].title} →</button>
        </div>
      ))}
    </div>
  );
}
