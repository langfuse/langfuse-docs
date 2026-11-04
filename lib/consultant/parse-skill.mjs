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

function readField(frontmatter, key) {
  const match = frontmatter.match(new RegExp(`^${key}:\\s*(.*)$`, "m"));
  if (!match) return "";
  return match[1].trim().replace(/^["']|["']$/g, "");
}

/**
 * Parse consultant.md. Throws if the playbook is missing, misnamed, or
 * no longer contains the plan sections the chat renders.
 */
export function parseConsultantSkill(markdown, expectedName) {
  if (typeof markdown !== "string" || !markdown.trim()) {
    throw new Error("consultant.md is empty");
  }
  const source = markdown.replace(/^\uFEFF/, "");
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) {
    throw new Error("consultant.md is missing frontmatter");
  }
  const name = readField(match[1], "name");
  const description = readField(match[1], "description");
  const instructions = match[2].trim();
  if (!name || !description) {
    throw new Error("consultant.md frontmatter needs name and description");
  }
  if (expectedName && name !== expectedName) {
    throw new Error(
      `consultant.md name is "${name}", expected "${expectedName}"`,
    );
  }
  if (!instructions) {
    throw new Error("consultant.md instructions are empty");
  }
  const missing = CONSULTANT_PLAN_SECTIONS.filter(
    (section) => !instructions.includes(section),
  );
  if (missing.length > 0) {
    throw new Error(
      `consultant.md is missing plan sections: ${missing.join(", ")}`,
    );
  }
  return { name, description, instructions };
}
