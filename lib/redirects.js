/**
 * Redirect configuration for Langfuse documentation
 *
 * This file contains all redirects used by both Next.js and Cloudflare Pages.
 * Each redirect is defined as [source, destination] tuple.
 *
 * All redirects are non-permanent by default to allow for easy updates without caching issues.
 */

// All redirects that should be non-permanent such as temporary /launch pages
const nonPermanentRedirects = [
  ["/launch", "/blog/2025-10-29-launch-week-4"],
  [
    "/loom-gpt4-PR",
    "https://www.loom.com/share/5c044ca77be44ff7821967834dd70cba",
  ],

  // short links
  ["/discord", "https://discord.gg/7NXusRtqYU"],
  ["/demo", "/docs/demo"],
  ["/video", "/watch-demo"],
  ["/docs/video", "/watch-demo"],
  ["/roadmap", "/docs/roadmap"],
  ["/ph", "https://www.producthunt.com/products/langfuse"],
  ["/issue", "https://github.com/langfuse/langfuse/issues/new/choose"],
  ["/new-issue", "https://github.com/langfuse/langfuse/issues/new/choose"],
  ["/issues", "https://github.com/langfuse/langfuse/issues"],
  ["/stickers", "https://forms.gle/Af5BHpWUMZSCT4kg8?_imcp=1"],
  ["/sticker", "https://forms.gle/Af5BHpWUMZSCT4kg8?_imcp=1"],
  ["/ask-ai", "/docs/ask-ai"],
  ["/docs/sso", "/self-hosting/authentication-and-sso"],
  ["/billing-portal", "https://billing.stripe.com/p/login/6oE9BXd4u8PR2aYaEE"],
  ["/docs/data-security-privacy", "/security"],
  ["/baa", "/security/hipaa"],
  ["/idea", "https://github.com/orgs/langfuse/discussions/new?category=ideas"],
  [
    "/new-idea",
    "https://github.com/orgs/langfuse/discussions/new?category=ideas",
  ],
  ["/ideas", "https://github.com/orgs/langfuse/discussions/categories/ideas"],
  [
    "/gh-support",
    "https://github.com/orgs/langfuse/discussions/categories/support",
  ],
  ["/discussions", "https://github.com/orgs/langfuse/discussions"],
  ["/gh-discussions", "https://github.com/orgs/langfuse/discussions"],
  ["/docs/analytics", "/docs/analytics/overview"],
  ["/request-trial", "https://forms.gle/cXZuQZLmzJp8yd9k7"],
  ["/request-security-docs", "https://forms.gle/o5JE7vWtX7Qk2syc8"],
  ["/events", "https://lu.ma/langfuse"],
  ["/public-metrics-dashboard", "/why#public-metrics"],
  ["/join-us", "/careers"],
  ["/story", "/handbook/chapters/story"],
  ["/mission", "/handbook/chapters/mission"],

  // Redirect to overview pages
  ...[
    "/docs/integrations",
    "/docs/scores",
    "/docs/datasets",
    "/docs/security",
    "/docs/observability",
    "/docs/evaluation",
    "/docs/metrics",
    "/docs/api-and-data-platform",
    "/docs/prompt-management",
  ].map((path) => [path, path + "/overview"]),

  // OLD docs redirects

  ["/docs/admin-api", "/docs/api#org-scoped-routes"],
  ["/docs/reference", "https://api.reference.langfuse.com/"],
  ["/docs/integrations/api", "/docs/api"],
  ["/docs/integrations/sdk/typescript", "/docs/sdk/typescript"],
  ["/docs/integrations/sdk/python", "/docs/observability/sdk/overview"],
  ["/docs/langchain", "/docs/integrations/langchain/tracing"],
  ["/docs/langchain/python", "/docs/integrations/langchain/tracing"],
  ["/docs/langchain/typescript", "/docs/integrations/langchain/tracing"],
  ["/docs/integrations/vercel", "/docs/integrations/vercel-ai-sdk"],
  ["/docs/integrations/langchain", "/docs/integrations/langchain/tracing"],
  [
    "/docs/integrations/langchain/python",
    "/docs/integrations/langchain/tracing",
  ],
  [
    "/docs/integrations/langchain/typescript",
    "/docs/integrations/langchain/tracing",
  ],
  [
    "/docs/integrations/langchain/overview",
    "/docs/integrations/langchain/tracing",
  ],
  [
    "/docs/integrations/langchain/get-started",
    "/docs/integrations/langchain/tracing",
  ],
  [
    "/docs/integrations/llama-index",
    "/docs/integrations/llama-index/get-started",
  ],
  [
    "/docs/integrations/llama-index/overview",
    "/docs/integrations/llama-index/get-started",
  ],
  [
    "/docs/integrations/llama-index/cookbook",
    "/docs/integrations/llama-index/get-started",
  ],
  [
    "/docs/integrations/llama-index/example-python",
    "/docs/integrations/llama-index/get-started",
  ],
  ["/docs/integrations/haystack", "/docs/integrations/haystack/get-started"],
  [
    "/docs/integrations/openai/get-started",
    "/docs/integrations/openai/python/get-started",
  ],
  [
    "/docs/integrations/openai/examples",
    "/docs/integrations/openai/python/examples",
  ],
  [
    "/docs/integrations/openai/track-errors",
    "/docs/integrations/openai/python/track-errors",
  ],
  [
    "/docs/integrations/openai/python",
    "/docs/integrations/openai/python/get-started",
  ],
  ["/docs/integrations/openai/js", "/docs/integrations/openai/js/get-started"],
  ["/docs/integrations/mirascope", "/docs/integrations/mirascope/tracing"],
  ["/docs/integrations/aws-bedrock", "/docs/integrations/amazon-bedrock"],
  ["/docs/opentelemetry/example-pydantic-ai", "/docs/integrations/pydantic-ai"],
  ["/docs/opentelemetry", "/docs/opentelemetry/get-started"],
  ["/docs/integrations/other/vapi", "/docs/integrations/vapi"],
  ["/docs/integrations/other/autogen", "/docs/integrations/autogen"],
  ["/docs/flowise", "/docs/integrations/flowise"],
  ["/docs/litellm", "/docs/integrations/litellm/tracing"],
  ["/docs/integrations/opentelemetry", "/integrations/native/opentelemetry"],
  ["/docs/integrations/litellm", "/docs/integrations/litellm/tracing"],
  ["/docs/langflow", "/docs/integrations/langflow"],
  ["/docs/local", "/docs/deployment/local"],
  ["/docs/self-host", "/docs/deployment/self-host"],
  ["/docs/cloud", "/docs/deployment/cloud"],
  ["/docs/guides/sdk-integration", "/docs/sdk/overview"],
  ["/docs/sdk", "/docs/sdk/overview"],
  ["/docs/sdk/python", "/docs/observability/sdk/overview"],
  ["/cookbook", "/guides"],
  ["/cookbook/:path*", "/guides/cookbook/:path*"],
  ["/docs/sdk/typescript", "/docs/sdk/typescript/guide"],
  ["/docs/sdk/typescript-web", "/docs/sdk/typescript/guide-web"],
  ["/docs/scores/evals", "/docs/scores/model-based-evals"],
  ["/docs/scores/manually", "/docs/scores/annotation"],
  ["/docs/scores/model-based-evals/overview", "/docs/scores/model-based-evals"],
  [
    "/docs/scores/model-based-evals/ragas",
    "/cookbook/evaluation_of_rag_with_ragas",
  ],
  [
    "/docs/scores/model-based-evals/langchain",
    "/cookbook/evaluation_with_langchain",
  ],
  ["/docs/scores/getting-started", "/docs/scores/overview"],
  ["/experimentation", "/docs/datasets/overview"],
  ["/docs/experimentation", "/docs/datasets/overview"],
  ["/docs/token-usage", "/docs/model-usage-and-cost"],
  ["/docs/debugging-ui", "/docs/tracing"],
  ["/observability", "/docs/tracing"],
  ["/docs/openai", "/docs/integrations/openai/get-started"],
  ["/docs/integrations/openai", "/docs/integrations/openai/get-started"],
  ["/docs/qa-chatbot", "/docs/demo"],
  ["/docs/user-explorer", "/docs/tracing-features/users"],
  ["/docs/sessions", "/docs/tracing-features/sessions"],
  ["/docs/deployment/cloud", "/security"],
  ["/docs/schedule-demo", "/talk-to-us"],
  ["/schedule-demo", "/talk-to-us"],
  ["/docs/project-sharing", "/docs/rbac"],
  ["/docs/prompts", "/docs/prompts/get-started"],
  ["/changelog/2024-03-03-posthog-integration", "/docs/analytics/posthog"],
  ["/guides/videos/2-min", "/guides/videos/introducing-langfuse-2.0"],
  ["/tos", "/terms"],
  ["/docs/export-and-fine-tuning", "/docs/query-traces"],
  [
    "/changelog/2024-09-04-headless-initialization-or-self-hosted-deployments",
    "/changelog/2024-09-04-headless-initialization-of-self-hosted-deployments",
  ],
  ["/docs/deployment/v3", "/docs/deployment/v3/overview"],
  [
    "/docs/integrations/openai-agents",
    "/docs/integrations/openaiagentssdk/openai-agents",
  ],
  [
    "/docs/integrations/amazon-bedrock",
    "/docs/integrations/bedrock/amazon-bedrock",
  ],
  ["/docs/open-source", "/open-source"],
  ["/faq/all/cloud-data-regions", "/security/data-regions"],
  ["/self-hosting/local", "/self-hosting/docker-compose"],
  ["/self-hosting/docker", "/self-hosting/kubernetes-helm"],
  ["/docs/analytics/posthog", "/docs/analytics/integrations/posthog"],
  ["/docs/analytics/integrations", "/docs/analytics/integrations/posthog"],
  [
    "/docs/analytics/daily-metrics-api",
    "/docs/analytics/metrics-api#daily-metrics",
  ],
  [
    "/docs/opentelemetry/example-opentelemetry-collector",
    "/docs/opentelemetry/get-started#export-from-opentelemetry-collector",
  ],
  [
    "/docs/sdk/python/decorators",
    "/docs/observability/sdk/instrumentation#custom-instrumentation",
  ],
];

