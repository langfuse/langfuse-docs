import type { Metadata } from "next";
import { LaunchWeek5Landing } from "@/components/launch-week-5/LaunchWeek5Landing";
import { buildDefaultSiteOgImageUrl } from "@/lib/og-url";

const ogImageUrl = buildDefaultSiteOgImageUrl();

export const metadata: Metadata = {
  title: "Langfuse Launch Week #5",
  description:
    "Five days, five feature drops, May 25–29, 2026. New building blocks for taking AI from prototype to production — unveiled live at ClickHouse OpenHouse.",
  alternates: {
    canonical: "https://langfuse.com/launch-week-5",
  },
  // Next.js replaces (not deep-merges) openGraph across segments, so the root
  // layout's default `images` is dropped unless re-supplied here.
  openGraph: {
    title: "Langfuse Launch Week #5",
    description:
      "Five days, five feature drops, May 25–29, 2026. Live demos at ClickHouse OpenHouse.",
    url: "https://langfuse.com/launch-week-5",
    images: [{ url: ogImageUrl }],
  },
};

export default function LaunchWeek5Page() {
  return <LaunchWeek5Landing />;
}
