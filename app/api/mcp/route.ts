import { NextRequest } from "next/server";
import {
  mcpHandler,
  mcpRequestContextFromRequest,
  mcpRequestContextStorage,
  trackMcpInitializeFromRequest,
} from "@/lib/mcp-handler";

export const maxDuration = 60;

const MAX_REQUEST_BODY_BYTES = 64 * 1024;

async function limitRequestBody(request: Request): Promise<Request | Response> {
  const tooLarge = () =>
    Response.json({ error: "Request body exceeds 64 KiB" }, { status: 413 });

  if (Number(request.headers.get("content-length")) > MAX_REQUEST_BODY_BYTES) {
    void request.body?.cancel().catch(() => {});
    return tooLarge();
  }
  if (!request.body) return request;

  const reader = request.body.getReader();
  const body = new Uint8Array(MAX_REQUEST_BODY_BYTES);
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_REQUEST_BODY_BYTES) {
        void reader.cancel().catch(() => {});
        return tooLarge();
      }
      body.set(value, size - value.byteLength);
    }
  } finally {
    reader.releaseLock();
  }

  const headers = new Headers(request.headers);
  headers.set("content-length", String(size));
  headers.delete("transfer-encoding");
  return new Request(request, { headers, body: body.slice(0, size) });
}

export async function GET(request: NextRequest) {
  try {
    return await mcpRequestContextStorage.run(
      mcpRequestContextFromRequest(request),
      () => mcpHandler(request),
    );
  } catch (error) {
    console.error("MCP Handler Error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Bound the bytes before telemetry or the adapter clones/parses the body.
    const boundedRequest = await limitRequestBody(request);
    if (boundedRequest instanceof Response) return boundedRequest;

    trackMcpInitializeFromRequest(boundedRequest);
    return await mcpRequestContextStorage.run(
      mcpRequestContextFromRequest(boundedRequest),
      () => mcpHandler(boundedRequest),
    );
  } catch (error) {
    console.error("MCP Handler Error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