/**
 * Begin of permanent redirects
 *
 * ⚠️ Permanent redirects can only be added, they cannot be removed.
 *
 * Please add a new const list for every addition to the permanent redirects.
 */

// new self-hosting section
const selfHostFolders202508 = [
  [
    "/self-hosting/automated-access-provisioning",
    "/self-hosting/administration/automated-access-provisioning",
  ],
  [
    "/self-hosting/headless-initialization",
    "/self-hosting/administration/headless-initialization",
  ],
  [
    "/self-hosting/organization-creators",
    "/self-hosting/administration/organization-creators",
  ],
  [
    "/self-hosting/organization-management-api",
    "/self-hosting/administration/organization-management-api",
  ],
  [
    "/self-hosting/ui-customization",
    "/self-hosting/administration/ui-customization",
  ],
  ["/self-hosting/backups", "/self-hosting/configuration/backups"],
  ["/self-hosting/caching-features", "/self-hosting/configuration/caching"],
  [
    "/self-hosting/custom-base-path",
    "/self-hosting/configuration/custom-base-path",
  ],
  ["/self-hosting/encryption", "/self-hosting/configuration/encryption"],
  [
    "/self-hosting/health-readiness-endpoints",
    "/self-hosting/configuration/health-readiness-endpoints",
  ],
  ["/self-hosting/observability", "/self-hosting/configuration/observability"],
  ["/self-hosting/scaling", "/self-hosting/configuration/scaling"],
  [
    "/self-hosting/transactional-emails",
    "/self-hosting/configuration/transactional-emails",
  ],
  ["/self-hosting/aws", "/self-hosting/deployment/aws"],
  ["/self-hosting/azure", "/self-hosting/deployment/azure"],
  ["/self-hosting/docker-compose", "/self-hosting/deployment/docker-compose"],
  ["/self-hosting/gcp", "/self-hosting/deployment/gcp"],
  [
    "/self-hosting/infrastructure/blobstorage",
    "/self-hosting/deployment/infrastructure/blobstorage",
  ],
  [
    "/self-hosting/infrastructure/cache",
    "/self-hosting/deployment/infrastructure/cache",
  ],
  [
    "/self-hosting/infrastructure/clickhouse",
    "/self-hosting/deployment/infrastructure/clickhouse",
  ],
  [
    "/self-hosting/infrastructure/containers",
    "/self-hosting/deployment/infrastructure/containers",
  ],
  [
    "/self-hosting/infrastructure/llm-api",
    "/self-hosting/deployment/infrastructure/llm-api",
  ],
  [
    "/self-hosting/infrastructure/postgres",
    "/self-hosting/deployment/infrastructure/postgres",
  ],
  ["/self-hosting/kubernetes-helm", "/self-hosting/deployment/kubernetes-helm"],
  ["/self-hosting/railway", "/self-hosting/deployment/railway"],
  [
    "/self-hosting/authentication-and-sso",
    "/self-hosting/security/authentication-and-sso",
  ],
  [
    "/self-hosting/deployment-strategies",
    "/self-hosting/security/deployment-strategies",
  ],
  ["/self-hosting/networking", "/self-hosting/security/networking"],
  ["/self-hosting/troubleshooting", "/self-hosting/troubleshooting-and-faq"],
  [
    "/self-hosting/background-migrations",
    "/self-hosting/upgrade/background-migrations",
  ],
  [
    "/self-hosting/upgrade-guides/upgrade-v1-to-v2",
    "/self-hosting/upgrade/upgrade-guides/upgrade-v1-to-v2",
  ],
  [
    "/self-hosting/upgrade-guides/upgrade-v2-to-v3",
    "/self-hosting/upgrade/upgrade-guides/upgrade-v2-to-v3",
  ],
  ["/self-hosting/versioning", "/self-hosting/upgrade/versioning"],
];

