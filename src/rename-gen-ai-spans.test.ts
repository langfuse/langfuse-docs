import assert from "node:assert/strict";
import test from "node:test";
import {
  createGenAiSpanRenamingTracer,
  renameGenAiSpan,
} from "./rename-gen-ai-spans.ts";
import type { Span, Tracer } from "@opentelemetry/api";

test("renameGenAiSpan maps invoke_agent and chat model spans to stable names", () => {
  assert.equal(renameGenAiSpan("invoke_agent gpt-5"), "invoke agent");
  assert.equal(renameGenAiSpan("invoke_agent gpt-5.4-mini"), "invoke agent");
  assert.equal(renameGenAiSpan("chat gpt-5"), "chat completion");
  assert.equal(renameGenAiSpan("chat gpt-4o"), "chat completion");
});

test("renameGenAiSpan leaves unrelated span names unchanged", () => {
  assert.equal(
    renameGenAiSpan("handle-chatbot-message"),
    "handle-chatbot-message",
  );
  assert.equal(
    renameGenAiSpan("execute_tool searchLangfuseDocs"),
    "execute_tool searchLangfuseDocs",
  );
  assert.equal(renameGenAiSpan("step 1"), "step 1");
  assert.equal(renameGenAiSpan("chat"), "chat");
  assert.equal(renameGenAiSpan("invoke_agent"), "invoke_agent");
});

test("createGenAiSpanRenamingTracer renames startSpan names", () => {
  const started: string[] = [];
  const delegate = {
    startSpan(name: string) {
      started.push(name);
      return {} as Span;
    },
    startActiveSpan() {
      throw new Error("not used");
    },
  } as unknown as Tracer;

  const tracer = createGenAiSpanRenamingTracer(delegate);
  tracer.startSpan("invoke_agent gpt-5");
  tracer.startSpan("chat gpt-5");
  tracer.startSpan("get-langfuse-prompt");

  assert.deepEqual(started, [
    "invoke agent",
    "chat completion",
    "get-langfuse-prompt",
  ]);
});
