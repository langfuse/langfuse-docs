import { Background } from "../Background";
import { Hero } from "./Hero";
import { Intro } from "./Intro";
import { Metrics } from "./Metrics";
import { OSS } from "./OSS";
import { Launches } from "./Launches";
import { Customers } from "./Customers";
import { Team } from "./Team";
import { Outro } from "./Outro";
import { CTA } from "./CTA";

export function Wrapped() {
  return (
    <>
      <main className="relative overflow-hidden w-full">
        <Hero />
        <Intro />
        <Metrics />
        <OSS />
        <Launches />
        <Customers />
        <Team />
        <Outro />
        <CTA />
      </main>
      <Background />
    </>
  );
}
