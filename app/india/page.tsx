import type { Metadata } from "next";
import { IndiaLanding } from "@/components/india/IndiaLanding";
import { buildDefaultSiteOgImageUrl } from "@/lib/og-url";

const ogImageUrl = buildDefaultSiteOgImageUrl();

export const metadata: Metadata = {
  title: "Langfuse Cloud India — LLM Observability Hosted in Mumbai",
  description:
    "Langfuse Cloud India launches in early 2027 on AWS and ClickHouse Cloud in Mumbai (ap-south-1) so customer data stays in India. Register for the waitlist or talk to our India team.",
  alternates: {
    canonical: "https://langfuse.com/india",
  },
  // Next.js replaces (not deep-merges) openGraph across segments, so the root
  // layout's default `images` is dropped unless re-supplied here.
  openGraph: {
    type: "website",
    title: "Langfuse Cloud India — LLM Observability Hosted in Mumbai",
    description:
      "Hosted on AWS and ClickHouse Cloud in Mumbai (ap-south-1) so customer data stays in India. Launching in early 2027.",
    url: "https://langfuse.com/india",
    images: [{ url: ogImageUrl }],
  },
};

export default function IndiaPage() {
  return <IndiaLanding />;
}
