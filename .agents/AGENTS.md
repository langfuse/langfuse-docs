# AGENTS.md

This repository powers the Langfuse website hosted on `langfuse.com`, including both the marketing site and docs content (documentation, blog, changelog, FAQ).

## Quickstart

- Use **Node.js 24** (`package.json#engines`).
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
- **Handbook**: `content/handbook/`

## Important workflow rules

1. For cookbook changes, edit notebook sources in `cookbook/`.
2. Regenerate docs with `bash scripts/update_cookbook_docs.sh`.
3. Do **not** hand-edit generated files in `content/guides/cookbook/`.
4. Avoid `pnpm build` for routine edits or small UI/content changes. Prefer targeted checks or `pnpm dev`, and only run the full production build when it is necessary or explicitly requested.
5. **Always run `pnpm run format` before committing or opening a PR if you edited any file Prettier formats** (see "Passing CI checks on the first try" below). The `format` CI job runs `pnpm run format:check` and fails the build on a single unformatted file.
6. **Always keep Markdown overrides synchronized.** Before changing a page or route, check whether its URL has a corresponding file in `md-override/`. If it does, treat the rendered page and the Markdown override as one source pair: mirror user-facing copy, links, structure, and factual changes in both files in the same change. Do this even when the page does not include a comment pointing to the override.
7. **Preserve custom MDX components in Markdown output.** When creating or adding a custom MDX component that contains user-facing content or links, make sure that content is not removed when the page is converted to plain Markdown. If the content only exists in component props or rendered JSX, add a Markdown renderer in `lib/markdown-component-renderers.js`. Run `node scripts/copy_md_sources.js` and inspect the corresponding file in `public/md-src/` to verify that all content and links remain available to Markdown consumers.
8. **Users / adopters table archives.** When adding or updating a row in `components-mdx/adopters-table.mdx` whose Reference cell is an external URL, always include a Wayback Machine `[Archive](...)` link. If no snapshot exists yet, request one (`https://web.archive.org/save/{url}`), wait until CDX returns a `200` capture, and cite `https://web.archive.org/web/{timestamp}/{url}`. Percent-encode the URL in CDX queries (`curl -G --data-urlencode`) so `&` in query strings is not parsed as another CDX parameter. Do not ship the row without that archive. Follow `.agents/skills/add-customer-to-user-list/SKILL.md`.
9. Never reference internal ticket ids (`LFE-1234`, `LFINT-1234`) or Linear URLs in page content, commit messages, or PR descriptions. They mean nothing to readers of the public site or repo. Describe the change on its own terms; a ticket-prefixed branch name is the one place the identifier belongs.
10. Never include internal Slack references in page content, code, commit messages, or PR descriptions. This covers channel names (`#team-docs`), channel, user, or message IDs (`C0123ABCD`, `U0123ABCD`), workspace names, message or thread links (`*.slack.com/...`), and quotes or summaries attributed to internal threads. The repo and site are public, so describe the change and its reasoning on its own terms. The only exception is the content of handbook pages (`content/handbook/`) for page content only (Commit messages/PR descriptions still prohibited).

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

CI runs `node scripts/check-h1-headings.js`. It fails if any `.md`/`.mdx` file contains more than one top-level `# ` heading (code-fenced examples are ignored; `AGENTS.md` is excluded because Next.js appends a managed agent-rules H1). Use exactly one H1 per markdown file; deeper sections use `##`, `###`, etc. Do not skip heading levels.

### 3. Middle dot check (`check_middle_dot` job)

CI runs `node scripts/check-middle-dot.js` (locally: `pnpm run lint:middle-dot`). It fails if any tracked text file outside `public/` contains a middle dot (U+00B7) or its lookalikes, the bullet operator (U+2219) and the dot operator (U+22C5). It prints each hit as `path:line:col`. The only exceptions are proper nouns on the allowlist in the script (currently only the DALL-E product name). See the writing guidelines for what to use instead.

### 4. Build + link/sitemap checks (`build-and-check-links`, `check-sitemap-links` jobs)

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

## Writing guidelines: Read this every time you add or change content to a docs page

- When changing something, always make the change considering the surrounding page and what a first-time reader of that page already expects. Prefer the smallest edit that leaves the page accurate. The less new sentences you introduce, the better. Do not add a concept, history, or reassurance the rest of the page does not already rely on, unless readers would otherwise follow a dead path.
- Order documentation sections by how many readers need them. The default path most people using the page should follow comes first; optional, advanced, or edge-case settings come later. A new feature can live on the page without jumping ahead of the core workflow.

