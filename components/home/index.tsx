"use client";

import { Hero } from "./Hero";
import { ClickHouseLangfuseSection } from "./ClickHouseLangfuseSection";
import { FeatureTabsSection } from "./FeatureTabsSection";
import type { CustomerStory } from "../customers/CustomerCarousel";
import type { ChangelogItem } from "./Changelog";
import { RiveSection } from "./RiveSection";
import { Enterprise } from "./Enterprise";
import { WhyLangfuse } from "./WhyLangfuse";
import { OpenSource } from "./OpenSource";
import { FAQ } from "./FAQ";

export interface HomeProps {
  customerStories: CustomerStory[];
  changelogItems: ChangelogItem[];
}

export const Home = () => (
  <>
    <main className="overflow-hidden relative w-full">
      <Hero />
      <FeatureTabsSection />
      <RiveSection />
      <Enterprise />
      <OpenSource />
      <WhyLangfuse />
      <ClickHouseLangfuseSection />
      <FAQ />
    </main>
  </>
);
