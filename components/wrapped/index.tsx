import { Hero } from "./Hero";
import { Intro } from "./Intro";
import { OSS } from "./OSS";
import { Launches } from "./Launches";
import { Customers } from "./Customers";
import { Outro } from "./Outro";
import { Metrics } from "./MetricsLazy";

export function Wrapped() {
  return (
    <main className="relative overflow-hidden w-full">
      <Hero />
      <Intro />
      <Metrics />
      <OSS />
      <Launches />
      <Customers />
      <Outro />
    </main>
  );
}
