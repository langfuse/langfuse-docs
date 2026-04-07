/**
 * Strip MDX-only artifacts for plain-markdown / PDF pipelines.
 * Used by scripts/copy_md_sources.js and app/api/md-to-pdf/route.ts.
 *
 * @param {string} content
 * @param {{ unwrapCalloutsForPlainMd?: boolean }} [options]
 *   When true (md-src build): unwrap <Callout> to inner markdown only.
 *   When false (PDF): leave <Callout> for downstream HTML conversion.
 * @returns {string}
 */
function stripMdxForPlainMarkdown(content, options = {}) {
  const unwrapCalloutsForPlainMd = Boolean(options.unwrapCalloutsForPlainMd);
  const parts = splitMarkdownByTripleBacktickFences(content);
  return parts
    .map((p) =>
      p.fenced ? p.text : stripOutsideFences(p.text, unwrapCalloutsForPlainMd)
    )
    .join("");
}

/**
 * @param {string} content
 * @returns {{ fenced: boolean, text: string }[]}
 */
function splitMarkdownByTripleBacktickFences(content) {
  /** @type {{ fenced: boolean, text: string }[]} */
  const segments = [];
  let remaining = content;
  while (remaining.length > 0) {
    const open = remaining.indexOf("```");
    if (open === -1) {
      segments.push({ fenced: false, text: remaining });
      break;
    }
    if (open > 0) {
      segments.push({ fenced: false, text: remaining.slice(0, open) });
    }
    const afterOpen = remaining.slice(open + 3);
    const close = afterOpen.indexOf("```");
    if (close === -1) {
      segments.push({ fenced: true, text: remaining.slice(open) });
      break;
    }
    const fenceEnd = open + 3 + close + 3;
    segments.push({ fenced: true, text: remaining.slice(open, fenceEnd) });
    remaining = remaining.slice(fenceEnd);
  }
  return segments;
}

/**
 * @param {string} text
 * @param {boolean} unwrapCalloutsForPlainMd
 */
function stripOutsideFences(text, unwrapCalloutsForPlainMd) {
  let s = stripTopLevelImportBlocks(text);
  if (unwrapCalloutsForPlainMd) {
    s = unwrapCalloutTags(s);
  }
  s = stripMdxJsxArtifacts(s, { preserveCallout: !unwrapCalloutsForPlainMd });
  s = s.replace(/\n{3,}/g, "\n\n");
  return s;
}

/**
 * Single-line `import … from "…"` or `import "…"` without trailing `;` (valid ESM / ASI).
 * @param {string} block
 */
function isCompleteSingleLineImportWithoutSemicolon(block) {
  const parts = block.split(/\r?\n/);
  if (parts.length !== 1) return false;
  const line = parts[0];
  if (!/^\s*import\s/.test(line) || /;\s*$/.test(line)) return false;
  return (
    /\bfrom\s+['"][^'"]+['"]\s*$/.test(line) ||
    /^\s*import\s+['"][^'"]+['"]\s*$/.test(line)
  );
}

/**
 * Multiline import whose last line ends the `from "…"` clause without `;`.
 * @param {string} block
 */
function isCompleteMultilineImportWithoutSemicolon(block) {
  const parts = block.split(/\r?\n/);
  if (parts.length < 2) return false;
  const last = parts[parts.length - 1];
  if (!/^\s*import\s/.test(parts[0]) || /;\s*$/.test(last)) return false;
  return /\bfrom\s+['"][^'"]+['"]\s*$/.test(last);
}

/**
 * Remove ESM import statements (line-based, supports multiline import blocks).
 * Stops without requiring `;` when the import is already complete (ASI-safe).
 * @param {string} text
 */
function stripTopLevelImportBlocks(text) {
  const lines = text.split(/\r?\n/);
  /** @type {string[]} */
  const out = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (/^\s*import\s/.test(line)) {
      let j = i;
      let block = lines[j];
      while (!/;\s*$/.test(block) && j + 1 < lines.length) {
        if (
          isCompleteSingleLineImportWithoutSemicolon(block) ||
          isCompleteMultilineImportWithoutSemicolon(block)
        ) {
          break;
        }
        j += 1;
        block += "\n" + lines[j];
      }
      i = j + 1;
      continue;
    }
    out.push(line);
    i += 1;
  }
  return out.join("\n");
}

/**
 * @param {string} s
 */
function unwrapCalloutTags(s) {
  return s.replace(
    /<Callout[^>]*>([\s\S]*?)<\/Callout>/g,
    "\n\n$1\n\n"
  );
}

/**
 * @param {string} s
 * @param {{ preserveCallout: boolean }} opts
 */
function stripMdxJsxArtifacts(s, opts) {
  const { preserveCallout } = opts;
  const skipCallout = preserveCallout ? "(?!Callout\\b)" : "";
  let prev;
  let out = s;
  do {
    prev = out;
    // Self-closing MDX components (PascalCase), e.g. <FaqIndex />
    out = out.replace(
      new RegExp(
        `<${skipCallout}([A-Z][A-Za-z0-9_]*)(?:\\s[^>]*)?\\s*/>`,
        "g"
      ),
      ""
    );
    // Empty paired PascalCase tags
    out = out.replace(
      new RegExp(
        `<${skipCallout}([A-Z][A-Za-z0-9_]*)(?:\\s[^>]*)?>\\s*</\\1>`,
        "g"
      ),
      ""
    );
    // React-style empty layout divs from MDX
    out = out.replace(/<div\s[^/>]*\/>/gi, "");
    out = out.replace(/<div\s[^>]*>\s*<\/div>/gi, "");
  } while (out !== prev);
  return out;
}

module.exports = {
  stripMdxForPlainMarkdown,
};
