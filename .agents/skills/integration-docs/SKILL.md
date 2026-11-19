---
name: integration-docs
description: |
  The langfuse.com docs page for a coding-agent integration that Langfuse
  builds and maintains — the hand-authored
  `content/integrations/developer-tools/*.mdx` pages for the Claude Code, Codex,
  OpenCode and pi plugins — and keeping each page consistent with its plugin
  repo's README. Use when creating or maintaining one of those pages: its
  frontmatter, the traced-surface list, the install, credentials and
  verification steps, the supported-version matrix, troubleshooting, or the
  privacy disclosure; and when a page and its plugin README disagree. Not for a
  community-maintained or natively-instrumented integration, and not for a
  model-provider, framework or gateway page generated from
  `cookbook/integration_*.ipynb` — that is langfuse-integration-page.
---

# Integration Docs

The docs page for a coding-agent integration that **Langfuse builds and
maintains**. One consistent way to set such a page up and keep it current.

## Read the existing pages first

Each maintained integration is a plugin released from its own repo in the
`langfuse` GitHub org — the `*-observability-plugin` repos — with a
hand-authored page at `content/integrations/developer-tools/<slug>.mdx`.

**Those pages are the reference for structure and content, and they are more
current than this skill.** Open two or three before writing, and prefer what
they do now over what any rule here says. The skeleton and the rules below
record why they look the way they do; they do not replace reading them.

List the group and see which are maintained plugins:

```bash
ls content/integrations/developer-tools/
grep -l "langfuse/.*-observability-plugin" content/integrations/developer-tools/*.mdx
```

These pages are hand-authored and **not** part of the `cookbook/_routes.json`
notebook pipeline that
[`langfuse-integration-page`](../langfuse-integration-page/SKILL.md) drives —
that skill's categories (`model-providers`, `frameworks`, `gateways`, `other`)
and patterns (`openinference`, `openai-drop-in`, `framework-native`,
`otel-direct`) cannot express this group. Use it only for repo-wide docs
mechanics: prettier, the H1 check, link checks.

## Check who owns the code first

The same directory holds pages for integrations Langfuse does **not** release,
and this standard does not apply to them. Before using it, confirm the page
documents a plugin released from a `langfuse` repo — the grep above is enough.

Three kinds sit alongside, and none should be described as maintained by
Langfuse:

- **A community plugin.** The page should render the upstream README live with
  `<GitHubReadme url="..." />` rather than duplicate it, so it cannot drift.
  That is the correct pattern for code we do not own — do not "fix" such a page
  into a copy.
- **A natively instrumented host.** No Langfuse code exists; the host emits
  `gen_ai.*` semconv spans and the page configures an OTLP exporter plus the
  `x-langfuse-ingestion-version` header.
- **Example code to clone.** Langfuse-owned but shipped from an examples repo
  rather than released and versioned. Bring such an integration into scope by
  releasing it as a plugin, not by applying this standard to the page.

## The page installs a released plugin

That is the only shape this skill produces. The page covers install,
credentials and verification; **the plugin repo is the source of truth for
behaviour**, and the page links to it rather than restating it.

The defect to check for, and never add: a page that pastes the integration's
implementation into fenced code blocks instead of installing the released
plugin. At the time of writing the Claude Code page does this with an entire
Python hook, running past a thousand lines, even though its plugin installs
with one `marketplace add` — while the Codex and OpenCode pages install theirs
correctly. That ships unversioned, untested code through a docs page and drifts
from what the plugin actually does. Rewriting the page to install the plugin is
the fix.

## The page skeleton

Four sibling pages already follow this exactly. It is not written down anywhere
else — `.agents/AGENTS.md` covers prettier, the H1 check and link checks only.

```text
frontmatter: title "Trace <Host> with Langfuse" / sidebarTitle / logo /
             logoAppearance? / description / category: Integrations
# <Host> tracing with Langfuse
## What can this integration trace?
## How it works
## Quick start
### Set up Langfuse
### Install / enable the plugin            [#enable-the-plugin] where linked
### Add your Langfuse credentials          [#set-credentials]
### <verify step>                          see below
### View traces in Langfuse
## Environment variables
## Enable and disable tracing              where the integration has a switch
## Troubleshooting
### No traces appearing in Langfuse
### Authentication errors
### Data privacy
## Resources
```

The verify step's heading varies by host and that is fine — `Restart Codex and
verify tracing`, `Use OpenCode`, `Run your first trace`. Name it after what the
reader actually does.

Two placements worth copying rather than guessing: `Data privacy` is a
subsection of `Troubleshooting`, not a top-level section, and `Resources` closes
the page. Both are current in `codex.mdx` and `opencode.mdx`.

Start from [`assets/docs-page-template.mdx`](assets/docs-page-template.mdx).

- Keep the `[#set-credentials]` anchor — sibling pages deep-link to it.
- Use sentence case in headings. `claude-code.mdx` and `kiro.mdx` use Title Case
  and are the outliers.
- Title convention is "Trace <Host> with Langfuse", sidebar title the short host
  name.

## Sections whose absence became a support ticket

Evidence is the plugin repos' own issue trackers.

- **Supported versions.** State both the host range and the Langfuse SDK range.
  Codex CLI 0.147.0 moved the user prompt and OpenCode v2 landed, each producing
  issues a support table would have pre-empted.
- **What this does not trace.** An undisclosed gap becomes a bug report — images
  were silently absent from Claude Code traces until someone asked.
- **Data and privacy.** Missing from the plugin READMEs when surveyed. State which data
  classes are sent, which flags control each, the defaults, what is redacted,
  and where it goes.
- **Enable and disable tracing.** Users asked for an off switch.
- **Troubleshooting.** Key every entry on the literal string the reader sees —
  a log line, CLI message or status line — not on the internal cause. At minimum
  cover no traces appearing and authentication errors, and give a row to each
  failure class that produces **zero traces behind a success-looking log**:
  a private CA with `CERTIFICATE_VERIFY_FAILED`, a SOCKS proxy with a missing
  `socksio` import, a region mismatch, and keys for the wrong project. Each of
  those was reported by a user whose hook had logged success.
- **A verification a reader can run.** Close the quick start with the exact host
  output line that means the integration ran, and one bounded, copy-pasteable
  read command that proves traces landed — Observations API v2 with a bounded
  time window and an explicit trace id. Keep that command identical across the
  pages. Note that past-dated traces can be stored yet invisible to list and
  filter reads beyond roughly 30 days, while `GET /api/public/traces/<id>`
  still returns them.

## Keep the page and the plugin README in step

The plugin repo's `README.md` lives in the plugin repo, not here, but the two
must agree. The "what can this integration trace?" list is a promise: if the
plugin does not emit it, it belongs in neither.

[`assets/README-template.md`](assets/README-template.md) is the skeleton the
READMEs should follow, so you can check a page against it.

For what a plugin actually emits, and whether a claim on the page is true, the
monorepo `langfuse/langfuse` carries `integration-trace-model` under
`.agents/skills/`; its host registry lists each host's end-of-run signal,
transcript layout and known contract drift.

## Output format

Pages are MDX. Before finishing, check valid Markdown: a space after every list
marker, closed links and parentheses, no dangling backticks or half-open fenced
blocks. Run the repo's prettier `format` job — `.agents/AGENTS.md` warns it is
the check that most often fails.
