"use client";

import { Message, useChat } from "ai/react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

export function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: "/api/qa-chatbot",
    initialMessages: [
      {
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
      },
    ],
  });

  return (
    <div className={cn("flex flex-col mt-10 h-3/4 overflow-hidden max-h-3/4")}>
      <div className="flex-1 flex flex-col gap-4 overflow-y-scroll">
        {messages.length ? <MessageList messages={messages} /> : null}
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2">
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

const MessageList = ({ messages }: { messages: Message[] }) => {
  return (
    <>
      {messages.map((message, i) =>
        message.role === "assistant" ? (
          <AssistantMessage key={message.id} message={message} />
        ) : message.role === "user" ? (
          <UserMessage key={message.id} message={message} />
        ) : null
      )}
    </>
  );
};

const AssistantMessage = ({ message }: { message: Message }) => {
  return (
    <div className="flex flex-col gap-2">
      <div>Langfuse:</div>
      <div>{message.content}</div>
    </div>
  );
};

const UserMessage = ({ message }: { message: Message }) => {
  return (
    <div className="flex flex-col gap-2">
      <div>You:</div>
      <div>{message.content}</div>
    </div>
  );
};
