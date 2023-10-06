import remarkGfm from 'remark-gfm';
import nextra from 'nextra';

const withNextra = nextra({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.tsx',
  mdxOptions: {
    remarkPlugins: [remarkGfm],
  },
  defaultShowCopyCode: true,
})

export default withNextra({
  experimental: {
    scrollRestoration: true,
  },
  transpilePackages: [
    'react-tweet',
    'react-syntax-highlighter',
  ],
  rewrites: async () => {
    return [
      {
        source: '/docs/api-reference',
        destination: 'https://api-reference.langfuse.com',
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
  ["/video", "/docs/video"],
  ["/ph", "https://www.producthunt.com/posts/langfuse"],
  ["/loom-gpt4-PR", "https://www.loom.com/share/5c044ca77be44ff7821967834dd70cba"],
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
  ["/docs/reference", "/docs/integrations/api"],
  ["/docs/api", "/docs/integrations/api"],
  ["/docs/sdk", "/docs/integrations/sdk"],
  ["/docs/langchain", "/docs/integrations/langchain"],
  // sdk
  ["/docs/sdk/python", "/docs/integrations/sdk/python"],
  ["/docs/sdk/typescript", "/docs/integrations/sdk/typescript"],
  ["/docs/sdk/typescript-web", "/docs/integrations/sdk/typescript-web"],
  // sdk integration guide
  ["/docs/guides/sdk-integration", "/docs/integrations/sdk#Example"],
  // langchain
  ["/docs/integrations/langchain", "/docs/integrations/langchain/python"],
  // evals
  ["/docs/scores/evals", "/docs/scores/model-based-evals"]
]