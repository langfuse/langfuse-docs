import { AgentDefinition } from './types';

export const SUPPORTED_AGENTS: Record<string, AgentDefinition> = {
  copilot: {
    name: 'copilot',
    displayName: 'GitHub Copilot',
    outputPath: '.github/copilot-instructions.md',
    supportsMCP: true,
  },
  claude: {
    name: 'claude',
    displayName: 'Claude Code',
    outputPath: 'CLAUDE.md',
    supportsMCP: false,
  },
  codex: {
    name: 'codex',
    displayName: 'OpenAI Codex CLI',
    outputPath: 'AGENTS.md',
    supportsMCP: false,
  },
  cursor: {
    name: 'cursor',
    displayName: 'Cursor',
    outputPath: '.cursor/rules/ruler_cursor_instructions.md',
    supportsMCP: true,
  },
  windsurf: {
    name: 'windsurf',
    displayName: 'Windsurf',
    outputPath: '.windsurf/rules/ruler_windsurf_instructions.md',
    supportsMCP: true,
  },
  cline: {
    name: 'cline',
    displayName: 'Cline',
    outputPath: '.clinerules',
    supportsMCP: false,
  },
  aider: {
    name: 'aider',
    displayName: 'Aider',
    outputPath: 'ruler_aider_instructions.md',
    alternativeOutputPaths: {
      instructions: 'ruler_aider_instructions.md',
      config: '.aider.conf.yml',
    },
    supportsConfig: true,
    supportsMCP: false,
    configFormat: 'yaml',
  },
  firebase: {
    name: 'firebase',
    displayName: 'Firebase Studio',
    outputPath: '.idx/airules.md',
    supportsMCP: false,
  },
  openhands: {
    name: 'openhands',
    displayName: 'Open Hands',
    outputPath: '.openhands/microagents/repo.md',
    alternativeOutputPaths: {
      instructions: '.openhands/microagents/repo.md',
      config: '.openhands/config.toml',
    },
    supportsConfig: true,
    supportsMCP: false,
    configFormat: 'toml',
  },
};

export function getAgentByName(name: string): AgentDefinition | undefined {
  // Case-insensitive substring matching
  const lowerName = name.toLowerCase();
  
  // First try exact match
  if (SUPPORTED_AGENTS[lowerName]) {
    return SUPPORTED_AGENTS[lowerName];
  }
  
  // Then try substring matching
  const matches = Object.values(SUPPORTED_AGENTS).filter(agent => 
    agent.name.toLowerCase().includes(lowerName) || 
    agent.displayName.toLowerCase().includes(lowerName)
  );
  
  return matches.length === 1 ? matches[0] : undefined;
}

export function getAgentsByNames(names: string[]): AgentDefinition[] {
  const agents: AgentDefinition[] = [];
  const notFound: string[] = [];
  
  for (const name of names) {
    const agent = getAgentByName(name);
    if (agent) {
      agents.push(agent);
    } else {
      notFound.push(name);
    }
  }
  
  if (notFound.length > 0) {
    throw new Error(`Unknown agents: ${notFound.join(', ')}`);
  }
  
  return agents;
}

export function getDefaultAgents(): AgentDefinition[] {
  return Object.values(SUPPORTED_AGENTS);
}