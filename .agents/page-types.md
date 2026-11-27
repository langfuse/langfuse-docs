# Page type structure and content

## Overview page structure + content [#overview-pages]

1. A short intro on the problem the feature area solves and the value it adds (the "why")
2. a visual + any link to a demo if relevant
3. Getting Started section that links to typical things users to first to get started with this product area

Leave anything that doesn't help the reader see that value, such as request formats, credentials, limitations, availability, pricing, and lists of next steps, to deeper pages. Every thing on this page really needs to earn its place.

## Concepts page structure + content [#concepts-pages]

1. Sections explaining the main components, at a high level, and how they work together
2. Sections on any processes that may not be obvious to the user but are instrumental to understand how to use the feature

Give each major concept a diagram or a table, and answer the questions a newcomer would ask to understand how the feature works at a high level, conceptually. Keep the page conceptual: for configuration, options, and other details, link to the feature page that covers them instead of explaining them here. Leave out implementation details that don't change what the reader does.

## Get started pages [#get-started-pages]

- Open with one sentence on what the reader will accomplish, a link to the Concepts page, and, when admins and users have separate guides, a link to the other guide.
- Put the steps under a `## Setup steps` heading inside `<Steps>`. Each step is one task; fold small actions, such as exporting the key the reader just created, into the step that produces the value.
- Don't add a "Before you begin" or prerequisites section. Put each requirement (role, plan, deployment type, prior setup) in the step where the reader would hit it, as an info callout at the end of that step. Caveats that apply to the whole procedure go above `<Steps>`.
- When setup differs per tool, client, or language, give each its own tab with everything needed to finish there: an italic requirements line such as `_**Requires** <tool> <version> or later and <prerequisite>._`, the minimal configuration, a command that confirms it works, and a card that links to the full guide. A tab that only links to another page is not enough. Also use tabs for alternative ways to do one step, such as the Langfuse UI and the API.
- A reader can finish setup from that page, and from the tab they selected.
- End with a "Not seeing what you expected?" section that uses `<FaqPreview>` with the area's get-started tag and, if there is an obvious next guide, a "Next steps" list with just that link.

## Feature pages [#feature-pages]

1. one or two sentences on what the feature does, who can use it, and where to find it in the UI
2. a screenshot or screen recording of the feature in a `<Frame>` or `<Video>`
3. how to set up/get started with the feature, preceded by anything readers need to decide whether to use this or another adjacent langfuse feature (optional)
4. any other sections that are important enough are below this. These sections are ordered in terms of how often users need it. If all users need something, it should be higher up, edge cases and advanced features (only a small subgroup needs this) are lower
5. Troubleshooting and FAQ are always at the bottom. When adding a section, always consider if it's important enough to have it featured on the main docs page, or if it could be linked in a troubleshooting/faq page

Put long reference lists, such as every recorded field or response header, in a `<Details>` block whose `<Summary>` names the content. Put optional deep-dive topics in a closing `## FAQ` section that wraps question-titled `<Details>` blocks in `<FaqDetails>`.

## Troubleshooting/FAQ pages [#troubleshooting-pages]

These pages can have many formats to answer the question. They do follow best practices of docs pages, and often link to other docs pages.

A product area's Troubleshooting and FAQ page contains only an optional short intro, `<FaqPreview tags={[...]} />`, and `<GhDiscussionsPreview labels={[...]} />`. Keep those components. Do not add the "try Ask AI / open a GitHub issue / contact support" paragraph. This does not apply to a feature page that ends with a short FAQ, or to a troubleshooting page whose job is inline answers.

## Integrations pages [#integration-pages]

1. a short intro on what the other tool is and how it can be used with Langfuse
2. "what is X" and "what is Langfuse" paragraphs, reusing the existing component for this
3. a callout to sign up for langfuse, using the existing component for this
4. steps to integrate, using the steps component. If there are multiple wayst to integrate and they are completely different (completely different steps, or different goals/use cases), add a short section "Integration options" before the different integration sections, then have one section per integration option. If there are multiple ways to integrate and they are only partly different, combine them into the same steps component, and use a tabs component in the steps where they differ.
5. troubleshooting/faq/related resources/next steps sections

When the tool already has an integration page for another Langfuse product area, extend that page; one longer page is often the better choice. Add a sibling page only when the two product areas are very different, such as AI Gateway and Prompt Management. For example, `claude-code-gateway.mdx` (AI Gateway) sits next to `claude-code.mdx` (Observability).

## Changelog entries [#changelog-entries]

- Title: describe what the user can now do, not an abstract concept. "Filter Observations by Tool Calls" > "Simplify for Scale". Never use the "Feature Name: Rephrasing of Feature Name" format (e.g., "Code-Based Evaluators: Deterministic Evaluation Without LLM Calls"). Keep titles short and punchy — e.g., "Code as a Judge" or "Code-Based Evaluators".
- Lead with what's now possible, not what was missing before. Frame positively — don't highlight past limitations of Langfuse. Weave the value naturally into the intro, not in a "Why This Matters" section buried later.
- A changelog entry can be updated to record that something was retired. Do not copy that history onto a docs or integration page unless readers of that page would otherwise follow a dead path.
- For new features, follow the intro immediately with 2-3 concrete use cases, not in a separate section. For additions to existing features, such as a new provider or endpoint, use cases are optional. A one-sentence entry that restates the title and links to docs is incomplete.
- Keep it concise — every sentence should add new information. Don't repeat what was already said.
- Do not reproduce durable conceptual breakdowns, schema inventories, or general how-it-works explanations. Link to evergreen docs instead.
- Use visuals (screenshots, `.mp4` videos) for UI changes, interleaved with text. Flag UI-change entries that have no screenshot or video. Frontmatter `ogImage` or `ogVideo` counts only when `showOgInHeader` is not `false`. When that flag is `false`, the visual has to be in the body. Do not invent a visual.
- Be specific — name actual filters, metrics, commands. Avoid vague adjectives.
- Tone: helpful and conversational, not marketing copy. No filler headings like "Why This Matters", or "Key Benefits."
