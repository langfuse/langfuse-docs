export const QA_CHATBOT_PROMPT_NAME = "langfuse-docs-assistant-chat";

export type EvaluatorMessage = {
  role: string;
  content: string;
};

export function normalizeMessageContent(content: unknown): string {
  if (typeof content === "string") return content;
  if (Array.isArray(content)) {
    return content
      .map((part) => {
        if (typeof part === "string") return part;
        if (part && typeof part === "object" && "text" in part) {
          return String((part as { text: unknown }).text ?? "");
        }
        return JSON.stringify(part);
      })
      .join("");
  }
  if (content == null) return "";
  return JSON.stringify(content);
}

export function getLastUserMessage(input: unknown): string {
  if (typeof input === "string") return input;
  if (!input || typeof input !== "object" || !("messages" in input)) return "";

  const messages = (input as { messages?: unknown }).messages;
  if (!Array.isArray(messages)) return "";

  const userMessage = [...messages]
    .reverse()
    .find(
      (message) =>
        message &&
        typeof message === "object" &&
        (message as { role?: string }).role === "user",
    );

  return normalizeMessageContent(
    (userMessage as { content?: unknown } | undefined)?.content,
  );
}

export function getChatHistory(input: unknown): EvaluatorMessage[] {
  if (!input || typeof input !== "object" || !("messages" in input)) {
    return [];
  }

  const messages = (input as { messages?: unknown }).messages;
  if (!Array.isArray(messages)) return [];

  return messages
    .filter((message) => message && typeof message === "object")
    .map((message) => ({
      role: String((message as { role?: unknown }).role ?? "user"),
      content: normalizeMessageContent(
        (message as { content?: unknown }).content,
      ),
    }))
    .filter((message) => message.role !== "system");
}
