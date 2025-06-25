import * as fs from 'fs-extra';
import * as path from 'path';
import * as yaml from 'yaml';
import * as TOML from '@iarna/toml';
import { ApplyOptions, InitOptions, AgentDefinition, AgentOutput } from './types';
import { ConfigManager, createDefaultConfig, createDefaultMCPConfig } from './config';
import { RulesProcessor, createDefaultInstructions } from './rules';
import { GitignoreManager } from './gitignore';
import { MCPManager } from './mcp';
import { getAgentsByNames, getDefaultAgents } from './agents';

export class Ruler {
  private projectRoot: string;
  private configManager: ConfigManager;
  private rulesProcessor: RulesProcessor;
  private gitignoreManager: GitignoreManager;
  private mcpManager: MCPManager;
  private verbose: boolean = false;

  constructor(projectRoot: string, configPath?: string) {
    this.projectRoot = projectRoot;
    this.configManager = new ConfigManager(projectRoot, configPath);
    this.rulesProcessor = new RulesProcessor(projectRoot);
    this.gitignoreManager = new GitignoreManager(projectRoot);
    this.mcpManager = new MCPManager(projectRoot, this.configManager);
  }

  public async init(options: InitOptions): Promise<void> {
    const rulerDir = path.join(options.projectRoot, '.ruler');
    
    try {
      // Create .ruler directory
      await fs.ensureDir(rulerDir);
      
      // Create default configuration files
      await Promise.all([
        createDefaultConfig(rulerDir),
        createDefaultMCPConfig(rulerDir),
        createDefaultInstructions(rulerDir),
      ]);
      
      console.log(`✅ Ruler initialized successfully in ${rulerDir}`);
      console.log('\nNext steps:');
      console.log('1. Edit .ruler/instructions.md to add your AI agent guidelines');
      console.log('2. Customize .ruler/ruler.toml if needed');
      console.log('3. Run "ruler apply" to distribute rules to your AI agents');
    } catch (error) {
      throw new Error(`Failed to initialize Ruler: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  public async apply(options: ApplyOptions): Promise<void> {
    this.verbose = options.verbose || false;
    
    try {
      this.log('🎯 Starting Ruler application...');
      
      // Load configuration and merge with options
      const config = this.configManager.mergeWithOptions(options);
      this.log(`Configuration loaded: ${JSON.stringify(config, null, 2)}`);
      
      // Get target agents
      const targetAgents = config.agents?.length 
        ? getAgentsByNames(config.agents)
        : getDefaultAgents();
      
      this.log(`Target agents: ${targetAgents.map(a => a.displayName).join(', ')}`);
      
      // Filter enabled agents
      const enabledAgents = targetAgents.filter(agent => 
        this.configManager.isAgentEnabled(agent.name)
      );
      
      if (enabledAgents.length === 0) {
        console.log('⚠️  No enabled agents found. Check your configuration.');
        return;
      }
      
      // Generate rules content
      this.log('📝 Loading and processing rules...');
      const rulesContent = await this.rulesProcessor.generateRulesContent();
      
      if (!rulesContent.trim()) {
        console.log('⚠️  No rules content found. Add markdown files to your .ruler/ directory.');
        return;
      }
      
      // Apply rules to agents
      const outputs = await this.applyRulesToAgents(enabledAgents, rulesContent);
      
      // Apply MCP configuration if enabled
      if (config.mcp) {
        this.log('🔗 Applying MCP configurations...');
        await this.applyMCPConfigurations(enabledAgents, config.mcpOverwrite);
      }
      
      // Update .gitignore if enabled
      if (config.gitignore) {
        this.log('📋 Updating .gitignore...');
        await this.updateGitignore(outputs);
      }
      
      console.log(`✅ Rules applied successfully to ${outputs.length} agent(s)`);
      this.printSummary(outputs);
      
    } catch (error) {
      throw new Error(`Failed to apply rules: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async applyRulesToAgents(
    agents: AgentDefinition[], 
    rulesContent: string
  ): Promise<AgentOutput[]> {
    const outputs: AgentOutput[] = [];
    
    for (const agent of agents) {
      try {
        this.log(`🔧 Processing ${agent.displayName}...`);
        
        const agentConfig = this.configManager.getAgentConfig(agent.name);
        const output = await this.applyRulesToAgent(agent, agentConfig, rulesContent);
        outputs.push(output);
        
        this.log(`✅ Applied rules to ${agent.displayName}`);
      } catch (error) {
        console.warn(`⚠️  Failed to apply rules to ${agent.displayName}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
    
    return outputs;
  }

  private async applyRulesToAgent(
    agent: AgentDefinition,
    agentConfig: any,
    rulesContent: string
  ): Promise<AgentOutput> {
    // Determine output paths
    const instructionsPath = agentConfig.output_path_instructions || 
                           agentConfig.output_path || 
                           agent.outputPath;
    
    const configPath = agentConfig.output_path_config || 
                      agent.alternativeOutputPaths?.config;
    
    const absoluteInstructionsPath = path.resolve(this.projectRoot, instructionsPath);
    
    // Ensure directory exists
    await fs.ensureDir(path.dirname(absoluteInstructionsPath));
    
    // Create backup if file exists
    if (await fs.pathExists(absoluteInstructionsPath)) {
      await fs.copy(absoluteInstructionsPath, `${absoluteInstructionsPath}.bak`);
    }
    
    // Write instructions file
    await fs.writeFile(absoluteInstructionsPath, rulesContent);
    
    const output: AgentOutput = {
      agent,
      config: agentConfig,
      outputPath: absoluteInstructionsPath,
      alternativeOutputPaths: configPath ? {
        config: path.resolve(this.projectRoot, configPath)
      } : undefined,
    };
    
    // Handle agent-specific configuration files
    if (agent.supportsConfig && configPath) {
      await this.createAgentConfigFile(agent, path.resolve(this.projectRoot, configPath));
    }
    
    return output;
  }

  private async createAgentConfigFile(agent: AgentDefinition, configPath: string): Promise<void> {
    await fs.ensureDir(path.dirname(configPath));
    
    // Create backup if file exists
    if (await fs.pathExists(configPath)) {
      await fs.copy(configPath, `${configPath}.bak`);
    }
    
    let configContent: string;
    
    switch (agent.configFormat) {
      case 'yaml':
        configContent = this.generateYamlConfig(agent);
        break;
      case 'toml':
        configContent = this.generateTomlConfig(agent);
        break;
      case 'json':
        configContent = this.generateJsonConfig(agent);
        break;
      default:
        return;
    }
    
    await fs.writeFile(configPath, configContent);
  }

  private generateYamlConfig(agent: AgentDefinition): string {
    switch (agent.name) {
      case 'aider':
        return yaml.stringify({
          // Aider-specific configuration
          'model': 'gpt-4',
          'edit-format': 'diff',
          'show-diffs': true,
        });
      default:
        return yaml.stringify({});
    }
  }

  private generateTomlConfig(agent: AgentDefinition): string {
    switch (agent.name) {
      case 'openhands':
        return TOML.stringify({
          // OpenHands-specific configuration
          runtime: 'eventstream',
          max_iterations: 50,
          max_chars: 10000,
        });
      default:
        return TOML.stringify({});
    }
  }

  private generateJsonConfig(agent: AgentDefinition): string {
    return JSON.stringify({}, null, 2);
  }

  private async applyMCPConfigurations(agents: AgentDefinition[], overwrite: boolean): Promise<void> {
    const mcpApplicableAgents = await this.mcpManager.listApplicableAgents(agents);
    
    if (mcpApplicableAgents.length === 0) {
      this.log('No agents support MCP or MCP is disabled');
      return;
    }
    
    for (const agent of mcpApplicableAgents) {
      const success = await this.mcpManager.applyMCPConfiguration(agent, overwrite);
      if (success) {
        this.log(`✅ Applied MCP configuration to ${agent.displayName}`);
      }
    }
  }

  private async updateGitignore(outputs: AgentOutput[]): Promise<void> {
    const filePaths = outputs.flatMap(output => {
      const paths = [output.outputPath];
      if (output.alternativeOutputPaths?.config) {
        paths.push(output.alternativeOutputPaths.config);
      }
      return paths;
    });
    
    await this.gitignoreManager.updateGitignore(filePaths);
  }

  private printSummary(outputs: AgentOutput[]): void {
    console.log('\n📊 Summary:');
    
    for (const output of outputs) {
      const relativePath = path.relative(this.projectRoot, output.outputPath);
      console.log(`  • ${output.agent.displayName}: ${relativePath}`);
      
      if (output.alternativeOutputPaths?.config) {
        const relativeConfigPath = path.relative(this.projectRoot, output.alternativeOutputPaths.config);
        console.log(`    Config: ${relativeConfigPath}`);
      }
    }
  }

  private log(message: string): void {
    if (this.verbose) {
      console.log(`[DEBUG] ${message}`);
    }
  }
}