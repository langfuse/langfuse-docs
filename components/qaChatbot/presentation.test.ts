import assert from "node:assert/strict";
import test from "node:test";
import type { UIMessage } from "ai";
import { getPresentationParts } from "./presentation.ts";

type Parts = UIMessage["parts"];
const text = (value: string): Parts[number] => ({
  type: "text",
  text: value,
  state: "done",
});
const reasoning = (value: string): Parts[number] => ({
  type: "reasoning",
  text: value,
  state: "done",
});
const tool = (name: string): Parts[number] => ({
  type: "dynamic-tool",
  toolName: name,
  toolCallId: name,
  state: "output-available",
  input: {},
  output: {},
});
const answerText = (parts: Parts) =>
  parts.flatMap((part) =>
    part.type === "text" && part.text ? [part.text] : [],
  );

test("tool-call narration joins its reasoning while only the final answer stays visible", () => {
  const parts: Parts = [
    { type: "step-start" },
    reasoning("Check the product overview."),
    text("I’ll look up the Langfuse docs."),
    tool("getLangfuseOverview"),
    { type: "step-start" },
    reasoning("Find the relevant feature pages."),
    text("I’ll fetch a few key overview pages."),
    tool("getLangfuseDocsPage"),
    { type: "step-start" },
    reasoning("Summarize the findings."),
    text("Langfuse helps you observe and evaluate LLM applications."),
  ];
  const original = structuredClone(parts);
  const result = getPresentationParts(parts, true);

  assert.deepEqual(answerText(result), [
    "Langfuse helps you observe and evaluate LLM applications.",
  ]);
  assert.equal(result[1].type, "reasoning");
  assert.equal(
    "text" in result[1] && result[1].text,
    "Check the product overview.\n\nI’ll look up the Langfuse docs.",
  );
  assert.equal(
    "text" in result[5] && result[5].text,
    "Find the relevant feature pages.\n\nI’ll fetch a few key overview pages.",
  );
  assert.equal(result.length, parts.length);
  assert.deepEqual(result[3], parts[3]);
  assert.deepEqual(result[7], parts[7]);
  assert.deepEqual(parts, original);
});

test("a text-end event before a tool call does not expose unfinished narration", () => {
  const partial: Parts = [
    reasoning("Look up the docs."),
    text("I’ll check the docs now."),
  ];

  const betweenSteps = getPresentationParts(partial, false);
  const afterTool = getPresentationParts(
    [...partial, tool("searchDocs")],
    false,
  );
  assert.deepEqual(answerText(betweenSteps), []);
  assert.deepEqual(answerText(afterTool), []);
  assert.deepEqual(betweenSteps[0], afterTool[0]);
});

test("narration without a reasoning part gets collapsed details of its own", () => {
  const result = getPresentationParts(
    [text("Searching the documentation."), tool("searchDocs"), text("Answer.")],
    true,
  );
  assert.deepEqual(result[0], {
    type: "reasoning",
    text: "Searching the documentation.",
    state: "done",
  });
  assert.deepEqual(answerText(result), ["Answer."]);
});

test("a final answer appears only after response completion", () => {
  const parts: Parts = [reasoning("Prepare an answer."), text("Final answer.")];
  assert.deepEqual(answerText(getPresentationParts(parts, false)), []);
  assert.deepEqual(answerText(getPresentationParts(parts, true)), [
    "Final answer.",
  ]);
  assert.deepEqual(getPresentationParts(parts, true), parts);
});

test("direct answers and source metadata survive response completion", () => {
  const parts: Parts = [
    text("A direct answer."),
    {
      type: "source-url",
      sourceId: "docs",
      url: "https://langfuse.com/docs",
    },
  ];
  assert.deepEqual(getPresentationParts(parts, true), parts);
});

test("pending narration preserves streaming state and stable tool positions", () => {
  const parts: Parts = [
    reasoning("Review the docs."),
    { type: "text", text: "I’ll search", state: "streaming" },
    tool("searchDocs"),
  ];
  const result = getPresentationParts(parts, false);
  assert.equal("state" in result[0] && result[0].state, "streaming");
  assert.deepEqual(result[2], parts[2]);
  assert.deepEqual(answerText(result), []);
});
