import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { fitDescription, OG_IMAGE } from '../seo';
import { SITE_URL } from '../site';
import { SiteFooter, SiteHeader } from '../site-chrome';
import { KitIcon } from '../kit-icon';
import { CopyButton } from './copy-button';
import { LatePaymentCalculator } from './late-payment-calculator';
import { CATEGORIES, CHECKED, type ToolkitItem } from './toolkit';
import { MemberBadge, MemberJoin, MemberOnly, MemberProvider } from './member';

const LOCKED = CATEGORIES.flatMap((c) => c.items).filter((item) => !item.open).length;

/**
 * Free small business toolkit (22 Oct 2026, Maz): the useful parts of a paid
 * membership library, free forever. Every figure is checked against the
 * official source linked under it; content lives in toolkit.ts.
 */
const PAGE_URL = `${SITE_URL}/free-membership`;

export const metadata: Metadata = {
  title: 'The free membership',
  description: fitDescription('The free membership for UK small businesses, no subscription: late payment calculator and letters, tax deadlines, first employee checklist, data protection and health and safety basics, customer templates. Free forever.'),
  alternates: { canonical: PAGE_URL },
  openGraph: { title: 'The free membership for small businesses', url: PAGE_URL, images: [OG_IMAGE] },
};

const KIND_LABEL = { checklist: 'Checklist', template: 'Template', facts: 'Key facts' } as const;

function itemText(item: ToolkitItem) {
  return item.kind === 'template' ? item.text ?? '' : (item.points ?? []).map((p) => `- ${p}`).join('\n');
}

function Gate({ open, children }: { open?: boolean; children: ReactNode }) {
  return open ? <>{children}</> : <MemberOnly>{children}</MemberOnly>;
}

function Item({ item, id }: { item: ToolkitItem; id: string }) {
  return (
    <details className="mw-kit-item" id={id}>
      <summary>
        <span className="mw-kit-kind">{KIND_LABEL[item.kind]}{item.open ? <span className="mw-kit-free">Free</span> : <MemberBadge />}</span>
        <span className="mw-kit-item-title">{item.title}</span>
        <span className="mw-kit-when">{item.when}</span>
      </summary>
      <Gate open={item.open}><div className="mw-kit-body">
        {item.kind === 'template' && <pre>{item.text}</pre>}
        {item.kind === 'checklist' && (
          <ul className="mw-kit-checks">
            {item.points?.map((p) => <li key={p}><label><input type="checkbox" /> <span>{p}</span></label></li>)}
          </ul>
        )}
        {item.kind === 'facts' && <ul className="mw-kit-facts">{item.points?.map((p) => <li key={p}>{p}</li>)}</ul>}
        <div className="mw-kit-foot">
          <CopyButton text={itemText(item)} label={item.title} />
          {item.sources.length > 0 && (
            <span className="mw-kit-sources">Source: {item.sources.map((url, i) => (
              <a key={url} href={url}>{new URL(url).hostname.replace('www.', '')}{item.sources.length > 1 ? ` ${i + 1}` : ''}</a>
            ))}</span>
          )}
        </div>
      </div></Gate>
    </details>
  );
}

export default function FreeMembershipPage() {
  return (
    <main>
      <SiteHeader />
      <MemberProvider>

      <section className="mw-resource-hero" id="main-content" tabIndex={-1} aria-labelledby="toolkit-title">
        <p className="eyebrow">No subscription</p>
        <h1 id="toolkit-title">The free membership.</h1>
        <p>This is free, forever. Late payment letters, tax deadlines, templates and checklists for UK small businesses, all in one place.</p>
      </section>

      <MemberJoin count={LOCKED} />

      <nav className="mw-kit-grid" aria-label="Toolkit topics">
        {CATEGORIES.map((c) => (
          <a key={c.id} href={`#${c.id}`} className="mw-kit-tile">
            <span className="mw-kit-icon"><KitIcon name={c.icon} size={26} /></span>
            <span className="mw-kit-tile-title">{c.title}</span>
            <span className="mw-kit-tile-blurb">{c.blurb}</span>
            <span className="mw-kit-tile-count">{c.items.length + (c.id === 'getting-paid' ? 1 : 0)} tools · {c.items.filter((item) => item.open).length + (c.id === 'getting-paid' ? 1 : 0)} free</span>
          </a>
        ))}
      </nav>

      {CATEGORIES.map((c) => (
        <section key={c.id} id={c.id} className="mw-kit-section" aria-labelledby={`${c.id}-title`}>
          <div className="mw-kit-section-head">
            <span className="mw-kit-icon"><KitIcon name={c.icon} size={26} /></span>
            <div>
              <h2 id={`${c.id}-title`}>{c.title}</h2>
              <p>{c.blurb}</p>
            </div>
          </div>
          {c.id === 'getting-paid' && (
            <div className="mw-kit-feature">
              <h3>Late payment calculator</h3>
              <p>What a business customer owes you in interest and compensation when they pay late.</p>
              <LatePaymentCalculator />
            </div>
          )}
          <div className="mw-kit-items">
            {c.items.map((item, i) => <Item key={item.title} item={item} id={`${c.id}-${i + 1}`} />)}
          </div>
        </section>
      ))}

      <p className="mw-kit-note">Guides and templates, not legal or tax advice. Figures checked against the official sources linked on {CHECKED}. Fill in the [brackets] before sending.</p>

      </MemberProvider>
      <SiteFooter />
    </main>
  );
}
