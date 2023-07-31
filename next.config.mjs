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
  transpilePackages: ['react-tweet'],
  rewrites: async () => {
    return [
      {
        source: '/',
        destination: 'https://analytics.langfuse.com',
      },
    ]
  },
  redirects: async () => [
    {
      source: "/analytics",
      destination: "https://docs.google.com/document/d/1PEFSqn-VWjNXOZZ1U7FC0oH-spDdkKJxLwgp15iK7zY",
      permanent: false,
    },
    {
      source: "/observability",
      destination: "/integrations",
      permanent: false,
    },
    {
      source: "/integrations",
      destination: "/docs/integrations",
      permanent: false,
    },
    {
      source: "/docs/reference",
      destination: "/docs/api",
      permanent: false,
    },
    {
      source: "/docs/debugging-ui",
      destination: "/docs/tracing",
      permanent: false,
    }
  ]
});
