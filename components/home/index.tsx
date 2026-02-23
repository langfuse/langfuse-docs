"use client";

import dynamic from "next/dynamic";
import { Hero } from "./Hero";
import { FeatureTabsSection } from "./FeatureTabsSection";

// Dynamic imports for everything that is below the fold
const Usage = dynamic(() => import("./Usage"), {
  ssr: false,
});
const IntegrationsGrid = dynamic(() => import("./IntegrationsGrid"), {
  ssr: false,
});
const OpenSource = dynamic(() => import("./OpenSource"), {
  ssr: false,
});
const Pricing = dynamic(() => import("./pricing"), {
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
    <main className="overflow-hidden relative w-full">
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
  </>
);
