import "server-only";
import type { loader } from "fumadocs-core/source";
import {
  selfHostingSource,
  blogSource,
  changelogSource,
  guidesSource,
  faqSource,
  integrationsSource,
  securitySource,
  librarySource,
  usersSource,
  handbookSource,
  marketingSource,
} from "@/lib/source";

// ---------------------------------------------------------------------------
// Section registry — single source of truth for all section routing metadata.
//
// Layout types:
//   "docs"      → full docs chrome (sidebar, breadcrumbs, TOC)
//   "post"      → blog/changelog style (no sidebar)
//   "changelog" → like post but also no TOC, centered narrow content
//   "marketing" → HomeLayout wrapper, no docs chrome
//
// `hasOwnRoute` means the section has a dedicated app/ route (e.g.
// app/integrations/) and should be excluded from the dynamic [section] route.
// ---------------------------------------------------------------------------

export type SectionLayout = "docs" | "post" | "changelog" | "marketing";

export interface SectionMeta {
  source: ReturnType<typeof loader>;
  collection: string;
  title: string;
  layout: SectionLayout;
  hasOwnRoute?: boolean;
}

/** All non-marketing doc sections. The key is the URL slug. */
export const docSections: Record<string, SectionMeta> = {
  "self-hosting": {
    source: selfHostingSource,
    collection: "selfHosting",
    title: "Self-hosting",
    layout: "docs",
    hasOwnRoute: true,
  },
  blog: {
    source: blogSource,
    collection: "blog",
    title: "Blog",
    layout: "post",
    hasOwnRoute: true,
  },
  changelog: {
    source: changelogSource,
    collection: "changelog",
    title: "Changelog",
    layout: "changelog",
    hasOwnRoute: true,
  },
  guides: {
    source: guidesSource,
    collection: "guides",
    title: "Guides",
    layout: "docs",
    hasOwnRoute: true,
  },
  faq: {
    source: faqSource,
    collection: "faq",
    title: "FAQ",
    layout: "docs",
    hasOwnRoute: true,
  },
  integrations: {
    source: integrationsSource,
    collection: "integrations",
    title: "Integrations",
    layout: "docs",
    hasOwnRoute: true,
  },
  security: {
    source: securitySource,
    collection: "security",
    title: "Security",
    layout: "docs",
  },
  library: {
    source: librarySource,
    collection: "library",
    title: "Library",
    layout: "docs",
    hasOwnRoute: true,
  },
  users: {
    source: usersSource,
    collection: "customers",
    title: "User stories",
    layout: "post",
    hasOwnRoute: true,
  },
  handbook: {
    source: handbookSource,
    collection: "handbook",
    title: "Handbook",
    layout: "docs",
  },
};

// ---------------------------------------------------------------------------
// Derived section routing state — computed from the docSections registry
// and marketingSource above.
// ---------------------------------------------------------------------------

/** Marketing slugs derived from the Fumadocs marketing collection pages. */
export const MARKETING_SLUGS = marketingSource
  .getPages()
  .map((p) => p.url.replace(/^\//, ""))
  .filter(Boolean) as string[];

/** Build a unified config that includes both doc sections and marketing entries. */
const marketingEntries: Record<string, SectionMeta> = Object.fromEntries(
  MARKETING_SLUGS.map((slug) => [
    slug,
    {
      source: marketingSource,
      collection: "marketing" as const,
      title: slug,
      layout: "marketing" as const,
    },
  ]),
);

export const SECTION_CONFIG: Record<string, SectionMeta> = {
  ...docSections,
  ...marketingEntries,
};

/**
 * Marketing pages that have a dedicated app route (e.g. app/pricing/)
 * and should be excluded from the dynamic [section] catch-all.
 */
export const DEDICATED_MARKETING_SLUGS = new Set<string>([
  "pricing",
  "pricing-self-host",
]);

export const DEDICATED_APP_SECTIONS = new Set<string>([
  ...Object.entries(docSections)
    .filter(([, meta]) => meta.hasOwnRoute)
    .map(([slug]) => slug),
  ...Array.from(DEDICATED_MARKETING_SLUGS.values()),
]);

/** All marketing pages — use HomeLayout */
export const SECTION_SLUGS = Object.keys(SECTION_CONFIG);

// Derived sets — computed from the layout annotation in each section's metadata.
export const MARKETING_SECTIONS = new Set<string>(MARKETING_SLUGS);
