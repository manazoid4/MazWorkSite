import type { ReactNode } from 'react';

type Item = { title: string; body?: string; big?: string; highlight?: boolean };

/** Numbered steps: replaces a paragraph that walks through a process. */
export function Steps({ items, four }: { items: Item[]; four?: boolean }) {
  return (
    <ol className={`mw-steps${four ? ' mw-four' : ''}`}>
      {items.map((item, i) => <li key={item.title}><b>{String(i + 1).padStart(2, '0')}</b><strong>{item.title}</strong>{item.body ? <span>{item.body}</span> : null}</li>)}
    </ol>
  );
}

/** Short cards: replaces a bullet list or a block of text. */
export function Cards({ items, two }: { items: Item[]; two?: boolean }) {
  return (
    <ul className={`mw-cards${two ? ' mw-two' : ''}`}>
      {items.map(item => <li key={item.title} className={item.highlight ? 'mw-hl' : undefined}>{item.big ? <span className="mw-big">{item.big}</span> : null}<strong>{item.title}</strong>{item.body ? <span>{item.body}</span> : null}</li>)}
    </ul>
  );
}

export function Chips({ items }: { items: string[] }) {
  return <ul className="mw-chips">{items.map(i => <li key={i}>{i}</li>)}</ul>;
}

export function InfoSection({ id, eyebrow, title, children }: { id?: string; eyebrow?: string; title: string; children: ReactNode }) {
  return (
    <section className="mw-info" id={id} aria-label={title}>
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <h2>{title}</h2>
      {children}
    </section>
  );
}
