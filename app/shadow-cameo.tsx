'use client';

import { useState } from 'react';

const REACTIONS = [
  'Mrrp. Quality check passed.',
  'Shadow approves of fewer clicks and more naps.',
  'A little purr-sonality goes a long way.',
  'The site supervisor requests another biscuit.',
];

function getReaction(pats: number): string {
  if (pats === 3) return "Easter egg: Shadow isn't asleep. He's reviewing the UX.";
  if (pats === 5) return 'Achievement unlocked: Chief Nap Officer.';
  if (pats === 9) return 'Secret policy: all meetings require a biscuit break.';
  return REACTIONS[(pats - 1) % REACTIONS.length];
}

export function ShadowCameo() {
  const [pats, setPats] = useState(0);
  const promoted = pats >= 5;

  return (
    <figure className={`s-shadow-cameo${promoted ? ' s-shadow-promoted' : ''}`}>
      <button
        className="s-shadow-pet"
        type="button"
        aria-label="Give Shadow the cat a pat"
        title="Give Shadow a pat"
        onClick={() => setPats((count) => count + 1)}
      >
        <span className="s-shadow-picture" key={pats}>
          <img
            src="/shadow-mascot.png"
            alt="A curled grey cat mascot keeping watch beside the example"
            width={900}
            height={721}
            draggable={false}
          />
        </span>
        <span className="s-shadow-hint" aria-hidden="true">Psst… pet Shadow</span>
        {promoted && <span className="s-shadow-star" aria-hidden="true">★</span>}
      </button>
      <figcaption>Shadow: quality control, mostly naps.</figcaption>
      <span className="s-shadow-response" role="status" aria-live="polite" aria-atomic="true">
        {pats ? getReaction(pats) : ''}
      </span>
    </figure>
  );
}
