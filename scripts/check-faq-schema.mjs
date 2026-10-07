#!/usr/bin/env node
/**
 * Assert the FAQPage JSON-LD that `lib/remark-faq-schema.mjs` is supposed to
 * emit is actually present in the built pages — and absent everywhere it must
 * not be.
 *
 * Unit tests cover the extractor with hand-built trees, which cannot catch the
 * failure that matters most here: the plugin reads the opt-in flag from
 * `file.data.frontmatter`, a Fumadocs contract. If that ever stops being
 * populated the plugin emits nothing, every page silently loses its markup,
 * and a tree-level test still passes. This runs against the real rendered
 * HTML, so that regression fails the build.
 *
 * Usage: node scripts/check-faq-schema.js [baseUrl]
 */

const BASE_URL =
  process.argv[2] ?? process.env.BASE_URL ?? "http://127.0.0.1:3333";

// Pages that author their Q&A inline, with the number of questions expected.
// Keep in sync with the `faqSchema: true` pages asserted in
// scripts/seo-discovery.test.js.
const EXPECTED = [
  ["/security/privacy-faq", 8],
  ["/security/compliance-faq", 13],
  ["/security/security-faq", 40],
  ["/enterprise", 9],
];

// FAQPage is only valid when the answers are on the page. These must never
// carry it: a link-only hub, and marketing FAQs whose accordion ships just the
// open panel.
const FORBIDDEN = ["/faq", "/pricing", "/pricing-self-host"];

const LD_RE =
  /<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g;

const unescapeHtml = (value) =>
  value
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");

async function faqPagesFor(route) {
  const response = await fetch(`${BASE_URL}${route}`);
  if (!response.ok) {
    throw new Error(`${route} responded ${response.status}`);
  }

  const html = await response.text();
  const found = [];
  for (const [, body] of html.matchAll(LD_RE)) {
    let parsed;
    try {
      parsed = JSON.parse(unescapeHtml(body));
    } catch (error) {
      throw new Error(`${route} has JSON-LD that does not parse: ${error}`);
    }
    if (parsed["@type"] === "FAQPage") found.push(parsed);
  }
  return found;
}

const failures = [];
const fail = (message) => failures.push(message);

for (const [route, expectedCount] of EXPECTED) {
  let blocks;
  try {
    blocks = await faqPagesFor(route);
  } catch (error) {
    fail(`${route}: ${error.message}`);
    continue;
  }

  if (blocks.length !== 1) {
    fail(`${route}: expected exactly 1 FAQPage block, found ${blocks.length}`);
    continue;
  }

  const schema = blocks[0];
  const questions = schema.mainEntity ?? [];

  if (schema["@context"] !== "https://schema.org") {
    fail(`${route}: @context is ${JSON.stringify(schema["@context"])}`);
  }
  if (questions.length !== expectedCount) {
    fail(
      `${route}: expected ${expectedCount} questions, found ${questions.length}`,
    );
  }

  for (const [index, question] of questions.entries()) {
    const answer = question.acceptedAnswer;
    const where = `${route} question ${index + 1}`;
    if (question["@type"] !== "Question") {
      fail(`${where}: @type is ${JSON.stringify(question["@type"])}`);
    }
    if (!question.name?.trim()) fail(`${where}: empty name`);
    if (answer?.["@type"] !== "Answer") {
      fail(
        `${where}: acceptedAnswer @type is ${JSON.stringify(answer?.["@type"])}`,
      );
    }
    if (!answer?.text?.trim()) {
      fail(
        `${where}: acceptedAnswer has no text — the answer must be on the page`,
      );
    }
  }

  console.log(`ok  ${route} — FAQPage with ${questions.length} questions`);
}

for (const route of FORBIDDEN) {
  let blocks;
  try {
    blocks = await faqPagesFor(route);
  } catch (error) {
    fail(`${route}: ${error.message}`);
    continue;
  }

  if (blocks.length !== 0) {
    fail(
      `${route}: must not claim FAQPage — its answers are not on the page — found ${blocks.length} block(s)`,
    );
    continue;
  }

  console.log(`ok  ${route} — no FAQPage, as required`);
}

if (failures.length > 0) {
  console.error(`\nFAQPage JSON-LD check failed:`);
  for (const failure of failures) console.error(`  - ${failure}`);
  process.exit(1);
}

console.log(`\nSuccess: FAQPage JSON-LD is correct on all checked pages.`);
