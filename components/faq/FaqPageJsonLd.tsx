/**
 * Renders the schema.org FAQPage JSON-LD built by `remarkFaqSchema`.
 *
 * The plugin serialises the whole document and escapes `<`, so this only has
 * to place it in the page. Authors never write this tag themselves — a page
 * opts in with `faqSchema: true` in its frontmatter.
 */
export function FaqPageJsonLd({ json }: { json?: string }) {
  if (!json) return null;

  return (
    <script
      type="application/ld+json"
      // Already escaped in lib/faq-schema.mjs; JSON-LD cannot be set via children.
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
