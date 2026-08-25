const { CATEGORIES, TERMS } = require("./glossary-data.js");
const {
  V4_CUTOVER_DATE_LONG,
  V4_CUTOVER_DATE_ISO,
  V4_CUTOVER_DATE_SHORT,
} = require("./v4-migration-dates.ts");
const { langfusePartnerProfiles } = require("./partner-profiles.ts");

function replaceComponentsWithMarkdown(fileContent) {
  const exportedResourceArrays = extractExportedResourceArrays(fileContent);
  return stripResourceArrayExports(
    replaceCardGroupsWithMarkdown(fileContent),
    Object.keys(exportedResourceArrays),
  )
    .replace(
      /<(ManualGuideCallout(?:Ja)?)\b([\s\S]*?)\/>/g,
      (_, componentName, attributes) =>
        `\n${renderManualGuideCallout(
          attributes,
          componentName === "ManualGuideCalloutJa",
        )}\n`,
    )
    .replace(
      /<ManualGuideList\b([\s\S]*?)\/>/g,
      (_, attributes) => `\n${renderManualGuideList(attributes)}\n`,
    )
    .replace(
      /<ProductUpdateSignup\b([\s\S]*?)\/>/g,
      (_, attributes) => `\n${renderProductUpdateSignup(attributes)}\n`,
    )
    .replace(
      /<VersionTimeline\b([\s\S]*?)\/>/g,
      (_, attributes) => `\n${renderVersionTimeline(attributes)}\n`,
    )
    .replace(/<Glossary\s*\/>/g, () => `\n${renderGlossary()}\n`)
    .replace(
      /<JudgePromptExample\s*\/>/g,
      () => `\n${renderJudgePromptExample()}\n`,
    )
    .replace(/<V4CutoverDate\s*\/>/g, () => renderV4CutoverDate())
    .replace(/\{V4_CUTOVER_DATE_SHORT\}/g, () => V4_CUTOVER_DATE_SHORT)
    .replace(/<PartnerProfiles\s*\/>/g, () => `\n${renderPartnerProfiles()}\n`)
    .replace(
      /<FurtherReading\b([\s\S]*?)\/>/g,
      (_, attributes) =>
        `\n${renderFurtherReading(attributes, exportedResourceArrays)}\n`,
    )
    .replace(/<Ref\b([\s\S]*?)\/>/g, (_, attributes) =>
      renderRef(attributes, exportedResourceArrays),
    )
    .replace(
      /<HexDashboard\b([\s\S]*?)\/>/g,
      () => `\n${renderHexDashboard()}\n`,
    )
    .replace(
      /<ImpactChart\b([\s\S]*?)\/>/g,
      (_, attributes) => `\n${renderImpactChart(attributes)}\n`,
    );
}

function replaceCardGroupsWithMarkdown(fileContent) {
  return splitOnCodeFences(fileContent)
    .map((segment, index) => {
      if (index % 2 !== 0) return segment;

      return segment.replace(
        /<Cards\b[^>]*>([\s\S]*?)<\/Cards>/g,
        (fullMatch, cardsSource) =>
          renderSelfClosingCards(cardsSource) ?? fullMatch,
      );
    })
    .join("");
}

/**
 * Finds each top-level `<Card ...>` element's [start, end) range in `cardsSource`
 * by tracking JSX nesting depth token-by-token, rather than a single regex.
 * A prior regex-only approach treated the first bare `/>` line as a Card's own
 * closing tag, which broke when a Card's `icon={...}` contained a multi-line
 * nested self-closing element (e.g. `<img .../>`) with `/>` alone on its own
 * line — the match ended at the icon's `/>`, not the Card's. Depth tracking
 * (every `<Tag` opens, every `/>` or `</Tag>` closes) handles arbitrary nesting.
 * Returns null if tags are unbalanced (should not happen for valid JSX).
 */
function findTopLevelCardRanges(cardsSource) {
  const tokenPattern = /<\/[A-Za-z][\w.]*>|\/>|<[A-Za-z][\w.]*/g;
  const ranges = [];
  let depth = 0;
  let cardStart = null;
  for (const match of cardsSource.matchAll(tokenPattern)) {
    const token = match[0];
    const isClosing = token === "/>" || token.startsWith("</");
    if (isClosing) {
      depth--;
      if (depth < 0) return null;
      if (depth === 0 && cardStart !== null) {
        ranges.push([cardStart, match.index + token.length]);
        cardStart = null;
      }
    } else {
      if (depth === 0 && token.slice(1) === "Card") {
        cardStart = match.index;
      }
      depth++;
    }
  }
  return depth === 0 ? ranges : null;
}

