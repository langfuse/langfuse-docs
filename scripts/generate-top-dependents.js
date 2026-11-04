#!/usr/bin/env node

// Builds components-mdx/dependents/top.md: the most-starred repositories that
// depend on the Python or JS SDK, deduplicated across both. Used on /adoption.
// Run after github-dependents-info (see scripts/update_package_usage.sh).

const fs = require("fs");
const path = require("path");

const DEPENDENTS_DIR = path.join(
  __dirname,
  "..",
  "components-mdx",
  "dependents",
);
const SOURCES = ["python.md", "js.md"];
const OUTPUT_PATH = path.join(DEPENDENTS_DIR, "top.md");
const LIMIT = 25;

// Matches a generated row: | ![avatar](...) &nbsp; [owner](...) / [repo](url) | 123 |
const ROW_PATTERN =
  /^\|\s*(!\[avatar\].*?\/\s*\[[^\]]+\]\(([^)]+)\))\s*\|\s*(\d+)\s*\|$/;

const byRepo = new Map();
for (const source of SOURCES) {
  const lines = fs
    .readFileSync(path.join(DEPENDENTS_DIR, source), "utf8")
    .split("\n");
  for (const line of lines) {
    const match = line.trim().match(ROW_PATTERN);
    if (!match) continue;
    const [, repository, url, stars] = match;
    const key = url.toLowerCase();
    const existing = byRepo.get(key);
    if (!existing || Number(stars) > existing.stars) {
      byRepo.set(key, { repository, stars: Number(stars) });
    }
  }
}

const top = [...byRepo.values()]
  .sort((a, b) => b.stars - a.stars)
  .slice(0, LIMIT);

if (top.length === 0) {
  throw new Error("No dependents parsed; check the generated tables' format");
}

const table = [
  "| Repository | Stars |",
  "| :--------- | ----: |",
  ...top.map(({ repository, stars }) => `| ${repository} | ${stars} |`),
].join("\n");

fs.writeFileSync(OUTPUT_PATH, `${table}\n`, "utf8");
console.log(`✅ Wrote ${top.length} repositories to ${OUTPUT_PATH}`);
