const fs = require('fs').promises;
const path = require('path');
const process = require('process');

const EXCLUDE_DIRS = new Set(['node_modules', '.git', '.next', 'dist']);

async function findMarkdownFiles(dir) {
    let results = [];
    try {
        const dirents = await fs.readdir(dir, { withFileTypes: true });
        for (const dirent of dirents) {
            const fullPath = path.join(dir, dirent.name);
            if (dirent.isDirectory() && !EXCLUDE_DIRS.has(dirent.name)) {
                results = results.concat(await findMarkdownFiles(fullPath));
            } else if (dirent.isFile() && (dirent.name.endsWith('.md') || dirent.name.endsWith('.mdx'))) {
                results.push(fullPath);
            }
        }
    } catch (error) {
        // Ignore errors like permission denied
        if (error.code !== 'EACCES' && error.code !== 'ENOENT') {
            console.error(`Error reading directory ${dir}:`, error);
        }
    }
    return results;
}

async function checkH1Count(filepath) {
    let h1Count = 0;
    try {
        const content = await fs.readFile(filepath, 'utf-8');
        const lines = content.split('\n');
        for (const line of lines) {
            // Check for lines starting exactly with '# '
            if (line.startsWith('# ')) {
                h1Count++;
            }
        }
    } catch (e) {
        console.error(`Error reading file ${filepath}: ${e}`);
        return -1; // Indicate error
    }
    return h1Count;
}

async function main() {
    const workspaceRoot = process.cwd();
    console.log(`Checking for multiple H1 headings in: ${workspaceRoot}`);

    const filesToCheck = await findMarkdownFiles(workspaceRoot);
    const filesWithMultipleH1s = [];

    for (const filepath of filesToCheck) {
        const relativePath = path.relative(workspaceRoot, filepath);
        // console.log(`Checking: ${relativePath}`); // Optional
        const h1Count = await checkH1Count(filepath);
        if (h1Count > 1) {
            filesWithMultipleH1s.push(relativePath);
        }
    }

    if (filesWithMultipleH1s.length > 0) {
        console.error("\nError: The following files contain more than one H1 heading ('# '):");
        filesWithMultipleH1s.forEach(file => console.error(`- ${file}`));
        process.exit(1);
    } else {
        console.log("\nSuccess: All checked markdown/MDX files have at most one H1 heading.");
        process.exit(0);
    }
}

main().catch(err => {
    console.error("An unexpected error occurred:", err);
    process.exit(1);
}); 