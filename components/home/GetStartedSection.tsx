"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import Image from "next/image";
import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { HomeSection } from "@/components/home/HomeSection";
import { CornerBox, HoverCorners } from "@/components/ui/corner-box";
import { TextHighlight } from "@/components/ui";
import { cn } from "@/lib/utils";

const AGENT_PROMPTS = [
  {
    label: "Tracing:",
    prompt:
      "Install the Langfuse AI skill from github.com/langfuse/skills and use it to add tracing to this application with Langfuse following best practices.",
  },
  {
    label: "Evals:",
    prompt:
      "Install the Langfuse AI skill from github.com/langfuse/skills and use it to set up evals for this application with Langfuse. Guide me through choosing the right evaluation approach methods.",
  },
  {
    label: "Prompt Management:",
    prompt:
      "Install the Langfuse AI skill from github.com/langfuse/skills and use it to migrate the prompts in this codebase to Langfuse.",
  },
];

const MANUAL_SNIPPETS = {
  python: {
    install: "pip install langfuse",
    code: `from langfuse.openai import openai

# Drop-in replacement — traces automatically
response = openai.chat.completions.create(
    model="gpt-4o",
    messages=[{"role": "user", "content": "Hello"}],
)`,
  },
  javascript: {
    install: "npm install @langfuse/openai @langfuse/otel @opentelemetry/sdk-node",
    code: `import { NodeSDK } from "@opentelemetry/sdk-node";
import { LangfuseSpanProcessor } from "@langfuse/otel";
new NodeSDK({ spanProcessors: [new LangfuseSpanProcessor()] }).start();

import OpenAI from "openai";
import { observeOpenAI } from "@langfuse/openai";

const openai = observeOpenAI(new OpenAI());

const res = await openai.chat.completions.create({
  model: "gpt-4o",
  messages: [{ role: "user", content: "Hello" }],
});`,
  },
} as const;

type LangId = keyof typeof MANUAL_SNIPPETS;

const linkClassName =
  "text-text-secondary hover:text-text-primary underline underline-offset-2 decoration-line-structure hover:decoration-text-tertiary transition-colors";

const homeCodeBlockClassName =
  "my-0 w-full text-left [&_pre]:text-left rounded-[1px] shadow-none border border-line-structure bg-surface-1";

const AGENTS = [
  {
    name: "Claude Code",
    icon: "/images/integrations/anthropic_icon.png",
  },
  {
    name: "Cursor",
    icon: "/images/integrations/cursor_icon.png",
  },
  {
    name: "Codex",
    icon: "/images/integrations/openai_icon.svg",
  },
];

