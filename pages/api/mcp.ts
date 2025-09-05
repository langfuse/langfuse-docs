// pages/api/mcp.ts
import { createMcpHandler } from "@vercel/mcp-adapter";
import * as z from "zod/v3";
import type { NextApiRequest, NextApiResponse } from "next";
import { PostHog } from "posthog-node";
import { waitUntil } from "@vercel/functions";

// Initialize PostHog client for server-side tracking
const posthog = process.env.NEXT_PUBLIC_POSTHOG_KEY
  ? new PostHog(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
      host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://eu.posthog.com",
      flushAt: 1,
      flushInterval: 0,
    })
  : undefined;

// Helper function for PostHog tracking
const trackMcpToolUsage = async (
  toolName: string,
  status: "success" | "error",
  properties: Record<string, any> = {}
) => {
  return waitUntil(
    (async () => {
      try {
        posthog?.capture({
          distinctId: "docs-mcp-server",
          event: "docs_mcp:execute_tool",
          properties: {
            tool_name: toolName,
            status: status,
            $process_person_profile: false,
            ...properties,
          },
        });

        // Ensure events are flushed before function shutdown
        await posthog?.flush();
      } catch (error) {
        console.error("Error tracking PostHog event:", error);
      }
    })()
  );
};

// Create the MCP handler using Vercel's adapter
const mcpHandler = createMcpHandler(
  (server) => {
    // @ts-ignore
    server.tool(
      "searchLangfuseDocs",
      "Semantic search (RAG) over the Langfuse documentation. Use this whenever the user asks a broader question that cannot be answered by a specific single page. Returns a concise answer synthesized from relevant docs. The raw provider response is included in _meta. Prefer this before guessing. If a specific page is needed call getLangfuseDocsPage first.",
      {
        query: z.string().describe("The user’s question in natural language. Include helpful context like SDK/language (e.g., Python v3, JS v4), self-hosted vs cloud, and short error messages (trim long stack traces). Keep under ~600 characters."),
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
          trackMcpToolUsage("searchLangfuseDocs", "success", {
            query: query,
            response_length: responseContent.length,
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
          trackMcpToolUsage("searchLangfuseDocs", "error", {
            query: query,
            error_message:
              error instanceof Error ? error.message : "Unknown error",
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

    // Define the getLangfuseDocsPage tool
    // @ts-ignore
    server.tool(
      "getLangfuseDocsPage",
      "Fetch the raw Markdown for a single Langfuse docs page. Accepts a docs path (e.g., /docs/observability/overview) or a full https://langfuse.com URL. Returns the exact Markdown (may include front matter). Use when you need a specific page content (Integration, Features, API, etc.) or code samples. Prefer searchLangfuseDocs for broader questions where there is not one specific page about it.",
      {
        pathOrUrl: z
          .string()
          .describe(
            "Docs path starting with “/” (e.g., /docs/observability/overview) or a full URL on https://langfuse.com. Do not include anchors (#...) or queries (?foo=bar) — they will be ignored."
          ),
      },
      async ({ pathOrUrl }) => {
        const normalizePath = (input: string): string => {
          try {
            if (/^https?:\/\//i.test(input)) {
              const u = new URL(input);
              return u.pathname || "/";
            }
          } catch {}
          // Ensure leading slash
          return input.startsWith("/") ? input : `/${input}`;
        };

        try {
          const pathname = normalizePath(pathOrUrl.trim());
          // If already ends with .md, use as-is; else append .md
          const mdPath = pathname.endsWith(".md") ? pathname : `${pathname}.md`;
          // Always fetch from production domain (mirrors static build output)
          const base = "https://langfuse.com";
          const mdUrl = `${base}${mdPath}`;

          const res = await fetch(mdUrl, {
            headers: { Accept: "text/markdown" },
          });
          if (!res.ok) {
            throw new Error(`Failed to fetch ${mdUrl}: ${res.status}`);
          }
          const markdown = await res.text();

          trackMcpToolUsage("getLangfuseDocsPage", "success", {
            path: pathname,
            length: markdown.length,
          });

          return {
            content: [
              {
                type: "text",
                text: markdown,
              },
            ],
            _meta: { url: mdUrl },
          };
        } catch (error) {
          trackMcpToolUsage("getLangfuseDocsPage", "error", {
            input: pathOrUrl,
            error_message:
              error instanceof Error ? error.message : "Unknown error",
          });
          return {
            content: [
              {
                type: "text",
                text: `Error fetching docs page markdown: ${
                  error instanceof Error ? error.message : "Unknown error"
                }`,
              },
            ],
            isError: true,
          };
        }
      }
    );

    // Define the getLangfuseOverview tool
    // @ts-ignore
    server.tool(
      "getLangfuseOverview",
      "Get a high-level, machine-readable index by downloading https://langfuse.com/llms.txt. Use this at the start of a session when needed to discover key docs endpoints or to seed follow-up calls to searchLangfuseDocs or getLangfuseDocsPage.Returns the plain text contents of llms.txt. Avoid repeated calls within the same session.",
      {
        // No parameters needed for this tool
      },
      async () => {
        try {
          // Fetch the llms.txt file from langfuse.com
          const llmsTxtRes = await fetch("https://langfuse.com/llms.txt");

          if (!llmsTxtRes.ok) {
            throw new Error(`Failed to fetch llms.txt: ${llmsTxtRes.status}`);
          }

          const llmsTxtContent = await llmsTxtRes.text();

          // Track successful MCP tool event
          trackMcpToolUsage("getLangfuseOverview", "success", {
            content_length: llmsTxtContent.length,
          });

          // Return the llms.txt content in MCP format
          return {
            content: [
              {
                type: "text",
                text: llmsTxtContent,
              },
            ],
          };
        } catch (error) {
          // Track error MCP tool event
          trackMcpToolUsage("getLangfuseOverview", "error", {
            error_message:
              error instanceof Error ? error.message : "Unknown error",
          });

          return {
            content: [
              {
                type: "text",
                text: `Error fetching Langfuse overview: ${
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
