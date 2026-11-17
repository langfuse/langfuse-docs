# Review guidelines

- read the surrounding docs, the product, and the screenshots before you judge a change
- Run gate 1 first. One failure stops comments on wording. Say what to remove or which home it belongs in.
- Run gate 2 only after gate 1 is clean.
- [General checks](#checks-that-always-run) still run when gate 1 fails.

## Gate 1: Necessity and place

- Applies to `content/docs/`, `content/integrations/`, `content/guides/`, and `content/faq/`.
- A `content/changelog/` entry is an announcement, including when the docs already explain the feature. Judge it with [Changelog entries](AGENTS.md#changelog-entries) and the checks that always run.

### Necessity

- Keep a fact only when a reader with that screen open still could not know it. Don't list options, providers, etc. just for the sake of having them in the docs. less is more.
- Also cut every category in [Cut what the reader doesn't need](AGENTS.md#cut-what-the-reader-doesnt-need)
- Flag provider-specific setup that restates the UI. In most cases these can be cut entirely. If not, add it as a short note at the bottom of the feature page of as a separate guide/FAQ that the feature page can link to at the bottom of the page.

### Duplication

- Search the existing docs before you treat an addition as new.
- Fail a duplicate procedure/reference list/explanation. These should be replaced by a short description linking to the page owning that item instead.
- A snippet that is the same block on many pages, should be a shared component, such as `components-mdx/env-python.mdx`.

### Place

- Read [Overview](AGENTS.md#overview-pages), [Get started](AGENTS.md#get-started-pages), [Concepts](AGENTS.md#concepts-pages), [Features](AGENTS.md#feature-pages), [Integrations](AGENTS.md#integration-pages), [Troubleshooting and FAQ](AGENTS.md#troubleshooting-pages). [API reference](AGENTS.md#api-reference-pages) and judge whether the placement of changes is correct against these specs.
- The page order is always according to how many users need something: default path -> advanced options -> or edge-cases -> troubleshooting
- Troubleshooting belongs either in `content/faq/all/`, one file per problem, tagged for `<FaqPreview>`, or if it's very short, it can also live at the bottom of a feature page.
- A new feature, or a page that makes the reader finish a second job before the job of that page, is a reason to restructure.
- Be very conservative with adding things to the sidebar. Only give a new addition a prominent sidebar location if it's strictly necessary. This is almost never the case. Always opt for adding something as a FAQ/troubleshooting, integration, or product feature page (under a Features folder) first. Also consider whether it really needs to be a new, separate page, or if a short addition to an existing page is enough.

## Gate 2: How it is written

- Check wording and formatting against these sections of [AGENTS.md](AGENTS.md): [Get started pages](AGENTS.md#get-started-pages), [Wording and structure](AGENTS.md#wording-and-structure), [Formatting](AGENTS.md#formatting), and [Changelog entries](AGENTS.md#changelog-entries).
- Edited text is grammatically correct (American English) and has consistent punctuation.
- Code blocks in core documentation include all imports. Notebooks and cookbooks are exempt.
- Read the page as a first-time reader. Flag a reference the reader can't resolve, a list without context, or a newcomer question left open, such as where the product runs or who sets it up.
- In a documentation table, every column has to add enough value on its own. A column may stay to match a similar table on the same page. Cut or merge anything that doesn't really add value. Often you can just cut columns.
- Put failure modes, scope limits, and similar caveats in a `<Callout>`. Also really think about whether these are actually necessary or already obvious for the user
- A hard-coded regional Cloud or gateway URL names EU and lists the other region URLs in comments inside the snippet. A sentence after the snippet is not enough. Copy the comment shape from `components-mdx/env-python.mdx` or, for gateway hosts, from [Send your first request](/docs/gateway/get-started/first-request).
- A documentation page includes a `<Frame>` or `<Video>` near the beginning, after the intro.
- Never use horizontal scroll for a diagram. A diagram should always fit the page. Scale it until text becomes hard to read. Then switch to a stacked mobile layout.
- Use one H1 per markdown file, with subsections in order (`##`, `###`). Do not skip heading levels.

## General checks [#checks-that-always-run]

- Flag leftover TODOs, placeholder link targets, and links to preview deployments.
- When embedding videos from YouTube, embed from `https://www.youtube-nocookie.com` and add `rel=0`.
- For every edited page or route, check `md-override/` for a matching Markdown source and keep it in sync with the page.
- App links from docs use `https://cloud.langfuse.com/project/~/[path]`. The `~` sentinel redirects to the reader's last-used project and region.
- External `/users` adopters-table references include a Wayback `[Archive](...)` link. Request a snapshot when none exists.
- Flag a middle dot (U+00B7) used as a separator, including in UI strings and code.
- A `#` link needs `[#anchor]` at the end of the target heading, for example `## Get Started [#get-started]`.
- Use `.mp4` files on `static.langfuse.com/docs-videos`. Do not use `.gif` files.
