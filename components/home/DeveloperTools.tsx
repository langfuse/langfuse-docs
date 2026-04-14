"use client";

import { HomeSection } from "@/components/home/HomeSection";
import {
  Button,
  CornerBox,
  Heading,
  Link,
  TextHighlight,
} from "@/components/ui";
import { Text } from "@/components/ui/text";

const SKILL_HREF = "/docs/api-and-data-platform/features/agent-skill";
const CLI_HREF = "/docs/api-and-data-platform/features/cli";
const MCP_HREF = "/docs/api-and-data-platform/features/mcp-server";

export const DeveloperTools = () => {
  return (
    <HomeSection id="developers-agents" className="pt-[120px]">
      <div className="flex relative flex-col gap-8 md:gap-10">
        <div className="flex max-w-[52ch] flex-col gap-4">
          <Heading className="text-left max-w-[16ch] sm:max-w-none">
            Made for <TextHighlight>developers</TextHighlight>,
            loved by{" "}
            <TextHighlight>agents</TextHighlight>.
          </Heading>
          <Text className="max-w-[48ch] text-left">
            Langfuse works by default with your coding agents.
            Install our MCP servers and CLI to develop at the speed of thought.
            Let Claude Code, Cursor and Codex do the hard work.
          </Text>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 md:grid-rows-2">
          <CornerBox className="flex relative z-0 flex-col p-0 min-h-0 md:row-span-2">
            <div className="flex flex-col flex-1 gap-1 p-4">
              <Link
                href={SKILL_HREF}
                className="text-left text-[15px] font-medium text-text-secondary"
              >
                SKILL.md
              </Link>
              <Text size="s" className="text-left">
                A ready-made skill for your coding agent.
                Manage prompts, traces, and evals through natural language — no manual API calls needed.
              </Text>
              {/* <div className="flex flex-1 justify-center items-center">
              <Image src={cliVisual} alt="Langfuse CLI" width={100} height={100} className="object-contain w-full h-full" />
            </div> */}
            </div>
            <div className="flex flex-col items-start p-4 -ml-1.25">
              <Button
                variant="secondary"
                href={SKILL_HREF}
              >
                Install Skill
              </Button>
            </div>
          </CornerBox>

          <CornerBox className="flex relative z-0 flex-col gap-1 p-4 -ml-px">
            <Link
              href={CLI_HREF}
              className="text-left text-[15px] font-medium text-text-secondary"
            >
              Langfuse CLI
            </Link>
            <Text size="s" className="text-left">
              Full API access from the terminal.
              Let coding agents manage Langfuse for you, or script your workflows in CI/CD.
            </Text>
            <div className="flex flex-col items-start mt-4 -ml-1.25">
              <Button
                variant="secondary"
                href={CLI_HREF}
              >
                Configure CLI
              </Button>
            </div>
          </CornerBox>

          <CornerBox className="flex relative z-0 flex-col gap-1 p-4 -mt-px -ml-px">
            <Link
              href={MCP_HREF}
              className="text-left text-[15px] font-medium text-text-secondary"
            >
              Platform MCP Server
            </Link>
            <Text size="s" className="text-left">
              Interact with your Langfuse data programmatically from your IDE.
              Manage prompts, query traces, and more.
            </Text>
            <div className="flex flex-col items-start mt-4 -ml-1.25">
              <Button
                variant="secondary"
                href={MCP_HREF}
              >
                Configure MCP
              </Button>
            </div>
          </CornerBox>
        </div>
      </div>
    </HomeSection>
  );
};
