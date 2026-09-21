const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");
const {
  replaceComponentsWithMarkdown,
} = require("../lib/markdown-component-renderers.js");

test("FAQ Markdown preserves YAML tag formats and the Other fallback", () => {
  const cwd = process.cwd();
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "faq-markdown-"));
  const directory = path.join(root, "content", "faq", "all");
  fs.mkdirSync(directory, { recursive: true });
  const entries = {
    inline: 'title: Inline tags\ntags: [self-hosting, "tag, with comma"]',
    block: 'title: "Block: tags"\ntags:\n  - self-hosting # comment\n  - other',
    empty: "title: Empty tags\ntags: []",
    missing: "title: Missing tags",
  };
  try {
    for (const [slug, frontmatter] of Object.entries(entries)) {
      fs.writeFileSync(
        path.join(directory, `${slug}.mdx`),
        `---\n${frontmatter}\n---\nBody`,
      );
    }
    process.chdir(root);
    assert.equal(
      replaceComponentsWithMarkdown(
        '<FaqPreview tags={["self-hosting"]} />',
      ).trim(),
      [
        "- [Block: tags](/faq/all/block)",
        "- [Inline tags](/faq/all/inline)",
        "- [Ask anything else](/docs/ask-ai)",
      ].join("\n"),
    );
    const other = replaceComponentsWithMarkdown(
      '<FaqPreview tags={["Other"]} />',
    );
    assert.match(other, /\[Empty tags\]\(\/faq\/all\/empty\)/);
    assert.match(other, /\[Missing tags\]\(\/faq\/all\/missing\)/);
    const cards = replaceComponentsWithMarkdown(
      '<FaqPreview tags={["tag, with comma"]} renderAsCards />',
    );
    assert.equal(cards.trim(), "- [Inline tags](/faq/all/inline)");
  } finally {
    process.chdir(cwd);
    fs.rmSync(root, { recursive: true, force: true });
  }
});
