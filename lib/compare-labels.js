/**
 * Short display names for /compare/[competitor] pages. Used by breadcrumbs
 * and by llms.txt so a new compare page is picked up without editing a
 * hardcoded list. Unknown slugs fall back to title case.
 */
"use strict";

const COMPARE_LABELS = {
  langsmith: "LangSmith",
  braintrust: "Braintrust",
  "arize-phoenix": "Arize / Phoenix",
  galileo: "Galileo",
  datadog: "Datadog",
};

function titleCaseSlug(segment) {
  return segment
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function comparePageLabel(slug) {
  if (!slug) return "";
  return COMPARE_LABELS[slug] ?? titleCaseSlug(slug);
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

const KNOWN_SLUG_ORDER = Object.keys(COMPARE_LABELS);

/**
 * Build the llms.txt comparisons bullet from sitemap entries so the list
 * tracks whatever /compare pages exist.
 */
function formatCompareIndexLine(entries) {
  const knownOrder = new Map(KNOWN_SLUG_ORDER.map((slug, i) => [slug, i]));
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
    links.push({
      slug,
      markdown: `[${comparePageLabel(slug)}](${href})`,
    });
  }

  links.sort((a, b) => {
    const ai = knownOrder.has(a.slug) ? knownOrder.get(a.slug) : Infinity;
    const bi = knownOrder.has(b.slug) ? knownOrder.get(b.slug) : Infinity;
    if (ai !== bi) return ai - bi;
    return a.slug.localeCompare(b.slug);
  });

  if (links.length === 0) return "";
  return `- Comparisons: ${joinWithAnd(links.map((l) => l.markdown))}, with dated competitor sources.\n\n`;
}

module.exports = {
  COMPARE_LABELS,
  comparePageLabel,
  comparePathnameSlug,
  formatCompareIndexLine,
};
