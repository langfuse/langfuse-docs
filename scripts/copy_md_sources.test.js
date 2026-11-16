"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");
const { stripMdxForPlainMarkdown } = require("../lib/stripMdxForPlainMarkdown");
const { inlineComponentsMdx } = require("./copy_md_sources");

test("paired AiGatewayIntegrationIntro keeps both intros in order", () => {
  const source = [
    'import AiGatewayIntegrationIntro from "@/components-mdx/ai-gateway-integration-intro.mdx";',
    "",
    "<AiGatewayIntegrationIntro>",
    "",
    "> **What is Codex?** [Codex](https://github.com/openai/codex) is OpenAI's agentic coding tool.",
    "",
    "</AiGatewayIntegrationIntro>",
  ].join("\n");

  const markdown = stripMdxForPlainMarkdown(
    inlineComponentsMdx(source, "codex-gateway.mdx"),
  );

  const toolAt = markdown.indexOf("What is Codex?");
  const langfuseAt = markdown.indexOf("What is Langfuse?");
  assert.notEqual(toolAt, -1);
  assert.notEqual(langfuseAt, -1);
  assert.ok(toolAt < langfuseAt);
  assert.match(markdown, /central entry point for your AI traffic/);
  assert.doesNotMatch(markdown, /props\.children/);
  assert.doesNotMatch(markdown, /AiGatewayIntegrationIntro/);
});
