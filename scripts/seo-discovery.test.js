const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { buildCanonicalUrl } = require("../lib/og-url.ts");
const { getAllFaqTags, getFaqTags } = require("../lib/faq-tags.ts");
const { isSearchUtility } = require("../lib/search-index-policy.js");
const {
  calculateCloudPricingBreakdown,
  CLOUD_PRICING_VALUES,
} = require("../lib/cloud-pricing.js");
const {
  replaceComponentsWithMarkdown,
} = require("../lib/markdown-component-renderers.js");

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

test("graduated billing remains correct at tier boundaries", () => {
  assert.equal(calculateCloudPricingBreakdown(200000)[1].tierRate, "$8/100k");
  for (const [units, expected] of [
    [0, 0],
    [100000, 0],
    [100001, 0.00008],
    [1000000, 72],
    [10000000, 702],
    [50000000, 3302],
    [100000000, 6302],
  ]) {
    const breakdown = calculateCloudPricingBreakdown(units);
    assert.equal(
      breakdown.reduce((sum, t) => sum + t.eventsInTier, 0),
      units,
    );
    const cost = breakdown.reduce((sum, t) => sum + t.costForTier, 0);
    assert(Math.abs(cost - expected) < 1e-9, `${units} units: ${cost}`);
  }
});

test("pricing Markdown preserves shared facts, examples, and commercial links", () => {
  const source = fs.readFileSync(
    path.join(__dirname, "../md-override/pricing.md"),
    "utf8",
  );
  const markdown = replaceComponentsWithMarkdown(source);
  for (const value of Object.values(CLOUD_PRICING_VALUES)) {
    assert(markdown.includes(value), value);
  }
  for (const text of [
    "$37.00/month",
    "$8,801.00/month",
    "3 years of history",
    "HIPAA-ready region",
    "](/pricing-self-host)",
    "](/security)",
    "](/talk-to-us?deployment=cloud)",
  ]) {
    assert(markdown.includes(text), text);
  }
  assert(!markdown.includes("<CloudPricing"));
  assert(!markdown.includes("<CloudUsagePricing"));
  assert.throws(() =>
    replaceComponentsWithMarkdown('<CloudPricingValue name="typo" />'),
  );
});
