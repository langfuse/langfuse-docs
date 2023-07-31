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

  const messagesWithWelcome: Message[] = [welcomeMessage, ...messages];

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
  content: `Do you have any questions about Langfuse? Ask me!

_Warning: This is a demo. I'm not very smart._`,
} as const;

// **Uses:**

// - [supabase/headless-vector-search](https://github.com/supabase/headless-vector-search) to embed the docs via GitHub Actions
// - Supabase with pgvector
// - [Vercel AI SDK](https://github.com/vercel-labs/ai)
// - UI components from [ai-chatbot](https://github.com/vercel-labs/ai-chatbot)
// - GPT-3.5
// - Langfuse (of course)

// **Code:**
// - Frontend
// - Backend API route