// new self-hosting section
const newSelfHostingSection = [
  ["/docs/self-hosting", "/self-hosting"],
  ["/docs/deployment/feature-overview", "/self-hosting/license-key"],
  ["/docs/deployment/local", "/self-hosting/local"],
  ["/docs/deployment/self-host", "/self-hosting"],
  ["/docs/deployment/v3/overview", "/self-hosting"],
  [
    "/docs/deployment/v3/migrate-v2-to-v3",
    "/self-hosting/upgrade-guides/upgrade-v2-to-v3",
  ],
  ["/docs/deployment/v3/troubleshooting", "/self-hosting/troubleshooting"],
  ["/docs/deployment/v3/guides/docker-compose", "/self-hosting/docker-compose"],
  [
    "/docs/deployment/v3/guides/kubernetes-helm",
    "/self-hosting/kubernetes-helm",
  ],
  [
    "/docs/deployment/v3/components/clickhouse",
    "/self-hosting/infrastructure/clickhouse",
  ],
  [
    "/docs/deployment/v3/components/redis",
    "/self-hosting/infrastructure/cache",
  ],
  [
    "/docs/deployment/v3/components/blobstorage",
    "/self-hosting/infrastructure/blobstorage",
  ],
];

// Reorder Tracing section
const reorderTracingSection = [
  ["/docs/tracing/overview", "/docs/tracing"],
  ["/docs/tracing-features", "/docs/tracing"],
  ...["sessions", "users", "tags", "url"].map((path) => [
    `/docs/tracing/${path}`,
    `/docs/tracing-features/${path}`,
  ]),

  ["/superagent", "/docs/integrations/superagent"],
  [
    "/guides/cookbook/langfuse_prompt_with_langchain",
    "/guides/cookbook/prompt_management_langchain",
  ],
];

