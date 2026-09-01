import type { ReactNode } from "react";
import { RootDocument } from "@/components/RootDocument";
import { siteMetadata } from "@/lib/site-metadata";

export const metadata = siteMetadata;

/**
 * Root layout for the Japanese pages (`/japan`, `/academy/japan/*`).
 *
 * These pages declare a self-referencing `ja-JP` hreflang, so the document has
 * to report `lang="ja"` to match it.
 */
export default function JaRootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return <RootDocument lang="ja">{children}</RootDocument>;
}
