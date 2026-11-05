import { parse as parseYaml } from "yaml";

/** Section labels the playbook requires, in response order. */
export const CONSULTANT_PLAN_SECTIONS = [
  "Status quo",
  "Your plan",
  "Where you are in the loop",
  "What to instrument or evaluate",
  "Start this week",
  "Docs",
  "Prompt for your coding agent",
];

/**
 * Parse a skill Markdown file with YAML frontmatter. Throws if the name,
 * description, or body is missing.
 */
export function parseSkillFile(markdown, label = "skill") {
  if (typeof markdown !== "string" || !markdown.trim()) {
    throw new Error(`${label} is empty`);
  }
  const source = markdown.replace(/^\uFEFF/, "");
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) {
    throw new Error(`${label} is missing frontmatter`);
  }
  let frontmatter;
  try {
    frontmatter = parseYaml(match[1]) ?? {};
  } catch {
    throw new Error(`${label} frontmatter is not valid YAML`);
  }
  const name =
    typeof frontmatter.name === "string" ? frontmatter.name.trim() : "";
  const description =
    typeof frontmatter.description === "string"
      ? frontmatter.description.trim()
      : "";
  const instructions = match[2].trim();
  if (!name || !description) {
    throw new Error(`${label} frontmatter needs name and description`);
  }
  if (!instructions) {
    throw new Error(`${label} instructions are empty`);
  }
  return { name, description, instructions };
}

/**
 * Parse consultant.md. Throws if the playbook is missing, misnamed, or
 * no longer contains the plan sections the chat renders.
 */
export function parseConsultantSkill(markdown, expectedName) {
  const skill = parseSkillFile(markdown, "consultant.md");
  if (expectedName && skill.name !== expectedName) {
    throw new Error(
      `consultant.md name is "${skill.name}", expected "${expectedName}"`,
    );
  }
  const missing = CONSULTANT_PLAN_SECTIONS.filter(
    (section) => !skill.instructions.includes(section),
  );
  if (missing.length > 0) {
    throw new Error(
      `consultant.md is missing plan sections: ${missing.join(", ")}`,
    );
  }
  return skill;
}
