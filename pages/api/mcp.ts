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
    flushAt:1,
    flushInterval: 0
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

          // Track successful MCP tool event
          posthog.capture({
            distinctId: "docs-mcp-server",
            event: "docs_mcp:execute_tool",
            properties: {
              tool_name: "searchLangfuseDocs",
              query: query,
              status: "success",
              response_length: responseContent.length,
              $process_person_profile: false,
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
          // Track error MCP tool event
          posthog.capture({
            distinctId: "docs-mcp-server",
            event: "docs_mcp:execute_tool",
            properties: {
              tool_name: "searchLangfuseDocs",
              query: query,
              status: "error",
              error_message: error instanceof Error ? error.message : "Unknown error",
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
  } catch (error) {
    console.error("MCP Handler Error:", error);
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
