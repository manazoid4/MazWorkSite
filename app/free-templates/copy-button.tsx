'use client';

import { useRef, useState } from 'react';

export function CopyButton({ text, label }: { text: string; label: string }) {
  const [status, setStatus] = useState('');
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const show = (message: string) => {
    setStatus(message);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setStatus(''), 2500);
  };
  const copy = () => {
    if (!navigator.clipboard) return show('Copy failed, select the text');
    navigator.clipboard.writeText(text).then(() => show('Copied'), () => show('Copy failed, select the text'));
  };
  return (
    <>
      <button type="button" className="button button-dark" aria-label={`Copy: ${label}`} onClick={copy}>
        {status === 'Copied' ? 'Copied' : 'Copy'}
      </button>
      <span className="mw-template-status" role="status">{status}</span>
    </>
  );
}
