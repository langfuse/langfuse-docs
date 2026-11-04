/**
 * Pinned source for the public consultant playbook.
 *
 * The skill lives on `add-consultant-skill` and is not on skills main yet.
 * When it lands, point `branch` and `sha` at that commit and run
 * `node scripts/fetch-consultant-skill.mjs`. The docs build fetches this
 * file and fails if the pin cannot be read.
 */
export const CONSULTANT_SKILL_PIN = {
  owner: "langfuse",
  repo: "skills",
  branch: "add-consultant-skill",
  sha: "14b8f33819a7616385a98452535c2d4493159bf4",
  path: "skills/langfuse/references/consultant.md",
  name: "langfuse-consultant",
};

export function consultantSkillRawUrl(pin = CONSULTANT_SKILL_PIN) {
  return `https://raw.githubusercontent.com/${pin.owner}/${pin.repo}/${pin.sha}/${pin.path}`;
}
