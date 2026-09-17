/**
 * Used by IntegrationIndex for additional links. Content lives under content/integrations/.
 * Empty = use only filesystem pages.
 */
type MetaEntry = { href?: string; title?: string; logo?: string };
export const nativeIntegrationsMeta: Record<string, MetaEntry> = {
  "python-sdk": {
    href: "/docs/observability/sdk/overview",
    title: "Python SDK",
  },
  "js-ts-sdk": {
    href: "/docs/observability/sdk/overview",
    title: "JS/TS SDK",
  },
  "mcp-server": {
    href: "/docs/api-and-data-platform/features/mcp-server",
    title: "MCP Server",
  },
  cli: {
    href: "/docs/api-and-data-platform/features/cli",
    title: "CLI",
  },
  api: {
    href: "/docs/api-and-data-platform/features/public-api",
    title: "API",
  },
};
