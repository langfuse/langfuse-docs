import { Hero } from "./Hero";
import { PlatformOverview } from "./PlatformOverview";
import { FeatureTabsSection } from "./FeatureTabsSection";
import { AcademyLoopSection } from "./AcademyLoopSection";
import { AllTheTools } from "./AllTheTools";
import { Integrations } from "./Integrations";
import { OpenSource } from "./OpenSource";
import { DeveloperTools } from "./DeveloperTools";
import { Enterprise } from "./Enterprise";
import { WhyLangfuse } from "./WhyLangfuse";
import { GetStartedSection } from "./GetStartedSection";
import { FAQ } from "./FAQ";

export const Home = () => (
  <>
    {/* Discover the CSS background LCP image as early as a fetchpriority img. */}
    <link
      rel="preload"
      as="image"
      href="/images/patterns/hero-bg.png"
      fetchPriority="high"
    />
    <main className="overflow-hidden relative w-full hero-bg xl:px-5 2xl:px-10">
      <Hero />
      <PlatformOverview />
      <FeatureTabsSection />
      <AcademyLoopSection />
      <AllTheTools />
      <Integrations />
      <OpenSource />
      <DeveloperTools />
      <Enterprise />
      <WhyLangfuse />
      <GetStartedSection />
      <FAQ />
    </main>
  </>
);
