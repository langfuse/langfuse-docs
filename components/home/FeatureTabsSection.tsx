import { Suspense } from "react";
import { HomeSection } from "./components/HomeSection";
import { FeatureTabs, featureTabsData } from "./feature-tabs";

export function FeatureTabsSection() {
  return (
    <HomeSection id="features" className="pt-8 lg:pt-4 2xl:pt-10">
      {/* Suspense required because FeatureTabs uses useSearchParams() */}
      <Suspense>
        <FeatureTabs features={featureTabsData} />
      </Suspense>
    </HomeSection>
  );
}
