import type { Metadata } from 'next';
import { SiteFooter, SiteHeader } from '../../site-chrome';
import { DemoMaker } from './demo-maker';
import '../voice-desk.css';

/** Maz's tool: fill in a prospect's details, get their personal demo link. Not indexed. */
export const metadata: Metadata = {
  alternates: { canonical: '/receptionist-demo/make' },
  title: { absolute: 'Make a receptionist demo link | Maz Works' },
  description: 'Make a personal after-hours receptionist demo link for a business.',
  robots: { index: false, follow: false, nocache: true },
};

export default function MakeDemoPage() {
  return (
    <main className="vd-page">
      <SiteHeader />
      <section className="vd-hero" id="main-content" tabIndex={-1} aria-labelledby="vm-title">
        <p className="eyebrow">Demo link maker</p>
        <h1 id="vm-title">Make a demo for one business.</h1>
        <p>Fill in what you know from their website or Google listing. The details live only in the link, so nothing is stored. Send them the link.</p>
      </section>
      <DemoMaker />
      <SiteFooter />
    </main>
  );
}
