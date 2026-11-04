// MDX helpers for the docs translation pipeline (see i18n/README.md).
//
// The model never sees code: front matter, ESM imports/exports, fenced code
// blocks, math blocks, and lines that hold only JSX/HTML tags are replaced by
// placeholder lines before translation and restored afterwards.

import { createProcessor } from "@mdx-js/mdx";
import Slugger from "github-slugger";
import YAML from "yaml";

export const TRANSLATABLE_FRONTMATTER_KEYS = [
  "title",
  "description",
  "sidebarTitle",
  "shortTitle",
  "seoTitle",
];

const placeholder = (index) => `⟦KEEP_${index}⟧`;
const PLACEHOLDER_LINE = /^\s*⟦KEEP_(\d+)⟧\s*$/;
const PLACEHOLDER_ANY = /⟦KEEP_(\d+)⟧/g;

/** Splits `---` front matter from the body. `data` is null when there is none or it does not parse. */
export function splitFrontmatter(source) {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---[ \t]*(?:\r?\n|$)/);
  if (!match) return { data: null, raw: null, body: source };
  let data = null;
  try {
    data = YAML.parse(match[1]) ?? {};
  } catch {
    data = null;
  }
  return { data, raw: match[0], body: source.slice(match[0].length) };
}

function fenceEnd(lines, start, marker) {
  const char = marker[0];
  const closing = new RegExp(`^\\s*\\${char}{${marker.length},}\\s*$`);
  for (let i = start + 1; i < lines.length; i++) {
    if (closing.test(lines[i])) return i;
  }
  return lines.length - 1;
}

function esmEnd(lines, start) {
  const first = lines[start];
  if (first.startsWith("import")) {
    const done = /(\bfrom\s+["'][^"']+["']|^import\s+["'][^"']+["'])\s*;?\s*$/;
    for (let i = start; i < lines.length; i++) {
      if (done.test(lines[i])) return i;
    }
    return start;
  }
  // export: run until brackets balance at the end of a line.
  let depth = 0;
  for (let i = start; i < lines.length; i++) {
    for (const ch of lines[i]) {
      if ("{[(".includes(ch)) depth++;
      else if ("}])".includes(ch)) depth--;
    }
    if (depth <= 0) return i;
  }
  return lines.length - 1;
}

const TAG_START = /^\s*<\/?[A-Za-z]/;
const MAX_TAG_LINES = 500;

/**
 * Returns the last line index of a JSX/HTML tag that starts a line and ends a
 * line, or -1. Scans quotes and `{...}` expressions, so props may span blank
 * lines and contain `<`, `>`, or nested JSX.
 */
function tagEnd(lines, start) {
  if (!TAG_START.test(lines[start])) return -1;
  let depth = 0;
  let quote = null;
  for (let i = start; i < Math.min(lines.length, start + MAX_TAG_LINES); i++) {
    const line = lines[i];
    const from = i === start ? line.indexOf("<") + 1 : 0;
    for (let j = from; j < line.length; j++) {
      const ch = line[j];
      if (quote) {
        if (ch === "\\") j++;
        else if (ch === quote) quote = null;
      } else if (ch === '"' || ch === "'" || ch === "`") {
        // Outside braces, only attribute values are quoted.
        if (depth > 0 || line[j - 1] === "=") quote = ch;
      } else if (ch === "{") depth++;
      else if (ch === "}") depth--;
      else if (ch === ">" && depth === 0) {
        return line.slice(j + 1).trim() === "" ? i : -1;
      }
    }
  }
  return -1;
}

/**
 * Replaces everything the model must not translate with placeholder lines.
 * Returns the masked body and the original text of each placeholder.
 */
