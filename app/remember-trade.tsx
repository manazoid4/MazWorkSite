'use client';

import { useEffect } from 'react';
import { TRADE_STORAGE_KEY, type TradeKey } from './trades';

/** A /for/<guide> page tells the footer which world this visitor is in. */
export function RememberTrade({ trade }: { trade: TradeKey }) {
  useEffect(() => {
    try { localStorage.setItem(TRADE_STORAGE_KEY, trade); } catch { /* storage blocked: footer stays generic */ }
    window.dispatchEvent(new Event('mw-trade'));
  }, [trade]);
  return null;
}
