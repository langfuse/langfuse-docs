/**
 * Remark plugin that registers the MDX JSX to-markdown extension.
 * This fixes "Cannot handle unknown node 'mdxJsxFlowElement'" when Fumadocs
 * serializes ASTs that contain JSX (e.g. pages that import MDX components).
 */
import { mdxJsxToMarkdown } from "mdast-util-mdx-jsx";

export function remarkToMarkdownExtensions() {
  const self = this;
  const data = self.data();
  data.toMarkdownExtensions = [
    ...(data.toMarkdownExtensions ?? []),
    mdxJsxToMarkdown(),
  ];
  return function () {
    /* no-op transformer; we only set processor data */
  };
}
