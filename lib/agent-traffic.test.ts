import assert from "node:assert/strict";
import test from "node:test";
import type { IpRanges } from "@mintlify/agent-traffic";
import {
  classifyAgentTraffic,
  createIpRangesCache,
  isAgentOrAiCrawler,
} from "./agent-traffic.ts";

const CLAUDEBOT_UA =
  "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; ClaudeBot/1.0; +claudebot@anthropic.com)";
const CHROME_UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36";
const DEVIN_UA =
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36; Devin/1.0; +devin.ai";
const ANTHROPIC_RANGES_URL = "https://claude.com/crawling/bots.json";

const anthropicRanges: IpRanges = {
  [ANTHROPIC_RANGES_URL]: {
    url: ANTHROPIC_RANGES_URL,
    createdAt: new Date().toISOString(),
    cidrs: ["216.73.216.0/22"],
  },
};

const headers = (userAgent: string, accept?: string) =>
  new Headers({ "user-agent": userAgent, ...(accept ? { accept } : {}) });

test("labels a known coding agent", () => {
  const traffic = classifyAgentTraffic(
    headers("GitHubCopilotRuntime-WebFetch"),
    undefined,
  );
  assert.equal(traffic.category, "agent");
  assert.equal(traffic.kind, "coding");
  assert.equal(traffic.operator, "GitHub");
  assert.ok(isAgentOrAiCrawler(traffic));
});

test("does not treat a browser or a link checker as an agent", () => {
  assert.equal(
    isAgentOrAiCrawler(classifyAgentTraffic(headers(CHROME_UA), undefined)),
    false,
  );
  assert.equal(
    isAgentOrAiCrawler(
      classifyAgentTraffic(
        headers("lychee/intentsolutions-claude-code-plugins-link-check"),
        undefined,
      ),
    ),
    false,
  );
});

test("verifies a crawler inside its operator's published ranges", () => {
  const traffic = classifyAgentTraffic(
    headers(CLAUDEBOT_UA),
    "216.73.216.1",
    anthropicRanges,
  );
  assert.equal(traffic.category, "ai-crawler");
  assert.equal(traffic.name, "ClaudeBot");
  assert.equal(traffic.verified, true);
});

test("flags a crawler outside its operator's published ranges", () => {
  const traffic = classifyAgentTraffic(
    headers(CLAUDEBOT_UA),
    "73.12.4.9",
    anthropicRanges,
  );
  assert.equal(traffic.category, "bot");
  assert.equal(traffic.kind, "impersonator");
  assert.equal(traffic.verified, false);
});

test("labels local additions missing from the dataset", () => {
  const devin = classifyAgentTraffic(headers(DEVIN_UA), undefined);
  assert.equal(devin.category, "agent");
  assert.equal(devin.name, "Devin");

  const chatgpt = classifyAgentTraffic(headers("ChatGPT-User"), undefined);
  assert.equal(chatgpt.category, "agent");
  assert.equal(chatgpt.operator, "OpenAI");
});

test("labels local additions that also ask for markdown", () => {
  const traffic = classifyAgentTraffic(
    headers(DEVIN_UA, "text/markdown, text/html;q=0.9"),
    undefined,
  );
  assert.equal(traffic.name, "Devin");
});

test("labels an unknown client that asks for markdown as an unidentified agent", () => {
  const traffic = classifyAgentTraffic(
    headers(CHROME_UA, "text/markdown, text/html;q=0.9"),
    undefined,
  );
  assert.equal(traffic.category, "agent");
  assert.equal(traffic.kind, "unidentified");
});

const DAY_MS = 24 * 60 * 60 * 1000;
const fileA = { url: "a", cidrs: ["10.0.0.0/8"] };
const fileB = { url: "b", cidrs: ["192.168.0.0/16"] };

function fakeLoader(results: IpRanges[]) {
  let calls = 0;
  return {
    load: async () => results[Math.min(calls++, results.length - 1)],
    calls: () => calls,
  };
}

test("caches IP ranges for a day", async () => {
  let time = 0;
  const loader = fakeLoader([{ a: fileA, b: fileB }]);
  const getIpRanges = createIpRangesCache({
    load: loader.load,
    now: () => time,
  });

  assert.deepEqual(Object.keys(await getIpRanges()), ["a", "b"]);
  time = DAY_MS - 1;
  await getIpRanges();
  assert.equal(loader.calls(), 1);
  time = DAY_MS;
  await getIpRanges();
  assert.equal(loader.calls(), 2);
});

test("retries soon when nothing loaded", async () => {
  let time = 0;
  const loader = fakeLoader([{}, { a: fileA }]);
  const getIpRanges = createIpRangesCache({
    load: loader.load,
    now: () => time,
  });

  assert.deepEqual(await getIpRanges(), {});
  time = 10 * 60 * 1000;
  assert.deepEqual(Object.keys(await getIpRanges()), ["a"]);
  assert.equal(loader.calls(), 2);
});

test("keeps the last good file when a refresh partly fails, and retries soon", async () => {
  let time = 0;
  const loader = fakeLoader([
    { a: fileA, b: fileB },
    { a: fileA },
    { a: fileA, b: fileB },
  ]);
  const getIpRanges = createIpRangesCache({
    load: loader.load,
    now: () => time,
  });

  await getIpRanges();
  time = DAY_MS;
  assert.deepEqual(Object.keys(await getIpRanges()), ["a", "b"]);
  time = DAY_MS + 10 * 60 * 1000;
  await getIpRanges();
  assert.equal(loader.calls(), 3);
});

test("keeps the last good ranges when a refresh throws", async () => {
  let time = 0;
  let calls = 0;
  const getIpRanges = createIpRangesCache({
    load: async () => {
      if (calls++ > 0) throw new Error("network");
      return { a: fileA };
    },
    now: () => time,
  });

  await getIpRanges();
  time = DAY_MS;
  assert.deepEqual(Object.keys(await getIpRanges()), ["a"]);
});
