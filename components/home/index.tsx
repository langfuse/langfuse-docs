"use client";

import { Hero } from "./Hero";
import { FeatureTabsSection } from "./FeatureTabsSection";
import { RiveSection } from "./RiveSection";
import { AllTheTools } from "./AllTheTools";
import { Integrations } from "./Integrations";
import { OpenSource } from "./OpenSource";
import { DeveloperTools } from "./DeveloperTools";
import { Enterprise } from "./Enterprise";
import { WhyLangfuse } from "./WhyLangfuse";
import { ClickHouseLangfuseSection } from "./ClickHouseLangfuseSection";
import { FAQ } from "./FAQ";

export const Home = () => (
  <>
    <main className="overflow-hidden relative w-full hero-bg">
      <Hero />
      <FeatureTabsSection />
      <RiveSection />
      <AllTheTools />
      <Integrations />
      <OpenSource />
      <DeveloperTools />
      <Enterprise />
      <WhyLangfuse />
      <ClickHouseLangfuseSection />
      <FAQ />
    </main>
  </>
);
