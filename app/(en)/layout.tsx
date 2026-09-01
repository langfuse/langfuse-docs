import type { ReactNode } from "react";
import { RootDocument } from "@/components/RootDocument";
import { siteMetadata } from "@/lib/site-metadata";

export const metadata = siteMetadata;

/**
 * Root layout for the English site (everything except the routes in `app/(ja)`).
 *
 * See `components/RootDocument` for why the document language is split across
 * two root layouts instead of being derived inside one.
 */
export default function EnRootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return <RootDocument lang="en">{children}</RootDocument>;
}
