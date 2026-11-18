import type { Metadata } from "next";
import { AdventCalendar } from "@/components/advent/AdventCalendar";
import { buildDefaultSiteOgImageUrl } from "@/lib/og-url";

const ogImageUrl = buildDefaultSiteOgImageUrl();
const description =
  "The Langfuse AI Gateway Advent calendar: 24 doors, 24 features. A new door opens every day from December 1 to 24.";

export const metadata: Metadata = {
  title: "Gateway to Christmas: the Langfuse AI Gateway Advent calendar",
  description,
  alternates: {
    canonical: "https://langfuse.com/advent",
  },
  // Next.js replaces (not deep-merges) openGraph across segments, so the root
  // layout's default `images` is dropped unless re-supplied here.
  openGraph: {
    type: "website",
    title: "Gateway to Christmas: the Langfuse AI Gateway Advent calendar",
    description,
    url: "https://langfuse.com/advent",
    images: [{ url: ogImageUrl }],
  },
};

export default function AdventPage() {
  return <AdventCalendar />;
}
