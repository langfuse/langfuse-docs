# Nextra → Fumadocs + App Router Migration

This document describes the migration from Nextra (Pages Router) to Fumadocs (App Router) and the remaining steps to complete it.

## What’s done

1. **Dependencies**
   - Replaced `nextra` and `nextra-theme-docs` with `fumadocs-core`, `fumadocs-mdx`, and `fumadocs-ui`.
   - Added `@types/mdx` in devDependencies.

2. **Config**
   - **`source.config.ts`** – Fumadocs MDX config: `defineDocs({ dir: 'content/docs' })`, `remarkGfm`, `providerImportSource: '@/mdx-components'`.
   - **`lib/source.ts`** – Fumadocs source: `loader()` with `docs.toFumadocsSource()`, `baseUrl: '/docs'`.
   - **`next.config.mjs`** – Removed Nextra; wrapped config with `createMDX()` from `fumadocs-mdx/next`. All existing options (headers, redirects, rewrites, images, etc.) are unchanged.
   - **`tsconfig.json`** – Added path `"fumadocs-mdx:collections/*": [".source/*"]`.

3. **App Router**
   - **`app/layout.tsx`** – Root layout: `RootProvider` (from `fumadocs-ui/provider/next`), Geist fonts, global CSS (`style.css`, overrides, Vidstack).
   - **`app/page.tsx`** – Temporary home: title + link to `/docs`. Replace with the real landing (e.g. current `<Home />`) when ready.
   - **`app/docs/layout.tsx`** – `DocsLayout` with `source.getPageTree()`, nav title “Langfuse”, GitHub link.
   - **`app/docs/[[...slug]]/page.tsx`** – Doc page: `source.getPage(slug)`, `page.data.load()`, `DocsPage` + `DocsBody` with MDX and `getMDXComponents()`; `generateMetadata` and `generateStaticParams`.

4. **MDX**
   - **`mdx-components.tsx`** – `getMDXComponents` / `useMDXComponents` using `fumadocs-ui/mdx`.

5. **Content**
   - **`content/docs/`** – New Fumadocs content root:
     - `meta.json` – root meta with `pages: ["index", "observability"]`.
     - `index.mdx` – overview doc.
     - `observability/meta.json` and `observability/overview.mdx` – sample observability doc.

## Install and peer deps

- Fumadocs MDX 13 expects **Next 15.3+** and **fumadocs-core 15+**. If you stay on Next 15.2.x, use:
  - `pnpm install --legacy-peer-deps` (or `npm install --legacy-peer-deps`).
- Optional: upgrade to Next `^15.3.0` to satisfy peer deps without `--legacy-peer-deps`.

## Remaining steps

### 1. Content migration (docs)

- **Done.** Docs live in `content/docs/` with Fumadocs `meta.json`. The former `pages/docs/` content was migrated; `docs-nextra-backup` was removed after verification.

### 2. Other sections (blog, changelog, guides, etc.) — done

- **Done.** All main sections are on App Router:
  - **Fumadocs collections** in `source.config.ts`: `selfHosting`, `blog`, `changelog`, `guides`, `faq`, `integrations`, `security`, `library`, `customers`, `handbook`.
  - **Content** in `content/<section>/`.
  - **App routes**: `app/docs/` (docs), `app/blog/`, `app/changelog/` (index + layout), and `app/[section]/[[...slug]]` for self-hosting, guides, faq, integrations, security, library, customers, handbook.
  - **Client loaders** for section MDX: `lib/section-loaders.generated.ts` (generated in prebuild via `scripts/generate-section-loaders.js`).
  - **Index components** (`BlogIndex`, `ChangelogIndex`) use `getPagesUnderRoute` from nextra-shim, which now reads from Fumadocs sources via `getPagesForRoute` in `lib/source.ts`.
- **Static marketing pages** are in `content/marketing/` and served via `app/[section]` (section = about, careers, pricing, etc.).

### 3. Replace Nextra usage in components

These (and any others that import from Nextra) need to be updated or replaced:

| File | Nextra usage | Fumadocs / replacement |
|------|--------------|-------------------------|
| `theme.config.tsx` | Entire file | No longer used. Nav/sidebar/footer are in `app/docs/layout.tsx` and Fumadocs layout props. Replicate any custom nav/links in `DocsLayout` (e.g. `nav`, `sidebar`, `links`). |
| `components/*` using `getPagesUnderRoute`, `Page`, `useConfig`, `useTheme` | `nextra/context`, `nextra-theme-docs` | Use `source` from `@/lib/source`: e.g. `source.getPages()`, filter by path; or build custom indexes from `source.getPageTree()`. For theme, use `next-themes` or Fumadocs theme. |
| `nextra/components`: `Cards`, `Tabs`, `Callout` | Nextra components | Use Fumadocs UI: `fumadocs-ui/components/card`, `fumadocs-ui/components/tabs`, `fumadocs-ui/components/callout`, or keep local wrappers that match Fumadocs props. |

Notable components to refactor:

- `components/home/*` (Changelog, etc.) – replace `getPagesUnderRoute` with `source` + path filter.
- `components/blog/BlogIndex.tsx`, `components/changelog/ChangelogIndex.tsx` – same.
- `components/faq/FaqIndex.tsx`, `components/customers/CustomerIndex.tsx`, `components/CookbookIndex.tsx`, `components/VideoIndex.tsx`, `components/integrations/IntegrationIndex.tsx` – same.
- `components/MainContentWrapper.tsx`, `components/LangTabs.tsx`, etc. – remove `useConfig` / Nextra theme; use Fumadocs layout or local state.
- `components/not-found-animation.tsx`, `components/MetabaseDashboard.tsx`, `components/inkeep/useInkeepSettings.ts` – replace `useTheme` with `next-themes` or Fumadocs theme.

### 4. Home and global providers — done

- **`app/page.tsx`** – Uses real `<Home />` from `@/components/home`.
- **Analytics and scripts** – In `app/layout.tsx`: PostHog (via `@/components/analytics/PostHogProvider`), Hubspot, and Cookieyes scripts (production only).

### 5. Remove Pages Router — done

- **Done.** The `pages/` directory has been removed. The site uses **App Router only**.
- All routes are under `app/`; content lives under `content/`. API routes are under `app/api/`.

### 6. Optional: Fumadocs search

- Configure search (e.g. Fumadocs search or Inkeep) in the root layout or docs layout (e.g. `RootProvider` or `DocsLayout` search options), and remove any Nextra search wiring.

## Running the project

- Generate Fumadocs source (usually automatic with Next):
  - `npx fumadocs-mdx` (or add to `postinstall` if you want types on install).
- Dev: `pnpm dev` (or `npm run dev`).
- Build: `pnpm build` (or `npm run build`). If you hit peer dependency errors, use `pnpm install --legacy-peer-deps` or upgrade Next as above.

## Reference

- [Fumadocs – Get started](https://fumadocs.dev/docs)
- [Fumadocs MDX – Next.js](https://fumadocs.dev/docs/mdx/next)
- [Fumadocs UI – Docs layout](https://fumadocs.dev/docs/ui/layouts/docs)
- [Fumadocs navigation / meta](https://fumadocs.dev/docs/navigation)
