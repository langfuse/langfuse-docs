"use client";

import Link from "next/link";
import { HomeSection } from "../HomeSection";
import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger } from "../../ui/tabs";
import { useState } from "react";
import React from "react";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { TextHighlight } from "@/components/ui/text-highlight";
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
      <span className="flex flex-row gap-x-1 items-center">
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
      <span className="flex flex-row gap-x-1 items-center">
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
    <HomeSection
      id="pricing"
      className={cn(
        "not-prose",
        isPricingPage &&
          "md:max-w-none xl:max-w-none px-4 sm:px-6 md:px-8 pt-8 md:pt-12"
      )}
    >
      <div className="isolate">
        <div className="flow-root pb-16 lg:pb-0">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col gap-4 mb-8 items-center text-center">
              <Heading as="h1" size="large">
                <TextHighlight>{deploymentOptions[variant].title}</TextHighlight>
              </Heading>
              <Text>{deploymentOptions[variant].subtitle}</Text>
            </div>

            {/* Deployment Options Tabs */}
            <Tabs
              defaultValue={variant}
              value={variant}
              className="flex justify-center mt-4"
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
              <div className={cn(
                "mx-auto max-w-7xl py-12 sm:py-16",
                variant === "cloud" ? "mt-16" : "mt-0"
              )}>
                {variant === "cloud" && <PricingCalculator />}
                <PricingDiscounts />
                <PricingFAQ />
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="mt-10 text-center">
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
