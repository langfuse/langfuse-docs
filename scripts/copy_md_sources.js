/*
  Copy all Markdown sources from content/** (md, mdx) into public/md-src/** as .md files.
  This runs at build time so the static files can be served directly in production.
*/

const fs = require('fs');
const path = require('path');
const { stripMdxForPlainMarkdown } = require('../lib/stripMdxForPlainMarkdown.js');
const { CONTENT_DIR_TO_URL_PREFIX } = require('../lib/content-dir-map.js');

const SOURCE_DIR = path.join(process.cwd(), 'content');
const OUTPUT_DIR = path.join(process.cwd(), 'public', 'md-src');
const OVERRIDE_DIR = path.join(process.cwd(), 'md-override');

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
 * - Remap content directories to match URL structure (see CONTENT_DIR_TO_URL_PREFIX)
 * - Map content/foo/bar.mdx -> public/md-src/foo/bar.md
 * - Map content/foo/index.mdx -> public/md-src/foo.md
 */
function mapDestination(sourceFile) {
    const rel = path.relative(SOURCE_DIR, sourceFile);
    const base = path.basename(rel);
    if (base === 'meta.json' || base.startsWith('_')) return null;

    const ext = path.extname(rel).toLowerCase();
    if (ext !== '.md' && ext !== '.mdx') return null;

    const withoutExt = rel.slice(0, -ext.length);
    const parts = withoutExt.split(path.sep);

    const topDir = parts[0];
    const urlPrefix = CONTENT_DIR_TO_URL_PREFIX[topDir];
    if (urlPrefix === '') {
        parts.splice(0, 1);
    } else if (typeof urlPrefix === 'string') {
        parts[0] = urlPrefix;
    }

    let outParts = parts.slice();
    if (outParts.length > 0 && outParts[outParts.length - 1] === 'index') {
        outParts = outParts.slice(0, -1);
    }
    const outRel = outParts.length ? outParts.join('/') + '.md' : 'index.md';
    return path.join(OUTPUT_DIR, outRel);
}

function copyAll() {
    if (!fs.existsSync(SOURCE_DIR)) {
        console.log('copy_md_sources: content/ not found, skipping');
        return;
    }
    const allFiles = walkDir(SOURCE_DIR);
    let copied = 0;
    for (const file of allFiles) {
        const dest = mapDestination(file);
        if (!dest) continue;
        const dir = path.dirname(dest);
        ensureDir(dir);
        const originalContent = fs.readFileSync(file, 'utf8');
        const inlined = inlineComponentsMdx(originalContent, file);
        const processed = stripMdxForPlainMarkdown(inlined, {
            unwrapCalloutsForPlainMd: true,
        });
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

/**
 * Copy hand-authored .md files from md-override/ into public/md-src/,
 * overwriting any auto-generated version for that path.
 */
function applyOverrides() {
    if (!fs.existsSync(OVERRIDE_DIR)) return;
    const files = walkDir(OVERRIDE_DIR);
    let overridden = 0;
    for (const file of files) {
        if (path.extname(file).toLowerCase() !== '.md') continue;
        const rel = path.relative(OVERRIDE_DIR, file);
        const dest = path.join(OUTPUT_DIR, rel);
        ensureDir(path.dirname(dest));
        fs.copyFileSync(file, dest);
        overridden += 1;
    }
    if (overridden > 0) {
        console.log(`Applied ${overridden} markdown override(s) from md-override/`);
    }
}

cleanOutputDir();
copyAll();
applyOverrides();

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


