import { defineDocs, defineConfig, frontmatterSchema } from "fumadocs-mdx/config";
import remarkGfm from "remark-gfm";
import { mdxJsxToMarkdown } from "mdast-util-mdx-jsx";
import { z } from "zod";

const docsOptions = { remarkPlugins: [remarkGfm] as const };

// Extended schema for customer story pages — preserves all default fields and
// adds the custom frontmatter fields used by CustomerCarousel / CustomerIndex.
const customerFrontmatterSchema = frontmatterSchema.extend({
  date: z.string().optional(),
  ogImage: z.string().optional(),
  tag: z.string().optional(),
  author: z.string().optional(),
  customerLogo: z.string().optional(),
  customerLogoDark: z.string().optional(),
  customerQuote: z.string().optional(),
  quoteAuthor: z.string().optional(),
  quoteRole: z.string().optional(),
  quoteCompany: z.string().optional(),
  quoteAuthorImage: z.string().optional(),
  showInCustomerIndex: z.boolean().optional(),
});

export const docs = defineDocs({
  dir: "content/docs",
  docs: docsOptions,
});

export const selfHosting = defineDocs({
  dir: "content/self-hosting",
  docs: docsOptions,
});

export const blog = defineDocs({
  dir: "content/blog",
  docs: docsOptions,
});

export const changelog = defineDocs({
  dir: "content/changelog",
  docs: docsOptions,
});

export const guides = defineDocs({
  dir: "content/guides",
  docs: docsOptions,
});

export const faq = defineDocs({
  dir: "content/faq",
  docs: docsOptions,
});

export const integrations = defineDocs({
  dir: "content/integrations",
  docs: docsOptions,
});

export const security = defineDocs({
  dir: "content/security",
  docs: docsOptions,
});

export const library = defineDocs({
  dir: "content/library",
  docs: docsOptions,
});

export const customers = defineDocs({
  dir: "content/customers",
  docs: {
    remarkPlugins: [remarkGfm],
    schema: customerFrontmatterSchema,
  },
});

export const handbook = defineDocs({
  dir: "content/handbook",
  docs: docsOptions,
});

export const marketing = defineDocs({
  dir: "content/marketing",
  docs: docsOptions,
});

export default defineConfig({
  mdxOptions: {
    remarkPlugins: [remarkGfm],
    providerImportSource: "@/mdx-components",
    // Disable remark-image: many content files reference remote images via https://
    // and the plugin tries to fetch dimensions at compile time, causing build failures
    remarkImageOptions: false,
    // Teach remark-structure's mdast-util-to-markdown serializer how to handle
    // MDX JSX nodes (mdxJsxFlowElement / mdxJsxTextElement). Without this, it
    // throws "Cannot handle unknown node `mdxJsxFlowElement`" when pages contain
    // JSX components like <Callout>, <Tabs>, etc.
    remarkStructureOptions: {
      stringify: { extensions: [mdxJsxToMarkdown()] },
    },
    rehypeCodeOptions: {
      // Load all bundled languages so code blocks (e.g. json, python, yaml) work.
      // Default lazy: true only loads ts/tsx and causes ShikiError for other langs.
      lazy: false,
    },
  },
});
