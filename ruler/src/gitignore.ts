import * as fs from 'fs-extra';
import * as path from 'path';

const GITIGNORE_START_MARKER = '# START Ruler Generated Files';
const GITIGNORE_END_MARKER = '# END Ruler Generated Files';

export class GitignoreManager {
  private projectRoot: string;
  private gitignorePath: string;

  constructor(projectRoot: string) {
    this.projectRoot = projectRoot;
    this.gitignorePath = path.join(projectRoot, '.gitignore');
  }

  public async updateGitignore(filePaths: string[]): Promise<void> {
    if (filePaths.length === 0) {
      return;
    }

    // Convert paths to relative POSIX format and sort
    const relativePaths = filePaths
      .map(filePath => this.toRelativePosixPath(filePath))
      .filter((path, index, array) => array.indexOf(path) === index) // Remove duplicates
      .sort();

    let gitignoreContent = '';
    
    // Read existing .gitignore if it exists
    if (await fs.pathExists(this.gitignorePath)) {
      gitignoreContent = await fs.readFile(this.gitignorePath, 'utf8') as string;
    }

    const updatedContent = this.updateGitignoreContent(gitignoreContent, relativePaths);
    
    await fs.writeFile(this.gitignorePath, updatedContent);
  }

  private updateGitignoreContent(content: string, paths: string[]): string {
    const lines = content.split('\n');
    const startIndex = lines.findIndex(line => line.trim() === GITIGNORE_START_MARKER);
    const endIndex = lines.findIndex(line => line.trim() === GITIGNORE_END_MARKER);

    // Generate the new ruler section
    const newRulerSection = [
      GITIGNORE_START_MARKER,
      ...paths,
      GITIGNORE_END_MARKER
    ];

    if (startIndex !== -1 && endIndex !== -1) {
      // Replace existing ruler section
      const beforeSection = lines.slice(0, startIndex);
      const afterSection = lines.slice(endIndex + 1);
      
      return [
        ...beforeSection,
        ...newRulerSection,
        ...afterSection
      ].join('\n');
    } else if (startIndex !== -1 || endIndex !== -1) {
      // Malformed section - add warning and append
      console.warn('Warning: Malformed Ruler section in .gitignore. Appending new section.');
      return this.appendRulerSection(content, newRulerSection);
    } else {
      // No existing ruler section - append
      return this.appendRulerSection(content, newRulerSection);
    }
  }

  private appendRulerSection(content: string, rulerSection: string[]): string {
    const trimmedContent = content.trimEnd();
    const separator = trimmedContent ? '\n\n' : '';
    
    return trimmedContent + separator + rulerSection.join('\n') + '\n';
  }

  private toRelativePosixPath(filePath: string): string {
    const relativePath = path.relative(this.projectRoot, filePath);
    return relativePath.split(path.sep).join('/');
  }

  public async removeFromGitignore(): Promise<void> {
    if (!(await fs.pathExists(this.gitignorePath))) {
      return;
    }

    const content = await fs.readFile(this.gitignorePath, 'utf8') as string;
    const lines = content.split('\n');
    
    const startIndex = lines.findIndex((line: string) => line.trim() === GITIGNORE_START_MARKER);
    const endIndex = lines.findIndex((line: string) => line.trim() === GITIGNORE_END_MARKER);

    if (startIndex !== -1 && endIndex !== -1) {
      const beforeSection = lines.slice(0, startIndex);
      const afterSection = lines.slice(endIndex + 1);
      
      // Remove empty lines that might be left
      const cleanedBefore = this.trimTrailingEmptyLines(beforeSection);
      const cleanedAfter = this.trimLeadingEmptyLines(afterSection);
      
      const updatedContent = [...cleanedBefore, ...cleanedAfter].join('\n');
      await fs.writeFile(this.gitignorePath, updatedContent);
    }
  }

  private trimTrailingEmptyLines(lines: string[]): string[] {
    while (lines.length > 0 && lines[lines.length - 1].trim() === '') {
      lines.pop();
    }
    return lines;
  }

  private trimLeadingEmptyLines(lines: string[]): string[] {
    while (lines.length > 0 && lines[0].trim() === '') {
      lines.shift();
    }
    return lines;
  }
}