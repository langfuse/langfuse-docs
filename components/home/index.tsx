"use client";

import dynamic from "next/dynamic";
import { Hero } from "./Hero";
import { FeatureTabsSection } from "./FeatureTabsSection";
import type { CustomerStory } from "../customers/CustomerCarousel";
import type { ChangelogItem } from "./Changelog";

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

export interface HomeProps {
  customerStories: CustomerStory[];
  changelogItems: ChangelogItem[];
}

export const Home = ({ customerStories, changelogItems }: HomeProps) => (
  <>
    <main className="overflow-hidden relative w-full">
      <Hero />
      <FeatureTabsSection />
      <Usage />
      <IntegrationsGrid />
      <OpenSource changelogItems={changelogItems} />
      <Security />
      <CustomerStories stories={customerStories} />
      <Pricing />
      <WallOfLove />
      <CTAGetStarted />
    </main>
  </>
);
