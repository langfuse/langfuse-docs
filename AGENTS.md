# AGENTS.md

This repository powers the Langfuse website hosted on `langfuse.com`, including both the marketing site and docs content (documentation, blog, changelog, FAQ).

## Quickstart

- Use **Node.js 22** (`package.json#engines`).
- Use **pnpm** (`packageManager` is configured in `package.json`).
- Local dev server runs on **http://localhost:3333**.

## Commands you will use most

### Development

- `pnpm dev` — start the local dev server on port 3333.
- `pnpm build` — build the production site.
- `pnpm start` — run the production build on port 3333.

### Content and maintenance

- `pnpm run prebuild` — refresh generated metadata (GitHub stars, contributors, copied markdown sources).
- `bash scripts/update_cookbook_docs.sh` — convert notebook-based cookbook content into docs markdown.
- `pnpm run link-check` — validate markdown links.
- `pnpm run sitemap-check` — validate links from generated sitemap.

### Optional analysis

- `pnpm run analyze` — run a bundle analysis build.

## Repository map

- `pages/` — site pages and MDX/Markdown content (marketing pages, docs, blog, changelog, FAQ).
- `components/` — reusable React components.
- `components-mdx/` — custom components used from MDX pages.
- `cookbook/` — source Jupyter notebooks for cookbook guides.
- `pages/guides/cookbook/` — generated cookbook markdown output.
- `public/` — static assets.
- `scripts/` — build and maintenance scripts.
- `lib/` — shared utilities/config helpers.

## Core content types

- **Docs**: `pages/docs/`
- **Changelog**: `pages/changelog/`
- **Blog**: `pages/blog/`
- **Guides**: `pages/guides/`
- **FAQ**: `pages/faq/`

## Important workflow rules

1. For cookbook changes, edit notebook sources in `cookbook/`.
2. Regenerate docs with `bash scripts/update_cookbook_docs.sh`.
3. Do **not** hand-edit generated files in `pages/guides/cookbook/`.

## Styling and implementation guidelines

- Use existing **shadcn/ui** patterns and components where possible.
- Use **Tailwind semantic tokens** (avoid hard-coded color values).
- Build mobile-first responsive layouts.

## Key config files

- `next.config.mjs` — Next.js config and redirects.
- `theme.config.tsx` — Nextra theme configuration.
- `tailwind.config.js` — Tailwind setup.
- `components.json` — shadcn/ui component config.
