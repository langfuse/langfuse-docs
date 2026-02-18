// source.config.ts
import { defineDocs, defineConfig } from "fumadocs-mdx/config";
import remarkGfm from "remark-gfm";
var docs = defineDocs({
  dir: "content/docs",
  docs: {
    remarkPlugins: [remarkGfm]
  }
});
var source_config_default = defineConfig({
  mdxOptions: {
    remarkPlugins: [remarkGfm],
    providerImportSource: "@/mdx-components"
  }
});
export {
  source_config_default as default,
  docs
};
