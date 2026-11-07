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

CI runs three required checks on every PR. Run these locally before pushing to avoid a re-run cycle:

### 1. Prettier format (`format` job) — this is the check that most often fails

CI runs `pnpm run format:check`. To fix locally, run `pnpm run format` and commit the result.

- Prettier formats: `.js`, `.jsx`, `.mjs`, `.cjs`, `.ts`, `.tsx`, `.json`, `.css`, `.scss`, `.md`, `.mdx`, `.yaml`/`.yml`, `.html`. Any change to one of these — including tiny edits like a one-line tweak to an MDX page, a TSX component, or `next.config.mjs` — can trigger the check.
- Prettier does **not** format files matched by `.prettierignore` (generated cookbook docs in `content/guides/cookbook/**`, `content/workshop/**`, lockfiles, generated assets in `public/`, etc.). Source notebooks (`.ipynb` in `cookbook/`) are also skipped because Prettier has no built-in parser for them.
- Config (`.prettierrc.json`): `proseWrap: "preserve"` (don't reflow Markdown prose), `embeddedLanguageFormatting: "off"` (fenced code blocks are left alone), `trailingComma: "all"`.
- If you touched only files Prettier skips (e.g., a notebook, or a generated file listed in `.prettierignore`), the check will still pass — no need to run format.
- When in doubt, just run `pnpm run format` — it's fast and idempotent.

### 2. H1 heading check (`check_h1` job)

CI runs `node scripts/check-h1-headings.js`. It fails if any `.md`/`.mdx` file contains more than one top-level `# ` heading (code-fenced examples are ignored; `AGENTS.md` is excluded because Next.js appends a managed agent-rules H1). Use exactly one H1 per markdown file; deeper sections use `##`, `###`, etc.

### 3. Build + link/sitemap checks (`build-and-check-links`, `check-sitemap-links` jobs)

These run `pnpm build` followed by `pnpm link-check` / `pnpm sitemap-check`. The full build is ~10 minutes locally — don't run it for routine edits. Instead, before pushing:

- Check internal links you added/changed point to real pages or anchors.
- For anchor links (`...#some-id`), make sure the target page defines the anchor explicitly with `[#some-id]` at the end of the heading line.
- If you renamed, moved, or removed a page or section, search for links to its URL or anchor and repoint them. Add a redirect in `lib/redirects.js` only for URLs that have been live on langfuse.com; pages that were never published need no redirect.

## Styling and implementation guidelines

- Use existing **shadcn/ui** patterns and components where possible.
- Use **Tailwind semantic tokens** (avoid hard-coded color values).
- Build mobile-first responsive layouts.
- Diagrams must fit the page. Never use horizontal "scroll to explore" for diagrams. Scale the diagram to the available width, and switch to a stacked mobile layout when the scaled version would become unreadable.

## Key config files

- `next.config.mjs` — Next.js config; loads the redirects defined in `lib/redirects.js`.
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

- Use sentence case for user-facing headlines, section headings, hero copy, and controls people click. Keep title case for short standalone navigation labels where it reads more naturally (for example, paired nouns like "Questions & Answers"). Always preserve proper nouns, acronyms, and official product names. Do not set button or link labels in all caps (`uppercase` / `text-transform: uppercase`). That treatment is for tiny mono eyebrows, not for actions. Reuse `components/ui/button.tsx` for primary and secondary actions, including its shortcut chip, instead of restyling a one-off link.
- Route sales and Enterprise inquiries to the [sales form](/talk-to-us) instead of directing readers to `enterprise@langfuse.com`.
- Add an `<AvailabilityBanner />` to a feature's docs page when the feature is not available on every Langfuse plan or deployment type. Place it directly below the relevant heading: usually the H1, or an H2/H3 when availability applies only to that section.
- Never reference internal ticket ids (`LFE-1234`, `LFINT-1234`) or Linear URLs in page content, commit messages, or PR descriptions. They mean nothing to readers of the public site or repo. Describe the change on its own terms; a ticket-prefixed branch name is the one place the identifier belongs.

### Documentation pages

These rules cover pages in `content/docs/` and integration guides in `content/integrations/`.

#### Where content belongs

- Before you add or restructure a page, open the equivalent page in an established product area, such as `content/docs/observability/` or `content/docs/evaluation/`, and match its structure, components, and sidebar position. When a product area has these pages, keep this sidebar order: Overview, Get started, Concepts, Features, Integrations, Troubleshooting and FAQ.
- **Overview** pages say what problem the product solves and what readers can do with it: a short intro, a list of capabilities that each link to their feature page, and a "Getting started" section near the end that links to the get-started guides, split by role when admins and users follow different guides. Request formats, credentials, limitations, availability, pricing, and lists of next steps belong on deeper pages.
- **Concepts** pages explain how the product works: its components, the request or data flow, and the objects readers configure, such as keys, modes, and routing. Give each major concept a diagram or a table, and answer the questions a newcomer asks first, such as where the product runs and who sets it up. Leave out implementation details that don't change what the reader does.
- **Feature** pages open with one or two sentences on what the feature does, who can use it, and where to find it in the UI. Put long reference lists, such as every recorded field or response header, in a `<Details>` block whose `<Summary>` names the content. Put optional deep-dive topics in a closing `## FAQ` section that wraps question-titled `<Details>` blocks in `<FaqDetails>`.
- **Integration** guides for third-party tools (coding agents, SDKs, frameworks, model providers) live in `content/integrations/`, not in a product's docs folder. To list them in a product's sidebar, add `external:[Name ↗](/integrations/...)` entries to that product's `integrations/meta.json`. When the tool already has an integration page for another Langfuse product, add a sibling page, for example `claude-code-gateway.mdx` next to `claude-code.mdx`.
- **API reference** pages for endpoints that relay a third-party API document only what Langfuse adds or changes: base URLs, authentication, the endpoint list, and deviations. Link each endpoint to the provider's reference instead of copying its request fields, response fields, or sample responses.
- **Troubleshooting** content goes into one FAQ page per problem or question in `content/faq/all/`, tagged so `<FaqPreview>` lists it. Feature, get-started, and self-hosting pages link to those FAQ pages instead of keeping their own troubleshooting sections.

#### Get started pages

- Open with one sentence on what the reader will accomplish, a link to the Concepts page, and, when admins and users have separate guides, a link to the other guide.
- Put the steps under a `## Setup steps` heading inside `<Steps>`. Each step is one task; fold small actions, such as exporting the key the reader just created, into the step that produces the value.
- Don't add a "Before you begin" or prerequisites section. Put each requirement (role, plan, deployment type, prior setup) in the step where the reader would hit it, as an info callout at the end of that step. Caveats that apply to the whole procedure go above `<Steps>`.
- When setup differs per tool, client, or language, give each its own tab with everything needed to finish there: an italic requirements line such as `_**Requires** <tool> <version> or later and <prerequisite>._`, the minimal configuration, a command that confirms it works, and a card that links to the full guide. A tab that only links to another page is not enough. Also use tabs for alternative ways to do one step, such as the Langfuse UI and the API.
- End with a "Not seeing what you expected?" section that uses `<FaqPreview>` with the area's get-started tag and, if there is an obvious next guide, a "Next steps" list with just that link.

#### Cut what the reader doesn't need

- Keep a sentence only if the reader needs it and can't get it from the UI, the heading, or the previous sentence. Cut:
  - descriptions of what the UI already shows, such as dialog fields, bulk-select buttons, default filter values, or "copy the key, it's shown only once"
  - implementation details that don't change what the reader does, such as "the key is validated when you save it"
  - remarks about the page itself, such as "Complete the steps in order" or "Each tab shows the minimal setup"
  - generic security or best-practice warnings that aren't specific to the feature, such as "never commit keys to a repository"
  - filler words and clauses, such as "also", "without changing any client", or "in the setup guide"
- If a section is hard to write, decide the one thing the reader needs from it and say that. Most sections fit in three sentences. An edge case of a section, such as when a key stops working, is a short callout on that section, not a section of its own.
- Introduce a list or a set of rules with a sentence that says what problem it solves. Bullets without that context read as noise.

#### Wording and structure

- Name what you refer to. Write "the **Models**, **Gateway keys**, and **Analytics** tabs", not "the other pages", and link to the section that explains a term, not to the top of its page.
- A heading must tell the reader what the section contains. Prefer short names for the concept, such as "Request flow", "Credential types", or "Model and key routing", over vague phrases such as "How a request reaches a model".
- Keep pages evergreen. Don't build an intro or a heading around today's supported providers, endpoints, versions, or limits; keep those in one table, limitations page, or roadmap that is updated when they change.
- Examples that hard-code a regional Langfuse Cloud URL say which region they use and link to the URLs of the other regions.
- When you rename a page, change its frontmatter `title` (the sidebar label) and its H1 together. Sidebar labels must fit on one line, about three or four words.

#### Formatting

- Use `info` callouts for side notes, requirements, defaults, and pointers. Reserve `warning` for things that expose or lose data, cost money unexpectedly, or break a setup.
- Use a table when several items share the same attributes, such as key types, ingestion modes, or per-key-type behavior. Keep cells to a few words and put explanations in the surrounding text. Turn a sentence that lists three or more parallel items into a bulleted list.
- Link the key word or short phrase, not a whole sentence or bullet. Link text names its target, for example "trace user ID" or "Concepts". Put "See X" references in the sentence they support, not on a line of their own.
- Use relative links to langfuse.com pages. Never link to preview deployments (`*.vercel.app`) or leave placeholder link targets.
- When a page needs a screenshot or recording that doesn't exist yet, put `<TextHighlight className="italic">TODO: add a screenshot of …</TextHighlight>` (from `@/components/ui/text-highlight`) where it belongs, not a callout, and list it in the PR description. Resolve every TODO highlight before merge.

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
- When documentation is added or expanded, do not repeat the same information on a page or across a product area's pages. Each fact or explanation should appear once; other sections and pages link to it instead of restating it. Overview, Concepts, and Get started pages may summarize a feature in a sentence or a short table before linking to it.
- Check new or edited docs pages against the "Documentation pages" rules under Writing guidelines. In addition:
  - Read the page as a first-time reader. Flag references the reader can't resolve, headings the section doesn't deliver on, lists without context, and obvious newcomer questions the page leaves open, such as where the product runs or who sets it up.
  - For each sentence, ask whether the reader would miss it if it were gone. Suggest cutting sentences that fail this test instead of rewording them.
  - Compare the page with its equivalent in another product area and flag structural differences, such as a missing "Getting started" or "Not seeing what you expected?" section, a prerequisites section, or troubleshooting kept inline instead of in FAQ pages.
  - On get-started pages, check that a reader can reach a working setup using only that page, and using only the tab they selected.
  - Flag leftover TODO highlights, placeholder link targets, and links to preview deployments.
- A product area's Troubleshooting and FAQ page should contain only the pieces below. This applies to every page of this kind, including ones added later. Flag a new or edited page that adds any other section or body content. It does not apply to a feature page that ends with a short FAQ, or to a troubleshooting page whose job is inline answers.
  - An optional short intro paragraph, and only when it adds something the components below do not. Do not add the repeated "try Ask AI / open a GitHub issue / contact support" paragraph.
  - `<FaqPreview tags={[...]} />` from `components/faq/FaqPreview.tsx`: the list of links to that area's FAQ articles. Keep this component. Do not replace it with a hand-written link list or inline Q&A.
  - `<GhDiscussionsPreview labels={[...]} />` from `components/gh-discussions/GhDiscussionsPreview.tsx`: the GitHub Discussions component already on these pages. Keep this component. Do not replace it with a prose link to GitHub Issues.
- If blocks of text or code are largely repeated on multiple documentation pages, suggest consolidating them in `components-mdx` to improve maintainability and consistency.
- Avoid specific model names in documentation; they go stale quickly. Prefer generic phrasing such as "your model" or the provider family, and flag new or edited docs that pin a versioned model name unless the page is specifically about that model.
- In documentation tables, every column must add enough value on its own. Prefer fewer columns: merge or remove any column that does not help the reader, and flag tables that would stay clear with fewer columns.
- Put failure modes, scope limits, and similar caveats in a `<Callout>` so they stand out. Flag new or edited docs that bury these in body copy.
- When embedding videos from YouTube, make sure to embed from `https://www.youtube-nocookie.com` instead of `https://www.youtube.com` to avoid cookies and tracking. Always add `rel=0` to the embed URL so related videos are limited to the same channel.
- Every documentation page should include a screenshot or screen recording of the feature near the beginning of the page, after the intro. Use a `<Frame>` screenshot or a `<Video>`. Flag new or edited docs pages that have no opening visual.
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
