const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { buildCanonicalUrl } = require("../lib/og-url.ts");
const { getAllFaqTags, getFaqTags } = require("../lib/faq-tags.ts");
const { isSearchUtility } = require("../lib/search-index-policy.js");
const {
  extractFaqEntries,
  buildFaqPageSchema,
  serializeFaqPageSchema,
} = require("../lib/faq-schema.mjs");

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

// --- FAQPage JSON-LD -------------------------------------------------------
// FAQPage is only valid when the answers are visible on the page, so these
// guard the two ways that can go wrong: marking up a page whose answers live
// elsewhere, and drifting from the prose actually rendered.

const jsx = (name, children, type = "mdxJsxFlowElement") => ({
  type,
  name,
  attributes: [],
  children,
});
const text = (value) => ({ type: "text", value });
const para = (children) => ({ type: "paragraph", children });
const qa = (question, answer) =>
  jsx("Details", [jsx("Summary", [text(question)]), para(answer)]);

test("FAQPage entries come from inline Q&A, skipping section headings", () => {
  const tree = jsx("root", [
    jsx("FaqDetails", [
      qa("Is data encrypted?", [text("Yes, in transit and at rest.")]),
      { type: "heading", depth: 2, children: [text("Identity & Access")] },
      qa("Which auth options?", [text("SSO, email and social login.")]),
    ]),
  ]);

  assert.deepEqual(extractFaqEntries(tree), [
    { question: "Is data encrypted?", answer: "Yes, in transit and at rest." },
    { question: "Which auth options?", answer: "SSO, email and social login." },
  ]);
});

test("answer text matches the rendered prose — links collapse to their label", () => {
  const tree = jsx("root", [
    jsx("FaqDetails", [
      qa("Can we sign a DPA?", [
        text("Yes. You can enter into a "),
        { type: "link", url: "/dpa", children: [text("DPA")] },
        text(" with Langfuse."),
      ]),
    ]),
  ]);

  assert.deepEqual(extractFaqEntries(tree), [
    {
      question: "Can we sign a DPA?",
      answer: "Yes. You can enter into a DPA with Langfuse.",
    },
  ]);
});

test("link lists and unanswered questions produce no FAQPage entries", () => {
  // <FaqPreview /> and <FaqIndex /> are component invocations: they have no
  // <Details> children in the page's own tree, so they cannot be marked up.
  const linkList = jsx("root", [
    jsx("FaqDetails", [jsx("FaqPreview", []), jsx("FaqIndex", [])]),
  ]);
  assert.deepEqual(extractFaqEntries(linkList), []);

  // A question whose answer is not on the page must be dropped, not emitted
  // with an empty string.
  const unanswered = jsx("root", [
    jsx("FaqDetails", [jsx("Details", [jsx("Summary", [text("Why?")])])]),
  ]);
  assert.deepEqual(extractFaqEntries(unanswered), []);

  // Q&A outside a <FaqDetails> block is not part of a FAQ listing.
  const loose = jsx("root", [qa("Stray?", [text("Not in a FAQ block.")])]);
  assert.deepEqual(extractFaqEntries(loose), []);
});

test("a nested disclosure belongs to its parent answer, not to a question", () => {
  const tree = jsx("root", [
    jsx("FaqDetails", [
      jsx("Details", [
        jsx("Summary", [text("Outer?")]),
        para([text("Outer answer.")]),
        jsx("Details", [
          jsx("Summary", [text("Inner?")]),
          para([text("Inner answer.")]),
        ]),
      ]),
    ]),
  ]);

  const entries = extractFaqEntries(tree);
  assert.equal(entries.length, 1);
  assert.equal(entries[0].question, "Outer?");
  assert.match(entries[0].answer, /Outer answer\./);
});

test("serialized FAQPage is valid JSON and cannot break out of the script tag", () => {
  const entries = [
    { question: "Does </script> break it?", answer: "No, < is escaped." },
  ];

  const schema = buildFaqPageSchema(entries);
  assert.equal(schema["@context"], "https://schema.org");
  assert.equal(schema["@type"], "FAQPage");
  assert.deepEqual(schema.mainEntity, [
    {
      "@type": "Question",
      name: "Does </script> break it?",
      acceptedAnswer: { "@type": "Answer", text: "No, < is escaped." },
    },
  ]);

  const serialized = serializeFaqPageSchema(entries);
  assert.ok(!serialized.includes("<"), "no raw < may reach the script body");
  assert.deepEqual(JSON.parse(serialized), schema);
});

test("only pages with inline answers opt in to faqSchema", () => {
  const contentDir = path.join(__dirname, "..", "content");
  const optedIn = [];

  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(full);
      } else if (entry.name.endsWith(".mdx")) {
        const source = fs.readFileSync(full, "utf8");
        if (/^faqSchema:\s*true\s*$/m.test(source)) {
          optedIn.push([path.relative(contentDir, full), source]);
        }
      }
    }
  };
  walk(contentDir);

  assert.deepEqual(
    optedIn.map(([file]) => file).sort(),
    [
      "marketing/enterprise.mdx",
      "security/compliance-faq.mdx",
      "security/privacy-faq.mdx",
      "security/security-faq.mdx",
    ],
    "opting a page in requires its answers to be on the page — review carefully",
  );

  for (const [file, source] of optedIn) {
    assert.ok(
      /<FaqDetails>/.test(source) && /<Summary>/.test(source),
      `${file} must author its Q&A inline to claim FAQPage`,
    );
    assert.ok(
      !/<FaqPreview\b/.test(source) && !/<FaqIndex\b/.test(source),
      `${file} links to answers held elsewhere and must not claim FAQPage`,
    );
  }
});
