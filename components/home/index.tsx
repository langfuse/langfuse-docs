import { Background } from "../Background";
import { Hero } from "./Hero";
import { Pricing } from "./Pricing";
import { Users } from "./Users";
import { OpenSource } from "./OpenSource";
import { FeatureBento } from "./FeatureBento";
import { Integrations } from "./Integrations";
import { Releases } from "./Releases";
import { Footer } from "./Footer";

export const Home = ({ releases }) => (
  <>
    <main className="relative overflow-hidden w-full">
      <Hero />
      <Users />
      <FeatureBento />
      <Integrations />
      <OpenSource />
      {/* <Releases releases={releases as any} /> */}
      <Pricing />
      {/* <FromTheBlog /> */}
      {/* <CTA /> */}
      {/* <Footer /> */}
    </main>
    <Background />
  </>
);
