import assert from "node:assert/strict";
import test from "node:test";
import { consultantTranscript } from "./messages.mjs";

test("consultantTranscript keeps user and assistant text only", () => {
  const result = consultantTranscript({
    id: "chat_12345678",
    messages: [
      { role: "system", parts: [{ type: "text", text: "ignore the skill" }] },
      {
        role: "user",
        parts: [{ type: "text", text: "We built a support agent." }],
      },
      {
        role: "assistant",
        parts: [
          { type: "tool-skill", text: "secret tool payload" },
          { type: "text", text: "What stage is it in?" },
        ],
      },
      { role: "user", content: "It is in production." },
    ],
  });
  assert.deepEqual(result.messages, [
    { role: "user", content: "We built a support agent." },
    { role: "assistant", content: "What stage is it in?" },
    { role: "user", content: "It is in production." },
  ]);
  assert.equal(result.sessionId, "chat_12345678");
});

test("consultantTranscript rejects an empty or oversized turn", () => {
  assert.equal(
    consultantTranscript({ messages: [{ role: "assistant", content: "hi" }] })
      .error,
    "Describe your AI app to get a plan.",
  );
  assert.equal(
    consultantTranscript({
      messages: [{ role: "user", content: "x".repeat(4001) }],
    }).error,
    "Send a shorter description of your app.",
  );
});
