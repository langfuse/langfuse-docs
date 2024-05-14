"use client";

import { Message, useChat } from "ai/react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { ChatList } from "./ui/ChatList";
import { ButtonScrollToBottom } from "./ui/ButtonScrollToBottom";
import React from "react";
import { Send } from "lucide-react";
import { nanoid } from "ai";
import { useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { usePersistedNanoId } from "./hooks/persistedNanoId";

export function Chat({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const conversationId = useMemo(() => nanoid(), []);
  const userId = usePersistedNanoId("qa-chatbot-user-id");

  // Controlled message history. Used to update the messages state onFinish to include the latest messageId provided by the server.
  const [input, setInput] = useState("");
  const controlledMessages = useRef<Message[]>([]);
  const latestUserMessage = useRef<Message | null>(null);
  const latestTraceId = useRef<string | null>(null);

  const { messages, setMessages, append } = useChat({
    body: {
      conversationId,
      userId: userId ? "u-" + userId : undefined,
    },
    api: "/api/qa-chatbot",
    sendExtraMessageFields: true,
    onResponse(response) {
      // Get the latest message id from the server
      const newTraceId = response.headers.get("X-Trace-Id");
      latestTraceId.current = newTraceId;
    },
    onFinish(message) {
      // Update controlledMessages
      if (latestUserMessage.current) {
        controlledMessages.current.push({
          ...latestUserMessage.current,
          id: latestUserMessage.current.id ?? nanoid(),
        });
        latestUserMessage.current = null;
      }
      controlledMessages.current.push({
        ...message,
        id: latestTraceId.current ?? message.id,
      });

      // Update "ai" messages state
      setMessages(controlledMessages.current);
    },
  });

  const messagesWithWelcome: Message[] = [welcomeMessage, ...messages];

  return (
    <div
      className={cn(
        "relative flex flex-col p-5 mt-10 h-[70vh] overflow-hidden bg-background/40 shadow-lg rounded",
        className
      )}
    >
      <div className="flex-1 overflow-y-scroll" ref={ref}>
        <ChatList
          messages={messagesWithWelcome}
          conversationId={conversationId}
        />
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          const userMessage = {
            id: nanoid(),
            content: input,
            role: "user" as const,
          };
          setInput("");

          latestUserMessage.current = userMessage;
          append(userMessage);
        }}
        className="relative flex gap-2"
      >
        <ButtonScrollToBottom outerDivRef={ref} />
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Send a message"
        />
        <Button type="submit" size="icon">
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}

const welcomeMessage: Message = {
  role: "assistant",
  id: "announcement-1",
  content: `👋 Do you have any questions about Langfuse? Ask me!

_⚠️ Warning: Do not enter sensitive information. All chat messages can be viewed in the public demo project. Responses may be inaccurate. Please check the documentation for details or reach out to us via the chat widget._`,
} as const;
