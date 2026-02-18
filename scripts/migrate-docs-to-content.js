/**
 * Copies docs from docs-nextra-backup to content/docs and converts _meta.tsx to meta.json.
 * Run from project root: node scripts/migrate-docs-to-content.js
 */
const fs = require("fs");
const path = require("path");

const BACKUP = "docs-nextra-backup";
const TARGET = "content/docs";

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function copyFile(src, dest) {
  ensureDir(path.dirname(dest));
  fs.copyFileSync(src, dest);
}

// Copy all .mdx and .md files
function copyDocs(srcDir, destDir) {
  const entries = fs.readdirSync(srcDir, { withFileTypes: true });
  for (const e of entries) {
    const s = path.join(srcDir, e.name);
    const d = path.join(destDir, e.name);
    if (e.isDirectory()) {
      if (e.name === "node_modules" || e.name === ".git") continue;
      ensureDir(d);
      copyDocs(s, d);
    } else if (e.name.endsWith(".mdx") || e.name.endsWith(".md")) {
      if (e.name === "README.md") continue; // skip README
      copyFile(s, d);
    }
  }
}

// Extract page keys from _meta.tsx content (skip separators and href-only links)
function metaKeysFromContent(content) {
  const keys = [];
  // Match keys: "key": or key: (including quoted keys)
  const re = /^\s*["']?([a-zA-Z0-9_-]+)["']?\s*[:{]/gm;
  const hrefOnly = /^\s*["']?([a-zA-Z0-9_-]+)["']?\s*:\s*\{\s*title\s*:/gm;
  let m;
  const lines = content.split("\n");
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const keyMatch = line.match(/^\s*["']?([a-zA-Z0-9_-]+)["']?\s*[:{]/);
    if (!keyMatch) continue;
    const key = keyMatch[1];
    if (key.startsWith("--")) continue; // separator
    if (key === "type" || key === "title" || key === "layout") continue; // property, not key
    const rest = line + (lines[i + 1] || "");
    if (rest.includes("href:") && !rest.includes("type:") && !rest.includes("layout:")) {
      const hasMore = rest.includes("}") && rest.indexOf("}") < rest.indexOf("href:");
      if (!hasMore) continue; // skip external link-only entries
    }
    keys.push(key);
  }
  return keys;
}

function dirTitle(dirName) {
  return dirName
    .split(/[-_]/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

// Create meta.json from _meta.tsx in backup, write to target dir
function convertMeta(backupDir, targetDir) {
  const metaPath = path.join(backupDir, "_meta.tsx");
  if (!fs.existsSync(metaPath)) return;
  const content = fs.readFileSync(metaPath, "utf8");
  const keys = metaKeysFromContent(content);
  const title = dirTitle(path.basename(backupDir));
  const meta = { title, pages: keys };
  ensureDir(targetDir);
  const outPath = path.join(targetDir, "meta.json");
  fs.writeFileSync(outPath, JSON.stringify(meta, null, 2) + "\n");
}

function convertMetaInTree(backupDir, targetDir) {
  if (fs.existsSync(path.join(backupDir, "_meta.tsx"))) {
    convertMeta(backupDir, targetDir);
  }
  const entries = fs.readdirSync(backupDir, { withFileTypes: true });
  for (const e of entries) {
    if (e.isDirectory() && !e.name.startsWith(".")) {
      convertMetaInTree(
        path.join(backupDir, e.name),
        path.join(targetDir, e.name)
      );
    }
  }
}

// Main
ensureDir(TARGET);
console.log("Copying MDX/MD from", BACKUP, "to", TARGET);
copyDocs(BACKUP, TARGET);
console.log("Converting _meta.tsx to meta.json (backup -> target)");
convertMetaInTree(BACKUP, TARGET);
console.log("Done.");
console.log("Remove _meta.tsx from content/docs if desired (Fumadocs uses meta.json only).");
