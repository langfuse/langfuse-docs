"use strict";

const assert = require("node:assert/strict");
const { spawn } = require("node:child_process");
const fs = require("node:fs");
const http = require("node:http");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");
const {
  extractAllLinks,
  processLinks,
  runLinkCheck,
} = require("./check-links");

function createFixtureTree(files) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "link-check-"));
  for (const [relativePath, contents] of Object.entries(files)) {
    const fullPath = path.join(root, relativePath);
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.writeFileSync(fullPath, contents);
  }
  return root;
}

async function listen(handler) {
  const server = http.createServer(handler);
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const { port } = server.address();
  return {
    server,
    port,
    baseUrl: `http://127.0.0.1:${port}`,
  };
}

function runCli(args, env) {
  return new Promise((resolve) => {
    const child = spawn(process.execPath, args, {
      env: { ...process.env, ...env },
      stdio: ["ignore", "pipe", "pipe"],
    });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk) => {
      stdout += chunk;
    });
    child.stderr.on("data", (chunk) => {
      stderr += chunk;
    });
    child.on("close", (code) => {
      resolve({ code, stdout, stderr });
    });
  });
}

test("extracts markdown, href, and object-property links", () => {
  const content = `
[Docs](/docs)
<a href="/guides">Guides</a>
<Link href="/blog">Blog</Link>
const item = { href: "/faq", url: "https://langfuse.com/self-hosting" }
`;

  assert.deepEqual(extractAllLinks(content, "page.mdx"), [
    "/docs",
    "/guides",
    "/blog",
    "/blog",
    "/faq",
    "https://langfuse.com/self-hosting",
  ]);
});

test("rewrites site links onto the local checker base URL", () => {
  const processed = processLinks(
    [
      "/docs",
      "https://langfuse.com/blog",
      "http://langfuse.com/faq",
      "https://example.com/skip",
      "https://cloud.langfuse.com/project/~",
      "/ph",
      "/api/md-to-pdf?path=/docs",
    ],
    "http://127.0.0.1:3333",
  );

  assert.deepEqual(processed, [
    "http://127.0.0.1:3333/docs",
    "http://127.0.0.1:3333/blog",
    "http://127.0.0.1:3333/faq",
  ]);
});

test("passes when every extracted link is served", async () => {
  const root = createFixtureTree({
    "content/ok.md": "See [Docs](/docs) and [FAQ](/faq).",
  });
  const seen = [];
  const { server, baseUrl } = await listen((req, res) => {
    seen.push(`${req.method} ${req.url}`);
    res.writeHead(200);
    res.end("ok");
  });

  try {
    const result = await runLinkCheck({
      scanDirs: [path.join(root, "content")],
      baseUrl,
      silent: true,
    });

    assert.equal(result.ok, true);
    assert.equal(result.brokenLinks.length, 0);
    assert.equal(result.uniqueUrls, 2);
    assert.ok(seen.some((entry) => entry.startsWith("HEAD /docs")));
  } finally {
    server.close();
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test("fails when a source file introduces a 404", async () => {
  const root = createFixtureTree({
    "content/broken.md": "This [missing page](/does-not-exist) should fail CI.",
  });
  const { server, baseUrl } = await listen((req, res) => {
    res.writeHead(req.url === "/does-not-exist" ? 404 : 200);
    res.end(req.url === "/does-not-exist" ? "missing" : "ok");
  });

  try {
    const result = await runLinkCheck({
      scanDirs: [path.join(root, "content")],
      baseUrl,
      silent: true,
    });

    assert.equal(result.ok, false);
    assert.equal(result.brokenLinks.length, 1);
    assert.equal(result.brokenLinks[0].statusCode, 404);
    assert.match(result.brokenLinks[0].url, /\/does-not-exist$/);
    assert.match(result.brokenLinks[0].file, /broken\.md$/);
  } finally {
    server.close();
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test("checks each unique URL once even when many files repeat it", async () => {
  const files = {};
  for (let i = 0; i < 8; i += 1) {
    files[`content/page-${i}.md`] = "Repeat [Docs](/docs) here.";
  }
  const root = createFixtureTree(files);
  let hits = 0;
  const { server, baseUrl } = await listen((req, res) => {
    if (req.url === "/docs") hits += 1;
    res.writeHead(200);
    res.end("ok");
  });

  try {
    const result = await runLinkCheck({
      scanDirs: [path.join(root, "content")],
      baseUrl,
      silent: true,
    });

    assert.equal(result.ok, true);
    assert.equal(result.uniqueUrls, 1);
    assert.ok(hits <= 2, `expected at most HEAD+GET, got ${hits}`);
  } finally {
    server.close();
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test("CLI exits 0 for working links and 1 when a broken link is introduced", async () => {
  const root = createFixtureTree({
    "content/page.md": "Working [docs](/docs).",
  });
  const { server, baseUrl } = await listen((req, res) => {
    res.writeHead(req.url === "/docs" ? 200 : 404);
    res.end();
  });
  const script = path.join(process.cwd(), "scripts/check-links.js");
  const env = {
    LINK_CHECK_BASE: baseUrl,
    LINK_CHECK_DIRS: path.join(root, "content"),
  };

  try {
    const passing = await runCli([script], env);
    assert.equal(passing.code, 0, passing.stderr);
    assert.match(passing.stdout, /Link check passed/);

    fs.writeFileSync(
      path.join(root, "content/page.md"),
      "Broken [page](/does-not-exist).",
    );

    const failing = await runCli([script], env);
    assert.equal(failing.code, 1);
    assert.match(failing.stderr, /LINK CHECK FAILED/);
    assert.match(failing.stderr, /does-not-exist/);
  } finally {
    server.close();
    fs.rmSync(root, { recursive: true, force: true });
  }
});
