import { Message } from "ai";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

import { cn } from "@/lib/utils";
import { CodeBlock } from "./Codeblock";
import { MemoizedReactMarkdown } from "./Markdown";
import { User } from "lucide-react";
import { ChatMessageActions } from "./ChatMessageActions";
import Link from "next/link";

export interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message, ...props }: ChatMessageProps) {
  return (
    <div
      className={cn("group relative mb-4 flex items-start lg:-ml-12")}
      {...props}
    >
      <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md border shadow bg-background">
        {message.role === "user" ? (
          <User className="h-4 w-4" />
        ) : (
          <span className="text-lg">🪢</span>
        )}
      </div>
      <div className="ml-4 flex-1 space-y-2 overflow-hidden px-1">
        <MemoizedReactMarkdown
          className="prose break-words dark:prose-invert prose-p:leading-relaxed prose-pre:p-0"
          remarkPlugins={[remarkGfm, remarkMath]}
          components={{
            p({ children }) {
              return <p className="mb-2 last:mb-0">{children}</p>;
            },
            a({ children, href, ...props }) {
              return (
                <Link href={href} className="underline" target="_blank">
                  {children}
                </Link>
              );
            },
            ul({ children }) {
              return <ul className="list-disc ml-4">{children}</ul>;
            },
            ol({ children }) {
              return <ol className="list-decimal ml-4">{children}</ol>;
            },
            li({ children }) {
              return <li className="mb-1">{children}</li>;
            },
            code({ node, inline, className, children, ...props }) {
              if (children.length) {
                if (children[0] == "▍") {
                  return (
                    <span className="mt-1 animate-pulse cursor-default">▍</span>
                  );
                }

                children[0] = (children[0] as string).replace("`▍`", "▍");
              }

              const match = /language-(\w+)/.exec(className || "");

              if (inline) {
                return (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              }

              return (
                <CodeBlock
                  key={Math.random()}
                  language={(match && match[1]) || ""}
                  value={String(children).replace(/\n$/, "")}
                  {...props}
                />
              );
            },
          }}
        >
          {message.content}
        </MemoizedReactMarkdown>
        <ChatMessageActions message={message} />
      </div>
    </div>
  );
}
