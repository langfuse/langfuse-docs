/*
  Copy all Markdown sources from pages/** (md, mdx) into public/md-src/** as .md files.
  This runs at build time so the static files can be served directly in production.
*/

const fs = require('fs');
const path = require('path');

const SOURCE_DIR = path.join(process.cwd(), 'pages');
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
 * Determine if path within pages/ should be copied and where.
 * - Accept .md and .mdx files only
 * - Exclude next special files and api routes (e.g., pages/api/**, _app, _document, _meta, 404)
 * - Map pages/foo/bar.mdx -> public/md-src/foo/bar.md
 * - Map pages/foo/index.mdx -> public/md-src/foo.md
 */
function mapDestination(sourceFile) {
    const rel = path.relative(SOURCE_DIR, sourceFile);
    // Exclude special folders/files
    if (rel.startsWith('api/')) return null;
    const base = path.basename(rel);
    if (base.startsWith('_') || base === '404.mdx' || base === '404.md') return null;

    const ext = path.extname(rel).toLowerCase();
    if (ext !== '.md' && ext !== '.mdx') return null;

    // Remove extension
    const withoutExt = rel.slice(0, -ext.length);

    // Handle index files (e.g., docs/index.mdx -> docs.md)
    const parts = withoutExt.split(path.sep);
    let outParts = parts.slice();
    if (parts[parts.length - 1] === 'index') {
        outParts = parts.slice(0, -1); // drop 'index'
    }
    const outRel = outParts.length ? outParts.join('/') + '.md' : 'index.md';
    return path.join(OUTPUT_DIR, outRel);
}

function copyAll() {
    const allFiles = walkDir(SOURCE_DIR);
    let copied = 0;
    for (const file of allFiles) {
        const dest = mapDestination(file);
        if (!dest) continue;
        const dir = path.dirname(dest);
        ensureDir(dir);
        const originalContent = fs.readFileSync(file, 'utf8');
        const processed = inlineComponentsMdx(originalContent, file);
        fs.writeFileSync(dest, processed, 'utf8');
        copied += 1;
    }
    console.log(`Copied ${copied} markdown source files into public/md-src`);
}

function cleanOutputDir() {
    if (fs.existsSync(OUTPUT_DIR)) {
        fs.rmSync(OUTPUT_DIR, { recursive: true, force: true });
    }
}

cleanOutputDir();
copyAll();

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


