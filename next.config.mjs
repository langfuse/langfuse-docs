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
  ["/security", "/docs/data-security-privacy"],
  ["/idea", "https://github.com/orgs/langfuse/discussions/new?category=ideas"],
];

const permanentRedirects = [
  // Migration 2023-07
  ["/observability", "/docs/tracing"],
  ["/docs/debugging-ui", "/docs/tracing"],
  // Migration 2023-08-01
  // deployment
  ["/docs/local", "/docs/deployment/local"],
  ["/docs/self-host", "/docs/deployment/self-host"],
  ["/docs/cloud", "/docs/deployment/cloud"],
  // integrations
  ["/integrations", "/docs/integrations"],
  ["/docs/reference", "/docs/api"],
  // Integrations back on root
  ...["langchain", "api", "openai", "sdk", "flowise", "langflow", "litellm"].map(
    (integration) => [`/docs/integrations/${integration}/:path*`, `/docs/${integration}/:path*`]),
  // sdk integration guide
  ["/docs/langchain", "/docs/langchain/python"],
  ["/docs/guides/sdk-integration", "/docs/sdk#example"],
  // evals
  ["/docs/scores/evals", "/docs/scores/model-based-evals"],
  // old experimentation to new experimentation
  ["/experimentation", "/docs/experimentation"],
  // token usage to model usage, 2024-01
  ["/docs/token-usage", "/docs/model-usage-and-cost"],
]

export default withBundleAnalyzer(nextraConfig);
