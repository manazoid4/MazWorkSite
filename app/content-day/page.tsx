import type { Metadata } from 'next';
import { SiteFooter, SiteHeader } from '../site-chrome';
import { SITE_URL } from '../site';

export const metadata: Metadata = {
  title: { absolute: 'Content Day has moved | Maz Works' },
  alternates: { canonical: `${SITE_URL}/video` },
  robots: { index: false, follow: true },
};

/** Old /content-day links (outreach, bookmarks) land here; the offer is now the video packages. */
export default function ContentDayMoved() {
  return (
    <main>
      <SiteHeader />
      <section className="mw-resource-hero" id="main-content" tabIndex={-1}>
        <h1>Content Day is now Video and filming.</h1>
        <p>Half-day and full-day shoots, plus edited promotional videos, UK-wide.</p>
        <div className="mw-actions"><a className="button button-signal" href="/video">See the video packages</a></div>
      </section>
      <SiteFooter />
    </main>
  );
}
