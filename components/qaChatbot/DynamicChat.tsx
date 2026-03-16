"use client";

import dynamic from "next/dynamic";

// Thin dynamic wrapper so MDX content files can import Chat without pulling
// katex / react-markdown / rehype-katex into the shared webpack chunk.
// The actual Chat implementation lives in qaChatbot/index.tsx.
export const Chat = dynamic(
  () => import("@/components/qaChatbot").then((m) => ({ default: m.Chat })),
  { ssr: false }
);
