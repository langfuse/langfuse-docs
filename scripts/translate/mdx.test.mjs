import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { test } from "node:test";
import {
  applyMetaStrings,
  buildFrontmatter,
  checkPlaceholders,
  compareStructure,
  headings,
  maskBody,
  metaStrings,
  pinHeadingIds,
  splitFrontmatter,
  unmaskBody,
} from "./mdx.mjs";

const ROOT = path.resolve(import.meta.dirname, "../..");

const SAMPLE = `
import { Callout } from "@/components/ui/callout";
import {
  Tabs,
  Tab,
} from "fumadocs-ui/components/tabs";

# Get started

Install the SDK with \`pip install langfuse\` and see [the docs](/docs/observability/overview).

<Callout type="info">
Traces are sent in the background.
</Callout>

<Tabs items={["Python", "JS/TS"]}>
  <Tab>
    \`\`\`python
    # not a heading
    from langfuse import observe
    \`\`\`
  </Tab>
</Tabs>

## Custom id [#custom]

## Next steps
`;

test("masking and unmasking round-trips", () => {
  const { masked, slots } = maskBody(SAMPLE);
  assert.equal(unmaskBody(masked, slots), SAMPLE);
  assert.ok(
    !masked.includes("pip install") ||
      masked.includes("`pip install langfuse`"),
  );
  assert.ok(!masked.includes("from langfuse import observe"));
  assert.ok(!masked.includes('items={["Python"'));
  assert.ok(masked.includes("Traces are sent in the background."));
});

test("masking round-trips on every docs page", () => {
  const walk = (dir) =>
    fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
      const p = path.join(dir, e.name);
      return e.isDirectory() ? walk(p) : /\.mdx?$/.test(e.name) ? [p] : [];
    });
  const files = [
    "docs",
    "self-hosting",
    "integrations",
    "guides",
    "academy",
  ].flatMap((d) => walk(path.join(ROOT, "content", d)));
  assert.ok(files.length > 100);
  for (const file of files) {
    const { body } = splitFrontmatter(fs.readFileSync(file, "utf8"));
    const { masked, slots } = maskBody(body);
    assert.equal(unmaskBody(masked, slots), body, file);
    assert.deepEqual(checkPlaceholders(masked, slots.length), [], file);
  }
});

test("headings ignore code and follow Fumadocs slugs", () => {
  const { masked } = maskBody(SAMPLE);
  assert.deepEqual(
    headings(masked).map((h) => h.id),
    ["get-started", "custom", "next-steps"],
  );
});

test("pinHeadingIds keeps the English anchors", () => {
  const { masked } = maskBody(SAMPLE);
  const translated = masked
    .replace("# Get started", "# はじめに")
    .replace("## Custom id [#custom]", "## カスタム ID [#custom]")
    .replace("## Next steps", "## 次のステップ");
  const pinned = pinHeadingIds(translated, headings(masked));
  assert.match(pinned, /^# はじめに$/m);
  assert.match(pinned, /^## カスタム ID \[#custom]$/m);
  assert.match(pinned, /^## 次のステップ \[#next-steps]$/m);
});

test("checkPlaceholders reports missing, duplicated and inline placeholders", () => {
  assert.deepEqual(checkPlaceholders("⟦KEEP_0⟧\ntext\n⟦KEEP_1⟧", 2), []);
  assert.match(checkPlaceholders("⟦KEEP_0⟧", 2).join(), /Missing/);
  assert.match(
    checkPlaceholders("⟦KEEP_0⟧\n⟦KEEP_0⟧\n⟦KEEP_1⟧", 2).join(),
    /Duplicated/,
  );
  assert.match(
    checkPlaceholders("text ⟦KEEP_0⟧", 1).join(),
    /alone on its line/,
  );
});

test("compareStructure catches dropped links and changed inline code", () => {
  const en = "## A\n\nSee [docs](/docs) and `flush()`.";
  assert.deepEqual(
    compareStructure(en, "## A'\n\nVoir [la doc](/docs) et `flush()`."),
    [],
  );
  assert.match(
    compareStructure(en, "## A'\n\nVoir la doc et `flush()`.").join(),
    /Missing link targets/,
  );
  assert.match(
    compareStructure(en, "## A'\n\nVoir [la doc](/docs) et `vider()`.").join(),
    /Inline code/,
  );
  assert.match(
    compareStructure(en, "### A'\n\nVoir [la doc](/docs) et `flush()`.").join(),
    /Headings differ/,
  );
});

test("front matter keeps untranslated fields", () => {
  const { data } = splitFrontmatter(
    "---\ntitle: Tracing\ndescription: How tracing works\nsidebarTitle: Tracing\ncanonical: /docs/x\n---\n\nBody",
  );
  const fm = buildFrontmatter(data, {
    title: "Traçage",
    description: "Fonctionnement du traçage",
    canonical: "/fr",
  });
  assert.equal(splitFrontmatter(`${fm}\nBody`).data.title, "Traçage");
  assert.equal(splitFrontmatter(`${fm}\nBody`).data.canonical, "/docs/x");
});

test("meta.json labels are translated, slugs are kept", () => {
  const meta = {
    title: "Docs",
    pages: [
      "index",
      "---Get Started---",
      "[Start Tracing](/docs/observability/get-started)",
      "external:[Support ↗](/support)",
    ],
  };
  assert.deepEqual(metaStrings(meta), [
    "Docs",
    "Get Started",
    "Start Tracing",
    "Support ↗",
  ]);
  const out = applyMetaStrings(meta, {
    Docs: "Docs",
    "Get Started": "Premiers pas",
    "Start Tracing": "Commencer le traçage",
    "Support ↗": "Support ↗",
  });
  assert.deepEqual(out.pages, [
    "index",
    "---Premiers pas---",
    "[Commencer le traçage](/docs/observability/get-started)",
    "external:[Support ↗](/support)",
  ]);
});
