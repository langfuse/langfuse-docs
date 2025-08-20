"use client";

import { useState, useMemo } from "react";
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
  PromptInputToolbar,
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

const langfuseWebClient = new LangfuseWeb({
  publicKey: process.env.NEXT_PUBLIC_LANGFUSE_PUBLIC_KEY,
});

type ChatProps = HTMLAttributes<HTMLDivElement>;

export const Chat = ({ className, ...props }: ChatProps) => {
  const [input, setInput] = useState("");
  // Track user feedback for each message ID (1 = thumbs up, 0 = thumbs down, null = no feedback)
  const [userFeedback, setUserFeedback] = useState<Map<string, number | null>>(
    new Map(),
  );

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
    messages: [
      {
        id: "1",
        role: "assistant",
        parts: [
          {
            type: "text",
            text: "**👋 Do you have any questions about Langfuse? Ask me!**\n\n_⚠️ Warning: Do not enter sensitive information. All chat messages can be viewed in the public demo project. Responses may be inaccurate. Please check the documentation for details or reach out to us via the chat widget._",
          },
        ],
      },
    ],
    transport: new DefaultChatTransport({
      api: "/api/qa-chatbot",
      body: { chatId, userId },
    }),
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || !userId) return; // Don't send if userId is not ready
    sendMessage({ text: input });
    setInput("");
  };

  const handleFeedback = (
    messageId: string,
    value: number,
    comment?: string,
  ) => {
    // Update the local state
    setUserFeedback((prev) => new Map(prev.set(messageId, value)));

    // Send feedback to Langfuse
    langfuseWebClient.score({
      traceId: messageId,
      id: `user-feedback-${messageId}`,
      name: "user-feedback",
      value: value,
      comment: comment,
    });
  };

  return (
    <div className={className} {...props}>
      <div className="flex flex-col h-[62vh] border-2 rounded-xl p-2">
        <Conversation className="h-full">
          <ConversationContent>
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
                                    (part) => part.type === "source-url",
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
                <Message from={message.role} key={message.id}>
                  <MessageContent>
                    {message.parts.map((part, i) => {
                      if (part.type === "text") {
                        const isLastMessage =
                          messageIndex === messages.length - 1;
                        const isNotFirstMessage = messageIndex > 0;
                        return (
                          <div key={`${message.id}-${i}`}>
                            <Response>{part.text}</Response>
                            {message.role === "assistant" &&
                              isLastMessage &&
                              isNotFirstMessage && (
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
                        return (
                          <Reasoning
                            key={`${message.id}-${i}`}
                            className="w-full"
                            isStreaming={part.state === "streaming"}
                          >
                            <ReasoningTrigger />
                            <ReasoningContent>{part.text}</ReasoningContent>
                          </Reasoning>
                        );
                      }
                      if (part.type === "dynamic-tool") {
                        return (
                          <Tool key={`${message.id}-${i}`}>
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

        <PromptInput onSubmit={handleSubmit} className="mt-4">
          <PromptInputTextarea
            onChange={(e) => setInput(e.target.value)}
            value={input}
          />
          <PromptInputToolbar>
            <PromptInputSubmit disabled={!input || !userId} status={status} />
          </PromptInputToolbar>
        </PromptInput>
      </div>
    </div>
  );
};
