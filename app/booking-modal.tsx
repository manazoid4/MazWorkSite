'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { BOOKING_URL } from './site';
import { rememberedAttribution, rememberedCampaign } from './linkedin-source';
import { trackConversion } from './analytics';

/**
 * "Book a 15-minute call": an ordinary link to Cal.com that opens the booking
 * page in a dialog on top of the current page. Without JavaScript, or if the
 * frame is blocked, the link opens Cal.com in the same way as before. The
 * visitor's campaign labels and the page they were on go into Cal.com's notes
 * field, which Cal.com shows on the booking.
 */
export function bookingUrl(page: string, interest: string, attribution: string, campaign: string): string {
  const url = new URL(BOOKING_URL);
  const notes = [`From ${page}`, interest && `Interested in: ${interest}`, attribution && `Campaign: ${attribution}`].filter(Boolean).join('. ');
  url.searchParams.set('notes', notes.slice(0, 300));
  if (campaign) url.searchParams.set('utm_source', campaign);
  return url.href;
}

export function BookCall({ className = 'button', interest = '', children = 'Book a 15-minute call' }: { className?: string; interest?: string; children?: ReactNode }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [href, setHref] = useState(BOOKING_URL);
  const [frame, setFrame] = useState('');

  useEffect(() => { setHref(bookingUrl(location.pathname, interest, rememberedAttribution(), rememberedCampaign())); }, [interest]);

  function open(event: React.MouseEvent<HTMLAnchorElement>) {
    if (!dialog.current || event.metaKey || event.ctrlKey || event.shiftKey) return;
    event.preventDefault();
    const url = new URL(href);
    url.searchParams.set('embed', 'true');
    setFrame(url.href);
    dialog.current.showModal();
    trackConversion('CTA clicked', { placement: 'book-call', page: location.pathname });
  }

  function close() { dialog.current?.close(); setFrame(''); }

  return (
    <>
      <a className={className} href={href} onClick={open}>{children}</a>
      <dialog ref={dialog} className="bk-dialog" aria-label="Book a 15-minute call" onClose={() => setFrame('')} onClick={(event) => { if (event.target === dialog.current) close(); }}>
        <div className="bk-bar">
          <a href={href} target="_blank" rel="noreferrer">Open in a new tab</a>
          <button type="button" className="button" onClick={close}>Close</button>
        </div>
        {frame && <iframe className="bk-frame" title="Book a 15-minute call with Maz Works" src={frame} loading="lazy" />}
      </dialog>
    </>
  );
}
