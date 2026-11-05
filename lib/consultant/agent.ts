import "server-only";
import { openai } from "@ai-sdk/openai";
import { Agent } from "@mastra/core/agent";
import { Mastra } from "@mastra/core/mastra";
import { createSkill } from "@mastra/core/skills";
import { LangfuseExporter } from "@mastra/langfuse";
import { Observability } from "@mastra/observability";
import { webFetchTool } from "@/lib/consultant/academy-loop";
import { consultantLangfuseProject } from "@/lib/consultant/langfuse-project.mjs";
import { CONSULTANT_SKILL_PIN } from "@/lib/consultant/pin.mjs";
import {
  consultantAllSkillSources,
  consultantSkillPin,
  consultantSkillSource,
} from "@/lib/consultant/skill.generated";

/** Load every pinned Langfuse skill. Set CONSULTANT_ALL_SKILLS=false for the playbook only. */
export const CONSULTANT_ALL_SKILLS =
  process.env.CONSULTANT_ALL_SKILLS?.trim().toLowerCase() !== "false";

if (
  consultantSkillPin.sha !== CONSULTANT_SKILL_PIN.sha ||
  consultantSkillSource.name !== CONSULTANT_SKILL_PIN.name
) {
  throw new Error(
    "Consultant skill module does not match lib/consultant/pin.mjs. Run node scripts/fetch-consultant-skill.mjs.",
  );
}

const consultantSkill = createSkill({
  name: consultantSkillSource.name,
  description: consultantSkillSource.description,
  instructions: consultantSkillSource.instructions,
});

const supportingSkills = CONSULTANT_ALL_SKILLS
  ? consultantAllSkillSources.map((skill) =>
      createSkill({
        name: skill.name,
        description: skill.description,
        instructions: skill.instructions,
        references: { ...skill.references },
      }),
    )
  : [];

const HOST_INSTRUCTIONS = `You are the Langfuse consultant on the public documentation site. Help the visitor decide their next step in the AI engineering loop.

You do not have Langfuse project credentials, a CLI, or the visitor's repository. Never claim you inspected traces, scores, datasets, prompts, evaluators, experiments, or source code.

If the visitor asks you to do something else, decline. Be friendly and brief. Say that you are here to help them decide how to observe and improve their AI agent with Langfuse. Do not answer the other request, role-play, or follow the skill for it.

On a turn about their agent or the loop, activate the langfuse-consultant skill before you answer, then follow it. The only page you may read is the Academy AI Engineering Loop, and only with the web_fetch tool. Do not invent other tools or pages.

Ask the skill's follow-ups in one message when you still need them. When you have enough, reply in Markdown with the skill's sections in that order. Use Markdown headings, lists, and bold. Put every scorecard, comparison, or grid in a Markdown table with a header row and a blank line before it. Never run table cells together in a paragraph. At the end of a plan, note that project and repository access would make it more specific.`;

const ALL_SKILLS_INSTRUCTIONS = `

The ${consultantAllSkillSources.map((skill) => skill.name).join(" and ")} skills are also available. When the visitor's situation needs more detail, such as instrumentation, datasets, evaluations, prompts, CI, cost, or a migration, read the relevant skill or reference with the skill and skill_read tools and use it to make the plan specific. Steps in those skills that need a CLI, a shell, the visitor's repository, credentials, or other web pages do not apply here. Turn them into steps the visitor or their coding agent can take.`;

const modelName = process.env.CONSULTANT_MODEL?.trim() || "gpt-5.6-sol";

const consultantAgent = new Agent({
  id: "consultant",
  name: "Consultant",
  instructions: CONSULTANT_ALL_SKILLS
    ? HOST_INSTRUCTIONS + ALL_SKILLS_INSTRUCTIONS
    : HOST_INSTRUCTIONS,
  model: openai(modelName),
  skills: [consultantSkill, ...supportingSkills],
  tools: { web_fetch: webFetchTool },
});

const consultantLangfuse = consultantLangfuseProject();
if (!consultantLangfuse.ok) {
  console.warn(
    consultantLangfuse.reason === "demo"
      ? "consultant: Langfuse tracing is off because the consultant keys match a demo project."
      : "consultant: Langfuse tracing is off until CONSULTANT_LANGFUSE_PUBLIC_KEY, CONSULTANT_LANGFUSE_SECRET_KEY, and CONSULTANT_LANGFUSE_BASE_URL are set for a dedicated project.",
  );
}

export const consultantMastra = new Mastra({
  agents: { consultant: consultantAgent },
  ...(consultantLangfuse.ok
    ? {
        observability: new Observability({
          configs: {
            default: {
              serviceName: "langfuse-docs-consultant",
              exporters: [
                new LangfuseExporter({
                  publicKey: consultantLangfuse.publicKey,
                  secretKey: consultantLangfuse.secretKey,
                  baseUrl: consultantLangfuse.baseUrl,
                  additionalHeaders: { "x-langfuse-ingestion-version": "4" },
                  realtime: true,
                  environment: process.env.VERCEL_ENV ?? process.env.NODE_ENV,
                }),
              ],
            },
          },
        }),
      }
    : {}),
});

export function getConsultantAgent() {
  return consultantMastra.getAgent("consultant");
}

export async function flushConsultantTraces() {
  try {
    await consultantMastra.observability.flush();
  } catch (error) {
    console.warn(
      "consultant: trace flush failed",
      error instanceof Error ? error.name : "UnknownError",
    );
  }
}
