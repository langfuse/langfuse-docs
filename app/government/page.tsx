import type { Metadata } from "next";
import { GovernmentLanding } from "@/components/government/GovernmentLanding";
import { buildOgImageUrl } from "@/lib/og-url";

const title = "Langfuse for Government";
const description =
  "Open-source observability and evaluations for AI agents. Deploy Langfuse in air-gapped, on-premises, and cloud environments — and keep traces, prompts, and evaluation data inside your security boundary.";

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
