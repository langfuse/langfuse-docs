/**
 * Helpers for /compare URLs in llms.txt. The competitor list is whatever
 * pages exist in the sitemap; short labels come from each page's
 * `shortTitle` frontmatter when present.
 */
"use strict";

function titleCaseSlug(segment) {
  return segment
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function comparePageLabel(slug, shortTitle) {
  if (shortTitle) return shortTitle;
  if (!slug) return "";
  return titleCaseSlug(slug);
}

/** Competitor slug from a /compare URL or pathname, or null for the section index. */
function comparePathnameSlug(pathname) {
  let path = String(pathname || "");
  try {
    if (/^https?:\/\//.test(path)) path = new URL(path).pathname;
  } catch {
    return null;
  }
  const parts = path.replace(/\/$/, "").split("/").filter(Boolean);
  if (parts[0] !== "compare" || parts.length < 2) return null;
  return parts[1];
}

function joinWithAnd(items) {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
}

/**
 * Build the llms.txt comparisons bullet from sitemap entries so the list
 * tracks whatever /compare pages exist.
 */
function formatCompareIndexLine(entries) {
  const links = [];

  for (const entry of entries || []) {
    if (!entry || !entry.url) continue;
    let pathname;
    try {
      pathname = new URL(entry.url).pathname;
    } catch {
      continue;
    }
    const slug = comparePathnameSlug(pathname);
    if (!slug) continue;
    const href = entry.url.endsWith(".md") ? entry.url : `${entry.url}.md`;
    const label = comparePageLabel(slug, entry.shortTitle);
    links.push({
      slug,
      label,
      markdown: `[${label}](${href})`,
    });
  }

  links.sort((a, b) => a.label.localeCompare(b.label));

  if (links.length === 0) return "";
  return `- Comparisons: ${joinWithAnd(links.map((l) => l.markdown))}, with dated competitor sources.\n\n`;
}

module.exports = {
  comparePageLabel,
  comparePathnameSlug,
  formatCompareIndexLine,
};
