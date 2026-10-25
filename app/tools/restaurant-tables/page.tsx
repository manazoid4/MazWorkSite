import type { Metadata } from 'next';
import { Breadcrumbs } from '../../breadcrumbs';
import { fitDescription, OG_IMAGE } from '../../seo';
import { ENQUIRY_CTA, SITE_URL } from '../../site';
import { SiteFooter, SiteHeader } from '../../site-chrome';
import { TablePicker } from './table-picker';
import '../tools.css';

const PAGE_URL = `${SITE_URL}/tools/restaurant-tables`;
const TITLE = 'Restaurant table picker demo | Maz Works';
const DESCRIPTION = fitDescription('Try a table picker for a cafe or restaurant: choose a table on a floor plan, filter by party size and see the next step. A demonstration with made-up data.');

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: PAGE_URL, type: 'website', images: [OG_IMAGE] },
};

export default function RestaurantTablesPage() {
  return (
    <main className="tl-page">
      <SiteHeader />
      <Breadcrumbs items={[{ href: '/tools', label: 'Tools and demos' }, { label: 'Restaurant table picker' }]} />

      <section className="tl-hero" id="main-content" tabIndex={-1} aria-labelledby="rt-title">
        <p className="rx-tag" data-kind="concept">Interactive concept demo</p>
        <h1 id="rt-title">Pick your table, not just a time.</h1>
        <p className="rx-lede">Most booking forms ask for a time and a number, then leave the room to chance. This concept lets a guest see the floor, choose a window seat or a terrace table, and only be offered tables that suit their party.</p>
        <p className="tl-hero-note">Everything here is example data for a made-up cafe. Nothing is saved, sent or shared.</p>
      </section>

      <section className="tl-picker" aria-label="Table picker demo">
        <TablePicker />
      </section>

      <section className="tl-notes rx-split" style={{ '--rx-a': '4fr', '--rx-b': '7fr' } as React.CSSProperties} aria-labelledby="rt-notes-title">
        <h2 id="rt-notes-title" className="tl-h2">What this shows, and what it does not.</h2>
        <div className="rx-prose">
          <p>It shows how a guest could choose a place, not just a slot: sections, seats, availability and party size on one screen, usable by keyboard and on a phone.</p>
          <p>It does not take bookings. A working version needs a real booking system behind it, checks so two guests cannot be given the same table, and a simple way for staff to rearrange the room. I would scope that with you first.</p>
          <p><a className="rx-link" href="/contact?src=table-demo#contact">{ENQUIRY_CTA} <span aria-hidden="true">↗</span></a></p>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