function renderSelfClosingCards(cardsSource) {
  const ranges = findTopLevelCardRanges(cardsSource);
  if (!ranges || ranges.length === 0) return null;

  const cardTagCount = (cardsSource.match(/<Card\b/g) ?? []).length;
  // Partial matches silently drop unsupported siblings; only convert complete groups.
  if (ranges.length !== cardTagCount) return null;

  let cursor = 0;
  for (const [start, end] of ranges) {
    if (cardsSource.slice(cursor, start).trim()) return null;
    cursor = end;
  }
  if (cardsSource.slice(cursor).trim()) return null;

  const lines = [];
  for (const [start, end] of ranges) {
    const attributes = cardsSource.slice(start, end);
    const title = extractAttributeString(attributes, "title");
    const href = extractAttributeString(attributes, "href");
    const description = extractAttributeString(attributes, "description");

    if (!title) return null;

    const renderedTitle = href ? `[${title}](${href})` : `**${title}**`;
    lines.push(`- ${renderedTitle}${description ? `: ${description}` : ""}`);
  }

  return `\n${lines.join("\n")}\n`;
}

function renderPartnerProfiles() {
  const lines = [];

  for (const profile of langfusePartnerProfiles) {
    lines.push(
      `### [${profile.name}](${profile.url})`,
      "",
      `**Regions:** ${profile.regions.join(", ")}`,
      "",
      profile.summary,
      "",
      "**Capabilities:**",
      "",
      ...profile.capabilities.map((capability) => `- ${capability}`),
      "",
    );
  }

  return lines.join("\n").trimEnd();
}

/**
 * Splits content on fenced code blocks; even indices are outside fences.
 * Keeps export handling away from code samples that merely show
 * `export const … = […]` (see PR #3436 review).
 */
function splitOnCodeFences(content) {
  return content.split(/(```[\s\S]*?```|~~~[\s\S]*?~~~)/);
}

function extractExportedResourceArrays(fileContent) {
  const arrays = {};
  for (const [index, segment] of splitOnCodeFences(fileContent).entries()) {
    if (index % 2 !== 0) continue;
    for (const match of segment.matchAll(
      /export const (\w+) = (\[[\s\S]*?\]);/g,
    )) {
      const resources = tryParseResourceArray(match[2]);
      if (resources && resources.length > 0) {
        arrays[match[1]] = resources;
      }
    }
  }
  return arrays;
}

function stripResourceArrayExports(fileContent, arrayNames) {
  if (arrayNames.length === 0) {
    return fileContent;
  }
  const pattern = new RegExp(
    `export const (?:${arrayNames.join("|")}) = \\[[\\s\\S]*?\\];\\n*`,
    "g",
  );
  return splitOnCodeFences(fileContent)
    .map((segment, index) =>
      index % 2 === 0 ? segment.replace(pattern, "") : segment,
    )
    .join("");
}

function tryParseResourceArray(arraySource) {
  try {
    return parseResourceArray(arraySource);
  } catch {
    return null;
  }
}

function parseResourceArray(arraySource) {
  return [...arraySource.matchAll(/\{([\s\S]*?)\}/g)].map(
    ([, resourceSource]) => {
      const title = extractObjectString(resourceSource, "title");
      const url = extractObjectString(resourceSource, "url");

      if (!title || !url) {
        throw new Error("Resource entries require string title and url values");
      }

      return {
        id: extractObjectString(resourceSource, "id"),
        title,
        url,
      };
    },
  );
}

function renderRef(attributes, exportedResourceArrays) {
  const id = extractAttributeString(attributes, "id");
  const refsMatch = attributes.match(/\brefs=\{(\w+)\}/);
  const refs = refsMatch ? exportedResourceArrays[refsMatch[1]] : undefined;

  if (!id || !refs) {
    throw new Error(
      "Ref requires an id and a refs identifier exported from the page",
    );
  }

  const index = refs.findIndex((resource) => resource.id === id);
  if (index === -1) {
    throw new Error(`Ref id "${id}" is not present in its refs array`);
  }

  return `[${index + 1}]`;
}

function renderFurtherReading(attributes, exportedResourceArrays) {
  let resources;
  const literalMatch = attributes.match(/\bresources=\{(\[[\s\S]*?\])\}/);
  if (literalMatch) {
    resources = parseResourceArray(literalMatch[1]);
  } else {
    const identifierMatch = attributes.match(/\bresources=\{(\w+)\}/);
    resources = identifierMatch
      ? exportedResourceArrays[identifierMatch[1]]
      : undefined;
  }

  if (!resources) {
    throw new Error("FurtherReading is missing a resources array");
  }

  if (resources.length === 0) {
    throw new Error("FurtherReading resources array is empty");
  }

  const numbered = /(?:^|\s)numbered(?:\s|=|$)/.test(attributes);
  if (numbered) {
    return resources
      .map(
        (resource, index) =>
          `${index + 1}. [${resource.title}](${resource.url})`,
      )
      .join("\n");
  }

  const lines = ["Further reading:"];
  for (const resource of resources) {
    lines.push(`- [${resource.title}](${resource.url})`);
  }
  return lines.join("\n");
}

