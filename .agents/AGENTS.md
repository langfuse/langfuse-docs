# AGENTS.md

This repository powers the Langfuse website hosted on `langfuse.com`, including both the marketing site and docs content (documentation, blog, changelog, FAQ).

## Quickstart

- Use **Node.js 22** (`package.json#engines`).
- Use **pnpm** (`packageManager` is configured in `package.json`).
- Local dev server runs on **http://localhost:3333**.

## Commands you will use most

### Development

- `pnpm dev` — start the local dev server on port 3333 (preferred default after install).
- `pnpm build` — build the production site when you need to validate many pages and the dev server is too slow. This takes about 10 minutes, so do not run it by default for small changes.
- `pnpm start` — run the production build on port 3333 when using the production build for broader checks.

### Content and maintenance

- `bash scripts/update_cookbook_docs.sh` — convert notebook-based cookbook content into docs markdown.
- `pnpm run format` — format supported files with Prettier, including Markdown and MDX. Markdown prose wrapping is preserved and embedded-language formatting is disabled to avoid rendering or fenced-snippet changes.
- `pnpm run format:check` — check Prettier formatting without writing files; CI runs this.
- `pnpm run link-check` — validate markdown links.
- `pnpm run sitemap-check` — validate links from generated sitemap.

### Optional analysis

- `pnpm run analyze` — run a bundle analysis build.

## Repository map

- `content/` — site pages and MDX/Markdown content (marketing pages, docs, blog, changelog, FAQ).
- `components/` — reusable React components.
- `components-mdx/` — custom components used from MDX pages.
- `cookbook/` — source Jupyter notebooks for cookbook guides.
- `content/guides/cookbook/` — generated cookbook markdown output.
- `public/` — static assets.
- `scripts/` — build and maintenance scripts.
- `lib/` — shared utilities/config helpers.

## Core content types

- **Docs**: `content/docs/`
- **Changelog**: `content/changelog/`
- **Blog**: `content/blog/`
- **Guides**: `content/guides/`
- **FAQ**: `content/faq/`

## Important workflow rules

1. For cookbook changes, edit notebook sources in `cookbook/`.
2. Regenerate docs with `bash scripts/update_cookbook_docs.sh`.
3. Do **not** hand-edit generated files in `content/guides/cookbook/`.
4. Avoid `pnpm build` for routine edits or small UI/content changes. Prefer targeted checks or `pnpm dev`, and only run the full production build when it is necessary or explicitly requested.
5. **Always run `pnpm run format` before committing or opening a PR if you edited any file Prettier formats** (see "Passing CI checks on the first try" below). The `format` CI job runs `pnpm run format:check` and fails the build on a single unformatted file.

## Passing CI checks on the first try

CI runs three required checks on every PR. Run these locally before pushing to avoid a re-run cycle:

### 1. Prettier format (`format` job) — this is the check that most often fails

CI runs `pnpm run format:check`. To fix locally, run `pnpm run format` and commit the result.

- Prettier formats: `.js`, `.jsx`, `.mjs`, `.cjs`, `.ts`, `.tsx`, `.json`, `.css`, `.scss`, `.md`, `.mdx`, `.yaml`/`.yml`, `.html`. Any change to one of these — including tiny edits like a one-line tweak to an MDX page, a TSX component, or `next.config.mjs` — can trigger the check.
- Prettier does **not** format files matched by `.prettierignore` (generated cookbook docs in `content/guides/cookbook/**`, `content/workshop/**`, lockfiles, generated assets in `public/`, etc.). Source notebooks (`.ipynb` in `cookbook/`) are also skipped because Prettier has no built-in parser for them.
- Config (`.prettierrc.json`): `proseWrap: "preserve"` (don't reflow Markdown prose), `embeddedLanguageFormatting: "off"` (fenced code blocks are left alone), `trailingComma: "all"`.
- If you touched only files Prettier skips (e.g., a notebook, or a generated file listed in `.prettierignore`), the check will still pass — no need to run format.
- When in doubt, just run `pnpm run format` — it's fast and idempotent.

### 2. H1 heading check (`check_h1` job)

CI runs `node scripts/check-h1-headings.js`. It fails if any `.md`/`.mdx` file contains more than one top-level `# ` heading (code-fenced examples are ignored). Use exactly one H1 per markdown file; deeper sections use `##`, `###`, etc.

### 3. Build + link/sitemap checks (`build-and-check-links`, `check-sitemap-links` jobs)

These run `pnpm build` followed by `pnpm link-check` / `pnpm sitemap-check`. The full build is ~10 minutes — don't run it locally for routine edits. Instead, before pushing:

- Check internal links you added/changed point to real pages or anchors.
- For anchor links (`...#some-id`), make sure the target page defines the anchor explicitly with `[#some-id]` at the end of the heading line.
- If you renamed or moved a page, also update any references and add a redirect in `next.config.mjs` if needed.

## Styling and implementation guidelines

- Use existing **shadcn/ui** patterns and components where possible.
- Use **Tailwind semantic tokens** (avoid hard-coded color values).
- Build mobile-first responsive layouts.

## Key config files

- `next.config.mjs` — Next.js config and redirects.
- `source.config.ts` — declares all Fumadocs content collections (docs, blog, changelog, integrations, marketing, …).
- `lib/source.ts` — exports a `loader` for each collection.
- `lib/section-registry.ts` — maps URL slugs to layout types; all derived routing sets live here. Do not hardcode slugs elsewhere.
- `tailwind.config.js` — Tailwind setup.
- `components.json` — shadcn/ui component config.
- `lib/content-dir-map.js` — single source of truth for mapping `content/` top-level directories to URL prefixes; keep this updated when adding/renaming content sections so `lib/source.ts` and `scripts/copy_md_sources.js` stay in sync.

## Third-party integrations

- **Inkeep** — powers both in-site search and the "Ask AI" chat. Two separate
  embeds:
  - **Search** — Inkeep's embedded search widget. Components live in
    `components/inkeep/` (`InkeepSearchBar.tsx`, `search*.tsx`, `useInkeepSettings.ts`).
  - **Chat** — Fumadocs' built-in Inkeep chat integration (`ai-chat-shared.tsx`,
    `embedded-chat.tsx`, `ask-ai-button.tsx`).

