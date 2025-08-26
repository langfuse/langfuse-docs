# Nextra v3 → v4 Migration Backlog

This document tracks v3 customizations that still need porting to Nextra v4 (App Router) or were intentionally deferred. Where useful, code is preserved as commented examples or codeblocks.

## Status

- Core upgrade to Nextra v4 and App Router scaffolded.
- Content moved to `src/content` (v4 content directory convention).
- Theme basics ported to `app/layout.tsx` (Navbar, Footer, Search, Sidebar, TOC extras, repo link).
- MDX wrapper migrated via `mdx-components.tsx` to keep MainContentWrapper features.
- Analytics (PostHog), Hubspot, and support chat moved to a client provider (`src/ClientAnalytics.tsx`).
- Critical v3-only APIs and dynamic MDX pages are deferred and temporarily stubbed (see below).

---

## To Port Next

- getPagesUnderRoute usage (removed in v4)
  - Replace with v4 `pageMap` traversal or `normalizePages` via `useConfig`.
  - Files stubbed for now:
    - `components/VideoIndex.tsx`
    - `components/integrations/IntegrationIndex.tsx`
    - `components/blog/BlogIndex.tsx`
    - `components/faq/FaqPreview.tsx`
    - `components/faq/FaqIndex.tsx`
    - `components/changelog/ChangelogIndex.tsx`
    - `components/home/Changelog.tsx`
  - MDX pages importing it:
    - `src/content/docs/roadmap.mdx` (ChangelogList) → temporary placeholder

- Dynamic MDX page for FAQ tags (v3 `getStaticPaths`/`getStaticProps` inside MDX)
  - v4 uses App Router’s `generateStaticParams` and per-route files, not MDX `getStaticPaths`.
  - Current placeholder in `src/content/faq/tag/[tag].mdx`.
  - Suggested v4 approach: create `app/faq/tag/[tag]/page.tsx` and render a component reading `pageMap`.

- _meta files and section headers
  - v4 prefers `_meta.js` files. Top-level migrated to `src/content/_meta.js`.
  - Existing nested `_meta.tsx` files (with dynamic `<MenuSwitcher />`) still exist. v4 likely supports React values, but confirm.
  - Verify or convert nested `_meta.tsx` to `_meta.js` and ensure MenuSwitcher works (MenuSwitcher is now App Router-compatible).

- SEO head logic from v3 `theme.config.tsx`
  - v4 computes page metadata via `generateMetadata` (already wired in `app/[[...mdxPath]]/page.tsx`).
  - Review custom Open Graph image/video logic and canonical URLs below and port selectively as needed.

- CSS overrides for Nextra classnames
  - `src/overrides.css` targets `.nextra-*` classes. v4 may have class changes – verify in UI and adjust.

- 404 page
  - v4 App Router expects `app/not-found.tsx`. The v3 `pages/404.mdx` isn’t used.

- Search
  - `search` prop now renders a React node; current integration uses `<InkeepSearchBar />` as in v3. Confirm expected behavior in v4 and adjust styling if needed.

---

## Preserved v3 Theme Config (for reference)

This was replaced by `app/layout.tsx` in v4. Keep for diffing and manual review.

