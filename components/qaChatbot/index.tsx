"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import type { FormEvent, HTMLAttributes } from "react";
import { useChat } from "@ai-sdk/react";
import { getPersistedNanoId } from "./utils/persistedNanoId";

import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent } from "@/components/ai-elements/message";
import { Response } from "@/components/ai-elements/response";
import { Loader } from "@/components/ai-elements/loader";
import { Actions, Action } from "@/components/ai-elements/actions";
import { RefreshCcwIcon, CopyIcon } from "lucide-react";
import {
  PromptInput,
  PromptInputSubmit,
  PromptInputTextarea,
} from "@/components/ai-elements/prompt-input";
import { DefaultChatTransport } from "ai";
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "../ai-elements/reasoning";
import {
  Source,
  Sources,
  SourcesContent,
  SourcesTrigger,
} from "../ai-elements/source";
import {
  Tool,
  ToolContent,
  ToolHeader,
  ToolOutput,
  ToolInput,
} from "@/components/ai-elements/tool";
import { LangfuseWeb } from "langfuse";
import { FeedbackDialog } from "./FeedbackPopover";
import { cn } from "@/lib/utils";

const eulangfuseWebClient = new LangfuseWeb({
  baseUrl: process.env.NEXT_PUBLIC_EU_LANGFUSE_BASE_URL,
  publicKey: process.env.NEXT_PUBLIC_EU_LANGFUSE_PUBLIC_KEY,
});

const usLangfuseWebClient = new LangfuseWeb({
  publicKey: process.env.NEXT_PUBLIC_US_LANGFUSE_PUBLIC_KEY,
  baseUrl: process.env.NEXT_PUBLIC_US_LANGFUSE_BASE_URL,
});

type ChatProps = HTMLAttributes<HTMLDivElement>;

