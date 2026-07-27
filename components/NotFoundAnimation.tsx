"use client";

import dynamic from "next/dynamic";

const CANVAS_STYLES = {
  width: "100%",
  height: "50vh",
  minHeight: "400px",
  maxHeight: "600px",
} as const;

export const NotFoundAnimation = dynamic(
  () =>
    import("./NotFoundAnimationCanvas").then(
      (module) => module.NotFoundAnimationCanvas,
    ),
  {
    ssr: false,
    loading: () => <div style={CANVAS_STYLES} />,
  },
);
