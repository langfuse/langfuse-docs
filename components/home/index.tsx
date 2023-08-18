import { Background } from "../Background";
import { CTA } from "./CTA";
import { FeatTracing } from "./FeatTracing";
import { FeatAnalytics } from "./FeatAnalytics";
import { FromTheBlog } from "./FromTheBlog";
import { Hero } from "./Hero";
import { Pricing } from "./Pricing";
import { Users } from "./Users";

export function Home() {
  return (
    <>
      <main className="relative overflow-hidden w-full">
        <div className="container">
          <Hero />
          <Users />
          <FeatTracing />
          <FeatAnalytics />
          <Pricing />
          <FromTheBlog />
          <CTA />
        </div>
      </main>
      <Background />
    </>
  );
}
