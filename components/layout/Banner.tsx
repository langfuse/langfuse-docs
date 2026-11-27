"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { Banner as FumadocsBanner } from "fumadocs-ui/components/banner";

const subscribe = () => () => {};

// The announcement text renders only in the browser. Search engines and AI
// search indexes that read the server HTML otherwise take it, as the first
// text on every page, for the page title or summary.
export function Banner() {
  const isClient = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

  return (
    <FumadocsBanner
      height="2rem"
      className="bg-black px-2 text-white sm:px-4 [&_a]:text-white"
      data-nosnippet
    >
      {isClient ? (
        <Link href="/blog/introducing-gateway">
          Langfuse launches AI Gateway <span aria-hidden>→</span>{" "}
          <span className="underline underline-offset-2">Learn more</span>
        </Link>
      ) : null}
    </FumadocsBanner>
  );
}