export const Chat = ({ className, ...props }: ChatProps) => {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  // Track user feedback for each message ID (1 = thumbs up, 0 = thumbs down, null = no feedback)
  const [userFeedback, setUserFeedback] = useState<Map<string, number | null>>(
    new Map()
  );

  // Auto-resize and scroll textarea to bottom when content changes
  useEffect(() => {
    if (textareaRef.current) {
      // Reset height to auto to get the correct scrollHeight
      textareaRef.current.style.height = "auto";
      // Set height based on content, but cap at max-height (300px)
      const scrollHeight = textareaRef.current.scrollHeight;
      const maxHeight = 300;
      textareaRef.current.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
      // Scroll to bottom to show the latest text
      textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
    }
  }, [input]);

  // Generate a unique chat ID that persists for this chat session
  const chatId = useMemo(() => `chat_${crypto.randomUUID()}`, []);

  // Generate a persistent user ID for this user (client-side only)
  const userId = useMemo(() => {
    if (typeof window === "undefined") return null;
    return getPersistedNanoId({
      key: "qa-chatbot-user-id",
      prefix: "u-",
    });
  }, []);

  const { messages, sendMessage, status, regenerate } = useChat({
    messages: [],
    transport: new DefaultChatTransport({
      api: "/api/qa-chatbot",
      body: { chatId, userId },
    }),
  });

  // Check if user has submitted any messages
  const hasUserMessages = messages.some((message) => message.role === "user");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || !userId) return; // Don't send if userId is not ready
    sendMessage({ text: input });
    setInput("");
  };

  const handleExampleQuestion = (question: string) => {
    if (!userId) return; // Don't send if userId is not ready
    sendMessage({ text: question });
  };

  const handleFeedback = (
    messageId: string,
    value: number,
    comment?: string
  ) => {
    // Update the local state
    setUserFeedback((prev) => new Map([...prev, [messageId, value]]));

    // Send feedback to Langfuse
    for (const client of [eulangfuseWebClient, usLangfuseWebClient]) {
      client.score({
        traceId: messageId,
        id: `user-feedback-${messageId}`,
        name: "user-feedback",
        value: value,
        comment: comment,
      });
    }
  };

  return (
    <div className={cn("h-[62vh]", className)} {...props}>
      <div className="flex flex-col h-full border border-border/40 rounded-2xl bg-gradient-to-br from-background via-background/95 to-muted/20 backdrop-blur-md shadow-xl shadow-black/10 dark:shadow-black/30 p-5 transition-all duration-300 hover:shadow-2xl hover:shadow-black/15 dark:hover:shadow-black/40 relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-br before:from-primary/5 before:via-transparent before:to-transparent before:pointer-events-none">
        <Conversation className="flex-1 overflow-y-hidden relative z-10">
          {!hasUserMessages && (
            <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
              <h2 className="text-xl font-semibold text-foreground mb-6 pointer-events-none text-center">
                👋 Do you have any questions about Langfuse?
                <br />
                <span className="block mt-2">Ask me!</span>
              </h2>
              <div className="flex gap-3 items-center flex-wrap justify-center">
                <button
                  onClick={() => handleExampleQuestion("What can I use Langfuse for?")}
                  className="text-xs text-muted-foreground italic hover:text-foreground transition-colors cursor-pointer border border-border rounded-md px-3 py-1.5 w-52 h-12 text-center whitespace-normal break-words"
                >
                  What can I use Langfuse for?
                </button>
                <button
                  onClick={() => handleExampleQuestion("How do I link my prompts to my traces? My code is in python")}
                  className="text-xs text-muted-foreground italic hover:text-foreground transition-colors cursor-pointer border border-border rounded-md px-3 py-1.5 w-52 h-12 text-center whitespace-normal break-words"
                >
                  How do I link my prompts to my traces? My code is in python
                </button>
                <button
                  onClick={() => handleExampleQuestion("How do I get started with tracing?")}
                  className="text-xs text-muted-foreground italic hover:text-foreground transition-colors cursor-pointer border border-border rounded-md px-3 py-1.5 w-52 h-12 text-center whitespace-normal break-words"
                >
                  How do I get started with tracing?
                </button>
              </div>
            </div>
          )}
          <ConversationContent className="space-y-2">
            {messages.map((message, messageIndex) => (
              <div key={message.id}>
                {message.role === "assistant" && (
                  <Sources>
                    {message.parts.map((part, i) => {
                      switch (part.type) {
                        case "source-url":
                          return (
                            <>
                              <SourcesTrigger
                                count={
                                  message.parts.filter(
                                    (part) => part.type === "source-url"
                                  ).length
                                }
                              />
                              <SourcesContent key={`${message.id}-${i}`}>
                                <Source
                                  key={`${message.id}-${i}`}
                                  href={part.url}
                                  title={part.url}
                                />
                              </SourcesContent>
                            </>
                          );
                      }
                    })}
                  </Sources>
                )}
                <Message 
                  from={message.role} 
                  key={message.id}
                  className={message.role === "assistant" ? "[&>div]:max-w-full" : undefined}
                >
                  <MessageContent
                    className={message.role === "assistant" ? "!bg-transparent px-0 rounded-none" : undefined}
                  >
                    {message.parts.map((part, i) => {
                      if (part.type === "text") {
                        const isLastMessage =
                          messageIndex === messages.length - 1;
                        const isNotFirstMessage = messageIndex > 0;
                        // Find the index of the last text part
                        const textPartIndices = message.parts
                          .map((p, idx) => (p.type === "text" ? idx : -1))
                          .filter((idx) => idx !== -1);
                        const lastTextPartIndex =
                          textPartIndices[textPartIndices.length - 1];
                        const isLastTextPart = i === lastTextPartIndex;
                        // Check if message is complete: not submitted/streaming and no parts are streaming
                        const hasStreamingParts = message.parts.some(
                          (p) => "state" in p && p.state === "streaming"
                        );
                        const isMessageComplete =
                          status !== "submitted" &&
                          status !== "streaming" &&
                          !hasStreamingParts;
                        // Add spacing if next part is a different type (for consistent spacing between different types)
                        const nextPart = message.parts[i + 1];
                        const hasNextPartDifferentType =
                          nextPart && nextPart.type !== "text";
                        return (
                          <div
                            key={`${message.id}-${i}`}
                            className={hasNextPartDifferentType ? "mb-4" : ""}
                          >
                            <Response>{part.text}</Response>
                            {message.role === "assistant" &&
                              isLastMessage &&
                              isNotFirstMessage &&
                              isLastTextPart &&
                              isMessageComplete && (
                                <Actions className="mt-2">
                                  <Action
                                    onClick={() => regenerate()}
                                    label="Retry"
                                    tooltip="Retry"
                                  >
                                    <RefreshCcwIcon className="size-3" />
                                  </Action>
                                  <Action
                                    onClick={() =>
                                      navigator.clipboard.writeText(part.text)
                                    }
                                    label="Copy"
                                    tooltip="Copy"
                                  >
                                    <CopyIcon className="size-3" />
                                  </Action>
                                  <FeedbackDialog
                                    messageId={message.id}
                                    feedbackType="positive"
                                    currentFeedback={
                                      userFeedback.get(message.id) ?? null
                                    }
                                    onFeedback={handleFeedback}
                                  />
                                  <FeedbackDialog
                                    messageId={message.id}
                                    feedbackType="negative"
                                    currentFeedback={
                                      userFeedback.get(message.id) ?? null
                                    }
                                    onFeedback={handleFeedback}
                                  />
                                </Actions>
                              )}
                          </div>
                        );
                      }
                      if (part.type === "reasoning") {
                        // Add spacing if next part is a different type (for consistent spacing between different types)
                        const nextPart = message.parts[i + 1];
                        const hasNextPartDifferentType =
                          nextPart && nextPart.type !== "reasoning";
                        return (
                          <Reasoning
                            key={`${message.id}-${i}`}
                            className={
                              hasNextPartDifferentType ? "w-full" : "w-full mb-0"
                            }
                            isStreaming={part.state === "streaming"}
                          >
                            <ReasoningTrigger />
                            <ReasoningContent>{part.text}</ReasoningContent>
                          </Reasoning>
                        );
                      }
                      if (part.type === "dynamic-tool") {
                        // Add spacing if next part is a different type (for consistent spacing between different types)
                        const nextPart = message.parts[i + 1];
                        const hasNextPartDifferentType =
                          nextPart && nextPart.type !== "dynamic-tool";
                        return (
                          <Tool
                            key={`${message.id}-${i}`}
                            className={hasNextPartDifferentType ? undefined : "mb-0"}
                          >
                            <ToolHeader
                              type={`tool-${part.toolName}` as const}
                              state={part.state}
                            />
                            <ToolContent>
                              <ToolInput input={part.input} />
                              <ToolOutput
                                errorText={part.errorText}
                                // output={part.output}
                              />
                            </ToolContent>
                          </Tool>
                        );
                      }

                      return null;
                    })}
                  </MessageContent>
                </Message>
              </div>
            ))}
            {status === "submitted" && <Loader />}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>

        <PromptInput
          onSubmit={handleSubmit}
          className="mt-4 border-border/40 shadow-lg transition-all duration-200 hover:shadow-xl hover:border-primary/20 relative z-10"
        >
          <div className="flex items-end gap-2">
            <PromptInputTextarea
              ref={textareaRef}
              onChange={(e) => setInput(e.target.value)}
              value={input}
              placeholder="Ask a question about Langfuse..."
              className="flex-1 pr-2 min-h-[40px] max-h-[300px] leading-5 pt-[10px] pb-[10px] overflow-y-auto"
              style={{ height: "auto" }}
              minHeight={40}
              maxHeight={300}
            />
            <div className="pr-3 pb-[10px]">
              <PromptInputSubmit disabled={!input || !userId} status={status} />
            </div>
          </div>
        </PromptInput>
        <p className="mt-6 text-xs text-muted-foreground text-center relative z-10 italic">
          ⚠️ Warning: Do not enter sensitive information. All chat messages can be viewed in the public demo project. Responses may be inaccurate. Please check the documentation for details or reach out to us via the chat widget.
        </p>
      </div>
    </div>
  );
};
