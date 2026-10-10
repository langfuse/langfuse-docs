/**
 * Emit schema.org FAQPage JSON-LD for pages that opt in with `faqSchema: true`.
 *
 * The Q&A is read from the page's own mdast, so the markup cannot drift from
 * the prose a reader (or a crawler) sees — `FAQPage` is only valid when the
 * answers are on the page. Pages opt in explicitly rather than this applying
 * to every `<FaqDetails>` block, because that component is also used by
 * `<FaqPreview />` and the FAQ index to render *link lists*, where the answers
 * live on another page entirely.
 *
 * Runs after the content plugins so it sees the same tree that renders.
 */
import { extractFaqEntries, serializeFaqPageSchema } from "./faq-schema.mjs";

export function remarkFaqSchema() {
  return (tree, file) => {
    if (!file?.data?.frontmatter?.faqSchema) return;

    const entries = extractFaqEntries(tree);
    if (entries.length === 0) return;

    tree.children.push({
      type: "mdxJsxFlowElement",
      name: "FaqPageJsonLd",
      attributes: [
        {
          type: "mdxJsxAttribute",
          name: "json",
          value: serializeFaqPageSchema(entries),
        },
      ],
      children: [],
    });
  };
}
