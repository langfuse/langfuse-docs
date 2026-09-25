import assert from "node:assert/strict";
import test from "node:test";
import { isLanguageTabSet, resolveTabsPersist } from "./tabs-persist.ts";

test("Python/JS tab sets share the language persist group", () => {
  const resolved = resolveTabsPersist({
    labels: ["Python SDK", "JS/TS SDK"],
  });
  assert.equal(resolved.groupId, "language");
  assert.equal(resolved.persist, true);
});

test("OpenAI SDK and LangChain items count as language tabs", () => {
  assert.equal(
    isLanguageTabSet([
      "OpenAI SDK (Python)",
      "OpenAI SDK (JS/TS)",
      "Vercel AI SDK",
    ]),
    true,
  );
  assert.equal(
    resolveTabsPersist({ labels: ["Python", "TypeScript", "HTTP"] }).groupId,
    "language",
  );
});

test("Local/VM tabs do not share the language key", () => {
  const resolved = resolveTabsPersist({ labels: ["Local", "VM"] });
  assert.equal(resolved.groupId, undefined);
  assert.equal(resolved.persist, false);
});

test("Cloud region and Observations/Scores tabs do not persist as language", () => {
  assert.equal(
    resolveTabsPersist({
      labels: [
        "Cloud EU",
        "Cloud US",
        "Cloud Japan",
        "HIPAA US",
        "Self-Hosted",
      ],
    }).groupId,
    undefined,
  );
  assert.equal(
    resolveTabsPersist({ labels: ["Observations", "Scores"] }).groupId,
    undefined,
  );
});

test("OpenAI Fast mode is not treated as a language tab set", () => {
  assert.equal(
    isLanguageTabSet(["Claude Sonnet Large context tier", "OpenAI Fast mode"]),
    false,
  );
});

test("explicit groupId persists independently of language inference", () => {
  const resolved = resolveTabsPersist({
    labels: ["Local", "VM"],
    groupId: "docker-compose-env",
  });
  assert.equal(resolved.groupId, "docker-compose-env");
  assert.equal(resolved.persist, true);
});

test("explicit persist false wins even for language tabs", () => {
  const resolved = resolveTabsPersist({
    labels: ["Python SDK", "JS/TS SDK"],
    persist: false,
  });
  assert.equal(resolved.groupId, "language");
  assert.equal(resolved.persist, false);
});
