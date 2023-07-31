"use client";

import { Message, useChat } from "ai/react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { ChatList } from "./ui/ChatList";
import { ButtonScrollToBottom } from "./ui/ButtonScrollToBottom";
import React from "react";
import { Send } from "lucide-react";

export function Chat() {
  const ref = React.useRef<HTMLDivElement>(null);
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: "/api/qa-chatbot",
  });

  const messagesWithWelcome: Message[] = [welcomeMessage, ...messages];

  return (
    <div className="relative flex flex-col p-5 mt-10 h-[70vh] overflow-hidden border border-gray-700 rounded-lg">
      <div className="flex-1 overflow-y-scroll" ref={ref}>
        <ChatList messages={messagesWithWelcome} />
      </div>

      <form onSubmit={handleSubmit} className="relative flex gap-2">
        <ButtonScrollToBottom outerDivRef={ref} />
        <Input
          value={input}
          onChange={handleInputChange}
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

_⚠️ Warning: The bot is not very smart and answers might be misleading. If you have a question that the bot cannot answer, ask the founders via the chat widget._`,
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
