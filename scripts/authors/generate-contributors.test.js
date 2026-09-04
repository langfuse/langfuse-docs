const assert = require("node:assert/strict");
const test = require("node:test");
const { resolveContributor } = require("./generate-contributors");

test("caches a successful response without a linked GitHub username", async (t) => {
  const originalFetch = global.fetch;
  let requestCount = 0;

  global.fetch = async () => {
    requestCount += 1;
    return {
      ok: true,
      json: async () => ({ author: null }),
    };
  };
  t.after(() => {
    global.fetch = originalFetch;
  });

  assert.equal(await resolveContributor("unlinked@example.com", "first"), null);
  assert.equal(
    await resolveContributor("unlinked@example.com", "second"),
    null,
  );
  assert.equal(requestCount, 1);
});

test("resolves both GitHub noreply email formats without an API request", async (t) => {
  const originalFetch = global.fetch;
  global.fetch = async () => {
    throw new Error("GitHub should not be called");
  };
  t.after(() => {
    global.fetch = originalFetch;
  });

  assert.equal(
    await resolveContributor(
      "2834609+marcklingen@users.noreply.github.com",
      "unused",
    ),
    "marcklingen",
  );
  assert.equal(
    await resolveContributor("DABH@users.noreply.github.com", "unused"),
    "DABH",
  );
});

test("fails when GitHub returns a non-success response", async (t) => {
  const originalFetch = global.fetch;
  global.fetch = async () => ({
    ok: false,
    status: 403,
    statusText: "Forbidden",
  });
  t.after(() => {
    global.fetch = originalFetch;
  });

  await assert.rejects(
    resolveContributor("rate-limited@example.com", "rate-limited"),
    /403 Forbidden/,
  );
});
