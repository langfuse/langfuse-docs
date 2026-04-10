"use client";

import { HomeSection } from "@/components/home/HomeSection";
import Image from "next/image";
import {
  CornerBox,
  Heading,
  Link,
  TextHighlight,
} from "@/components/ui";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import cliVisual from "./img/visuals/visual-langfuse-cli.svg";

const CLI_HREF = "/docs/api-and-data-platform/features/cli";
const DOCS_MCP_HREF = "/docs/docs-mcp";
const PLATFORM_MCP_HREF = "/docs/api-and-data-platform/features/mcp-server";

/** @TODO - can we remove this? */
function CardVisualSlot({ className }: { className?: string }) {
  return (
    <div
      className={cn("relative mt-auto w-full min-h-[104px] shrink-0", className)}
      aria-hidden
    >
      <div className="flex absolute inset-x-0 bottom-0 top-3 justify-end items-end pointer-events-none">
        <div
          className="h-[88px] w-[min(100%,200px)] rounded-sm border border-dashed border-line-structure/60 bg-muted/10"
        />
      </div>
    </div>
  );
}

export const DeveloperTools = () => {
  return (
    <HomeSection id="developer-tools" className="pt-20">
      <div className="flex relative flex-col gap-8 md:gap-10">
        <div className="flex max-w-[52ch] flex-col gap-4">
          <Heading className="text-left max-w-[16ch] sm:max-w-none">
            Made for <TextHighlight>developers</TextHighlight>,
            loved by{" "}
            <TextHighlight>agents</TextHighlight>.
          </Heading>
          <Text className="max-w-[48ch] text-left">
            Langfuse works by default with your coding agents. Install our MCP
            servers and CLI to develop at the speed of thought. Let Claude Code,
            Cursor and Codex do the hard work.
          </Text>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 md:grid-rows-2">
          <CornerBox className="flex relative z-0 flex-col p-0 min-h-0 md:row-span-2">
            <div className="flex flex-col flex-1 gap-3 p-4">
              <Link
                href={CLI_HREF}
                className="text-left text-[15px] font-medium text-text-secondary"
              >
                Langfuse CLI
              </Link>
              <Text size="s" className="text-left">
                Full API access from the terminal. Let coding agents manage
                Langfuse for you, or script your workflows in CI/CD.
              </Text>
            </div>
            <div className="flex flex-1 justify-center items-center">
              <Image src={cliVisual} alt="Langfuse CLI" width={100} height={100} className="object-contain w-full h-full" />
            </div>
          </CornerBox>

          <CornerBox className="flex relative z-0 flex-col gap-3 p-4 -ml-px">
            <Link
              href={DOCS_MCP_HREF}
              className="text-left text-[15px] font-medium text-text-secondary"
            >
              Langfuse Docs MCP Server
            </Link>
            <Text size="s" className="text-left">
              Search Langfuse documentation, GitHub issues, and discussions
              directly from Claude, Cursor, and other MCP-compatible tools.
            </Text>
          </CornerBox>

          <CornerBox className="flex relative z-0 flex-col gap-3 p-4 -mt-px -ml-px">
            <Link
              href={PLATFORM_MCP_HREF}
              className="text-left text-[15px] font-medium text-text-secondary"
            >
              Langfuse MCP Server
            </Link>
            <Text size="s" className="text-left">
              Interact with your Langfuse data programmatically from your IDE.
              Manage prompts, query traces, and more.
            </Text>
          </CornerBox>
        </div>
      </div>
    </HomeSection>
  );
};
