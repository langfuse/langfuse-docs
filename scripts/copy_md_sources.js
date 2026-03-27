/*
  Copy all Markdown sources from content/** (md, mdx) into public/md-src/** as .md files.
  This runs at build time so the static files can be served directly in production.
*/

const fs = require('fs');
const path = require('path');

const SOURCE_DIR = path.join(process.cwd(), 'content');
const OUTPUT_DIR = path.join(process.cwd(), 'public', 'md-src');

/**
 * Recursively walk a directory collecting file paths.
 */
function walkDir(dirPath) {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    const files = [];
    for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);
        if (entry.isDirectory()) {
            files.push(...walkDir(fullPath));
        } else {
            files.push(fullPath);
        }
    }
    return files;
}

/**
 * Ensure a directory exists.
 */
function ensureDir(dirPath) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
}

/**
 * Determine if path within content/ should be copied and where.
 * - Accept .md and .mdx files only
 * - Exclude meta.json and non-markdown
 * - Map content/foo/bar.mdx -> public/md-src/foo/bar.md
 * - Map content/foo/index.mdx -> public/md-src/foo.md
 */
function mapDestinations(sourceFile, options = {}) {
    const sourceDir = options.sourceDir ?? SOURCE_DIR;
    const outputDir = options.outputDir ?? OUTPUT_DIR;
    const rel = path.relative(sourceDir, sourceFile);
    const base = path.basename(rel);
    if (base === 'meta.json' || base.startsWith('_')) return [];

    const ext = path.extname(rel).toLowerCase();
    if (ext !== '.md' && ext !== '.mdx') return [];

    const withoutExt = rel.slice(0, -ext.length);
    const parts = withoutExt.split(path.sep);
    let outParts = parts.slice();
    if (parts[parts.length - 1] === 'index') {
        outParts = parts.slice(0, -1);
    }
    const outRel = outParts.length ? outParts.join('/') + '.md' : 'index.md';
    const destinations = [path.join(outputDir, outRel)];

    // Preserve legacy root-level markdown URLs for marketing pages (e.g., /terms.md).
    if (parts[0] === 'marketing' && parts.length === 2 && parts[1] !== 'index') {
        destinations.push(path.join(outputDir, `${parts[1]}.md`));
    }

    return destinations;
}

function copyAll(options = {}) {
    const sourceDir = options.sourceDir ?? SOURCE_DIR;
    const outputDir = options.outputDir ?? OUTPUT_DIR;

    if (!fs.existsSync(sourceDir)) {
        console.log('copy_md_sources: content/ not found, skipping');
        return;
    }
    const allFiles = walkDir(sourceDir);
    let copied = 0;
    for (const file of allFiles) {
        const originalContent = fs.readFileSync(file, 'utf8');
        const processed = inlineComponentsMdx(originalContent, file);
        const destinations = mapDestinations(file, { sourceDir, outputDir });
        for (const dest of destinations) {
            const dir = path.dirname(dest);
            ensureDir(dir);
            fs.writeFileSync(dest, processed, 'utf8');
            copied += 1;
        }
    }
    console.log(`Copied ${copied} markdown source files into public/md-src`);
}

function cleanOutputDir(options = {}) {
    const outputDir = options.outputDir ?? OUTPUT_DIR;
    if (fs.existsSync(outputDir)) {
        fs.rmSync(outputDir, { recursive: true, force: true });
    }
}

if (require.main === module) {
    cleanOutputDir();
    copyAll();
}

/**
 * Inline imports of MDX components from the components-mdx directory.
 * Only resolves paths starting with "@/components-mdx/".
 */
function inlineComponentsMdx(fileContent, sourceFilePath) {
    try {
        const importPattern = /(^|\n)import\s+([A-Za-z0-9_]+)\s+from\s+"@\/components-mdx\/([^"]+)";?\s*(?=\n|$)/g;
        const componentAliasRoot = path.join(process.cwd(), 'components-mdx');

        // Collect all imports first to avoid interfering with regex iteration during replacements
        const imports = [];
        let match;
        while ((match = importPattern.exec(fileContent)) !== null) {
            const importedName = match[2];
            const importedRel = match[3];
            imports.push({ fullMatch: match[0], importedName, importedRel });
        }

        if (imports.length === 0) return fileContent;

        let contentWithoutImports = fileContent;
        for (const imp of imports) {
            // Remove the import line
            contentWithoutImports = contentWithoutImports.replace(imp.fullMatch, '\n');
        }

        // Resolve and inline each component
        let finalContent = contentWithoutImports;
        for (const imp of imports) {
            const resolvedPath = resolveComponentPath(componentAliasRoot, imp.importedRel);
            if (!resolvedPath) {
                console.warn(`copy_md_sources: Could not resolve component ${imp.importedRel} imported as ${imp.importedName} in ${sourceFilePath}`);
                continue;
            }
            const rawChild = fs.readFileSync(resolvedPath, 'utf8');
            const childInlined = inlineComponentsMdx(rawChild, resolvedPath);

            // Replace self-closing and paired tags
            const selfClosing = new RegExp(`<${imp.importedName}(\\s[^>]*)?\\s*/>`, 'g');
            const paired = new RegExp(`<${imp.importedName}(\\s[^>]*)?>([\\s\\S]*?)<\/${imp.importedName}>`, 'g');

            finalContent = finalContent.replace(selfClosing, `\n${childInlined}\n`);
            finalContent = finalContent.replace(paired, `\n${childInlined}\n`);
        }

        return finalContent;
    } catch (e) {
        console.warn(`copy_md_sources: Failed to inline components for ${sourceFilePath}:`, e.message);
        return fileContent;
    }
}

function resolveComponentPath(rootDir, relImport) {
    // Allow explicit extensions or try .mdx, then .md
    const explicit = path.join(rootDir, relImport);
    if (fs.existsSync(explicit)) return explicit;
    const withMdx = explicit.endsWith('.mdx') ? explicit : explicit + '.mdx';
    if (fs.existsSync(withMdx)) return withMdx;
    const withMd = explicit.endsWith('.md') ? explicit : explicit + '.md';
    if (fs.existsSync(withMd)) return withMd;
    return null;
}

module.exports = {
    SOURCE_DIR,
    OUTPUT_DIR,
    mapDestinations,
    copyAll,
    cleanOutputDir,
};

