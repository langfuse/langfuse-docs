import { Hero } from "./Hero";
import { Intro } from "./Intro";
import { OSS } from "./OSS";
import { Launches } from "./Launches";
import { Customers } from "./Customers";
import { Outro } from "./Outro";
import { Metrics } from "./MetricsLazy";
import { WrappedSection } from "./components/WrappedSection";
import { SectionHeading } from "./components/SectionHeading";

export function Wrapped() {
  return (
    <main className="relative w-full">
      <Hero />
      <Intro />
      <WrappedSection>
        <SectionHeading
          id="metrics"
          title="You all have been busy"
          subtitle="Key metrics from our platform in 2025."
        />
        <Metrics />
      </WrappedSection>
      <OSS />
      <Launches />
      <Customers />
      <Outro />
    </main>
  );
}
