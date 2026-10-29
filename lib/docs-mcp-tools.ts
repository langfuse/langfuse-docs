// Tool copy shared by the Docs MCP server (lib/mcp-handler.ts) and the WebMCP
// tools registered in the browser (components/WebMcpDocsTools.tsx), so both
// surfaces describe the same tools the same way. Keep this module free of
// server-only imports: it is bundled into the client.

export const SEARCH_LANGFUSE_DOCS_DESCRIPTION =
  "Semantic search (RAG) over the Langfuse documentation. Use this whenever the user asks a broader question that cannot be answered by a specific single page. Returns a concise answer synthesized from relevant docs. Prefer this before guessing. If a specific page is needed call getLangfuseDocsPage first.";

export const SEARCH_LANGFUSE_DOCS_QUERY_DESCRIPTION =
  "The user's question in natural language. Include helpful context like SDK/language (e.g., Python v3, JS v4), self-hosted vs cloud, and short error messages (trim long stack traces). Keep under ~600 characters.";

export const GET_LANGFUSE_DOCS_PAGE_DESCRIPTION =
  "Fetch the raw Markdown for a single Langfuse docs page. Accepts a docs path (e.g., /docs/observability/overview) or a full https://langfuse.com URL. Returns the exact Markdown (may include front matter). Use when you need a specific page content (Integration, Features, API, etc.) or code samples. Prefer searchLangfuseDocs for broader questions where there is not one specific page about it. Changelog pages (/changelog/...) are historical release notes: use them only to confirm that a feature exists or when it shipped, not as an implementation reference. Their code samples reflect the SDK/API at release time and may be outdated, so for implementation follow the current docs and the API/SDK reference instead.";

export const GET_LANGFUSE_DOCS_PAGE_PATH_DESCRIPTION =
  'Docs path starting with "/" (e.g., /docs/observability/overview) or a full URL on https://langfuse.com. Do not include anchors (#...) or queries (?foo=bar) — they will be ignored.';

export const GET_LANGFUSE_OVERVIEW_DESCRIPTION =
  "Get a high-level, machine-readable index by downloading https://langfuse.com/llms.txt. Use this at the start of a session when needed to discover key docs endpoints or to seed follow-up calls to searchLangfuseDocs or getLangfuseDocsPage. Returns the plain text contents of llms.txt. Avoid repeated calls within the same session.";

// Reduces a docs path or full URL to its pathname, dropping the host, query
// and anchor (e.g. https://langfuse.com/docs/foo?x=1#y -> /docs/foo).
export const normalizeDocsPath = (pathOrUrl: string): string => {
  const input = pathOrUrl.trim();
  try {
    return new URL(input, "https://langfuse.com").pathname || "/";
  } catch {
    return input.startsWith("/") ? input : `/${input}`;
  }
};

export const docsMarkdownPath = (pathname: string): string =>
  pathname.endsWith(".md") ? pathname : `${pathname}.md`;
