import type { Metadata } from 'next';
import { HealthReport } from '../../reports';
import '../../../b2b.css';
import '../../samples.css';

/** Printable sample, rendered to the downloadable PDF by scripts/make-complaint-samples.mjs. Invented data. */
export const metadata: Metadata = {
  title: 'Sample Complaints Health Check report',
  description: 'A fictional example of the Maz Works Complaints Health Check report, built from invented data.',
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <main id="main-content" tabIndex={-1} className="sx-print-page" style={{ padding: '24px 20px' }}>
      <HealthReport />
    </main>
  );
}
