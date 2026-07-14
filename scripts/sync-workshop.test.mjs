import assert from "node:assert/strict";
import test from "node:test";
import { fetchGitHub } from "./sync-workshop.mjs";

const RAW_ACCEPT = "application/vnd.github.raw";

test("retries transient GitHub responses", async () => {
  const responses = [
    new Response("temporary outage", {
      status: 502,
      statusText: "Bad Gateway",
    }),
    new Response("# Workshop", { status: 200 }),
  ];
  const delays = [];
  let requests = 0;
  let requestedUrl;

  const response = await fetchGitHub("README.md", RAW_ACCEPT, {
    fetchImpl: async (url) => {
      requests += 1;
      requestedUrl = url;
      return responses.shift();
    },
    sleepImpl: async (delayMs) => delays.push(delayMs),
    warn: () => {},
  });

  assert.equal(await response.text(), "# Workshop");
  assert.equal(requests, 2);
  assert.equal(
    requestedUrl,
    "https://api.github.com/repos/langfuse/langfuse-workshop/contents/README.md?ref=main",
  );
  assert.deepEqual(delays, [500]);
});

test("does not retry permanent GitHub responses", async () => {
  let requests = 0;

  await assert.rejects(
    fetchGitHub("missing.md", RAW_ACCEPT, {
      fetchImpl: async () => {
        requests += 1;
        return new Response("Not Found", {
          status: 404,
          statusText: "Not Found",
        });
      },
      sleepImpl: async () => {},
      warn: () => {},
    }),
    /404 Not Found/,
  );

  assert.equal(requests, 1);
});
