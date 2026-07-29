/*
  Agent-facing footer appended to every generated Markdown page in
  public/md-src/**.

  Rationale: agents reach our Markdown through several paths (the ".md" URL
  suffix, `Accept: text/markdown` content negotiation, or the docs MCP
  `getLangfuseDocsPage` tool) and frequently land on a single page with no way
  to discover the rest of our agent surface. Without this footer, an agent that
  cannot answer its question from the current page has to guess. The footer
  makes the docs self-describing: it names the Markdown convention, the search
  endpoint, the page index, the MCP server, and the tools we want agents to use
  before writing Langfuse code.

  Keep this SHORT. It is appended to ~1k pages and consumes context on every
  single page fetch. Add a line only if it changes what an agent would do.

  The heading is an H2 on purpose: `scripts/check-h1-headings.js` walks the
  whole repo (including public/md-src after a local build) and fails on a second
  `# ` heading in a file that already has one.
*/

const AGENT_FOOTER_MARKER = "<!-- agent-instructions -->";

/**
 * Build the agent instructions footer for a single page.
 * @param {string} pageUrl absolute URL of this page's Markdown representation,
 *   e.g. "https://langfuse.com/docs/observability/get-started.md"
 * @returns {string}
 */
function buildAgentInstructionsFooter(pageUrl) {
  return [
    AGENT_FOOTER_MARKER,
    "",
    "---",
    "",
    "## Agent Instructions",
    "",
    "This page is part of the [Langfuse](https://langfuse.com) documentation, published as plain Markdown for AI agents. Every page is available as Markdown by appending `.md` to its URL, or by sending an `Accept: text/markdown` header. This page: `" +
      pageUrl +
      "`.",
    "",
    "### Querying these docs",
    "",
    "If the answer is not on this page, query the documentation instead of guessing:",
    "",
    "- **Semantic search** across all Langfuse docs, returning an answer with the relevant pages and excerpts. Ask a specific, self-contained question:",
    "",
    "  ```bash",
    '  curl -sG "https://langfuse.com/api/search-docs" --data-urlencode "query=How do I trace a LangGraph agent?"',
    "  ```",
    "",
    "- **Index of every page**: <https://langfuse.com/llms.txt>, with per-section indexes [llms-docs.txt](https://langfuse.com/llms-docs.txt), [llms-integrations.txt](https://langfuse.com/llms-integrations.txt), and [llms-self-hosting.txt](https://langfuse.com/llms-self-hosting.txt).",
    "- **Docs MCP server**: `https://langfuse.com/api/mcp` (`streamableHttp`, no authentication). Use it for search plus page, GitHub issue, and discussion lookups. See [Docs MCP Server](https://langfuse.com/docs/docs-mcp).",
    "",
    "### Before writing Langfuse code",
    "",
    "- **Install the [Langfuse Agent Skill](https://langfuse.com/docs/api-and-data-platform/features/agent-skill).** It encodes Langfuse's own best practices for instrumentation, prompt management, and evaluation, and materially improves results.",
    "- **Read [What does a good trace look like?](https://langfuse.com/docs/observability/best-practices.md)** before instrumenting an application.",
    "- **Verify endpoints, parameters, and response fields** against the [API reference](https://api.reference.langfuse.com) instead of inferring them from code examples.",
    "- **Use the [Langfuse CLI](https://langfuse.com/docs/api-and-data-platform/features/cli)** (`npx langfuse-cli api <resource> <action>`) to read or write traces, prompts, datasets, and scores from the terminal.",
    "- **Do not hardcode a region.** `https://cloud.langfuse.com` is EU; US is `https://us.cloud.langfuse.com`, and self-hosted deployments use their own URL. Read the host from `LANGFUSE_BASE_URL`.",
    "",
    "Found an error in these docs? Please open an issue at <https://github.com/langfuse/langfuse-docs/issues>.",
    "",
  ].join("\n");
}

module.exports = { buildAgentInstructionsFooter, AGENT_FOOTER_MARKER };
