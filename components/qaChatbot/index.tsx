"use client";

import { Message, useChat } from "ai/react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { ChatList } from "./ui/ChatList";
import { ButtonScrollToBottom } from "./ui/ButtonScrollToBottom";
import React from "react";

export function Chat() {
  const ref = React.useRef<HTMLDivElement>(null);
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: "/api/qa-chatbot",
  });

  const messagesWithWelcome: Message[] = messages.length
    ? messages
    : [welcomeMessage];

  return (
    <div className="relative flex flex-col p-3 mt-10 h-[70vh] overflow-hidden">
      <div className="flex-1 flex flex-col gap-4 overflow-y-scroll" ref={ref}>
        <ChatList messages={messagesWithWelcome} />
      </div>

      <form onSubmit={handleSubmit} className="relative flex gap-2">
        <ButtonScrollToBottom outerDivRef={ref} />
        <Input
          value={input}
          onChange={handleInputChange}
          placeholder="Question ..."
        />
        <Button type="submit">Send</Button>
      </form>
    </div>
  );
}

const welcomeMessage: Message = {
  role: "assistant",
  id: "announcement-1",
  content: `Welcome to our Langfuse chatbot which can answer questions about Langfuse and the Langfuse docs.

**Uses:**

- [supabase/headless-vector-search](https://github.com/supabase/headless-vector-search) for embedding of the Langfuse docs via GitHub Actions
- pgvector on Supabase
- Vercel AI SDK
- GPT-3.5
- Langfuse (of course)

**Code:**

- Frontend
- Backend API route

Read our blog post here: https://langfuse.com/blog/llm-chatbot`,
} as const;