export function maskBody(body) {
  const lines = body.split("\n");
  const slots = [];
  const out = [];
  const protect = (start, end) => {
    const indent = lines[start].match(/^\s*/)[0];
    out.push(indent + placeholder(slots.length));
    slots.push(lines.slice(start, end + 1).join("\n"));
  };

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const fence = line.match(/^\s*(`{3,}|~{3,})/);
    let end = -1;
    if (fence) end = fenceEnd(lines, i, fence[1]);
    else if (line.trim() === "$$") end = fenceEnd(lines, i, "$$");
    else if (/^(import|export)\s/.test(line)) end = esmEnd(lines, i);
    else end = tagEnd(lines, i);

    if (end === -1) {
      out.push(line);
      i++;
    } else {
      protect(i, end);
      i = end + 1;
    }
  }
  return { masked: out.join("\n"), slots };
}

/** Restores placeholder lines. Call checkPlaceholders first. */
export function unmaskBody(masked, slots) {
  return masked
    .split("\n")
    .map((line) => {
      const match = line.match(PLACEHOLDER_LINE);
      return match ? slots[Number(match[1])] : line;
    })
    .join("\n");
}

/** Replaces placeholders with a neutral marker, for showing previous versions as reference. */
export function hidePlaceholders(masked) {
  return masked.replace(PLACEHOLDER_ANY, "⟦…⟧");
}

export function checkPlaceholders(translated, slotCount) {
  const errors = [];
  const seen = [];
  for (const line of translated.split("\n")) {
    const tokens = [...line.matchAll(PLACEHOLDER_ANY)].map((m) => Number(m[1]));
    if (tokens.length === 0) continue;
    if (!PLACEHOLDER_LINE.test(line)) {
      errors.push(`Placeholder ⟦KEEP_${tokens[0]}⟧ must be alone on its line.`);
    }
    seen.push(...tokens);
  }
  const expected = Array.from({ length: slotCount }, (_, i) => i);
  if (seen.join(",") !== expected.join(",")) {
    const missing = expected.filter((i) => !seen.includes(i));
    const duplicated = seen.filter((v, i) => seen.indexOf(v) !== i);
    if (missing.length)
      errors.push(
        `Missing placeholders: ${missing.map(placeholder).join(", ")}.`,
      );
    if (duplicated.length)
      errors.push(
        `Duplicated placeholders: ${duplicated.map(placeholder).join(", ")}.`,
      );
    if (!missing.length && !duplicated.length)
      errors.push("Placeholders are out of order.");
  }
  return errors;
}

const HEADING = /^(#{1,6})\s+(.*?)\s*#*\s*$/;
const CUSTOM_ID = /\s*\[#([^\]]+?)]\s*$/;
// Same pattern as Fumadocs' remark-heading.
const FUMADOCS_CUSTOM_ID = /\s*\[#(?<slug>[^]+?)]\s*$/;

/** Lists the levels of the ATX headings of a masked body (code is masked, so `#` in code is ignored). */
export function headings(masked) {
  return masked
    .split("\n")
    .map((line) => line.match(HEADING))
    .filter(Boolean)
    .map((match) => ({ level: match[1].length }));
}

const flatten = (node) =>
  "children" in node
    ? node.children.map(flatten).join("")
    : typeof node.value === "string"
      ? node.value
      : "";

/**
 * Heading ids of an English body, computed the way Fumadocs' remark-heading
 * does: a `[#id]` suffix wins, otherwise github-slugger over the flattened
 * heading text. Returns null if the body does not parse as MDX.
 */
export function headingIds(body) {
  let tree;
  try {
    tree = createProcessor().parse(body);
  } catch {
    return null;
  }
  const slugger = new Slugger();
  const ids = [];
  const walk = (node) => {
    if (node.type === "heading") {
      const last = node.children.at(-1);
      const custom =
        last?.type === "text" ? FUMADOCS_CUSTOM_ID.exec(last.value) : null;
      ids.push({
        level: node.depth,
        id: custom?.[1] ?? slugger.slug(flatten(node)),
      });
      return;
    }
    node.children?.forEach(walk);
  };
  walk(tree);
  return ids;
}

/**
 * Pins the English heading ids on the translation, so `#anchor` links keep
 * working: every translated H2-H6 gets `[#id]` with the current English id,
 * replacing any id the model copied from an earlier translation. Returns null
 * when the headings cannot be matched one to one.
 */
export function pinHeadingIds(translatedMasked, englishIds) {
  const lines = translatedMasked.split("\n");
  const translated = lines.filter((line) => HEADING.test(line));
  if (
    !englishIds ||
    translated.length !== englishIds.length ||
    translated.some(
      (line, i) => line.match(HEADING)[1].length !== englishIds[i].level,
    )
  ) {
    return null;
  }
  let index = 0;
  return lines
    .map((line) => {
      if (!HEADING.test(line)) return line;
      const english = englishIds[index++];
      if (english.level === 1) return line;
      return `${line.trimEnd().replace(CUSTOM_ID, "")} [#${english.id}]`;
    })
    .join("\n");
}

const LINK_TARGETS = [
  /\]\(\s*<?([^)\s>]+)>?(?:\s+"[^"]*")?\s*\)/g,
  /\b(?:href|src)=["']([^"']+)["']/g,
];
const INLINE_CODE = /`[^`\n]+`/g;

function multiset(values) {
  const counts = new Map();
  for (const value of values) counts.set(value, (counts.get(value) ?? 0) + 1);
  return counts;
}

function diffMultiset(expected, actual) {
  const a = multiset(expected);
  const b = multiset(actual);
  const missing = [];
  const extra = [];
  for (const [value, count] of a)
    if ((b.get(value) ?? 0) < count) missing.push(value);
  for (const [value, count] of b)
    if ((a.get(value) ?? 0) < count) extra.push(value);
  return { missing, extra };
}

const limit = (values) =>
  values.slice(0, 5).join(", ") + (values.length > 5 ? ", …" : "");

/** Structural checks between the masked English body and the masked translation. */
export function compareStructure(englishMasked, translatedMasked) {
  const errors = [];
  const en = headings(englishMasked);
  const tr = headings(translatedMasked);
  if (en.map((h) => h.level).join() !== tr.map((h) => h.level).join()) {
    errors.push(
      `Headings differ: the source has ${en.length} headings (levels ${en.map((h) => h.level).join("")}), the translation has ${tr.length} (levels ${tr.map((h) => h.level).join("")}).`,
    );
  }
  const targets = (text) =>
    LINK_TARGETS.flatMap((re) => [...text.matchAll(re)].map((m) => m[1]));
  const links = diffMultiset(targets(englishMasked), targets(translatedMasked));
  if (links.missing.length)
    errors.push(`Missing link targets: ${limit(links.missing)}.`);
  if (links.extra.length)
    errors.push(`Unexpected link targets: ${limit(links.extra)}.`);
  const code = diffMultiset(
    englishMasked.match(INLINE_CODE) ?? [],
    translatedMasked.match(INLINE_CODE) ?? [],
  );
  if (code.missing.length)
    errors.push(`Inline code changed or missing: ${limit(code.missing)}.`);
  return errors;
}

/** Rebuilds front matter with translated fields; other fields are copied from the source. */
export function buildFrontmatter(data, translatedFields) {
  if (!data) return "";
  const merged = { ...data };
  for (const key of TRANSLATABLE_FRONTMATTER_KEYS) {
    if (
      typeof translatedFields?.[key] === "string" &&
      typeof data[key] === "string"
    ) {
      merged[key] = translatedFields[key];
    }
  }
  return `---\n${YAML.stringify(merged, { lineWidth: 0 })}---\n`;
}

export function translatableFrontmatter(data) {
  const fields = {};
  for (const key of TRANSLATABLE_FRONTMATTER_KEYS) {
    if (typeof data?.[key] === "string" && data[key].trim())
      fields[key] = data[key];
  }
  return fields;
}

/** Translatable strings of a Fumadocs meta.json: the title, `---Separator---` labels, and link labels. */
export function metaStrings(meta) {
  const strings = [];
  if (typeof meta.title === "string") strings.push(meta.title);
  for (const page of meta.pages ?? []) {
    const separator = page.match(/^---(.+)---$/);
    const link = page.match(/^(?:external:)?\[([^\]]+)]\(/);
    if (separator) strings.push(separator[1]);
    else if (link) strings.push(link[1]);
  }
  return strings;
}

export function applyMetaStrings(meta, translations) {
  const lookup = (value) => translations[value] ?? value;
  const result = { ...meta };
  if (typeof meta.title === "string") result.title = lookup(meta.title);
  if (Array.isArray(meta.pages)) {
    result.pages = meta.pages.map((page) => {
      const separator = page.match(/^---(.+)---$/);
      if (separator) return `---${lookup(separator[1])}---`;
      return page.replace(
        /^((?:external:)?\[)([^\]]+)(]\()/,
        (_, a, label, b) => `${a}${lookup(label)}${b}`,
      );
    });
  }
  return result;
}
