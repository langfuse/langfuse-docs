/**
 * Remark plugin that renders the file-path header above fenced code blocks.
 *
 * The previous docs stack (Nextra) showed the file path from the
 * `filename="..."` code-fence meta, e.g.:
 *
 *     ```ts filename="instrumentation.ts"
 *
 * Fumadocs instead reads the `title="..."` meta to render that header, so the
 * large amount of existing content using `filename=` lost its file-path label.
 *
 * This plugin rewrites the legacy `filename=` meta to `title=` so both
 * spellings render the header. It runs on the mdast `code` node before
 * remark-rehype/rehypeCode, and only rewrites when no explicit `title=` is
 * already present so an author-provided title always wins.
 */
import { visit } from "unist-util-visit";

export function remarkCodeFilename() {
  return (tree) => {
    visit(tree, "code", (node) => {
      if (typeof node.meta !== "string" || !/\bfilename=/.test(node.meta)) {
        return;
      }
      if (/\btitle=/.test(node.meta)) return;
      node.meta = node.meta.replace(/\bfilename=/g, "title=");
    });
  };
}
