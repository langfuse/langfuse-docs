"use client";

import { useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Check, Copy, Sparkles } from "lucide-react";

import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Text,
} from "@/components/ui";
import { usePostHogClientCapture } from "@/src/usePostHogClientCapture";

const AI_ONBOARDING_PROMPT = `Install the Langfuse Agent Skill from github.com/langfuse/skills
and use it to add tracing to this application with Langfuse
following best practices.`;

async function copyPromptToClipboard(sourceElement: HTMLElement | null) {
  if (typeof navigator !== "undefined" && navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(AI_ONBOARDING_PROMPT);
      return true;
    } catch {
      // Fall through to the selection-based fallback for restricted browsers.
    }
  }

  if (sourceElement) {
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(sourceElement);
    selection?.removeAllRanges();
    selection?.addRange(range);

    try {
      return document.execCommand("copy");
    } finally {
      selection?.removeAllRanges();
    }
  }

  const textArea = document.createElement("textarea");
  textArea.value = AI_ONBOARDING_PROMPT;
  textArea.setAttribute("readonly", "");
  textArea.style.position = "fixed";
  textArea.style.left = "-9999px";
  const container =
    document.querySelector("[data-slot='popover-content']") ?? document.body;
  container.appendChild(textArea);
  textArea.select();

  try {
    return document.execCommand("copy");
  } finally {
    container.removeChild(textArea);
  }
}

export function OnboardWithAIButton() {
  const pathname = usePathname() ?? "/";
  const capture = usePostHogClientCapture();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const promptRef = useRef<HTMLElement>(null);

  const handleCopy = async () => {
    const didCopy = await copyPromptToClipboard(promptRef.current);
    if (!didCopy) return;

    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Popover modal open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="secondary"
          size="default"
          icon={<Sparkles className="h-3.5 w-3.5" />}
          onClick={() => {
            capture("home:onboard_with_ai_clicked", {
              source: "home_hero",
              path: pathname,
            });
          }}
        >
          Onboard with AI
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="center"
        sideOffset={8}
        className="w-[min(92vw,460px)] rounded-[2px] border-line-structure bg-surface-bg p-0 text-left shadow-lg"
      >
        <div className="flex flex-col gap-3 p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="font-sans text-[13px] font-medium leading-[150%] text-text-primary">
                Onboard with AI
              </p>
              <Text size="s" className="mt-0.5 text-left text-text-tertiary">
                Copy this prompt into your coding agent.
              </Text>
            </div>
            <Button
              data-ai-onboarding-copy
              variant="secondary"
              size="small"
              onClick={handleCopy}
              icon={
                copied ? (
                  <Check className="h-3.5 w-3.5" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )
              }
              aria-label={copied ? "Copied prompt" : "Copy prompt"}
              className="shrink-0"
            >
              {copied ? "Copied" : "Copy"}
            </Button>
          </div>

          <pre className="max-h-[220px] overflow-auto whitespace-pre-wrap rounded-[2px] border border-line-structure bg-surface-1 p-3 font-mono text-[12px] leading-[160%] text-text-secondary">
            <code ref={promptRef}>{AI_ONBOARDING_PROMPT}</code>
          </pre>
        </div>
      </PopoverContent>
    </Popover>
  );
}
