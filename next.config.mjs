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
const cspHeader = `
  default-src 'self' https://ph.langfuse.com https://*.posthog.com wss://*.crisp.chat https://*.crisp.chat;
  script-src 'self' 'unsafe-eval' https://*.crisp.chat https://ph.langfuse.com https://static.cloudflareinsights.com https://*.stripe.com;
  style-src 'self' 'unsafe-inline' https://*.crisp.chat;
  img-src 'self' https: blob: data:;
  font-src 'self' https://*.crisp.chat;
  frame-src 'self' https://challenges.cloudflare.com https://*.stripe.com;
  worker-src 'self' blob:;
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  upgrade-insecure-requests;
  block-all-mixed-content;
`;

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
    return [
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
    ]
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
  ["/video", "/guides/videos/2-min"],
  ["/docs/video", "/guides/videos/2-min"],
  ["/roadmap", "/docs/roadmap"],
  ["/ph", "https://www.producthunt.com/posts/langfuse"],
  ["/loom-gpt4-PR", "https://www.loom.com/share/5c044ca77be44ff7821967834dd70cba"],
  ["/issue", "https://github.com/langfuse/langfuse/issues/new/choose"],
  ["/new-issue", "https://github.com/langfuse/langfuse/issues/new/choose"],
  ["/issues", "https://github.com/langfuse/langfuse/issues"],

  ["/security", "/docs/data-security-privacy"],
  ["/idea", "https://github.com/orgs/langfuse/discussions/new?category=ideas"],
  ["/new-idea", "https://github.com/orgs/langfuse/discussions/new?category=ideas"],
  ["/ideas", "https://github.com/orgs/langfuse/discussions/categories/ideas"],
  ["/gh-support", "https://github.com/orgs/langfuse/discussions/categories/support"],
  ["/gh-discussions", "https://github.com/orgs/langfuse/discussions"],
  ["/docs/analytics", "/docs/analytics/overview"],

  // Redirect to overview pages
  ...[
    "/docs/integrations",
    "/docs/tracing",
    "/docs/scores",
    "/docs/datasets",
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
  ["/docs/integrations/llama-index", "/docs/integrations/llama-index/get-started"],
  ["/docs/integrations/llama-index/overview", "/docs/integrations/llama-index/get-started"],
  ["/docs/integrations/llama-index/cookbook", "/docs/integrations/llama-index/example-python"],
  ["/docs/flowise", "/docs/integrations/flowise"],
  ["/docs/litellm", "/docs/integrations/litellm"],
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
  ["/docs/scores/model-based-evals/overview", "/docs/scores/model-based-evals"],
  ["/docs/scores/model-based-evals/ragas", "/cookbook/evaluation_of_rag_with_ragas"],
  ["/docs/scores/model-based-evals/langchain", "/cookbook/evaluation_with_langchain"],
  ["/experimentation", "/docs/experimentation"],
  ["/docs/token-usage", "/docs/model-usage-and-cost"],
  ["/docs/debugging-ui", "/docs/tracing/overview"],
  ["/observability", "/docs/tracing/overview"],
  ["/docs/openai", "/docs/integrations/openai/get-started"],
  ["/docs/integrations/openai", "/docs/integrations/openai/get-started"],
  ["/docs/api", "https://api.reference.langfuse.com/"],
  ["/docs/qa-chatbot", "/docs/demo"],
  ["/docs/user-explorer", "/docs/tracing/users"],
  ["/docs/sessions", "/docs/tracing/sessions"],
  ["/docs/deployment/cloud", "/security"],
  ["/docs/schedule-demo", "/schedule-demo"],
  ["/docs/project-sharing", "/docs/rbac"],
  ["/docs/prompts", "/docs/prompts/get-started"],
  ["/changelog/2024-03-03-posthog-integration", "/docs/analytics/posthog"],
];

const permanentRedirects = []

export default withBundleAnalyzer(nextraConfig);
