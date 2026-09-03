import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { TextHighlight } from "@/components/ui/text-highlight";
import { SKILL_AGENTS, SKILL_REPO_URL } from "@/lib/skills-showcase-data";

export function SkillHero() {
  return (
    <div className="not-prose mb-12 flex flex-col gap-6">
      <Heading
        as="h1"
        size="large"
        className="max-w-[16ch] text-left sm:max-w-none"
      >
        <TextHighlight highlightClassName="mix-blend-multiply">
          Give your agent
        </TextHighlight>{" "}
        <TextHighlight highlightClassName="mix-blend-multiply">
          Langfuse
        </TextHighlight>
      </Heading>

      <Text className="max-w-[62ch] text-left">
        Each playbook packages Langfuse best practices into a plain{" "}
        <code className="font-mono text-[13px] text-text-secondary">
          SKILL.md
        </code>{" "}
        your coding agent can read. Point your agent at it to instrument an app,
        query production traces, manage prompts, or set up evals.
      </Text>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        {SKILL_AGENTS.map((agent) => (
          <span
            key={agent.name}
            className="inline-flex items-center gap-1.5 text-text-secondary"
          >
            <Image
              src={agent.icon}
              alt=""
              width={16}
              height={16}
              className="size-4 shrink-0"
            />
            <span className="font-sans text-[12px]">{agent.name}</span>
          </span>
        ))}
        <span className="font-sans text-[12px] text-text-tertiary">
          and other compatible agents
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button href={SKILL_REPO_URL} target="_blank" rel="noopener noreferrer">
          Browse the repo ↗
        </Button>
        <Button href="#install" variant="secondary">
          Installation
        </Button>
      </div>
    </div>
  );
}
