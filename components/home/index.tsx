import { Background } from "../Background";
import { Hero } from "./Hero";
import Security from "./Security";
import { UsersStatic } from "./UsersStatic";
import dynamic from "next/dynamic";

const FeatureBento = dynamic(() => import("./FeatureBento"), {
  ssr: false,
});
const Integrations = dynamic(() => import("./Integrations"), {
  ssr: false,
});
const OpenSource = dynamic(() => import("./OpenSource"), {
  ssr: false,
});
const Pricing = dynamic(() => import("./Pricing"), {
  ssr: false,
});

export const Home = () => (
  <>
    <main className="relative overflow-hidden w-full">
      <Hero />
      <UsersStatic />
      <FeatureBento />
      <Integrations />
      <OpenSource />
      <Security />
      <Pricing />
      {/* <FromTheBlog /> */}
      {/* <CTA /> */}
      {/* <Footer /> */}
    </main>
    <Background />
  </>
);
