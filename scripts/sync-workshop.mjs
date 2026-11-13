#!/usr/bin/env node

import { execFile } from "node:child_process";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import posixPath from "node:path/posix";
import process from "node:process";
import { pathToFileURL } from "node:url";
import { promisify } from "node:util";
import workshopConfig from "../lib/workshop-config.js";

const execFileAsync = promisify(execFile);

const OWNER = "langfuse";
const REPO = "langfuse-workshop";
const REF = "main";
const REPO_SLUG = `${OWNER}/${REPO}`;
const REPO_URL = `https://github.com/${REPO_SLUG}`;
// codeload serves the public archive without counting against the REST API
// rate limit, so builds do not depend on a GitHub token's hourly quota.
const TARBALL_URL = `https://codeload.github.com/${REPO_SLUG}/tar.gz/refs/heads/${REF}`;
const GITHUB_BLOB_BASE = `${REPO_URL}/blob/${REF}`;
const GITHUB_TREE_BASE = `${REPO_URL}/tree/${REF}`;
const RAW_BASE = `https://raw.githubusercontent.com/${REPO_SLUG}/${REF}`;
const OUTPUT_DIR = path.join(process.cwd(), "content", "workshop");
const FENCED_CODE_BLOCK_PATTERN = /(```[\s\S]*?```|~~~[\s\S]*?~~~)/g;
const { WORKSHOP_DEFAULT_CHAPTER } = workshopConfig;

function encodeRepoPath(repoPath) {
  return repoPath.split("/").map(encodeURIComponent).join("/");
}

const RETRYABLE_STATUSES = new Set([408, 429, 500, 502, 503, 504]);
const MAX_FETCH_ATTEMPTS = 5;

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function retryDelayMs(attempt, response) {
  const header = response?.headers?.get("retry-after");
  const seconds = header == null ? Number.NaN : Number(header);
  if (Number.isFinite(seconds) && seconds >= 0) {
    return Math.min(seconds * 1000, 20_000);
  }
  const backoff = 400 * 2 ** (attempt - 1);
  return backoff + Math.floor(Math.random() * 250);
}

async function extractTarball(response, archivePath, repoDir) {
  await fs.writeFile(archivePath, Buffer.from(await response.arrayBuffer()));
  await fs.rm(repoDir, { recursive: true, force: true });
  await fs.mkdir(repoDir);
  await execFileAsync("tar", [
    "-xzf",
    archivePath,
    "-C",
    repoDir,
    "--strip-components=1",
  ]);
}

async function downloadRepo(targetDir) {
  const archivePath = path.join(targetDir, "repo.tar.gz");
  const repoDir = path.join(targetDir, "repo");
  let lastError;

  for (let attempt = 1; attempt <= MAX_FETCH_ATTEMPTS; attempt++) {
    let response;
    try {
      response = await fetch(TARBALL_URL, {
        headers: { "User-Agent": "langfuse-docs-workshop-sync" },
      });
      if (response.ok) {
        await extractTarball(response, archivePath, repoDir);
        return repoDir;
      }
    } catch (error) {
      lastError = error;
      if (attempt === MAX_FETCH_ATTEMPTS) throw error;
      console.warn(
        `Retrying ${REPO_SLUG}@${REF} download after it failed: ${error.message} (attempt ${attempt}/${MAX_FETCH_ATTEMPTS})`,
      );
      await delay(retryDelayMs(attempt));
      continue;
    }

    const body = await response.text();
    lastError = new Error(
      `Failed to download ${TARBALL_URL}: ${response.status} ${response.statusText}\n${body}`,
    );
    if (
      !RETRYABLE_STATUSES.has(response.status) ||
      attempt === MAX_FETCH_ATTEMPTS
    ) {
      throw lastError;
    }

    console.warn(
      `Retrying ${REPO_SLUG}@${REF} download after ${response.status} (attempt ${attempt}/${MAX_FETCH_ATTEMPTS})`,
    );
    await delay(retryDelayMs(attempt, response));
  }

  throw lastError;
}

async function listDirectory(repoDir, repoPath) {
  const entries = await fs.readdir(path.join(repoDir, repoPath), {
    withFileTypes: true,
  });
  return entries.map((entry) => ({
    name: entry.name,
    path: posixPath.join(repoPath, entry.name),
    type: entry.isFile() ? "file" : entry.isDirectory() ? "dir" : "other",
  }));
}

