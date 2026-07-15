/*
  Copy all Markdown sources from content/** (md, mdx) into public/md-src/** as .md files.
  This runs at build time so the static files can be served directly in production.
*/

const fs = require("fs");
const path = require("path");
const {
  stripMdxForPlainMarkdown,
} = require("../lib/stripMdxForPlainMarkdown.js");
const {
  replaceComponentsWithMarkdown,
} = require("../lib/markdown-component-renderers.js");
const { CONTENT_DIR_TO_URL_PREFIX } = require("../lib/content-dir-map.js");

const SOURCE_DIR = path.join(process.cwd(), "content");
const OUTPUT_DIR = path.join(process.cwd(), "public", "md-src");
const OVERRIDE_DIR = path.join(process.cwd(), "md-override");

// Directories whose .md output is historical changelog content. Agents fetch
// these pages (via the ".md" route or the docs MCP `getLangfuseDocsPage` tool)
// and can mistake the release-time code snippets for current implementation
// guidance. We prepend a machine-readable notice so agents use changelog
// entries only to confirm a feature exists, and follow the canonical docs /
// API / SDK reference for implementation. See CHANGELOG_AGENT_NOTICE below.
const CHANGELOG_URL_PREFIX = "changelog";

/**
 * Read the `canonical` frontmatter value (a docs path) from raw MDX, if present.
 * @param {string} originalContent
 * @returns {string | null}
 */
function extractCanonicalPath(originalContent) {
  const fmMatch = originalContent.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!fmMatch) return null;
  const canonicalMatch = fmMatch[1].match(/^canonical:\s*(\S+)\s*$/m);
  return canonicalMatch ? canonicalMatch[1].trim() : null;
}

/**
 * Prepend an AI-agent notice to changelog markdown, inserted right after the
 * YAML frontmatter block so it is the first thing a model reads in the body.
 * The notice steers agents away from using (potentially outdated) release-time
 * code examples for implementation and toward the canonical docs / API / SDK
 * reference.
 * @param {string} processed  markdown already stripped for plain output
 * @param {string} originalContent  raw MDX source (for frontmatter lookup)
 * @returns {string}
 */
function injectChangelogAgentNotice(processed, originalContent) {
  const canonical = extractCanonicalPath(originalContent);
  const canonicalUrl = canonical
    ? canonical.startsWith("http")
      ? canonical
      : `https://langfuse.com${canonical.startsWith("/") ? canonical : `/${canonical}`}`
    : null;
  const reference = canonicalUrl
    ? `the canonical documentation for this feature (${canonicalUrl}) and the API/SDK reference (https://api.reference.langfuse.com)`
    : `the current documentation (https://langfuse.com/docs) and the API/SDK reference (https://api.reference.langfuse.com)`;
  const notice =
    `> **Note for AI agents and LLMs:** This is a Langfuse changelog entry. ` +
    `Use it only to confirm that a feature exists and when it shipped. ` +
    `Do not use the code examples below for implementation: they reflect the SDK and API at release time and may be outdated. ` +
    `For implementation, always follow ${reference}.`;

  const fmMatch = processed.match(/^(---\r?\n[\s\S]*?\r?\n---\r?\n)/);
  if (fmMatch) {
    const frontmatter = fmMatch[1];
    const body = processed.slice(frontmatter.length).replace(/^\s*\n/, "");
    return `${frontmatter}\n${notice}\n\n${body}`;
  }
  return `${notice}\n\n${processed.replace(/^\s*\n/, "")}`;
}

/**
 * Recursively walk a directory collecting file paths.
 */
function walkDir(dirPath) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkDir(fullPath));
    } else {
      files.push(fullPath);
    }
  }
  return files;
}

/**
 * Ensure a directory exists.
 */
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

/**
 * Determine if path within content/ should be copied and where.
 * - Accept .md and .mdx files only
 * - Exclude meta.json and non-markdown
 * - Remap content directories to match URL structure (see CONTENT_DIR_TO_URL_PREFIX)
 * - Map content/foo/bar.mdx -> public/md-src/foo/bar.md
 * - Map content/foo/index.mdx -> public/md-src/foo.md
 */
function mapDestination(sourceFile) {
  const rel = path.relative(SOURCE_DIR, sourceFile);
  const base = path.basename(rel);
  if (base === "meta.json" || base.startsWith("_")) return null;

  const ext = path.extname(rel).toLowerCase();
  if (ext !== ".md" && ext !== ".mdx") return null;

  const withoutExt = rel.slice(0, -ext.length);
  const parts = withoutExt.split(path.sep);

  const topDir = parts[0];
  const urlPrefix = CONTENT_DIR_TO_URL_PREFIX[topDir];
  if (typeof urlPrefix !== "string") {
    throw new Error(
      `copy_md_sources: missing content-dir-map entry for "${topDir}" (add it to lib/content-dir-map.js, same as lib/source.ts baseUrl())`,
    );
  }
  if (urlPrefix === "") {
    parts.splice(0, 1);
  } else {
    parts[0] = urlPrefix;
  }

  let outParts = parts.slice();
  if (outParts.length > 0 && outParts[outParts.length - 1] === "index") {
    outParts = outParts.slice(0, -1);
  }
  const outRel = outParts.length ? outParts.join("/") + ".md" : "index.md";
  return path.join(OUTPUT_DIR, outRel);
}

