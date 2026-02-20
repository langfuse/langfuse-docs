// source.config.ts
import { defineDocs, defineConfig } from "fumadocs-mdx/config";
import remarkGfm from "remark-gfm";
import { mdxJsxToMarkdown } from "mdast-util-mdx-jsx";
var docsOptions = { remarkPlugins: [remarkGfm] };
var docs = defineDocs({
  dir: "content/docs",
  docs: docsOptions
});
var selfHosting = defineDocs({
  dir: "content/self-hosting",
  docs: docsOptions
});
var blog = defineDocs({
  dir: "content/blog",
  docs: docsOptions
});
var changelog = defineDocs({
  dir: "content/changelog",
  docs: docsOptions
});
var guides = defineDocs({
  dir: "content/guides",
  docs: docsOptions
});
var faq = defineDocs({
  dir: "content/faq",
  docs: docsOptions
});
var integrations = defineDocs({
  dir: "content/integrations",
  docs: docsOptions
});
var security = defineDocs({
  dir: "content/security",
  docs: docsOptions
});
var library = defineDocs({
  dir: "content/library",
  docs: docsOptions
});
var customers = defineDocs({
  dir: "content/customers",
  docs: docsOptions
});
var handbook = defineDocs({
  dir: "content/handbook",
  docs: docsOptions
});
var marketing = defineDocs({
  dir: "content/marketing",
  docs: docsOptions
});
var source_config_default = defineConfig({
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
      stringify: { extensions: [mdxJsxToMarkdown()] }
    },
    rehypeCodeOptions: {
      // Load all bundled languages so code blocks (e.g. json, python, yaml) work.
      // Default lazy: true only loads ts/tsx and causes ShikiError for other langs.
      lazy: false
    }
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