async function readMarkdown(repoDir, repoPath) {
  return fs.readFile(path.join(repoDir, repoPath), "utf8");
}

function isMarkdownFile(entry) {
  return entry.type === "file" && entry.name.toLowerCase().endsWith(".md");
}

function sortByName(entries) {
  return entries.sort((a, b) =>
    a.name.localeCompare(b.name, undefined, {
      numeric: true,
      sensitivity: "base",
    }),
  );
}

function slugFromFileName(fileName) {
  return fileName.replace(/\.md$/i, "");
}

function isLessonFile(entry) {
  return isMarkdownFile(entry) && entry.name !== "README.md";
}

// Sub-pages appear in the order the lesson links to them; unlinked ones
// follow by name.
function orderByFirstLink(subPages, lessonMarkdown, lessonSlug) {
  const position = (entry) => {
    const index = lessonMarkdown.indexOf(`${lessonSlug}/${entry.name}`);
    return index === -1 ? Number.POSITIVE_INFINITY : index;
  };
  return sortByName(subPages).sort((a, b) => position(a) - position(b));
}

// A lesson `NN-name.md` with a sibling `NN-name/` folder becomes a sidebar
// folder: the lesson is the folder index and each Markdown file inside is a
// nested page.
async function collectSection(repoDir, section) {
  const sectionDir = `docs/${section}`;
  const entries = await listDirectory(repoDir, sectionDir);
  const lessons = sortByName(entries.filter(isLessonFile));
  const folders = new Map(
    entries
      .filter((entry) => entry.type === "dir")
      .map((entry) => [entry.name, entry]),
  );

  if (
    !lessons.some(
      (entry) => slugFromFileName(entry.name) === WORKSHOP_DEFAULT_CHAPTER,
    )
  ) {
    throw new Error(
      `Expected ${sectionDir}/${WORKSHOP_DEFAULT_CHAPTER}.md in ${REPO_SLUG}@${REF}`,
    );
  }

  const files = [];
  const folderMetas = [];

  for (const lesson of lessons) {
    const slug = slugFromFileName(lesson.name);
    const route = `/workshop/${section}/${slug}`;
    const folder = folders.get(slug);
    const subPages = folder
      ? (await listDirectory(repoDir, folder.path)).filter(isLessonFile)
      : [];

    if (subPages.length === 0) {
      files.push({
        sourcePath: lesson.path,
        outputPath: `${section}/${slug}.mdx`,
        route,
      });
      continue;
    }

    const ordered = orderByFirstLink(
      subPages,
      await readMarkdown(repoDir, lesson.path),
      slug,
    );
    files.push({
      sourcePath: lesson.path,
      outputPath: `${section}/${slug}/index.mdx`,
      route,
    });
    for (const subPage of ordered) {
      const subSlug = slugFromFileName(subPage.name);
      files.push({
        sourcePath: subPage.path,
        outputPath: `${section}/${slug}/${subSlug}.mdx`,
        route: `${route}/${subSlug}`,
      });
    }
    // `index` stays out of `pages` so fumadocs uses it as the folder's own page.
    folderMetas.push({
      outputPath: `${section}/${slug}/meta.json`,
      pages: ordered.map((entry) => slugFromFileName(entry.name)),
    });
  }

  return {
    files,
    folderMetas,
    pages: lessons.map((entry) => slugFromFileName(entry.name)),
  };
}

async function collectWorkshopFiles(repoDir) {
  const [learner, instructor] = await Promise.all([
    collectSection(repoDir, "learner"),
    collectSection(repoDir, "instructor"),
  ]);

  return {
    files: [
      {
        sourcePath: "README.md",
        outputPath: "index.mdx",
        route: "/workshop",
        shortTitle: "Overview",
      },
      ...learner.files,
      ...instructor.files,
    ],
    folderMetas: [...learner.folderMetas, ...instructor.folderMetas],
    learnerPages: learner.pages,
    instructorPages: instructor.pages,
  };
}

function stripFrontmatter(markdown) {
  return markdown.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, "");
}

