const { test } = require("node:test");
const assert = require("node:assert/strict");
const { buildCanonicalUrl } = require("../lib/og-url.ts");
const { getAllFaqTags, getFaqTags } = require("../lib/faq-tags.ts");
const { primitiveOnly } = require("../lib/mdx-frontmatter.ts");
const { isSearchUtility } = require("../lib/search-index-policy.js");

test("canonicals remove fragments without dropping pagination or changing hosts", () => {
  assert.equal(buildCanonicalUrl("/#features"), "https://langfuse.com/");
  assert.equal(
    buildCanonicalUrl("/docs/observability/overview#traces"),
    "https://langfuse.com/docs/observability/overview",
  );
  assert.equal(
    buildCanonicalUrl("https://langfuse.com/changelog?page=2#updates"),
    "https://langfuse.com/changelog?page=2",
  );
  assert.equal(
    buildCanonicalUrl("https://example.com/original#section"),
    "https://example.com/original",
  );
});

test("FAQ tags are derived from articles, with a consistent Other fallback", () => {
  const pages = [
    { url: "/faq", data: {} },
    { url: "/faq/all", data: {} },
    { url: "/faq/tag/category", data: { tags: ["not-an-article"] } },
    { url: "/faq/all/tagged", data: { tags: ["self-hosting"] } },
    { url: "/faq/all/untagged", data: {} },
    { url: "/faq/all/empty", data: { tags: [] } },
  ];
  assert.deepEqual(getAllFaqTags(pages), ["self-hosting", "Other"]);
  assert.deepEqual(getFaqTags(pages[4]), ["Other"]);
  assert.deepEqual(getFaqTags(pages[5]), ["Other"]);
});

test("search utility policy keeps the login landing page indexable, excluding deep links and tags", () => {
  for (const route of ["/cloud/project/123", "/faq/tag/Other"]) {
    assert.equal(isSearchUtility(route), true);
  }
  for (const route of [
    "/cloud",
    "/faq",
    "/faq/all/migration",
    "/changelog",
    "/docs",
  ]) {
    assert.equal(isSearchUtility(route), false);
  }
});

test("frontmatter copies primitive fields without evaluating lazy MDX outputs", () => {
  const frontmatter = {
    title: "Release notes",
    date: "2026-11-22",
    draft: false,
    order: 2,
    optional: null,
    authors: ["author"],
  };
  const pageData = {
    ...frontmatter,
    body: () => {},
    info: { path: "release.mdx" },
    get structuredData() {
      assert.fail("copying frontmatter must not render the MDX document");
    },
  };
  assert.deepEqual(primitiveOnly(pageData), frontmatter);
});
