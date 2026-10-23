export const QA_CHATBOT_PROMPT_NAME = "langfuse-docs-assistant-chat";

/**
 * Appended to the managed system prompt so replies render correctly in the
 * demo chatbot UI. Models with low text verbosity often emit code as prose
 * (no fences, multiple statements on one line), which collapses in HTML.
 */
export const QA_CHATBOT_CODE_FORMATTING_INSTRUCTION = [
  "Formatting rules for code in your replies:",
  "- Always wrap code in GitHub-Flavored Markdown fenced code blocks with a language tag (for example ```python or ```ts).",
  "- Put each statement on its own line inside the fence. Never smash multiple statements onto one line.",
  "- Do not present install commands, imports, or multi-line snippets as plain paragraph prose.",
].join("\n");

export function withQaChatbotCodeFormatting(
  systemPrompt: string | undefined | null,
): string {
  const base = systemPrompt?.trim() ?? "";
  if (!base) return QA_CHATBOT_CODE_FORMATTING_INSTRUCTION;
  if (base.includes(QA_CHATBOT_CODE_FORMATTING_INSTRUCTION)) return base;
  return `${base}\n\n${QA_CHATBOT_CODE_FORMATTING_INSTRUCTION}`;
}

/** Apply code-formatting instructions to the last system message (experiments). */
export function applyQaChatbotCodeFormattingToMessages<
  T extends { role: string; content: string },
>(messages: T[]): T[] {
  const lastSystemIdx = messages
    .map((message) => message.role)
    .lastIndexOf("system");

  if (lastSystemIdx === -1) {
    return [
      {
        role: "system",
        content: QA_CHATBOT_CODE_FORMATTING_INSTRUCTION,
      } as T,
      ...messages,
    ];
  }

  return messages.map((message, index) =>
    index === lastSystemIdx
      ? {
          ...message,
          content: withQaChatbotCodeFormatting(message.content),
        }
      : message,
  );
}

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