function stripHtmlTags(value) {
  let output = "";
  let index = 0;

  while (index < value.length) {
    if (value[index] !== "<") {
      output += value[index];
      index += 1;
      continue;
    }

    const closeTag = value.indexOf(">", index + 1);
    if (closeTag === -1) {
      index += 1;
      continue;
    }

    output += " ";
    index = closeTag + 1;
  }

  return output;
}

function cleanInlineMarkdown(value) {
  return stripHtmlTags(value)
    .replace(/\s*\[#[\w-]+\]\s*$/g, "")
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[`*_~]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function extractTitle(markdown, sourcePath) {
  const match = markdown.match(/^#\s+(.+)$/m);
  if (match) return cleanInlineMarkdown(match[1]);
  return cleanInlineMarkdown(path.basename(sourcePath, ".md"));
}

function extractDescription(markdown) {
  const h1 = markdown.match(/^#\s+.+$/m);
  const afterH1 = h1
    ? markdown.slice((h1.index ?? 0) + h1[0].length)
    : markdown;

  for (const paragraph of afterH1.split(/\n\s*\n/)) {
    const trimmed = paragraph.trim();
    if (!trimmed) continue;
    if (/^(#|<|>|```|~~~|\||[-*+]\s|\d+\.\s|!\[)/.test(trimmed)) continue;

    const cleaned = cleanInlineMarkdown(trimmed);
    if (cleaned)
      return cleaned.length > 180 ? `${cleaned.slice(0, 177)}...` : cleaned;
  }

  return null;
}

function splitTarget(target) {
  const trimmed = target.trim();
  const match = trimmed.match(
    /^(\S+)(\s+(?:"[\s\S]*"|'[\s\S]*'|\([\s\S]*\)))$/,
  );
  if (!match) return { url: trimmed, title: "" };
  return { url: match[1], title: match[2] };
}

function splitReferenceDefinitionTarget(target) {
  const trimmed = target.trim();
  if (trimmed.startsWith("<")) {
    const close = trimmed.indexOf(">");
    if (close > 0) {
      const title = trimmed.slice(close + 1).trim();
      return {
        url: trimmed.slice(1, close),
        title: title ? ` ${title}` : "",
      };
    }
  }

  return splitTarget(trimmed);
}

function normalizeReferenceLabel(label) {
  return label.replace(/\s+/g, " ").trim().toLowerCase();
}

function parseReferenceDefinitionLine(line) {
  const indent = line.match(/^[ \t]*/)?.[0] ?? "";
  if (indent.length > 3 || line[indent.length] !== "[") return null;

  const closeBracket = findClosingBracket(line, indent.length);
  if (closeBracket == null || line[closeBracket + 1] !== ":") return null;

  const label = line.slice(indent.length + 1, closeBracket);
  const normalizedLabel = normalizeReferenceLabel(label);
  if (!normalizedLabel) return null;

  const target = line.slice(closeBracket + 2).trim();
  if (!target) return null;

  return {
    indent,
    label,
    normalizedLabel,
    ...splitReferenceDefinitionTarget(target),
  };
}

function collectReferenceDefinitions(markdown, sourcePath) {
  const definitions = new Map();

  for (const [index, segment] of markdown
    .split(FENCED_CODE_BLOCK_PATTERN)
    .entries()) {
    if (index % 2 === 1) continue;

    for (const line of segment.split(/\r?\n/)) {
      const definition = parseReferenceDefinitionLine(line);
      if (!definition || definitions.has(definition.normalizedLabel)) continue;

      definitions.set(definition.normalizedLabel, {
        imageUrl: rewriteImageUrl(definition.url, sourcePath),
        title: definition.title,
      });
    }
  }

  return definitions;
}

function splitUrlSuffix(url) {
  const match = url.match(/^([^?#]*)([?#][\s\S]*)?$/);
  return {
    pathPart: match?.[1] ?? url,
    suffix: match?.[2] ?? "",
  };
}

function isRelativeUrl(url) {
  return (
    url &&
    !url.startsWith("#") &&
    !url.startsWith("/") &&
    !url.startsWith("//") &&
    !/^[A-Za-z][A-Za-z0-9+.-]*:/.test(url)
  );
}

function normalizeRepoPath(sourcePath, relativeTarget) {
  const sourceDir = posixPath.dirname(sourcePath);
  const normalized = posixPath.normalize(
    posixPath.join(sourceDir, relativeTarget),
  );
  if (
    normalized === "." ||
    normalized === ".." ||
    normalized.startsWith("../")
  ) {
    throw new Error(
      `Relative link ${relativeTarget} from ${sourcePath} leaves the repository`,
    );
  }
  return normalized;
}

function rewriteImageUrl(url, sourcePath) {
  if (!isRelativeUrl(url)) return url;
  const { pathPart, suffix } = splitUrlSuffix(url);
  if (!pathPart) return url;

  const repoPath = normalizeRepoPath(sourcePath, pathPart);
  return `${RAW_BASE}/${encodeRepoPath(repoPath)}${suffix}`;
}

function rewriteLinkUrl(url, sourcePath, routeBySourcePath) {
  if (!isRelativeUrl(url)) return url;

  const { pathPart, suffix } = splitUrlSuffix(url);
  if (!pathPart) return url;

  const repoPath = normalizeRepoPath(sourcePath, pathPart);
  const repoPathWithoutSlash = repoPath.replace(/\/+$/, "");
  const markdownPath = repoPathWithoutSlash.toLowerCase().endsWith(".md")
    ? repoPathWithoutSlash
    : `${repoPathWithoutSlash}.md`;

  const includedRoute = routeBySourcePath.get(markdownPath);
  if (includedRoute) return `${includedRoute}${suffix}`;

  if (repoPathWithoutSlash === "docs") return `/workshop${suffix}`;
  if (repoPathWithoutSlash === "docs/learner")
    return `/workshop/learner${suffix}`;
  if (repoPathWithoutSlash === "docs/instructor") {
    return `/workshop/instructor${suffix}`;
  }

  const githubBase =
    pathPart.endsWith("/") || !posixPath.extname(repoPathWithoutSlash)
      ? GITHUB_TREE_BASE
      : GITHUB_BLOB_BASE;
  return `${githubBase}/${encodeRepoPath(repoPathWithoutSlash)}${suffix}`;
}

function readInlineCodeSpan(markdown, start) {
  if (markdown[start] !== "`") return null;

  let markerEnd = start + 1;
  while (markdown[markerEnd] === "`") markerEnd += 1;

  const marker = markdown.slice(start, markerEnd);
  const close = markdown.indexOf(marker, markerEnd);
  if (close === -1) return null;

  return { end: close + marker.length };
}

function readHtmlImage(markdown, start, sourcePath) {
  if (!/^<img(?=\s|\/>)/i.test(markdown.slice(start))) return null;

  let quote = null;
  let end = start + 4;

  while (end < markdown.length) {
    const char = markdown[end];
    if (quote) {
      if (char === quote) quote = null;
    } else if (char === `"` || char === `'`) {
      quote = char;
    } else if (char === ">") {
      end += 1;
      break;
    }
    end += 1;
  }

  if (end > markdown.length || markdown[end - 1] !== ">") return null;

  const tag = markdown.slice(start, end);
  const srcAttribute = /(\s+src\s*=\s*)(["'])(.*?)\2/i;
  const match = tag.match(srcAttribute);
  if (!match) return { end, value: tag };

  const rewrittenSrc = rewriteImageUrl(match[3], sourcePath);
  return {
    end,
    value: tag.replace(
      srcAttribute,
      (_match, prefix, quote) => `${prefix}${quote}${rewrittenSrc}${quote}`,
    ),
  };
}

function findClosingBracket(markdown, openBracket) {
  let depth = 1;
  let index = openBracket + 1;

  while (index < markdown.length) {
    const codeSpan = readInlineCodeSpan(markdown, index);
    if (codeSpan) {
      index = codeSpan.end;
      continue;
    }

    const char = markdown[index];
    if (char === "\\") {
      index += 2;
      continue;
    }
    if (char === "[") depth += 1;
    if (char === "]") depth -= 1;
    if (depth === 0) return index;

    index += 1;
  }

  return null;
}

function readParenthesizedTarget(markdown, openParen) {
  let depth = 1;
  let index = openParen + 1;

  while (index < markdown.length) {
    const char = markdown[index];
    if (char === "\n") return null;
    if (char === "\\") {
      index += 2;
      continue;
    }
    if (char === "(") depth += 1;
    if (char === ")") depth -= 1;
    if (depth === 0) {
      return {
        end: index + 1,
        target: markdown.slice(openParen + 1, index),
      };
    }

    index += 1;
  }

  return null;
}

function readReferenceDefinition(
  markdown,
  start,
  sourcePath,
  routeBySourcePath,
) {
  if (start !== 0 && markdown[start - 1] !== "\n") return null;

  const lineEnd = markdown.indexOf("\n", start);
  const end = lineEnd === -1 ? markdown.length : lineEnd;
  const definition = parseReferenceDefinitionLine(markdown.slice(start, end));
  if (!definition) return null;

  return {
    end,
    value: `${definition.indent}[${definition.label}]: ${rewriteLinkUrl(
      definition.url,
      sourcePath,
      routeBySourcePath,
    )}${definition.title}`,
  };
}

function readReferenceImage(
  markdown,
  closeBracket,
  text,
  referenceDefinitions,
) {
  let label = text;
  let end = closeBracket + 1;

  if (markdown[closeBracket + 1] === "[") {
    const closeLabel = findClosingBracket(markdown, closeBracket + 1);
    if (closeLabel == null) return null;

    const explicitLabel = markdown.slice(closeBracket + 2, closeLabel);
    label = explicitLabel || text;
    end = closeLabel + 1;
  }

  const definition = referenceDefinitions.get(normalizeReferenceLabel(label));
  if (!definition) return null;

  return {
    end,
    value: `![${text}](${definition.imageUrl}${definition.title})`,
  };
}

function readMarkdownReference(
  markdown,
  start,
  sourcePath,
  routeBySourcePath,
  referenceDefinitions,
) {
  const isImage = markdown[start] === "!" && markdown[start + 1] === "[";
  const openBracket = isImage ? start + 1 : start;
  if (markdown[openBracket] !== "[") return null;

  const closeBracket = findClosingBracket(markdown, openBracket);
  if (closeBracket == null) return null;

  const text = markdown.slice(openBracket + 1, closeBracket);
  const rewrittenText = isImage
    ? text
    : rewriteMarkdownReferenceSegment(
        text,
        sourcePath,
        routeBySourcePath,
        referenceDefinitions,
      );

  if (markdown[closeBracket + 1] !== "(") {
    if (!isImage) return null;
    return readReferenceImage(
      markdown,
      closeBracket,
      rewrittenText,
      referenceDefinitions,
    );
  }

  const target = readParenthesizedTarget(markdown, closeBracket + 1);
  if (!target) return null;

  const { url, title } = splitTarget(target.target);
  const rewritten = isImage
    ? rewriteImageUrl(url, sourcePath)
    : rewriteLinkUrl(url, sourcePath, routeBySourcePath);
  const prefix = isImage ? `![${text}]` : `[${rewrittenText}]`;

  return {
    end: target.end,
    value: `${prefix}(${rewritten}${title})`,
  };
}

function rewriteMarkdownReferenceSegment(
  segment,
  sourcePath,
  routeBySourcePath,
  referenceDefinitions,
) {
  let output = "";
  let index = 0;

  while (index < segment.length) {
    const htmlImage = readHtmlImage(segment, index, sourcePath);
    if (htmlImage) {
      output += htmlImage.value;
      index = htmlImage.end;
      continue;
    }

    const definition = readReferenceDefinition(
      segment,
      index,
      sourcePath,
      routeBySourcePath,
    );
    if (definition) {
      output += definition.value;
      index = definition.end;
      continue;
    }

    const reference = readMarkdownReference(
      segment,
      index,
      sourcePath,
      routeBySourcePath,
      referenceDefinitions,
    );
    if (reference) {
      output += reference.value;
      index = reference.end;
      continue;
    }

    const codeSpan = readInlineCodeSpan(segment, index);
    if (codeSpan) {
      output += segment.slice(index, codeSpan.end);
      index = codeSpan.end;
      continue;
    }

    output += segment[index];
    index += 1;
  }

  return output;
}

function rewriteMarkdownReferences(markdown, sourcePath, routeBySourcePath) {
  const referenceDefinitions = collectReferenceDefinitions(
    markdown,
    sourcePath,
  );

  return markdown
    .split(FENCED_CODE_BLOCK_PATTERN)
    .map((segment, index) => {
      if (index % 2 === 1) return segment;

      return rewriteMarkdownReferenceSegment(
        segment,
        sourcePath,
        routeBySourcePath,
        referenceDefinitions,
      );
    })
    .join("");
}

function workshopCallout(sourcePath) {
  const sourceUrl = `${GITHUB_BLOB_BASE}/${encodeRepoPath(sourcePath)}`;
  return `<Callout type="info" title="Workshop source">

Workshop material is maintained in the public [\`${REPO_SLUG}\`](${REPO_URL}) repository. Use the repository for the runnable app, checkpoint branches, and local setup.

[View this Markdown file](${sourceUrl})

</Callout>`;
}

function injectCallout(markdown, sourcePath) {
  const callout = workshopCallout(sourcePath);
  if (/^#\s+.+$/m.test(markdown)) {
    return markdown.replace(/^(#\s+.+)$/m, `$1\n\n${callout}`);
  }
  return `# ${extractTitle(markdown, sourcePath)}\n\n${callout}\n\n${markdown}`;
}

function yamlString(value) {
  return JSON.stringify(value);
}

function frontmatter(fields) {
  const lines = ["---"];
  for (const [key, value] of Object.entries(fields)) {
    if (value == null || value === "") continue;
    lines.push(`${key}: ${yamlString(value)}`);
  }
  lines.push("---", "");
  return lines.join("\n");
}

function buildGeneratedPage(markdown, file, routeBySourcePath) {
  const withoutFrontmatter = stripFrontmatter(markdown).trim();
  const rewritten = rewriteMarkdownReferences(
    withoutFrontmatter,
    file.sourcePath,
    routeBySourcePath,
  );
  const title = extractTitle(rewritten, file.sourcePath);
  const description = extractDescription(rewritten);
  const body = injectCallout(rewritten, file.sourcePath);

  return `${frontmatter({
    title,
    description,
    shortTitle: file.shortTitle,
  })}${body.trimEnd()}\n`;
}

async function writeJson(outputDir, relativePath, data) {
  const targetPath = path.join(outputDir, relativePath);
  await fs.mkdir(path.dirname(targetPath), { recursive: true });
  await fs.writeFile(targetPath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

async function writePage(outputDir, file, content) {
  const targetPath = path.join(outputDir, file.outputPath);
  await fs.mkdir(path.dirname(targetPath), { recursive: true });
  await fs.writeFile(targetPath, content, "utf8");
}

async function main() {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "workshop-sync-"));
  try {
    await syncFromRepo(await downloadRepo(tempDir));
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
}

async function syncFromRepo(repoDir, outputDir = OUTPUT_DIR) {
  const { files, folderMetas, learnerPages, instructorPages } =
    await collectWorkshopFiles(repoDir);
  const routeBySourcePath = new Map(
    files.map((file) => [file.sourcePath, file.route]),
  );

  await fs.rm(outputDir, { recursive: true, force: true });
  await fs.mkdir(outputDir, { recursive: true });

  const pages = await Promise.all(
    files.map(async (file) => {
      const markdown = await readMarkdown(repoDir, file.sourcePath);
      return {
        file,
        content: buildGeneratedPage(markdown, file, routeBySourcePath),
      };
    }),
  );

  for (const page of pages) {
    await writePage(outputDir, page.file, page.content);
  }

  for (const folderMeta of folderMetas) {
    await writeJson(outputDir, folderMeta.outputPath, {
      pages: folderMeta.pages,
    });
  }

  await writeJson(outputDir, "meta.json", {
    title: "Workshop",
    pages: ["index", "learner", "instructor"],
  });
  await writeJson(outputDir, "learner/meta.json", {
    title: "Lessons",
    defaultOpen: true,
    pages: learnerPages,
  });
  await writeJson(outputDir, "instructor/meta.json", {
    title: "For Instructors",
    pages: instructorPages,
  });

  console.log(
    `Synced ${pages.length} workshop page(s) from ${REPO_SLUG}@${REF} into content/workshop`,
  );
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}

export { downloadRepo, rewriteMarkdownReferences, syncFromRepo };
