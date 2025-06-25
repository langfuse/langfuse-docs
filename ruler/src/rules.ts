import * as fs from 'fs-extra';
import * as path from 'path';
import { glob } from 'glob';
import { ProcessedRule } from './types';

export class RulesProcessor {
  private projectRoot: string;
  private rulerDir: string;

  constructor(projectRoot: string) {
    this.projectRoot = projectRoot;
    this.rulerDir = path.join(projectRoot, '.ruler');
  }

  public async loadRules(): Promise<ProcessedRule[]> {
    const rulesDir = this.rulerDir;
    
    if (!(await fs.pathExists(rulesDir))) {
      throw new Error(`Rules directory not found: ${rulesDir}. Run 'ruler init' first.`);
    }

    // Find all markdown files recursively
    const pattern = path.join(rulesDir, '**', '*.md').replace(/\\/g, '/');
    const markdownFiles = await glob(pattern, { 
      ignore: ['**/node_modules/**'],
      absolute: true 
    });

    if (markdownFiles.length === 0) {
      console.warn('Warning: No markdown rule files found in .ruler directory');
      return [];
    }

    // Sort files alphabetically for consistent ordering
    markdownFiles.sort();

    const processedRules: ProcessedRule[] = [];

    for (const filePath of markdownFiles) {
      try {
        const content = await fs.readFile(filePath, 'utf8');
        const relativePath = path.relative(this.projectRoot, filePath);
        
        processedRules.push({
          source: relativePath,
          content: (content as string).trim(),
        });
      } catch (error) {
        console.warn(`Warning: Failed to read rule file ${filePath}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    return processedRules;
  }

  public concatenateRules(rules: ProcessedRule[]): string {
    if (rules.length === 0) {
      return '';
    }

    const sections = rules.map(rule => {
      const header = `--- Source: ${rule.source} ---`;
      return `${header}\n\n${rule.content}`;
    });

    return sections.join('\n\n');
  }

  public async generateRulesContent(): Promise<string> {
    const rules = await this.loadRules();
    return this.concatenateRules(rules);
  }
}

export async function createDefaultInstructions(rulerDir: string): Promise<void> {
  const instructionsPath = path.join(rulerDir, 'instructions.md');
  
  const defaultInstructions = `# Project Guidelines for AI Assistants

This file contains general guidelines for AI coding assistants working on this project.

## General Principles

- Write clean, readable, and maintainable code
- Follow existing code patterns and conventions in the project
- Add appropriate comments and documentation
- Test your code thoroughly before submitting

## Code Style

- Use consistent indentation (prefer spaces over tabs)
- Follow the language-specific style guides (e.g., PEP 8 for Python, ESLint rules for JavaScript/TypeScript)
- Keep functions and methods focused on a single responsibility
- Use meaningful variable and function names

## Best Practices

- Handle errors gracefully with appropriate error messages
- Validate user input and sanitize data
- Be mindful of security considerations
- Optimize for performance when necessary, but prioritize readability

## Project-Specific Instructions

Add any project-specific guidelines, architectural decisions, or important context here.

---

**Note**: You can organize your rules into multiple .md files for better organization.
Create separate files for different concerns (e.g., coding-style.md, security-guidelines.md, api-conventions.md).
All markdown files in this .ruler/ directory will be automatically concatenated and applied to your AI agents.
`;

  await fs.writeFile(instructionsPath, defaultInstructions);
}