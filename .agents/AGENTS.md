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

## Third-party integrations

- **Inkeep** — powers both in-site search and the "Ask AI" chat. Two separate
  embeds:
  - **Search** — Inkeep's embedded search widget. Components live in
    `components/inkeep/` (`InkeepSearchBar.tsx`, `search*.tsx`, `useInkeepSettings.ts`).
  - **Chat** — Fumadocs' built-in Inkeep chat integration (`ai-chat-shared.tsx`,
    `embedded-chat.tsx`, `ask-ai-button.tsx`).

## Writing guidelines

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
