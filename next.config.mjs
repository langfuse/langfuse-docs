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
  transpilePackages: ['react-tweet',
    'swagger-ui-react',
    'swagger-client',
    'react-syntax-highlighter',
  ],
  rewrites: async () => {
    return [
      // {
      //   source: '/',
      //   destination: 'https://analytics.langfuse.com',
      // },
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
]