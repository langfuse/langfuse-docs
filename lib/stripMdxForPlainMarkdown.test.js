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
