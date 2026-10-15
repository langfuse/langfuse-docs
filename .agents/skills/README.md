# Shared Skills

Shared repo skills for any coding agent working in `langfuse-docs`.

For the shared agent config and generated shim model, start with
[`../README.md`](../README.md).

Claude and Cursor discover these shared skills through projected paths under
`.claude/skills/` and `.cursor/skills/`. Those discovery links are created and
verified by `pnpm run agents:sync` and `pnpm run agents:check`.

## Available Skills

### add-customer-to-user-list

Use for:

- adding or updating a company in the `/users` adopters table
- choosing the Reference cell: user story, external link, or `Langfuse Customer`
- summarizing a use case from a user story or a public source link
- requesting a Wayback Machine snapshot when an external reference has no archive yet

Open:
[`add-customer-to-user-list/SKILL.md`](add-customer-to-user-list/SKILL.md)

### add-yourself-to-team-langfuse

Use for:

- adding a new team member to the public Langfuse team pages
- updating `data/authors.json`
- updating `components-mdx/team-members.mdx`
- updating `content/marketing/press.mdx`

Open:
[`add-yourself-to-team-langfuse/SKILL.md`](add-yourself-to-team-langfuse/SKILL.md)

### customer-story-setup

Use for:

- converting draft customer-story Markdown into website MDX
- wiring `content/customers/<slug>.mdx`, `content/customers/meta.json`, and
  `data/authors.json`
- collecting customer-story logos, screenshots, and other required assets

Open:
[`customer-story-setup/SKILL.md`](customer-story-setup/SKILL.md)

### integration-docs

Use for:

- writing or reviewing the langfuse.com page for a coding agent or IDE
  (`content/integrations/developer-tools/*.mdx`)
- the traced-surface list, supported-version matrix, troubleshooting rows, or
  privacy disclosure on one of those pages
- reconciling such a page with the plugin repo's own `README.md`

These pages are hand-authored and outside the notebook pipeline. For a
model-provider, framework or gateway page use `langfuse-integration-page`.
Named to match the `integration-*` skills in `langfuse/langfuse`.

Open:
[`integration-docs/SKILL.md`](integration-docs/SKILL.md)
