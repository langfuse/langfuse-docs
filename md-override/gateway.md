---
title: Langfuse AI Gateway
description: One open source entry point for all AI usage in your company. See every model call, who made it and what it cost, natively traced in Langfuse.
---

# See and control all AI usage

Langfuse AI Gateway (public beta)

AI governance across your organization: route all model calls through the gateway instead of losing track of keys and budgets.

[Start free](/cloud), [Documentation](/docs/gateway/overview)

Used by [Ramp](/users/ramp), [Canva](/users/canva), Expedia Group, Pigment, [Khan Academy](/users/khan-academy), [Hugging Face](/users/hugging-face), Intuit and [SumUp](/users/sumup).

## One control point for every model call, natively traced in Langfuse

Figure: AI Gateway overview.

1. Coding agents such as Claude Code, Codex and OpenCode, and your own apps, send requests to the AI Gateway, which runs in Langfuse.
2. The AI Gateway authorizes the gateway key and maps the model to a provider request.
3. The AI Gateway calls the model provider (Anthropic, OpenAI, Google AI, Bedrock and more) and returns the response.
4. Langfuse tracing captures every request.

## Bring order to your company's AI usage

- **See all spend.** Know what AI costs and who’s spending it.
  - **Spend dashboard:** cost by model, provider, user and gateway key.
  - **Attribution by person, service or team:** keys for people or services, labels for teams or cost centers.
- **Cap model costs.** Set budgets and enforce limits across the organization.
  - **Budgets:** reset daily, weekly or monthly. Requests stop once a budget runs out.
  - **Warnings and resets:** email warnings at 85% and 95%, and a one-click reset that sets spend back to zero.
- **Control access.** Allow or block models centrally or individually.
  - **Model controls:** approve models centrally and limit each gateway key to the models it needs.
  - **Revocable keys:** revoke any gateway key immediately. User keys stop working when the person loses access.
- **Improve AI usage.** See what AI is used for and improve it.
  - **Automatic tracing:** every call becomes a Langfuse trace, with full content or usage only.
  - **Evals and analysis:** run evals, topics and alerts, or tell Halo what’s on your mind.

## Get everything you need in a gateway, included in Langfuse

- **[Your providers, one endpoint](/docs/gateway/features/models#supported-providers):** Connect your own provider accounts, with no markup on tokens. Each provider keeps its own API format. Change one URL to switch over. Supported providers: OpenAI, Anthropic, Amazon Bedrock, Google AI Studio, Google Vertex AI, Microsoft Azure (Foundry), OpenRouter, Vercel AI Gateway and xAI.
- **[Native Langfuse integration](/docs/gateway/features/tracing):** Every call becomes a Langfuse trace, with no code changes. Run evals, search, or ask Halo what teams use AI for.
- **[Gateway keys](/docs/gateway/features/api-keys):** Keys for people and for services, labelled by team or cost center. They expire, can be revoked, and stop working when their owner loses access.
- **[Budgets](/docs/gateway/features/budgets):** Per key, per user, a default for everyone, or for the whole organization. Email warnings at 85%, 95% and 100%.
- **[Spend dashboard](/docs/gateway/features/analytics):** Spend by model, provider, user and key, with alerts on cost or request count and export to your data lake.
- **[Model controls](/docs/gateway/features/models):** Turn models on or off per provider connection and limit each gateway key to certain models.
- **[Guardrails](/docs/gateway/features/guardrails):** Block, redact or log PII, secrets, prompt injection and custom patterns in requests and responses.

## Open source: self-host it in your own infrastructure

Like the rest of Langfuse, the core gateway is MIT-licensed. Run it next to your self-hosted Langfuse as a single small Docker image, or use it fully managed on Langfuse Cloud.

1. **Deploy the gateway.** It ships with the Langfuse Docker Compose setup and Helm chart. Add the gateway keys, or enable it in your Helm values. See [Docker Compose](/self-hosting/deployment/docker-compose#ai-gateway) and [Helm](/self-hosting/deployment/kubernetes-helm#ai-gateway).
2. **Give it a public URL.** Serve the gateway on its own host name over HTTPS, and set that address as its public URL. See [Public URL and TLS](/self-hosting/configuration/ai-gateway#public-url).
3. **Connect providers and hand out keys.** As an organization admin, add your provider accounts and create gateway keys in Langfuse. See [Admin setup](/docs/gateway/get-started/admin-setup).

## How it works: change the base URL, keep the rest

1. **Connect your providers.** Add your own OpenAI, Anthropic, Bedrock, Vertex, Azure or other provider accounts. Your keys stay in the gateway, and you keep your own contracts and pricing with no markup. [Read the docs](/docs/gateway/features/models)
2. **Hand out gateway keys.** Give each person or service its own gateway key instead of a provider key. Each key carries who it belongs to, which models it can use and its budget, and you can revoke it anytime. [Read the docs](/docs/gateway/features/api-keys)
3. **Change one URL.** Point your apps and coding agents at the gateway. Requests keep each provider’s native format, so nothing else changes. From then on, every call is costed, checked against your budgets, and recorded in Langfuse. [Read the docs](/docs/gateway/get-started/first-request)

```diff
 client = OpenAI(
-  api_key="sk-proj-••••••••",
+  # EU region. US: gateway.us.cloud.langfuse.com
+  base_url="https://gateway.cloud.langfuse.com/openai/v1",
+  api_key="<your-gateway-key>",
 )
```

## Customers

> “Building on Langfuse we saved 30% of external BPO cost by deflecting 50% of support conversations to AI.”
>
> — Ana Casado, Head of Operations Data and AI at SumUp

[Read the SumUp story](/users/sumup), [All customer stories](/users)

## Langfuse AI Gateway updates

Get an email when we ship new gateway features and providers. Gateway updates only, no spam. Subscribe on [the AI Gateway launch post](/blog/introducing-gateway).
