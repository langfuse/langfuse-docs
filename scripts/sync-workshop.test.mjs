import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import {
  downloadRepo,
  rewriteMarkdownReferences,
  syncFromRepo,
} from "./sync-workshop.mjs";

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

async function makeTempDir() {
  return fs.mkdtemp(path.join(os.tmpdir(), "workshop-sync-test-"));
}

async function buildFixtureTarball() {
  const dir = await makeTempDir();
  const root = path.join(dir, "langfuse-workshop-main");
  await fs.mkdir(path.join(root, "docs", "learner"), { recursive: true });
  await fs.writeFile(path.join(root, "README.md"), "# Workshop\n");
  await fs.writeFile(
    path.join(root, "docs", "learner", "01-setup.md"),
    "# Setup\n",
  );
  execFileSync("tar", ["-czf", "repo.tar.gz", "langfuse-workshop-main"], {
    cwd: dir,
  });
  const tarball = await fs.readFile(path.join(dir, "repo.tar.gz"));
  await fs.rm(dir, { recursive: true, force: true });
  return tarball;
}

function failingBodyResponse() {
  return new Response(
    new ReadableStream({
      start(controller) {
        controller.error(new TypeError("terminated"));
      },
    }),
  );
}

async function withStubbedFetch(responses, run) {
  const originalFetch = globalThis.fetch;
  const originalWarn = console.warn;
  let calls = 0;
  globalThis.fetch = async () => responses[calls++]();
  console.warn = () => {};
  try {
    await run();
  } finally {
    globalThis.fetch = originalFetch;
    console.warn = originalWarn;
  }
  return calls;
}

test("downloadRepo extracts the archive without its top-level directory", async () => {
  const tarball = await buildFixtureTarball();
  const targetDir = await makeTempDir();

  const calls = await withStubbedFetch(
    [() => new Response(tarball)],
    async () => {
      const repoDir = await downloadRepo(targetDir);
      assert.equal(
        await fs.readFile(
          path.join(repoDir, "docs", "learner", "01-setup.md"),
          "utf8",
        ),
        "# Setup\n",
      );
    },
  );

  assert.equal(calls, 1);
  await fs.rm(targetDir, { recursive: true, force: true });
});

test("downloadRepo retries when the body or archive is broken", async () => {
  const tarball = await buildFixtureTarball();
  const targetDir = await makeTempDir();

  const calls = await withStubbedFetch(
    [
      failingBodyResponse,
      () => new Response(tarball.subarray(0, 20)),
      () => new Response(tarball),
    ],
    async () => {
      const repoDir = await downloadRepo(targetDir);
      assert.equal(
        await fs.readFile(path.join(repoDir, "README.md"), "utf8"),
        "# Workshop\n",
      );
    },
  );

  assert.equal(calls, 3);
  await fs.rm(targetDir, { recursive: true, force: true });
});

test("downloadRepo does not retry a missing repository", async () => {
  const targetDir = await makeTempDir();

  const calls = await withStubbedFetch(
    [() => new Response("Not Found", { status: 404 })],
    async () => {
      await assert.rejects(downloadRepo(targetDir), /404/);
    },
  );

  assert.equal(calls, 1);
  await fs.rm(targetDir, { recursive: true, force: true });
});

async function writeFixture(repoDir, files) {
  for (const [relativePath, content] of Object.entries(files)) {
    const target = path.join(repoDir, relativePath);
    await fs.mkdir(path.dirname(target), { recursive: true });
    await fs.writeFile(target, content);
  }
}

async function readJson(filePath) {
  return JSON.parse(await fs.readFile(filePath, "utf8"));
}

test("syncFromRepo nests a lesson folder's pages under the lesson", async () => {
  const repoDir = await makeTempDir();
  const outputDir = await makeTempDir();
  await writeFixture(repoDir, {
    "README.md": "# Workshop\n",
    "docs/learner/00-setup.md": "# 00 Setup\n",
    "docs/learner/04-monitoring.md": [
      "# 04 Monitoring",
      "",
      "Start with [4.1](./04-monitoring/error-analysis.md), then [4.2](./04-monitoring/capturing-signals.md).",
      "",
    ].join("\n"),
    "docs/learner/04-monitoring/capturing-signals.md":
      "# 4.2 Capturing signals\n\nBack to [05](../05-dataset.md).\n",
    "docs/learner/04-monitoring/error-analysis.md": "# 4.1 Error analysis\n",
    "docs/learner/05-dataset.md":
      "# 05 Dataset\n\nSee [4.1](./04-monitoring/error-analysis.md#seed).\n",
    "docs/instructor/00-setup.md":
      "# 00 Setup\n\nSee [4.2](../learner/04-monitoring/capturing-signals.md).\n",
  });

  await syncFromRepo(repoDir, outputDir);

  const learnerDir = path.join(outputDir, "learner");
  assert.deepEqual((await readJson(path.join(learnerDir, "meta.json"))).pages, [
    "00-setup",
    "04-monitoring",
    "05-dataset",
  ]);
  assert.deepEqual(
    await readJson(path.join(learnerDir, "04-monitoring", "meta.json")),
    { pages: ["error-analysis", "capturing-signals"] },
  );
  await fs.access(path.join(learnerDir, "04-monitoring", "index.mdx"));
  await assert.rejects(fs.access(path.join(learnerDir, "04-monitoring.mdx")));

  const lesson = await fs.readFile(
    path.join(learnerDir, "04-monitoring", "index.mdx"),
    "utf8",
  );
  assert.match(
    lesson,
    /\[4\.1\]\(\/workshop\/learner\/04-monitoring\/error-analysis\)/,
  );
  const subPage = await fs.readFile(
    path.join(learnerDir, "04-monitoring", "capturing-signals.mdx"),
    "utf8",
  );
  assert.match(subPage, /\[05\]\(\/workshop\/learner\/05-dataset\)/);
  const dataset = await fs.readFile(
    path.join(learnerDir, "05-dataset.mdx"),
    "utf8",
  );
  assert.match(
    dataset,
    /\(\/workshop\/learner\/04-monitoring\/error-analysis#seed\)/,
  );
  const instructor = await fs.readFile(
    path.join(outputDir, "instructor", "00-setup.mdx"),
    "utf8",
  );
  assert.match(
    instructor,
    /\(\/workshop\/learner\/04-monitoring\/capturing-signals\)/,
  );

  await fs.rm(repoDir, { recursive: true, force: true });
  await fs.rm(outputDir, { recursive: true, force: true });
});
