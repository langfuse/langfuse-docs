"use strict";

const assert = require("node:assert/strict");
const { spawn } = require("node:child_process");
const http = require("node:http");
const path = require("node:path");
const test = require("node:test");
const {
  filterAndConvertUrls,
  parseSitemap,
  runSitemapCheck,
} = require("./check-sitemap-links");

function sitemapXml(paths) {
  const urls = paths.map((loc) => `  <url><loc>${loc}</loc></url>`).join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
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

function runCli(env) {
  return new Promise((resolve) => {
    const child = spawn(
      process.execPath,
      [path.join(process.cwd(), "scripts/check-sitemap-links.js")],
      {
        env: { ...process.env, ...env },
        stdio: ["ignore", "pipe", "pipe"],
      },
    );
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

test("parses sitemap URLs and rewrites them onto the local server", async () => {
  const urls = await parseSitemap(
    sitemapXml([
      "https://langfuse.com/docs",
      "http://langfuse.com/blog",
      "https://example.com/skip",
    ]),
  );

  assert.deepEqual(filterAndConvertUrls(urls, "http://127.0.0.1:3333"), [
    "http://127.0.0.1:3333/docs",
    "http://127.0.0.1:3333/blog",
  ]);
});

test("passes when every sitemap URL is served locally", async () => {
  const { server, baseUrl } = await listen((req, res) => {
    if (req.url === "/sitemap-0.xml") {
      res.writeHead(200, { "Content-Type": "application/xml" });
      res.end(
        sitemapXml(["https://langfuse.com/docs", "https://langfuse.com/blog"]),
      );
      return;
    }
    res.writeHead(200);
    res.end("ok");
  });

  try {
    const result = await runSitemapCheck({
      sitemapUrl: `${baseUrl}/sitemap-0.xml`,
      baseUrl,
      silent: true,
    });

    assert.equal(result.ok, true);
    assert.equal(result.urlsChecked, 2);
    assert.equal(result.failures.length, 0);
  } finally {
    server.close();
  }
});

test("fails when a sitemap URL 404s on the local server", async () => {
  const { server, baseUrl } = await listen((req, res) => {
    if (req.url === "/sitemap-0.xml") {
      res.writeHead(200, { "Content-Type": "application/xml" });
      res.end(
        sitemapXml([
          "https://langfuse.com/docs",
          "https://langfuse.com/deleted-page",
        ]),
      );
      return;
    }
    res.writeHead(req.url === "/deleted-page" ? 404 : 200);
    res.end();
  });

  try {
    const result = await runSitemapCheck({
      sitemapUrl: `${baseUrl}/sitemap-0.xml`,
      baseUrl,
      silent: true,
    });

    assert.equal(result.ok, false);
    assert.equal(result.failures.length, 1);
    assert.match(result.failures[0].url, /\/deleted-page$/);
    assert.equal(result.failures[0].statusCode, 404);
  } finally {
    server.close();
  }
});

test("CLI exits 0 for a healthy sitemap and 1 after a 404 is introduced", async () => {
  const sitemapPaths = ["/docs"];
  const livePages = new Set(["/docs"]);
  const { server, baseUrl } = await listen((req, res) => {
    if (req.url === "/sitemap-0.xml") {
      res.writeHead(200, { "Content-Type": "application/xml" });
      res.end(
        sitemapXml(sitemapPaths.map((page) => `https://langfuse.com${page}`)),
      );
      return;
    }
    res.writeHead(livePages.has(req.url) ? 200 : 404);
    res.end();
  });
  const env = {
    SITEMAP_URL: `${baseUrl}/sitemap-0.xml`,
    SITEMAP_CHECK_BASE: baseUrl,
  };

  try {
    const passing = await runCli(env);
    assert.equal(passing.code, 0, passing.stderr);
    assert.match(passing.stdout, /All sitemap URLs are working correctly/);

    sitemapPaths.push("/broken-after-delete");

    const failing = await runCli(env);
    assert.equal(failing.code, 1);
    assert.match(failing.stdout, /Sitemap check failed/);
    assert.match(failing.stdout, /broken-after-delete/);
  } finally {
    server.close();
  }
});
