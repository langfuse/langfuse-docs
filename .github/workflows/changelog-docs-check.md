---
name: Changelog docs check
description: "Daily cross-repo check for user-facing changes in langfuse/langfuse that may need changelog or docs coverage in langfuse/langfuse-docs"
on:
  schedule:
    - cron: "0 7 * * *"
  workflow_dispatch:
engine: claude
permissions:
  contents: read
  issues: read
  pull-requests: read
imports:
  - shared/slack-dm-notify.md
tools:
  github:
    github-token: ${{ secrets.CROSS_REPO_PAT }}
    toolsets: [repos, issues, pull_requests, search]
    min-integrity: approved
    allowed-repos:
      - langfuse/langfuse
      - langfuse/langfuse-docs
safe-outputs:
  report-failure-as-issue: false
timeout-minutes: 45
---

# Changelog docs check

You are reviewing whether recent user-facing product changes in `langfuse/langfuse` have matching changelog or documentation coverage in `langfuse/langfuse-docs`.

## Repositories

- Product repo: `langfuse/langfuse`
- Docs repo: `langfuse/langfuse-docs`
- Current workflow repository: `langfuse/langfuse-docs`

## Guardrails

- Use `tools.github` as the primary source of truth for both repositories.
- Keep this workflow read-only. Do not open issues, edit files, or create pull requests.
- Only use the `slack-dm-notify` safe-output job after your analysis is complete.
- Send exactly one Slack DM per run.
- Prefer a short, high-signal report over exhaustive coverage.
- Ignore internal-only changes, refactors, CI changes, test-only changes, and version bumps that do not create real documentation work.

## What counts as a candidate

A change is worth flagging when it is both:

1. User-facing or operator-facing in a meaningful way.
2. Not obviously covered already in `langfuse/langfuse-docs`.

Examples that usually qualify:

- New product capabilities
- New integrations or providers
- New configuration, API, or UI behavior users need to understand
- Breaking changes, migrations, or deprecations
- Feature launches that should probably appear in `content/changelog/`

Examples that usually do not qualify:

- Internal refactors
- Test-only changes
- CI or build changes
- Copy-only changes
- Routine dependency bumps
- Small bug fixes with no docs impact unless they unblock or change a documented workflow

## Review window

- For scheduled runs, start with the last 72 hours of activity in `langfuse/langfuse`.
- For manual runs, you may widen the window to the last 7 days if that gives a more useful first validation pass.
- If you widen the window, say so clearly in the Slack DM.

## How to review

### 1. Gather recent product changes

In `langfuse/langfuse`, inspect the most relevant recent sources of truth:

- Releases published in the review window
- Pull requests merged in the review window
- PR titles, descriptions, labels, changed files, and release notes when needed

Focus on the small set of changes that look most likely to require docs or changelog work.

### 2. Gather recent docs coverage

In `langfuse/langfuse-docs`, inspect:

- Recent files in `content/changelog/`
- Recent docs or guide updates that may already cover the same product changes
- PRs or commits in the same review window if needed to confirm coverage

### 3. Compare and decide

For each candidate product change, decide whether it is:

- Already covered
- Probably needs a changelog post
- Probably needs a docs update
- Probably needs both

Deduplicate closely related PRs into a single recommendation when they represent one feature or release theme.

## Slack DM output

Always send exactly one DM with the `slack-dm-notify` tool.

If there are no clear gaps, send a concise "no action needed" update.

If follow-up is needed, include:

- A one-line overall verdict
- A short list of the highest-signal missing or partial coverage items
- For each item:
  - What changed
  - Why it likely needs docs and/or changelog coverage
  - The best evidence you found (release, PR, or file links)
  - The most likely docs surface to update in `langfuse/langfuse-docs`

## Slack DM format

Use this structure:

`Changelog/docs check - <YYYY-MM-DD UTC>`

`Window:` <time window reviewed>

`Verdict:` <no action needed | follow-up recommended | incomplete check>

If no action is needed:
`No obvious docs or changelog gaps found in the reviewed window.`

If follow-up is needed:
- `<short item title>` - <why it matters> - <evidence>
- `<short item title>` - <why it matters> - <evidence>

`Confidence:` <high | medium | low>

If the check is incomplete because you could not get enough data, say what was missing and why.
