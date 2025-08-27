"use client";

import { Background } from "../Background";
import { Hero } from "./Hero";
import Security from "./Security";
import { Usage } from "./Usage";

import dynamic from "next/dynamic";
import { CTASocial } from "./CTASocial";

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
