/**
 * Insert <SignupCTA className="my-6" /> into every integration page that does
 * not already render one. Placement matches the LangChain page: after the
 * intro and before the guide. The guide starts at the first section heading,
 * or at <Steps> / <Tabs> when those headings live inside the block. Claude
 * Agent SDK and Google ADK are built that way.
 *
 * The component is provided globally by `@/mdx-components`, so generated
 * Markdown and MDX pages do not need an import. Pages that already include
 * <SignupCTA /> are unchanged.
 *
 * This file is inlined into `.source/source.config.mjs`, so it must not import
 * a sibling module. The Markdown export uses the same banner text from
 * `integration-signup-cta.js`.
 */

const INTEGRATION_SOURCE = /(?:^|\/)content\/integrations\/.+\.mdx?$/;

function isIntegrationSourcePath(filePath) {
  if (!filePath) return false;
  return INTEGRATION_SOURCE.test(String(filePath).replaceAll("\\", "/"));
}

const GUIDE_START_COMPONENTS = new Set(["Steps", "Tabs"]);

function isGuideStart(node) {
  if (!node) return false;
  if (node.type === "heading" && node.depth >= 2) return true;
  return (
    node.type === "mdxJsxFlowElement" && GUIDE_START_COMPONENTS.has(node.name)
  );
}

function treeHasSignupCta(node) {
  if (!node || typeof node !== "object") return false;
  if (
    (node.type === "mdxJsxFlowElement" || node.type === "mdxJsxTextElement") &&
    node.name === "SignupCTA"
  ) {
    return true;
  }
  if (!Array.isArray(node.children)) return false;
  return node.children.some((child) => treeHasSignupCta(child));
}

export function insertIntegrationSignupCtaNode(tree, filePath) {
  if (!isIntegrationSourcePath(filePath)) return false;
  if (!tree || !Array.isArray(tree.children)) return false;
  if (treeHasSignupCta(tree)) return false;

  const node = {
    type: "mdxJsxFlowElement",
    name: "SignupCTA",
    attributes: [
      {
        type: "mdxJsxAttribute",
        name: "className",
        value: "my-6",
      },
    ],
    children: [],
  };
  const index = tree.children.findIndex((child) => isGuideStart(child));
  if (index === -1) tree.children.push(node);
  else tree.children.splice(index, 0, node);
  return true;
}

export function remarkIntegrationSignupCta() {
  return (tree, file) => {
    const filePath = file?.path ?? file?.history?.[0];
    insertIntegrationSignupCtaNode(tree, filePath);
  };
}
