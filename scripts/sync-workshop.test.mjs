import assert from "node:assert/strict";
import test from "node:test";
import { extractWorkshopSourcePaths, fetchGitHub } from "./sync-workshop.mjs";

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

  const response = await fetchGitHub("README.md", {
    fetchImpl: async (url) => {
      requests += 1;
      requestedUrl = url;
      return responses.shift();
    },
    random: () => 0,
    sleepImpl: async (delayMs) => delays.push(delayMs),
    warn: () => {},
  });

  assert.equal(await response.text(), "# Workshop");
  assert.equal(requests, 2);
  assert.equal(
    requestedUrl,
    "https://raw.githubusercontent.com/langfuse/langfuse-workshop/main/README.md",
  );
  assert.deepEqual(delays, [500]);
});

test("retries transient network errors", async () => {
  let requests = 0;

  const response = await fetchGitHub("README.md", {
    fetchImpl: async () => {
      requests += 1;
      if (requests === 1) throw new TypeError("fetch failed");
      return new Response("# Workshop", { status: 200 });
    },
    random: () => 0,
    sleepImpl: async () => {},
    warn: () => {},
  });

  assert.equal(await response.text(), "# Workshop");
  assert.equal(requests, 2);
});

test("uses the GitHub token from the environment", async () => {
  const previousAccessToken = process.env.GITHUB_ACCESS_TOKEN;
  const previousToken = process.env.GITHUB_TOKEN;
  let authorization;

  process.env.GITHUB_ACCESS_TOKEN = "test-access-token";
  process.env.GITHUB_TOKEN = "test-fallback-token";

  try {
    await fetchGitHub("README.md", {
      fetchImpl: async (_url, init) => {
        authorization = init.headers.Authorization;
        return new Response("# Workshop", { status: 200 });
      },
    });
  } finally {
    if (previousAccessToken == null) delete process.env.GITHUB_ACCESS_TOKEN;
    else process.env.GITHUB_ACCESS_TOKEN = previousAccessToken;
    if (previousToken == null) delete process.env.GITHUB_TOKEN;
    else process.env.GITHUB_TOKEN = previousToken;
  }

  assert.equal(authorization, "Bearer test-access-token");
});

test("does not retry permanent GitHub responses", async () => {
  let requests = 0;

  await assert.rejects(
    fetchGitHub("missing.md", {
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

test("bounds the response body included in errors", async () => {
  const oversizedBody = "x".repeat(2_000);

  await assert.rejects(
    fetchGitHub("README.md", {
      fetchImpl: async () =>
        new Response(oversizedBody, {
          status: 500,
          statusText: "Internal Server Error",
        }),
      random: () => 0,
      sleepImpl: async () => {},
      warn: () => {},
    }),
    (error) => {
      assert.match(error.message, /\[response truncated\]/);
      assert.ok(error.message.length < oversizedBody.length);
      return true;
    },
  );
});

test("discovers workshop modules from the README module table", () => {
  const readme = `
| Step | Learner lesson | Instructor notes |
| --- | --- | --- |
| 00 | [Setup](./docs/learner/00-setup.md) | [Notes](./docs/instructor/00-setup.md) |
| 01 | [Base App](./docs/learner/01-base-app.md#run-it) | [Notes](./docs/instructor/01-base-app.md) |

[Learner directory](./docs/learner/)
`;

  assert.deepEqual(extractWorkshopSourcePaths(readme), {
    learner: ["docs/learner/00-setup.md", "docs/learner/01-base-app.md"],
    instructor: [
      "docs/instructor/00-setup.md",
      "docs/instructor/01-base-app.md",
    ],
  });
});
