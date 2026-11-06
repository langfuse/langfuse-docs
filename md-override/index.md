---
title: "Langfuse: Open Source Agent Evals & Observability"
canonical: https://langfuse.com/
description: Langfuse is one open platform for every AI call your company makes and every agent your teams build. Track usage and costs, trace and evaluate agents, and use production logs to ship better AI. Cloud or self-hosted.
---

# Langfuse

Langfuse is one [open](https://github.com/langfuse/langfuse) platform for every AI call your company makes and every agent your teams build. Track usage and costs, trace and evaluate agents, and use production logs to ship better AI. Cloud or self-hosted.

Used by 21 of the Fortune 50. 100,000+ engineers build on Langfuse, and the platform processes 90B+ observations per month.

[Start free](/cloud) · [Documentation](/docs) · [Watch demo](/watch-demo) · [Interactive demo](/docs/demo)

## Every AI call. One platform.

Instrument your agents with the SDKs or OpenTelemetry, or route model calls through the [Langfuse AI Gateway](/docs/gateway/overview) without changing code. Every call lands in Langfuse for tracing, evals, and cost tracking, and you can export it to your warehouse.

- **Your agents** — personal agents (coding and desktop assistants such as Claude Code, Codex, Cursor, and GitHub Copilot), custom agents (support, voice, RAG, workflows), and copilots and no-code tools (low-code and workflow builders such as Copilot Studio, n8n, Dify, and Flowise). See all [integrations](/integrations).
- **SDKs / OpenTelemetry** — instrument your agents with the [Langfuse SDKs](/docs/observability/sdk/overview) or any [OpenTelemetry](/integrations/native/opentelemetry) exporter.
- **[Langfuse AI Gateway](/docs/gateway/overview) (new)** — gateway keys, model access, and cost per user for OpenAI and Anthropic calls, all traced automatically. You can also bring your own gateway.
- **Langfuse** — observe with [tracing](/docs/observability/overview), [dashboards](/docs/metrics/features/custom-dashboards), and [alerts](/docs/observability/features/alerts); manage [prompts](/docs/prompt-management/overview) and [skills](/docs/skill-management/overview); evaluate with [evals](/docs/evaluation/overview), [datasets](/docs/evaluation/experiments/datasets), and [experiments](/docs/evaluation/experiments/experiments-via-sdk). The in-app agent [Halo](/docs/api-and-data-platform/features/halo) works with your Langfuse data, or you can [bring your own agent](/docs/api-and-data-platform/features/agent-skill). Every feature is available via [MCP](/docs/api-and-data-platform/features/mcp-server), [CLI](/docs/api-and-data-platform/features/cli), [API](/docs/api-and-data-platform/features/public-api), and [SDKs](/docs/observability/sdk/overview).

## Learn how the best teams build with AI

Langfuse is the platform. The [Langfuse Academy](/academy) is how you, and your agents, learn what to do with it: [the AI engineering loop](/academy/ai-engineering-loop) of [tracing](/academy/tracing), [monitoring](/academy/monitoring), [datasets](/academy/datasets), [experiments](/academy/experiments), and [evals](/academy/evaluate), with worked examples from real applications. Free, open, and readable as Markdown for coding agents.

## Platform features

One integrated platform to trace, manage prompts, evaluate, and experiment from prototype to production scale. Every component works standalone, and they excel when used together.

- **[Observability](/docs/observability/overview)** — hierarchical traces capture every LLM call, tool invocation, and retrieval step. Filter by user, session, cost, latency, or custom metadata.
- **[AI Gateway](/docs/gateway/overview)** (new) — swap the base URL and API key to route your OpenAI and Anthropic calls through Langfuse. Gateway keys show cost per user and key, and every call is traced automatically.
- **[Evaluation](/docs/evaluation/overview)** — LLM-as-a-judge, heuristic functions, or human review. Run evaluators on production data or during experiments.
- **[Prompt management](/docs/prompt-management/overview)** — separate prompts from code with one-click deployments and rollbacks.
- **[Playground](/docs/prompt-management/features/playground)** — test prompts on real production inputs and compare models side by side.
- **[Experiments](/docs/evaluation/experiments/datasets)** — define test cases, run experiments, and compare results side by side.
- **[Human annotation](/docs/evaluation/evaluation-methods/annotation-queues)** — collaborative human-in-the-loop workflows to review traces and create golden datasets.
- **[Cost and latency](/docs/observability/features/token-and-cost-tracking)** — monitor cost, latency, and quality with [dashboards](/docs/metrics/features/custom-dashboards) and [automated alerts](/docs/observability/features/alerts).

## Works with any stack

Langfuse works with any language and framework supporting OpenTelemetry instrumentation. [100+ integrations](/integrations) make getting started easier, with no framework lock-in.

- **Languages** — [Python](/docs/observability/sdk/overview) and [TypeScript](/docs/observability/sdk/overview) native SDKs, plus Go, Java, .NET, Ruby, PHP, and Swift via [OpenTelemetry](/integrations/native/opentelemetry).
- **Gateways** — the [Langfuse AI Gateway](/docs/gateway/overview), plus [LiteLLM](/integrations/gateways/litellm), [OpenRouter](/integrations/gateways/openrouter), [Vercel AI Gateway](/integrations/gateways/vercel-ai-gateway), [Portkey](/integrations/gateways/portkey), [Kong](/integrations/gateways/kong-ai-plugin), [Helicone](/integrations/gateways/helicone), and many more.
- **Agent frameworks** — [LangChain](/integrations/frameworks/langchain), [Vercel AI SDK](/integrations/frameworks/vercel-ai-sdk), [LiteLLM](/integrations/frameworks/litellm-sdk), [Pydantic AI](/integrations/frameworks/pydantic-ai), [Google ADK](/integrations/frameworks/google-adk), [CrewAI](/integrations/frameworks/crewai), [LiveKit](/integrations/frameworks/livekit), and many more.
- **Model providers** — [OpenAI](/integrations/model-providers/openai-py), [Anthropic](/integrations/model-providers/anthropic), [Amazon Bedrock](/integrations/model-providers/amazon-bedrock), Azure OpenAI, [Mistral AI](/integrations/model-providers/mistral-sdk), [Google Gemini](/integrations/model-providers/google-gemini), xAI, vLLM, Groq, and many more.
- **Coding agents and tools** — [Claude Code](/integrations/developer-tools/claude-code), [Cursor](/integrations/developer-tools/cursor), [Codex](/integrations/developer-tools/codex), [OpenWebUI](/integrations/no-code/openwebui), [Dify](/integrations/no-code/dify), [n8n](/integrations/no-code/n8n), [PostHog](/integrations/analytics/posthog), and more.

[See all integrations](/integrations)

## Open platform, open source

Langfuse is built on open standards and data portability, and will not lock in your data.

- **MIT license** — all product features are MIT licensed, scale to billions of monthly events, and you can fork, modify, and contribute. See [open source](/handbook/chapters/open-source).
- **[Self-host at scale](/self-hosting)** — [Docker Compose](/self-hosting/deployment/docker-compose), [Kubernetes (Helm)](/self-hosting/deployment/kubernetes-helm), and Terraform for [AWS](/self-hosting/deployment/aws), [GCP](/self-hosting/deployment/gcp), and [Azure](/self-hosting/deployment/azure).
- **APIs and exports** — [REST APIs](/docs/api-and-data-platform/features/public-api) for everything, a [query SDK](/docs/api-and-data-platform/features/query-via-sdk), and [S3 blob storage export](/docs/api-and-data-platform/features/export-to-blob-storage).
- **Active community** — 35,000+ GitHub stars, 5,000+ Discord members, weekly releases and community hours.

## Made for developers, loved by agents

Work in the app or from your IDE. [Halo](/docs/api-and-data-platform/features/halo), the Langfuse assistant, investigates production and takes approved actions, and `SKILL.md`, the CLI, and MCP connect coding agents to Langfuse.

- **[Halo](/docs/api-and-data-platform/features/halo), the Langfuse Assistant** (in-app) — automate the AI engineering loop: investigate production data, understand what happened, and turn findings into approved actions without leaving Langfuse. Debug traces, optimize spend, and build evals.
- **[SKILL.md](https://github.com/langfuse/skills)** (coding agents) — a ready-made skill for managing prompts, traces, and evals through natural language.
- **[Langfuse CLI](/docs/api-and-data-platform/features/cli)** (terminal) — full API access for agent workflows, scripts, and CI/CD.
- **[Platform MCP server](/docs/api-and-data-platform/features/mcp-server)** (IDE agents) — structured access for IDE agents to manage prompts, query traces, and use Langfuse data.
- **[Docs MCP server](/docs/docs-mcp)** — search the Langfuse documentation directly from your AI editor.

Markdown versions of any page on this site are available by appending `.md` to the URL, or by requesting it with `Accept: text/markdown`. See [llms.txt](/llms.txt) for a machine-readable index.

## Enterprise scale and security

Traditional observability handles many small spans. LLM systems run differently: every step carries rich, verbose I/O that legacy platforms cannot handle at scale. Langfuse ingests and queries LLM traces reliably at enterprise scale while following strict compliance frameworks.

- **Architecture** — ClickHouse OLAP database, async ingestion via Redis queue, S3/blob storage for large payloads, and edge-cached prompts.
- **Reliability at scale** — 65M+ SDK installs per month, 90B+ observations processed per month, 50,000+ companies using Langfuse, 99.9% uptime.
- **Security and compliance** — [SOC 2 Type II & ISO 27001](/security), [EU, US, and Japan data regions](/security/data-regions), [FIPS 140-3 & Iron Bank-hardened images for Gov](/self-hosting/configuration/hardening#hardening-for-government), a [HIPAA-ready region](/security/hipaa), and [GDPR](/security/gdpr). See the [security overview](/security).

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

To set Langfuse up with a coding agent, install the [Langfuse Agent Skill](https://github.com/langfuse/skills) and ask it to add tracing, set up evals, migrate your prompts, or integrate the [AI Gateway](/docs/gateway/overview).

Need help? [Talk to sales](/talk-to-us) or [reach out to support](/support).

## Questions and answers

### What is Langfuse?

Langfuse is an [open-source](https://github.com/langfuse/langfuse) AI engineering platform that helps teams build, monitor, and improve their LLM applications. It covers the full development lifecycle with [tracing](/docs/observability/overview), [prompt management](/docs/prompt-management/overview), [evaluations](/docs/evaluation/overview), and [analytics dashboards](/docs/metrics/overview), plus an optional [AI Gateway](/docs/gateway/overview) that routes your AI calls through Langfuse and traces each one with usage and cost. Many teams start with tracing alone and adopt other features as they need them. Langfuse is used by 50,000+ companies and processes billions of observations per month. You can try it instantly with the [public demo project](/docs/demo) or [sign up for free](/cloud).

### How does Langfuse compare to LangSmith, Braintrust, Arize, Galileo, and Datadog?

Langfuse is an [open-source](/why) AI engineering platform for tracing, evaluations, prompt management, and experiments, with an optional [AI Gateway](/docs/gateway/overview). Compared with [LangSmith](/compare/langsmith), [Braintrust](/compare/braintrust), [Arize](/compare/arize-phoenix), [Galileo](/compare/galileo), and [Datadog Agent Observability](/compare/datadog), it is [MIT licensed](/handbook/chapters/open-source), [OpenTelemetry](/integrations/native/opentelemetry) native, [self-hostable](/self-hosting) at the same scale as Langfuse Cloud, and model- and framework-agnostic. On a representative workload, Langfuse Cloud is cheaper than [LangSmith](/compare/langsmith), [Braintrust](/compare/braintrust), [Arize](/compare/arize-phoenix), and [Datadog Agent Observability](/compare/datadog). See [Why Langfuse?](/why) for how we position the product, or the [comparison pages](/compare) for product-by-product differences.

### What deployment options do exist?

Langfuse is available as a [managed cloud service](https://cloud.langfuse.com) in [global regions](/security/data-regions), or you can [self-host](/self-hosting) it on your own infrastructure using [Docker Compose](/self-hosting/deployment/docker-compose), [Kubernetes (Helm)](/self-hosting/deployment/kubernetes-helm), or Terraform templates for [AWS](/self-hosting/deployment/aws), [GCP](/self-hosting/deployment/gcp), and [Azure](/self-hosting/deployment/azure). Self-hosting is free under the [MIT license](/handbook/chapters/open-source) and includes all core features, such as observability, evaluation, prompt management, and datasets, with unlimited usage. The [AI Gateway](/docs/gateway/overview) is fully available when self-hosting as well. You only pay for your own infrastructure. The [self-hosted Enterprise plan](/pricing-self-host) adds project-level RBAC, audit logs, data retention policies, management APIs, and dedicated support with SLAs.

### Do I need the AI Gateway to use Langfuse?

No. The [AI Gateway](/docs/gateway/overview) is optional. To use it, swap the base URL and API key in your AI calls for the gateway's, and every call is traced without an SDK. Otherwise, the [SDKs](/docs/observability/sdk/overview) and [OpenTelemetry integrations](/integrations/native/opentelemetry) work as before. You can also [combine both](/docs/gateway/troubleshooting-and-faq#ai-gateway-with-sdk), so gateway calls show up inside your existing traces.

### What's the latency impact?

Tracing with the SDKs and OpenTelemetry is async and doesn't block your application. Data is sent in the background with [automatic batching and queuing](/docs/observability/features/queuing-batching). The [AI Gateway](/docs/gateway/overview) sits in the request path between your application and the provider, and is built in Rust and optimized for low latency. Prompts are [cached client-side in the SDKs](/docs/prompt-management/features/caching), so there's no latency impact after the first fetch, and [guaranteed availability](/docs/prompt-management/features/guaranteed-availability) keeps your application working even if Langfuse is unreachable.

### Is Langfuse secure and compliant?

Yes. Langfuse Cloud is [SOC 2 Type II](/security/soc2) certified, [ISO 27001](/security/iso27001) compliant, [GDPR](/security/gdpr) compliant, and offers a [HIPAA-ready region](/security/hipaa). Data is [encrypted](/security/encryption) at rest and in transit, and you can choose between [US, EU, Japan, and HIPAA data regions](/security/data-regions). For full control, you can [self-host](/self-hosting) Langfuse on your own infrastructure with [data masking](/self-hosting/security/data-masking) and your own encryption keys. See our [security overview](/security) for details.

### How does pricing work?

Langfuse Cloud has a [free Hobby plan](/pricing) with no credit card required. Paid plans use usage-based [graduated pricing](/pricing) based on [billable units](/docs/administration/billable-units), which are the traces, observations, and scores you send to the platform. Volume discounts apply automatically as you scale. You can also [self-host](/self-hosting) Langfuse for free under the MIT license. See the [pricing page](/pricing) for the full calculator and plan comparison.

[Ask anything else](/docs/ask-ai)
