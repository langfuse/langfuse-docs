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
  ["/video", "/guides/videos/introducing-langfuse-2.0"],
  ["/docs/video", "/guides/videos/introducing-langfuse-2.0"],
  ["/roadmap", "/docs/roadmap"],
  ["/ph", "https://www.producthunt.com/posts/langfuse-2-0-llm-engineering-platform"],
  ["/loom-gpt4-PR", "https://www.loom.com/share/5c044ca77be44ff7821967834dd70cba"],
  ["/issue", "https://github.com/langfuse/langfuse/issues/new/choose"],
  ["/new-issue", "/issue"],
  ["/issues", "https://github.com/langfuse/langfuse/issues"],
  ["/stickers", "https://forms.gle/Af5BHpWUMZSCT4kg8?_imcp=1"],
  ["/sticker", "/stickers"],


  ["/security", "/docs/data-security-privacy"],
  ["/idea", "https://github.com/orgs/langfuse/discussions/new?category=ideas"],
  ["/new-idea", "/idea"],
  ["/ideas", "https://github.com/orgs/langfuse/discussions/categories/ideas"],
  ["/gh-support", "https://github.com/orgs/langfuse/discussions/categories/support"],
  ["/discussions", "https://github.com/orgs/langfuse/discussions"],
  ["/gh-discussions", "/discussions"],
  ["/docs/analytics", "/docs/analytics/overview"],

  ["/public-metrics-dashboard", "https://lookerstudio.google.com/reporting/5198bcda-7d3d-447d-b596-ebe778c5fe99"],
  ["/join-us", "/careers"],

  ["/launch", "/blog/launch-week-1"],

  // Redirect to overview pages
  ...[
    "/docs/integrations",
    "/docs/scores",
    "/docs/datasets",
    "/docs/security",
  ].map((path) => [path, path + "/overview"]),

  // Redirects to bridge all kinds of old links to new links
  ["/docs/reference", "https://api.reference.langfuse.com/"],
  ["/docs/integrations/api", "https://api.reference.langfuse.com/"],
  ["/docs/integrations/sdk/typescript", "/docs/sdk/typescript"],
  ["/docs/integrations/sdk/python", "/docs/sdk/python"],
  ["/docs/langchain", "/docs/integrations/langchain/tracing"],
  ["/docs/langchain/python", "/docs/integrations/langchain/tracing"],
  ["/docs/langchain/typescript", "/docs/integrations/langchain/tracing"],
  ["/docs/integrations/langchain", "/docs/integrations/langchain/tracing"],
  ["/docs/integrations/langchain/python", "/docs/integrations/langchain/tracing"],
  ["/docs/integrations/langchain/typescript", "/docs/integrations/langchain/tracing"],
  ["/docs/integrations/langchain/overview", "/docs/integrations/langchain/tracing"],
  ["/docs/integrations/langchain/get-started", "/docs/integrations/langchain/tracing"],
  ["/docs/integrations/llama-index", "/docs/integrations/llama-index/get-started"],
  ["/docs/integrations/llama-index/overview", "/docs/integrations/llama-index/get-started"],
  ["/docs/integrations/llama-index/cookbook", "/docs/integrations/llama-index/example-python"],
  ["/docs/integrations/haystack", "/docs/integrations/haystack/get-started"],
  ["/docs/integrations/openai/get-started", "/docs/integrations/openai/python/get-started"],
  ["/docs/integrations/openai/examples", "/docs/integrations/openai/python/examples"],
  ["/docs/integrations/openai/track-errors", "/docs/integrations/openai/python/track-errors"],
  ["/docs/integrations/openai/python", "/docs/integrations/openai/python/get-started"],
  ["/docs/integrations/openai/js", "/docs/integrations/openai/js/get-started"],
  ["/docs/integrations/mirascope", "/docs/integrations/mirascope/tracing"],
  ["/docs/integrations/aws-bedrock", "/docs/integrations/amazon-bedrock"],
  ["/docs/flowise", "/docs/integrations/flowise"],
  ["/docs/litellm", "/docs/integrations/litellm/tracing"],
  ["/docs/integrations/litellm", "/docs/integrations/litellm/tracing"],
  ["/docs/langflow", "/docs/integrations/langflow"],
  ["/integrations", "/docs/integrations"],
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
  ["/experimentation", "/docs/experimentation"],
  ["/docs/token-usage", "/docs/model-usage-and-cost"],
  ["/docs/debugging-ui", "/docs/tracing"],
  ["/observability", "/docs/tracing"],
  ["/docs/openai", "/docs/integrations/openai/get-started"],
  ["/docs/integrations/openai", "/docs/integrations/openai/get-started"],
  ["/docs/api", "https://api.reference.langfuse.com/"],
  ["/docs/qa-chatbot", "/docs/demo"],
  ["/docs/user-explorer", "/docs/tracing-features/users"],
  ["/docs/sessions", "/docs/tracing-features/sessions"],
  ["/docs/deployment/cloud", "/security"],
  ["/docs/schedule-demo", "/schedule-demo"],
  ["/docs/project-sharing", "/docs/rbac"],
  ["/docs/prompts", "/docs/prompts/get-started"],
  ["/changelog/2024-03-03-posthog-integration", "/docs/analytics/posthog"],
  ["/guides/videos/2-min", "/guides/videos/introducing-langfuse-2.0"],
  ["/tos", "/terms"],
  ["/docs/export-and-fine-tuning", "/docs/query-traces"],
  ["/changelog/2024-09-04-headless-initialization-or-self-hosted-deployments", "/changelog/2024-09-04-headless-initialization-of-self-hosted-deployments"],

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
  ["/guides/cookbook/langfuse_prompt_with_langchain", "/guides/cookbook/prompt_management_langchain"]
];

const permanentRedirects = []

export default withBundleAnalyzer(nextraConfig);
