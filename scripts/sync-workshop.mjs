#!/usr/bin/env node

import { existsSync } from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";
import posixPath from "node:path/posix";
import process from "node:process";
import workshopConfig from "../lib/workshop-config.js";

const OWNER = "langfuse";
const REPO = "langfuse-workshop";
const REF = "main";
const REPO_SLUG = `${OWNER}/${REPO}`;
const REPO_URL = `https://github.com/${REPO_SLUG}`;
const API_CONTENTS_URL = `https://api.github.com/repos/${REPO_SLUG}/contents`;
const GITHUB_BLOB_BASE = `${REPO_URL}/blob/${REF}`;
const GITHUB_TREE_BASE = `${REPO_URL}/tree/${REF}`;
const RAW_BASE = `https://raw.githubusercontent.com/${REPO_SLUG}/${REF}`;
const OUTPUT_DIR = path.join(process.cwd(), "content", "workshop");
const FENCED_CODE_BLOCK_PATTERN = /(```[\s\S]*?```|~~~[\s\S]*?~~~)/g;
const { WORKSHOP_DEFAULT_CHAPTER } = workshopConfig;

const initialEnvKeys = new Set(Object.keys(process.env));

function parseEnvValue(value) {
  const trimmed = value.trim();
  const quote = trimmed[0];
  if (
    (quote === `"` || quote === `'`) &&
    trimmed[trimmed.length - 1] === quote
  ) {
    const unquoted = trimmed.slice(1, -1);
    return quote === `"`
      ? unquoted.replace(/\\n/g, "\n").replace(/\\"/g, `"`)
      : unquoted;
  }
  return trimmed;
}

async function loadEnvFiles() {
  for (const filename of [".env", ".env.local"]) {
    const filePath = path.join(process.cwd(), filename);
    if (!existsSync(filePath)) continue;

    const contents = await fs.readFile(filePath, "utf8");
    for (const line of contents.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;

      const match = trimmed.match(
        /^(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)=(.*)$/,
      );
      if (!match) continue;

      const [, key, rawValue] = match;
      if (initialEnvKeys.has(key)) continue;
      process.env[key] = parseEnvValue(rawValue);
    }
  }
}

function githubToken() {
  return process.env.GITHUB_ACCESS_TOKEN || process.env.GITHUB_TOKEN || null;
}

function githubHeaders(accept) {
  const headers = {
    Accept: accept,
    "User-Agent": "langfuse-docs-workshop-sync",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  const token = githubToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

function encodeRepoPath(repoPath) {
  return repoPath.split("/").map(encodeURIComponent).join("/");
}

function contentsUrl(repoPath) {
  return `${API_CONTENTS_URL}/${encodeRepoPath(repoPath)}?ref=${REF}`;
}

async function fetchGitHub(repoPath, accept) {
  const response = await fetch(contentsUrl(repoPath), {
    headers: githubHeaders(accept),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(
      `Failed to fetch ${repoPath} from ${REPO_SLUG}@${REF}: ${response.status} ${response.statusText}\n${body}`,
    );
  }

  return response;
}

async function fetchJson(repoPath) {
  const response = await fetchGitHub(repoPath, "application/vnd.github+json");
  return response.json();
}

async function fetchMarkdown(repoPath) {
  const response = await fetchGitHub(repoPath, "application/vnd.github.raw");
  return response.text();
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

async function collectWorkshopFiles() {
  const [learnerEntries, instructorEntries] = await Promise.all([
    fetchJson("docs/learner"),
    fetchJson("docs/instructor"),
  ]);

  const learnerFiles = sortByName(
    learnerEntries.filter(
      (entry) => isMarkdownFile(entry) && entry.name !== "README.md",
    ),
  );
  const instructorFiles = sortByName(
    instructorEntries.filter(
      (entry) => isMarkdownFile(entry) && entry.name !== "README.md",
    ),
  );

  if (
    !learnerFiles.some(
      (entry) => slugFromFileName(entry.name) === WORKSHOP_DEFAULT_CHAPTER,
    )
  ) {
    throw new Error(
      `Expected docs/learner/${WORKSHOP_DEFAULT_CHAPTER}.md in ${REPO_SLUG}@${REF}`,
    );
  }
  if (
    !instructorFiles.some(
      (entry) => slugFromFileName(entry.name) === WORKSHOP_DEFAULT_CHAPTER,
    )
  ) {
    throw new Error(
      `Expected docs/instructor/${WORKSHOP_DEFAULT_CHAPTER}.md in ${REPO_SLUG}@${REF}`,
    );
  }

  return [
    {
      sourcePath: "README.md",
      outputPath: "index.mdx",
      route: "/workshop",
      shortTitle: "Overview",
    },
    ...learnerFiles.map((entry) => {
      const slug = slugFromFileName(entry.name);
      return {
        sourcePath: entry.path,
        outputPath: `learner/${slug}.mdx`,
        route: `/workshop/learner/${slug}`,
      };
    }),
    ...instructorFiles.map((entry) => {
      const slug = slugFromFileName(entry.name);
      return {
        sourcePath: entry.path,
        outputPath: `instructor/${slug}.mdx`,
        route: `/workshop/instructor/${slug}`,
      };
    }),
  ];
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

async function writeJson(relativePath, data) {
  const targetPath = path.join(OUTPUT_DIR, relativePath);
  await fs.mkdir(path.dirname(targetPath), { recursive: true });
  await fs.writeFile(targetPath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

async function writePage(file, content) {
  const targetPath = path.join(OUTPUT_DIR, file.outputPath);
  await fs.mkdir(path.dirname(targetPath), { recursive: true });
  await fs.writeFile(targetPath, content, "utf8");
}

async function main() {
  await loadEnvFiles();

  const files = await collectWorkshopFiles();
  const routeBySourcePath = new Map(
    files.map((file) => [file.sourcePath, file.route]),
  );

  await fs.rm(OUTPUT_DIR, { recursive: true, force: true });
  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  const pages = await Promise.all(
    files.map(async (file) => {
      const markdown = await fetchMarkdown(file.sourcePath);
      return {
        file,
        content: buildGeneratedPage(markdown, file, routeBySourcePath),
      };
    }),
  );

  for (const page of pages) {
    await writePage(page.file, page.content);
  }

  const learnerPages = files
    .filter((file) => file.outputPath.startsWith("learner/"))
    .map((file) => path.basename(file.outputPath, ".mdx"));
  const instructorPages = files
    .filter((file) => file.outputPath.startsWith("instructor/"))
    .map((file) => path.basename(file.outputPath, ".mdx"));

  await writeJson("meta.json", {
    title: "Workshop",
    pages: ["index", "learner", "instructor"],
  });
  await writeJson("learner/meta.json", {
    title: "Lessons",
    defaultOpen: true,
    pages: learnerPages,
  });
  await writeJson("instructor/meta.json", {
    title: "For Instructors",
    pages: instructorPages,
  });

  console.log(
    `Synced ${pages.length} workshop page(s) from ${REPO_SLUG}@${REF} into content/workshop`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
