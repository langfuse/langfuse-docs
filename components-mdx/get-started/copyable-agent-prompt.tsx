"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { getAgentPromptText } from "./agent-prompt-text";

type CopyableAgentPromptProps = {
  topic?: string;
  className?: string;
};

export function CopyableAgentPrompt({ topic, className }: CopyableAgentPromptProps) {
  const text = getAgentPromptText(topic);
  const [copied, setCopied] = useState(false);

  if (!text) {
    return null;
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy prompt:", err);
    }
  };

  return (
    <div
      className={cn(
        "relative rounded-md border bg-muted/30 p-4 pr-12 text-sm leading-relaxed text-foreground",
        className,
      )}
    >
      <p className="whitespace-pre-wrap font-sans">{text}</p>
      <Button
        type="button"
        size="icon"
        variant="ghost"
        className="absolute right-2 top-2 shrink-0 text-muted-foreground hover:text-foreground"
        onClick={handleCopy}
        aria-label="Copy prompt to clipboard"
      >
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      </Button>
    </div>
  );
}
