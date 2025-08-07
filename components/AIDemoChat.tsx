"use client";

import { useRef, useState } from "react";
import { useChat, type UIMessage } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  ThumbsUp as ThumbsUpIcon,
  ThumbsDown as ThumbsDownIcon,
  Copy as CopyIcon,
  RefreshCcw as RefreshCcwIcon,
} from "lucide-react";
import { ButtonScrollToBottom } from "@/components/qaChatbot/ui/ButtonScrollToBottom";

export default function AIDemoChat({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState("");

  const { messages, sendMessage, status, regenerate } = useChat({
    transport: new DefaultChatTransport({ api: "/api/ai-demo" }),
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;
    sendMessage({ text: trimmed });
    setInput("");
  };

  return (
    <div
      className={cn(
        "relative flex flex-col p-5 mt-10 h-[70vh] overflow-hidden bg-background/40 shadow-lg rounded",
        className
      )}
    >
      <div className="flex-1 overflow-y-scroll" ref={ref}>
        <div className="relative lg:mx-12 space-y-6">
          {messages.map((message, idx) => (
            <MessageView
              key={message.id}
              message={message}
              isLast={idx === messages.length - 1}
              onRegenerate={() => regenerate()}
            />
          ))}
        </div>
      </div>

      <form onSubmit={onSubmit} className="relative flex gap-2 mt-3">
        <ButtonScrollToBottom outerDivRef={ref} />
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about Langfuse…"
          className="min-h-[46px] max-h-40"
        />
        <Button type="submit" disabled={status !== "ready"}>
          Send
        </Button>
      </form>
    </div>
  );
}

function MessageView({
  message,
  isLast,
  onRegenerate,
}: {
  message: UIMessage;
  isLast: boolean;
  onRegenerate: () => void;
}) {
  const isUser = message.role === "user";

  return (
    <div className="group relative">
      <div
        className={cn(
          "rounded-md px-4 py-3 whitespace-pre-wrap",
          isUser ? "bg-muted" : "bg-card"
        )}
      >
        <div className="text-xs mb-1 opacity-60">
          {isUser ? "User" : "Assistant"}
        </div>
        <div className="space-y-2">
          {message.parts.map((part, i) => {
            // text content
            if (part.type === "text") {
              return (
                <div key={i} className="prose prose-sm max-w-none">
                  {part.text}
                </div>
              );
            }

            // reasoning content
            if (part.type === "reasoning") {
              return (
                <pre key={i} className="text-xs text-muted-foreground bg-muted/40 p-2 rounded">
                  {part.text}
                </pre>
              );
            }

            // tool invocation streaming (generic rendering)
            if ((part as any).type === "tool-invocation") {
              const tool = (part as any).toolInvocation;
              const state = tool?.state as string | undefined;
              const toolName = tool?.toolName as string | undefined;
              if (state === "call" || state === "input-available") {
                return (
                  <div key={i} className="text-xs italic text-muted-foreground">
                    {toolName ? `Using ${toolName}…` : "Using tool…"}
                  </div>
                );
              }
              if (state === "result" || state === "output-available") {
                return (
                  <div key={i} className="text-xs text-muted-foreground">
                    {toolName ? `${toolName} complete.` : "Tool complete."}
                  </div>
                );
              }
              if (state === "error" || state === "output-error") {
                return (
                  <div key={i} className="text-xs text-destructive">
                    Tool error.
                  </div>
                );
              }
              return (
                <div key={i} className="text-xs text-muted-foreground">
                  Tool activity…
                </div>
              );
            }

            return null;
          })}
        </div>

        {message.role === "assistant" ? (
          <ActionsBar
            message={message}
            isLast={isLast}
            onRegenerate={onRegenerate}
          />
        ) : null}
      </div>
    </div>
  );
}

function ActionsBar({
  message,
  isLast,
  onRegenerate,
}: {
  message: UIMessage;
  isLast: boolean;
  onRegenerate: () => void;
}) {
  const handleCopy = () => {
    const fullText = message.parts
      .filter((p) => p.type === "text")
      .map((p: any) => p.text as string)
      .join("\n\n");
    navigator.clipboard.writeText(fullText).catch(console.error);
  };

  return (
    <div className="flex items-center gap-2 mt-3">
      {isLast ? (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onRegenerate()}
          title="Retry"
        >
          <RefreshCcwIcon className="h-4 w-4" />
        </Button>
      ) : null}

      <Button
        variant="ghost"
        size="sm"
        onClick={() => console.log("Liked message", message.id)}
        title="Like"
      >
        <ThumbsUpIcon className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => console.log("Disliked message", message.id)}
        title="Dislike"
      >
        <ThumbsDownIcon className="h-4 w-4" />
      </Button>

      <Button variant="ghost" size="sm" onClick={handleCopy} title="Copy">
        <CopyIcon className="h-4 w-4" />
      </Button>
    </div>
  );
}