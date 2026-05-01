import type { Metadata } from "next";
import { PricingPage } from "@/components/home/pricing";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Simple pricing for projects of all sizes. Get started on our Hobby plan without a credit card.",
};

export default function Pricing() {
  return <PricingPage isPricingPage />;
}