function PromptRow({ label, prompt }: { label: string; prompt: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyIcon = copied ? (
    <Check className="w-3.5 h-3.5" />
  ) : (
    <Copy className="w-3.5 h-3.5" />
  );

  return (
    <button
      onClick={handleCopy}
      className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 px-4 py-3 text-left cursor-pointer transition-colors hover:bg-surface-1 group/row w-full"
    >
      <div className="flex items-center justify-between gap-2 w-full sm:w-auto sm:flex-none">
        <span className="text-text-secondary font-analog font-medium text-[14px] whitespace-nowrap sm:min-w-[140px] sm:shrink-0 text-left">
          {label}
        </span>
        <span className="sm:hidden shrink-0 text-text-tertiary flex items-center">
          {copyIcon}
        </span>
      </div>
      <Text size="s" className="text-text-tertiary flex-1 text-left min-w-0 w-full">
        <span className="text-text-secondary font-medium">Prompt:</span>{" "}{prompt}
      </Text>
      <span className="hidden sm:flex shrink-0 text-text-tertiary items-center gap-1">
        {copyIcon}
      </span>
    </button>
  );
}

function AgentTab() {
  return (
    <div className="flex flex-col">
      <div className="flex flex-wrap items-center gap-2 sm:gap-4 px-4 pt-1 border-b border-line-structure min-h-9">
        <div className="inline-flex items-center gap-3 whitespace-nowrap pb-2 pt-1.5 text-xs font-[430]">
          {AGENTS.map((agent) => (
            <span key={agent.name} className="inline-flex items-center gap-1.5">
              <Image
                src={agent.icon}
                alt={agent.name}
                width={16}
                height={16}
                className="shrink-0"
              />
              <span className="text-text-secondary">
                {agent.name}
              </span>
            </span>
          ))}
        </div>
        <span className="inline-flex items-center whitespace-nowrap pb-2 pt-1.5 text-xs font-[430] text-text-tertiary">
          or any other agent
        </span>
      </div>

      <div className="flex flex-col divide-y divide-line-structure">
        {AGENT_PROMPTS.map((item) => (
          <PromptRow key={item.label} label={item.label} prompt={item.prompt} />
        ))}
      </div>
      <div className="px-4 py-3 border-t border-line-structure">
        <NeedHelpFooter />
      </div>
    </div>
  );
}

function NeedHelpFooter() {
  return (
    <Text size="s" className="text-left">
      Need help? —{" "}
      <a href="/talk-to-us" className={linkClassName}>
        Talk to Sales
      </a>
      <span className="mx-1.5 text-text-tertiary">·</span>
      <a href="/support" className={linkClassName}>
        Reach out to Support
      </a>
    </Text>
  );
}

const QUICKSTART_LINKS = [
  { label: "Observability", href: "/docs/observability/get-started" },
  { label: "Prompt Management", href: "/docs/prompt-management/get-started" },
  { label: "Evals", href: "/docs/evaluation/overview" },
];

function ManualTab() {
  const [lang, setLang] = useState<LangId>("python");
  const snippet = MANUAL_SNIPPETS[lang];

  const langTabs: { id: LangId; label: string }[] = [
    { id: "python", label: "Python" },
    { id: "javascript", label: "JS/TS" },
  ];

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2 sm:gap-4 px-4 pt-1 border-b border-line-structure min-h-9">
        {langTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setLang(tab.id)}
            className={cn(
              "inline-flex items-center whitespace-nowrap rounded-none border-b pb-2 pt-1.5 text-xs transition-colors font-[430] cursor-pointer",
              lang === tab.id
                ? "border-line-cta text-text-primary font-medium"
                : "border-transparent text-text-tertiary hover:text-foreground"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3 p-4">
        <DynamicCodeBlock
          lang="bash"
          code={snippet.install}
          codeblock={{
            allowCopy: true,
            className: homeCodeBlockClassName,
          }}
        />
        <DynamicCodeBlock
          lang={lang === "python" ? "python" : "typescript"}
          code={snippet.code}
          codeblock={{
            allowCopy: true,
            className: homeCodeBlockClassName,
          }}
        />

        <Text size="s" className="text-left pt-1">
          Quick start guides —{" "}
          {QUICKSTART_LINKS.map((link, i) => (
            <span key={link.href}>
              {i > 0 && <span className="mx-1.5 text-text-tertiary">·</span>}
              <a href={link.href} className={linkClassName}>
                {link.label}
              </a>
            </span>
          ))}
        </Text>
        <NeedHelpFooter />
      </div>
    </div>
  );
}

type TabId = "agent" | "manual";

export function GetStartedSection() {
  const [activeTab, setActiveTab] = useState<TabId>("agent");

  const tabs: { id: TabId; label: string }[] = [
    { id: "agent", label: "Install via Coding Agent" },
    { id: "manual", label: "Manual Install" },
  ];

  return (
    <HomeSection id="get-started" className="pt-[120px]">
      <div className="flex flex-col gap-2.5">
        <Text className="text-left">
          Get Started <span className="text-text-tertiary mx-1">—</span> <span className="text-text-tertiary">Free tier: <span className="text-primary">50k observations/month</span>. No credit card required.</span>
        </Text>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <Heading className="text-primary text-left" size="large">
            <TextHighlight highlightClassName="mix-blend-multiply" className="max-sm:pr-1.5 xl:pr-3">Start improving</TextHighlight><TextHighlight highlightClassName="mix-blend-multiply">your agents</TextHighlight>
            <br />
            in under 5 minutes.
          </Heading>
          <div className="flex sm:flex-col gap-0 items-start shrink-0 w-full sm:w-[150px]">
            <Button
              variant="primary"
              shortcutKey="s"
              href="https://cloud.langfuse.com"
              wrapperClassName="sm:flex-none sm:w-full"
            >
              Start free
            </Button>
            <Button
              variant="secondary"
              shortcutKey="d"
              href="/docs"
              wrapperClassName="sm:flex-none sm:w-full"
            >
              Documentation
            </Button>
          </div>
        </div>

        {/* Tabs + content area */}
        <div className="flex flex-col sm:flex-row items-start gap-3 mt-10">
          {/* Tab buttons — outside the content box, right-aligned, equal width */}
          <div className="flex sm:flex-col sm:items-end sm:justify-between shrink-0 gap-2 self-stretch">
            <div className="flex sm:flex-col sm:items-end gap-2">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <div
                    key={tab.id}
                    className="relative flex items-center p-1 -m-1 group button-wrapper overflow-visible"
                  >
                    <HoverCorners />
                    <button
                      onClick={() => setActiveTab(tab.id)}
                      className={cn(
                        "inline-flex items-center justify-center w-full h-[26px] px-[10px] rounded-[2px] border text-left transition-colors whitespace-nowrap",
                        "font-sans text-[12px] font-[450] leading-[150%] tracking-[-0.06px]",
                        isActive
                          ? "border-line-structure bg-surface-bg text-text-primary [box-shadow:0_4px_8px_0_rgba(0,0,0,0.05),0_4px_4px_0_rgba(0,0,0,0.03)]"
                          : "border-transparent bg-transparent text-text-tertiary hover:text-text-primary hover:bg-surface-bg hover:border-line-structure hover:[box-shadow:0_4px_8px_0_rgba(0,0,0,0.05),0_4px_4px_0_rgba(0,0,0,0.03)]"
                      )}
                    >
                      {tab.label}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Content box */}
          <CornerBox className="flex-1 min-w-0 w-full">
            {activeTab === "agent" ? <AgentTab /> : <ManualTab />}
          </CornerBox>
        </div>

      </div>
    </HomeSection>
  );
}
