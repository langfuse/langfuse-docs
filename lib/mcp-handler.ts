import { createMcpHandler } from "@vercel/mcp-adapter";
import * as z from "zod/v3";
import { PostHog } from "posthog-node";
import { waitUntil } from "@vercel/functions";
import { searchLangfuseDocsWithInkeep } from "@/lib/inkeep-search-backend";

const posthog = process.env.NEXT_PUBLIC_POSTHOG_KEY
  ? new PostHog(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
      host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://eu.posthog.com",
      flushAt: 1,
      flushInterval: 0,
    })
  : undefined;

const trackMcpToolUsage = async (
  toolName: string,
  status: "success" | "error",
  properties: Record<string, unknown> = {},
) => {
  return waitUntil(
    (async () => {
      try {
        posthog?.capture({
          distinctId: "docs-mcp-server",
          event: "docs_mcp:execute_tool",
          properties: {
            tool_name: toolName,
            status,
            $process_person_profile: false,
            ...properties,
          },
        });
        await posthog?.flush();
      } catch (error) {
        console.error("Error tracking PostHog event:", error);
      }
    })(),
  );
};

export const mcpHandler = createMcpHandler(
  (server) => {
    (server as any).tool(
      "searchLangfuseDocs",
      "Semantic search (RAG) over the Langfuse documentation. Use this whenever the user asks a broader question that cannot be answered by a specific single page. Returns a concise answer synthesized from relevant docs. The raw provider response is included in _meta. Prefer this before guessing. If a specific page is needed call getLangfuseDocsPage first.",
      {
        query: z
          .string()
          .describe(
            "The user's question in natural language. Include helpful context like SDK/language (e.g., Python v3, JS v4), self-hosted vs cloud, and short error messages (trim long stack traces). Keep under ~600 characters.",
          ),
      },
      async ({ query }) => {
        try {
          const inkeepResult = await searchLangfuseDocsWithInkeep(query);
          trackMcpToolUsage("searchLangfuseDocs", "success", {
            query,
            response_length: inkeepResult.answer.length,
          });
          return {
            content: [{ type: "text", text: inkeepResult.answer }],
            _meta: inkeepResult.metadata,
          };
        } catch (error) {
          trackMcpToolUsage("searchLangfuseDocs", "error", {
            query,
            error_message:
              error instanceof Error ? error.message : "Unknown error",
          });
          return {
            content: [
              {
                type: "text",
                text: `Error searching documentation: ${error instanceof Error ? error.message : "Unknown error"}`,
              },
            ],
            isError: true,
          };
        }
      },
    );

    (server as any).tool(
      "getLangfuseDocsPage",
      "Fetch the raw Markdown for a single Langfuse docs page. Accepts a docs path (e.g., /docs/observability/overview) or a full https://langfuse.com URL. Returns the exact Markdown (may include front matter). Use when you need a specific page content (Integration, Features, API, etc.) or code samples. Prefer searchLangfuseDocs for broader questions where there is not one specific page about it.",
      {
        pathOrUrl: z
          .string()
          .describe(
            'Docs path starting with "/" (e.g., /docs/observability/overview) or a full URL on https://langfuse.com. Do not include anchors (#...) or queries (?foo=bar) — they will be ignored.',
          ),
      },
      async ({ pathOrUrl }: { pathOrUrl: string }) => {
        const normalizePath = (input: string): string => {
          try {
            if (/^https?:\/\//i.test(input)) {
              const u = new URL(input);
              return u.pathname || "/";
            }
          } catch {}
          return input.startsWith("/") ? input : `/${input}`;
        };

        try {
          const pathname = normalizePath(pathOrUrl.trim());
          const mdPath = pathname.endsWith(".md") ? pathname : `${pathname}.md`;
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
            content: [{ type: "text", text: markdown }],
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
                text: `Error fetching docs page markdown: ${error instanceof Error ? error.message : "Unknown error"}`,
              },
            ],
            isError: true,
          };
        }
      },
    );

    (server as any).tool(
      "getLangfuseOverview",
      "Get a high-level, machine-readable index by downloading https://langfuse.com/llms.txt. Use this at the start of a session when needed to discover key docs endpoints or to seed follow-up calls to searchLangfuseDocs or getLangfuseDocsPage. Returns the plain text contents of llms.txt. Avoid repeated calls within the same session.",
      {},
      async () => {
        try {
          const llmsTxtRes = await fetch("https://langfuse.com/llms.txt");
          if (!llmsTxtRes.ok) {
            throw new Error(`Failed to fetch llms.txt: ${llmsTxtRes.status}`);
          }
          const llmsTxtContent = await llmsTxtRes.text();
          trackMcpToolUsage("getLangfuseOverview", "success", {
            content_length: llmsTxtContent.length,
          });
          return {
            content: [{ type: "text", text: llmsTxtContent }],
          };
        } catch (error) {
          trackMcpToolUsage("getLangfuseOverview", "error", {
            error_message:
              error instanceof Error ? error.message : "Unknown error",
          });
          return {
            content: [
              {
                type: "text",
                text: `Error fetching Langfuse overview: ${error instanceof Error ? error.message : "Unknown error"}`,
              },
            ],
            isError: true,
          };
        }
      },
    );
  },
  {},
  { basePath: "/api", maxDuration: 60, verboseLogs: true },
);
