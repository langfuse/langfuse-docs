#!/usr/bin/env node

import { Command } from 'commander';
import * as path from 'path';
import { Ruler } from './ruler';
import { ApplyOptions, InitOptions } from './types';
import { SUPPORTED_AGENTS } from './agents';

const program = new Command();

program
  .name('ruler')
  .description('Ruler — apply the same rules to all coding agents')
  .version('0.2.3');

// Init command
program
  .command('init')
  .description('Initialize Ruler in the current project')
  .option('--project-root <path>', 'Path to your project root (default: current directory)', process.cwd())
  .action(async (options) => {
    try {
      const initOptions: InitOptions = {
        projectRoot: path.resolve(options.projectRoot),
      };

      const ruler = new Ruler(initOptions.projectRoot);
      await ruler.init(initOptions);
    } catch (error) {
      console.error(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      process.exit(1);
    }
  });

// Apply command
program
  .command('apply')
  .description('Apply rules to AI coding agents')
  .option('--project-root <path>', 'Path to your project root (default: current directory)', process.cwd())
  .option('--agents <agents>', 'Comma-separated list of agent names to target')
  .option('--config <path>', 'Path to a custom ruler.toml configuration file')
  .option('--mcp, --with-mcp', 'Enable applying MCP server configurations (default: true)')
  .option('--no-mcp', 'Disable applying MCP server configurations')
  .option('--mcp-overwrite', 'Overwrite native MCP config entirely instead of merging')
  .option('--gitignore', 'Enable automatic .gitignore updates (default: true)')
  .option('--no-gitignore', 'Disable automatic .gitignore updates')
  .option('-v, --verbose', 'Display detailed output during execution')
  .action(async (options) => {
    try {
      const applyOptions: ApplyOptions = {
        projectRoot: path.resolve(options.projectRoot),
        agents: options.agents ? options.agents.split(',').map((s: string) => s.trim()) : undefined,
        config: options.config ? path.resolve(options.config) : undefined,
        mcp: options.mcp ?? !options.noMcp,
        mcpOverwrite: options.mcpOverwrite || false,
        gitignore: options.gitignore ?? !options.noGitignore,
        verbose: options.verbose || false,
      };

      const ruler = new Ruler(applyOptions.projectRoot, applyOptions.config);
      await ruler.apply(applyOptions);
    } catch (error) {
      console.error(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      process.exit(1);
    }
  });

// List command (show supported agents)
program
  .command('list')
  .description('List all supported AI agents')
  .action(() => {
    console.log('📋 Supported AI Agents:');
    console.log('');
    
    Object.values(SUPPORTED_AGENTS).forEach(agent => {
      const mcpSupport = agent.supportsMCP ? '✅ MCP' : '❌ MCP';
      const configSupport = agent.supportsConfig ? '✅ Config' : '❌ Config';
      
      console.log(`• ${agent.displayName} (${agent.name})`);
      console.log(`  Output: ${agent.outputPath}`);
      console.log(`  Features: ${mcpSupport}, ${configSupport}`);
      
      if (agent.alternativeOutputPaths) {
        if (agent.alternativeOutputPaths.instructions) {
          console.log(`  Instructions: ${agent.alternativeOutputPaths.instructions}`);
        }
        if (agent.alternativeOutputPaths.config) {
          console.log(`  Config: ${agent.alternativeOutputPaths.config}`);
        }
      }
      console.log('');
    });
  });

// Help command improvements
program.on('--help', () => {
  console.log('');
  console.log('Examples:');
  console.log('  $ ruler init                                   # Initialize Ruler in current directory');
  console.log('  $ ruler apply                                  # Apply rules to all configured agents');
  console.log('  $ ruler apply --agents copilot,claude         # Apply to specific agents only');
  console.log('  $ ruler apply --verbose                        # Show detailed output');
  console.log('  $ ruler apply --no-mcp --no-gitignore         # Skip MCP and gitignore updates');
  console.log('  $ ruler list                                   # Show all supported agents');
  console.log('');
  console.log('Configuration:');
  console.log('  Rules are stored in .ruler/*.md files');
  console.log('  Configuration is in .ruler/ruler.toml');
  console.log('  MCP servers are configured in .ruler/mcp.json');
  console.log('');
  console.log('For more information, visit: https://github.com/intellectronica/ruler');
});

// Error handling for unknown commands
program.on('command:*', () => {
  console.error(`❌ Unknown command: ${program.args.join(' ')}`);
  console.log('Use --help to see available commands');
  process.exit(1);
});

// Parse command line arguments
if (process.argv.length <= 2) {
  program.help();
} else {
  program.parse();
}