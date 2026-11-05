/**
 * Pinned source for the public consultant skills.
 *
 * The consultant playbook lives on `add-consultant-skill` and is not on
 * skills main yet. When it lands, point `branch` and `sha` at that commit and
 * run `node scripts/fetch-consultant-skill.mjs`. The script bakes the
 * playbook and every skill under `skillsRoot` into skill.generated.ts.
 */
export const CONSULTANT_SKILL_PIN = {
  owner: "langfuse",
  repo: "skills",
  branch: "add-consultant-skill",
  sha: "14b8f33819a7616385a98452535c2d4493159bf4",
  path: "skills/langfuse/references/consultant.md",
  name: "langfuse-consultant",
  skillsRoot: "skills",
};

export function consultantSkillTarballUrl(pin = CONSULTANT_SKILL_PIN) {
  return `https://codeload.github.com/${pin.owner}/${pin.repo}/tar.gz/${pin.sha}`;
}