// START OF MOVED INTEGRATION SECTION
const integrationsSection202507 = [
  // Analytics integrations
  ["/docs/analytics/integrations/coval", "/integrations/analytics/coval"],
  ["/docs/analytics/integrations/posthog", "/integrations/analytics/posthog"],
  ["/docs/analytics/integrations/trubrics", "/integrations/analytics/trubrics"],

  // Framework integrations - redirect to integration pages where they exist
  ["/docs/integrations/autogen", "/integrations/frameworks/autogen"],
  ["/docs/integrations/crewai", "/integrations/frameworks/crewai"],
  ["/docs/integrations/dspy", "/integrations/frameworks/dspy"],
  ["/docs/integrations/instructor", "/integrations/frameworks/instructor"],
  [
    "/docs/integrations/langchain/tracing",
    "/integrations/frameworks/langchain",
  ],
  [
    "/docs/integrations/langchain/upgrade-paths",
    "/integrations/frameworks/langchain",
  ],
  [
    "/docs/integrations/langchain/example-python-langserve",
    "/integrations/frameworks/langserve",
  ],
  ["/docs/integrations/mastra", "/integrations/frameworks/mastra"],
  [
    "/docs/integrations/mirascope/tracing",
    "/integrations/frameworks/mirascope",
  ],
  ["/docs/integrations/pipecat", "/integrations/frameworks/pipecat"],
  ["/docs/integrations/pydantic-ai", "/integrations/frameworks/pydantic-ai"],
  [
    "/docs/integrations/quarkus-langchain4j",
    "/integrations/frameworks/quarkus-langchain4j",
  ],
  [
    "/docs/integrations/semantic-kernel",
    "/integrations/frameworks/semantic-kernel",
  ],
  ["/docs/integrations/smolagents", "/integrations/frameworks/smolagents"],
  ["/docs/integrations/spring-ai", "/integrations/frameworks/spring-ai"],
  [
    "/docs/integrations/strands-agents",
    "/integrations/frameworks/strands-agents",
  ],
  [
    "/docs/integrations/vercel-ai-sdk",
    "/integrations/frameworks/vercel-ai-sdk",
  ],
  ["/docs/integrations/voltagent", "/integrations/frameworks/voltagent"],
  [
    "/docs/integrations/haystack/get-started",
    "/integrations/frameworks/haystack",
  ],
  ["/docs/integrations/google-adk", "/integrations/frameworks/google-adk"],
  [
    "/docs/integrations/other/agno-agents",
    "/integrations/frameworks/agno-agents",
  ],
  ["/docs/integrations/other/ragas", "/integrations/frameworks/ragas"],
  [
    "/docs/integrations/llama-index/get-started",
    "/integrations/frameworks/llamaindex",
  ],
  [
    "/docs/integrations/llama-index/workflows",
    "/integrations/frameworks/llamaindex-workflows",
  ],
  [
    "/docs/integrations/openaiagentssdk/openai-agents",
    "/integrations/frameworks/openai-agents",
  ],

  // Model provider integrations - redirect to integration pages where they exist
  [
    "/docs/integrations/bedrock/amazon-bedrock",
    "/integrations/model-providers/amazon-bedrock",
  ],
  [
    "/docs/integrations/bedrock/example-bedrock-agents",
    "/integrations/model-providers/amazon-bedrock-agents",
  ],
  ["/docs/integrations/deepseek", "/integrations/model-providers/deepseek"],
  [
    "/docs/integrations/google-vertex-ai",
    "/integrations/model-providers/google-vertex-ai",
  ],
  ["/docs/integrations/groq-sdk", "/integrations/model-providers/groq"],
  [
    "/docs/integrations/huggingface",
    "/integrations/model-providers/huggingface",
  ],
  [
    "/docs/integrations/mistral-sdk",
    "/integrations/model-providers/mistral-sdk",
  ],
  ["/docs/integrations/ollama", "/integrations/model-providers/ollama"],
  [
    "/docs/integrations/openai/js/get-started",
    "/integrations/model-providers/openai-js",
  ],
  [
    "/docs/integrations/openai/python/assistants-api",
    "/integrations/model-providers/openai-assistants-api",
  ],
  [
    "/docs/integrations/openai/python/get-started",
    "/integrations/model-providers/openai-py",
  ],
  [
    "/docs/integrations/openai/python/track-errors",
    "/integrations/model-providers/openai-py",
  ],
  [
    "/docs/integrations/databricks/overview",
    "/integrations/model-providers/databricks",
  ],
  [
    "/docs/integrations/databricks/use-with-playground-and-evals",
    "/integrations/model-providers/databricks",
  ],
  [
    "/docs/integrations/other/cleanlab",
    "/integrations/model-providers/cleanlab",
  ],
  ["/docs/integrations/other/cohere", "/integrations/model-providers/cohere"],
  [
    "/docs/integrations/other/fireworks-ai",
    "/integrations/model-providers/fireworks-ai",
  ],
  [
    "/docs/integrations/other/novitaai",
    "/integrations/model-providers/novitaai",
  ],
  [
    "/docs/integrations/other/togetherai",
    "/integrations/model-providers/togetherai",
  ],
  ["/docs/integrations/other/xai", "/integrations/model-providers/xai-grok"],
  [
    "/guides/cookbook/integration_google_vertex_and_gemini",
    "/integrations/model-providers/google-vertex-ai",
  ],

  // Gateway integrations - redirect to integration pages where they exist
  ["/docs/integrations/litellm/tracing", "/integrations/gateways/litellm"],
  ["/docs/integrations/portkey", "/integrations/gateways/portkey"],
  ["/docs/integrations/other/openrouter", "/integrations/gateways/openrouter"],
  [
    "/docs/integrations/other/truefoundry",
    "/integrations/gateways/truefoundry",
  ],
  [
    "/docs/integrations/other/vercel-ai-gateway",
    "/integrations/gateways/vercel-ai-gateway",
  ],

  // No-code integrations - redirect to integration pages where they exist
  ["/docs/integrations/dify", "/integrations/no-code/dify"],
  ["/docs/integrations/flowise", "/integrations/no-code/flowise"],
  ["/docs/integrations/goose", "/integrations/no-code/goose"],
  ["/docs/integrations/langflow", "/integrations/no-code/langflow"],
  ["/docs/integrations/lobechat", "/integrations/no-code/lobechat"],
  ["/docs/integrations/openwebui", "/integrations/no-code/openwebui"],
  ["/docs/integrations/ragflow", "/integrations/no-code/ragflow"],
  ["/docs/integrations/vapi", "/integrations/no-code/vapi"],

  // Other integrations - redirect to integration pages where they exist
  ["/docs/integrations/other/firecrawl", "/integrations/other/firecrawl"],
  ["/docs/integrations/other/gradio", "/integrations/other/gradio"],
  ["/docs/integrations/other/inferable", "/integrations/other/inferable"],
  ["/docs/integrations/other/milvus", "/integrations/other/milvus"],
  ["/docs/integrations/promptfoo", "/integrations/other/promptfoo"],

  // Overview page
  ["/docs/integrations/overview", "/integrations"],

  // Redirect missing integration examples to cookbook pages
  // These don't have integration pages but are available as cookbooks
  [
    "/docs/integrations/langchain/example-python",
    "/guides/cookbook/integration_langchain",
  ],
  [
    "/docs/integrations/langchain/example-python-langgraph",
    "/guides/cookbook/integration_langgraph",
  ],
  [
    "/docs/integrations/langchain/example-javascript",
    "/guides/cookbook/js_integration_langchain",
  ],
  [
    "/docs/integrations/langchain/example-langgraph-agents",
    "/guides/cookbook/example_langgraph_agents",
  ],
  [
    "/docs/integrations/openai/python/examples",
    "/guides/cookbook/integration_openai_sdk",
  ],
  [
    "/docs/integrations/openai/python/structured-outputs",
    "/guides/cookbook/integration_openai_structured_output",
  ],
  [
    "/docs/integrations/openai/js/examples",
    "/guides/cookbook/js_integration_openai",
  ],
  [
    "/docs/integrations/llama-index/deprecated/example-python",
    "/guides/cookbook/integration_llama-index-callback",
  ],
  [
    "/docs/integrations/llama-index/deprecated/example-python-instrumentation-module",
    "/guides/cookbook/integration_llama-index_instrumentation",
  ],
  [
    "/docs/integrations/haystack/example-python",
    "/guides/cookbook/integration_haystack",
  ],
  [
    "/docs/integrations/litellm/example-proxy-python",
    "/guides/cookbook/integration_litellm_proxy",
  ],
  [
    "/docs/integrations/litellm/example-proxy-js",
    "/guides/cookbook/js_integration_litellm_proxy",
  ],
  [
    "/docs/integrations/mirascope/example-python",
    "/guides/cookbook/integration_mirascope",
  ],
  [
    "/docs/integrations/databricks/example-python",
    "/guides/cookbook/integration_databricks",
  ],
  [
    "/docs/integrations/openaiagentssdk/example-evaluating-openai-agents",
    "/guides/cookbook/example_evaluating_openai_agents",
  ],
];

