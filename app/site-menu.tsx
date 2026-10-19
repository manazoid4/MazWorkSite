'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { MENU_LINKS } from './nav';

/**
 * Phone menu. A labelled "Menu" button (not a bare icon) opens a short list of
 * the main pages; the footer holds the full map. Closes on a link tap, Escape or a tap outside.
 */
export function SiteMenu() {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) document.body.dataset.menuOpen = '';
    else delete document.body.dataset.menuOpen;
    if (!open) return;
    const scrollLock = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') setOpen(false); };
    const onClick = (event: MouseEvent) => { if (wrap.current && !wrap.current.contains(event.target as Node)) setOpen(false); };
    document.addEventListener('keydown', onKey);
    document.addEventListener('click', onClick);
    return () => { document.removeEventListener('keydown', onKey); document.removeEventListener('click', onClick); document.body.style.overflow = scrollLock; };
  }, [open]);

  return (
    <div className="mw-menu" ref={wrap}>
      <button type="button" className="mw-menu-button" aria-expanded={open} aria-controls={panelId} onClick={() => setOpen((value) => !value)}>
        <span aria-hidden="true" className="mw-menu-icon" />
        {open ? 'Close' : 'Menu'}
      </button>
      <div className="mw-menu-backdrop" hidden={!open} onClick={() => setOpen(false)} />
      <div className="mw-menu-panel" id={panelId} hidden={!open} role="dialog" aria-label="Site menu">
        <button type="button" className="mw-menu-close" onClick={() => setOpen(false)}>Close</button>
        <ul>
          {MENU_LINKS.map((link) => <li key={link.href}><a href={link.href} onClick={() => setOpen(false)}>{link.label}</a></li>)}
        </ul>
      </div>
    </div>
  );
}
