"use client";

import { useState } from "react";
import { Check, Copy, ExternalLink } from "lucide-react";
import { CornerBox } from "@/components/ui/corner-box";
import { Link } from "@/components/ui/link";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import {
  SKILL_INSTALL_COMMAND,
  SKILL_WORKFLOWS,
  type SkillWorkflow,
} from "@/lib/skills-showcase-data";

function CopyButton({
  value,
  label,
  className,
}: {
  value: string;
  label: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      return;
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={cn(
        "inline-flex items-center justify-center rounded-[2px] p-1.5 text-text-tertiary transition-colors hover:bg-surface-1 hover:text-text-primary",
        className,
      )}
      aria-label={copied ? "Copied" : label}
    >
      {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
    </button>
  );
}

function PreviewLine({ line }: { line: string }) {
  if (line === "---") {
    return <span className="text-text-disabled">{line}</span>;
  }
  if (/^(name|description|metadata|required_access):/.test(line)) {
    const sep = line.indexOf(":");
    return (
      <>
        <span className="text-text-secondary">{line.slice(0, sep + 1)}</span>
        <span className="text-text-tertiary">{line.slice(sep + 1)}</span>
      </>
    );
  }
  if (line.startsWith("# ")) {
    return <span className="font-medium text-text-primary">{line}</span>;
  }
  if (line.startsWith("## ")) {
    return <span className="font-medium text-text-secondary">{line}</span>;
  }
  if (/^\d+\.\s/.test(line) || line.startsWith("- ")) {
    return (
      <>
        <span className="text-text-secondary">{line.slice(0, 2)}</span>
        <span className="text-text-tertiary">{line.slice(2)}</span>
      </>
    );
  }
  return <span className="text-text-tertiary">{line}</span>;
}

function SkillPreview({ workflow }: { workflow: SkillWorkflow }) {
  const lines = workflow.preview.replace(/\n$/, "").split("\n");

  return (
    <CornerBox className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="flex items-center gap-2 border-b border-line-structure bg-surface-1 px-3 py-2">
        <span className="min-w-0 flex-1 truncate font-mono text-[11px] text-text-tertiary">
          {workflow.path}
        </span>
        <Link
          href={workflow.githubUrl}
          className="inline-flex items-center gap-1 font-sans text-[11px] text-text-tertiary no-underline hover:text-text-primary"
        >
          GitHub
          <ExternalLink className="size-3" />
        </Link>
      </div>
      <pre className="m-0 max-h-[28rem] flex-1 overflow-auto bg-surface-bg p-4 text-left font-mono text-[12px] leading-[1.55] [overflow-wrap:anywhere] whitespace-pre-wrap sm:max-h-[32rem]">
        {lines.map((line, index) => (
          <div key={`${index}-${line.slice(0, 24)}`}>
            <PreviewLine line={line} />
          </div>
        ))}
      </pre>
    </CornerBox>
  );
}

export function SkillBrowser() {
  const [activeId, setActiveId] = useState(SKILL_WORKFLOWS[0].id);
  const active =
    SKILL_WORKFLOWS.find((workflow) => workflow.id === activeId) ??
    SKILL_WORKFLOWS[0];

  return (
    <div className="not-prose my-6 flex flex-col gap-3">
      <CornerBox className="flex items-center gap-2 overflow-x-auto px-3 py-2">
        <code className="min-w-0 flex-1 truncate text-left font-mono text-[12px] text-text-secondary">
          {SKILL_INSTALL_COMMAND}
        </code>
        <CopyButton
          value={SKILL_INSTALL_COMMAND}
          label="Copy install command"
        />
      </CornerBox>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-[minmax(13rem,17rem)_1fr] md:items-stretch">
        <CornerBox className="flex flex-col p-3">
          <Text
            size="s"
            className="mb-2 text-left font-mono text-[10px] uppercase tracking-[0.08em] text-text-disabled"
          >
            Playbooks
          </Text>
          <div className="flex flex-wrap gap-1.5 md:flex-col md:flex-nowrap">
            {SKILL_WORKFLOWS.map((workflow) => {
              const isActive = workflow.id === active.id;
              return (
                <button
                  key={workflow.id}
                  type="button"
                  onClick={() => setActiveId(workflow.id)}
                  className={cn(
                    "rounded-[2px] border px-2.5 py-1.5 text-left font-mono text-[12px] leading-[1.3] transition-colors",
                    isActive
                      ? "border-line-cta bg-surface-1 text-text-primary"
                      : "border-transparent bg-surface-1 text-text-secondary hover:border-line-structure hover:text-text-primary",
                  )}
                  aria-pressed={isActive}
                >
                  {workflow.name}
                </button>
              );
            })}
          </div>
        </CornerBox>

        <div className="flex min-w-0 flex-col gap-3">
          <div className="flex flex-col gap-1 px-0.5">
            <Text size="s" className="text-left text-text-secondary">
              {active.label}
            </Text>
            <Text size="s" className="text-left">
              {active.description}
            </Text>
          </div>
          <SkillPreview workflow={active} />
        </div>
      </div>
    </div>
  );
}
