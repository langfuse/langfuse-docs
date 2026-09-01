import type { Metadata } from "next";
import {
  buildDefaultSiteOgImageUrl,
  SITE_DEFAULT_OG_DESCRIPTION,
} from "@/lib/og-url";

const defaultOgImageUrl = buildDefaultSiteOgImageUrl();

/**
 * Site-wide metadata defaults.
 *
 * Every root layout re-exports this, so the app has one source of truth for
 * `metadataBase`, the title template, icons, and the fallback OG image
 * regardless of which language tree served the request.
 */
export const siteMetadata: Metadata = {
  metadataBase: new URL("https://langfuse.com"),
  title: { default: "Langfuse", template: "%s - Langfuse" },
  description: SITE_DEFAULT_OG_DESCRIPTION,
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    shortcut: ["/favicon.ico"],
  },
  openGraph: {
    images: [{ url: defaultOgImageUrl }],
  },
  twitter: {
    card: "summary_large_image",
    site: "langfuse.com",
    images: [{ url: defaultOgImageUrl }],
  },
};
