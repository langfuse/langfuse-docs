import remarkGfm from 'remark-gfm';
import nextra from 'nextra';
import NextBundleAnalyzer from '@next/bundle-analyzer'

const withBundleAnalyzer = NextBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

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
  ["/video", "/docs/video"],
  ["/ph", "https://www.producthunt.com/posts/langfuse"],
  ["/loom-gpt4-PR", "https://www.loom.com/share/5c044ca77be44ff7821967834dd70cba"],
  ["/issue", "https://github.com/langfuse/langfuse/issues/new/choose"],
  ["/new-issue", "https://github.com/langfuse/langfuse/issues/new/choose"],
  ["/issues", "https://github.com/langfuse/langfuse/issues"],

  ["/security", "/docs/data-security-privacy"],
  ["/idea", "https://github.com/orgs/langfuse/discussions/new?category=ideas"],
  ["/new-idea", "https://github.com/orgs/langfuse/discussions/new?category=ideas"],
  ["/ideas", "https://github.com/orgs/langfuse/discussions/categories/ideas"],

  // Redirect to overview pages
  ...[
    "/docs/integrations",
    "/docs/sdk",
    "/docs/tracing",
    "/docs/scores",
    "/docs/scores/model-based-evals",
    "/docs/datasets",
    "/docs/integrations/llama-index",
  ].map((path) => [path, path + "/overview"]),

  // Redirects to bridge all kinds of old links to new links
  ["/docs/reference", "https://api.reference.langfuse.com/"],
  ["/docs/integrations/api", "https://api.reference.langfuse.com/"],
  ["/docs/langchain", "/docs/integrations/langchain/python"],
  ["/docs/integrations/langchain", "/docs/integrations/langchain/python"],
  ["/docs/langchain/python", "/docs/integrations/langchain/python"],
  ["/docs/langchain/typescript", "/docs/integrations/langchain/typescript"],
  ["/docs/flowise", "/docs/integrations/flowise"],
  ["/docs/litellm", "/docs/integrations/litellm"],
  ["/docs/langflow", "/docs/integrations/langflow"],
  ["/integrations", "/docs/integrations"],
  ["/docs/local", "/docs/deployment/local"],
  ["/docs/self-host", "/docs/deployment/self-host"],
  ["/docs/cloud", "/docs/deployment/cloud"],
  ["/docs/guides/sdk-integration", "/docs/sdk/overview"],
  ["/docs/scores/evals", "/docs/scores/model-based-evals/overview"],
  ["/experimentation", "/docs/experimentation"],
  ["/docs/token-usage", "/docs/model-usage-and-cost"],
  ["/docs/debugging-ui", "/docs/tracing/overview"],
  ["/observability", "/docs/tracing/overview"],
  ["/docs/openai", "/docs/integrations/openai"],
  ["/docs/api", "https://api.reference.langfuse.com/"],
  ["/docs/qa-chatbot", "/docs/demo"],
  ["/docs/user-explorer", "/docs/tracing/users"],
  ["/docs/sessions", "/docs/tracing/sessions"],
  ["/docs/deployment/cloud", "/security"],
  ["/docs/schedule-demo", "/schedule-demo"],
  ["/docs/project-sharing", "/docs/rbac"],
];

const permanentRedirects = []

export default withBundleAnalyzer(nextraConfig);