// START MOVE OF MAIN DOCS INTO SUBMODULES
const mainDocsReorder202507 = [
  [
    "/docs/analytics/custom-dashboards",
    "/docs/metrics/features/custom-dashboards",
  ],
  [
    "/docs/analytics/example-intent-classification",
    "/guides/cookbook/example_intent_classification_pipeline",
  ],
  ["/docs/analytics/metrics-api", "/docs/metrics/features/metrics-api"],
  ["/docs/analytics/overview", "/docs/metrics/overview"],
  ["/docs/api", "/docs/api-and-data-platform/features/public-api"],
  ["/docs/audit-logs", "/docs/administration/audit-logs"],
  ["/docs/core-features", "/docs"],
  ["/docs/data-deletion", "/docs/administration/data-deletion"],
  ["/docs/data-retention", "/docs/administration/data-retention"],
  [
    "/docs/datasets/example-synthetic-datasets",
    "/guides/cookbook/example_synthetic_datasets",
  ],
  ["/docs/datasets/get-started", "/docs/evaluation/dataset-runs/datasets"],
  ["/docs/datasets/overview", "/docs/evaluation/dataset-runs/datasets"],
  [
    "/docs/datasets/prompt-experiments",
    "/docs/evaluation/dataset-runs/native-run",
  ],
  [
    "/docs/datasets/python-cookbook",
    "/docs/evaluation/dataset-runs/remote-run",
  ],
  ["/docs/fine-tuning", "/docs/api-and-data-platform/features/export-from-ui"],
  [
    "/docs/api-and-data-platform/features/fine-tuning",
    "/docs/api-and-data-platform/features/export-from-ui",
  ],
  ["/docs/get-started", "/docs/observability/get-started"],
  [
    "/docs/model-usage-and-cost",
    "/docs/observability/features/token-and-cost-tracking",
  ],
  [
    "/docs/opentelemetry/example-arize",
    "/guides/cookbook/otel_integration_arize",
  ],
  [
    "/docs/opentelemetry/example-mlflow",
    "/guides/cookbook/otel_integration_mlflow",
  ],
  [
    "/docs/opentelemetry/example-openlit",
    "/guides/cookbook/otel_integration_openlit",
  ],
  [
    "/docs/opentelemetry/example-openllmetry",
    "/guides/cookbook/otel_integration_openllmetry",
  ],
  [
    "/docs/opentelemetry/example-python-sdk",
    "/guides/cookbook/otel_integration_python_sdk",
  ],
  ["/docs/opentelemetry/get-started", "/integrations/native/opentelemetry"],
  ["/docs/playground", "/docs/prompt-management/features/playground"],
  ["/docs/prompts/a-b-testing", "/docs/prompt-management/features/a-b-testing"],
  [
    "/docs/prompts/example-langchain",
    "/guides/cookbook/prompt_management_langchain",
  ],
  [
    "/docs/prompts/example-langchain-js",
    "/guides/cookbook/js_prompt_management_langchain",
  ],
  [
    "/docs/prompts/example-openai-functions",
    "/guides/cookbook/prompt_management_openai_functions",
  ],
  ["/docs/prompts/get-started", "/docs/prompt-management/get-started"],
  [
    "/docs/prompts/github-actions-webhook",
    "/docs/prompt-management/features/github-integration",
  ],
  [
    "/docs/prompts/github-webhook-sync",
    "/docs/prompt-management/features/github-integration",
  ],
  [
    "/docs/prompt-management/features/github-actions-webhook",
    "/docs/prompt-management/features/github-integration",
  ],
  [
    "/docs/prompt-management/features/github-webhook-sync",
    "/docs/prompt-management/features/github-integration",
  ],
  ["/docs/prompts/mcp-server", "/docs/prompt-management/features/mcp-server"],
  ["/docs/prompts/n8n-node", "/docs/prompt-management/features/n8n-node"],
  ["/docs/query-traces", "/docs/api-and-data-platform/features/query-via-sdk"],
  ["/docs/rbac", "/docs/administration/rbac"],
  ["/docs/scores/annotation", "/docs/evaluation/evaluation-methods/scores-via-ui"],
  ["/docs/scores/custom", "/docs/evaluation/evaluation-methods/scores-via-sdk"],
  ["/docs/scores/data-model", "/docs/evaluation/evaluation-methods/overview"],
  [
    "/docs/scores/external-evaluation-pipelines",
    "/guides/cookbook/example_external_evaluation_pipelines",
  ],
  [
    "/docs/scores/model-based-evals",
    "/docs/evaluation/evaluation-methods/llm-as-a-judge",
  ],
  ["/docs/scores/overview", "/docs/evaluation/overview"],
  ["/docs/scores/user-feedback", "/faq/all/user-feedback"],
  [
    "/docs/evaluation/features/evaluation-methods/custom",
    "/docs/evaluation/evaluation-methods/scores-via-sdk",
  ],
  [
    "/docs/evaluation/features/experiment-comparison",
    "/docs/evaluation/dataset-runs/datasets",
  ],
  ["/docs/sdk/overview", "/docs/observability/sdk/overview"],
  ["/docs/sdk/python/example", "/docs/observability/sdk/overview"],
  ["/docs/sdk/python/low-level-sdk", "/docs/observability/sdk/overview"],
  ["/docs/sdk/python/sdk-v3", "/docs/observability/sdk/overview"],
  [
    "/docs/sdk/typescript/example-notebook",
    "/guides/cookbook/js_langfuse_sdk",
  ],
  ["/docs/sdk/typescript/guide", "/docs/observability/sdk/overview"],
  [
    "/docs/sdk/typescript/guide-web",
    "/docs/observability/sdk/advanced-features#custom-scores-from-browser",
  ],
  [
    "/docs/security/example-python",
    "/guides/cookbook/example_llm_security_monitoring",
  ],
  ["/docs/security/getting-started", "/docs/security-and-guardrails"],
  ["/docs/security/overview", "/docs/security-and-guardrails"],
  ["/docs/tracing", "/docs/observability/overview"],
  ["/docs/tracing-data-model", "/docs/observability/data-model"],
  [
    "/docs/tracing-features/agent-graphs",
    "/docs/observability/features/agent-graphs",
  ],
  ["/docs/tracing-features/comments", "/docs/observability/features/comments"],
  [
    "/docs/tracing-features/environments",
    "/docs/observability/features/environments",
  ],
  [
    "/docs/tracing-features/log-levels",
    "/docs/observability/features/log-levels",
  ],
  ["/docs/tracing-features/masking", "/docs/observability/features/masking"],
  ["/docs/tracing-features/metadata", "/docs/observability/features/metadata"],
  [
    "/docs/tracing-features/multi-modality",
    "/docs/observability/features/multi-modality",
  ],
  [
    "/docs/tracing-features/releases-and-versioning",
    "/docs/observability/features/releases-and-versioning",
  ],
  ["/docs/tracing-features/sampling", "/docs/observability/features/sampling"],
  ["/docs/tracing-features/sessions", "/docs/observability/features/sessions"],
  ["/docs/tracing-features/tags", "/docs/observability/features/tags"],
  [
    "/docs/tracing-features/trace-ids",
    "/docs/observability/features/trace-ids-and-distributed-tracing",
  ],
  ["/docs/tracing-features/url", "/docs/observability/features/url"],
  ["/docs/tracing-features/users", "/docs/observability/features/users"],
  [
    "/faq/all/api-authentication",
    "/docs/api-and-data-platform/features/public-api",
  ],
  [
    "/faq/all/compability-langfuse-ui-and-python-sdk",
    "/faq/all/compatibility-langfuse-ui-and-python-sdk",
  ],
  ["/faq/tag/setup", "/faq"],
  ["/faq/tag/features", "/faq"],
  [
    "/docs/evaluation/features/evaluation-methods/custom-scores",
    "/docs/evaluation/evaluation-methods/scores-via-sdk",
  ],
  [
    "/docs/evaluation/features/evaluation-methods/annotation",
    "/docs/evaluation/evaluation-methods/scores-via-ui",
  ],
  ["/docs/evaluation/get-started/offline", "/docs/evaluation/overview"],
  [
    "/docs/evaluation/features/datasets",
    "/docs/evaluation/dataset-runs/datasets",
  ],
  [
    "/docs/evaluation/features/synthetic-datasets",
    "/guides/cookbook/example_synthetic_datasets",
  ],
  [
    "/docs/datasets/dataset-runs/data-model",
    "/docs/evaluation/dataset-runs/data-model",
  ],
  ["/guides/cookbook/user-feedback", "/faq/all/user-feedback"],
  ["/guides/cookbook/security-and-guardrails", "/docs/security-and-guardrails"],
  [
    "/docs/evaluation/features/prompt-experiments",
    "/docs/evaluation/dataset-runs/native-run",
  ],
  ["/docs/evaluation/experiments/data-model", "/docs/evaluation/dataset-runs/data-model"],
  [
    "/guides/cookbook/integration_mirascope",
    "/integrations/frameworks/mirascope",
  ],
  [
    "/guides/cookbook/integration_mistral_sdk",
    "/integrations/model-providers/mistral-sdk",
  ],
  [
    "/docs/evaluation/features/evaluation-methods/external-evaluation-pipelines",
    "/guides/cookbook/example_external_evaluation_pipelines",
  ],
  [
    "/docs/evaluation/features/evaluation-methods/llm-as-a-judge",
    "/docs/evaluation/evaluation-methods/llm-as-a-judge",
  ],
  [
    "/docs/evaluation/features/evaluation-methods/user-feedback",
    "/faq/all/user-feedback",
  ],
  [
    "/docs/evaluation/features/security-and-guardrails",
    "/docs/security-and-guardrails",
  ],
  ["/docs/evaluation/get-started/online", "/docs/observability/overview"],
  ["/faq/all/llm-connection", "/docs/administration/llm-connection"],
  ["/faq/all/user-feedback", "/docs/observability/features/user-feedback"]
];

