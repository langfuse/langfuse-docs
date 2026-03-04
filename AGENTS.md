# AGENTS.md

This repository contains the website, documentation, and changelog of Langfuse (https://langfuse.com).

## Development commands

### Core development

- `pnpm dev` — Start development server on localhost:3333
- `pnpm build` — Build the production version
- `pnpm start` — Start production server on localhost:3333

### Content management

- `pnpm run prebuild` — Update GitHub stars and generate contributor data (runs automatically before build)
- `bash scripts/update_cookbook_docs.sh` — Convert Jupyter notebooks to markdown (uses `uv` with inline dependencies)
- `pnpm run link-check` — Check for broken links in documentation

### Analysis

- `pnpm run analyze` — Analyze bundle size using `@next/bundle-analyzer`

## Architecture overview

This is a **Nextra-based documentation site** for Langfuse built with Next.js.

### Technology stack

- **Nextra** (`3.0.15`) — Documentation framework built on Next.js
- **Next.js** (`15.2.4`) — React framework
- **shadcn/ui** — UI component library with semantic color tokens
- **Tailwind CSS** — Styling (**always use semantic color tokens, never explicit colors**)
- **TypeScript** — Type safety
- **pnpm** (`9.5.0`) — Package manager

### Content architecture

- **MDX/Markdown pages**: `pages/`
- **Components**: `components/` (including custom MDX components)
- **Cookbook source notebooks**: `cookbook/`
- **Static assets**: `public/`

### Key directories

- `components/` — Reusable React components
- `pages/` — All site pages (docs, blog, changelog, FAQ)
- `cookbook/` — Jupyter notebooks that get converted to markdown
- `components-mdx/` — MDX components used across pages
- `scripts/` — Build and maintenance scripts
- `lib/` — Utility functions and configuration

### Content management workflow

1. Edit `.ipynb` files in `cookbook/`
2. Run `bash scripts/update_cookbook_docs.sh` to convert to markdown
3. Generated markdown files are placed in `pages/guides/cookbook/`
4. **Do not edit generated `.md` files directly** — always edit source notebooks

### Key configuration files

- `next.config.mjs` — Next.js config (includes extensive redirects)
- `theme.config.tsx` — Nextra theme config
- `components.json` — shadcn/ui config
- `tailwind.config.js` — Tailwind config

## Styling guidelines

- Use semantic color tokens from shadcn/ui
- Never use explicit color values
- Follow shadcn/ui component conventions
- Use mobile-first responsive design

## Content types

- **Documentation**: `pages/docs/`
- **Blog**: `pages/blog/`
- **Changelog**: `pages/changelog/`
- **Cookbook**: `pages/guides/cookbook/` (generated)
- **FAQ**: `pages/faq/`

## Development notes

- Development server runs on port `3333`
- Requires Node.js `22`
- Uses pnpm
- Contributor data and GitHub stars are auto-generated before builds
- Redirect configuration is extensive and intentional
- CSP headers are configured for production security
