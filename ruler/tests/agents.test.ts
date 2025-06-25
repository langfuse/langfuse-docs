import { 
  SUPPORTED_AGENTS, 
  getAgentByName, 
  getAgentsByNames, 
  getDefaultAgents 
} from '../src/agents';

describe('Agent functions', () => {
  describe('getAgentByName', () => {
    it('should return agent for exact name match', () => {
      const agent = getAgentByName('copilot');
      expect(agent).toBeDefined();
      expect(agent?.name).toBe('copilot');
      expect(agent?.displayName).toBe('GitHub Copilot');
    });

    it('should return agent for case-insensitive match', () => {
      const agent = getAgentByName('COPILOT');
      expect(agent).toBeDefined();
      expect(agent?.name).toBe('copilot');
    });

    it('should return agent for substring match', () => {
      const agent = getAgentByName('copi');
      expect(agent).toBeDefined();
      expect(agent?.name).toBe('copilot');
    });

    it('should return undefined for unknown agent', () => {
      const agent = getAgentByName('unknown-agent');
      expect(agent).toBeUndefined();
    });

    it('should return undefined for ambiguous substring', () => {
      // This should return undefined because it could match multiple agents
      const agent = getAgentByName('c');
      expect(agent).toBeUndefined();
    });
  });

  describe('getAgentsByNames', () => {
    it('should return multiple agents for valid names', () => {
      const agents = getAgentsByNames(['copilot', 'claude']);
      expect(agents).toHaveLength(2);
      expect(agents[0].name).toBe('copilot');
      expect(agents[1].name).toBe('claude');
    });

    it('should throw error for unknown agent', () => {
      expect(() => {
        getAgentsByNames(['copilot', 'unknown-agent']);
      }).toThrow('Unknown agents: unknown-agent');
    });

    it('should return empty array for empty input', () => {
      const agents = getAgentsByNames([]);
      expect(agents).toHaveLength(0);
    });
  });

  describe('getDefaultAgents', () => {
    it('should return all supported agents', () => {
      const agents = getDefaultAgents();
      const supportedAgentNames = Object.keys(SUPPORTED_AGENTS);
      
      expect(agents).toHaveLength(supportedAgentNames.length);
      expect(agents.map(a => a.name)).toEqual(
        expect.arrayContaining(supportedAgentNames)
      );
    });
  });

  describe('SUPPORTED_AGENTS', () => {
    it('should have expected agents', () => {
      const expectedAgents = [
        'copilot',
        'claude', 
        'cursor',
        'windsurf',
        'cline',
        'aider',
        'firebase',
        'openhands',
        'codex'
      ];

      expectedAgents.forEach(agentName => {
        expect(SUPPORTED_AGENTS[agentName]).toBeDefined();
        expect(SUPPORTED_AGENTS[agentName].name).toBe(agentName);
      });
    });

    it('should have valid agent definitions', () => {
      Object.values(SUPPORTED_AGENTS).forEach(agent => {
        expect(agent.name).toBeTruthy();
        expect(agent.displayName).toBeTruthy();
        expect(agent.outputPath).toBeTruthy();
        expect(typeof agent.supportsMCP).toBe('boolean');
        
        if (agent.supportsConfig) {
          expect(agent.configFormat).toBeDefined();
          expect(['yaml', 'json', 'toml']).toContain(agent.configFormat);
        }
      });
    });
  });
});