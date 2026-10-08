import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  applyQaChatbotCodeFormattingToMessages,
  QA_CHATBOT_CODE_FORMATTING_INSTRUCTION,
  withQaChatbotCodeFormatting,
} from "./flow_config";

describe("withQaChatbotCodeFormatting", () => {
  it("returns the instruction alone when the system prompt is empty", () => {
    assert.equal(
      withQaChatbotCodeFormatting(""),
      QA_CHATBOT_CODE_FORMATTING_INSTRUCTION,
    );
    assert.equal(
      withQaChatbotCodeFormatting(null),
      QA_CHATBOT_CODE_FORMATTING_INSTRUCTION,
    );
  });

  it("appends the instruction once", () => {
    const once = withQaChatbotCodeFormatting("Be helpful.");
    assert.match(once, /^Be helpful\.\n\nFormatting rules for code/);
    assert.equal(withQaChatbotCodeFormatting(once), once);
  });
});

describe("applyQaChatbotCodeFormattingToMessages", () => {
  it("appends to the last system message", () => {
    const result = applyQaChatbotCodeFormattingToMessages([
      { role: "system", content: "First" },
      { role: "system", content: "Second" },
      { role: "user", content: "Hi" },
    ]);

    assert.equal(result[0].content, "First");
    assert.match(result[1].content, /^Second\n\nFormatting rules for code/);
    assert.equal(result[2].content, "Hi");
  });

  it("inserts a system message when none exists", () => {
    const result = applyQaChatbotCodeFormattingToMessages([
      { role: "user", content: "Hi" },
    ]);

    assert.equal(result[0].role, "system");
    assert.equal(result[0].content, QA_CHATBOT_CODE_FORMATTING_INSTRUCTION);
    assert.equal(result[1].content, "Hi");
  });
});
