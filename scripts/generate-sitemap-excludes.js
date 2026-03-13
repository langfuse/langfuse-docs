/**
 * Reads all content/**\/*.mdx files, extracts frontmatter, and writes
 * .sitemap-excludes.json containing paths that next-sitemap should omit:
 *   - noindex: true  → page is intentionally hidden from search
 *   - canonical: <url> that differs from the page's own URL
 *                  → the canonical URL is the authoritative version; Google
 *                     recommends only canonical URLs appear in the sitemap
 *
 * Run automatically as part of `prebuild` before `next-sitemap`.
 */
"use strict";
const fs = require("fs");
const path = require("path");

const contentDir = path.join(__dirname, "../content");
const outputFile = path.join(__dirname, "../.sitemap-excludes.json");

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

const excludePaths = new Set();

for (const filePath of walkDir(contentDir)) {
  let src;
  try {
    src = fs.readFileSync(filePath, "utf-8");
  } catch {
    continue;
  }
  const fm = readFrontmatter(src);
  if (!fm.noindex && !fm.canonical) continue;

  const route = contentPathToRoute(filePath);
  if (!route) continue;

  if (fm.noindex === "true") {
    excludePaths.add(route);
  } else if (fm.canonical) {
    // Normalise: strip https://langfuse.com prefix so we compare path-to-path
    const canonical = fm.canonical.replace(/^https?:\/\/langfuse\.com/, "");
    // If the canonical differs from this page's own route, exclude it
    if (canonical !== route) {
      excludePaths.add(route);
    }
  }
}

fs.writeFileSync(outputFile, JSON.stringify([...excludePaths].sort(), null, 2));
console.log(
  `[generate-sitemap-excludes] Wrote ${excludePaths.size} excluded path(s) to .sitemap-excludes.json`
);
