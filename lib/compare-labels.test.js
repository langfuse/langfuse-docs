"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");
const {
  comparePageLabel,
  comparePathnameSlug,
  formatCompareIndexLine,
} = require("./compare-labels");

test("comparePathnameSlug ignores the section index", () => {
  assert.equal(comparePathnameSlug("/compare"), null);
  assert.equal(comparePathnameSlug("/compare/"), null);
  assert.equal(comparePathnameSlug("https://langfuse.com/compare"), null);
});

test("comparePathnameSlug reads the competitor slug", () => {
  assert.equal(comparePathnameSlug("/compare/langsmith"), "langsmith");
  assert.equal(
    comparePathnameSlug("https://langfuse.com/compare/arize-phoenix"),
    "arize-phoenix",
  );
});

test("comparePageLabel uses brand names and title-cases unknown slugs", () => {
  assert.equal(comparePageLabel("langsmith"), "LangSmith");
  assert.equal(comparePageLabel("new-vendor"), "New Vendor");
});

test("formatCompareIndexLine lists only pages that exist", () => {
  const line = formatCompareIndexLine([
    { url: "https://langfuse.com/compare" },
    { url: "https://langfuse.com/compare/langsmith" },
    { url: "https://langfuse.com/compare/braintrust" },
  ]);
  assert.match(
    line,
    /\[LangSmith\]\(https:\/\/langfuse.com\/compare\/langsmith.md\)/,
  );
  assert.match(
    line,
    /\[Braintrust\]\(https:\/\/langfuse.com\/compare\/braintrust.md\)/,
  );
  assert.doesNotMatch(line, /Galileo/);
  assert.doesNotMatch(line, /\/compare\.md/);
});

test("formatCompareIndexLine includes a newly added compare page", () => {
  const line = formatCompareIndexLine([
    { url: "https://langfuse.com/compare/langsmith" },
    { url: "https://langfuse.com/compare/helix" },
  ]);
  assert.match(line, /\[Helix\]\(https:\/\/langfuse.com\/compare\/helix.md\)/);
});

test("formatCompareIndexLine is empty when there are no competitor pages", () => {
  assert.equal(
    formatCompareIndexLine([{ url: "https://langfuse.com/compare" }]),
    "",
  );
  assert.equal(formatCompareIndexLine([]), "");
});
