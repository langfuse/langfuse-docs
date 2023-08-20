import { Background } from "../Background";
import { CTA } from "./CTA";
import { FeatTracing } from "./FeatTracing";
import { FeatAnalytics } from "./FeatAnalytics";
import { FromTheBlog } from "./FromTheBlog";
import { Hero } from "./Hero";
import { Pricing } from "./Pricing";
import { Users } from "./Users";
import { OpenSource } from "./OpenSource";
import { FeatOther } from "./FeatOther";
import Integrations from "./Integrations";

export function Home() {
  return (
    <>
      <main className="relative overflow-hidden w-full">
        <div className="px-2 md:container">
          <Hero />
          <Users />
          <FeatTracing />
          <FeatAnalytics />
          <Integrations />
          <OpenSource />
          <Pricing />
          <FromTheBlog />
          {/* <CTA /> */}
        </div>
      </main>
      <Background />
    </>
  );
}
