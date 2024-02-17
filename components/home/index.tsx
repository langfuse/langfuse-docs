import { Background } from "../Background";
import { FromTheBlog } from "./FromTheBlog";
import { Hero } from "./Hero";
import { Pricing } from "./Pricing";
import { Users } from "./Users";
import { OpenSource } from "./OpenSource";
import { FeatureBento } from "./FeatureBento";
import { Integrations } from "./Integrations";

export const Home = () => (
  <>
    <main className="relative overflow-hidden w-full">
      <Hero />
      <Users />
      <FeatureBento />
      <Integrations />
      <OpenSource />
      <Pricing />
      <FromTheBlog />
      {/* <CTA /> */}
    </main>
    <Background />
  </>
);
