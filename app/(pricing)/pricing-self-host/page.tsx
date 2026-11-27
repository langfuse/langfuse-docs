import type { Metadata } from "next";
import { PricingPage } from "@/components/home/pricing";
import { buildPageUrl } from "@/lib/og-url";

export const metadata: Metadata = {
  title: "Self-Hosted Pricing",
  description: "Deploy Langfuse OSS today. Upgrade to Enterprise at any time.",
  alternates: {
    types: { "text/markdown": buildPageUrl("/pricing-self-host.md") },
  },
};

export default function PricingSelfHost() {
  return <PricingPage isPricingPage initialVariant="selfHosted" />;
}