function renderJudgePromptExample() {
  return [
    "```text",
    "# 1. Context",
    "You evaluate replies from an apartment-leasing assistant. The assistant",
    "answers using the property information provided in its context. It has",
    "no availability calendar and cannot schedule tours itself.",
    "",
    "# 2. One precise criterion, including what to ignore",
    "Criterion: the reply must only state facts present in the provided",
    "context. A reply that invents specifics (times, prices, availability)",
    "fails, even if it sounds helpful. Ignore style and formatting.",
    "",
    "# 3. Labeled examples with their reasons",
    "Example (fail):",
    'User: "Do you have a 2-bed available for July 1?"',
    'Reply: "Yes! I have a 2-bed ready for you, tour at 2pm works."',
    'Reasoning: the context contains no tour time. "2pm" is invented.',
    "Verdict: fail",
    "",
    "Example (pass):",
    'User: "What\'s the pet policy?"',
    'Reply: "Cats and dogs under 40 lbs are welcome with a $300 deposit."',
    "Reasoning: every fact (cats and dogs, 40 lbs, $300) is in the context.",
    "Verdict: pass",
    "",
    "# 4. Reasoning first, verdict last",
    "Evaluate the reply below. Write your reasoning first, then output exactly",
    "# 5. A way out",
    "one of: pass, fail, unknown.",
    "```",
  ].join("\n");
}

// The Hex iframe has no Markdown equivalent, so link Markdown/PDF readers
// to the public dashboard.
function renderHexDashboard() {
  return "[View the Langfuse public metrics dashboard](https://app.hex.tech/clickhouse-analytics/app/0349rZiOtG8QDXATQrRCSI/latest).";
}

function renderImpactChart(attributes) {
  const itemsMatch = attributes.match(/\bitems=\{(\[[\s\S]*\])\}/);
  if (!itemsMatch) {
    throw new Error("ImpactChart is missing an items array");
  }

  const items = parseImpactChartItems(itemsMatch[1]);
  if (items.length === 0) {
    throw new Error("ImpactChart items array is empty");
  }

  const lines = [];
  for (const item of items) {
    lines.push(`**${item.area}**`, "", item.impact, "");
    if (item.learnMore.length > 0) {
      for (const link of item.learnMore) {
        lines.push(`- [${link.title}](${link.href})`);
      }
      lines.push("");
    }
  }

  return lines.join("\n").trimEnd();
}

function parseImpactChartItems(arraySource) {
  return extractTopLevelObjectSources(arraySource).map((itemSource) => {
    const area = extractObjectString(itemSource, "area");
    const impact = extractObjectString(itemSource, "impact");

    if (!area || !impact) {
      throw new Error(
        "ImpactChart items require string area and impact values",
      );
    }

    const learnMore = extractImpactChartLearnMore(itemSource);
    return { area, impact, learnMore };
  });
}

function extractImpactChartLearnMore(itemSource) {
  const match = itemSource.match(/\blearnMore\s*:\s*\[([\s\S]*?)\]/);
  if (!match) return [];

  return extractTopLevelObjectSources(match[1]).map((linkSource) => {
    const title = extractObjectString(linkSource, "title");
    const href = extractObjectString(linkSource, "href");
    if (!title || !href) {
      throw new Error(
        "ImpactChart learnMore entries require string title and href values",
      );
    }
    return { title, href };
  });
}

function extractTopLevelObjectSources(source) {
  const objects = [];
  let depth = 0;
  let start = null;
  let inString = false;
  let escaping = false;

  for (let i = 0; i < source.length; i++) {
    const ch = source[i];

    if (inString) {
      if (escaping) {
        escaping = false;
      } else if (ch === "\\") {
        escaping = true;
      } else if (ch === '"') {
        inString = false;
      }
      continue;
    }

    if (ch === '"') {
      inString = true;
      continue;
    }

    if (ch === "{") {
      if (depth === 0) start = i + 1;
      depth++;
      continue;
    }

    if (ch === "}") {
      depth--;
      if (depth < 0) {
        throw new Error("ImpactChart items array has unbalanced braces");
      }
      if (depth === 0 && start !== null) {
        objects.push(source.slice(start, i));
        start = null;
      }
    }
  }

  if (depth !== 0) {
    throw new Error("ImpactChart items array has unbalanced braces");
  }

  return objects;
}

