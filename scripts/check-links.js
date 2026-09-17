"use strict";

const fs = require("fs");
const path = require("path");
const { promisify } = require("util");
const { URL } = require("url");
const { checkLink, mapPool } = require("./lib/check-http");

const readFileAsync = promisify(fs.readFile);
const EXCLUDED_HOSTNAMES = new Set([
  "status.langfuse.com",
  "cloud.langfuse.com",
  "us.cloud.langfuse.com",
  "jp.cloud.langfuse.com",
  "hipaa.cloud.langfuse.com",
]);

const DEFAULT_SCAN_DIRS = [
  "app",
  "components",
  "components-mdx",
  "content",
  "lib",
  "scripts",
];

const DEFAULT_BASE_URL = "http://localhost:3333";

const CONFIG = {
  maxLinkConcurrency: 16,
  linkTimeout: 10000,
  externalLinkTimeout: 10000,
  progressInterval: 200,
  debugLogging: false,
};

function getBaseUrl(baseUrl = process.env.LINK_CHECK_BASE) {
  return (baseUrl || DEFAULT_BASE_URL).replace(/\/$/, "");
}

function getScanDirs(scanDirs = process.env.LINK_CHECK_DIRS) {
  if (Array.isArray(scanDirs) && scanDirs.length > 0) {
    return scanDirs;
  }
  if (typeof scanDirs === "string" && scanDirs.trim()) {
    return scanDirs
      .split(",")
      .map((dir) => dir.trim())
      .filter(Boolean);
  }
  return DEFAULT_SCAN_DIRS;
}

function localHostnamesFromBase(baseUrl) {
  try {
    return new Set([new URL(baseUrl).hostname, "localhost", "127.0.0.1"]);
  } catch {
    return new Set(["localhost", "127.0.0.1"]);
  }
}

function extractMarkdownLinks(content) {
  const links = [];
  const markdownRegex = /\[([^\]]*)\]\(([^)]+)\)/g;
  let match;

  while ((match = markdownRegex.exec(content)) !== null) {
    const url = match[2].trim();
    if (url && !url.startsWith("#")) {
      links.push(url);
    }
  }

  return links;
}

function extractHrefLinks(content) {
  const links = [];
  const patterns = [
    /href=["']([^"']+)["']/g,
    /href=\{`([^`]+)`\}/g,
    /href=\{"([^"]+)"\}/g,
    /href=\{'([^']+)'\}/g,
    /href=`([^`]+)`/g,
  ];

  for (const regex of patterns) {
    let match;
    regex.lastIndex = 0;
    while ((match = regex.exec(content)) !== null) {
      const href = match[1].trim();
      if (href && !href.startsWith("#") && !href.includes("${")) {
        links.push(href);
      }
    }
  }

  return links;
}

function extractNextJsLinks(content) {
  const links = [];
  const patterns = [
    /<Link\s+href=["']([^"']+)["'][^>]*>/g,
    /<Link\s+href=\{"([^"]+)"\}[^>]*>/g,
    /<Link\s+href=\{'([^']+)'\}[^>]*>/g,
    /<Link\s+href=\{`([^`]+)`\}[^>]*>/g,
  ];

  for (const regex of patterns) {
    let match;
    regex.lastIndex = 0;
    while ((match = regex.exec(content)) !== null) {
      const href = match[1].trim();
      if (href && !href.startsWith("#") && !href.includes("${")) {
        links.push(href);
      }
    }
  }

  return links;
}

function extractObjectPropertyLinks(content) {
  const links = [];
  const scanContent = content.replace(/```[\s\S]*?```/g, "");
  const patterns = [
    /\b(?:href|url|link|to|path|pathname)\s*:\s*["']([^"']+)["']/g,
    /\b(?:href|url|link|to|path|pathname)\s*:\s*`([^`]+)`/g,
  ];

  for (const regex of patterns) {
    let match;
    regex.lastIndex = 0;
    while ((match = regex.exec(scanContent)) !== null) {
      const value = match[1].trim();
      if (!value || value.startsWith("#") || value.includes("${")) {
        continue;
      }
      if (
        value.startsWith("/") ||
        value.startsWith("https://langfuse.com") ||
        value.startsWith("http://langfuse.com")
      ) {
        links.push(value);
      }
    }
  }

  return links;
}

