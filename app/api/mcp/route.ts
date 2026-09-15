import { NextRequest } from "next/server";
import {
  mcpHandler,
  mcpRequestContextFromRequest,
  mcpRequestContextStorage,
  trackMcpInitializeFromRequest,
} from "@/lib/mcp-handler";

export const maxDuration = 60;

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
    trackMcpInitializeFromRequest(request);
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
