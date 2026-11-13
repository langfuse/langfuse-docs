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
- `md-override/` — hand-authored Markdown for routes whose rendered pages are not sourced directly from Markdown/MDX. These files must stay synchronized with their corresponding pages.
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
6. **Always keep Markdown overrides synchronized.** Before changing a page or route, check whether its URL has a corresponding file in `md-override/`. If it does, treat the rendered page and the Markdown override as one source pair: mirror user-facing copy, links, structure, and factual changes in both files in the same change. Do this even when the page does not include a comment pointing to the override.
7. **Preserve custom MDX components in Markdown output.** When creating or adding a custom MDX component that contains user-facing content or links, make sure that content is not removed when the page is converted to plain Markdown. If the content only exists in component props or rendered JSX, add a Markdown renderer in `lib/markdown-component-renderers.js`. Run `node scripts/copy_md_sources.js` and inspect the corresponding file in `public/md-src/` to verify that all content and links remain available to Markdown and PDF consumers.
8. **Users / adopters table archives.** When adding or updating a row in `components-mdx/adopters-table.mdx` whose Reference cell is an external URL, always include a Wayback Machine `[Archive](...)` link. If no snapshot exists yet, request one (`https://web.archive.org/save/{url}`), wait until CDX returns a `200` capture, and cite `https://web.archive.org/web/{timestamp}/{url}`. Percent-encode the URL in CDX queries (`curl -G --data-urlencode`) so `&` in query strings is not parsed as another CDX parameter. Do not ship the row without that archive. Follow `.agents/skills/add-customer-to-user-list/SKILL.md`.

## Passing CI checks on the first try

CI runs four required checks on every PR. Run these locally before pushing to avoid a re-run cycle:

### 1. Prettier format (`format` job) — this is the check that most often fails

CI runs `pnpm run format:check`. To fix locally, run `pnpm run format` and commit the result.

