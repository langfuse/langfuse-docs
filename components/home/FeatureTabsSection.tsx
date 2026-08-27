"use client";

import { Suspense } from "react";
import { HomeSection } from "./HomeSection";
import { FeatureTabs, featureTabsData } from "./feature-tabs";
import { Heading } from "../ui/heading";
import { TextHighlight } from "../ui/text-highlight";
import { mobileFeatureTabsData } from "./feature-tabs/data";

export function FeatureTabsSection() {
  const mobileFeature = featureTabsData[0];

  return (
    <HomeSection id="overview" className="pt-[120px]">
      <div className="flex flex-col items-start mb-6 md:hidden">
        {mobileFeature?.name ? (
          <p className="mb-1 text-sm font-medium text-primary">
            {mobileFeature.name}
          </p>
        ) : null}
        <Heading className="text-left">
          Gain{" "}
          <TextHighlight className="whitespace-nowrap">
            deep visibility
          </TextHighlight>{" "}
          into your traces
        </Heading>
      </div>

      <Suspense>
        <FeatureTabs
          features={featureTabsData}
          mobileFeature={mobileFeatureTabsData}
        />
      </Suspense>
    </HomeSection>
  );
}
