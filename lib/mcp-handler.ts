import { AsyncLocalStorage } from "node:async_hooks";
import { createMcpHandler } from "@vercel/mcp-adapter";
import * as z from "zod/v3";
import { PostHog } from "posthog-node";
import { waitUntil } from "@vercel/functions";
import { searchLangfuseDocsWithInkeep } from "@/lib/inkeep-search-backend";
import {
  buildDocsMcpFeedbackMessage,
  sendFeedbackToSlack,
} from "@/lib/feedback-slack";

const posthog = process.env.NEXT_PUBLIC_POSTHOG_KEY
  ? new PostHog(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
      host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://eu.posthog.com",
      flushAt: 1,
      flushInterval: 0,
    })
  : undefined;

export type McpRequestContext = {
  userAgent?: string;
  ip?: string;
};

// Populated per-request in app/api/mcp/route.ts so tool-call events can be
// segmented by MCP client (Claude Code, Cursor, ...) instead of a fixed id.
export const mcpRequestContextStorage =
  new AsyncLocalStorage<McpRequestContext>();

export const mcpRequestContextFromRequest = (
  request: Request,
): McpRequestContext => ({
  userAgent: request.headers.get("user-agent") ?? undefined,
  ip: request.headers.get("x-forwarded-for")?.split(",")[0]?.trim(),
});

// The MCP initialize handshake carries clientInfo ({ name, version }) — the
// most reliable identifier of which agent/IDE is talking to the docs server.
export const trackMcpInitializeFromRequest = (request: Request) => {
  if (!posthog || request.method !== "POST") return;
  const clone = request.clone();
  const { userAgent, ip } = mcpRequestContextFromRequest(request);
  waitUntil(
    (async () => {
      try {
        const body = await clone.json();
        const messages = Array.isArray(body) ? body : [body];
        const init = messages.find(
          (message) => message && message.method === "initialize",
        );
        if (!init) return;
        const clientInfo = init.params?.clientInfo;
        posthog.capture({
          distinctId: userAgent || "docs-mcp-server",
          event: "docs_mcp:initialize",
          properties: {
            $process_person_profile: false,
            $raw_user_agent: userAgent,
            $ip: ip,
            client_name: clientInfo?.name,
            client_version: clientInfo?.version,
          },
        });
        await posthog.flush();
      } catch {
        // Body may not be JSON (e.g. SSE re-connects); ignore.
      }
    })(),
  );
};

const trackMcpToolUsage = async (
  toolName: string,
  status: "success" | "error",
  properties: Record<string, unknown> = {},
) => {
  const context = mcpRequestContextStorage.getStore();
  return waitUntil(
    (async () => {
      try {
        posthog?.capture({
          distinctId: context?.userAgent || "docs-mcp-server",
          event: "docs_mcp:execute_tool",
          properties: {
            tool_name: toolName,
            status,
            $process_person_profile: false,
            $raw_user_agent: context?.userAgent,
            $ip: context?.ip,
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

const MCP_SERVER_INSTRUCTIONS = [
  "Use this server for Langfuse documentation, product concepts, SDK/API usage, instrumentation guidance, migration help, and current docs pages.",
  "For project-scoped Langfuse data or actions such as prompts, datasets, scores, comments, metrics, observations, models, or project-specific feedback, prefer the authenticated Langfuse app MCP server when it is available.",
  "When Langfuse agent skills are installed, use them for end-to-end workflows, repo-specific guidance, and agent setup patterns; use this docs server to fetch or verify current documentation.",
  "Inspect the available tools and their schemas dynamically; do not assume a fixed tool list.",
  "If the user wants to provide feedback about Langfuse docs or something is not working well, ask permission and show the exact payload; if they want a reply, include only an email address they explicitly provide in the feedback text; exclude secrets, customer/project data, trace payloads, and unrelated context, then use submitFeedback.",
].join("\n");

export const mcpHandler = createMcpHandler(
  (server) => {
    (server as any).tool(
      "submitFeedback",
      [
        "Submit explicit user-approved feedback to the Langfuse team.",
        "Before calling, ask permission and show the exact payload.",
        "If the user wants a reply, ask them to include their email address in the feedback text; only use an address they explicitly provide and show it in the exact payload preview.",
        "Do not include secrets, credentials, customer/project data, trace payloads, or unrelated context; the only contact detail to include is an explicitly provided reply email.",
      ].join("\n"),
      {
        targetType: z
          .enum(["skill", "mcp-tool", "cli", "docs", "public-api", "other"])
          .describe("Category of the thing the feedback is about."),
        target: z
          .string()
          .trim()
          .min(1)
          .max(200)
          .describe(
            "The specific instance within targetType: the skill name, MCP tool name, CLI command, API endpoint path, or docs page path (e.g. 'queryMetrics', '/docs/mcp'). An identifier, not a sentence.",
          ),
        feedback: z.string().trim().min(1).max(3000),
        goal: z.string().trim().min(1).max(1500).optional(),
        referenceUrl: z
          .string()
          .url()
          .max(2048)
          .refine(
            (url) => ["http:", "https:"].includes(new URL(url).protocol),
            "referenceUrl must use http or https",
          )
          .optional(),
      },
      async (input) => {
        try {
          const id = crypto.randomUUID();
          await sendFeedbackToSlack(
            buildDocsMcpFeedbackMessage({ id, ...input }),
          );

          trackMcpToolUsage("submitFeedback", "success", {
            target_type: input.targetType,
          });
          return {
            content: [
              {
                type: "text",
                text: `Feedback submitted to the Langfuse team. Reference ID: ${id}`,
              },
            ],
          };
        } catch (error) {
          trackMcpToolUsage("submitFeedback", "error", {
            error_message:
              error instanceof Error ? error.message : "Unknown error",
          });
          return {
            content: [
              {
                type: "text",
                text: "Feedback submission failed. Please try again later.",
              },
            ],
            isError: true,
          };
        }
      },
    );

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
      "Fetch the raw Markdown for a single Langfuse docs page. Accepts a docs path (e.g., /docs/observability/overview) or a full https://langfuse.com URL. Returns the exact Markdown (may include front matter). Use when you need a specific page content (Integration, Features, API, etc.) or code samples. Prefer searchLangfuseDocs for broader questions where there is not one specific page about it. Changelog pages (/changelog/...) are historical release notes: use them only to confirm that a feature exists or when it shipped, not as an implementation reference. Their code samples reflect the SDK/API at release time and may be outdated, so for implementation follow the current docs and the API/SDK reference instead.",
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
            // Self-identify so these fetches are distinguishable from external
            // agents in the agent_content_fetch events fired by proxy.ts.
            headers: {
              Accept: "text/markdown",
              "User-Agent": "langfuse-docs-mcp-server",
            },
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
          const llmsTxtRes = await fetch("https://langfuse.com/llms.txt", {
            headers: { "User-Agent": "langfuse-docs-mcp-server" },
          });
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
  { instructions: MCP_SERVER_INSTRUCTIONS },
  { basePath: "/api", maxDuration: 60, verboseLogs: true },
);
