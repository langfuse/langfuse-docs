import type { Metadata } from "next";
import { GovernmentLanding } from "@/components/government/GovernmentLanding";
import { buildOgImageUrl } from "@/lib/og-url";

const title = "Langfuse for Government";
const description =
  "Open-source observability and evaluations for AI agents. Self-host in air-gapped, on-premises, and cloud environments. Langfuse Cloud for Government coming soon.";

const ogImageUrl = buildOgImageUrl({ title, description });

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "https://langfuse.com/government",
  },
  openGraph: {
    title,
    description,
    url: "https://langfuse.com/government",
    images: [{ url: ogImageUrl }],
  },
};

export default function GovernmentPage() {
  return <GovernmentLanding />;
}