function copyAll() {
  if (!fs.existsSync(SOURCE_DIR)) {
    console.log("copy_md_sources: content/ not found, skipping");
    return;
  }
  const allFiles = walkDir(SOURCE_DIR);
  let copied = 0;
  for (const file of allFiles) {
    const dest = mapDestination(file);
    if (!dest) continue;
    const dir = path.dirname(dest);
    ensureDir(dir);
    const originalContent = fs.readFileSync(file, "utf8");
    const inlined = replaceComponentsWithMarkdown(
      inlineComponentsMdx(originalContent, file),
    );
    let processed = stripMdxForPlainMarkdown(inlined, {
      unwrapCalloutsForPlainMd: true,
    });

    // For changelog entries, prepend an AI-agent notice so models use the page
    // to confirm a feature exists rather than copying release-time examples.
    const destRel = path.relative(OUTPUT_DIR, dest).split(path.sep).join("/");
    const isChangelogEntry =
      destRel.startsWith(`${CHANGELOG_URL_PREFIX}/`) &&
      destRel !== `${CHANGELOG_URL_PREFIX}/index.md`;
    if (isChangelogEntry) {
      processed = injectChangelogAgentNotice(processed, originalContent);
    }

    fs.writeFileSync(dest, processed, "utf8");
    copied += 1;
  }
  console.log(`Copied ${copied} markdown source files into public/md-src`);
}

function cleanOutputDir() {
  if (fs.existsSync(OUTPUT_DIR)) {
    fs.rmSync(OUTPUT_DIR, { recursive: true, force: true });
  }
}

/**
 * Copy hand-authored .md files from md-override/ into public/md-src/,
 * overwriting any auto-generated version for that path.
 */
function applyOverrides() {
  if (!fs.existsSync(OVERRIDE_DIR)) return;
  const files = walkDir(OVERRIDE_DIR);
  let overridden = 0;
  for (const file of files) {
    if (path.extname(file).toLowerCase() !== ".md") continue;
    const rel = path.relative(OVERRIDE_DIR, file);
    const dest = path.join(OUTPUT_DIR, rel);
    ensureDir(path.dirname(dest));
    fs.copyFileSync(file, dest);
    overridden += 1;
  }
  if (overridden > 0) {
    console.log(`Applied ${overridden} markdown override(s) from md-override/`);
  }
}

cleanOutputDir();
copyAll();
applyOverrides();

/**
 * Inline imports of MDX components from the components-mdx directory.
 * Only resolves paths starting with "@/components-mdx/".
 */
function inlineComponentsMdx(fileContent, sourceFilePath) {
  try {
    const importPattern =
      /(^|\n)import\s+([A-Za-z0-9_]+)\s+from\s+"@\/components-mdx\/([^"]+)";?\s*(?=\n|$)/g;
    const componentAliasRoot = path.join(process.cwd(), "components-mdx");

    // Collect all imports first to avoid interfering with regex iteration during replacements
    const imports = [];
    let match;
    while ((match = importPattern.exec(fileContent)) !== null) {
      const importedName = match[2];
      const importedRel = match[3];
      imports.push({ fullMatch: match[0], importedName, importedRel });
    }

    if (imports.length === 0) return fileContent;

    let contentWithoutImports = fileContent;
    for (const imp of imports) {
      // Remove the import line
      contentWithoutImports = contentWithoutImports.replace(
        imp.fullMatch,
        "\n",
      );
    }

    // Resolve and inline each component
    let finalContent = contentWithoutImports;
    for (const imp of imports) {
      const resolvedPath = resolveComponentPath(
        componentAliasRoot,
        imp.importedRel,
      );
      if (!resolvedPath) {
        console.warn(
          `copy_md_sources: Could not resolve component ${imp.importedRel} imported as ${imp.importedName} in ${sourceFilePath}`,
        );
        continue;
      }
      const rawChild = fs.readFileSync(resolvedPath, "utf8");
      const childInlined = inlineComponentsMdx(rawChild, resolvedPath);

      // Replace self-closing and paired tags
      const selfClosing = new RegExp(
        `<${imp.importedName}(\\s[^>]*)?\\s*/>`,
        "g",
      );
      const paired = new RegExp(
        `<${imp.importedName}(\\s[^>]*)?>([\\s\\S]*?)<\/${imp.importedName}>`,
        "g",
      );

      finalContent = finalContent.replace(selfClosing, `\n${childInlined}\n`);
      finalContent = finalContent.replace(paired, `\n${childInlined}\n`);
    }

    return finalContent;
  } catch (e) {
    console.warn(
      `copy_md_sources: Failed to inline components for ${sourceFilePath}:`,
      e.message,
    );
    return fileContent;
  }
}

function resolveComponentPath(rootDir, relImport) {
  // Allow explicit extensions or try .mdx, then .md
  const explicit = path.join(rootDir, relImport);
  if (fs.existsSync(explicit)) return explicit;
  const withMdx = explicit.endsWith(".mdx") ? explicit : explicit + ".mdx";
  if (fs.existsSync(withMdx)) return withMdx;
  const withMd = explicit.endsWith(".md") ? explicit : explicit + ".md";
  if (fs.existsSync(withMd)) return withMd;
  return null;
}
