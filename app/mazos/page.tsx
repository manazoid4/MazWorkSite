import { fitDescription } from '../seo';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Page moved',
  description: fitDescription('The MAZos concept page has moved into the main Maz Works portfolio.'),
  alternates: { canonical: '/' },
  robots: { index: false, follow: true },
};

export default function Page() {
  return (
    <main>
      <header className="site-header">
        <Link className="brand" href="/">
          <span className="brand-mark">MW</span>
          <span><strong>Maz Works</strong><small>by Manazir Hussain</small></span>
        </Link>
        <nav aria-label="Page navigation">
          <Link href="/proof#built">Work</Link><Link href="/#pricing">What I build</Link><Link href="/contact#contact">Contact</Link>
        </nav>
      </header>
      <section className="moved-page" id="main-content" tabIndex={-1} aria-labelledby="moved-title">
        <p className="eyebrow">Portfolio update</p>
        <h1 id="moved-title">This page has moved.</h1>
        <p className="hero-copy">The MAZos concept is no longer a separate page. The shipped projects it used to describe now live in the Maz Works portfolio, described by outcome.</p>
        <Link className="button button-dark" href="/proof#built">View Maz Works</Link>
      </section>
    </main>
  );
}
