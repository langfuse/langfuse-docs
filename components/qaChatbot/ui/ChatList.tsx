import { type Message } from "ai";

import { ChatMessage } from "./ChatMessage";
import { Separator } from "./Separator";

export interface ChatList {
  messages: Message[];
  conversationId: string;
}

export function ChatList({ messages, conversationId }: ChatList) {
  if (!messages.length) {
    return null;
  }

  return (
    <div className="relative lg:mx-12">
      {messages.map((message, index) => (
        <div key={index}>
          <ChatMessage message={message} conversationId={conversationId} />
          {index < messages.length - 1 && (
            <Separator className="my-4 lg:my-6" />
          )}
        </div>
      ))}
    </div>
  );
}
