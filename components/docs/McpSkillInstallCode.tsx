import { ServerCodeBlock } from "fumadocs-ui/components/codeblock.rsc";
import monokaiProLightRaw from "@/lib/themes/monokai-pro-light.json";
import { MCP_SKILL_INSTALL_SNIPPET } from "@/lib/mcp-skill-install-snippet";

const monokaiProLight = monokaiProLightRaw as unknown as any;

export function McpSkillInstallCode() {
  return (
    <ServerCodeBlock
      lang="bash"
      code={MCP_SKILL_INSTALL_SNIPPET}
      themes={{
        light: monokaiProLight,
        dark: "monokai",
      }}
    />
  );
}
