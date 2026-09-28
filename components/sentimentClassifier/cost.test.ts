import assert from "node:assert/strict";
import test from "node:test";
import {
  comparisonRatio,
  formatCostUsd,
  formatLatencyMs,
  formatRatio,
  sumUsage,
} from "./cost";
import { classifiersForCount, parseClassifierIds } from "./criteria";

test("classifiersForCount stacks sentiment, urgency, intent, action", () => {
  assert.deepEqual(
    classifiersForCount(3).map((item) => item.id),
    ["sentiment", "urgency", "intent"],
  );
  assert.equal(classifiersForCount(1)[0].id, "sentiment");
  assert.equal(classifiersForCount(9).length, 4);
});

test("parseClassifierIds defaults to sentiment and rejects unknown ids", () => {
  assert.deepEqual(
    parseClassifierIds(undefined).map((item) => item.id),
    ["sentiment"],
  );
  assert.throws(() => parseClassifierIds(["nope"]), /Unknown classifier/);
  assert.deepEqual(
    parseClassifierIds(["intent", "intent", "urgency"]).map((item) => item.id),
    ["intent", "urgency"],
  );
});

test("formats cost, latency, and comparison ratios", () => {
  assert.equal(formatCostUsd(0), "$0");
  assert.equal(formatCostUsd(0.0004), "$0.000400");
  assert.equal(formatLatencyMs(42), "42ms");
  assert.equal(formatLatencyMs(2400), "2.4s");
  assert.equal(formatRatio(47.2), "47×");
  assert.equal(formatRatio(2.4), "2.4×");
  assert.equal(comparisonRatio(0.008, 0.0001), 80);
  assert.equal(comparisonRatio(0, 1), null);
  assert.equal(sumUsage([]), null);
  assert.equal(
    sumUsage([
      {
        inputTokens: 10,
        outputTokens: 2,
        reasoningTokens: 1,
        totalTokens: 12,
        costUsd: 0.25,
      },
      {
        inputTokens: 5,
        outputTokens: 3,
        reasoningTokens: 2,
        totalTokens: 8,
        costUsd: 0.25,
      },
    ])?.costUsd,
    0.5,
  );
});
