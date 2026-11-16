# Review guidelines

Review added and changed content in two gates. Read the surrounding docs, and what the product and screenshots already show, before you judge an addition. Run gate 1 first. One gate 1 failure stops comments on wording, headings, callouts, and structure. Say what to remove or which home it belongs in. Do not rewrite an addition that should be cut, and do not paste it into the destination. Checks that are not about form still run on that review. They are listed under Checks that always run.

Judge the change in the context of the existing docs. Also flag existing text when the change makes that text a duplicate, something the open screen now shows, or a job the page no longer has. Name the passage and why the change removed its reason to stay. Leave every other existing sentence alone. Pages the diff does not edit are context only.

The writing rules these checks use live in [AGENTS.md](AGENTS.md).

## Gate 1: Necessity and place

Gate 1 applies to pages in `content/docs/`, `content/integrations/`, `content/guides/`, and `content/faq/`. A changelog entry in `content/changelog/` is an announcement of a feature the docs may already explain. It is not a second copy, and it does not move into a docs home. Judge it with [Changelog entries](AGENTS.md#changelog-entries) and the checks that always run.

### Necessity

Keep a fact only when a reader with that screen open still could not know it. Also cut every category in [Cut what the reader doesn't need](AGENTS.md#cut-what-the-reader-doesnt-need).

Cut catalogs the open screen already shows, such as model definitions, options, and providers. A reference the screen does not show, such as every recorded field or response header, stays in a `<Details>` block. Cut toggles, button names, and steps the reader can take on the open screen, such as turning a model off. Cut a prose list when a screenshot on the page already shows it. Cut a page or section that would only describe the open screen.

Keep a consequence, a decision, or a behavior the screen does not show. On a docs or integration page, keep the single opening `<Frame>` or `<Video>`. Further visuals fail this test when they show the same open screen.

Apply this test to prose, examples, callouts, tables, and new pages.

Flag a versioned model name, or a list of today's providers, in an intro, heading, or step-by-step guide, unless the page is about that model or provider. Prefer "your model" or "a connection". Flag provider-specific setup that restates what the UI shows. A short provider note belongs at the bottom of the feature page. A longer one belongs in a linked FAQ.

### Already written

Search the existing docs before you treat an addition as new. Fail a second procedure, a second reference list, or an explanation longer than a sentence, including a second copy on the same page, when that page does not own the fact. Leave one sentence and a link to the owning page.

A get-started tab keeps the minimal configuration and the command that confirms it works, even when another page owns the full procedure. A tab that only links to that page still fails [Get started pages](AGENTS.md#get-started-pages).

A snippet that is the same block on many pages, such as `components-mdx/env-python.mdx`, stays as that shared component. Leave it in place. When it is still pasted on each page, the fix is to move it into `components-mdx`.

Keep a sentence or a short table that points at the owning page. Overview, Concepts, and Get started pages may do this. Keep a sentence that names the fact while doing a different job and does not explain it again. Keep the full version on the page that owns the fact. When an edited page has copied it, that copy becomes the sentence and the link.

### Place

The addition has to match the page type and the section on that page. Read the goal of that type before you decide it belongs there. The hierarchy is [Overview](AGENTS.md#overview-pages), [Get started](AGENTS.md#get-started-pages), [Concepts](AGENTS.md#concepts-pages), [Features](AGENTS.md#feature-pages), [Integrations](AGENTS.md#integration-pages), then [Troubleshooting and FAQ](AGENTS.md#troubleshooting-pages). [API reference](AGENTS.md#api-reference-pages) sits outside that sidebar order. The default path comes before optional, advanced, or edge-case settings. Flag a page that leads with those settings, for example a custom endpoint or extra headers ahead of managing models or choosing a model ID.

Match that hierarchy. An area that has drifted is not the template. Flag a missing Getting started section on an Overview page, a missing "Not seeing what you expected?" section on a Get started page, or troubleshooting kept on a feature, get-started, or self-hosting page. Troubleshooting belongs in `content/faq/all/`, one file per problem, tagged for `<FaqPreview>`.

A new feature, or a page that makes the reader get through a second job before reaching the job of that page, is a reason to restructure. Name one of these homes, in order. Do not paste the text there.

1. Delete it, when the open screen or an existing page already covers it.
2. A section of the current page.
3. A collapsible `<Details>` block on that page, for a long reference.
4. A new file in `content/faq/all/`, for one problem or question.
5. A new file in `content/guides/`, for a worked workflow that is not the product reference.
6. An existing docs page that already owns that job.
7. A new docs page, only in a sidebar slot the area already has.

Where a new page lives is its folder and its position in `meta.json`. A new sidebar entry is allowed only when that new page is allowed. Do not add a sidebar group. Leave `lib/nav-links` unchanged unless this is a new product area.

## Checks that always run

Run these on every review, including when gate 1 fails. They are not comments on wording, headings, callouts, or structure.

- Flag leftover TODOs, placeholder link targets, and links to preview deployments.
- When embedding videos from YouTube, make sure to embed from `https://www.youtube-nocookie.com` instead of `https://www.youtube.com` to avoid cookies and tracking. Always add `rel=0` to the embed URL so related videos are limited to the same channel.
- When a PR adds or edits a changelog entry in `content/changelog/`, flag it if the intro is not immediately followed by 2-3 concrete example use cases, or if a UI change has no screenshot or `.mp4` video that readers see on the page. Frontmatter `ogImage` / `ogVideo` counts only when `showOgInHeader` is not `false`; if that flag is `false`, the visual must be in the body. A one-sentence changelog that only restates the title and links to docs is incomplete. Flag the changelog even when the rest of the PR (docs, code samples) is complete. Do not invent screenshots or other visuals to fill the gap; flag the missing visual so a maintainer can add it.
- For every edited page or route, check `md-override/` for a corresponding Markdown source. When one exists, verify the rendered page and override remain synchronized; a top-of-file comment is helpful but not required for this rule to apply.
- When linking to a Langfuse app page from docs, use `https://cloud.langfuse.com/project/~/[path]`. The `~` sentinel redirects to the reader's last-used project and region automatically.
- External `/users` adopters-table references must include a Wayback `[Archive](...)` link. Request a Save Page Now snapshot when none exists; do not omit the archive.
- Flag any middle dot (U+00B7) used as a separator, including in UI strings and code.
- When deep-linking to a section via a link that uses the `#` anchor, make sure the anchor is explicitly defined in the source page via `[#anchor]` at the end of the header line, e.g. `## Get Started [#get-started]`.
- We never use `.gif` files, only `.mp4` files uploaded to `static.langfuse.com/docs-videos` to optimize for size and performance.

## Gate 2: How it is written

Run this gate only after gate 1 is clean. Do not repeat the necessity test or the checks that always run. Check form against [Where content belongs](AGENTS.md#where-content-belongs), [Get started pages](AGENTS.md#get-started-pages), [Wording and structure](AGENTS.md#wording-and-structure), [Formatting](AGENTS.md#formatting), and [Changelog entries](AGENTS.md#changelog-entries), and check the following:

- Edited text is grammatically correct (American English).
- Edited text has consistent punctuation.
- Code blocks in core documentation include all imports to be self-contained (does not apply to notebooks/cookbooks).
- Read the page as a first-time reader. Flag references the reader can't resolve, headings the section doesn't deliver on, lists without context, and obvious newcomer questions the page leaves open, such as where the product runs or who sets it up.
- On get-started pages, check that a reader can reach a working setup using only that page, and using only the tab they selected.
- A product area's Troubleshooting and FAQ page should contain only the pieces below. This applies to every page of this kind, including ones added later. Flag a new or edited page that adds any other section or body content. It does not apply to a feature page that ends with a short FAQ, or to a troubleshooting page whose job is inline answers.
  - An optional short intro paragraph, and only when it adds something the components below do not. Do not add the repeated "try Ask AI / open a GitHub issue / contact support" paragraph.
  - `<FaqPreview tags={[...]} />` from `components/faq/FaqPreview.tsx`: the list of links to that area's FAQ articles. Keep this component. Do not replace it with a hand-written link list or inline Q&A.
  - `<GhDiscussionsPreview labels={[...]} />` from `components/gh-discussions/GhDiscussionsPreview.tsx`: the GitHub Discussions component already on these pages. Keep this component. Do not replace it with a prose link to GitHub Issues.
- In documentation tables, every column must add enough value on its own. Prefer fewer columns: merge or remove any column that does not help the reader, and flag tables that would stay clear with fewer columns, unless the column keeps the table consistent with similar tables on the same page.
- Put failure modes, scope limits, and similar caveats in a `<Callout>` so they stand out. Flag new or edited docs that bury these in body copy.
- Flag examples that hard-code a regional Cloud or gateway URL without in-snippet comments that name EU and list the other region URLs. A sentence after the snippet that only names the region and links to another page is not enough. Copy the comment shape from `components-mdx/env-python.mdx` or, for gateway hosts, from [Send your first request](/docs/gateway/get-started/first-request).
- Every documentation page should include a screenshot or screen recording of the feature near the beginning of the page, after the intro. Use a `<Frame>` screenshot or a `<Video>`. Flag new or edited docs pages that have no opening visual.
- Flag diagrams that rely on horizontal scroll-to-explore instead of fitting the page, shrinking as needed, or switching to a mobile layout.
- Use one H1 per markdown file, with subsections in order (`##`, `###`, etc.). Do not skip heading levels.
