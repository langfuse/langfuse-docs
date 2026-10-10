import assert from "node:assert/strict";
import test from "node:test";
import {
  isLanguageTabGroup,
  tabValueFromHash,
  toTabId,
  toTabValue,
} from "./lang-tabs";

test("maps short language labels to stable hash ids", () => {
  assert.equal(toTabId("JS/TS"), "tab-js");
  assert.equal(toTabId("JS/TS SDK"), "tab-js");
  assert.equal(toTabId("JavaScript"), "tab-js");
  assert.equal(toTabId("Python"), "tab-python");
  assert.equal(toTabId("Python SDK"), "tab-python");
  assert.equal(toTabId("Python SDK v4+"), "tab-python");
});

test("keeps compound install tabs unique", () => {
  assert.equal(toTabId("OpenAI SDK (JS/TS)"), "tab-openai-sdk-js-ts");
  assert.equal(toTabId("OpenAI SDK (Python)"), "tab-openai-sdk-python");
  assert.equal(toTabId("Vercel AI SDK"), "tab-vercel-ai-sdk");
});

test("does not treat Local/VM as a language group", () => {
  assert.equal(isLanguageTabGroup(["Local", "VM"]), false);
  assert.equal(
    isLanguageTabGroup([
      "Ask your coding agent",
      "Cursor plugin",
      "Manual installation",
    ]),
    false,
  );
  assert.equal(isLanguageTabGroup(["Python", "JS/TS"]), true);
  assert.equal(
    isLanguageTabGroup([
      "OpenAI SDK (Python)",
      "OpenAI SDK (JS/TS)",
      "Vercel AI SDK",
      "LangChain (Python)",
      "LangChain (JS/TS)",
      "Python SDK",
      "JS/TS SDK",
      "OpenTelemetry (API)",
      "More integrations",
    ]),
    true,
  );
});

test("resolves a hash to the matching tab value", () => {
  const labels = ["Python SDK", "JS/TS SDK"];
  const values = labels.map(toTabValue);
  const ids = labels.map(toTabId);
  assert.equal(tabValueFromHash("#tab-js", ids, values), "js/ts-sdk");
  assert.equal(tabValueFromHash("tab-python", ids, values), "python-sdk");
  assert.equal(tabValueFromHash("#missing", ids, values), undefined);
});
