export interface RulerConfig {
  default_agents?: string[];
  mcp?: MCPConfig;
  gitignore?: GitignoreConfig;
  agents?: Record<string, AgentConfig>;
}

export interface MCPConfig {
  enabled?: boolean;
  merge_strategy?: 'merge' | 'overwrite';
}

export interface GitignoreConfig {
  enabled?: boolean;
}

export interface AgentConfig {
  enabled?: boolean;
  output_path?: string;
  output_path_instructions?: string;
  output_path_config?: string;
  mcp?: MCPConfig;
}

export interface MCPServer {
  command: string;
  args: string[];
  env?: Record<string, string>;
}

export interface MCPConfiguration {
  mcpServers: Record<string, MCPServer>;
}

export interface AgentDefinition {
  name: string;
  displayName: string;
  outputPath: string;
  alternativeOutputPaths?: {
    instructions?: string;
    config?: string;
  };
  supportsConfig?: boolean;
  supportsMCP?: boolean;
  configFormat?: 'yaml' | 'json' | 'toml';
}

export interface ApplyOptions {
  projectRoot: string;
  agents?: string[];
  config?: string;
  mcp?: boolean;
  mcpOverwrite?: boolean;
  gitignore?: boolean;
  verbose?: boolean;
}

export interface InitOptions {
  projectRoot: string;
}

export interface ProcessedRule {
  source: string;
  content: string;
}

export interface AgentOutput {
  agent: AgentDefinition;
  config: AgentConfig;
  outputPath: string;
  alternativeOutputPaths?: {
    instructions?: string;
    config?: string;
  };
}