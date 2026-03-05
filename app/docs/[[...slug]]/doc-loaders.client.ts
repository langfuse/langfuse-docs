"use client";

import type { ComponentType } from "react";

/**
 * Client-only doc loaders: dynamic imports to MDX files.
 * Does not import lib/source or .source, so no Node fs/runtime in the client bundle.
 */
export const docLoaders: Record<
  string,
  () => Promise<{ default: ComponentType<{ components?: Record<string, ComponentType> }> }>
> = {
  "ask-ai": () => import("@/content/docs/ask-ai.mdx?collection=docs"),
  demo: () => import("@/content/docs/demo.mdx?collection=docs"),
  "docs-mcp": () => import("@/content/docs/docs-mcp.mdx?collection=docs"),
  glossary: () => import("@/content/docs/glossary.mdx?collection=docs"),
  "": () => import("@/content/docs/index.mdx?collection=docs"),
  roadmap: () => import("@/content/docs/roadmap.mdx?collection=docs"),
  "security-and-guardrails": () =>
    import("@/content/docs/security-and-guardrails.mdx?collection=docs"),
  "administration/audit-logs": () =>
    import("@/content/docs/administration/audit-logs.mdx?collection=docs"),
  "administration/authentication-and-sso": () =>
    import("@/content/docs/administration/authentication-and-sso.mdx?collection=docs"),
  "administration/billable-units": () =>
    import("@/content/docs/administration/billable-units.mdx?collection=docs"),
  "administration/data-deletion": () =>
    import("@/content/docs/administration/data-deletion.mdx?collection=docs"),
  "administration/data-retention": () =>
    import("@/content/docs/administration/data-retention.mdx?collection=docs"),
  "administration/llm-connection": () =>
    import("@/content/docs/administration/llm-connection.mdx?collection=docs"),
  "administration/rbac": () => import("@/content/docs/administration/rbac.mdx?collection=docs"),
  "administration/scim-and-org-api": () =>
    import("@/content/docs/administration/scim-and-org-api.mdx?collection=docs"),
  "administration/spend-alerts": () =>
    import("@/content/docs/administration/spend-alerts.mdx?collection=docs"),
  "administration/troubleshooting-and-faq": () =>
    import("@/content/docs/administration/troubleshooting-and-faq.mdx?collection=docs"),
  "api-and-data-platform/overview": () =>
    import("@/content/docs/api-and-data-platform/overview.mdx?collection=docs"),
  "evaluation/core-concepts": () =>
    import("@/content/docs/evaluation/core-concepts.mdx?collection=docs"),
  "evaluation/overview": () =>
    import("@/content/docs/evaluation/overview.mdx?collection=docs"),
  "evaluation/troubleshooting-and-faq": () =>
    import("@/content/docs/evaluation/troubleshooting-and-faq.mdx?collection=docs"),
  "metrics/overview": () => import("@/content/docs/metrics/overview.mdx?collection=docs"),
  "observability/data-model": () =>
    import("@/content/docs/observability/data-model.mdx?collection=docs"),
  "observability/get-started": () =>
    import("@/content/docs/observability/get-started.mdx?collection=docs"),
  "observability/overview": () =>
    import("@/content/docs/observability/overview.mdx?collection=docs"),
  "observability/troubleshooting-and-faq": () =>
    import("@/content/docs/observability/troubleshooting-and-faq.mdx?collection=docs"),
  "prompt-management/data-model": () =>
    import("@/content/docs/prompt-management/data-model.mdx?collection=docs"),
  "prompt-management/get-started": () =>
    import("@/content/docs/prompt-management/get-started.mdx?collection=docs"),
  "prompt-management/overview": () =>
    import("@/content/docs/prompt-management/overview.mdx?collection=docs"),
  "prompt-management/troubleshooting-and-faq": () =>
    import("@/content/docs/prompt-management/troubleshooting-and-faq.mdx?collection=docs"),
  "api-and-data-platform/features/export-from-ui": () =>
    import("@/content/docs/api-and-data-platform/features/export-from-ui.mdx?collection=docs"),
  "api-and-data-platform/features/export-to-blob-storage": () =>
    import("@/content/docs/api-and-data-platform/features/export-to-blob-storage.mdx?collection=docs"),
  "api-and-data-platform/features/mcp-server": () =>
    import("@/content/docs/api-and-data-platform/features/mcp-server.mdx?collection=docs"),
  "api-and-data-platform/features/observations-api": () =>
    import("@/content/docs/api-and-data-platform/features/observations-api.mdx?collection=docs"),
  "api-and-data-platform/features/public-api": () =>
    import("@/content/docs/api-and-data-platform/features/public-api.mdx?collection=docs"),
  "api-and-data-platform/features/query-via-sdk": () =>
    import("@/content/docs/api-and-data-platform/features/query-via-sdk.mdx?collection=docs"),
  "evaluation/evaluation-methods/annotation-queues": () =>
    import("@/content/docs/evaluation/evaluation-methods/annotation-queues.mdx?collection=docs"),
  "evaluation/evaluation-methods/llm-as-a-judge": () =>
    import("@/content/docs/evaluation/evaluation-methods/llm-as-a-judge.mdx?collection=docs"),
  "evaluation/evaluation-methods/score-analytics": () =>
    import("@/content/docs/evaluation/evaluation-methods/score-analytics.mdx?collection=docs"),
  "evaluation/evaluation-methods/scores-via-sdk": () =>
    import("@/content/docs/evaluation/evaluation-methods/scores-via-sdk.mdx?collection=docs"),
  "evaluation/evaluation-methods/scores-via-ui": () =>
    import("@/content/docs/evaluation/evaluation-methods/scores-via-ui.mdx?collection=docs"),
  "evaluation/experiments/data-model": () =>
    import("@/content/docs/evaluation/experiments/data-model.mdx?collection=docs"),
  "evaluation/experiments/datasets": () =>
    import("@/content/docs/evaluation/experiments/datasets.mdx?collection=docs"),
  "evaluation/experiments/experiments-via-sdk": () =>
    import("@/content/docs/evaluation/experiments/experiments-via-sdk.mdx?collection=docs"),
  "evaluation/experiments/experiments-via-ui": () =>
    import("@/content/docs/evaluation/experiments/experiments-via-ui.mdx?collection=docs"),
  "metrics/features/custom-dashboards": () =>
    import("@/content/docs/metrics/features/custom-dashboards.mdx?collection=docs"),
  "metrics/features/metrics-api": () =>
    import("@/content/docs/metrics/features/metrics-api.mdx?collection=docs"),
  "observability/features/agent-graphs": () =>
    import("@/content/docs/observability/features/agent-graphs.mdx?collection=docs"),
  "observability/features/comments": () =>
    import("@/content/docs/observability/features/comments.mdx?collection=docs"),
  "observability/features/corrections": () =>
    import("@/content/docs/observability/features/corrections.mdx?collection=docs"),
  "observability/features/environments": () =>
    import("@/content/docs/observability/features/environments.mdx?collection=docs"),
  "observability/features/log-levels": () =>
    import("@/content/docs/observability/features/log-levels.mdx?collection=docs"),
  "observability/features/masking": () =>
    import("@/content/docs/observability/features/masking.mdx?collection=docs"),
  "observability/features/mcp-tracing": () =>
    import("@/content/docs/observability/features/mcp-tracing.mdx?collection=docs"),
  "observability/features/metadata": () =>
    import("@/content/docs/observability/features/metadata.mdx?collection=docs"),
  "observability/features/multi-modality": () =>
    import("@/content/docs/observability/features/multi-modality.mdx?collection=docs"),
  "observability/features/observation-types": () =>
    import("@/content/docs/observability/features/observation-types.mdx?collection=docs"),
  "observability/features/queuing-batching": () =>
    import("@/content/docs/observability/features/queuing-batching.mdx?collection=docs"),
  "observability/features/releases-and-versioning": () =>
    import("@/content/docs/observability/features/releases-and-versioning.mdx?collection=docs"),
  "observability/features/sampling": () =>
    import("@/content/docs/observability/features/sampling.mdx?collection=docs"),
  "observability/features/sessions": () =>
    import("@/content/docs/observability/features/sessions.mdx?collection=docs"),
  "observability/features/tags": () =>
    import("@/content/docs/observability/features/tags.mdx?collection=docs"),
  "observability/features/token-and-cost-tracking": () =>
    import("@/content/docs/observability/features/token-and-cost-tracking.mdx?collection=docs"),
  "observability/features/trace-ids-and-distributed-tracing": () =>
    import("@/content/docs/observability/features/trace-ids-and-distributed-tracing.mdx?collection=docs"),
  "observability/features/url": () =>
    import("@/content/docs/observability/features/url.mdx?collection=docs"),
  "observability/features/user-feedback": () =>
    import("@/content/docs/observability/features/user-feedback.mdx?collection=docs"),
  "observability/features/users": () =>
    import("@/content/docs/observability/features/users.mdx?collection=docs"),
  "observability/sdk/advanced-features": () =>
    import("@/content/docs/observability/sdk/advanced-features.mdx?collection=docs"),
  "observability/sdk/instrumentation": () =>
    import("@/content/docs/observability/sdk/instrumentation.mdx?collection=docs"),
  "observability/sdk/overview": () =>
    import("@/content/docs/observability/sdk/overview.mdx?collection=docs"),
  "observability/sdk/troubleshooting-and-faq": () =>
    import("@/content/docs/observability/sdk/troubleshooting-and-faq.mdx?collection=docs"),
  "observability/sdk/upgrade-path": () =>
    import("@/content/docs/observability/sdk/upgrade-path.mdx?collection=docs"),
  "prompt-management/features/a-b-testing": () =>
    import("@/content/docs/prompt-management/features/a-b-testing.mdx?collection=docs"),
  "prompt-management/features/caching": () =>
    import("@/content/docs/prompt-management/features/caching.mdx?collection=docs"),
  "prompt-management/features/composability": () =>
    import("@/content/docs/prompt-management/features/composability.mdx?collection=docs"),
  "prompt-management/features/config": () =>
    import("@/content/docs/prompt-management/features/config.mdx?collection=docs"),
  "prompt-management/features/folders": () =>
    import("@/content/docs/prompt-management/features/folders.mdx?collection=docs"),
  "prompt-management/features/github-integration": () =>
    import("@/content/docs/prompt-management/features/github-integration.mdx?collection=docs"),
  "prompt-management/features/guaranteed-availability": () =>
    import("@/content/docs/prompt-management/features/guaranteed-availability.mdx?collection=docs"),
  "prompt-management/features/link-to-traces": () =>
    import("@/content/docs/prompt-management/features/link-to-traces.mdx?collection=docs"),
  "prompt-management/features/mcp-server": () =>
    import("@/content/docs/prompt-management/features/mcp-server.mdx?collection=docs"),
  "prompt-management/features/message-placeholders": () =>
    import("@/content/docs/prompt-management/features/message-placeholders.mdx?collection=docs"),
  "prompt-management/features/n8n-node": () =>
    import("@/content/docs/prompt-management/features/n8n-node.mdx?collection=docs"),
  "prompt-management/features/playground": () =>
    import("@/content/docs/prompt-management/features/playground.mdx?collection=docs"),
  "prompt-management/features/prompt-version-control": () =>
    import("@/content/docs/prompt-management/features/prompt-version-control.mdx?collection=docs"),
  "prompt-management/features/variables": () =>
    import("@/content/docs/prompt-management/features/variables.mdx?collection=docs"),
  "prompt-management/features/webhooks-slack-integrations": () =>
    import("@/content/docs/prompt-management/features/webhooks-slack-integrations.mdx?collection=docs"),
};

export function getDocLoader(slug: string[]): (typeof docLoaders)[string] | undefined {
  const key = slug.length === 0 ? "" : slug.join("/");
  return docLoaders[key];
}