### Documentation page-specific guidelines

These rules cover pages in `content/docs/`, integration guides in `content/integrations/`, and changelog entries in `content/changelog/`.

#### Where content belongs: read this before adding anything [#where-content-belongs]

- **Overview** pages get readers excited about the product area and make clear why it is valuable to them. Each item on this page should really earn their place. More often than not, you should not touch the overview page for a new feature addition.
- **Concepts** pages explain how the product works at a high level: its components, the request or data flow, and the objects readers configure. This is a conceptual page.
- **Feature** pages describe a specific feature of the product area. Anything feature-specific should be on a feature docs page or in an FAQ/troubleshooting page that's linked to from the feature docs page.
- **Integration** guides for third-party tools (coding agents, SDKs, frameworks, model providers) live in `content/integrations/`, not in a product's docs folder. If integration is a prominent Langfuse feature in its own right, link the individual integration page from the docs sidebar, with an `external:[Name ↗](/integrations/...)` entry in a `meta.json`. This is almost never the case and using this should be an exception.
- **API reference** pages for endpoints that relay a third-party API document only what Langfuse adds or changes: base URLs, authentication, the endpoint list, and deviations. Link each endpoint to the provider's reference instead of copying its request fields, response fields, or sample responses. [#api-reference-pages]
- **Troubleshooting** content goes into one FAQ page per problem or question in `content/faq/all/`, tagged so `<FaqPreview>` lists it. A very short note can stay at the bottom of a feature page. Longer troubleshooting on a feature, get-started, or self-hosting page is a link to those FAQ pages.
- **Changelog** entries announce what a user can now do. They live in `content/changelog/`, including when the docs already explain the feature.

- Before you add or restructure a page, open one or more equivalent pages in an established product area, such as `content/docs/observability/` or `content/docs/evaluation/`, and match their structure, components, and sidebar position. When a product area has these pages, keep this sidebar order: Overview, Get started, Concepts, Features, Integrations, Troubleshooting and FAQ.
- each docs fact has 1 home (source of truth), if the fact is relevant on other pages, these pages link to that source of truth instead of replicating the content.

Once you decide what type of page the content should be on, always read the section about that page type in [Page type structure and content](page-types.md). It's imperative that you judge your change/addition with this context in mind.

#### Cut what the reader doesn't need [#cut-what-the-reader-doesnt-need]

- Keep a sentence only if the reader needs it and can't get it from the UI, the heading, or the previous sentence. Cut:
  - descriptions of what the UI already shows, such as dialog fields, bulk-select buttons, default filter values, or "copy the key, it's shown only once"
  - implementation details that don't change what the reader does, such as "the key is validated when you save it"
  - remarks about the page itself, such as "Complete the steps in order" or "Each tab shows the minimal setup"
  - generic security or best-practice warnings that aren't specific to the feature, such as "never commit keys to a repository"
  - filler words and clauses, such as "also", "without changing any client", or "in the setup guide"
- If a section is hard to write, decide the one thing the reader needs from it and say that. Most sections fit in three sentences. An edge case of a section, such as when a key stops working, is a short callout on that section, not a section of its own.
- Introduce a list or a set of rules with a sentence that says what problem it solves. Bullets without that context read as noise.

Once done with a first draft, look at what you've written again and aim to cut 50% of it. You will, in most cases, be able to do that. Seriously question whether you did a good review if you cut less than 50% and look again.

#### Wording and structure [#wording-and-structure]