- Prettier formats: `.js`, `.jsx`, `.mjs`, `.cjs`, `.ts`, `.tsx`, `.json`, `.css`, `.scss`, `.md`, `.mdx`, `.yaml`/`.yml`, `.html`. Any change to one of these — including tiny edits like a one-line tweak to an MDX page, a TSX component, or `next.config.mjs` — can trigger the check.
- Prettier does **not** format files matched by `.prettierignore` (generated cookbook docs in `content/guides/cookbook/**`, `content/workshop/**`, lockfiles, generated assets in `public/`, etc.). Source notebooks (`.ipynb` in `cookbook/`) are also skipped because Prettier has no built-in parser for them.
- Config (`.prettierrc.json`): `proseWrap: "preserve"` (don't reflow Markdown prose), `embeddedLanguageFormatting: "off"` (fenced code blocks are left alone), `trailingComma: "all"`.
- If you touched only files Prettier skips (e.g., a notebook, or a generated file listed in `.prettierignore`), the check will still pass — no need to run format.
- When in doubt, just run `pnpm run format` — it's fast and idempotent.

### 2. H1 heading check (`check_h1` job)

CI runs `node scripts/check-h1-headings.js`. It fails if any `.md`/`.mdx` file contains more than one top-level `# ` heading (code-fenced examples are ignored; `AGENTS.md` is excluded because Next.js appends a managed agent-rules H1). Use exactly one H1 per markdown file; deeper sections use `##`, `###`, etc.

### 3. Middle dot check (`check_middle_dot` job)

CI runs `node scripts/check-middle-dot.js` (locally: `pnpm run lint:middle-dot`). It fails if any tracked text file outside `public/` contains a middle dot (U+00B7) or its lookalikes, the bullet operator (U+2219) and the dot operator (U+22C5). It prints each hit as `path:line:col`. The only exceptions are proper nouns on the allowlist in the script (currently only the DALL-E product name). See the writing guidelines for what to use instead.

### 4. Build + link/sitemap checks (`build-and-check-links`, `check-sitemap-links` jobs)

These run `pnpm build` followed by `pnpm link-check` / `pnpm sitemap-check`. The full build is ~10 minutes locally — don't run it for routine edits. Instead, before pushing:

- Check internal links you added/changed point to real pages or anchors.
- For anchor links (`...#some-id`), make sure the target page defines the anchor explicitly with `[#some-id]` at the end of the heading line.
- If you renamed or moved a page, also update any references and add a redirect in `next.config.mjs` if needed.

## Styling and implementation guidelines

- Use existing **shadcn/ui** patterns and components where possible.
- Use **Tailwind semantic tokens** (avoid hard-coded color values).
- Build mobile-first responsive layouts.
- Diagrams must fit the page. Never use horizontal "scroll to explore" for diagrams. Scale the diagram to the available width, and switch to a stacked mobile layout when the scaled version would become unreadable.

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

### No internal ticket ids

This repo and the site are public. Never put an internal ticket id (any Linear team prefix, for example `LFE-1234`, `LFINT-1234`, `LFMKT-1234`) or a Linear URL in page content, commit messages, PR titles, or PR descriptions. This includes closing lines such as `Fixes LFMKT-1234` or `Closes LFE-1234`, even when a task, issue, or template hands you the id. Describe the change on its own terms instead. A ticket-prefixed branch name is the one place the identifier belongs.

- Bad PR description: `Fixes LFMKT-2732. Adds IAM role docs.`
- Good PR description: `Documents IAM role authentication for customer S3 storage.`

### Style and content

- Use sentence case for user-facing headlines, section headings, hero copy, and controls people click. Keep title case for short standalone navigation labels where it reads more naturally (for example, paired nouns like "Questions & Answers"). Always preserve proper nouns, acronyms, and official product names. Do not set button or link labels in all caps (`uppercase` / `text-transform: uppercase`). That treatment is for tiny mono eyebrows, not for actions. Reuse `components/ui/button.tsx` for primary and secondary actions, including its shortcut chip, instead of restyling a one-off link.
- Never use the middle dot (U+00B7) as a separator, in copy, UI strings, eyebrows, or code (for example as the separator in `.join(...)`). Use a comma for lists, a colon or parentheses for a label and its qualifier (`Day 01: Monday`, `Optional (beta)`), and plain spacing or a divider element for purely visual separators. CI enforces this; see "Middle dot check" below.
- Route sales and Enterprise inquiries to the [sales form](/talk-to-us) instead of directing readers to `enterprise@langfuse.com`.
- Add an `<AvailabilityBanner />` to a feature's docs page when the feature is not available on every Langfuse plan or deployment type. Place it directly below the relevant heading: usually the H1, or an H2/H3 when availability applies only to that section.
- Order documentation sections by how many readers need them. The default path most people using the page should follow comes first; optional, advanced, or edge-case settings come later. A new feature can live on the page without jumping ahead of the core workflow.
- Give prominent, current behavior an evergreen home. Blog posts and changelog entries are tied to a date, so a fact most users of a feature need (how it works, a default, a limit, a pricing rule) must also live on a docs page. Integration pages and FAQ entries count as evergreen homes too. Scope:
  - The rule covers only facts an engineer needs to understand, set up, use, or troubleshoot the feature, or a limitation that changes what they do. Marketing and sales claims (performance or scale figures, image size, customer counts, comparisons), announcements, and discoverable UI conveniences can live only in the post.
    - Needs a docs home: "Google bills only input tokens for decisions" (changes what the reader pays).
    - Fine in the post only: "1,000+ concurrent streams on a single 2 vCPU node", "a 22 MB Docker image", "Cmd+K now has create actions".
  - Migration guidance for an older Langfuse or SDK version stays on its migration guide or FAQ. A current docs page gets at most a one-line link to it, not the guidance itself.
  - A niche caveat (one SDK, one protocol, one edge case) may live only on the integration page or FAQ where people run into it.
  - A changelog entry whose main claim has a docs home sets frontmatter `canonical` to that page.

### Changelog entries

Changelog entries live in `content/changelog/`.

- Title: describe what the user can now do, not an abstract concept. "Filter Observations by Tool Calls" > "Simplify for Scale". Never use the "Feature Name: Rephrasing of Feature Name" format (e.g., "Code-Based Evaluators: Deterministic Evaluation Without LLM Calls"). Keep titles short and punchy — e.g., "Code as a Judge" or "Code-Based Evaluators".
- Lead with what's now possible, not what was missing before. Frame positively — don't highlight past limitations of Langfuse. Weave the value naturally into the intro, not in a "Why This Matters" section buried later.
- Follow the intro immediately with 2-3 concrete example use cases when the entry adds a new capability or workflow (for example API key permissions, a PagerDuty integration, a redesigned view). Don't put them in a separate section.
- Skip the use cases when the entry only extends an existing feature to another provider, model, endpoint, or SDK, or changes API behavior or a config option. The parent feature's use cases already apply. Say in the intro what is now covered and how to turn it on, then link the docs. Never pad with generic use cases to reach a count.
  - Needs use cases: "You can now set an expiration date on API keys" (a temporary integration key, a 90-day rotation).
  - Fine without: "You can now send OpenAI Embeddings requests through the AI Gateway at `POST /openai/v1/embeddings`."
- Keep it concise — every sentence should add new information. Don't repeat what was already said.
- Use visuals (screenshots, `.mp4` videos) for UI changes, interleaved with text. Flag UI-change entries that have no screenshot or video. Do not invent visuals.
- Be specific — name actual filters, metrics, commands. Avoid vague adjectives.
- Tone: helpful and conversational, not marketing copy. No filler headings like "Why This Matters", or "Key Benefits."

## Review guidelines

Please check the following:

- Flag any internal ticket id (`LFE-`, `LFINT-`, `LFMKT-`, or any other Linear prefix) or Linear URL in page content, commit messages, the PR title, or the PR description, including `Fixes <ticket>` / `Closes <ticket>` lines. Only the branch name may carry it. See "No internal ticket ids" above.
- Edited text is grammatically correct (American English).
- Edited text has consistent punctuation.
- Flag any middle dot (U+00B7) used as a separator, including in UI strings and code.
- Code blocks in core documentation include all imports to be self-contained (does not apply to notebooks/cookbooks).
- When documentation is added or expanded, do not repeat the same information on a page. Each fact or explanation should appear once; later sections should link back instead of restating it.
- A product area's Troubleshooting and FAQ page should contain only the pieces below. This applies to every page of this kind, including ones added later. Flag a new or edited page that adds any other section or body content. It does not apply to a feature page that ends with a short FAQ, or to a troubleshooting page whose job is inline answers.
  - An optional short intro paragraph, and only when it adds something the components below do not. Do not add the repeated "try Ask AI / open a GitHub issue / contact support" paragraph.
  - `<FaqPreview tags={[...]} />` from `components/faq/FaqPreview.tsx`: the list of links to that area's FAQ articles. Keep this component. Do not replace it with a hand-written link list or inline Q&A.
  - `<GhDiscussionsPreview labels={[...]} />` from `components/gh-discussions/GhDiscussionsPreview.tsx`: the GitHub Discussions component already on these pages. Keep this component. Do not replace it with a prose link to GitHub Issues.
- Flag a blog post or changelog entry that states a prominent, current behavior (how a feature works, a default, a limit, a pricing rule) that no docs, integration, or FAQ page states, and a changelog whose main claim has a docs home but no frontmatter `canonical`. Do not flag marketing or sales claims (performance or scale figures, image size, customer counts, comparisons), announcements, or discoverable UI conveniences that need no instructions; only facts an engineer needs to understand, set up, use, or troubleshoot the feature need a docs home. Do not flag migration guidance for an older version that lives only on its migration guide or FAQ, a niche caveat that lives only on the integration page or FAQ where people hit it, or historical context ("starting today", "previously") that only makes sense in the post.
- If blocks of text or code are largely repeated on multiple documentation pages, suggest consolidating them in `components-mdx` to improve maintainability and consistency.
- Flag duplication only when the PR creates a new copy. A PR that restores a removed page or section, reverts an earlier change, or moves content (deleting the old copy) puts back or relocates the one existing version, so do not flag it as duplication even when the added lines match text on another page. For example, restoring the original Prompt & Skill Management overview content is a restore, not a copy of `prompt-management/overview`. Raise any overlap that predates the PR as a separate cleanup note, not as a rule violation of that PR.
- Pages in `content/resources/engineering/` are GEO content for search engines and AI answers, not pages readers navigate to. Do not flag them for duplicating docs content or for docs-page structure checks such as the opening visual or the Overview, Get started, and FAQ layout. Still check accuracy, links, grammar, and the CI checks.
- Avoid specific model names in documentation; they go stale quickly. Prefer generic phrasing such as "your model" or the provider family, and flag new or edited docs that pin a versioned model name unless the page is specifically about that model.
- In documentation tables, every column must add enough value on its own. Prefer fewer columns: merge or remove any column that does not help the reader, and flag tables that would stay clear with fewer columns.
- Put failure modes, scope limits, and similar caveats in a `<Callout>` so they stand out. Flag new or edited docs that bury these in body copy.
- Order sections by audience. Flag a new or edited page that leads with optional, advanced, or edge-case details (for example a custom endpoint or extra headers) ahead of the sections most readers of that page need (for example managing models or choosing a model ID).
- When embedding videos from YouTube, make sure to embed from `https://www.youtube-nocookie.com` instead of `https://www.youtube.com` to avoid cookies and tracking. Always add `rel=0` to the embed URL so related videos are limited to the same channel.
- Every documentation page should include a screenshot or screen recording of the feature near the beginning of the page, after the intro. Use a `<Frame>` screenshot or a `<Video>`. Flag new or edited docs pages that have no opening visual.
- When a PR adds or edits a changelog entry in `content/changelog/`, flag it if an entry that adds a new capability or workflow does not follow its intro immediately with 2-3 concrete example use cases (do not flag entries that only add a provider, model, endpoint, or SDK to an existing feature, or change API behavior or a config option), or if a UI change has no screenshot or `.mp4` video that readers see on the page. Frontmatter `ogImage` / `ogVideo` counts only when `showOgInHeader` is not `false`; if that flag is `false`, the visual must be in the body. A one-sentence changelog that only restates the title and links to docs is incomplete. Flag the changelog even when the rest of the PR (docs, code samples) is complete. Do not invent screenshots or other visuals to fill the gap; flag the missing visual so a maintainer can add it.
- Flag diagrams that rely on horizontal scroll-to-explore instead of fitting the page, shrinking as needed, or switching to a mobile layout.
- Use one H1 per markdown file, with subsections in order (`##`, `###`, etc.)—do not skip heading levels.
- We never use `.gif` files, only `.mp4` files uploaded to `static.langfuse.com/docs-videos` to optimize for size and performance.
- When deep-linking to a section via a link that uses the `#` anchor, make sure the anchor is explicitly defined in the source page via `[#anchor]` at the end of the header line, e.g. `## Get Started [#get-started]`.
- For every edited page or route, check `md-override/` for a corresponding Markdown source. When one exists, verify the rendered page and override remain synchronized; a top-of-file comment is helpful but not required for this rule to apply.
- When linking to a Langfuse app page from docs, use `https://cloud.langfuse.com/project/~/[path]` — the `~` sentinel redirects to the reader's last-used project and region automatically.
- External `/users` adopters-table references must include a Wayback `[Archive](...)` link. Request a Save Page Now snapshot when none exists; do not omit the archive.

## Cursor Cloud specific instructions

- **Single service**: This is a Next.js website (not a monorepo). The only service to run is `pnpm dev` on port 3333. No databases, Docker, or external services are required for local development.
- **Dev server bind address**: The dev script binds to `127.0.0.1` (`-H 127.0.0.1`), so use `http://127.0.0.1:3333` (not `localhost`) when curling or testing.
- **First page load is slow**: After `pnpm dev` starts ("Ready in ~1s"), the first HTTP request compiles on-demand and can take 20-40 seconds. Subsequent pages are much faster.
- **Langfuse SDK warnings are expected**: The dev server logs `[Langfuse SDK] [WARN] No exporter configured…` on startup. These are harmless — the SDK keys are only needed for optional demo API routes and are not required for the docs site itself.
- **No env file needed**: All external integrations (OpenAI, Supabase, PostHog, etc.) degrade gracefully when keys are absent. You do not need a `.env` file for routine development.
- **Site search is inert locally**: The `Ctrl/Cmd+K` search dialog (powered by Inkeep) opens but returns no results without Inkeep keys. This is expected; use sidebar/link navigation to reach pages when testing docs locally.
- **postinstall runs agent shim sync**: `pnpm install` triggers `scripts/postinstall.sh`, which syncs agent config shims. This is expected and idempotent.
- **Walkthrough screenshots and demo videos**: Create these only for complex visual changes that cannot be understood from the diff alone — for example multi-step UI interactions, layout or responsive changes, or new interactive components. Do not create screenshots or demo videos for small edits such as copy changes, docs or markdown updates, simple style tweaks, or other changes that are clear from the code diff. In those cases, the diff is sufficient evidence.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