// Redirect old webhooks path to new webhooks/slack integrations path
const oldWebhooksSection202508 = [
  [
    "/docs/prompt-management/features/webhooks",
    "/docs/prompt-management/features/webhooks-slack-integrations",
  ],
];

// Redirect renamed dataset run pages
const oldDatasetRunSection202508 = [
  [
    "/docs/evaluation/dataset-runs/run-via-ui",
    "/docs/evaluation/dataset-runs/native-run",
  ],
  [
    "/docs/evaluation/dataset-runs/run-via-sdk",
    "/docs/evaluation/dataset-runs/remote-run",
  ],
];

// Redirect removing Python SDK v2 docs and splitting up Python SDK v3 docs
const pythonv3sdkSection202508 = [
  [
    "/docs/observability/sdk/python/sdk-v3",
    "/docs/observability/sdk/overview",
  ],
  [
    "/docs/observability/sdk/python/decorators",
    "/docs/observability/sdk/instrumentation#custom-instrumentation",
  ],
  [
    "/docs/observability/sdk/python/example",
    "/docs/observability/sdk/overview",
  ],
  [
    "/docs/observability/sdk/python/low-level-sdk",
    "/docs/observability/sdk/overview",
  ],
  [
    "/guides/cookbook/python_decorators#interoperability-with-other-integrations",
    "/docs/observability/sdk/instrumentation#native-instrumentation",
  ],
  [
    "/guides/cookbook/python_decorators#customize-inputoutput",
    "/docs/observability/sdk/instrumentation#trace-inputoutput-behavior",
  ],
];

// Redirect TypeScript SDK v3 docs to new docs
const typescriptsdkSection202508 = [
  [
    "/docs/observability/sdk/typescript/guide",
    "/docs/observability/sdk/overview",
  ],
  [
    "/docs/observability/sdk/typescript/guide-web",
    "/docs/observability/sdk/advanced-features#custom-scores-from-browser",
  ],
  [
    "/docs/observability/sdk/typescript/example-notebook",
    "/guides/cookbook/js_langfuse_sdk",
  ],
  [
    "/guides/cookbook/js_integration_llamaindex",
    "/guides/cookbook/js_langfuse_sdk",
  ],
  [
    "/docs/observability/sdk/typescript/evaluation",
    "/docs/observability/sdk/advanced-features#create-scores",
  ],
  [
    "/guides/cookbook/integration_haystack",
    "/integrations/frameworks/haystack",
  ],
  ["/sdk-v3", "/docs/observability/sdk/overview"],
  [
    "/docs/observability/sdk/typescript/sdk-v4",
    "/docs/observability/sdk/overview",
  ],
];

// API redirects - September 2025
const apiRedirects202509 = [
  [
    "/api-and-data-platform/features/public-api",
    "/docs/api-and-data-platform/features/public-api",
  ],
];

const experimentsRedirects202509 = [
  [
    "/docs/evaluation/dataset-runs/datasets",
    "/docs/evaluation/experiments/datasets",
  ],
  [
    "/docs/evaluation/dataset-runs/native-run",
    "/docs/evaluation/experiments/experiments-via-ui",
  ],
  [
    "/docs/evaluation/dataset-runs/remote-run",
    "/docs/evaluation/experiments/experiments-via-sdk",
  ],
  [
    "/docs/evaluation/dataset-runs/data-model",
    "/docs/evaluation/experiments/data-model",
  ],
];

const handbookRedirects202509 = [
  ["/why", "/handbook/chapters/why"],
  ["/open-source", "/handbook/chapters/open-source"]
];

// Redirect usage alerts to spend alerts - October 2025
const spendAlertsRedirects202510 = [
  ["/docs/administration/usage-alerts", "/docs/administration/spend-alerts"],
  ["/changelog/2025-07-30-usage-alerts", "/changelog/2025-10-10-spend-alerts"],
];

