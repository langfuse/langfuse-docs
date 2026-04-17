"use client";

import { Suspense } from "react";
import { HomeSection } from "./HomeSection";
import { FeatureTabs, featureTabsData } from "./feature-tabs";
import { Heading } from "../ui/heading";
import { TextHighlight } from "../ui/text-highlight";

export function FeatureTabsSection() {
  return (
    <HomeSection id="overview" className="pt-[120px]">
      <div className="flex items-start mb-6 md:hidden">
        <Heading className="text-left">
          Gain <TextHighlight className="whitespace-nowrap">deep visibility</TextHighlight> into your traces
        </Heading>
      </div>

      <Suspense>
        <FeatureTabs features={featureTabsData} mobileFeature={featureTabsData[0]} />
      </Suspense>
    </HomeSection>
  );
}
