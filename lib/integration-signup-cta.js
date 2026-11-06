/**
 * Markdown export of the integration-page sign-up banner.
 *
 * The rendered page gets <SignupCTA /> from remark-integration-signup-cta.mjs.
 * This module adds the same line to public/md-src so Markdown and PDF readers
 * see it too. Pages that already include the component are left alone.
 *
 * Keep SIGNUP_CTA_MARKDOWN in sync with the defaults in components/SignupCTA.tsx
 * and renderSignupCta() in lib/markdown-component-renderers.js.
 */

const SIGNUP_CTA_MARKDOWN = "**Start with Langfuse** [Sign up](/cloud)";

/**
 * @param {string} destRel path relative to public/md-src, e.g. "integrations/frameworks/crewai.md"
 */
function isIntegrationMarkdownDest(destRel) {
  return destRel === "integrations.md" || destRel.startsWith("integrations/");
}

/**
 * Insert the Markdown equivalent where the guide starts: the first section
 * heading, or a Steps/Tabs block when the headings live inside it. Fenced
 * examples are skipped.
 * @param {string} markdown
 * @param {string} insertion
 */
const GUIDE_START = /^(?: {0,3}#{2,6}(?:\s|$)| {0,3}<(?:Steps|Tabs)\b)/;

function insertBeforeFirstSection(markdown, insertion) {
  const lines = markdown.split("\n");
  let index = 0;
  if (lines[0] === "---") {
    index = 1;
    while (index < lines.length && lines[index] !== "---") index += 1;
    if (index < lines.length) index += 1;
  }

  let inFence = false;
  for (; index < lines.length; index += 1) {
    const line = lines[index];
    if (/^ {0,3}(?:`{3,}|~{3,})/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    if (GUIDE_START.test(line)) {
      const before = lines.slice(0, index).join("\n").replace(/\s+$/, "");
      const after = lines.slice(index).join("\n");
      return `${before}\n\n${insertion}\n\n${after}`;
    }
  }

  return `${markdown.replace(/\s+$/, "")}\n\n${insertion}\n`;
}

/**
 * @param {string} markdown
 * @param {string} destRel
 * @param {{ sourceHasSignupCta?: boolean }} [options]
 */
function injectIntegrationSignupCta(markdown, destRel, options = {}) {
  if (!isIntegrationMarkdownDest(destRel)) return markdown;
  if (options.sourceHasSignupCta) return markdown;
  if (markdown.includes(SIGNUP_CTA_MARKDOWN)) return markdown;
  if (/<SignupCTA\b/.test(markdown)) return markdown;
  return insertBeforeFirstSection(markdown, SIGNUP_CTA_MARKDOWN);
}

module.exports = {
  SIGNUP_CTA_MARKDOWN,
  isIntegrationMarkdownDest,
  insertBeforeFirstSection,
  injectIntegrationSignupCta,
};
