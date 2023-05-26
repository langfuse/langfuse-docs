import { remarkMermaid } from 'remark-mermaid-nextra';
import nextra from 'nextra';

const withNextra = nextra({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.tsx',
  mdxOptions: {
    remarkPlugins: [remarkMermaid],
  },
  defaultShowCopyCode: true,
})

export default withNextra();