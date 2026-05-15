"use client";

import dynamic from "next/dynamic";

const CANVAS_STYLES = {
  width: "100%",
  height: "50vh",
  minHeight: "400px",
  maxHeight: "600px",
} as const;

// Real dynamic import: the three.js / @react-three modules only load when this
// component renders, so they stay out of the shared/root chunk. (Using
// `Promise.resolve(Component)` here does NOT split the bundle — it just delays
// rendering.)
export const NotFoundAnimation = dynamic(
  () => import("./NotFoundAnimationImpl"),
  {
    ssr: false,
    loading: () => <div style={CANVAS_STYLES} />,
  }
);
