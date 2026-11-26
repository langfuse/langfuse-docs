const { execFileSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const process = require("process");

const TEXT_EXTENSIONS = new Set([
  ".md",
  ".mdx",
  ".mdc",
  ".js",
  ".jsx",
  ".mjs",
  ".cjs",
  ".ts",
  ".tsx",
  ".json",
  ".css",
  ".scss",
  ".yaml",
  ".yml",
  ".html",
  ".ipynb",
  ".py",
]);

const EXCLUDE_PREFIXES = ["public/"];
const EXCLUDE_FILES = new Set(["pnpm-lock.yaml", "package-lock.json"]);
// This script spells out the escaped forms it bans.
const SELF = path.relative(process.cwd(), __filename).split(path.sep).join("/");

// Middle dot (U+00B7) plus lookalikes, as raw characters, HTML entities, or
// JS/Python escapes. Japanese katakana middle dot (U+30FB) is allowed.
const BANNED = new RegExp(
  [
    "[\\u00B7\\u2219\\u22C5]",
    "&(?:middot|centerdot|sdot);",
    "&#0*(?:183|8729|8901);",
    "&#x0*(?:b7|2219|22c5);",
    "\\\\u0*(?:00b7|2219|22c5)",
    "\\\\u\\{0*(?:b7|2219|22c5)\\}",
    "\\\\xb7",
  ].join("|"),
  "gi",
);

// Proper nouns whose official spelling contains a middle dot.
const ALLOWED_WORDS = ["DALL\u00B7E"];

function listTrackedFiles(root) {
  const output = execFileSync("git", ["ls-files", "-z"], {
    cwd: root,
    encoding: "utf-8",
    maxBuffer: 64 * 1024 * 1024,
  });
  return output
    .split("\0")
    .filter(Boolean)
    .filter((file) => TEXT_EXTENSIONS.has(path.extname(file)))
    .filter((file) => !EXCLUDE_FILES.has(path.basename(file)))
    .filter((file) => file !== SELF)
    .filter(
      (file) => !EXCLUDE_PREFIXES.some((prefix) => file.startsWith(prefix)),
    );
}

function findViolations(content) {
  const violations = [];
  content.split("\n").forEach((line, index) => {
    let masked = line;
    for (const word of ALLOWED_WORDS) {
      masked = masked.split(word).join(" ".repeat(word.length));
    }
    for (const match of masked.matchAll(BANNED)) {
      violations.push({
        line: index + 1,
        column: match.index + 1,
        text: line.trim(),
      });
    }
  });
  return violations;
}

function main() {
  const root = process.cwd();
  const files = listTrackedFiles(root);
  const results = [];

  for (const file of files) {
    const fullPath = path.join(root, file);
    // Symlinked shims (AGENTS.md, CLAUDE.md, .cursor/rules) are checked via their targets.
    if (!fs.existsSync(fullPath) || fs.lstatSync(fullPath).isSymbolicLink()) {
      continue;
    }
    const content = fs.readFileSync(fullPath, "utf-8");
    for (const violation of findViolations(content)) {
      results.push({ file, ...violation });
    }
  }

  if (results.length > 0) {
    console.error(
      `Error: found ${results.length} middle dot separator(s) (U+00B7 or a lookalike). Do not use them.`,
    );
    console.error(
      "Use a comma for lists, a colon or parentheses for a label and its qualifier, or remove decorative separators.\n",
    );
    for (const { file, line, column, text } of results) {
      console.error(`${file}:${line}:${column}  ${text}`);
    }
    process.exit(1);
  }

  console.log(
    `Success: no middle dot separators found in ${files.length} tracked text files.`,
  );
}

main();
