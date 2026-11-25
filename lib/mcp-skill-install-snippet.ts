const LANGFUSE_CLOUD_EU_HOST = ["https://", "cloud.langfuse.com"].join("");

export const MCP_SKILL_INSTALL_SNIPPET = [
  'export LANGFUSE_PUBLIC_KEY="pk-lf-..."',
  'export LANGFUSE_SECRET_KEY="sk-lf-..."',
  "# EU region",
  `export LANGFUSE_HOST="${LANGFUSE_CLOUD_EU_HOST}"`,
  "# US region: https://us.cloud.langfuse.com",
  "# Japan region: https://jp.cloud.langfuse.com",
  "# HIPAA region: https://hipaa.cloud.langfuse.com",
  "# Self-hosted: your deployment URL",
  "",
  'claude mcp add --transport http langfuse "$LANGFUSE_HOST/api/public/mcp" \\',
  '  --header "Authorization: Basic $(printf \'%s:%s\' "$LANGFUSE_PUBLIC_KEY" "$LANGFUSE_SECRET_KEY" | base64 | tr -d \'\\n\')"',
].join("\n");
