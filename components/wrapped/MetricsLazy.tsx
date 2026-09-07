"use client";

import dynamic from "next/dynamic";

// Client boundary required for `ssr: false`. Keeps recharts out of the
// server graph and the `/` / `/docs` initial JS (Turbopack ignores webpack splitChunks).
export const Metrics = dynamic(
  () => import("./Metrics").then((m) => ({ default: m.Metrics })),
  { ssr: false },
);
