import { fitDescription } from '../seo';
import type { Metadata } from "next";
import MazCoreConsole from "./MazCoreConsole";
import "./maz-core.css";

export const metadata: Metadata = {
  alternates: { canonical: '/maz-core' },
  title: "MAZ Core Console",
  description: fitDescription("Private client-side console for a user-supplied MAZ Core endpoint."),
  robots: { index: false, follow: false, nocache: true },
};

export default function MazCorePage() {
  return <MazCoreConsole />;
}
