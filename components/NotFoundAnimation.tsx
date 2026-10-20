"use client";

import dynamic from "next/dynamic";
import { NOT_FOUND_CANVAS_STYLES } from "@/components/not-found-animation-styles";

export const NotFoundAnimation = dynamic(
  () => import("./NotFoundAnimationCanvas"),
  {
    ssr: false,
    loading: () => <div style={NOT_FOUND_CANVAS_STYLES} />,
  },
);