// Handbook restructure - October 2025
const handbookRestructure202510 = [
  // GTM pages moved to sales-and-cs and support
  ["/handbook/gtm/customer-success", "/handbook/sales-and-cs/customer-success"],
  ["/handbook/gtm/overview", "/handbook/sales-and-cs/overview"],
  ["/handbook/gtm/sales", "/handbook/sales-and-cs/sales"],
  ["/handbook/gtm/support", "/handbook/support/support"],

  // Working at Langfuse pages moved to various sections
  ["/handbook/working-at-langfuse/how-we-work/analytics", "/handbook/product-engineering/analytics"],
  ["/handbook/working-at-langfuse/how-we-work/culture", "/handbook/how-we-work/principles"],
  ["/handbook/working-at-langfuse/how-we-work/meetings", "/handbook/how-we-work/meetings"],
  ["/handbook/working-at-langfuse/how-we-work/ownership", "/handbook/how-we-work/ownership"],
  ["/handbook/working-at-langfuse/how-we-work/personal-productivity", "/handbook/how-we-work/productivity-and-ai"],
  ["/handbook/working-at-langfuse/how-we-work/use-ai", "/handbook/how-we-work/productivity-and-ai"],
  ["/handbook/working-at-langfuse/how-we-work/using-linear", "/handbook/tools-and-processes/using-linear"],
  ["/handbook/working-at-langfuse/how-we-work/using-plain", "/handbook/support/using-plain"],
  ["/handbook/working-at-langfuse/how-we-work/using-slack", "/handbook/tools-and-processes/using-slack"],
  ["/handbook/working-at-langfuse/principles", "/handbook/how-we-work/principles"],
  ["/handbook/working-at-langfuse/spending-money", "/handbook/tools-and-processes/spending-money"],
  ["/handbook/working-at-langfuse/time-off", "/handbook/tools-and-processes/time-off"],
  ["/docs/sdk/python/sdk-v3#multi-project-setup-experimental", "/docs/observability/sdk/advanced-features#multi-project-setup-experimental"],
];

// Launch Week 4 - Nov 2025
const launchWeek4202511 = [
  ["/changelog/2025-10-10-advanced-filtering-public-traces-api", "/changelog/2025-11-03-advanced-filtering-traces-and-observations-api"],
  ["/changelog/2025-10-29-comment-mentions-and-reactions", "/changelog/2025-11-04-comment-mentions-and-reactions"],
];

// Product Engineering handbook restructure - Nov 2025
const productEngineeringRestructure202511 = [
  ["/handbook/product-engineering/roadmapping", "/handbook/product-engineering/how-we-work/roadmapping"],
  ["/handbook/product-engineering/product-ops", "/handbook/product-engineering/how-we-work/product-ops"],
  ["/handbook/product-engineering/documentation", "/handbook/product-engineering/playbooks/documentation"],
  ["/handbook/product-engineering/releases", "/handbook/product-engineering/playbooks/releases"],
  ["/handbook/how-we-hire", "/handbook/how-we-hire/hiring-process"],
  ["/handbook/engineering-super-day", "/handbook/how-we-hire/engineering-super-day"],
];

// Instance Management API redirects - Dec 2025
const instanceManagementApiRedirects202512 = [
  [
    "/self-hosting/administration/organization-management-api",
    "/self-hosting/administration/instance-management-api",
  ],
];

// Evaluation methods restructure - December 2025
const evaluationMethodsRestructure202512 = [
  // Renamed pages
  [
    "/docs/evaluation/evaluation-methods/annotation",
    "/docs/evaluation/evaluation-methods/scores-via-ui",
  ],
  [
    "/docs/evaluation/evaluation-methods/annotation#annotation-queues",
    "/docs/evaluation/evaluation-methods/annotation-queues",
  ],
  [
    "/docs/evaluation/evaluation-methods/custom-scores",
    "/docs/evaluation/evaluation-methods/scores-via-sdk",
  ],
  // Deleted data-model page - redirect to overview and FAQ
  [
    "/docs/evaluation/evaluation-methods/data-model",
    "/docs/evaluation/evaluation-methods/overview",
  ],
  [
    "/docs/evaluation/evaluation-methods/data-model#scores",
    "/docs/evaluation/evaluation-methods/overview",
  ],
  [
    "/docs/evaluation/evaluation-methods/data-model#score-config",
    "/faq/all/manage-score-configs",
  ],
];

