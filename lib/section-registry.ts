import "server-only";
import {
  selfHostingSource,
  blogSource,
  changelogSource,
  guidesSource,
  integrationsSource,
  securitySource,
  librarySource,
  usersSource,
  handbookSource,
  marketingSource,
} from "@/lib/source";

/** Slugs that are single marketing pages (content/marketing/*.mdx) */
export const MARKETING_SLUGS = [
  "about",
  "brand",
  "careers",
  "cn",
  "community",
  "cookie-policy",
  "enterprise",
  "find-us",
  "imprint",
  "jp",
  "jp-cloud",
  "kr",
  "non-profit",
  "oss-friends",
  "press",
  "pricing",
  "pricing-self-host",
  "privacy",
  "research",
  "startups",
  "support",
  "talk-to-us",
  "terms",
  "watch-demo",
  "wrapped",
] as const;

const DOC_SECTIONS = {
  "self-hosting": {
    source: selfHostingSource,
    collection: "selfHosting",
    title: "Self-hosting",
  },
  blog: {
    source: blogSource,
    collection: "blog",
    title: "Blog",
  },
  changelog: {
    source: changelogSource,
    collection: "changelog",
    title: "Changelog",
  },
  guides: {
    source: guidesSource,
    collection: "guides",
    title: "Guides",
  },
  integrations: {
    source: integrationsSource,
    collection: "integrations",
    title: "Integrations",
  },
  security: {
    source: securitySource,
    collection: "security",
    title: "Security",
  },
  library: {
    source: librarySource,
    collection: "library",
    title: "Library",
  },
  users: {
    source: usersSource,
    collection: "customers",
    title: "User stories",
  },
  handbook: {
    source: handbookSource,
    collection: "handbook",
    title: "Handbook",
  },
} as const;

const marketingEntries = Object.fromEntries(
  MARKETING_SLUGS.map((slug) => [
    slug,
    { source: marketingSource, collection: "marketing" as const, title: slug },
  ]),
);

export const SECTION_CONFIG = { ...DOC_SECTIONS, ...marketingEntries } as const;
export const SECTION_SLUGS = Object.keys(SECTION_CONFIG) as (keyof typeof SECTION_CONFIG)[];
export type SectionSlug = (typeof SECTION_SLUGS)[number];
export const MARKETING_SECTION_SLUGS = new Set(MARKETING_SLUGS);

/** Sections that have their own app route (app/integrations, app/self-hosting, etc.). Exclude from [section]. */
export const DOCS_STYLE_APP_SECTIONS = new Set([
  "integrations",
  "self-hosting",
  "guides",
  "library",
]);

/** Sections that are blog/changelog posts — no left sidebar */
export const POST_SECTIONS = new Set(["blog", "changelog", "users"]);

/** Changelog posts — no sidebars at all, centered narrow content */
export const CHANGELOG_SECTIONS = new Set(["changelog"]);

/** Sections served as standalone marketing pages under app/(home)/(marketing)/ */
export const MARKETING_SECTION_SLUGS_STANDALONE = [
  "pricing",
  "pricing-self-host",
  "talk-to-us",
  "watch-demo",
  "startups",
] as const;

export type MarketingSlug = (typeof MARKETING_SLUGS)[number];
/** All marketing pages — use HomeLayout instead of DocsLayout */
export const MARKETING_SECTIONS = new Set<string>(MARKETING_SLUGS);
