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
  MARKETING_SLUGS,
} from "./source";

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
  faq: {
    source: faqSource,
    collection: "faq",
    title: "FAQ",
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
    title: "Users",
  },
  handbook: {
    source: handbookSource,
    collection: "handbook",
    title: "Handbook",
  },
} as const;

const marketingEntries = Object.fromEntries(
  MARKETING_SLUGS.map((s) => [
    s,
    { source: marketingSource, collection: "marketing" as const, title: s },
  ])
);

export const SECTION_CONFIG = { ...DOC_SECTIONS, ...marketingEntries } as const;
export const SECTION_SLUGS = Object.keys(SECTION_CONFIG) as (keyof typeof SECTION_CONFIG)[];
export type SectionSlug = (typeof SECTION_SLUGS)[number];
export const MARKETING_SECTION_SLUGS = new Set(MARKETING_SLUGS);

/** Sections that have their own app route (app/integrations, app/self-hosting, etc.) like app/docs. Exclude from [section]. */
export const DOCS_STYLE_APP_SECTIONS = new Set([
  "integrations",
  "self-hosting",
  "guides",
  "library",
]);

/** Sections that are blog/changelog posts — no left sidebar */
export const POST_SECTIONS = new Set(["blog", "changelog", "users"]);

/** Changelog posts — no sidebars at all, centered narrow content (like marketing) */
export const CHANGELOG_SECTIONS = new Set(["changelog"]);

/** Sections that have their own route folder under app/(wide)/ and use wide layout without prose */
export const WIDE_SECTION_SLUGS = [
  "pricing",
  "pricing-self-host",
  "talk-to-us",
  "watch-demo",
  "startups",
] as const;
export type WideSectionSlug = (typeof WIDE_SECTION_SLUGS)[number];
export const WIDE_SECTIONS = new Set<string>(WIDE_SECTION_SLUGS);
