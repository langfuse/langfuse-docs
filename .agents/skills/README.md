# Shared Skills

Shared repo skills for any coding agent working in `langfuse-docs`.

For the shared agent config and generated shim model, start with
[`../README.md`](../README.md).

Claude discovers these shared skills through symlinks under `.claude/skills/`.
Those discovery links are created and verified by `pnpm run agents:sync` and
`pnpm run agents:check`.

## Available Skills

### add-yourself-to-team-langfuse

Use for:
- adding a new team member to the public Langfuse team pages
- updating `data/authors.json`
- updating `components-mdx/team-members.mdx`
- updating `content/marketing/press.mdx`

Open:
[`add-yourself-to-team-langfuse/SKILL.md`](add-yourself-to-team-langfuse/SKILL.md)
