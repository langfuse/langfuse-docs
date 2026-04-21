import type { Metadata } from "next";
import { PricingPage } from "@/components/home/pricing";

export const metadata: Metadata = {
  title: "Self-Hosted Pricing",
  description:
    "Deploy Langfuse OSS today. Upgrade to Enterprise at any time.",
};

export default function PricingSelfHost() {
  return <PricingPage isPricingPage initialVariant="selfHosted" />;
}
