/**
 * Reads all content/**\/*.mdx files, extracts frontmatter, and writes two files:
 *
 *   .sitemap-excludes.json  — paths next-sitemap should omit:
 *     - noindex: true  → page is intentionally hidden from search
 *     - canonical: <url> that differs from the page's own URL
 *
 *   .sitemap-all-pages.json — ALL valid page paths (i.e., not excluded).
 *     Used by next-sitemap's additionalPaths to include pages that are
 *     server-rendered (not statically built) and therefore missed by
 *     next-sitemap's default build-output discovery.
 *
 * Run automatically as part of `prebuild` before `next-sitemap`.
 */
"use strict";
const fs = require("fs");
const path = require("path");

const contentDir = path.join(__dirname, "../content");
const excludesFile = path.join(__dirname, "../.sitemap-excludes.json");
const allPagesFile = path.join(__dirname, "../.sitemap-all-pages.json");

// Cookbook routes that have a canonical docsPath duplicate — excluded from sitemap
let cookbookExcluded = new Set();
try {
  const cookbookRoutes = require("../cookbook/_routes.json");
  for (const { notebook, docsPath, isGuide } of cookbookRoutes) {
    if (isGuide === false) continue;
    if (docsPath) {
      cookbookExcluded.add(`/guides/cookbook/${notebook.replace(".ipynb", "")}`);
    }
  }
} catch {
  // cookbook/_routes.json not available — skip
}

/** Parse the YAML front-matter block (between first pair of ---). */
function readFrontmatter(src) {
  const match = src.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return {};
  const fm = {};
  for (const line of match[1].split(/\r?\n/)) {
    // Match "key: value" — handles quoted and unquoted values
    const m = line.match(/^([\w-]+):\s*(.*)$/);
    if (!m) continue;
    const key = m[1];
    const val = m[2].trim().replace(/^["']|["']$/g, "");
    fm[key] = val;
  }
  return fm;
}

/** Map a content-directory file path to its public URL path. */
function contentPathToRoute(filePath) {
  const rel = path
    .relative(contentDir, filePath)
    .replace(/\\/g, "/"); // Windows compat
  const noExt = rel.replace(/\.(mdx|md)$/, "");
  const parts = noExt.split("/");

  // Map first segment (content section) to URL prefix
  const sectionMap = {
    docs: "docs",
    guides: "guides",
    integrations: "integrations",
    "self-hosting": "self-hosting",
    library: "library",
    changelog: "changelog",
    faq: "faq",
    handbook: "handbook",
    security: "security",
    blog: "blog",
    customers: "users",
    // marketing pages are served at the root (no section prefix)
    marketing: "",
  };

  const [section, ...rest] = parts;
  const urlSection = sectionMap[section];
  if (urlSection === undefined) return null; // unknown section — skip

  // Flatten slug, strip trailing /index
  const slug = rest.join("/").replace(/(\/index|^index)$/, "");

  if (urlSection === "") {
    return slug ? `/${slug}` : "/";
  }
  return slug ? `/${urlSection}/${slug}` : `/${urlSection}`;
}

/** Recursively collect .mdx / .md files. */
function walkDir(dir) {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkDir(full));
    } else if (/\.(mdx|md)$/.test(entry.name)) {
      files.push(full);
    }
  }
  return files;
}

const excludePaths = new Set([...cookbookExcluded]);
const allRoutes = new Set();

for (const filePath of walkDir(contentDir)) {
  let src;
  try {
    src = fs.readFileSync(filePath, "utf-8");
  } catch {
    continue;
  }
  const fm = readFrontmatter(src);
  const route = contentPathToRoute(filePath);
  if (!route) continue;

  // Determine if this page should be excluded
  let exclude = false;
  if (fm.noindex === "true") {
    exclude = true;
  } else if (fm.canonical) {
    // Normalise: strip https://langfuse.com prefix so we compare path-to-path
    const canonical = fm.canonical.replace(/^https?:\/\/langfuse\.com/, "");
    if (canonical !== route) exclude = true;
  } else if (cookbookExcluded.has(route)) {
    exclude = true;
  }

  if (exclude) {
    excludePaths.add(route);
  } else {
    allRoutes.add(route);
  }
}

fs.writeFileSync(excludesFile, JSON.stringify([...excludePaths].sort(), null, 2));
console.log(
  `[generate-sitemap-excludes] Wrote ${excludePaths.size} excluded path(s) to .sitemap-excludes.json`
);

fs.writeFileSync(allPagesFile, JSON.stringify([...allRoutes].sort(), null, 2));
console.log(
  `[generate-sitemap-excludes] Wrote ${allRoutes.size} page path(s) to .sitemap-all-pages.json`
);
