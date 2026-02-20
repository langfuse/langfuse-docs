import { defineDocs, defineConfig } from "fumadocs-mdx/config";
import remarkGfm from "remark-gfm";
import { mdxJsxToMarkdown } from "mdast-util-mdx-jsx";

const docsOptions = { remarkPlugins: [remarkGfm] as const };

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
  docs: docsOptions,
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
