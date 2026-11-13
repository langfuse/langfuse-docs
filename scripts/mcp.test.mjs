import assert from "node:assert/strict";
import { after, test } from "node:test";
import { mkdtemp, rm, symlink } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { build } from "esbuild";

// test:mcp uses --test-force-exit because mcp-handler owns a cleanup interval.
const root = fileURLToPath(new URL("../", import.meta.url));
const temporaryDirectory = await mkdtemp(join(tmpdir(), "docs-mcp-test-"));
after(() => rm(temporaryDirectory, { recursive: true, force: true }));
await symlink(
  join(root, "node_modules"),
  join(temporaryDirectory, "node_modules"),
);
const bundle = join(temporaryDirectory, "route.mjs");
await build({
  absWorkingDir: root,
  entryPoints: ["app/api/mcp/route.ts"],
  bundle: true,
  platform: "node",
  format: "esm",
  packages: "external",
  outfile: bundle,
  define: { "process.env.NEXT_PUBLIC_POSTHOG_KEY": "undefined" },
});
const { POST } = await import(pathToFileURL(bundle).href);

const headers = {
  "content-type": "application/json",
  accept: "application/json, text/event-stream",
  "mcp-protocol-version": "2025-03-26",
};
const message = (method, params = {}) => ({
  jsonrpc: "2.0",
  id: 1,
  method,
  params,
});
const request = (body, options = {}) =>
  new Request("http://localhost/api/mcp", {
    method: "POST",
    headers,
    body,
    ...options,
  });
const rpcResponse = async (response) => {
  const text = await response.text();
  assert.equal(response.status, 200, text);
  return JSON.parse(
    text
      .split("\n")
      .find((line) => line.startsWith("data: "))
      .slice(6),
  );
};

test("rejects bodies over 64 KiB before parsing, including streamed and misdeclared bodies", async () => {
  // Pin the public byte ceiling, including multibyte input and its exact boundary.
  const oversized = new TextEncoder().encode(
    JSON.stringify(message("tools/list", { padding: "💥".repeat(17_000) })),
  );
  for (const length of [undefined, "1", String(oversized.byteLength)]) {
    let reads = 0;
    let cancelled = false;
    const chunks = [
      oversized.subarray(0, 32_768),
      oversized.subarray(32_768),
      new Uint8Array([32]),
    ];
    const body = new ReadableStream(
      {
        pull(controller) {
          if (reads < chunks.length) controller.enqueue(chunks[reads++]);
          else controller.close();
        },
        cancel() {
          cancelled = true;
        },
      },
      { highWaterMark: 0 },
    );
    const response = await POST(
      request(body, {
        duplex: "half",
        headers: {
          ...headers,
          ...(length === undefined ? {} : { "content-length": length }),
        },
      }),
    );
    assert.equal(response.status, 413, `Content-Length: ${length}`);
    assert.ok(cancelled, "stop reading the rejected request");
    assert.ok(
      reads < chunks.length,
      "reject before buffering the entire stream",
    );
  }

  const boundary = JSON.stringify(message("tools/list")).padEnd(65_536, " ");
  const result = await rpcResponse(await POST(request(boundary)));
  assert.equal(result.result.tools.length, 4);
});

test("limits tool arguments to 16 elements before invoking a tool, while valid calls work", async (t) => {
  let fetches = 0;
  t.mock.method(globalThis, "fetch", async (url) => {
    assert.equal(url, "https://langfuse.com/llms.txt");
    fetches++;
    return new Response("# Langfuse docs");
  });

  for (const args of [
    Object.fromEntries(
      Array.from({ length: 17 }, (_, index) => [`key${index}`, "value"]),
    ),
    { nested: Array.from({ length: 16 }, () => "value") },
  ]) {
    const result = await rpcResponse(
      await POST(
        request(
          JSON.stringify(
            message("tools/call", {
              name: "getLangfuseOverview",
              arguments: args,
            }),
          ),
        ),
      ),
    );
    assert.equal(result.result.isError, true);
    assert.match(result.result.content[0].text, /maximum of 16 elements/);
    assert.equal(fetches, 0);
  }

  const result = await rpcResponse(
    await POST(
      request(
        JSON.stringify(
          message("tools/call", {
            name: "getLangfuseOverview",
            arguments: {},
          }),
        ),
      ),
    ),
  );
  assert.notEqual(result.result.isError, true);
  assert.equal(result.result.content[0].text, "# Langfuse docs");
  assert.equal(fetches, 1);
});
