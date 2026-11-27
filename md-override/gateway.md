---
title: Langfuse AI Gateway
description: One open source entry point for all AI usage in your company. See every model call, who made it and what it cost, natively traced in Langfuse.
---

# See and control all AI usage

Langfuse AI Gateway (public beta)

Route every model call through one gateway. Track spend, set budgets and manage access across your organization.

[Start free](/cloud), [Send your first request](/docs/gateway/get-started/first-request)

Used by [Ramp](/users/ramp), [Canva](/users/canva), Expedia Group, Pigment, [Khan Academy](/users/khan-academy), [Hugging Face](/users/hugging-face), Intuit and [SumUp](/users/sumup).

## One entry point for every model call, natively traced in Langfuse

Figure: AI Gateway overview.

1. Coding agents such as Claude Code, Codex and OpenCode, and your own apps, send requests to the AI Gateway, which runs in Langfuse.
2. The AI Gateway authorizes the gateway key and maps the model to a provider request.
3. The AI Gateway calls the model provider (Anthropic, OpenAI, Google AI, Bedrock and more) and returns the response.
4. Langfuse tracing captures every request, usage only or in full.

## Control your company's AI usage

- **See all spend.** The [spend dashboard](/docs/gateway/features/analytics) shows what AI costs by model, user and key, [attributed](/docs/gateway/features/api-keys#key-metadata) to a person, service or team.
- **Cap model costs.** Set daily, weekly or monthly [budgets](/docs/gateway/features/budgets). Requests stop at the limit, with [email warnings](/docs/gateway/features/budgets#email-alerts) at 85% and 95%.
- **Govern access and data.** [Approve models](/docs/gateway/features/models#manage-models) centrally and limit each key to the models it needs. [Revoke keys](/docs/gateway/features/api-keys#key-types) instantly, and add [guardrails](/docs/gateway/features/guardrails) for PII and secrets.
- **Improve AI usage.** Every call becomes a [Langfuse trace](/docs/gateway/features/tracing#ingestion-modes). Run [evals](/docs/evaluation/overview) on it, or [ask Halo](/docs/api-and-data-platform/features/halo) what drives cost and failures.

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

MIT-licensed, like the rest of Langfuse. Run it as a single 22 MB Docker image, or use it managed on Langfuse Cloud.

1. **Deploy the gateway.** Ships with the Docker Compose setup and Helm chart. See [Docker Compose](/self-hosting/deployment/docker-compose#ai-gateway) and [Helm](/self-hosting/deployment/kubernetes-helm#ai-gateway).
2. **Give it a public URL.** Serve it on its own host name over HTTPS. See [Public URL and TLS](/self-hosting/configuration/ai-gateway#public-url).
3. **Connect providers and hand out keys.** Add provider accounts and create gateway keys. See [Admin setup](/docs/gateway/get-started/admin-setup).

## Customers

> “Building on Langfuse we saved 30% of external BPO cost by deflecting 50% of support conversations to AI.”
>
> — Ana Casado, Head of Operations Data and AI at SumUp

[Read the SumUp story](/users/sumup), [All customer stories](/users)

## Get Updates

Get an email when we ship new features and providers. Gateway updates only, no spam. Subscribe on [the AI Gateway launch post](/blog/introducing-gateway).
