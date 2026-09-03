export type SkillWorkflow = {
  id: string;
  name: string;
  label: string;
  description: string;
  path: string;
  githubUrl: string;
  prompt: string;
  preview: string;
};

export const SKILL_REPO_URL: string;
export const SKILL_REPO_TREE_URL: string;
export const SKILL_INSTALL_COMMAND: string;
export const SKILL_AGENTS: readonly {
  name: string;
  icon: string;
}[];
export const SKILL_WORKFLOWS: SkillWorkflow[];
