---
title: Langfuse AI Gateway
description: One open source entry point for all AI usage in your company. See every model call, who made it and what it cost, natively traced in Langfuse.
---

# See and control all AI usage

Langfuse AI Gateway (public beta)

AI governance across your organization: route all model calls through the gateway instead of losing track of keys and budgets.

[Start free](/cloud), [Documentation](/docs/gateway/overview)

Used by [Ramp](/users/ramp), [Canva](/users/canva), Expedia Group, Pigment, [Khan Academy](/users/khan-academy), [Hugging Face](/users/hugging-face), Intuit and [SumUp](/users/sumup).

## One entry point for every model call, natively traced in Langfuse

Figure: AI Gateway overview.

1. Coding agents such as Claude Code, Codex and OpenCode, and your own apps, send requests to the AI Gateway, which runs in Langfuse.
2. The AI Gateway authorizes the gateway key and maps the model to a provider request.
3. The AI Gateway calls the model provider (Anthropic, OpenAI, Google AI, Bedrock and more) and returns the response.
4. Langfuse tracing captures every request, usage only or in full.

## Control your company's AI usage

- **See all spend.** Know what AI costs and who’s spending it.
  - **[Spend dashboard](/docs/gateway/features/analytics):** cost by model, provider, user and gateway key.
  - **[Attribution by person, service or team](/docs/gateway/features/api-keys#key-metadata):** keys for people or services, labels for teams or cost centers.
- **Cap model costs.** Set budgets and enforce limits across the organization.
  - **[Budgets](/docs/gateway/features/budgets):** reset daily, weekly or monthly. Requests stop once a budget runs out.
  - **[Warnings and resets](/docs/gateway/features/budgets#email-alerts):** email warnings at 85% and 95%, and a one-click reset that sets spend back to zero.
- **Govern access and data.** Decide who can use which models, and what data reaches them.
  - **[Model controls](/docs/gateway/features/models#manage-models):** approve models centrally and limit each gateway key to the models it needs.
  - **[Revocable keys](/docs/gateway/features/api-keys#key-types):** revoke any gateway key immediately. User keys stop working when the person loses access.
  - **[Guardrails](/docs/gateway/features/guardrails):** block, redact or log PII, secrets and prompt injection in requests and responses.
- **Improve AI usage.** See what AI is used for and improve it.
  - **[Automatic tracing](/docs/gateway/features/tracing#ingestion-modes):** every call becomes a Langfuse trace, with full content or usage only.
  - **[Evals and analysis](/docs/evaluation/overview):** run evals, topics and alerts on every gateway call.
  - **[Ask Halo about your usage](/docs/api-and-data-platform/features/halo):** find recurring workflows, cost drivers and failures in plain language.

## Get everything you need in a gateway, included in Langfuse

- **[Your providers, one endpoint](/docs/gateway/features/models#supported-providers):** Connect your own provider accounts, with no markup on tokens. Each provider keeps its own API format. Supported providers: OpenAI, Anthropic, Amazon Bedrock, Google AI Studio, Google Vertex AI, Microsoft Azure (Foundry), OpenRouter, Vercel AI Gateway and xAI.
- **[Gateway keys](/docs/gateway/features/api-keys):** Hand out keys for people or services, labeled by team or cost center. Set expiration dates or revoke keys to stop traffic instantly.
- **[Spend dashboard](/docs/gateway/features/analytics):** Spend by model, provider, user and key, with alerts on cost or request count and export to your data lake.
- **[Budgets](/docs/gateway/features/budgets):** Avoid overspending by setting spend limits per key, per user, or for the whole organization. Get notified before hitting the limit.
- **[Model controls](/docs/gateway/features/models):** Turn models on or off per provider connection and limit each gateway key to certain models.
- **[Guardrails](/docs/gateway/features/guardrails):** Block, redact or log PII, secrets, prompt injection and custom patterns in requests and responses.
- **[Native Langfuse integration](/docs/gateway/features/tracing):** Every call becomes a Langfuse trace, with no code changes. Run evals, search, or ask Halo what teams use AI for.

## How it works: change the base URL, keep the rest

1. **Connect your providers.** Add your own provider accounts. You keep your contracts and pricing, with no markup. [Read the docs](/docs/gateway/features/models)
2. **Hand out gateway keys.** Give each person or service its own key, with its own models and budget. Revoke it anytime. [Read the docs](/docs/gateway/features/api-keys)
3. **Change one URL.** Point your apps and coding agents at the gateway. Nothing else changes, and every call is traced in Langfuse. [Read the docs](/docs/gateway/get-started/first-request)

```diff
 client = OpenAI(
-  api_key="sk-proj-••••••••",
+  # EU region. US: gateway.us.cloud.langfuse.com
+  base_url="https://gateway.cloud.langfuse.com/openai/v1",
+  api_key="<your-gateway-key>",
 )
```

## Open source: self-host it in your own infrastructure

Like the rest of Langfuse, the AI Gateway is MIT-licensed. Run it next to your self-hosted Langfuse as a single 22 MB Docker image with no extra dependencies, or use it fully managed on Langfuse Cloud.

1. **Deploy the gateway.** It ships with the Langfuse Docker Compose setup and Helm chart. Add the gateway keys, or enable it in your Helm values. See [Docker Compose](/self-hosting/deployment/docker-compose#ai-gateway) and [Helm](/self-hosting/deployment/kubernetes-helm#ai-gateway).
2. **Give it a public URL.** Serve the gateway on its own host name over HTTPS, and set that address as its public URL. See [Public URL and TLS](/self-hosting/configuration/ai-gateway#public-url).
3. **Connect providers and hand out keys.** As an organization admin, add your provider accounts and create gateway keys in Langfuse. See [Admin setup](/docs/gateway/get-started/admin-setup).

## Customers

> “Building on Langfuse we saved 30% of external BPO cost by deflecting 50% of support conversations to AI.”
>
> — Ana Casado, Head of Operations Data and AI at SumUp

[Read the SumUp story](/users/sumup), [All customer stories](/users)

## Langfuse AI Gateway updates

Get an email when we ship new gateway features and providers. Gateway updates only, no spam. Subscribe on [the AI Gateway launch post](/blog/introducing-gateway).