- Name what you refer to. Write "the **Models**, **Gateway keys**, and **Analytics** tabs", not "the other pages", and link to the section that explains a term, not to the top of its page.
- A heading must tell the reader what the section contains. Prefer short names for the concept, such as "Request flow", "Credential types", or "Model and key routing", over vague phrases such as "How a request reaches a model".
- Use sentence case for user-facing headlines, section headings, hero copy, and controls people click. Keep title case for short standalone navigation labels where it reads more naturally (for example, paired nouns like "Questions & Answers").
- Always preserve proper nouns, acronyms, and official product names.
- Edited text is grammatically correct (American English) and has consistent punctuation.
- Keep pages evergreen. Don't build an intro, heading, or step-by-step instruction around today's supported providers, endpoints, versions, or limits. Often the docs don't need to list them at all, because readers discover them while using the product. Don't enumerate providers in a setup step that works the same for every provider. When a list is still needed, keep it in one table, limitations page, or roadmap that is updated when they change.
- Only add provider-specific guidance when the reader needs something they cannot figure out from the product. If that guidance is short, put it at the bottom of the feature page; if it is long, use a linked FAQ page. Push back on requests to add provider-specific setup that restates what the UI already shows.
- Examples that hard-code a regional Langfuse Cloud or gateway URL put the region in the snippet, not in a sentence after it. Mark the live URL as EU and list the other region URLs as comments in the same snippet, matching the get-started env comments (`components-mdx/env-python.mdx`) or, for gateway hosts, the host comments on [Send your first request](/docs/gateway/get-started/first-request). Later snippets may reuse a host variable from that snippet. Do not add a post-snippet caveat that only names the region and links elsewhere.
- When you rename a page, change its frontmatter `title` (the sidebar label) and its H1 together. Sidebar labels must fit on one line, about three or four words.
- Add an `<AvailabilityBanner />` to a feature's docs page when the feature is not available on every Langfuse plan or deployment type. Place it directly below the relevant heading: usually the H1, or an H2/H3 when availability applies only to that section. Use the banner instead of spelling out plans or editions in prose, even for a short section such as a single setting. Changelog entries do not mention plan availability; the docs page they link to shows it in its banner.
- Route sales and Enterprise inquiries to the [sales form](/talk-to-us) instead of directing readers to `enterprise@langfuse.com`.

#### Formatting [#formatting]

- Use `info` callouts for side notes, requirements, defaults, pointers, failure modes, and scope limits. Reserve `warning` for things that expose or lose data, cost money unexpectedly, or break a setup.
- Use a table when several items share the same attributes, such as key types, ingestion modes, or per-key-type behavior. Cut or merge as many columns as you can, and keep only the ones that add real value or match similar tables on the same page. Keep cells to a few words and put explanations in the surrounding text. Turn a sentence that lists three or more parallel items into a bulleted list.
- Code blocks in core documentation include all imports. Notebooks and cookbooks are exempt.
- Link the key word or short phrase, not a whole sentence or bullet. Link text names its target, for example "trace user ID" or "Concepts". Put "See X" references in the sentence they support, not on a line of their own.
- Use relative links to langfuse.com pages. Never link to preview deployments (`*.vercel.app`) or leave placeholder link targets. Do not leave a TODO in a published page.
- App links from docs use `https://cloud.langfuse.com/project/~/[path]`. The `~` sentinel redirects to the reader's last-used project and region.
- When embedding videos from YouTube, embed from `https://www.youtube-nocookie.com` and add `rel=0`.
- Use `.mp4` files on `static.langfuse.com/docs-videos`. Do not use `.gif` files.
- Do not set button or link labels in all caps (`uppercase` / `text-transform: uppercase`). Reuse `components/ui/button.tsx` for primary and secondary actions, including its shortcut chip, instead of restyling a one-off link. Do not use all caps eyebrows anywhere.
- Never use the middle dot (U+00B7) as a separator, in copy, UI strings, eyebrows, or code (for example as the separator in `.join(...)`). Use a comma for lists, a colon or parentheses for a label and its qualifier (`Day 01: Monday`, `Optional (beta)`), and plain spacing or a divider element for purely visual separators. CI enforces this; see "Middle dot check" below.

## Review guidelines

Read [Review guidelines](review-guidelines.md) before commenting on a pull request. NEVER SKIP THIS, these are the only rules you should review against, don't come up with another set of rules instead of reading these.

## Cursor Cloud specific instructions

- **Single service**: This is a Next.js website (not a monorepo). The only service to run is `pnpm dev` on port 3333. No databases, Docker, or external services are required for local development.
- **Dev server bind address**: The dev script binds to `127.0.0.1` (`-H 127.0.0.1`), so use `http://127.0.0.1:3333` (not `localhost`) when curling or testing.
- **Letting the user preview pages**: The browser tab in the Cursor interface cannot reach a server bound to `127.0.0.1`. When the user wants to look at pages themselves, run `pnpm exec next dev -p 3333 -H 0.0.0.0` in a tmux session instead of `pnpm dev`, and send them `http://127.0.0.1:3333/<path>` (or the VM address from `hostname -I` if that refuses to connect). Live reload is blocked from that origin, so tell them to refresh after edits. Keep the branch under review checked out while the server runs, because it serves the working tree.
- **Next.js upgrade prompt on first start**: The first `next dev` run on a fresh VM can exit right after printing a `next upgrade` recommendation. Start it again; the second run starts normally. Do not run the upgrade unless the user asks.
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