```tsx
// theme.config.tsx (v3)
import React from "react";
import { DocsThemeConfig, useConfig } from "nextra-theme-docs";
import { Cards, Steps, Tabs, Callout } from "nextra/components";
import { Logo } from "@/components/logo";
import { useRouter } from "next/router";
import { MainContentWrapper } from "./components/MainContentWrapper";
import { Frame } from "./components/Frame";
import { GithubMenuBadge } from "./components/GitHubBadge";
import { ToAppButton } from "./components/ToAppButton";
import { DocsContributors } from "./components/DocsContributors";
import { COOKBOOK_ROUTE_MAPPING } from "./lib/cookbook_route_mapping";
import { GeistSans } from "geist/font/sans";
import IconDiscord from "./components/icons/discord";
import FooterMenu from "./components/FooterMenu";
import Link from "next/link";
import { AvailabilityBanner } from "./components/availability";
import { CloudflareVideo, Video } from "./components/Video";
import InkeepSearchBar from "./components/inkeep/InkeepSearchBar";
import { LangTabs } from "./components/LangTabs";

const config: DocsThemeConfig = {
  logo: <Logo />,
  logoLink: false,
  main: MainContentWrapper,
  search: { component: <InkeepSearchBar /> },
  navbar: {
    extraContent: (
      <>
        <a className="p-1 hidden lg:inline-block hover:opacity-80" target="_blank" href="https://discord.langfuse.com" aria-label="Langfuse Discord">
          <IconDiscord className="h-7 w-7" />
        </a>
        <a className="p-1 hidden lg:inline-block hover:opacity-80" target="_blank" href="https://x.com/langfuse" aria-label="Langfuse X" rel="nofollow noreferrer">
          <svg aria-label="X" fill="currentColor" width="24" height="24" viewBox="0 0 24 22"><path d="M16.99 0H20.298L13.071 8.26L21.573 19.5H14.916L9.702 12.683L3.736 19.5H0.426L8.156 10.665L0 0H6.826L11.539 6.231L16.99 0ZM15.829 17.52H17.662L5.83 1.876H3.863L15.829 17.52Z"></path></svg>
        </a>
        <GithubMenuBadge />
        <ToAppButton />
      </>
    ),
  },
  sidebar: { defaultMenuCollapseLevel: 1, toggleButton: true },
  editLink: { content: "Edit this page on GitHub" },
  toc: { backToTop: true, extraContent: <DocsContributors /> },
  docsRepositoryBase: "https://github.com/langfuse/langfuse-docs/tree/main",
  footer: { content: <FooterMenu /> },
  head: () => { /* custom SEO metadata logic (see file) */ },
  components: { Frame, Tabs, LangTabs, Tab: /* custom wrapper */, Steps, Card: Cards.Card, Cards, AvailabilityBanner, Callout, CloudflareVideo, Video },
  // banner: { /* ... */ },
};
export default config;
```

In v4, the equivalents live in:

- `app/layout.tsx` → `<Layout {...props} />` with `navbar`, `footer`, `search`, `sidebar`, `toc`, `docsRepositoryBase`.
- `mdx-components.tsx` → injects MDX components and wraps the default `wrapper` with `MainContentWrapper`.
- Per-page metadata comes from MDX frontmatter; `generateMetadata` in `app/[[...mdxPath]]/page.tsx` returns it.

---

## Code Replacements to Implement

- getPagesUnderRoute replacement
  - Use `getPageMap()` in `app/layout.tsx` (server) and pass via context; in clients, read `useConfig().normalizePagesResult` and traverse its `list` for route prefixes.
  - Create a helper `lib/page-map.ts` with functions like `getPagesUnder(prefix: string, { includeIndex?: boolean })` reading from `useConfig()` to replace old usages.

- Dynamic tag pages
  - Replace MDX-level SSG with App Router route: `app/faq/tag/[tag]/page.tsx` and `generateStaticParams()` using the page map to enumerate tags.

- 404 Page
  - Add `app/not-found.tsx` (port `pages/404.mdx` content or a themed `<NotFoundPage />`).

---

## Notes and Observations

- Post-build cleanup (`postbuild:cleanup`) to remove `.next/cache` targeted a v3 caching issue. Verify if still needed on v4 and remove if safe.
- Rewrites and headers left intact in `next.config.mjs` (markdown sources, CSP, redirects). Confirm behavior with App Router build.
- Several components were updated from `next/router` to App Router hooks (`next/navigation`):
  - `components/MainContentWrapper.tsx`
  - `components/MenuSwitcher.tsx`
  - `components/DocsContributors.tsx`
  - `components/home/Pricing.tsx` (query param handling)

---

## Temporary Stubs Inserted

- Components rendering a warning instead of dynamic content until ported:
  - `components/VideoIndex.tsx`
  - `components/integrations/IntegrationIndex.tsx`
  - `components/blog/BlogIndex.tsx`
  - `components/faq/FaqPreview.tsx` and `components/faq/FaqIndex.tsx`
  - `components/changelog/ChangelogIndex.tsx`
  - `components/home/Changelog.tsx` (empty dataset for now)
- MDX pages:
  - `src/content/docs/roadmap.mdx` changelog list placeholder
  - `src/content/faq/tag/[tag].mdx` dynamic tag page placeholder

Each of these should be reworked against v4 APIs (page map + App Router).

---

## Quick Testing

- Dev: `pnpm dev` (now uses Turbopack). The site should render and navigation should work for static pages. Stubs will render a warning callout.
- Build: `pnpm build` — expect warnings for stubs; address step-by-step per above.

---

## References

- Nextra v4 Docs: https://nextra.site/docs
- Example (content dir + catch-all):
  - `app/[[...mdxPath]]/page.jsx` with `importPage()` + `generateStaticParamsFor()`
  - `mdx-components.js` overriding `wrapper` and exposing MDX components

