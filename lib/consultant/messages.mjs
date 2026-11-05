const MAX_MESSAGES = 16;
const MAX_MESSAGE_CHARS = 4_000;
const MAX_TOTAL_CHARS = 20_000;

function textOf(message) {
  if (Array.isArray(message.parts)) {
    return message.parts
      .filter(
        (part) =>
          part &&
          part.type === "text" &&
          typeof part.text === "string" &&
          part.text.trim(),
      )
      .map((part) => part.text.trim())
      .join("\n")
      .trim();
  }
  if (typeof message.content === "string") return message.content.trim();
  return "";
}

/**
 * Keep only visitor and assistant text. System messages, tool calls, and
 * other client-supplied parts are dropped so a request cannot impersonate
 * a tool result or replace the host prompt.
 */
export function consultantTranscript(body) {
  if (!body || typeof body !== "object") {
    return { error: "Describe your AI app to get a plan." };
  }
  const rawMessages = body.messages;
  if (
    !Array.isArray(rawMessages) ||
    rawMessages.length === 0 ||
    rawMessages.length > MAX_MESSAGES
  ) {
    return { error: "Describe your AI app to get a plan." };
  }

  const messages = [];
  let total = 0;
  for (const message of rawMessages) {
    if (!message || typeof message !== "object") continue;
    if (message.role !== "user" && message.role !== "assistant") continue;
    const text = textOf(message);
    if (!text) continue;
    if (text.length > MAX_MESSAGE_CHARS) {
      return { error: "Send a shorter description of your app." };
    }
    total += text.length;
    if (total > MAX_TOTAL_CHARS) {
      return { error: "This conversation is too long. Start a new chat." };
    }
    messages.push({ role: message.role, content: text });
  }

  const last = messages.at(-1);
  if (!last || last.role !== "user") {
    return { error: "Describe your AI app to get a plan." };
  }

  const sessionId =
    typeof body.id === "string" && /^[A-Za-z0-9_-]{8,80}$/.test(body.id)
      ? body.id
      : null;

  return { messages, sessionId };
}
