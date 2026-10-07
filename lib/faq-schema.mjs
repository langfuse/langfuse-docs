/**
 * Build schema.org FAQPage JSON-LD from the `<Details>/<Summary>` Q&A pattern.
 *
 * Only pages that opt in via `faqSchema: true` in frontmatter get this, and
 * only ever from Q&A that is written inline in the page's own MDX. That is the
 * whole safety argument: `FAQPage` is only valid when the answers are visible
 * on the page, and FAQ hubs, tag pages and `<FaqPreview />` render *links* to
 * answers that live elsewhere. Those are component invocations in the MDX
 * tree, so they contribute no `<Details>` children here and cannot be marked
 * up by accident.
 *
 * Note this is deliberately not an SEO play: Google retired FAQ rich results
 * in May 2026. It is Schema.org hygiene for other consumers.
 *
 * Kept as plain `.mjs` with no React so the remark plugin and the unit tests
 * can both import it directly.
 */

/** Inline nodes whose text is part of the sentence around them. */
const INLINE_TYPES = new Set([
  "text",
  "inlineCode",
  "emphasis",
  "strong",
  "delete",
  "link",
  "linkReference",
  "mdxJsxTextElement",
]);

/**
 * Serialise an mdast subtree to the text a reader actually sees.
 *
 * Links collapse to their label, because the URL is not visible prose and
 * `acceptedAnswer.text` has to match the rendered answer. Block-level nodes
 * are joined with blank lines, inline nodes are concatenated.
 */
export function nodeToText(node) {
  if (!node) return "";

  switch (node.type) {
    case "text":
    case "inlineCode":
      return node.value ?? "";
    case "code":
      return node.value ?? "";
    case "break":
      return "\n";
    case "image":
    case "imageReference":
      return node.alt ?? "";
    case "html":
      // Raw HTML in an answer is chrome (e.g. <br/>), not prose.
      return "";
    case "thematicBreak":
      return "";
    default:
      break;
  }

  const children = Array.isArray(node.children) ? node.children : [];
  if (children.length === 0) return "";

  if (node.type === "list") {
    return children
      .map((item) => nodeToText(item).trim())
      .filter(Boolean)
      .join("\n");
  }

  // Concatenate inline runs; separate blocks with a blank line.
  let out = "";
  for (const child of children) {
    const text = nodeToText(child);
    if (!text) continue;
    if (out === "") {
      out = text;
      continue;
    }
    out += INLINE_TYPES.has(child.type) ? text : `\n\n${text}`;
  }
  return out;
}

const collapseWhitespace = (value) => value.replace(/\s+/g, " ").trim();

const isJsx = (node, name) =>
  (node?.type === "mdxJsxFlowElement" || node?.type === "mdxJsxTextElement") &&
  node.name?.toLowerCase() === name;

/**
 * Collect `<Details>` elements, without descending into a `<Details>` that is
 * already matched — a nested disclosure belongs to its parent's answer, not to
 * a question of its own.
 */
function collectDetails(node, out = []) {
  for (const child of node.children ?? []) {
    if (isJsx(child, "details")) {
      out.push(child);
      continue;
    }
    collectDetails(child, out);
  }
  return out;
}

/**
 * Extract `{ question, answer }` pairs from every `<FaqDetails>` block in an
 * mdast tree. Headings between questions (the section groupings on
 * `/security/security-faq`) are skipped: they are not part of either field.
 */
export function extractFaqEntries(tree) {
  const entries = [];
  const faqBlocks = [];

  const findBlocks = (node) => {
    for (const child of node.children ?? []) {
      if (isJsx(child, "faqdetails")) {
        faqBlocks.push(child);
        continue;
      }
      findBlocks(child);
    }
  };
  findBlocks(tree);

  for (const block of faqBlocks) {
    for (const details of collectDetails(block)) {
      let question = "";
      const answerNodes = [];

      for (const child of details.children ?? []) {
        if (!question && isJsx(child, "summary")) {
          question = collapseWhitespace(nodeToText(child));
          continue;
        }
        answerNodes.push(child);
      }

      const answer = nodeToText({ type: "root", children: answerNodes }).trim();
      // A question with no answer on the page is exactly what must not be
      // marked up, so drop the pair rather than emitting an empty answer.
      // Deduplicate by question text: the compliance FAQ has section headings
      // that repeat some questions, and duplicate schema.org entries are invalid.
      const alreadySeen = entries.some((e) => e.question === question);
      if (question && answer && !alreadySeen)
        entries.push({ question, answer });
    }
  }

  return entries;
}

/**
 * A literal `</script>` in an answer would close the tag early. `<` carries no
 * meaning inside a JSON string, so escaping it is both safe and sufficient —
 * the block is parsed as JSON, not as JavaScript.
 */
const escapeForScript = (json) => json.replace(/</g, "\\u003c");

/** Build the FAQPage object for a list of extracted entries. */
export function buildFaqPageSchema(entries) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: entries.map(({ question, answer }) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer },
    })),
  };
}

/** Serialise the FAQPage object for embedding in a `<script>` tag. */
export function serializeFaqPageSchema(entries) {
  return escapeForScript(JSON.stringify(buildFaqPageSchema(entries)));
}
