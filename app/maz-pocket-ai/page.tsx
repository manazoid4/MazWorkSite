import { fitDescription } from '../seo';
import type { Metadata } from "next";
import MazPocketAiBridge from "./MazPocketAiBridge";
import "./maz-pocket-ai.css";

export const metadata: Metadata = {
  alternates: { canonical: '/maz-pocket-ai' },
  title: "MAZ Pocket AI Bridge",
  description: fitDescription("Private capability-link client for MAZ Pocket through MAZ Core."),
  robots: { index: false, follow: false, nocache: true },
};

export default function MazPocketAiPage() {
  return <MazPocketAiBridge />;
}
