"use client";

import { type Message } from "ai";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCopyToClipboard } from "../hooks/clipboard";
import { Check, Copy } from "lucide-react";

interface ChatMessageActionsProps extends React.ComponentProps<"div"> {
  message: Message;
}

export function ChatMessageActions({
  message,
  className,
  ...props
}: ChatMessageActionsProps) {
  const { isCopied, copyToClipboard } = useCopyToClipboard({ timeout: 2000 });

  const onCopy = () => {
    if (isCopied) return;
    copyToClipboard(message.content);
  };

  return (
    <div
      className={cn(
        "flex items-center justify-end transition-opacity group-hover:opacity-100 md:absolute md:-right-10 md:-top-2 md:opacity-0",
        className
      )}
      {...props}
    >
      <Button variant="ghost" size="icon" onClick={onCopy}>
        {isCopied ? (
          <Check className="h-4 w-4" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
        <span className="sr-only">Copy message</span>
      </Button>
    </div>
  );
}
