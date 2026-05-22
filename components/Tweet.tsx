"use client";

import { cn } from "@/lib/utils";
import { Tweet as ReactTweet } from "react-tweet";

// Client-only so react-tweet resolves to its `./dist/index.client.js` entry
// (SWR-based, fetches on the client). The server entry fetches at build time
// and crashes the prerender if X.com's syndication payload shape drifts —
// see https://github.com/langfuse/langfuse-docs (autoresearch post incident).
export const Tweet = ({
  id,
  className,
}: {
  id: string;
  className?: string;
}) => (
  <div className={cn("mt-2", className)}>
    <ReactTweet id={id} />
  </div>
);
