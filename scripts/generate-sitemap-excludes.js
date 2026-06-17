/**
 * Reads all content/**\/*.mdx files, extracts frontmatter, and writes two files:
 *
 *   .sitemap-excludes.json  — paths next-sitemap should omit:
 *     - noindex: true  → page is intentionally hidden from search
 *     - canonical: <url> that differs from the page's own URL
 *
 *   .sitemap-all-pages.json — metadata for every valid (non-excluded) page:
 *     { loc, lastmod, title, description }. Used by next-sitemap's
 *     additionalPaths to include pages that are server-rendered (not
 *     statically built) and to attach an accurate <lastmod> derived from git
 *     history (instead of the build timestamp). The title/description are
 *     reused by scripts/generate_llms_txt.js so llms.txt reflects the real
 *     page metadata rather than titles guessed from the URL slug.
 *
 * Run automatically as part of `prebuild` before `next-sitemap`.
 */
"use strict";
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const repoRoot = path.join(__dirname, "..");
const contentDir = path.join(repoRoot, "content");
const excludesFile = path.join(repoRoot, ".sitemap-excludes.json");
const allPagesFile = path.join(repoRoot, ".sitemap-all-pages.json");

/**
 * Build a map of repo-relative content file path -> ISO date of the most
 * recent git commit that touched it, computed in a single `git log` pass.
 *
 * Accurate dates require full git history at build time. CI build jobs use
 * `fetch-depth: 0`; if the build runs on a shallow clone the dates degrade to
 * file mtimes, so we warn loudly.
 */
function buildGitLastmodMap() {
  const map = new Map();
  try {
    const shallow =
      execFileSync("git", ["rev-parse", "--is-shallow-repository"], {
        cwd: repoRoot,
        encoding: "utf-8",
      }).trim() === "true";
    if (shallow) {
      console.warn(
        "[generate-sitemap-excludes] WARNING: shallow git clone detected — " +
          "sitemap <lastmod> dates may be inaccurate. Build with full history " +
          "(fetch-depth: 0) for accurate freshness signals.",
      );
    }
    const out = execFileSync(
      "git",
      ["log", "--name-only", "--format=__COMMIT__\t%cI", "--", "content"],
      { cwd: repoRoot, encoding: "utf-8", maxBuffer: 512 * 1024 * 1024 },
    );
    let currentDate = null;
    for (const line of out.split("\n")) {
      if (line.startsWith("__COMMIT__\t")) {
        currentDate = line.slice("__COMMIT__\t".length).trim();
      } else if (line && currentDate && !map.has(line)) {
        // First (newest) commit that touched this path wins.
        map.set(line, currentDate);
      }
    }
  } catch (err) {
    console.warn(
      `[generate-sitemap-excludes] git lastmod lookup failed (${err.message}); ` +
        "falling back to file mtimes.",
    );
  }
  return map;
}

/** Fallback last-modified date from the filesystem (ISO string). */
function fileMtimeISO(filePath) {
  try {
    return fs.statSync(filePath).mtime.toISOString();
  } catch {
    return undefined;
  }
}

// Cookbook routes that have a canonical docsPath duplicate — excluded from sitemap
let cookbookExcluded = new Set();
try {
  const cookbookRoutes = require("../cookbook/_routes.json");
  for (const { notebook, docsPath, isGuide } of cookbookRoutes) {
    if (isGuide === false) continue;
    if (docsPath) {
      cookbookExcluded.add(
        `/guides/cookbook/${notebook.replace(".ipynb", "")}`,
      );
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
  const rel = path.relative(contentDir, filePath).replace(/\\/g, "/"); // Windows compat
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
    academy: "academy",
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
// route -> { loc, lastmod?, title?, description? }
const pagesByRoute = new Map();

// Resolve each content file's last-modified date from git in a single pass.
const gitLastmod = buildGitLastmodMap();

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
  } else if (!pagesByRoute.has(route)) {
    const relPath = path.relative(repoRoot, filePath).replace(/\\/g, "/");
    const lastmod = gitLastmod.get(relPath) || fileMtimeISO(filePath);
    const entry = { loc: route };
    if (lastmod) entry.lastmod = lastmod;
    if (fm.title) entry.title = fm.title;
    if (fm.description) entry.description = fm.description;
    pagesByRoute.set(route, entry);
  }
}

fs.writeFileSync(
  excludesFile,
  JSON.stringify([...excludePaths].sort(), null, 2),
);
console.log(
  `[generate-sitemap-excludes] Wrote ${excludePaths.size} excluded path(s) to .sitemap-excludes.json`,
);

const allPages = [...pagesByRoute.values()].sort((a, b) =>
  a.loc.localeCompare(b.loc),
);
const withLastmod = allPages.filter((p) => p.lastmod).length;
const withDescription = allPages.filter((p) => p.description).length;
fs.writeFileSync(allPagesFile, JSON.stringify(allPages, null, 2));
console.log(
  `[generate-sitemap-excludes] Wrote ${allPages.length} page(s) to .sitemap-all-pages.json ` +
    `(${withLastmod} with lastmod, ${withDescription} with description)`,
);
