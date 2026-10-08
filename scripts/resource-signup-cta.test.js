const test = require("node:test");
const assert = require("node:assert/strict");
const { hasResourceSignupCta } = require("../lib/resource-signup-cta.js");

test("includes the engineering index and all articles, including future pages", () => {
  for (const pathname of [
    "/resources/engineering",
    "/resources/engineering/",
    "/resources/engineering/ai-agent-evaluation",
    "/resources/engineering/langfuse-sdk-performance-test",
    "/resources/engineering/a-future-resource",
    "/resources/engineering/a-future-category/article",
  ]) {
    assert.equal(hasResourceSignupCta(pathname), true, pathname);
  }
});

test("does not add a footer to other sections or similarly named paths", () => {
  for (const pathname of [
    "/resources",
    "/resources/product/article",
    "/resources/engineering-other",
    "/resources/engineering-other/article",
    "/docs/observability/get-started",
    "/guides/cookbook/example",
    "/compare/langsmith",
    "/agents",
  ]) {
    assert.equal(hasResourceSignupCta(pathname), false, pathname);
  }
});
