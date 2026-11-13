"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");
const { stripMdxForPlainMarkdown } = require("./stripMdxForPlainMarkdown");

test("guide cards preserve titles, descriptions, and links in Markdown", () => {
  const { readFileSync } = require("node:fs");
  const { join } = require("node:path");
  const {
    replaceComponentsWithMarkdown,
  } = require("./markdown-component-renderers");
  const source = readFileSync(
    join(__dirname, "../content/guides/index.mdx"),
    "utf8",
  );
  const markdown = stripMdxForPlainMarkdown(
    replaceComponentsWithMarkdown(source),
  );

  assert.doesNotMatch(markdown, /<\/?TutorialCards?\b|icon=|^\s*}\s*$/m);
  for (const card of source.matchAll(
    /<TutorialCard\s+title="([^"]+)"\s+description="([^"]+)"\s+href="([^"]+)"/g,
  )) {
    assert.ok(markdown.includes(`- [${card[1]}](${card[3]}): ${card[2]}`));
  }
  assert.ok(markdown.includes("/guides/set-up-langfuse-for-teams"));
  assert.ok(markdown.includes("/guides/operate-langfuse-across-teams"));
});

test("tab groups become bold labels followed by their content", () => {
  const input = [
    "Intro.",
    "",
    '<Tabs items={["Cost-ready", "One trace per LLM call"]}>',
    "<Tab>",
    "",
    "First trace.",
    "",
    "</Tab>",
    "<Tab>",
    "",
    "Second trace.",
    "",
    "</Tab>",
    "</Tabs>",
    "",
    "Outro.",
  ].join("\n");

  const out = stripMdxForPlainMarkdown(input);

  assert.doesNotMatch(out, /<\/?Tabs?\b/);
  assert.match(out, /\*\*Cost-ready\*\*\n\nFirst trace\./);
  assert.match(out, /\*\*One trace per LLM call\*\*\n\nSecond trace\./);
  assert.ok(out.indexOf("Cost-ready") < out.indexOf("One trace per LLM call"));
});

test("labels survive fenced code inside tabs and apply in document order", () => {
  const input = [
    '<LangTabs items={["Python", "JS/TS"]}>',
    "<Tab>",
    "```python",
    "print('<Tab> inside a fence stays untouched')",
    "```",
    "</Tab>",
    "<Tab>",
    "```ts",
    "console.log(1);",
    "```",
    "</Tab>",
    "</LangTabs>",
    "",
    '<Tabs items={["Langfuse v3", "Langfuse v2"]}>',
    "<Tab>v3 notes</Tab>",
    "<Tab>v2 notes</Tab>",
    "</Tabs>",
  ].join("\n");

  const out = stripMdxForPlainMarkdown(input);

  assert.match(out, /\*\*Python\*\*\n\n```python/);
  assert.match(out, /\*\*JS\/TS\*\*\n\n```ts/);
  assert.match(out, /\*\*Langfuse v3\*\*\n\nv3 notes/);
  assert.match(out, /\*\*Langfuse v2\*\*\n\nv2 notes/);
  assert.match(out, /print\('<Tab> inside a fence stays untouched'\)/);
  const outsideFences = out.replace(/```[\s\S]*?```/g, "");
  assert.doesNotMatch(outsideFences, /<\/?(?:Lang)?Tabs?\b/);
});

test("callouts containing fenced code are unwrapped", () => {
  const input = [
    '<Callout type="info">',
    "",
    "Use this config:",
    "",
    "```json",
    '{ "a": "<Callout>" }',
    "```",
    "",
    "</Callout>",
  ].join("\n");

  const out = stripMdxForPlainMarkdown(input);

  assert.match(out, /Use this config:\n\n```json/);
  assert.match(out, /\{ "a": "<Callout>" \}/);
  const outsideFences = out.replace(/```[\s\S]*?```/g, "");
  assert.doesNotMatch(outsideFences, /<\/?Callout\b/);
});

test("callouts preserve their text", () => {
  const input = '<Callout type="info">\nNote.\n</Callout>';
  assert.match(stripMdxForPlainMarkdown(input), /^\s*Note\.\s*$/);
});

test("demo intro exports as prose with emphasis, not HTML or a code block", async () => {
  const { readFileSync } = require("node:fs");
  const { join } = require("node:path");
  const { remark } = await import("remark");
  const {
    replaceComponentsWithMarkdown,
  } = require("./markdown-component-renderers");
  const source = readFileSync(
    join(__dirname, "../content/docs/demo.mdx"),
    "utf8",
  );
  const intro = source.slice(
    source.indexOf("# Example Project"),
    source.indexOf("<Callout"),
  );
  const markdown = stripMdxForPlainMarkdown(
    replaceComponentsWithMarkdown(intro),
  );
  const paragraphs = remark()
    .parse(markdown)
    .children.filter((node) => node.type !== "heading");

  assert.deepEqual(
    paragraphs.map((token) => token.type),
    ["paragraph", "paragraph"],
  );
  assert.ok(paragraphs[0].children.some((node) => node.type === "strong"));
  assert.equal(
    paragraphs[1].children.map((node) => node.value ?? "").join(""),
    "Try an app below, then inspect its trace in Langfuse.",
  );
});
