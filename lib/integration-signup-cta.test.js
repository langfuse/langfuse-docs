const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const assert = require("node:assert/strict");
const {
  SIGNUP_CTA_MARKDOWN,
  injectIntegrationSignupCta,
} = require("./integration-signup-cta.js");

function walkMarkdown(dir) {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walkMarkdown(fullPath));
    else if (/\.mdx?$/.test(entry.name)) files.push(fullPath);
  }
  return files;
}

function guideStartIndex(markdown) {
  const lines = markdown.split("\n");
  let index = 0;
  if (lines[0] === "---") {
    index = lines.indexOf("---", 1);
    index = index === -1 ? 0 : index + 1;
  }
  let offset = lines.slice(0, index).join("\n").length;
  if (index > 0) offset += 1;
  let inFence = false;
  for (; index < lines.length; index += 1) {
    const line = lines[index];
    if (/^ {0,3}(?:`{3,}|~{3,})/.test(line)) inFence = !inFence;
    else if (
      !inFence &&
      /^(?: {0,3}#{2,6}(?:\s|$)| {0,3}<(?:Steps|Tabs)\b)/.test(line)
    ) {
      return offset;
    }
    offset += line.length + 1;
  }
  return -1;
}

let insertIntegrationSignupCtaNode;

test.before(async () => {
  ({ insertIntegrationSignupCtaNode } =
    await import("./remark-integration-signup-cta.mjs"));
});

function heading(depth, text) {
  return {
    type: "heading",
    depth,
    children: [{ type: "text", value: text }],
  };
}

function paragraph(text) {
  return { type: "paragraph", children: [{ type: "text", value: text }] };
}

test("inserts the banner before the first section on an integration page", () => {
  const tree = {
    type: "root",
    children: [
      heading(1, "CrewAI"),
      paragraph("Intro"),
      heading(2, "Getting Started"),
      paragraph("Steps"),
    ],
  };

  const inserted = insertIntegrationSignupCtaNode(
    tree,
    "/repo/content/integrations/frameworks/crewai.mdx",
  );

  assert.equal(inserted, true);
  assert.equal(tree.children[2].name, "SignupCTA");
  assert.deepEqual(tree.children[2].attributes, [
    { type: "mdxJsxAttribute", name: "className", value: "my-6" },
  ]);
  assert.equal(tree.children[3].children[0].value, "Getting Started");
});

test("inserts the banner before Steps when the section headings live inside it", () => {
  const tree = {
    type: "root",
    children: [
      heading(1, "Claude Agent SDK"),
      paragraph("Intro"),
      {
        type: "mdxJsxFlowElement",
        name: "Steps",
        attributes: [],
        children: [heading(2, "Step 1: Install Dependencies")],
      },
    ],
  };

  insertIntegrationSignupCtaNode(
    tree,
    "content/integrations/frameworks/claude-agent-sdk.mdx",
  );

  assert.equal(tree.children[2].name, "SignupCTA");
  assert.equal(tree.children[3].name, "Steps");
});

test("markdown export places the banner before a Steps block", () => {
  const markdown = [
    "# Integrate Langfuse with Claude Agent SDK",
    "",
    "Intro paragraph.",
    "",
    "<Steps>",
    "## Step 1: Install Dependencies",
    "</Steps>",
  ].join("\n");

  const result = injectIntegrationSignupCta(
    markdown,
    "integrations/frameworks/claude-agent-sdk.md",
  );

  assert.ok(result.indexOf(SIGNUP_CTA_MARKDOWN) < result.indexOf("<Steps>"));
});

test("every integration page gets one banner before the guide starts", () => {
  const root = path.join(__dirname, "../content/integrations");
  const files = walkMarkdown(root);
  assert.ok(
    files.length >= 140,
    `expected the integration catalog, got ${files.length}`,
  );

  const problems = [];
  for (const file of files) {
    const raw = fs.readFileSync(file, "utf8");
    const rel = path
      .relative(path.join(__dirname, "../content"), file)
      .replace(/\\/g, "/")
      .replace(/\.mdx?$/, ".md");
    const hasOwn = /<SignupCTA\b/.test(raw);
    const result = injectIntegrationSignupCta(raw, rel, {
      sourceHasSignupCta: hasOwn,
    });
    const bannerCount =
      (result.match(/<SignupCTA\b/g) || []).length +
      result.split(SIGNUP_CTA_MARKDOWN).length -
      1;
    const guideAt = guideStartIndex(result);
    const bannerAt = hasOwn
      ? result.indexOf("<SignupCTA")
      : result.indexOf(SIGNUP_CTA_MARKDOWN);
    if (
      bannerCount !== 1 ||
      guideAt === -1 ||
      bannerAt === -1 ||
      bannerAt > guideAt
    ) {
      problems.push(
        `${rel} banners=${bannerCount} bannerAt=${bannerAt} guideAt=${guideAt}`,
      );
    }
  }

  assert.deepEqual(problems, []);
});

test("appends the banner when an integration page has no section heading", () => {
  const tree = {
    type: "root",
    children: [heading(1, "Short"), paragraph("Only an intro")],
  };

  insertIntegrationSignupCtaNode(tree, "content/integrations/other/example.md");

  assert.equal(tree.children.at(-1).name, "SignupCTA");
});

test("does not add a second banner when the page already has one", () => {
  const tree = {
    type: "root",
    children: [
      heading(1, "LangChain"),
      paragraph("Intro"),
      {
        type: "mdxJsxFlowElement",
        name: "SignupCTA",
        attributes: [],
        children: [],
      },
      heading(2, "Getting Started"),
    ],
  };

  const inserted = insertIntegrationSignupCtaNode(
    tree,
    "/repo/content/integrations/frameworks/langchain.mdx",
  );

  assert.equal(inserted, false);
  assert.equal(
    tree.children.filter((child) => child.name === "SignupCTA").length,
    1,
  );
});

test("ignores docs pages and paths that only mention integrations", () => {
  const tree = {
    type: "root",
    children: [heading(1, "Docs"), heading(2, "Section")],
  };

  assert.equal(
    insertIntegrationSignupCtaNode(
      tree,
      "/repo/content/docs/observability/get-started.mdx",
    ),
    false,
  );
  assert.equal(
    insertIntegrationSignupCtaNode(
      tree,
      "/repo/content/guides/integrations-overview.mdx",
    ),
    false,
  );
  assert.equal(tree.children.length, 2);
});

test("markdown export places the same banner before the first section", () => {
  const markdown = [
    "---",
    "title: CrewAI",
    "---",
    "",
    "# Integrate Langfuse with CrewAI",
    "",
    "Intro paragraph.",
    "",
    "## Getting Started",
    "",
    "Steps.",
  ].join("\n");

  const result = injectIntegrationSignupCta(
    markdown,
    "integrations/frameworks/crewai.md",
  );

  const bannerAt = result.indexOf(SIGNUP_CTA_MARKDOWN);
  const sectionAt = result.indexOf("## Getting Started");
  assert.ok(bannerAt > 0);
  assert.ok(bannerAt < sectionAt);
  assert.equal(result.split(SIGNUP_CTA_MARKDOWN).length, 2);
});

test("markdown export skips fenced examples and pages that already include the banner", () => {
  const fenced = [
    "# Page",
    "",
    "```md",
    "## Not a real section",
    "```",
    "",
    "## Real section",
  ].join("\n");

  const result = injectIntegrationSignupCta(fenced, "integrations/other/x.md");
  assert.ok(
    result.indexOf(SIGNUP_CTA_MARKDOWN) < result.indexOf("## Real section"),
  );
  assert.ok(
    result.indexOf(SIGNUP_CTA_MARKDOWN) >
      result.indexOf("## Not a real section"),
  );

  const existing = injectIntegrationSignupCta(
    `# Page\n\n${SIGNUP_CTA_MARKDOWN}\n\n## Section\n`,
    "integrations/frameworks/langchain.md",
  );
  assert.equal(existing.split(SIGNUP_CTA_MARKDOWN).length, 2);

  const fromSource = injectIntegrationSignupCta(
    "# Page\n\n## Section\n",
    "integrations/frameworks/langchain.md",
    { sourceHasSignupCta: true },
  );
  assert.equal(fromSource.includes(SIGNUP_CTA_MARKDOWN), false);
});

test("markdown export leaves other sections unchanged", () => {
  const markdown = "# Docs\n\n## Section\n";
  assert.equal(
    injectIntegrationSignupCta(markdown, "docs/observability/get-started.md"),
    markdown,
  );
});