// Inline JSX (components/V4CutoverDate.tsx) renders <strong>/<code>; mirror
// it as plain text so Markdown/PDF readers still see the date, not a blank.
function renderV4CutoverDate() {
  return `${V4_CUTOVER_DATE_LONG} (${V4_CUTOVER_DATE_ISO})`;
}

// The email sign-up form has no Markdown equivalent, so point Markdown/PDF
// readers to the page where they can subscribe.
function renderProductUpdateSignup(attributes) {
  const list = extractAttributeString(attributes, "list");
  return list === "oss"
    ? "Subscribe to the Langfuse OSS newsletter at https://langfuse.com/self-hosting/oss-newsletter."
    : "Subscribe to the Langfuse product update newsletter at https://langfuse.com/changelog.";
}

function renderVersionTimeline(attributes) {
  const cloudOnly = /\bdeployments=\{\["cloud"\]\}/.test(attributes);
  const lines = [
    `- [Langfuse Cloud](/docs/v4): v3 and the v4 preview run side by side until ${V4_CUTOVER_DATE_LONG}. From then, Langfuse Cloud is v4-only and legacy APIs, features, and ingestion are removed.`,
  ];

  if (!cloudOnly) {
    lines.push(
      "- [Self-hosted Langfuse](/self-hosting/upgrade/upgrade-guides/upgrade-v3-to-v4): v4 has been generally available since July 29, 2026. Langfuse v3 receives security patches through January 2027.",
    );
  }

  return lines.join("\n");
}

function renderManualGuideCallout(attributes, isJapanese) {
  const href = extractAttributeString(attributes, "href");
  const topic = extractAttributeString(attributes, "topic");
  const lede = extractAttributeString(attributes, "lede");

  if (!href || !topic) {
    throw new Error("ManualGuideCallout requires string href and topic values");
  }

  const label = isJapanese ? "ガイド" : "Guide";
  const lines = [`> **${label}: [${topic}](${href})**`];
  if (lede) {
    lines.push(">", `> ${lede}`);
  }
  return lines.join("\n");
}

function renderManualGuideList(attributes) {
  const title = extractAttributeString(attributes, "title") ?? "Guides";
  const guidesMatch = attributes.match(/\bguides=\{\[([\s\S]*?)\]\}/);
  if (!guidesMatch) {
    throw new Error("ManualGuideList is missing a guides array");
  }

  const guides = [...guidesMatch[1].matchAll(/\{([\s\S]*?)\}/g)].map(
    ([, guideSource]) => {
      const href = extractObjectString(guideSource, "href");
      const topic = extractObjectString(guideSource, "topic");
      const lede = extractObjectString(guideSource, "lede");

      if (!href || !topic) {
        throw new Error(
          "ManualGuideList guides require string href and topic values",
        );
      }

      return { href, topic, lede };
    },
  );

  if (guides.length === 0) {
    throw new Error("ManualGuideList guides array is empty");
  }

  const lines = [`## ${title}`, ""];
  for (const guide of guides) {
    lines.push(
      `- [${guide.topic}](${guide.href})${guide.lede ? ` — ${guide.lede}` : ""}`,
    );
  }
  return lines.join("\n");
}

function extractObjectString(source, property) {
  return extractQuotedValue(
    source,
    new RegExp(`\\b${property}:\\s*"((?:\\\\.|[^"\\\\])*)"`),
  );
}

function extractAttributeString(source, attribute) {
  return extractQuotedValue(
    source,
    new RegExp(`\\b${attribute}="((?:\\\\.|[^"\\\\])*)"`),
  );
}

function extractQuotedValue(source, pattern) {
  const match = source.match(pattern);
  return match ? JSON.parse(`"${match[1]}"`) : null;
}

function renderGlossary() {
  const sortedTerms = TERMS.toSorted((a, b) => a.term.localeCompare(b.term));
  let currentLetter = "";
  const lines = [];

  for (const term of sortedTerms) {
    const letter = term.term[0].toUpperCase();
    if (letter !== currentLetter) {
      currentLetter = letter;
      lines.push(`## ${letter}`, "");
    }

    lines.push(`### ${term.term} [#${term.id}]`, "");
    if (term.synonyms?.length) {
      lines.push(`Also known as: ${term.synonyms.join(", ")}`, "");
    }
    lines.push(term.definition, "");
    if (term.categories?.length) {
      lines.push(
        `Categories: ${term.categories
          .map((category) => CATEGORIES[category]?.label ?? category)
          .join(", ")}`,
        "",
      );
    }
    if (term.relatedTerms?.length) {
      lines.push(`Related: ${term.relatedTerms.join(", ")}`, "");
    }
    if (term.link) {
      lines.push(`[Learn more](${term.link})`, "");
    }
  }

  return lines.join("\n");
}

module.exports = {
  replaceComponentsWithMarkdown,
};
