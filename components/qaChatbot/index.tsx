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

export function Chat({ className }: { className?: string }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const conversationId = useMemo(() => nanoid(), []);

  // Controlled message histor. Used to update the messages state onFinish to include the latest messageId provided by the server.
  const [input, setInput] = useState("");
  const controlledMessages = useRef<Message[]>([]);
  const latestUserMessage = useRef<Message | null>(null);
  const latestMessageId = useRef<string | null>(null);

  const { messages, setMessages, append } = useChat({
    body: {
      conversationId,
    },
    api: "/api/qa-chatbot",
    sendExtraMessageFields: true,
    onResponse(response) {
      // Get the latest message id from the server
      const newMessageId = response.headers.get("X-Message-Id");
      latestMessageId.current = newMessageId;
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
        id: latestMessageId.current ?? message.id,
      });

      // Update "ai" messages state
      setMessages(controlledMessages.current);
    },
  });

  console.log(messages);

  const messagesWithWelcome: Message[] = [welcomeMessage, ...messages];

  return (
    <div
      className={cn(
        "relative flex flex-col p-5 mt-10 h-[70vh] md:h-[50vh] overflow-hidden bg-background/40 shadow-lg rounded-lg",
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

Read the [blog post](/blog/qa-chatbot-for-langfuse-docs) to learn how we've implemented it (all open-source).

_⚠️ Warning: The bot is not very smart and answers might be misleading. If you have a question that the bot cannot answer, ask the founders via the chat widget._`,
} as const;