function extractAllLinks(content, filePath) {
  let allLinks = extractMarkdownLinks(content);

  if (
    filePath.endsWith(".mdx") ||
    filePath.endsWith(".tsx") ||
    filePath.endsWith(".ts")
  ) {
    allLinks = allLinks.concat(extractHrefLinks(content));
    allLinks = allLinks.concat(extractNextJsLinks(content));
    allLinks = allLinks.concat(extractObjectPropertyLinks(content));
  }

  return allLinks;
}

function processLinks(links, baseUrl = getBaseUrl()) {
  const processedLinks = [];
  const localHost = new URL(baseUrl).host;

  for (const link of links) {
    if (!link || typeof link !== "string") {
      continue;
    }

    const trimmedLink = link.trim();
    if (!trimmedLink) {
      continue;
    }

    if (
      trimmedLink.includes("${") ||
      trimmedLink.includes("{{") ||
      trimmedLink.includes("}}") ||
      trimmedLink.includes("{") ||
      trimmedLink.includes("}") ||
      trimmedLink.includes("[") ||
      trimmedLink.includes("]") ||
      trimmedLink.includes("<%") ||
      trimmedLink.includes("%>")
    ) {
      continue;
    }

    if (
      trimmedLink.match(/^[a-zA-Z0-9_-]+$/) ||
      trimmedLink.startsWith("javascript:") ||
      trimmedLink.startsWith("vbscript:") ||
      trimmedLink.startsWith("mailto:") ||
      trimmedLink.startsWith("tel:") ||
      trimmedLink.startsWith("data:") ||
      trimmedLink.startsWith("blob:") ||
      trimmedLink.startsWith("file:")
    ) {
      continue;
    }

    if (trimmedLink === "/ph") {
      continue;
    }

    if (
      trimmedLink.startsWith("http://") ||
      trimmedLink.startsWith("https://")
    ) {
      try {
        const parsedUrl = new URL(trimmedLink);
        if (EXCLUDED_HOSTNAMES.has(parsedUrl.hostname)) {
          continue;
        }
      } catch {
        continue;
      }
    }

    let processedLink = trimmedLink;

    if (trimmedLink.startsWith("/")) {
      processedLink = `${baseUrl}${trimmedLink}`;
    } else if (trimmedLink.startsWith("https://langfuse.com")) {
      processedLink = trimmedLink.replace("https://langfuse.com", baseUrl);
    } else if (trimmedLink.startsWith("http://langfuse.com")) {
      processedLink = trimmedLink.replace("http://langfuse.com", baseUrl);
    } else if (
      !trimmedLink.startsWith("http://") &&
      !trimmedLink.startsWith("https://")
    ) {
      continue;
    } else if (
      !trimmedLink.includes(localHost) &&
      !trimmedLink.includes("langfuse.com")
    ) {
      continue;
    }

    if (processedLink.startsWith(`${baseUrl}/api/md-to-pdf`)) {
      continue;
    }

    try {
      new URL(processedLink);
      processedLinks.push(processedLink);
    } catch {
      continue;
    }
  }

  return [...new Set(processedLinks)];
}

function findFiles(dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      results = results.concat(findFiles(filePath));
    } else if (
      file.endsWith(".md") ||
      file.endsWith(".mdx") ||
      file.endsWith(".tsx") ||
      file.endsWith(".ts")
    ) {
      results.push(filePath);
    }
  }

  return results;
}

