import remarkGfm from 'remark-gfm';
import nextra from 'nextra';
import NextBundleAnalyzer from '@next/bundle-analyzer'

const withBundleAnalyzer = NextBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

/**
 * CSP headers
 * img-src https to allow loading images from SSO providers
 */
const cspHeader = process.env.NODE_ENV === 'production' ? `
  default-src 'self' https: wss:;
  script-src 'self' 'unsafe-eval' 'unsafe-inline' https:;
  style-src 'self' 'unsafe-inline' https:;
  img-src 'self' https: blob: data:;
  media-src 'self' https: blob: data:;
  font-src 'self' https:;
  frame-src 'self' https:;
  worker-src 'self' blob:;
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  upgrade-insecure-requests;
  block-all-mixed-content;
`: "";

// nextra config
const withNextra = nextra({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.tsx',
  mdxOptions: {
    remarkPlugins: [remarkGfm],
  },
  defaultShowCopyCode: true,
})

// next config
const nextraConfig = withNextra({
  experimental: {
    scrollRestoration: true,
  },
  transpilePackages: [
    'react-tweet',
    'react-syntax-highlighter',
    'geist'
  ],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'static.langfuse.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'github.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  headers() {
    const headers = [
      {
        source: "/:path*",
        headers: [
          {
            key: "x-frame-options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "autoplay=*, fullscreen=*, microphone=*",
          },
        ],
      },
      {
        source: "/:path((?!api).*)*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: cspHeader.replace(/\n/g, ""),
          },
        ],
      },
    ];

    // Do not index Vercel preview deployments
    if (process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview') {
      headers.push({
        source: '/:path*',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex',
          },
        ],
      });
    }

    return headers;
  },
  redirects: async () => [
    ...nonPermanentRedirects.map(([source, destination]) => ({
      source,
      destination,
      permanent: false,
    })),
    ...permanentRedirects.map(([source, destination]) => ({
      source,
      destination,
      permanent: false,
    })),
  ]
});

