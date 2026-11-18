# Review guidelines

- Always read the surrounding docs, the product, and the screenshots before you judge a change. Take a step back and think whether this is the most efficient, least invasive change possible given the importance of the feature for the user. More often than not, an extra sentence should actually be a rewrite of an existing sentence for example.
- Run gate 1 first. Say what to remove or which home it belongs in. Then run gate 2.

## Gate 1: Necessity and place

- Applies to `content/docs/`, `content/integrations/`, `content/guides/`, and `content/faq/`.
- A `content/changelog/` entry is an announcement, including when the docs already explain the feature. Judge it with [Changelog entries](page-types.md#changelog-entries), and with the workflow rules and CI checks in [AGENTS.md](AGENTS.md).
- `content/resources/engineering/` pages are marketing content and skip gate 1: they may repeat docs content and don't need a docs home. Flag only claims that contradict the docs, such as a stated default, limit, or permission the docs describe differently.

### Necessity

- Keep a fact only when a reader with that screen open still could not know it. Don't list options, providers, etc. just for the sake of having them in the docs. less is more.
- Also cut every category in [Cut what the reader doesn't need](AGENTS.md#cut-what-the-reader-doesnt-need)
- Flag guidance for one provider, tool, or setup variant that restates the UI. Most of it can be cut; the rest belongs at the bottom of the feature page or in a linked FAQ page.

### Duplication

- Search the existing docs before you treat an addition as new.
- Fail a duplicate procedure/reference list/explanation. These should be replaced by a short description linking to the page owning that item instead.
- A snippet that is the same block on many pages, should be a shared component, such as `components-mdx/env-python.mdx`.

### Place

- Read [Overview](page-types.md#overview-pages), [Get started](page-types.md#get-started-pages), [Concepts](page-types.md#concepts-pages), [Features](page-types.md#feature-pages), [Integrations](page-types.md#integration-pages), [Troubleshooting and FAQ](page-types.md#troubleshooting-pages), and [Changelog](page-types.md#changelog-entries). [API reference](AGENTS.md#api-reference-pages) and judge whether the placement of changes is correct against these specs.
- The page order is always according to how many users need something: default path -> advanced options -> or edge-cases -> troubleshooting
- Troubleshooting belongs either in `content/faq/all/`, one file per problem, tagged for `<FaqPreview>`, or if it's very short, it can also live at the bottom of a feature page.
- A new feature, or a page that makes the reader finish a second job before the job of that page, is a reason to restructure.
- Be very conservative with adding things to the sidebar. Only give a new addition a prominent sidebar location if it's strictly necessary. This is almost never the case. Always opt for adding something as a FAQ/troubleshooting, integration, or product feature page (under a Features folder) first. Also consider whether it really needs to be a new, separate page, or if a short addition to an existing page is enough.

## Gate 2: How it is written

- Check the change against the writing guidelines in [AGENTS.md](AGENTS.md) and the matching page type in [page-types.md](page-types.md).
- Also apply the workflow rules and CI checks in [AGENTS.md](AGENTS.md).
- Read the page as a first-time reader. Flag a reference the reader can't resolve, a list without context, or a newcomer question left open, such as where the product runs or who sets it up.
