import assert from "node:assert/strict";
import { after, test } from "node:test";
import { mkdtemp, rm, symlink } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { build } from "esbuild";

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

test("serves current-protocol discovery alongside repeated legacy requests", async () => {
  const discovery = await POST(
    request(
      JSON.stringify(
        message("server/discover", {
          _meta: {
            "io.modelcontextprotocol/protocolVersion": "2026-07-28",
            "io.modelcontextprotocol/clientCapabilities": {},
          },
        }),
      ),
      {
        headers: {
          ...headers,
          "mcp-protocol-version": "2026-07-28",
          "mcp-method": "server/discover",
        },
      },
    ),
  );
  const discoveryText = await discovery.text();
  assert.equal(discovery.status, 200, discoveryText);
  const discovered = JSON.parse(discoveryText);
  assert.ok(discovered.result);
  assert.equal(discovered.error, undefined);

  for (let iteration = 0; iteration < 2; iteration++) {
    const initialized = await rpcResponse(
      await POST(
        request(
          JSON.stringify(
            message("initialize", {
              protocolVersion: "2025-03-26",
              capabilities: {},
              clientInfo: { name: "docs-mcp-test", version: "1.0.0" },
            }),
          ),
        ),
      ),
    );
    assert.equal(initialized.result.protocolVersion, "2025-03-26");
    assert.equal(typeof initialized.result.instructions, "string");
    for (const instruction of [
      "Use this server for Langfuse documentation",
      "prefer the authenticated Langfuse app MCP server",
      "When Langfuse agent skills are installed",
      "Inspect the available tools and their schemas dynamically",
      "ask permission and show the exact payload",
    ]) {
      assert.ok(
        initialized.result.instructions.includes(instruction),
        `initialize instructions must include: ${instruction}`,
      );
    }
    const listed = await rpcResponse(
      await POST(request(JSON.stringify(message("tools/list")))),
    );
    assert.deepEqual(listed.result.tools.map((tool) => tool.name).sort(), [
      "getLangfuseDocsPage",
      "getLangfuseOverview",
      "searchLangfuseDocs",
      "submitFeedback",
    ]);
    const tools = Object.fromEntries(
      listed.result.tools.map((tool) => [tool.name, tool]),
    );
    for (const tool of Object.values(tools)) {
      assert.equal(tool.inputSchema.type, "object", tool.name);
    }
    for (const [name, field] of [
      ["searchLangfuseDocs", "query"],
      ["getLangfuseDocsPage", "pathOrUrl"],
    ]) {
      assert.deepEqual(Object.keys(tools[name].inputSchema.properties), [
        field,
      ]);
      assert.equal(tools[name].inputSchema.properties[field].type, "string");
      assert.deepEqual(tools[name].inputSchema.required, [field]);
    }
    assert.deepEqual(tools.getLangfuseOverview.inputSchema.properties, {});
    assert.deepEqual(tools.getLangfuseOverview.inputSchema.required ?? [], []);
    for (const name of [
      "searchLangfuseDocs",
      "getLangfuseDocsPage",
      "getLangfuseOverview",
    ]) {
      assert.equal(tools[name].annotations.readOnlyHint, true, name);
    }
    assert.notEqual(tools.submitFeedback.annotations?.readOnlyHint, true);

    const feedbackSchema = tools.submitFeedback.inputSchema;
    assert.deepEqual(feedbackSchema.required, [
      "targetType",
      "target",
      "feedback",
    ]);
    assert.deepEqual(Object.keys(feedbackSchema.properties).sort(), [
      "feedback",
      "goal",
      "referenceUrl",
      "target",
      "targetType",
    ]);
    for (const property of Object.values(feedbackSchema.properties)) {
      assert.equal(property.type, "string");
    }
    assert.deepEqual(feedbackSchema.properties.targetType.enum, [
      "skill",
      "mcp-tool",
      "cli",
      "docs",
      "public-api",
      "other",
    ]);
    // Pin the published feedback limits and the optional fields clients see.
    for (const [name, minLength, maxLength] of [
      ["target", 1, 200],
      ["feedback", 1, 3000],
      ["goal", 1, 1500],
      ["referenceUrl", undefined, 2048],
    ]) {
      assert.equal(feedbackSchema.properties[name].minLength, minLength, name);
      assert.equal(feedbackSchema.properties[name].maxLength, maxLength, name);
    }
    assert.equal(feedbackSchema.properties.referenceUrl.format, "uri");
  }
});
