import Link from "next/link";
import { Header } from "../../Header";
import { HomeSection } from "../components/HomeSection";
import { cn } from "@/lib/utils";
import React from "react";
import { PricingCalculator } from "./PricingCalculator";
import { PricingFAQ } from "./PricingFAQ";
import { PricingDiscounts } from "./PricingDiscounts";
import { PricingPlans, PricingTable } from "./PricingTable";

// Main PricingPage component
export function PricingPage({
  isPricingPage = false,
}: {
  isPricingPage?: boolean;
}) {
  return (
    <HomeSection id="pricing" className={cn(isPricingPage && "px-0 sm:px-0")}>
      <div className="isolate overflow-hidden">
        <div className="flow-root pb-16 lg:pb-0">
          <div className="mx-auto max-w-7xl">
            <Header
              title="Pricing"
              description="Get started on the Hobby plan for free. No credit card required."
              h="h1"
            />

            <PricingPlans />

            {isPricingPage && <PricingTable />}
          </div>
        </div>
        {isPricingPage ? (
          <>
            <div className="relative">
              <div className="mx-auto max-w-7xl px-6 py-12 sm:py-16 lg:px-8 mt-16">
                <PricingCalculator />
                <PricingDiscounts />
                <PricingFAQ />
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="text-center mt-10">
              For a detailed comparison and FAQ, see our{" "}
              <Link href="/pricing" className="underline">
                pricing page
              </Link>
              . You can also{" "}
              <Link href="/self-hosting" className="underline">
                self-host
              </Link>{" "}
              Langfuse OSS.
            </div>
          </>
        )}
      </div>
    </HomeSection>
  );
}
