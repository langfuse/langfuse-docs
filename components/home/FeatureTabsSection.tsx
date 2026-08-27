"use client";

import { Suspense } from "react";
import { HomeSection } from "./HomeSection";
import { FeatureTabs, featureTabsData } from "./feature-tabs";
import { mobileFeatureTabsData } from "./feature-tabs/data";

export function FeatureTabsSection() {
  return (
    <HomeSection id="overview" className="pt-[120px]">
      <Suspense>
        <FeatureTabs
          features={featureTabsData}
          mobileFeature={mobileFeatureTabsData}
        />
      </Suspense>
    </HomeSection>
  );
}
