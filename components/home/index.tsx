import dynamic from "next/dynamic";

// Non-dynamic imports for everyhting that renders on top
import { Background } from "../Background";
import { Hero } from "./Hero";
import { FeatureTabsSection } from "./FeatureTabsSection";

import { Usage } from "./Usage";

const IntegrationsGrid = dynamic(() => import("./IntegrationsGrid"), {
  ssr: false,
});
const OpenSource = dynamic(() => import("./OpenSource"), {
  ssr: false,
});
const Pricing = dynamic(() => import("./Pricing"), {
  ssr: false,
});
const Security = dynamic(() => import("./Security"), {
  ssr: false,
});
const WallOfLove = dynamic(() => import("./WallOfLove"), {
  ssr: false,
});
const CustomerStories = dynamic(() => import("./CustomerStories"), {
  ssr: false,
});
const CTAGetStarted = dynamic(() => import("./CTAGetStarted"), {
  ssr: false,
});

export const Home = () => (
  <>
    <main className="relative overflow-hidden w-full">
      <Hero />
      <FeatureTabsSection />
      <Usage />
      <IntegrationsGrid />
      <OpenSource />
      <Security />
      <CustomerStories />
      <Pricing />
      <WallOfLove />
      <CTAGetStarted />
    </main>
    <Background />
  </>
);
