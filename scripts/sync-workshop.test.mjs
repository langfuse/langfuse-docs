import assert from "node:assert/strict";
import test from "node:test";
import { rewriteMarkdownReferences } from "./sync-workshop.mjs";

const SOURCE_PATH = "docs/learner/04-monitoring.md";
const RAW_IMAGE_BASE =
  "https://raw.githubusercontent.com/langfuse/langfuse-workshop/main/docs/images/monitoring";

function rewrite(markdown) {
  return rewriteMarkdownReferences(markdown, SOURCE_PATH, new Map());
}

test("rewrites relative HTML image sources and preserves sizing attributes", () => {
  const markdown =
    '<img src="../images/monitoring/mapping.png" alt="Map variables." width="400" />';

  assert.equal(
    rewrite(markdown),
    `<img src="${RAW_IMAGE_BASE}/mapping.png" alt="Map variables." width="400" />`,
  );
});

test("rewrites multiline HTML images with single-quoted sources", () => {
  const markdown = `<img
  width="400"
  src='../images/monitoring/mapping image.png'
  alt="Map variables."
/>`;

  assert.equal(
    rewrite(markdown),
    `<img
  width="400"
  src='${RAW_IMAGE_BASE}/mapping%20image.png'
  alt="Map variables."
/>`,
  );
});

test("leaves absolute HTML image sources and code examples unchanged", () => {
  const absolute = '<img src="https://example.com/image.png" width="400" />';
  const dataSource =
    '<img data-src="../images/monitoring/lazy.png" width="400" />';
  const inlineCode =
    '`<img src="../images/monitoring/inline.png" width="400" />`';
  const fencedCode = `\`\`\`html
<img src="../images/monitoring/fenced.png" width="400" />
\`\`\``;

  assert.equal(rewrite(absolute), absolute);
  assert.equal(rewrite(dataSource), dataSource);
  assert.equal(rewrite(inlineCode), inlineCode);
  assert.equal(rewrite(fencedCode), fencedCode);
});

test("continues to rewrite Markdown image sources", () => {
  assert.equal(
    rewrite("![Map variables.](../images/monitoring/mapping.png)"),
    `![Map variables.](${RAW_IMAGE_BASE}/mapping.png)`,
  );
});

test("preserves dollar replacement tokens in HTML image URLs", () => {
  const absolute =
    '<img src="https://example.com/image.png?literal=$&$1$$" width="400" />';
  const relative =
    '<img src="../images/monitoring/mapping.png?literal=$&$1$$" width="400" />';

  assert.equal(rewrite(absolute), absolute);
  assert.equal(
    rewrite(relative),
    `<img src="${RAW_IMAGE_BASE}/mapping.png?literal=$&$1$$" width="400" />`,
  );
});
