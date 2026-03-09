// source.config.ts
import { defineDocs, defineConfig, frontmatterSchema } from "fumadocs-mdx/config";
import remarkGfm from "remark-gfm";
import { remarkMdxMermaid } from "fumadocs-core/mdx-plugins";
import { mdxJsxToMarkdown } from "mdast-util-mdx-jsx";
import { z } from "zod";
var yamlDateField = z.union([
  z.string(),
  z.date().transform((d) => d.toISOString().split("T")[0])
]).nullish();
var blogFrontmatterSchema = frontmatterSchema.extend({
  date: yamlDateField,
  tag: z.string().nullish(),
  author: z.string().nullish(),
  ogImage: z.string().nullish(),
  showInBlogIndex: z.boolean().nullish()
});
var changelogFrontmatterSchema = frontmatterSchema.extend({
  date: yamlDateField,
  author: z.string().nullish(),
  ogImage: z.string().nullish()
});
var customerFrontmatterSchema = frontmatterSchema.extend({
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
  showInCustomerIndex: z.boolean().nullish()
});
var docs = defineDocs({
  dir: "content/docs"
});
var selfHosting = defineDocs({
  dir: "content/self-hosting"
});
var blog = defineDocs({
  dir: "content/blog",
  docs: {
    schema: blogFrontmatterSchema
  }
});
var changelog = defineDocs({
  dir: "content/changelog",
  docs: {
    schema: changelogFrontmatterSchema
  }
});
var guidesFrontmatterSchema = frontmatterSchema.extend({
  ogImage: z.string().nullish(),
  category: z.string().nullish()
});
var guides = defineDocs({
  dir: "content/guides",
  docs: {
    schema: guidesFrontmatterSchema
  }
});
var faq = defineDocs({
  dir: "content/faq"
});
var integrationsFrontmatterSchema = frontmatterSchema.extend({
  sidebarTitle: z.string().nullish()
});
var integrations = defineDocs({
  dir: "content/integrations",
  docs: {
    schema: integrationsFrontmatterSchema
  }
});
var security = defineDocs({
  dir: "content/security"
});
var library = defineDocs({
  dir: "content/library"
});
var customers = defineDocs({
  dir: "content/customers",
  docs: {
    schema: customerFrontmatterSchema
  }
});
var handbook = defineDocs({
  dir: "content/handbook"
});
var marketing = defineDocs({
  dir: "content/marketing"
});
var source_config_default = defineConfig({
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
      stringify: { extensions: [mdxJsxToMarkdown()] }
    },
    // @ts-ignore — { lazy: false } is valid at runtime; RehypeCodeOptions
    // requires themes in its full type but fumadocs applies safe defaults
    rehypeCodeOptions: { lazy: false }
  }
});
export {
  blog,
  changelog,
  customers,
  source_config_default as default,
  docs,
  faq,
  guides,
  handbook,
  integrations,
  library,
  marketing,
  security,
  selfHosting
};
