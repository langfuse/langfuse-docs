import assert from "node:assert/strict";
import { after, test } from "node:test";
import { mkdtemp, rm, symlink } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { build } from "esbuild";
import dns from "node:dns";

const root = fileURLToPath(new URL("../", import.meta.url));
const directory = await mkdtemp(join(tmpdir(), "docs-chat-test-"));
after(() => rm(directory, { recursive: true, force: true }));
await symlink(join(root, "node_modules"), join(directory, "node_modules"));
const bundle = join(directory, "route.mjs");
await build({
  absWorkingDir: root,
  entryPoints: ["app/api/chat/route.ts"],
  bundle: true,
  platform: "node",
  format: "esm",
  packages: "external",
  alias: { "next/server": "next/server.js" },
  outfile: bundle,
  define: { "process.env.INKEEP_BACKEND_API_KEY": '"test-key"' },
});
const { POST } = await import(pathToFileURL(bundle).href);
const downloadBundle = join(directory, "download.mjs");
await build({
  absWorkingDir: root,
  entryPoints: ["lib/ai/download.ts"],
  bundle: true,
  platform: "node",
  format: "esm",
  packages: "external",
  outfile: downloadBundle,
});
const { download } = await import(pathToFileURL(downloadBundle).href);

test("AI file downloads reject a public hostname resolving to a private address", async (t) => {
  t.mock.method(dns.promises.Resolver.prototype, "resolve4", async () => [
    "127.0.0.1",
  ]);
  t.mock.method(dns.promises.Resolver.prototype, "resolve6", async () => []);
  await assert.rejects(
    download({ url: new URL("https://attachments.example.test/file") }),
    (error) => {
      for (let cause = error; cause; cause = cause.cause) {
        if (cause.code === "hostname_unsafe") return true;
      }
      return false;
    },
  );
});

test("rejects malformed message parts before contacting the model", async (t) => {
  t.mock.method(globalThis, "fetch", () => {
    assert.fail("invalid history must not reach the provider");
  });
  for (const part of [
    { type: "text", text: 42 },
    { type: "data-client", data: { location: 42 } },
  ]) {
    const response = await POST(
      new Request("http://localhost/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          messages: [{ id: "message", role: "user", parts: [part] }],
        }),
      }),
    );
    assert.equal(response.status, 400);
    assert.equal(
      (await response.json()).error,
      "Could not read message history.",
    );
  }
});