const nonPermanentRedirects = [
  ["/analytics", "https://docs.google.com/document/d/1PEFSqn-VWjNXOZZ1U7FC0oH-spDdkKJxLwgp15iK7zY"],
  ["/discord", "https://discord.gg/7NXusRtqYU"],
  ["/demo", "/docs/demo"],
  ["/video", "/watch-demo"],
  ["/docs/video", "/watch-demo"],
  ["/roadmap", "/docs/roadmap"],
  ["/ph", "https://www.producthunt.com/products/langfuse"],
  ["/loom-gpt4-PR", "https://www.loom.com/share/5c044ca77be44ff7821967834dd70cba"],
  ["/issue", "https://github.com/langfuse/langfuse/issues/new/choose"],
  ["/new-issue", "/issue"],
  ["/issues", "https://github.com/langfuse/langfuse/issues"],
  ["/stickers", "https://forms.gle/Af5BHpWUMZSCT4kg8?_imcp=1"],
  ["/sticker", "/stickers"],
  ["/ask-ai", "/docs/ask-ai"],

  // stripe
  ["/billing-portal", "https://billing.stripe.com/p/login/6oE9BXd4u8PR2aYaEE"],

  ["/docs/data-security-privacy", "/security"],
  ["/baa", "/security/hipaa"],
  ["/idea", "https://github.com/orgs/langfuse/discussions/new?category=ideas"],
  ["/new-idea", "/idea"],
  ["/ideas", "https://github.com/orgs/langfuse/discussions/categories/ideas"],
  ["/gh-support", "https://github.com/orgs/langfuse/discussions/categories/support"],
  ["/discussions", "https://github.com/orgs/langfuse/discussions"],
  ["/gh-discussions", "/discussions"],
  ["/docs/analytics", "/docs/analytics/overview"],
  ["/request-trial", "https://forms.gle/cXZuQZLmzJp8yd9k7"],
  ["/request-security-docs", "https://forms.gle/o5JE7vWtX7Qk2syc8"],

  ["/public-metrics-dashboard", "https://lookerstudio.google.com/reporting/5198bcda-7d3d-447d-b596-ebe778c5fe99"],
  ["/join-us", "/careers"],

  ["/launch", "/blog/2025-05-19-launch-week-3"],

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

  // Redirects to bridge all kinds of old links to new links
  ["/docs/admin-api", "/docs/api#org-scoped-routes"],
  ["/docs/reference", "https://api.reference.langfuse.com/"],
  ["/docs/integrations/api", "/docs/api"],
  ["/docs/integrations/sdk/typescript", "/docs/sdk/typescript"],
  ["/docs/integrations/sdk/python", "/docs/sdk/python"],
  ["/docs/langchain", "/docs/integrations/langchain/tracing"],
  ["/docs/langchain/python", "/docs/integrations/langchain/tracing"],
  ["/docs/langchain/typescript", "/docs/integrations/langchain/tracing"],
  ["/docs/integrations/vercel", "/docs/integrations/vercel-ai-sdk"],
  ["/docs/integrations/langchain", "/docs/integrations/langchain/tracing"],
  ["/docs/integrations/langchain/python", "/docs/integrations/langchain/tracing"],
  ["/docs/integrations/langchain/typescript", "/docs/integrations/langchain/tracing"],
  ["/docs/integrations/langchain/overview", "/docs/integrations/langchain/tracing"],
  ["/docs/integrations/langchain/get-started", "/docs/integrations/langchain/tracing"],
  ["/docs/integrations/llama-index", "/docs/integrations/llama-index/get-started"],
  ["/docs/integrations/llama-index/overview", "/docs/integrations/llama-index/get-started"],
  ["/docs/integrations/llama-index/cookbook", "/docs/integrations/llama-index/get-started"],
  ["/docs/integrations/llama-index/example-python", "/docs/integrations/llama-index/get-started"],
  ["/docs/integrations/haystack", "/docs/integrations/haystack/get-started"],
  ["/docs/integrations/openai/get-started", "/docs/integrations/openai/python/get-started"],
  ["/docs/integrations/openai/examples", "/docs/integrations/openai/python/examples"],
  ["/docs/integrations/openai/track-errors", "/docs/integrations/openai/python/track-errors"],
  ["/docs/integrations/openai/python", "/docs/integrations/openai/python/get-started"],
  ["/docs/integrations/openai/js", "/docs/integrations/openai/js/get-started"],
  ["/docs/integrations/mirascope", "/docs/integrations/mirascope/tracing"],
  ["/docs/integrations/aws-bedrock", "/docs/integrations/amazon-bedrock"],
  ["/docs/opentelemetry/example-pydantic-ai", "/docs/integrations/pydantic-ai"],
  ["/docs/opentelemetry", "/docs/opentelemetry/get-started"],
  ["/docs/integrations/other/vapi", "/docs/integrations/vapi"],
  ["/docs/integrations/other/autogen", "/docs/integrations/autogen"],
  ["/docs/flowise", "/docs/integrations/flowise"],
  ["/docs/litellm", "/docs/integrations/litellm/tracing"],
  ["/docs/integrations/litellm", "/docs/integrations/litellm/tracing"],
  ["/docs/langflow", "/docs/integrations/langflow"],
  ["/docs/local", "/docs/deployment/local"],
  ["/docs/self-host", "/docs/deployment/self-host"],
  ["/docs/cloud", "/docs/deployment/cloud"],
  ["/docs/guides/sdk-integration", "/docs/sdk/overview"],
  ["/docs/sdk", "/docs/sdk/overview"],
  ["/docs/sdk/python", "/docs/sdk/python/decorators"],
  ["/cookbook", "/guides"],
  ["/cookbook/:path*", "/guides/cookbook/:path*"],
  ["/docs/sdk/typescript", "/docs/sdk/typescript/guide"],
  ["/docs/sdk/typescript-web", "/docs/sdk/typescript/guide-web"],
  ["/docs/scores/evals", "/docs/scores/model-based-evals"],
  ["/docs/scores/manually", "/docs/scores/annotation"],
  ["/docs/scores/model-based-evals/overview", "/docs/scores/model-based-evals"],
  ["/docs/scores/model-based-evals/ragas", "/cookbook/evaluation_of_rag_with_ragas"],
  ["/docs/scores/model-based-evals/langchain", "/cookbook/evaluation_with_langchain"],
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
  ["/changelog/2024-09-04-headless-initialization-or-self-hosted-deployments", "/changelog/2024-09-04-headless-initialization-of-self-hosted-deployments"],
  ["/docs/deployment/v3", "/docs/deployment/v3/overview"],
  ["/docs/integrations/openai-agents", "/docs/integrations/openaiagentssdk/openai-agents"],
  ["/docs/integrations/amazon-bedrock", "/docs/integrations/bedrock/amazon-bedrock"],
  ["/docs/open-source", "/open-source"],
  ["/faq/all/cloud-data-regions", "/security/data-regions"],
  ["/self-hosting/local", "/self-hosting/docker-compose"],
  ["/self-hosting/docker", "/self-hosting/kubernetes-helm"],
  ["/docs/analytics/posthog", "/docs/analytics/integrations/posthog"],
  ["/docs/analytics/integrations", "/docs/analytics/integrations/posthog"],
  ["/docs/analytics/daily-metrics-api", "/docs/analytics/metrics-api#daily-metrics"],
  ["/docs/opentelemetry/example-opentelemetry-collector", "/docs/opentelemetry/get-started#export-from-opentelemetry-collector"],
  ["/docs/sdk/python/decorators", "https://langfuse.com/docs/sdk/python/sdk-v3#observe-decorator"],

  // new self-hosting section
  ["/docs/self-hosting", "/self-hosting"],
  ["/docs/deployment/feature-overview", "/self-hosting/license-key"],
  ["/docs/deployment/local", "/self-hosting/local"],
  ["/docs/deployment/self-host", "/self-hosting"],
  ["/docs/deployment/v3/overview", "/self-hosting"],
  ["/docs/deployment/v3/migrate-v2-to-v3", "/self-hosting/upgrade-guides/upgrade-v2-to-v3"],
  ["/docs/deployment/v3/troubleshooting", "/self-hosting/troubleshooting"],
  ["/docs/deployment/v3/guides/docker-compose", "/self-hosting/docker-compose"],
  ["/docs/deployment/v3/guides/kubernetes-helm", "/self-hosting/kubernetes-helm"],
  ["/docs/deployment/v3/components/clickhouse", "/self-hosting/infrastructure/clickhouse"],
  ["/docs/deployment/v3/components/redis", "/self-hosting/infrastructure/cache"],
  ["/docs/deployment/v3/components/blobstorage", "/self-hosting/infrastructure/blobstorage"],

  // Reorder Tracing section
  ["/docs/tracing/overview", "/docs/tracing"],
  ["/docs/tracing-features", "/docs/tracing"],
  ...[
    "sessions",
    "users",
    "tags",
    "url",
  ].map((path) => [`/docs/tracing/${path}`, `/docs/tracing-features/${path}`]),

  // User-reported broken links
  ["/superagent", "/docs/integrations/superagent"],
  ["/guides/cookbook/langfuse_prompt_with_langchain", "/guides/cookbook/prompt_management_langchain"],

  // START OF MOVED INTEGRATION SECTION
  // Analytics integrations
  ["/docs/analytics/integrations/coval", "/integrations/analytics/coval"],
  ["/docs/analytics/integrations/posthog", "/integrations/analytics/posthog"],
  ["/docs/analytics/integrations/trubrics", "/integrations/analytics/trubrics"],

  // Framework integrations - redirect to integration pages where they exist
  ["/docs/integrations/autogen", "/integrations/frameworks/autogen"],
  ["/docs/integrations/crewai", "/integrations/frameworks/crewai"],
  ["/docs/integrations/dspy", "/integrations/frameworks/dspy"],
  ["/docs/integrations/instructor", "/integrations/frameworks/instructor"],
  ["/docs/integrations/langchain/tracing", "/integrations/frameworks/langchain"],
  ["/docs/integrations/langchain/upgrade-paths", "/integrations/frameworks/langchain"],
  ["/docs/integrations/langchain/example-python-langserve", "/integrations/frameworks/langserve"],
  ["/docs/integrations/mastra", "/integrations/frameworks/mastra"],
  ["/docs/integrations/mirascope/tracing", "/integrations/frameworks/mirascope"],
  ["/docs/integrations/pipecat", "/integrations/frameworks/pipecat"],
  ["/docs/integrations/pydantic-ai", "/integrations/frameworks/pydantic-ai"],
  ["/docs/integrations/quarkus-langchain4j", "/integrations/frameworks/quarkus-langchain4j"],
  ["/docs/integrations/semantic-kernel", "/integrations/frameworks/semantic-kernel"],
  ["/docs/integrations/smolagents", "/integrations/frameworks/smolagents"],
  ["/docs/integrations/spring-ai", "/integrations/frameworks/spring-ai"],
  ["/docs/integrations/strands-agents", "/integrations/frameworks/strands-agents"],
  ["/docs/integrations/vercel-ai-sdk", "/integrations/frameworks/vercel-ai-sdk"],
  ["/docs/integrations/voltagent", "/integrations/frameworks/voltagent"],
  ["/docs/integrations/haystack/get-started", "/integrations/frameworks/haystack"],
  ["/docs/integrations/google-adk", "/integrations/frameworks/google-adk"],
  ["/docs/integrations/other/agno-agents", "/integrations/frameworks/agno-agents"],
  ["/docs/integrations/other/ragas", "/integrations/frameworks/ragas"],
  ["/docs/integrations/llama-index/get-started", "/integrations/frameworks/llamaindex"],
  ["/docs/integrations/llama-index/workflows", "/integrations/frameworks/llamaindex-workflows"],
  ["/docs/integrations/openaiagentssdk/openai-agents", "/integrations/frameworks/openai-agents"],

  // Model provider integrations - redirect to integration pages where they exist
  ["/docs/integrations/bedrock/amazon-bedrock", "/integrations/model-providers/amazon-bedrock"],
  ["/docs/integrations/bedrock/example-bedrock-agents", "/integrations/model-providers/amazon-bedrock-agents"],
  ["/docs/integrations/deepseek", "/integrations/model-providers/deepseek"],
  ["/docs/integrations/google-vertex-ai", "/integrations/model-providers/google-vertex-ai"],
  ["/docs/integrations/groq-sdk", "/integrations/model-providers/groq"],
  ["/docs/integrations/huggingface", "/integrations/model-providers/huggingface"],
  ["/docs/integrations/mistral-sdk", "/integrations/model-providers/mistral-sdk"],
  ["/docs/integrations/ollama", "/integrations/model-providers/ollama"],
  ["/docs/integrations/openai/js/get-started", "/integrations/model-providers/openai-js"],
  ["/docs/integrations/openai/python/assistants-api", "/integrations/model-providers/openai-assistants-api"],
  ["/docs/integrations/openai/python/get-started", "/integrations/model-providers/openai-py"],
  ["/docs/integrations/openai/python/track-errors", "/integrations/model-providers/openai-py"],
  ["/docs/integrations/databricks/overview", "/integrations/model-providers/databricks"],
  ["/docs/integrations/databricks/use-with-playground-and-evals", "/integrations/model-providers/databricks"],
  ["/docs/integrations/other/cleanlab", "/integrations/model-providers/cleanlab"],
  ["/docs/integrations/other/cohere", "/integrations/model-providers/cohere"],
  ["/docs/integrations/other/fireworks-ai", "/integrations/model-providers/fireworks-ai"],
  ["/docs/integrations/other/novitaai", "/integrations/model-providers/novitaai"],
  ["/docs/integrations/other/togetherai", "/integrations/model-providers/togetherai"],
  ["/docs/integrations/other/xai", "/integrations/model-providers/xai-grok"],

  // Gateway integrations - redirect to integration pages where they exist
  ["/docs/integrations/litellm/tracing", "/integrations/gateways/litellm"],
  ["/docs/integrations/portkey", "/integrations/gateways/portkey"],
  ["/docs/integrations/other/openrouter", "/integrations/gateways/openrouter"],

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
  ["/docs/integrations/langchain/example-python", "/guides/cookbook/integration_langchain"],
  ["/docs/integrations/langchain/example-python-langgraph", "/guides/cookbook/integration_langgraph"],
  ["/docs/integrations/langchain/example-javascript", "/guides/cookbook/js_integration_langchain"],
  ["/docs/integrations/langchain/example-langgraph-agents", "/guides/cookbook/example_langgraph_agents"],
  ["/docs/integrations/openai/python/examples", "/guides/cookbook/integration_openai_sdk"],
  ["/docs/integrations/openai/python/structured-outputs", "/guides/cookbook/integration_openai_structured_output"],
  ["/docs/integrations/openai/js/examples", "/guides/cookbook/js_integration_openai"],
  ["/docs/integrations/llama-index/deprecated/example-python", "/guides/cookbook/integration_llama-index-callback"],
  ["/docs/integrations/llama-index/deprecated/example-python-instrumentation-module", "/guides/cookbook/integration_llama-index_instrumentation"],
  ["/docs/integrations/llama-index/example-js-llamaindex", "/guides/cookbook/js_integration_llamaindex"],
  ["/docs/integrations/haystack/example-python", "/guides/cookbook/integration_haystack"],
  ["/docs/integrations/litellm/example-proxy-python", "/guides/cookbook/integration_litellm_proxy"],
  ["/docs/integrations/litellm/example-proxy-js", "/guides/cookbook/js_integration_litellm_proxy"],
  ["/docs/integrations/mirascope/example-python", "/guides/cookbook/integration_mirascope"],
  ["/docs/integrations/databricks/example-python", "/guides/cookbook/integration_databricks"],
  ["/docs/integrations/openaiagentssdk/example-evaluating-openai-agents", "/guides/cookbook/example_evaluating_openai_agents"]
  // END OF MOVED INTEGRATION SECTION
];

const permanentRedirects = []

export default withBundleAnalyzer(nextraConfig);
