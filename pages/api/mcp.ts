// pages/api/mcp.ts
import { createMcpHandler } from "@vercel/mcp-adapter";
import { z } from "zod";
import type { NextApiRequest, NextApiResponse } from "next";
import { PostHog } from "posthog-node";

// Initialize PostHog client for server-side tracking
const posthog = new PostHog(
  process.env.POSTHOG_API_KEY || process.env.NEXT_PUBLIC_POSTHOG_KEY || "",
  {
    host: process.env.POSTHOG_HOST || process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://eu.posthog.com",
  }
);

// Create the MCP handler using Vercel's adapter
const mcpHandler = createMcpHandler(
  (server) => {
    // Define the searchDocs tool
    server.tool(
      "searchLangfuseDocs",
      "Search Langfuse documentation for relevant information. Whenever there are questions about Langfuse, use this tool to get relevant documentation chunks.",
      {
        query: z.string().describe("Natural-language question from the user"),
      },
      async ({ query }) => {
        // Track MCP tool usage
        posthog.capture({
          distinctId: "mcp-server",
          event: "MCP",
          properties: {
            tool_name: "searchLangfuseDocs",
            query: query,
            timestamp: new Date().toISOString(),
          },
        });

        try {
          // Call Inkeep RAG API
          const inkeepRes = await fetch(
            "https://api.inkeep.com/v1/chat/completions",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.INKEEP_BACKEND_API_KEY}`,
              },
              body: JSON.stringify({
                model: "inkeep-rag",
                messages: [{ role: "user", content: query }],
                response_format: { type: "json_object" },
              }),
            }
          );

          if (!inkeepRes.ok) {
            throw new Error(`Inkeep API returned ${inkeepRes.status}`);
          }

          const result = await inkeepRes.json();

          // Extract the actual content from the Inkeep response
          const responseContent =
            result.choices?.[0]?.message?.content || "No results found";

          // Track successful tool execution
          posthog.capture({
            distinctId: "mcp-server",
            event: "MCP",
            properties: {
              tool_name: "searchLangfuseDocs",
              query: query,
              status: "success",
              response_length: responseContent.length,
              timestamp: new Date().toISOString(),
            },
          });

          // Return the actual documentation content in MCP format
          return {
            content: [
              {
                type: "text",
                text: responseContent,
              },
            ],
            // Include the full Inkeep response as structured data for debugging
            _meta: result,
          };
        } catch (error) {
          // Track error in tool execution
          posthog.capture({
            distinctId: "mcp-server",
            event: "MCP",
            properties: {
              tool_name: "searchLangfuseDocs",
              query: query,
              status: "error",
              error_message: error instanceof Error ? error.message : "Unknown error",
              timestamp: new Date().toISOString(),
            },
          });

          return {
            content: [
              {
                type: "text",
                text: `Error searching documentation: ${
                  error instanceof Error ? error.message : "Unknown error"
                }`,
              },
            ],
            isError: true,
          };
        }
      }
    );
  },
  {
    // Server options (empty for now)
  },
  {
    // Adapter config
    basePath: "/api",
    maxDuration: 60,
    verboseLogs: true,
  }
);

// Wrapper function to adapt App Router handler to Pages Router
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Track MCP request
  posthog.capture({
    distinctId: "mcp-server",
    event: "MCP",
    properties: {
      method: req.method,
      url: req.url,
      headers: req.headers,
      body: req.body,
      timestamp: new Date().toISOString(),
      user_agent: req.headers["user-agent"],
    },
  });

  // Create a Request object from NextApiRequest
  const url = new URL(req.url || "", `http://${req.headers.host}`);
  const requestInit: RequestInit = {
    method: req.method,
    headers: req.headers as HeadersInit,
    body:
      req.method === "GET" || req.method === "HEAD"
        ? null
        : JSON.stringify(req.body),
  };

  const request = new Request(url.toString(), requestInit);

  // Call the MCP handler (it handles all methods internally)
  let response: Response;

  try {
    response = await mcpHandler(request);
    
    // Track successful MCP response
    posthog.capture({
      distinctId: "mcp-server",
      event: "MCP",
      properties: {
        method: req.method,
        url: req.url,
        status: response.status,
        response_status: "success",
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("MCP Handler Error:", error);
    
    // Track MCP error
    posthog.capture({
      distinctId: "mcp-server",
      event: "MCP",
      properties: {
        method: req.method,
        url: req.url,
        status: "error",
        error_message: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
    });
    
    res.status(500).json({ error: "Internal server error" });
    return;
  }

  // Convert Response back to NextApiResponse
  const body = await response.text();

  // Set headers
  response.headers.forEach((value, key) => {
    res.setHeader(key, value);
  });

  // Set status and send response
  res.status(response.status);

  if (body) {
    // Try to parse as JSON, otherwise send as text
    try {
      const jsonBody = JSON.parse(body);
      res.json(jsonBody);
    } catch {
      res.send(body);
    }
  } else {
    res.end();
  }
}

/* TypeScript checks:
   tsc --noEmit                     (Next.js already runs this)
   All exports are default for Next.js API Routes.                  :contentReference[oaicite:4]{index=4}
*/
