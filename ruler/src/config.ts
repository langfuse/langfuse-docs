import * as fs from 'fs-extra';
import * as path from 'path';
import * as TOML from '@iarna/toml';
import { RulerConfig, MCPConfiguration, ApplyOptions } from './types';
import { getDefaultAgents } from './agents';

export class ConfigManager {
  private projectRoot: string;
  private configPath: string;
  private config: RulerConfig;

  constructor(projectRoot: string, configPath?: string) {
    this.projectRoot = projectRoot;
    this.configPath = configPath || path.join(projectRoot, '.ruler', 'ruler.toml');
    this.config = this.loadConfig();
  }

  private loadConfig(): RulerConfig {
    try {
      if (fs.existsSync(this.configPath)) {
        const content = fs.readFileSync(this.configPath, 'utf8');
        return TOML.parse(content) as RulerConfig;
      }
    } catch (error) {
      throw new Error(`Failed to parse configuration file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
    
    // Return default configuration
    return {
      default_agents: ['copilot', 'claude', 'aider'],
      mcp: {
        enabled: true,
        merge_strategy: 'merge',
      },
      gitignore: {
        enabled: true,
      },
      agents: {},
    };
  }

  public getConfig(): RulerConfig {
    return this.config;
  }

  public getAgentConfig(agentName: string) {
    return this.config.agents?.[agentName] || {};
  }

  public isAgentEnabled(agentName: string): boolean {
    const agentConfig = this.getAgentConfig(agentName);
    return agentConfig.enabled !== false; // Default to enabled
  }

  public getDefaultAgents(): string[] {
    return this.config.default_agents || ['copilot', 'claude', 'aider'];
  }

  public isMCPEnabled(): boolean {
    return this.config.mcp?.enabled !== false; // Default to enabled
  }

  public getMCPMergeStrategy(): 'merge' | 'overwrite' {
    return this.config.mcp?.merge_strategy || 'merge';
  }

  public isGitignoreEnabled(): boolean {
    return this.config.gitignore?.enabled !== false; // Default to enabled
  }

  public getAgentMCPConfig(agentName: string) {
    const agentConfig = this.getAgentConfig(agentName);
    return {
      enabled: agentConfig.mcp?.enabled ?? this.isMCPEnabled(),
      merge_strategy: agentConfig.mcp?.merge_strategy ?? this.getMCPMergeStrategy(),
    };
  }

  public async loadMCPConfiguration(): Promise<MCPConfiguration | null> {
    const mcpPath = path.join(this.projectRoot, '.ruler', 'mcp.json');
    
    try {
      if (await fs.pathExists(mcpPath)) {
        const content = await fs.readFile(mcpPath, 'utf8');
        return JSON.parse(content) as MCPConfiguration;
      }
    } catch (error) {
      console.warn(`Warning: Failed to load MCP configuration: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
    
    return null;
  }

  public mergeWithOptions(options: ApplyOptions): {
    agents: string[];
    mcp: boolean;
    mcpOverwrite: boolean;
    gitignore: boolean;
  } {
    const agents = options.agents || this.getDefaultAgents();
    const mcp = options.mcp ?? this.isMCPEnabled();
    const mcpOverwrite = options.mcpOverwrite ?? false;
    const gitignore = options.gitignore ?? this.isGitignoreEnabled();

    return { agents, mcp, mcpOverwrite, gitignore };
  }
}

export async function createDefaultConfig(rulerDir: string): Promise<void> {
  const configPath = path.join(rulerDir, 'ruler.toml');
  
  const defaultConfig = `# Default agents to run when --agents is not specified
# Uses case-insensitive substring matching
default_agents = ["copilot", "claude", "aider"]

# --- Global MCP Server Configuration ---
[mcp]
# Enable/disable MCP propagation globally (default: true)
enabled = true
# Global merge strategy: 'merge' or 'overwrite' (default: 'merge')
merge_strategy = "merge"

# --- Global .gitignore Configuration ---
[gitignore]
# Enable/disable automatic .gitignore updates (default: true)
enabled = true

# --- Agent-Specific Configurations ---
[agents.copilot]
enabled = true
output_path = ".github/copilot-instructions.md"

[agents.claude]
enabled = true
output_path = "CLAUDE.md"

[agents.aider]
enabled = true
output_path_instructions = "ruler_aider_instructions.md"
output_path_config = ".aider.conf.yml"

[agents.firebase]
enabled = true
output_path = ".idx/airules.md"

# Agent-specific MCP configuration
[agents.cursor.mcp]
enabled = true
merge_strategy = "merge"

# Disable specific agents
# [agents.windsurf]
# enabled = false
`;

  await fs.writeFile(configPath, defaultConfig);
}

export async function createDefaultMCPConfig(rulerDir: string): Promise<void> {
  const mcpPath = path.join(rulerDir, 'mcp.json');
  
  const defaultMCPConfig = {
    mcpServers: {
      filesystem: {
        command: "npx",
        args: [
          "-y",
          "@modelcontextprotocol/server-filesystem",
          "/path/to/project"
        ]
      },
      git: {
        command: "npx",
        args: ["-y", "@modelcontextprotocol/server-git", "--repository", "."]
      }
    }
  };

  await fs.writeFile(mcpPath, JSON.stringify(defaultMCPConfig, null, 2));
}