const sdkReferenceRedirects202512 = [
  // Python SDK main pages
  ["/docs/observability/sdk/python", "/docs/observability/sdk/overview"],
  ["/docs/observability/sdk/python/overview", "/docs/observability/sdk/overview"],
  ["/docs/observability/sdk/python/setup", "/docs/observability/sdk/overview#setup"],
  ["/docs/observability/sdk/python/setup#initialize-client", "/docs/observability/sdk/overview#client-setup"],
  ["/docs/observability/sdk/python/instrumentation", "/docs/observability/sdk/instrumentation"],
  ["/docs/observability/sdk/python/instrumentation#custom-instrumentation", "/docs/observability/sdk/instrumentation#custom"],
  ["/docs/observability/sdk/python/instrumentation#propagate-attributes", "/docs/observability/sdk/instrumentation#add-attributes"],
  ["/docs/observability/sdk/python/instrumentation#propagating-trace-attributes", "/docs/observability/sdk/instrumentation#add-attributes"],
  ["/docs/observability/sdk/python/instrumentation#trace-inputoutput-behavior", "/docs/observability/sdk/instrumentation#trace-inputoutput-behavior"],
  ["/docs/observability/sdk/python/evaluation", "/docs/evaluation/evaluation-methods/scores-via-sdk"],
  ["/docs/observability/sdk/python/evaluation#create-scores", "/docs/evaluation/evaluation-methods/scores-via-sdk#ingesting-scores-via-apisdks"],
  ["/docs/observability/sdk/python/advanced-usage", "/docs/observability/sdk/advanced-features"],
  ["/docs/observability/sdk/python/advanced-usage#masking-sensitive-data", "/docs/observability/sdk/advanced-features#mask-sensitive-data"],
  ["/docs/observability/sdk/python/advanced-usage#logging", "/docs/observability/sdk/advanced-features#logging--debugging"],
  ["/docs/observability/sdk/python/advanced-usage#sampling", "/docs/observability/sdk/advanced-features#sampling"],
  ["/docs/observability/sdk/python/advanced-usage#filtering-by-instrumentation-scope", "/docs/observability/sdk/advanced-features#filtering-by-instrumentation-scope"],
  ["/docs/observability/sdk/python/advanced-usage#isolated-tracerprovider", "/docs/observability/sdk/advanced-features#isolated-tracerprovider"],
  ["/docs/observability/sdk/python/advanced-usage#multi-project-setup-experimental", "/docs/observability/sdk/advanced-features#multi-project-setup-experimental"],
  ["/docs/observability/sdk/python/advanced-usage#using-threadpoolexecutors", "/docs/observability/sdk/advanced-features#thread-pools-and-multiprocessing-python"],
  ["/docs/observability/sdk/python/advanced-usage#distributed-tracing", "/docs/observability/sdk/instrumentation#cross-service-propagation"],
  ["/docs/observability/sdk/python/upgrade-path", "/docs/observability/sdk/upgrade-path#python-sdk-v2--v3"],
  ["/docs/observability/sdk/python/troubleshooting-and-faq", "/docs/observability/sdk/troubleshooting-and-faq"],

  // TypeScript SDK main pages
  ["/docs/observability/sdk/typescript", "/docs/observability/sdk/overview"],
  ["/docs/observability/sdk/typescript/overview", "/docs/observability/sdk/overview"],
  ["/docs/observability/sdk/typescript/setup", "/docs/observability/sdk/overview#setup"],
  ["/docs/observability/sdk/typescript/setup#tracing-setup", "/docs/observability/sdk/overview#setup"],
  ["/docs/observability/sdk/typescript/setup#client-setup", "/docs/observability/sdk/overview#client-setup"],
  ["/docs/observability/sdk/typescript/instrumentation", "/docs/observability/sdk/instrumentation"],
  ["/docs/observability/sdk/typescript/instrumentation#native-instrumentation", "/docs/observability/sdk/instrumentation"],
  ["/docs/observability/sdk/typescript/instrumentation#custom-instrumentation", "/docs/observability/sdk/instrumentation#custom"],
  ["/docs/observability/sdk/typescript/instrumentation#context-management-with-callbacks", "/docs/observability/sdk/instrumentation#context-manager"],
  ["/docs/observability/sdk/typescript/instrumentation#observe-wrapper", "/docs/observability/sdk/instrumentation#observe-wrapper"],
  ["/docs/observability/sdk/typescript/instrumentation#manual-observations", "/docs/observability/sdk/instrumentation#manual-observations"],
  ["/docs/observability/sdk/typescript/instrumentation#propagate-attributes", "/docs/observability/sdk/instrumentation#add-attributes"],
  ["/docs/observability/sdk/typescript/instrumentation#framework-third-party-telemetry", "/docs/observability/sdk/instrumentation"],
  ["/docs/observability/sdk/typescript/advanced-usage", "/docs/observability/sdk/advanced-features"],
  ["/docs/observability/sdk/typescript/advanced-usage#masking", "/docs/observability/sdk/advanced-features#mask-sensitive-data"],
  ["/docs/observability/sdk/typescript/advanced-usage#filtering-spans", "/docs/observability/sdk/advanced-features#filtering-by-instrumentation-scope"],
  ["/docs/observability/sdk/typescript/advanced-usage#sampling", "/docs/observability/sdk/advanced-features#sampling"],
  ["/docs/observability/sdk/typescript/advanced-usage#managing-trace-and-observation-ids", "/docs/observability/sdk/instrumentation#trace-ids"],
  ["/docs/observability/sdk/typescript/advanced-usage#isolated-tracer-provider", "/docs/observability/sdk/advanced-features#isolated-tracerprovider"],
  ["/docs/observability/sdk/typescript/advanced-usage#serverless-environments", "/docs/observability/sdk/instrumentation#client-lifecycle--flushing"],
  ["/docs/observability/sdk/typescript/advanced-usage#multi-project-setup", "/docs/observability/sdk/advanced-features#multi-project-setup-experimental"],
  ["/docs/observability/sdk/typescript/upgrade-path", "/docs/observability/sdk/upgrade-path#jsts-sdk-v3--v4"],
  ["/docs/observability/sdk/typescript/troubleshooting-and-faq", "/docs/observability/sdk/troubleshooting-and-faq"],

  // Legacy SDK patterns (commonly linked)
  ["/docs/sdk/python/decorators", "/docs/observability/sdk/instrumentation#observe-wrapper"],
  ["/docs/sdk/typescript/guide", "/docs/observability/sdk/overview"],
  ["/docs/sdk/typescript/guide#score", "/docs/evaluation/evaluation-methods/scores-via-sdk#ingesting-scores-via-apisdks"],
];

// Data model moved under experiments (Jan 2026)
const dataModelExperimentsRedirects202601 = [
  ["/docs/evaluation/data-model", "/docs/evaluation/experiments/data-model"],
];

// Blog post rename - Jan 2026
const blogRedirects202601 = [
  ["/blog/announcing-acquisition", "/blog/joining-clickhouse"],
];

// Evaluation section restructure - Jan 2026 (PR #2425)
// - concepts.mdx renamed to core-concepts.mdx
// - evaluation-methods/overview.mdx and experiments/overview.mdx removed
// - bare paths and malformed URLs redirect to appropriate pages
const evaluationRestructure202601 = [
  ["/docs/evaluation/concepts", "/docs/evaluation/core-concepts"],
  [
    "/docs/evaluation/evaluation-methods/overview",
    "/docs/evaluation/evaluation-methods/llm-as-a-judge",
  ],
  [
    "/docs/evaluation/experiments/overview",
    "/docs/evaluation/experiments/datasets",
  ],
  // Bare section paths
  [
    "/docs/evaluation/evaluation-methods",
    "/docs/evaluation/evaluation-methods/llm-as-a-judge",
  ],
  ["/docs/evaluation/experiments", "/docs/evaluation/experiments/datasets"],
  // Malformed double-path URL (likely from broken internal link)
  [
    "/docs/evaluation/evaluation-methods/docs/evaluation/evaluation-methods/annotation-queues",
    "/docs/evaluation/evaluation-methods/annotation-queues",
  ],
  // Trailing period typo
  [
    "/docs/evaluation/evaluation-methods/llm-as-a-judge.",
    "/docs/evaluation/evaluation-methods/llm-as-a-judge",
  ],
];

const permanentRedirects = [
  ...selfHostFolders202508,
  ...newSelfHostingSection,
  ...reorderTracingSection,
  ...integrationsSection202507,
  ...mainDocsReorder202507,
  ...oldWebhooksSection202508,
  ...oldDatasetRunSection202508,
  ...pythonv3sdkSection202508,
  ...typescriptsdkSection202508,
  ...apiRedirects202509,
  ...experimentsRedirects202509,
  ...handbookRedirects202509,
  ...spendAlertsRedirects202510,
  ...handbookRestructure202510,
  ...launchWeek4202511,
  ...productEngineeringRestructure202511,
  ...instanceManagementApiRedirects202512,
  ...evaluationMethodsRestructure202512,
  ...sdkReferenceRedirects202512,
  ...dataModelExperimentsRedirects202601,
  ...blogRedirects202601,
  ...evaluationRestructure202601,
];

module.exports = { nonPermanentRedirects, permanentRedirects };
