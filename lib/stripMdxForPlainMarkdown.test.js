"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");
const { stripMdxForPlainMarkdown } = require("./stripMdxForPlainMarkdown");

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

  const out = stripMdxForPlainMarkdown(input, {
    unwrapCalloutsForPlainMd: true,
  });

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

  const out = stripMdxForPlainMarkdown(input, {
    unwrapCalloutsForPlainMd: false,
  });

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

  const out = stripMdxForPlainMarkdown(input, {
    unwrapCalloutsForPlainMd: true,
  });

  assert.match(out, /Use this config:\n\n```json/);
  assert.match(out, /\{ "a": "<Callout>" \}/);
  const outsideFences = out.replace(/```[\s\S]*?```/g, "");
  assert.doesNotMatch(outsideFences, /<\/?Callout\b/);
});

test("callout handling is unchanged", () => {
  const input = '<Callout type="info">\nNote.\n</Callout>';
  assert.match(
    stripMdxForPlainMarkdown(input, { unwrapCalloutsForPlainMd: true }),
    /^\s*Note\.\s*$/,
  );
  assert.match(
    stripMdxForPlainMarkdown(input, { unwrapCalloutsForPlainMd: false }),
    /<Callout type="info">/,
  );
});

test("badge labels survive as parentheticals in plain markdown", () => {
  const {
    replaceComponentsWithMarkdown,
  } = require("./markdown-component-renderers");
  const input = [
    '- Extend [Hardening for Government](/self-hosting/configuration/hardening#hardening-for-government){" "}',
    '  <Badge variant="outline" className="align-middle">',
    "    Enterprise",
    '  </Badge>{" "}',
    "  with documentation for a complete air-gapped deployment stack.",
    "",
    "```mdx",
    '<Badge variant="outline">Enterprise</Badge>',
    "```",
  ].join("\n");

  const out = stripMdxForPlainMarkdown(replaceComponentsWithMarkdown(input), {
    unwrapCalloutsForPlainMd: true,
  });

  assert.match(out, /Hardening for Government[\s\S]*\(Enterprise\)/);
  assert.match(
    out,
    /```mdx\n<Badge variant="outline">Enterprise<\/Badge>\n```/,
  );
  const outsideFences = out.replace(/```[\s\S]*?```/g, "");
  assert.doesNotMatch(outsideFences, /<Badge\b/);
});

test("demo intro exports as prose with emphasis, not HTML or a code block", () => {
  const { readFileSync } = require("node:fs");
  const { join } = require("node:path");
  const { marked } = require("marked");
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
  const paragraphs = marked
    .lexer(markdown)
    .filter((token) => token.type !== "space" && token.type !== "heading");

  assert.deepEqual(
    paragraphs.map((token) => token.type),
    ["paragraph", "paragraph"],
  );
  assert.ok(paragraphs[0].tokens.some((token) => token.type === "strong"));
  assert.equal(
    paragraphs[1].text,
    "Try an app below, then inspect its trace in Langfuse.",
  );
});
