const { CATEGORIES, TERMS } = require("./glossary-data.js");

function replaceComponentsWithMarkdown(fileContent) {
  return fileContent
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
    .replace(/<Glossary\s*\/>/g, () => `\n${renderGlossary()}\n`)
    .replace(
      /<AgentLlmsTxtFlow\s*\/>/g,
      () => `\n${renderAgentLlmsTxtFlow()}\n`,
    )
    .replace(
      /<EndpointGuessFlow\s*\/>/g,
      () => `\n${renderEndpointGuessFlow()}\n`,
    )
    .replace(/<TruncatedFetch\s*\/>/g, () => `\n${renderTruncatedFetch()}\n`)
    .replace(/<AxEnters\s*\/>/g, () => `\n${renderAxEnters()}\n`);
}

// The diagram's content only exists as JSX, so mirror it here for Markdown and
// PDF consumers.
function renderAxEnters() {
  return [
    "UX and DX are already on stage, drawn as a person and a terminal. AX",
    "arrives as a third audience, drawn as an agent.",
  ].join(" ");
}

// The diagram's content only exists as JSX, so mirror it here for Markdown and
// PDF consumers.
function renderTruncatedFetch() {
  return [
    "An agent fetches a Langfuse docs page, but only the top of the page comes",
    "back: the first lines are retrieved, and everything below the cut-off is",
    "never seen by the agent.",
  ].join(" ");
}

// The diagram's content only exists as JSX, so mirror it here for Markdown and
// PDF consumers.
function renderEndpointGuessFlow() {
  return [
    'An agent asked to "fetch the latest traces" faces two candidate',
    "endpoints: the deprecated `/api/public/traces` and",
    '`/api/public/v2/observations`. Because the word "traces" appears in the',
    "request, it follows the branch to the deprecated endpoint.",
  ].join(" ");
}

// The diagram's content only exists as JSX, so mirror it here for Markdown and
// PDF consumers.
function renderAgentLlmsTxtFlow() {
  return [
    "An agent working out how to instrument a Python Vercel AI SDK application",
    "calls its webfetch tool for `langfuse.com/llms.txt` with the query",
    '"langfuse instrumentation for Vercel AI SDK Python". The tool matches the',
    "page content against that query and returns only the matching integration",
    "line, `langfuse.com/integrations/frameworks/vercel-ai-sdk.md`. The line in",
    "llms.txt recommending the Langfuse skill never reaches the agent.",
  ].join(" ");
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
