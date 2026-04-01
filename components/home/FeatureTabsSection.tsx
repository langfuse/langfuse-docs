import { Suspense } from "react";
import { HomeSection } from "./HomeSection";
import { FeatureTabs, featureTabsData } from "./feature-tabs";

export function FeatureTabsSection() {
  return (
    <HomeSection id="features" className="pt-20 lg:pt-10 2xl:pt-20">
      {/* Suspense required because FeatureTabs uses useSearchParams() */}
      <Suspense>
        <FeatureTabs features={featureTabsData} />
      </Suspense>
    </HomeSection>
  );
}