function reportBrokenLinks(brokenLinks) {
  console.error("\n=== LINK CHECK FAILED ===");
  console.error(`Found ${brokenLinks.length} broken link(s):\n`);

  const linksByFile = {};
  brokenLinks.forEach((link) => {
    if (!linksByFile[link.file]) {
      linksByFile[link.file] = [];
    }
    linksByFile[link.file].push(link);
  });

  Object.keys(linksByFile).forEach((file) => {
    console.error(`📄 ${file}:`);
    linksByFile[file].forEach((link) => {
      const methodInfo = link.method ? ` (${link.method})` : "";
      console.error(`  ❌ [${link.statusCode}] ${link.url}${methodInfo}`);
      if (link.error) {
        console.error(`     Error: ${link.error}`);
      }
    });
    console.error("");
  });
}

async function collectFileLinks(files, baseUrl) {
  const fileLinks = new Map();

  for (const filePath of files) {
    try {
      const content = await readFileAsync(filePath, "utf8");
      const processedLinks = processLinks(
        extractAllLinks(content, filePath),
        baseUrl,
      );
      if (processedLinks.length > 0) {
        fileLinks.set(filePath, processedLinks);
      }
    } catch (error) {
      const relativePath = path.relative(process.cwd(), filePath);
      console.warn(
        `Warning: Error processing ${relativePath}: ${error.message}`,
      );
    }
  }

  return fileLinks;
}

async function runLinkCheck(options = {}) {
  const baseUrl = getBaseUrl(options.baseUrl);
  const scanDirs = getScanDirs(options.scanDirs).map((dir) =>
    path.isAbsolute(dir) ? dir : path.join(process.cwd(), dir),
  );
  const checkLinkFn = options.checkLink || checkLink;
  const localHostnames = localHostnamesFromBase(baseUrl);

  const files = scanDirs.flatMap((dir) => findFiles(dir));
  const fileLinks = await collectFileLinks(files, baseUrl);
  const uniqueUrls = [
    ...new Set([...fileLinks.values()].flatMap((links) => links)),
  ];

  if (options.silent !== true) {
    console.log(
      `Found ${files.length} files to check (.md, .mdx, .tsx, .ts)\n`,
    );
    console.log(
      `Checking ${uniqueUrls.length} unique URLs ` +
        `(${CONFIG.maxLinkConcurrency} concurrent, ${CONFIG.linkTimeout}ms localhost timeout)`,
    );
  }

  const urlResults = new Map();
  let completed = 0;

  await mapPool(uniqueUrls, CONFIG.maxLinkConcurrency, async (url) => {
    const timeout = url.startsWith(baseUrl)
      ? CONFIG.linkTimeout
      : CONFIG.externalLinkTimeout;
    const result = await checkLinkFn(url, timeout, { localHostnames });
    urlResults.set(url, result);
    completed += 1;
    if (
      options.silent !== true &&
      (completed % CONFIG.progressInterval === 0 ||
        completed === uniqueUrls.length)
    ) {
      console.log(`Checked ${completed}/${uniqueUrls.length} unique URLs`);
    }
    return result;
  });

  const brokenLinks = [];
  for (const [filePath, urls] of fileLinks.entries()) {
    const relativePath = path.relative(process.cwd(), filePath);
    for (const url of urls) {
      const result = urlResults.get(url);
      if (result && result.status === "dead") {
        brokenLinks.push({
          file: relativePath,
          url: result.url,
          statusCode: result.statusCode,
          error: result.error,
          method: result.method,
        });
      }
    }
  }

  return {
    ok: brokenLinks.length === 0,
    brokenLinks,
    filesChecked: files.length,
    uniqueUrls: uniqueUrls.length,
  };
}

async function main() {
  try {
    const result = await runLinkCheck();

    if (!result.ok) {
      reportBrokenLinks(result.brokenLinks);
      process.exit(1);
    }

    console.log("\n✅ Link check passed: All valid links are working");
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  CONFIG,
  collectFileLinks,
  extractAllLinks,
  extractHrefLinks,
  extractMarkdownLinks,
  extractNextJsLinks,
  extractObjectPropertyLinks,
  findFiles,
  getBaseUrl,
  getScanDirs,
  processLinks,
  reportBrokenLinks,
  runLinkCheck,
};
