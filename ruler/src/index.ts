// Main exports
export { Ruler } from './ruler';

// Type exports
export type {
  RulerConfig,
  MCPConfig,
  GitignoreConfig,
  AgentConfig,
  MCPServer,
  MCPConfiguration,
  AgentDefinition,
  ApplyOptions,
  InitOptions,
  ProcessedRule,
  AgentOutput,
} from './types';

// Agent utilities
export {
  SUPPORTED_AGENTS,
  getAgentByName,
  getAgentsByNames,
  getDefaultAgents,
} from './agents';

// Configuration utilities
export {
  ConfigManager,
  createDefaultConfig,
  createDefaultMCPConfig,
} from './config';

// Rules processing
export {
  RulesProcessor,
  createDefaultInstructions,
} from './rules';

// Gitignore management
export { GitignoreManager } from './gitignore';

// MCP management
export { MCPManager } from './mcp';