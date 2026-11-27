import type { Metadata } from "next";
import { PricingPage } from "@/components/home/pricing";
import { buildPageUrl } from "@/lib/og-url";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Hobby is free with 50k units a month. Core is $29 a month and Pro is $199 a month with 3 years of data access. No credit card to start.",
  // Self-referencing canonical so query-param variants (e.g. ?calculatorOpen=true) consolidate to /pricing
  alternates: {
    canonical: "/pricing",
    types: { "text/markdown": buildPageUrl("/pricing.md") },
  },
};

export default function Pricing() {
  return <PricingPage isPricingPage />;
}
