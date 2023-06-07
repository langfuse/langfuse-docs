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

export default withNextra();