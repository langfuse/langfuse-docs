---
title: Langfuse
description: Trace, evaluate, and improve AI agents with one open platform. Use production data to understand behavior, collaborate on fixes, and ship better quality at lower cost and latency.
---

# Langfuse

Langfuse is an [open-source](https://github.com/langfuse/langfuse) AI engineering platform for agent evaluation and observability. Trace, evaluate, and improve AI agents with one open platform: use production data to understand behavior, collaborate on fixes, and ship better quality at lower cost and latency.

Used by 21 of the Fortune 50. 100,000+ engineers build on Langfuse, and the platform processes 90B+ observations per month.

[Start free](/cloud) · [Documentation](/docs) · [Interactive demo](/docs/demo)

## The AI engineering loop

Langfuse connects tracing, monitoring, datasets, experiments, and evaluation in one continuous loop. Use production signals to understand behavior, test improvements, and ship better agents with confidence.

The [Langfuse Academy](/academy) walks through how observability, prompts, evals, experiments, and human feedback work together.

## Platform features

One integrated platform to trace, manage prompts, evaluate, and experiment from prototype to production scale. Every component works standalone, and they excel when used together.

- **[Observability](/docs/observability/overview)** — hierarchical traces capture every LLM call, tool invocation, and retrieval step. Filter by user, session, cost, latency, or custom metadata.
- **[Evaluation](/docs/evaluation/overview)** — LLM-as-a-judge, heuristic functions, or human review. Run evaluators on production data or during experiments.
- **[Prompt management](/docs/prompt-management/overview)** — separate prompts from code with one-click deployments and rollbacks.
- **[Playground](/docs/prompt-management/features/playground)** — test prompts on real production inputs and compare models side by side.
- **[Experiments](/docs/evaluation/experiments/overview)** — define test cases, run experiments, and compare results side by side.
- **[Human annotation](/docs/evaluation/evaluation-methods/annotation-queues)** — collaborative human-in-the-loop workflows to review traces and create golden datasets.
- **[Cost and latency](/docs/observability/features/token-and-cost-tracking)** — monitor cost, latency, and quality with [dashboards](/docs/metrics/features/custom-dashboards) and [automated alerts](/docs/observability/features/alerts).

## Works with any stack

Langfuse works with any language and framework supporting OpenTelemetry instrumentation. [100+ integrations](/integrations) make getting started easier, with no framework lock-in.

- **Languages** — [Python](/docs/observability/sdk/python/overview) and [TypeScript](/docs/observability/sdk/typescript/overview) native SDKs, plus Go, Java, .NET, Ruby, PHP, and Swift via [OpenTelemetry](/integrations/native/opentelemetry).
- **Agent frameworks** — [LangChain](/integrations/frameworks/langchain), [Vercel AI SDK](/integrations/frameworks/vercel-ai-sdk), [LiteLLM](/integrations/frameworks/litellm-sdk), [Pydantic AI](/integrations/frameworks/pydantic-ai), [Google ADK](/integrations/frameworks/google-adk), [CrewAI](/integrations/frameworks/crewai), [LiveKit](/integrations/frameworks/livekit), and many more.
- **Model providers** — [OpenAI](/integrations/model-providers/openai-py), [Anthropic](/integrations/model-providers/anthropic), [Amazon Bedrock](/integrations/model-providers/amazon-bedrock), Azure OpenAI, [Mistral AI](/integrations/model-providers/mistral-sdk), [Google Gemini](/integrations/model-providers/google-gemini), xAI, vLLM, Groq, and many more.
- **Coding agents and tools** — [Claude Code](/integrations/developer-tools/claude-code), [Cursor](/integrations/developer-tools/cursor), [Codex](/integrations/developer-tools/codex), [OpenWebUI](/integrations/no-code/openwebui), [Dify](/integrations/no-code/dify), [n8n](/integrations/no-code/n8n), [PostHog](/integrations/analytics/posthog), and more.

[See all integrations](/integrations)

## Open platform, open source

Langfuse is built on open standards and data portability, and will not lock in your data.

- **MIT license** — all product features are MIT licensed, scale to billions of monthly events, and you can fork, modify, and contribute. See [open source](/open-source).
- **[Self-host at scale](/self-hosting)** — [Docker Compose](/self-hosting/deployment/docker-compose), [Kubernetes (Helm)](/self-hosting/deployment/kubernetes-helm), and Terraform for [AWS](/self-hosting/deployment/aws), [GCP](/self-hosting/deployment/gcp), and [Azure](/self-hosting/deployment/azure).
- **APIs and exports** — [REST APIs](/docs/api-and-data-platform/features/public-api) for everything, a [query SDK](/docs/api-and-data-platform/features/query-via-sdk), and [S3 blob storage export](/docs/api-and-data-platform/features/export-to-blob-storage).
- **Active community** — 22,000+ GitHub stars, 5,000+ Discord members, weekly releases and community hours.

## Made for developers, loved by agents

Work in the app or from your IDE. The Assistant investigates production and takes approved actions, and `SKILL.md`, the CLI, and MCP connect coding agents to Langfuse.

- **[Langfuse Assistant](/docs/langfuse-assistant)** (in-app) — automate the AI engineering loop: investigate production data, understand what happened, and turn findings into approved actions without leaving Langfuse. Debug traces, optimize spend, and build evals.
- **[SKILL.md](/skills)** (coding agents) — a ready-made skill for managing prompts, traces, and evals through natural language.
- **[Langfuse CLI](/docs/api-and-data-platform/features/cli)** (terminal) — full API access for agent workflows, scripts, and CI/CD.
- **[Platform MCP server](/docs/api-and-data-platform/features/mcp-server)** (IDE agents) — structured access for IDE agents to manage prompts, query traces, and use Langfuse data.
- **[Docs MCP server](/docs/docs-mcp)** — search the Langfuse documentation directly from your AI editor.

Markdown versions of any page on this site are available by appending `.md` to the URL, or by requesting it with `Accept: text/markdown`. See [llms.txt](/llms.txt) for a machine-readable index.

## Enterprise scale and security

Traditional observability handles many small spans. LLM systems run differently: every step carries rich, verbose I/O that legacy platforms cannot handle at scale. Langfuse ingests and queries LLM traces reliably at enterprise scale while following strict compliance frameworks.

- **Architecture** — ClickHouse OLAP database, async ingestion via Redis queue, S3/blob storage for large payloads, and edge-cached prompts.
- **Reliability at scale** — 50M+ SDK installs per month, 90B+ observations processed per month, 50,000+ companies using Langfuse, 99.9% uptime.
- **Security and compliance** — [SOC 2 Type II](/security/soc2), [ISO 27001](/security/iso27001), [GDPR](/security/gdpr), [EU and US data regions](/security/data-regions), and a [HIPAA-ready region](/security/hipaa). See the [security overview](/security).

[Enterprise](/enterprise) · [Talk to us](/talk-to-us)

## Why use Langfuse?

Langfuse is the most widely adopted open-source LLM engineering platform. Developers who value open source and control over their data build production-grade agents and LLM applications with Langfuse.

- **The full cycle** — powers the entire development cycle from prototype to full-scale production loads.
- **Unified platform** — all components work standalone but excel when used together.
- **Open source (MIT)** — inspect the code and self-host for free.
- **OpenTelemetry native** — standard trace format, works with existing OTel instrumentation.
- **100+ integrations** — works with any model, framework, and stack.
- **Built for scale** — a ClickHouse backend queries millions of traces in milliseconds.
- **Async by default** — tracing never blocks your application, with background processing and automatic batching.
- **Loved by agents** — CLI, MCP, and accessible docs.
- **Production-proven** — 50,000+ companies, billions of events per month, Fortune 50 deployments.
- **Shipping velocity** — the AI space changes fast, and Langfuse ships daily.

## Get started

The free tier includes 50k observations per month, with no credit card required.

- [Sign up for Langfuse Cloud](/cloud) or [self-host](/self-hosting)
- [Tracing quickstart](/docs/observability/get-started)
- [Prompt management guide](/docs/prompt-management/get-started)
- [Evaluation overview](/docs/evaluation/overview)
- [Public demo project](/docs/demo)

To set Langfuse up with a coding agent, install the [Langfuse Agent Skill](https://github.com/langfuse/skills) and ask it to add tracing, set up evals, or migrate your prompts.

Need help? [Talk to sales](/talk-to-us) or [reach out to support](/support).

## Questions and answers

### What is Langfuse?

Langfuse is an [open-source](https://github.com/langfuse/langfuse) AI engineering platform that helps teams build, monitor, and improve their LLM applications. It covers the full development lifecycle with [tracing](/docs/observability/overview), [prompt management](/docs/prompt-management/overview), [evaluations](/docs/evaluation/overview), and [analytics dashboards](/docs/metrics/overview) — all in one place. Langfuse is used by 50,000+ companies and processes billions of observations per month. You can try it instantly with the [public demo project](/docs/demo) or [sign up for free](/cloud).

### What does Langfuse help me with?

Langfuse helps you [debug LLM applications](/docs/observability/overview) with detailed traces that capture every step of your AI pipeline, including [agent graphs](/docs/observability/features/agent-graphs). You can [manage and version your prompts](/docs/prompt-management/overview) collaboratively, run [automated evaluations](/docs/evaluation/evaluation-methods/llm-as-a-judge) (including LLM-as-a-judge and [code evaluators](/docs/evaluation/evaluation-methods/code-evaluators)), track [costs and latency](/docs/observability/features/token-and-cost-tracking) across models and providers, and run [experiments on datasets](/docs/evaluation/experiments/overview) to measure improvements before shipping. It also supports [custom dashboards](/docs/metrics/features/custom-dashboards) for team-wide visibility.

### Can I use just tracing without the other features?

Yes, you can use Langfuse purely for [tracing](/docs/observability/overview). The [SDKs](/docs/observability/sdk/overview) are modular — you instrument your app with a few lines of code and can integrate only what you need. Tracing works independently of [prompt management](/docs/prompt-management/overview), [evaluations](/docs/evaluation/overview), or any other feature. Many teams start with tracing alone and adopt additional capabilities as their needs grow.

### What deployment options do exist?

Langfuse is available as a [managed cloud service](https://cloud.langfuse.com) in [US and EU regions](/security), or you can [self-host](/self-hosting) it on your own infrastructure using [Docker Compose](/self-hosting/deployment/docker-compose), [Kubernetes (Helm)](/self-hosting/deployment/kubernetes-helm), or Terraform templates for [AWS](/self-hosting/deployment/aws), [GCP](/self-hosting/deployment/gcp), and [Azure](/self-hosting/deployment/azure). The self-hosted version includes all product features under the [MIT license](/open-source). For teams needing additional support and compliance, there is a [self-hosted Enterprise plan](/pricing-self-host).

### Is self-hosting actually free?

Yes, self-hosting Langfuse is completely free. The entire codebase is [open source under the MIT license](https://github.com/langfuse/langfuse) — all product features are included with no feature gates. You only pay for your own infrastructure costs. Get started with `docker compose up` using our [self-hosting guide](/self-hosting/deployment/docker-compose) or deploy at scale on [Kubernetes](/self-hosting/deployment/kubernetes-helm). The [Enterprise self-hosted option](/pricing-self-host) adds support SLAs and SSO for organizations that need them.

### What frameworks are supported?

Langfuse supports [100+ integrations](/integrations) including [LangChain](/integrations/frameworks/langchain), [LlamaIndex](/integrations/frameworks/llamaindex), [CrewAI](/integrations/frameworks/crewai), [OpenAI Agents](/integrations/frameworks/openai-agents), [Pydantic AI](/integrations/frameworks/pydantic-ai), [Mastra](/integrations/frameworks/mastra), [Google ADK](/integrations/frameworks/google-adk), [Vercel AI SDK](/integrations/frameworks/vercel-ai-sdk), [OpenAI](/integrations/model-providers/openai-py), [Anthropic](/integrations/model-providers/anthropic), and [AWS Bedrock](/integrations/model-providers/amazon-bedrock). Langfuse is [OpenTelemetry native](/integrations/native/opentelemetry), so it works with any OTEL-compatible library or your [existing OTEL setup](/faq/all/existing-otel-setup).

### What's the latency impact?

Langfuse is async by default — tracing never blocks your application. The SDKs send data in the background with [automatic batching and queuing](/docs/observability/features/queuing-batching), so the latency impact on your application is negligible. For prompt management, [edge caching](/docs/prompt-management/features/caching) ensures prompts are fetched with minimal overhead, and [guaranteed availability](/docs/prompt-management/features/guaranteed-availability) means your application continues to work even if Langfuse is unreachable.

### Is Langfuse secure and compliant?

Yes. Langfuse Cloud is [SOC 2 Type II](/security/soc2) certified, [ISO 27001](/security/iso27001) compliant, [GDPR](/security/gdpr) compliant, and offers a [HIPAA-ready region](/security/hipaa). Data is [encrypted](/security/encryption) at rest and in transit, and you can choose between [US, EU, Japan, and HIPAA data regions](/security/data-regions). For full control, you can [self-host](/self-hosting) Langfuse on your own infrastructure with [data masking](/self-hosting/security/data-masking) and your own encryption keys. See our [security overview](/security) for details.

### How do I get started?

It depends on where you are in your workflow. To **add tracing**, follow the [tracing quickstart](/docs/observability/get-started). To **set up prompt management**, see the [prompt management guide](/docs/prompt-management/get-started). To **build an evaluation strategy**, the [evaluation overview](/docs/evaluation/overview) walks you through the different approaches. [Sign up for Langfuse Cloud](/cloud) (free, no credit card required) or explore the [public demo project](/docs/demo) to see everything in action.

### How does pricing work?

Langfuse Cloud has a [free Hobby plan](/pricing) with no credit card required. Paid plans use usage-based [graduated pricing](/pricing) based on [billable units](/docs/administration/billable-units) — traces, observations, and scores you send to the platform. Volume discounts apply automatically as you scale. You can also [self-host](/self-hosting) Langfuse for free under the MIT license. See the [pricing page](/pricing) for the full calculator and plan comparison.
