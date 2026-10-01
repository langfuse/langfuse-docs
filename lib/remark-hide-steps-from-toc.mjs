/**
 * Keep step titles out of the page table of contents.
 *
 * Headings inside <Steps> are the numbered step labels. Fumadocs otherwise
 * lists every one of them in the right-hand sidebar. Appending the [!toc]
 * marker makes rehype-toc drop the heading from the outline and strip the
 * marker from the rendered title. Heading ids are already assigned by the
 * time this plugin runs, so anchors stay stable.
 */
import { visit } from "unist-util-visit";

const NO_TOC = " [!toc]";

export function remarkHideStepsFromToc() {
  return (tree) => {
    visit(tree, "mdxJsxFlowElement", (node) => {
      if (node.name !== "Steps") return;

      visit(node, "heading", (heading) => {
        const last = heading.children.at(-1);
        if (last?.type === "text") {
          if (!last.value.includes("[!toc]")) {
            last.value = `${last.value.trimEnd()}${NO_TOC}`;
          }
          return;
        }
        heading.children.push({ type: "text", value: NO_TOC });
      });
    });
  };
}
