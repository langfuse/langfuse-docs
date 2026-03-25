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

// Base schema that adds canonical and noindex to the default frontmatter schema.
// All per-collection schemas should extend this so these fields are always parsed.
const baseFrontmatterSchema = frontmatterSchema.extend({
  canonical: z.string().nullish(),
  noindex: z.boolean().nullish(),
  // Optional SEO title override: when set, used for <title> and OG title
  // instead of the navigation title (keeps sidebar labels short).
  seoTitle: z.string().nullish(),
  // Optional per-page OG image override (site-relative path, e.g. /images/foo.jpg).
  // When set, used instead of the generated /api/og card.
  ogImage: z.string().nullish(),
});

// Extended schema for blog pages — adds date, tag, author, ogImage fields
// used by BlogIndex for thumbnails and filtering.
const blogFrontmatterSchema = baseFrontmatterSchema.extend({
  date: yamlDateField,
  tag: z.string().nullish(),
  author: z.string().nullish(),
  showInBlogIndex: z.boolean().nullish(),
});

// Extended schema for changelog pages — adds date, author, ogImage, ogVideo, badge
// that the Changelog widget and ChangelogHeader read from frontMatter.
const changelogFrontmatterSchema = baseFrontmatterSchema.extend({
  date: yamlDateField,
  author: z.string().nullish(),
  ogVideo: z.string().nullish(),
  gif: z.string().nullish(),
  badge: z.string().nullish(),
});

// Extended schema for customer story pages — preserves all default fields and
// adds the custom frontmatter fields used by CustomerCarousel / CustomerIndex.
const customerFrontmatterSchema = baseFrontmatterSchema.extend({
  // Use .nullish() so empty YAML values (parsed as null) are accepted too
  date: yamlDateField,
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
  docs: { schema: baseFrontmatterSchema },
});

const selfHostingFrontmatterSchema = baseFrontmatterSchema.extend({
  sidebarTitle: z.string().nullish(),
  label: z.string().nullish(),
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

const guidesFrontmatterSchema = baseFrontmatterSchema.extend({
  category: z.string().nullish(),
  sidebarTitle: z.string().nullish(),
});

export const guides = defineDocs({
  dir: "content/guides",
  docs: {
    schema: guidesFrontmatterSchema,
  },
});

const faqFrontmatterSchema = baseFrontmatterSchema.extend({
  tags: z.array(z.string()).optional(),
});

export const faq = defineDocs({
  dir: "content/faq",
  docs: {
    schema: faqFrontmatterSchema,
  },
});

const integrationsFrontmatterSchema = baseFrontmatterSchema.extend({
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
  docs: { schema: baseFrontmatterSchema },
});

export const library = defineDocs({
  dir: "content/library",
  docs: { schema: baseFrontmatterSchema },
});

export const customers = defineDocs({
  dir: "content/customers",
  docs: {
    schema: customerFrontmatterSchema,
  },
});

export const handbook = defineDocs({
  dir: "content/handbook",
  docs: { schema: baseFrontmatterSchema },
});

export const marketing = defineDocs({
  dir: "content/marketing",
  docs: { schema: baseFrontmatterSchema },
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
