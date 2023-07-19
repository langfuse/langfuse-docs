import { remarkMermaid } from 'remark-mermaid-nextra';
import remarkGfm from 'remark-gfm';
import nextra from 'nextra';

const withNextra = nextra({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.tsx',
  mdxOptions: {
    remarkPlugins: [remarkMermaid, remarkGfm],
  },
  defaultShowCopyCode: true,
  experimental: {
    scrollRestoration: true,
  }
})

export default withNextra({
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
  ]
});
