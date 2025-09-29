import dynamic from "next/dynamic";
import Security from "./Security";

// Non-dynamic imports for everyhting that renders on top
import { Background } from "../Background";
import { Hero } from "./Hero";
import { FeatureTabsSection } from "./FeatureTabsSection";
import { CTASocial } from "./CTASocial";

import { Usage } from "./Usage";

const FeatureBento = dynamic(() => import("./FeatureBento"), {
  ssr: false,
});

const IntegrationsGrid = dynamic(() => import("./IntegrationsGrid"), {
  ssr: false,
});
const OpenSource = dynamic(() => import("./OpenSource"), {
  ssr: false,
});
const Pricing = dynamic(() => import("./Pricing"), {
  ssr: false,
});
const WallOfLove = dynamic(() => import("./WallOfLove"), {
  ssr: false,
});

export const Home = () => (
  <>
    <main className="relative overflow-hidden w-full">
      <Hero />
      <FeatureTabsSection />
      <Usage />
      <FeatureBento />
      <IntegrationsGrid />
      <OpenSource />
      <Security />
      <Pricing />
      <WallOfLove />
      <CTASocial />
      {/* <FromTheBlog /> */}
      {/* <CTA /> */}
      {/* <Footer /> */}
    </main>
    <Background />
  </>
);
