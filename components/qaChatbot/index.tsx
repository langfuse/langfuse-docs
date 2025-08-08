"use client";

import { useState } from "react";
import type { FormEvent, HTMLAttributes } from "react";
import { useChat } from "@ai-sdk/react";

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

type ChatProps = HTMLAttributes<HTMLDivElement>;

export const Chat = ({ className, ...props }: ChatProps) => {
  const [input, setInput] = useState("");

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
    }),
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage({ text: input });
    setInput("");
  };

  return (
    <div className={className} {...props}>
      <div className="flex flex-col h-full border-2 rounded-xl p-2">
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
                <Message from={message.role} key={message.id}>
                  <MessageContent>
                    {message.parts.map((part, i) => {
                      if (part.type === "text") {
                        const isLastMessage =
                          messageIndex === messages.length - 1;
                        return (
                          <div key={`${message.id}-${i}`}>
                            <Response>{part.text}</Response>
                            {message.role === "assistant" && isLastMessage && (
                              <Actions className="mt-2 opacity-0 transition-opacity group-hover:opacity-100">
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
            <PromptInputSubmit disabled={!input} status={status} />
          </PromptInputToolbar>
        </PromptInput>
      </div>
    </div>
  );
};
