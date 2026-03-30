"use client";

import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { getAgentPromptText } from "@/components-mdx/get-started/agent-prompt-text";

type CopyAgentPromptButtonProps = {
  topic?: string;
};

export function CopyAgentPromptButton({ topic }: CopyAgentPromptButtonProps) {
  const prompt = getAgentPromptText(topic);
  const [copied, setCopied] = useState(false);

  if (!prompt) {
    return null;
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      console.error("Failed to copy prompt:", err);
    }
  };

  return (
    <Button onClick={handleCopy}>
      {copied ? (
        <>
          <Check className="mr-2 h-4 w-4" />
          Prompt copied
        </>
      ) : (
        <>
          <Copy className="mr-2 h-4 w-4" />
          Copy Agent Prompt
        </>
      )}
    </Button>
  );
}
