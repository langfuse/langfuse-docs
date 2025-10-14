import Link from "next/link";
import { Header } from "../../Header";
import { HomeSection } from "../components/HomeSection";
import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger } from "../../ui/tabs";
import { useState } from "react";
import React from "react";
import { PricingCalculator } from "./PricingCalculator";
import { PricingFAQ } from "./PricingFAQ";
import { PricingDiscounts } from "./PricingDiscounts";
import { PricingPlans, PricingTable } from "./PricingTable";

type DeploymentOption = "cloud" | "selfHosted";

type DeploymentOptionParams = {
  switch: React.ReactNode;
  title: string;
  subtitle: string;
  href: string;
};

const deploymentOptions: Record<DeploymentOption, DeploymentOptionParams> = {
  cloud: {
    switch: (
      <span className="flex flex-row items-center gap-x-1">
        Langfuse Cloud
        <span className="hidden md:block"> (we host)</span>
      </span>
    ),
    title: "Pricing",
    subtitle:
      "Get started on the Hobby plan for free. No credit card required.",
    href: "/pricing",
  },
  selfHosted: {
    switch: (
      <span className="flex flex-row items-center gap-x-1">
        Self-hosted
        <span className="hidden md:block"> (you host)</span>
      </span>
    ),
    title: "Pricing",
    subtitle: "Deploy Langfuse OSS today. Upgrade to Enterprise at any time.",
    href: "/pricing-self-host",
  },
};

// Main PricingPage component
export function PricingPage({
  isPricingPage = false,
  initialVariant = "cloud",
}: {
  isPricingPage?: boolean;
  initialVariant?: "cloud" | "selfHosted";
}) {
  const [localVariant, setLocalVariant] = useState(initialVariant);
  const variant = isPricingPage ? initialVariant : localVariant;

  return (
    <HomeSection id="pricing" className={cn(isPricingPage && "px-0 sm:px-0")}>
      <div className="isolate overflow-hidden">
        <div className="flow-root pb-16 lg:pb-0">
          <div className="mx-auto max-w-7xl">
            <Header
              title={deploymentOptions[variant].title}
              description={deploymentOptions[variant].subtitle}
              h="h1"
            />

            {/* Deployment Options Tabs */}
            <Tabs
              defaultValue={variant}
              value={variant}
              className="mt-4 flex justify-center"
              onValueChange={(value) => {
                if (!isPricingPage) {
                  setLocalVariant(value as "cloud" | "selfHosted");
                }
              }}
            >
              <TabsList className="mx-auto">
                {Object.keys(deploymentOptions).map((key) => (
                  <TabsTrigger key={key} value={key} asChild={isPricingPage}>
                    {isPricingPage ? (
                      <Link href={deploymentOptions[key].href}>
                        {deploymentOptions[key].switch}
                      </Link>
                    ) : (
                      deploymentOptions[key].switch
                    )}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>

            {/* Pricing Cards Grid */}
            <PricingPlans variant={variant} />

            {isPricingPage && (
              <PricingTable variant={variant} isPricingPage={isPricingPage} />
            )}
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
              <Link
                href={deploymentOptions[variant].href}
                className="underline"
              >
                pricing page
              </Link>
              .
            </div>
          </>
        )}
      </div>
    </HomeSection>
  );
}

export default PricingPage;
