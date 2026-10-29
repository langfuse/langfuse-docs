"use client";

import { useEffect } from "react";
import posthog from "posthog-js";
import {
  docsMarkdownPath,
  GET_LANGFUSE_DOCS_PAGE_DESCRIPTION,
  GET_LANGFUSE_DOCS_PAGE_PATH_DESCRIPTION,
  GET_LANGFUSE_OVERVIEW_DESCRIPTION,
  normalizeDocsPath,
  SEARCH_LANGFUSE_DOCS_DESCRIPTION,
  SEARCH_LANGFUSE_DOCS_QUERY_DESCRIPTION,
} from "@/lib/docs-mcp-tools";

// WebMCP (https://github.com/webmachinelearning/webmcp) lets the page register
// tools that browser agents can call. This mirrors the read-only tools of the
// Docs MCP server (/api/mcp); submitFeedback is left out because an anonymous
// browser surface would invite spam.

type WebMcpTool = {
  name: string;
  title?: string;
  description: string;
  inputSchema?: object;
  execute: (input: Record<string, unknown>) => Promise<unknown>;
  annotations?: { readOnlyHint?: boolean };
};

type ModelContext = {
  registerTool: (
    tool: WebMcpTool,
    options?: { signal?: AbortSignal },
  ) => Promise<void> | void;
  // Earlier drafts unregistered by name instead of by AbortSignal.
  unregisterTool?: (name: string) => void;
};

// The spec exposes `document.modelContext`; earlier drafts used `navigator`.
const getModelContext = (): ModelContext | undefined =>
  (document as any).modelContext ?? (navigator as any).modelContext;

const fetchText = async (url: string, accept: string): Promise<string> => {
  const res = await fetch(url, { headers: { Accept: accept } });
  if (!res.ok) {
    throw new Error(`Failed to fetch ${url}: ${res.status}`);
  }
  return res.text();
};

const tools: WebMcpTool[] = [
  {
    name: "searchLangfuseDocs",
    title: "Search Langfuse docs",
    description: SEARCH_LANGFUSE_DOCS_DESCRIPTION,
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: SEARCH_LANGFUSE_DOCS_QUERY_DESCRIPTION,
        },
      },
      required: ["query"],
    },
    annotations: { readOnlyHint: true },
    execute: async ({ query }) => {
      const res = await fetch(
        `/api/search-docs?query=${encodeURIComponent(String(query ?? ""))}`,
      );
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(body.message || body.error || `HTTP ${res.status}`);
      }
      return body.answer;
    },
  },
  {
    name: "getLangfuseDocsPage",
    title: "Get Langfuse docs page",
    description: GET_LANGFUSE_DOCS_PAGE_DESCRIPTION,
    inputSchema: {
      type: "object",
      properties: {
        pathOrUrl: {
          type: "string",
          description: GET_LANGFUSE_DOCS_PAGE_PATH_DESCRIPTION,
        },
      },
      required: ["pathOrUrl"],
    },
    annotations: { readOnlyHint: true },
    // Only the pathname is kept, so the fetch always stays on this origin.
    execute: async ({ pathOrUrl }) =>
      fetchText(
        docsMarkdownPath(normalizeDocsPath(String(pathOrUrl ?? ""))),
        "text/markdown",
      ),
  },
  {
    name: "getLangfuseOverview",
    title: "Get Langfuse overview",
    description: GET_LANGFUSE_OVERVIEW_DESCRIPTION,
    inputSchema: { type: "object", properties: {} },
    annotations: { readOnlyHint: true },
    execute: async () => fetchText("/llms.txt", "text/plain"),
  },
];

const trackToolCall = (
  toolName: string,
  status: "success" | "error",
  properties: Record<string, unknown> = {},
) => {
  if (!posthog.__loaded) return;
  posthog.capture("docs_webmcp:execute_tool", {
    tool_name: toolName,
    status,
    ...properties,
  });
};

export function WebMcpDocsTools() {
  useEffect(() => {
    const modelContext = getModelContext();
    if (typeof modelContext?.registerTool !== "function") return;

    const controller = new AbortController();
    for (const tool of tools) {
      const trackedTool: WebMcpTool = {
        ...tool,
        execute: async (input) => {
          try {
            const result = await tool.execute(input ?? {});
            trackToolCall(tool.name, "success");
            return result;
          } catch (error) {
            trackToolCall(tool.name, "error", {
              error_message:
                error instanceof Error ? error.message : "Unknown error",
            });
            throw error;
          }
        },
      };
      // registerTool may throw synchronously or reject (e.g. duplicate name).
      const warn = (error: unknown) =>
        console.warn(`WebMCP: failed to register ${tool.name}`, error);
      try {
        Promise.resolve(
          modelContext.registerTool(trackedTool, {
            signal: controller.signal,
          }),
        ).catch(warn);
      } catch (error) {
        warn(error);
      }
    }

    return () => {
      controller.abort();
      for (const tool of tools) {
        try {
          modelContext.unregisterTool?.(tool.name);
        } catch {}
      }
    };
  }, []);

  return null;
}
