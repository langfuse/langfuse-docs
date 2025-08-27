"use client";

import dynamic from "next/dynamic";

export const GhDiscussionsPreview = dynamic(
  () => import("./GhDiscussionsPreviewInternal"),
  {
    ssr: false,
  }
);
