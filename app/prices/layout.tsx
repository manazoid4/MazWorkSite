import { Bricolage_Grotesque } from 'next/font/google';
import './prices.css';

const display = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--pz-display',
  display: 'swap',
});

export default function PricesLayout({ children }: { children: React.ReactNode }) {
  return <div className={`${display.variable} pz`}>{children}</div>;
}
