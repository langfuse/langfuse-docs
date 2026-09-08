---
title: Track and optimize coding agent usage
description: Govern coding agent spend centrally. See cost by team and developer, trace every session, and improve token efficiency with Langfuse — via a gateway or agent hooks.
---

# Track and optimize coding agent usage

Coding agents make engineers faster, but they also make AI spend unpredictable. Govern it centrally. See spend by team and by developer. Trace sessions to improve token efficiency.

Engineering spend by task, last 30 days: Implementation $486, Code review $379, Planning $321, Bug fix $178, Documentation $104, Other $72. Total spend $1,540 · 4,812 sessions · 28% budget left.

[Start free](/cloud) · [Talk to sales](/talk-to-us) · [Gateway guide](/resources/engineering/llm-gateway) · [Tracing guide](/resources/engineering/coding-agent-tracing)

Pick the path that matches how your organization runs coding agents. Platform teams usually start with a **gateway**. Individual developers and team rollouts often start with **hooks**.

## Via gateways (for platform teams)

Route coding agent traffic through an LLM gateway so every model call is authenticated, budgeted, and traced in one place — without changing each developer's local setup.

### Allocate budgets centrally

Give teams and departments a spend envelope on the gateway, then see what actually landed in Langfuse. A developer cannot disable a gateway the way they can a local hook.

[What is an LLM gateway?](/resources/engineering/llm-gateway)

### See spend by department and use case

Trace every coding-agent LLM call into Langfuse. Build dashboards for cost per team, repository, model, and use case, then set alerts before a spike becomes a surprise.

[Cost tracking](/docs/observability/features/token-and-cost-tracking)

### Improve token efficiency with shared skills

Use traces to find repeated context, failed tool loops, and prompts that should become org- or team-wide skills. Roll those skills out once and measure whether token spend actually drops.

[Evaluating AI agent skills](/blog/2026-02-26-evaluate-ai-agent-skills)

**LLM gateways:** [LiteLLM](/integrations/gateways/litellm), [OpenRouter](/integrations/gateways/openrouter), [Langfuse Gateway (coming soon)](/docs/roadmap#langfuse-gateway)

## Via hooks

Trace the full execution of your preferred coding agent. Log tool calls, token spend, and skill usage to identify bottlenecks. Optimize your coding setup, test skills, and inspect agent context for maximum efficiency.

Hooks are per-machine and user-serviceable. Treat them as telemetry, not enforcement. If you need guaranteed capture or budgets, use a gateway.

### Trace the full coding-agent session

Log tool calls, retries, skill usage, and model turns — not only the bill. Reconstruct what the agent did so you can debug loops, bloated context, and skills that need a rewrite.

[Tracing coding agents](/resources/engineering/coding-agent-tracing)

### Attribute spend to developers and projects

Hook integrations attach a user identifier, so dashboards can break down cost per person or per repo. Find who is burning tokens and which workflows are worth optimizing.

[Cost tracking](/docs/observability/features/token-and-cost-tracking)

### Optimize skills, tools, and context

Compare sessions to find unused tools, repeated file reads, and prompts that should be shorter. Test skill changes and inspect agent context for maximum efficiency.

[Optimizing an AI skill](/blog/2026-03-24-optimizing-ai-skill-with-autoresearch)

**Coding agents:** [Claude Code](/integrations/developer-tools/claude-code), [Codex](/integrations/developer-tools/codex), [OpenCode](/integrations/developer-tools/opencode), [Cursor](/integrations/developer-tools/cursor), [GitHub Copilot](/integrations/developer-tools/github-copilot), [more coding agents](/integrations#developer-tools)

## Teams tracing developer AI usage on Langfuse

- [Khan Academy](/users/khan-academy)
- [Hugging Face](/users/hugging-face)
- [Merck](/users/merckgroup)

## Learn how to trace and govern coding agents

- [Tracing coding agents with Langfuse](/resources/engineering/coding-agent-tracing) — Setup patterns for Claude Code, Codex, Copilot, Cursor, and more — plus cost tracking and team governance.
- [What is an LLM gateway?](/resources/engineering/llm-gateway) — When a gateway is the right enforcement layer for model access, budgets, and tracing.
- [Evaluating AI agent skills](/blog/2026-02-26-evaluate-ai-agent-skills) — Measure whether skills actually improve quality and reduce wasted context.
- [Optimizing an AI skill with Autoresearch](/blog/2026-03-24-optimizing-ai-skill-with-autoresearch) — Iterate on skills with traces and experiments so token spend actually drops.

## Ready to govern coding agent usage?

Use a gateway or hooks to trace sessions, attribute spend, and improve token efficiency with Langfuse.

- [Start free](/cloud)
- [Documentation](/docs)
- [Talk to sales](/talk-to-us)