## Writing guidelines

- Use sentence case for user-facing headlines, section headings, and hero copy by default. Keep title case for short standalone navigation/UI labels where it reads more naturally (for example, paired nouns like "Questions & Answers" or conventional labels like "Get Started"). Always preserve proper nouns, acronyms, and official product names.

### Changelog entries

Changelog entries live in `content/changelog/`.

- Title: describe what the user can now do, not an abstract concept. "Filter Observations by Tool Calls" > "Simplify for Scale". Never use the "Feature Name: Rephrasing of Feature Name" format (e.g., "Code-Based Evaluators: Deterministic Evaluation Without LLM Calls"). Keep titles short and punchy — e.g., "Code as a Judge" or "Code-Based Evaluators".
- Lead with what's now possible, not what was missing before. Frame positively — don't highlight past limitations of Langfuse. Weave the value naturally into the intro, not in a "Why This Matters" section buried later.
- Follow the intro immediately with 2-3 concrete example use cases to show relevance. Don't put them in a separate section.
- Keep it concise — every sentence should add new information. Don't repeat what was already said.
- Use visuals (screenshots, `.mp4` videos) for UI changes, interleaved with text.
- Be specific — name actual filters, metrics, commands. Avoid vague adjectives.
- Tone: helpful and conversational, not marketing copy. No filler headings like "Why This Matters", or "Key Benefits."

## Review guidelines

Please check the following:

- Edited text is grammatically correct (American English).
- Edited text has consistent punctuation.
- Code blocks in core documentation include all imports to be self-contained (does not apply to notebooks/cookbooks).
- If blocks of text or code are largely repeated on multiple documentation pages, suggest consolidating them in `components-mdx` to improve maintainability and consistency.
- When embedding videos from YouTube, make sure to embed from `https://www.youtube-nocookie.com` instead of `https://www.youtube.com` to avoid cookies and tracking.
- Use one H1 per markdown file, with subsections in order (`##`, `###`, etc.)—do not skip heading levels.
- We never use `.gif` files, only `.mp4` files uploaded to `static.langfuse.com/docs-videos` to optimize for size and performance.
- When deep-linking to a section via a link that uses the `#` anchor, make sure the anchor is explicitly defined in the source page via `[#anchor]` at the end of the header line, e.g. `## Get Started [#get-started]`.
- If a page/route includes a top-of-file comment that points to an `md-override` source, verify both files are kept in sync whenever either side is edited.

## Cursor Cloud specific instructions

- **Single service**: This is a Next.js website (not a monorepo). The only service to run is `pnpm dev` on port 3333. No databases, Docker, or external services are required for local development.
- **Dev server bind address**: The dev script binds to `127.0.0.1` (`-H 127.0.0.1`), so use `http://127.0.0.1:3333` (not `localhost`) when curling or testing.
- **First page load is slow**: After `pnpm dev` starts ("Ready in ~1s"), the first HTTP request compiles on-demand and can take 20-40 seconds. Subsequent pages are much faster.
- **Langfuse SDK warnings are expected**: The dev server logs `[Langfuse SDK] [WARN] No exporter configured…` on startup. These are harmless — the SDK keys are only needed for optional demo API routes and are not required for the docs site itself.
- **No env file needed**: All external integrations (OpenAI, Supabase, PostHog, etc.) degrade gracefully when keys are absent. You do not need a `.env` file for routine development.
- **postinstall runs agent shim sync**: `pnpm install` triggers `scripts/postinstall.sh`, which syncs agent config shims. This is expected and idempotent.
