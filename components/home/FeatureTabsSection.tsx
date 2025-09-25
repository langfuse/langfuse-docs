import { HomeSection } from "./components/HomeSection";
import { Header } from "../Header";
import { FeatureTabs, featureTabsData } from "./feature-tabs";

export default function FeatureTabsSection() {
  return (
    <HomeSection id="features">
        <FeatureTabs features={featureTabsData} />
    </HomeSection>
  );
}