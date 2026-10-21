'use client';

import { useState } from 'react';
import { VIDEO_EDITS, VIDEO_SHOOTS, formatPrice, videoQuote, type VideoShoot } from '../offers';
import { WHATSAPP_URL } from '../site';

const SHOOT_LABEL: Record<VideoShoot, string> = { none: 'No filming (editing only)', half: 'Half-Day Content Shoot', full: 'Full-Day Content Shoot' };

/** Package picker: totals come from videoQuote() in offers.ts, never from numbers typed here. */
export function VideoSelector() {
  const [shoot, setShoot] = useState<VideoShoot>('half');
  const [edits, setEdits] = useState(true);
  const q = videoQuote(shoot, edits);
  const summary = [shoot !== 'none' ? SHOOT_LABEL[shoot] : '', edits ? VIDEO_EDITS.name : ''].filter(Boolean).join(' + ');
  const empty = q.total === 0;
  const message = `Hi, I'd like to ask about: ${summary || 'video services'}${empty ? '' : ` (${formatPrice(q.total)})`}.`;
  return (
    <div className="vid-selector">
      <fieldset>
        <legend>1. Filming</legend>
        {(['half', 'full', 'none'] as const).map(id => {
          const item = VIDEO_SHOOTS.find(s => s.id === id);
          return (
            <label key={id} className="vid-option">
              <input type="radio" name="shoot" value={id} checked={shoot === id} onChange={() => setShoot(id)} />
              <span><strong>{SHOOT_LABEL[id]}</strong>{item ? ` · ${item.price}` : ''}</span>
            </label>
          );
        })}
      </fieldset>
      <fieldset>
        <legend>2. Editing (optional)</legend>
        <label className="vid-option">
          <input type="checkbox" checked={edits} onChange={e => setEdits(e.target.checked)} />
          <span><strong>{VIDEO_EDITS.name}</strong> · {VIDEO_EDITS.price}{shoot === 'none' ? '' : ` → ${formatPrice(videoQuote(shoot, true).edits)} with a shoot`}</span>
        </label>
      </fieldset>
      <div className="vid-total" aria-live="polite">
        {shoot !== 'none' ? <p>Filming <strong>{formatPrice(q.filming)}</strong></p> : null}
        {edits ? <p>Four edits <strong>{formatPrice(q.editsFull)}</strong></p> : null}
        {q.saving > 0 ? <p className="vid-saving">20% off the edits when booked with a shoot <strong>−{formatPrice(q.saving)}</strong></p> : null}
        <p className="vid-sum">Total <strong>{formatPrice(q.total)}</strong></p>
        {q.saving > 0 ? <p className="s-small">The 20% applies to the editing only. The filming fee is not discounted.</p> : null}
      </div>
      <div className="mw-actions">
        <a className="button button-signal" href="/contact?service=video#contact">Enquire about this</a>
        <a className="button" href={`${WHATSAPP_URL}?text=${encodeURIComponent(message)}`} rel="noopener">Ask on WhatsApp</a>
      </div>
    </div>
  );
}
