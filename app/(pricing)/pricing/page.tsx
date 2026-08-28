import type { Metadata } from "next";
import { PricingPage } from "@/components/home/pricing";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Simple pricing for projects of all sizes. Get started on our Hobby plan without a credit card.",
  // Self-referencing canonical so query-param variants (e.g. ?calculatorOpen=true) consolidate to /pricing
  alternates: {
    canonical: "/pricing",
  },
};

export default function Pricing() {
  return <PricingPage isPricingPage />;
}
