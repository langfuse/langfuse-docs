import type { Metadata } from "next";
import { PricingPage } from "@/components/home/pricing";

export const metadata: Metadata = {
  title: "Self-Hosted Pricing",
  description: "Deploy Langfuse OSS today. Upgrade to Enterprise at any time.",
  alternates: {
    // Markdown mirror from md-override/pricing-self-host.md.
    types: { "text/markdown": "https://langfuse.com/pricing-self-host.md" },
  },
};

export default function PricingSelfHost() {
  return <PricingPage isPricingPage initialVariant="selfHosted" />;
}
