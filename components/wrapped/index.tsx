import dynamic from "next/dynamic";
import { Hero } from "./Hero";
import { Intro } from "./Intro";
import { OSS } from "./OSS";
import { Launches } from "./Launches";
import { Customers } from "./Customers";
import { Outro } from "./Outro";

// Lazy-load recharts-heavy components so D3/recharts (~1.5 MB) is NOT bundled
// into the catch-all [section]/[[...slug]] route that serves all docs pages.
// These components only render on the /wrapped page.
// Real `import()` so Turbopack keeps recharts out of the `/` and `/docs`
// initial graph. The webpack cacheGroups split in next.config.mjs is webpack-only.
const Metrics = dynamic(
  () => import("./Metrics").then((m) => ({ default: m.Metrics })),
  { ssr: false },
);

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
