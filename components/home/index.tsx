import { Background } from "../Background";
import { FeatTracing } from "./FeatTracing";
import { FeatAnalytics } from "./FeatAnalytics";
import { FromTheBlog } from "./FromTheBlog";
import { Hero } from "./Hero";
import { Pricing } from "./Pricing";
import { Users } from "./Users";
import { OpenSource } from "./OpenSource";
import Integrations from "./Integrations";
import { FeatureBento } from "./FeatureBento";
import IntegrationsNew from "./IntegrationsNew";

export const Home = () => (
  <>
    <main className="relative overflow-hidden w-full">
      <div className="px-2 md:container">
        <Hero />
        <Users />
        <FeatureBento />
        <IntegrationsNew />
        <OpenSource />
        <Pricing />
        <FromTheBlog />
        {/* <CTA /> */}
      </div>
    </main>
    <Background />
  </>
);
