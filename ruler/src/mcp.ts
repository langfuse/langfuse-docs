import * as fs from 'fs-extra';
import * as path from 'path';
import { MCPConfiguration, MCPServer, AgentDefinition } from './types';
import { ConfigManager } from './config';

export class MCPManager {
  private projectRoot: string;
  private configManager: ConfigManager;

  constructor(projectRoot: string, configManager: ConfigManager) {
    this.projectRoot = projectRoot;
    this.configManager = configManager;
  }

  public async applyMCPConfiguration(
    agent: AgentDefinition,
    overwrite: boolean = false
  ): Promise<boolean> {
    if (!agent.supportsMCP) {
      return false;
    }

    const mcpConfig = this.configManager.getAgentMCPConfig(agent.name);
    if (!mcpConfig.enabled) {
      return false;
    }

    const rulerMCPConfig = await this.configManager.loadMCPConfiguration();
    if (!rulerMCPConfig) {
      return false;
    }

    const agentMCPPath = this.getAgentMCPPath(agent);
    if (!agentMCPPath) {
      return false;
    }

    try {
      await this.ensureDirectoryExists(path.dirname(agentMCPPath));
      
      if (overwrite || mcpConfig.merge_strategy === 'overwrite') {
        await this.writeAgentMCPConfig(agentMCPPath, rulerMCPConfig);
      } else {
        await this.mergeAgentMCPConfig(agentMCPPath, rulerMCPConfig);
      }

      return true;
    } catch (error) {
      console.warn(`Warning: Failed to apply MCP configuration for ${agent.displayName}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return false;
    }
  }

  private async writeAgentMCPConfig(configPath: string, mcpConfig: MCPConfiguration): Promise<void> {
    await fs.writeFile(configPath, JSON.stringify(mcpConfig, null, 2));
  }

  private async mergeAgentMCPConfig(configPath: string, rulerMCPConfig: MCPConfiguration): Promise<void> {
    let existingConfig: MCPConfiguration = { mcpServers: {} };

    if (await fs.pathExists(configPath)) {
      try {
        const content = await fs.readFile(configPath, 'utf8') as string;
        existingConfig = JSON.parse(content) as MCPConfiguration;
      } catch (error) {
        console.warn(`Warning: Failed to parse existing MCP config at ${configPath}. Using empty config.`);
      }
    }

    // Merge MCP servers, with ruler config taking precedence
    const mergedConfig: MCPConfiguration = {
      mcpServers: {
        ...existingConfig.mcpServers,
        ...rulerMCPConfig.mcpServers,
      },
    };

    await this.writeAgentMCPConfig(configPath, mergedConfig);
  }

  private getAgentMCPPath(agent: AgentDefinition): string | null {
    switch (agent.name) {
      case 'copilot':
        return path.join(this.projectRoot, '.github', 'copilot-mcp.json');
      case 'cursor':
        return path.join(this.projectRoot, '.cursor', 'mcp.json');
      case 'windsurf':
        return path.join(this.projectRoot, '.windsurf', 'mcp.json');
      default:
        return null;
    }
  }

  private async ensureDirectoryExists(dir: string): Promise<void> {
    await fs.ensureDir(dir);
  }

  public async validateMCPConfiguration(mcpConfig: MCPConfiguration): Promise<string[]> {
    const errors: string[] = [];

    if (!mcpConfig.mcpServers) {
      errors.push('Missing mcpServers property');
      return errors;
    }

    for (const [serverName, serverConfig] of Object.entries(mcpConfig.mcpServers)) {
      if (!serverConfig.command) {
        errors.push(`Server '${serverName}' is missing required 'command' property`);
      }

      if (!serverConfig.args || !Array.isArray(serverConfig.args)) {
        errors.push(`Server '${serverName}' is missing required 'args' array`);
      }

      if (serverConfig.env && typeof serverConfig.env !== 'object') {
        errors.push(`Server '${serverName}' has invalid 'env' property (must be object)`);
      }
    }

    return errors;
  }

  public async listApplicableAgents(agents: AgentDefinition[]): Promise<AgentDefinition[]> {
    const rulerMCPConfig = await this.configManager.loadMCPConfiguration();
    if (!rulerMCPConfig) {
      return [];
    }

    return agents.filter(agent => {
      if (!agent.supportsMCP) {
        return false;
      }

      const mcpConfig = this.configManager.getAgentMCPConfig(agent.name);
      return mcpConfig.enabled;
    });
  }
}