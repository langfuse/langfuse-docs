# Review guidelines

Writing rules these checks use: [AGENTS.md](AGENTS.md).

- Review added and changed content. Read the surrounding docs, the product, and the screenshots before you judge an addition.
- Run gate 1 first. One failure stops comments on wording, headings, callouts, and structure. Say what to remove or which home it belongs in. Do not rewrite a cut, and do not paste it into the destination.
- [Checks that always run](#checks-that-always-run) still run when gate 1 fails.
- Judge the change against the existing docs. Flag existing text when the change makes it a duplicate, something the open screen shows, or a job the page no longer has. Name the passage and why. Leave every other existing sentence alone. Pages the diff does not edit are context only.

## Gate 1: Necessity and place

- Applies to `content/docs/`, `content/integrations/`, `content/guides/`, and `content/faq/`.
- A `content/changelog/` entry is an announcement, including when the docs already explain the feature. Judge it with [Changelog entries](AGENTS.md#changelog-entries) and the checks that always run.

### Necessity

Apply this test to prose, examples, callouts, tables, and new pages.

- Keep a fact only when a reader with that screen open still could not know it.
- Also cut every category in [Cut what the reader doesn't need](AGENTS.md#cut-what-the-reader-doesnt-need).
- Cut catalogs the open screen already shows, such as model definitions, options, and providers.
- A reference the screen does not show, such as recorded fields or response headers, stays in a `<Details>` block.
- Cut toggles, button names, and on-screen steps, such as turning a model off.
- Cut a prose list when a screenshot on the page already shows it.
- Flag a versioned model name, or a list of today's providers, in an intro, heading, or step-by-step guide, unless the page is about that model or provider. Prefer "your model" or "a connection".
- Flag provider-specific setup that restates the UI. A short note belongs at the bottom of the feature page. A longer one belongs in a linked FAQ.

### Already written

- Search the existing docs before you treat an addition as new.
- Fail a second procedure, a second reference list, or an explanation longer than a sentence, including a second copy on the same page, when that page does not own the fact. Leave one sentence and a link to the owning page.
- A get-started tab keeps the minimal configuration and the command that confirms it works, even when another page owns the full procedure. A tab that only links still fails [Get started pages](AGENTS.md#get-started-pages).
- A snippet that is the same block on many pages, such as `components-mdx/env-python.mdx`, stays as that shared component. When it is still pasted on each page, move it into `components-mdx`.
- Keep a sentence or a short table that points at the owning page. Overview, Concepts, and Get started pages may do this.
- Keep a sentence that names the fact while doing a different job. Keep the full version on the page that owns the fact.
- When an edited page has copied a fact, that copy becomes the sentence and the link.

### Place

- Match the page type and the section on that page. Read the goal of that type first: [Overview](AGENTS.md#overview-pages), [Get started](AGENTS.md#get-started-pages), [Concepts](AGENTS.md#concepts-pages), [Features](AGENTS.md#feature-pages), [Integrations](AGENTS.md#integration-pages), [Troubleshooting and FAQ](AGENTS.md#troubleshooting-pages). [API reference](AGENTS.md#api-reference-pages) sits outside that sidebar order.
- The default path comes before optional, advanced, or edge-case settings. Flag a page that leads with those, for example a custom endpoint ahead of managing models.
- An area that has drifted is not the template.
- Flag a missing Getting started section on an Overview page, a missing "Not seeing what you expected?" section on a Get started page, or troubleshooting kept on a feature, get-started, or self-hosting page.
- Troubleshooting belongs in `content/faq/all/`, one file per problem, tagged for `<FaqPreview>`.
- A new feature, or a page that makes the reader finish a second job before the job of that page, is a reason to restructure. Name one of these homes, in order. Do not paste the text there.

1. Delete it, when the open screen or an existing page already covers it.
2. A section of the current page.
3. A `<Details>` block on that page, for a long reference.
4. A new file in `content/faq/all/`, for one problem or question.
5. A new file in `content/guides/`, for a worked workflow that is not the product reference.
6. An existing docs page that already owns that job.
7. A new docs page, only in a sidebar slot the area already has.

- Where a new page lives is its folder and its position in `meta.json`. A new sidebar entry is allowed only when that new page is allowed. Do not add a sidebar group. Leave `lib/nav-links` unchanged unless this is a new product area.

## Checks that always run [#checks-that-always-run]

- Run these on every review, including when gate 1 fails.
- Flag leftover TODOs, placeholder link targets, and links to preview deployments.
- When embedding videos from YouTube, embed from `https://www.youtube-nocookie.com` and add `rel=0`.
- A changelog entry follows the intro with 2-3 use cases. A UI change has a screenshot or `.mp4` in the body when `showOgInHeader` is `false`. A one-sentence entry that restates the title and links to docs is incomplete. Do not invent a visual.
- For every edited page or route, check `md-override/` for a matching Markdown source and keep it in sync with the page.
- App links from docs use `https://cloud.langfuse.com/project/~/[path]`. The `~` sentinel redirects to the reader's last-used project and region.
- External `/users` adopters-table references include a Wayback `[Archive](...)` link. Request a snapshot when none exists.
- Flag a middle dot (U+00B7) used as a separator, including in UI strings and code.
- A `#` link needs `[#anchor]` at the end of the target heading, for example `## Get Started [#get-started]`.
- Use `.mp4` files on `static.langfuse.com/docs-videos`. Do not use `.gif` files.

## Gate 2: How it is written

- Run this gate only after gate 1 is clean. Do not repeat gate 1 or the checks that always run.
- Check form against [Where content belongs](AGENTS.md#where-content-belongs), [Get started pages](AGENTS.md#get-started-pages), [Wording and structure](AGENTS.md#wording-and-structure), [Formatting](AGENTS.md#formatting), and [Changelog entries](AGENTS.md#changelog-entries).
- Edited text is grammatically correct (American English) and has consistent punctuation.
- Code blocks in core documentation include all imports. Notebooks and cookbooks are exempt.
- Read the page as a first-time reader. Flag a reference the reader can't resolve, a heading the section doesn't deliver, a list without context, or a newcomer question left open, such as where the product runs or who sets it up.
- On a get-started page, a reader can finish setup from that page, and from the tab they selected.
- A product area's Troubleshooting and FAQ page contains only an optional short intro, `<FaqPreview tags={[...]} />`, and `<GhDiscussionsPreview labels={[...]} />`. Keep those components. Do not add the "try Ask AI / open a GitHub issue / contact support" paragraph. This does not apply to a feature page that ends with a short FAQ, or to a troubleshooting page whose job is inline answers.
- In a documentation table, every column has to add enough value on its own. A column may stay to match a similar table on the same page.
- Put failure modes, scope limits, and similar caveats in a `<Callout>`.
- A hard-coded regional Cloud or gateway URL names EU and lists the other region URLs in comments inside the snippet. A sentence after the snippet is not enough. Copy the comment shape from `components-mdx/env-python.mdx` or, for gateway hosts, from [Send your first request](/docs/gateway/get-started/first-request).
- A documentation page includes a `<Frame>` or `<Video>` near the beginning, after the intro.
- A diagram fits the page. Scale it, or switch to a stacked mobile layout. Do not use horizontal scroll.
- Use one H1 per markdown file, with subsections in order (`##`, `###`). Do not skip heading levels.
