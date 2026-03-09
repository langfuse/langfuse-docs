import { defineDocs, defineConfig, frontmatterSchema } from "fumadocs-mdx/config";
import remarkGfm from "remark-gfm";
import { remarkMdxMermaid } from "fumadocs-core/mdx-plugins";
import { mdxJsxToMarkdown } from "mdast-util-mdx-jsx";
import { z } from "zod";

// YAML parses unquoted dates (e.g. `date: 2023-07-19`) as JS Date objects.
// Use this helper so both string dates and Date objects are accepted and
// normalised to an ISO date string (YYYY-MM-DD).
const yamlDateField = z
  .union([
    z.string(),
    z.date().transform((d) => d.toISOString().split("T")[0]),
  ])
  .nullish();

// Extended schema for blog pages — adds date, tag, author, ogImage fields
// used by BlogIndex for thumbnails and filtering.
const blogFrontmatterSchema = frontmatterSchema.extend({
  date: yamlDateField,
  tag: z.string().nullish(),
  author: z.string().nullish(),
  ogImage: z.string().nullish(),
  showInBlogIndex: z.boolean().nullish(),
});

// Extended schema for changelog pages — adds date, author, ogImage fields
// that the Changelog widget reads from frontMatter.
const changelogFrontmatterSchema = frontmatterSchema.extend({
  date: yamlDateField,
  author: z.string().nullish(),
  ogImage: z.string().nullish(),
});

// Extended schema for customer story pages — preserves all default fields and
// adds the custom frontmatter fields used by CustomerCarousel / CustomerIndex.
const customerFrontmatterSchema = frontmatterSchema.extend({
  // Use .nullish() so empty YAML values (parsed as null) are accepted too
  date: yamlDateField,
  ogImage: z.string().nullish(),
  tag: z.string().nullish(),
  author: z.string().nullish(),
  customerLogo: z.string().nullish(),
  customerLogoDark: z.string().nullish(),
  customerQuote: z.string().nullish(),
  quoteAuthor: z.string().nullish(),
  quoteRole: z.string().nullish(),
  quoteCompany: z.string().nullish(),
  quoteAuthorImage: z.string().nullish(),
  showInCustomerIndex: z.boolean().nullish(),
});

// remarkPlugins is applied globally in defineConfig; per-collection mdxOptions
// are only needed for schema customization.

export const docs = defineDocs({
  dir: "content/docs",
});

const selfHostingFrontmatterSchema = frontmatterSchema.extend({
  sidebarTitle: z.string().nullish(),
});

export const selfHosting = defineDocs({
  dir: "content/self-hosting",
  docs: {
    schema: selfHostingFrontmatterSchema,
  },
});

export const blog = defineDocs({
  dir: "content/blog",
  docs: {
    schema: blogFrontmatterSchema,
  },
});

export const changelog = defineDocs({
  dir: "content/changelog",
  docs: {
    schema: changelogFrontmatterSchema,
  },
});

const guidesFrontmatterSchema = frontmatterSchema.extend({
  ogImage: z.string().nullish(),
  category: z.string().nullish(),
});

export const guides = defineDocs({
  dir: "content/guides",
  docs: {
    schema: guidesFrontmatterSchema,
  },
});

export const faq = defineDocs({
  dir: "content/faq",
});

const integrationsFrontmatterSchema = frontmatterSchema.extend({
  sidebarTitle: z.string().nullish(),
  logo: z.string().nullish(),
});

export const integrations = defineDocs({
  dir: "content/integrations",
  docs: {
    schema: integrationsFrontmatterSchema,
  },
});

export const security = defineDocs({
  dir: "content/security",
});

export const library = defineDocs({
  dir: "content/library",
});

export const customers = defineDocs({
  dir: "content/customers",
  docs: {
    schema: customerFrontmatterSchema,
  },
});

export const handbook = defineDocs({
  dir: "content/handbook",
});

export const marketing = defineDocs({
  dir: "content/marketing",
});

export default defineConfig({
  mdxOptions: {
    remarkPlugins: [remarkGfm, remarkMdxMermaid],
    providerImportSource: "@/mdx-components",
    // Disable remark-image: many content files reference remote images via https://
    // and the plugin tries to fetch dimensions at compile time, causing build failures
    remarkImageOptions: false,
    // Teach remark-structure's mdast-util-to-markdown serializer how to handle
    // MDX JSX nodes (mdxJsxFlowElement / mdxJsxTextElement). Without this, it
    // throws "Cannot handle unknown node `mdxJsxFlowElement`" when pages contain
    // JSX components like <Callout>, <Tabs>, etc.
    remarkStructureOptions: {
      // @ts-ignore — extensions is valid in mdast-util-to-markdown but the
      // StructureOptions type doesn't expose it directly
      stringify: { extensions: [mdxJsxToMarkdown()] },
    },
    // @ts-ignore — { lazy: false } is valid at runtime; RehypeCodeOptions
    // requires themes in its full type but fumadocs applies safe defaults
    rehypeCodeOptions: { lazy: false },
  },
});
