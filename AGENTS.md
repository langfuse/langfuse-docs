# Repository Guidelines

## Project Structure & Module Organization
- Root: Next.js + Nextra docs site.
- Content: `pages/` (MDX, routes), `components/` (React UI, PascalCase), `components-mdx/` (MDX-only helpers), `public/` (assets, use `/images/...`), `src/` (styles, data, telemetry), `scripts/` (build utilities), `cookbook/` (Jupyter notebooks → generated MDX in `pages/`).
- Generated docs: MD/MDX files in `pages/` marked “source: ⚠️ Jupyter Notebook” are auto-generated. Edit the notebook and run the converter.

## Build, Test, and Development Commands
- `pnpm i`: install deps (Node 22, pnpm 9.5).
- `pnpm dev`: run local dev at `http://localhost:3333`.
- `pnpm build`: production build (runs `prebuild` before and post-build tasks after).
- `pnpm start`: start a built app.
- `pnpm analyze`: build with bundle analyzer.
- `pnpm link-check`: validate internal links in MDX/TSX.
- `pnpm sitemap-check`: validate sitemap links.
- `bash scripts/update_cookbook_docs.sh`: convert notebooks → MDX and move to `pages/`.
- `pnpm nuke`: clean `.next` and `node_modules`, then reinstall.

## Coding Style & Naming Conventions
- Indentation: 2 spaces, LF endings (`.editorconfig`).
- Languages: TypeScript/TSX, MDX, Tailwind CSS.
- Components: PascalCase files in `components/` (e.g., `FeatureOverview.tsx`).
- Pages/Routes: MDX in `pages/` using kebab-case folders (e.g., `pages/docs/...`).
- Imports: path alias `@/*` is available.

## Testing Guidelines
- No unit tests; use build + link validation.
- Run: `pnpm build`, `pnpm link-check`, `pnpm sitemap-check` before PRs.
- For cookbook changes: run `bash scripts/update_cookbook_docs.sh` and commit generated MDX.

## Commit & Pull Request Guidelines
- Commit style mirrors Conventional Commits: `feat:`, `docs:`, `chore:`, etc. Example: `feat: new /watch-demo page`.
- PRs should include: concise description, linked issues, screenshots for UI changes, and notes on scripts run (e.g., cookbook conversion).

## Security & Configuration Tips
- Copy `.env.template` to `.env` for analytics and QA bot features. Only expose keys via `NEXT_PUBLIC_*` vars when intended for client use.
