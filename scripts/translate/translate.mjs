#!/usr/bin/env node
// Translates the English docs into the languages in i18n/config.json.
// See i18n/README.md for the workflow and the options below.
//
//   node scripts/translate/translate.mjs --lang ja [--lang ko] [--paths content/docs/a.mdx,content/docs/b]
//     [--limit 20] [--force] [--dry-run] [--concurrency 6] [--report report.md]

import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { parseArgs } from "node:util";
import Anthropic from "@anthropic-ai/sdk";
import { compile } from "@mdx-js/mdx";
import YAML from "yaml";
import {
  applyMetaStrings,
  buildFrontmatter,
  checkPlaceholders,
  compareStructure,
  headings,
  hidePlaceholders,
  maskBody,
  metaStrings,
  pinHeadingIds,
  splitFrontmatter,
  translatableFrontmatter,
  unmaskBody,
} from "./mdx.mjs";

const ROOT = path.resolve(import.meta.dirname, "../..");
const I18N_DIR = path.join(ROOT, "i18n");
const CONTENT_DIR = "content";
const MAX_ATTEMPTS = 3;
const PROMPT_VERSION = 1;
// USD per million tokens, for the cost estimate in the run report.
const PRICES = {
  "claude-opus-5-5": { input: 4, output: 20, cacheRead: 0.2, cacheWrite: 5 },
};

// ---------------------------------------------------------------------------
// Configuration and file selection
// ---------------------------------------------------------------------------

const { values: args } = parseArgs({
  options: {
    lang: { type: "string", multiple: true },
    paths: { type: "string" },
    limit: { type: "string" },
    force: { type: "boolean", default: false },
    "dry-run": { type: "boolean", default: false },
    concurrency: { type: "string" },
    report: { type: "string" },
  },
});

const config = JSON.parse(
  fs.readFileSync(path.join(I18N_DIR, "config.json"), "utf8"),
);
const glossary = YAML.parse(
  fs.readFileSync(path.join(I18N_DIR, "glossary.yaml"), "utf8"),
);
// An unquoted ": " in glossary.yaml turns an entry into a mapping, which would
// reach the model as "[object Object]".
for (const [lang, rules] of Object.entries(glossary.rules ?? {})) {
  for (const rule of rules) {
    if (typeof rule !== "string")
      throw new Error(
        `glossary.yaml: a ${lang} rule is not a string. Quote rules that contain ": ".`,
      );
  }
}
for (const term of glossary.terms) {
  for (const [key, value] of Object.entries(term)) {
    if (value !== null && typeof value === "object")
      throw new Error(
        `glossary.yaml: "${term.term}" has a non-string ${key}. Quote values that contain ": ".`,
      );
  }
}
const languages = (args.lang ?? Object.keys(config.languages))
  .flatMap((l) => l.split(","))
  .map((l) => l.trim())
  .filter(Boolean);
for (const lang of languages) {
  if (!config.languages[lang])
    throw new Error(`Unknown language "${lang}". Add it to i18n/config.json.`);
}
const pathFilter = args.paths
  ? args.paths
      .split(",")
      .map((p) => p.trim().replace(/\/$/, ""))
      .filter(Boolean)
  : null;
const fileLimit = args.limit ? Number(args.limit) : Infinity;
const concurrency = Number(args.concurrency ?? config.concurrency ?? 4);

function globToRegExp(glob) {
  const escaped = glob.replace(/[.+^${}()|[\]\\]/g, "\\$&");
  return new RegExp(
    `^${escaped
      .replace(/\*\*/g, "\u0000")
      .replace(/\*/g, "[^/]*")
      .replace(/\u0000/g, ".*")}$`,
  );
}

function listFiles(dir) {
  return fs
    .readdirSync(path.join(ROOT, dir), { withFileTypes: true })
    .flatMap((entry) => {
      const rel = `${dir}/${entry.name}`;
      return entry.isDirectory() ? listFiles(rel) : [rel];
    });
}

function sourceFiles(lang) {
  const include = config.include.map(globToRegExp);
  const exclude = [
    ...config.exclude,
    ...(config.excludeByLanguage?.[lang] ?? []),
    ...config.neverTranslate,
  ].map(globToRegExp);
  return listFiles(CONTENT_DIR)
    .filter(
      (file) =>
        /\.(mdx?|json)$/.test(file) &&
        (!file.endsWith(".json") || path.basename(file) === "meta.json"),
    )
    .filter(
      (file) =>
        include.some((re) => re.test(file)) &&
        !exclude.some((re) => re.test(file)),
    )
    .sort();
}

const matchesPathFilter = (file) =>
  !pathFilter || pathFilter.some((p) => file === p || file.startsWith(`${p}/`));
const outputPath = (lang, file) =>
  path.join(I18N_DIR, lang, path.relative(CONTENT_DIR, file));

/** Same id as `git hash-object`, so the previous English version can be read back with `git cat-file`. */
function blobSha(content) {
  const buffer = Buffer.from(content, "utf8");
  return createHash("sha1")
    .update(`blob ${buffer.length}\0`)
    .update(buffer)
    .digest("hex");
}

function readBlob(sha) {
  try {
    return execFileSync("git", ["cat-file", "-p", sha], {
      cwd: ROOT,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    });
  } catch {
    return null;
  }
}

const lockPath = (lang) => path.join(I18N_DIR, lang, ".translation-lock.json");

function readLock(lang) {
  try {
    return JSON.parse(fs.readFileSync(lockPath(lang), "utf8"));
  } catch {
    return { version: 1, files: {} };
  }
}

function writeLock(lang, lock) {
  const files = Object.fromEntries(
    Object.entries(lock.files).sort(([a], [b]) => a.localeCompare(b)),
  );
  fs.mkdirSync(path.dirname(lockPath(lang)), { recursive: true });
  fs.writeFileSync(
    lockPath(lang),
    `${JSON.stringify({ version: 1, files }, null, 2)}\n`,
  );
}

// ---------------------------------------------------------------------------
// Prompts
// ---------------------------------------------------------------------------

function systemPrompt(lang) {
  const { name } = config.languages[lang];
  const rules = [
    ...(glossary.rules?.all ?? []),
    ...(glossary.rules?.[lang] ?? []),
  ];
  const terms = glossary.terms
    .map((t) => {
      const target = t.keep ? "keep in English" : t[lang];
      if (!target) return null;
      return `- ${t.term} → ${target}${t.note ? ` (${t.note})` : ""}`;
    })
    .filter(Boolean);

  return `You translate the Langfuse documentation from English into ${name}. Langfuse is an open-source LLM engineering platform for observability, prompt management, and evaluation. Readers are software engineers.

Output only the translated document: no preamble, no explanation, and no code fence or tags around it.

A script checks the structure of your output and rejects it if any of these rules is broken:
- A line that holds only a placeholder such as ⟦KEEP_3⟧ stands for a code block, an import, or a JSX tag. Copy every placeholder exactly once, alone on its line, in the original order.
- Keep the Markdown structure: the same headings at the same levels, lists, tables, callouts, and blank lines.
- Keep inline code, URLs, link targets, HTML/JSX tags and their attributes, and \`[#anchor]\` suffixes of headings exactly as in the source. Translate link text.
- Translate the string values of the JSON object between ⟦FRONTMATTER⟧ and ⟦/FRONTMATTER⟧, keep its keys, and keep it valid JSON.

Language and style:
${rules.map((r) => `- ${r}`).join("\n")}
- Write natural, idiomatic ${name} technical prose rather than a word-for-word translation. Keep the meaning, tone, and level of detail; do not add, drop, or summarize content.

Glossary. Use these translations consistently; "keep in English" means the term is never translated:
${terms.join("\n")}`;
}

function documentPrompt({ file, fields, masked, previous }) {
  const frontmatter = Object.keys(fields).length
    ? `⟦FRONTMATTER⟧\n${JSON.stringify(fields, null, 2)}\n⟦/FRONTMATTER⟧\n\n`
    : "";
  let reference = "";
  if (previous?.english) {
    reference = `The English page changed since it was last translated. The previous English version and its translation follow. Reviewers may have edited the translation, so reuse it wherever the English did not change, and only translate new or changed passages. Code is shown as ⟦…⟧ in both.

<previous_english>
${previous.english}
</previous_english>

<previous_translation>
${previous.translation}
</previous_translation>

`;
  } else if (previous) {
    // The previous English version is not in git, e.g. for synced workshop pages.
    reference = `The English page changed since it was last translated. Its existing translation follows. Reviewers may have edited it, so reuse its wording wherever it still matches the English, and only translate new or changed passages. Code is shown as ⟦…⟧.

<previous_translation>
${previous.translation}
</previous_translation>

`;
  }
  return `${reference}Translate the page ${file}:

<document>
${frontmatter}${masked}
</document>`;
}

// ---------------------------------------------------------------------------
// Model calls
// ---------------------------------------------------------------------------

const client = args["dry-run"] ? null : new Anthropic({ maxRetries: 4 });
const usage = { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, requests: 0 };

async function callModel(lang, messages) {
  const stream = client.beta.messages.stream({
    model: config.model,
    max_tokens: config.maxOutputTokens,
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
    output_config: { effort: config.effort },
    system: [
      {
        type: "text",
        text: systemPrompt(lang),
        cache_control: { type: "ephemeral" },
      },
    ],
    messages,
  });
  const message = await stream.finalMessage();
  usage.requests++;
  usage.input += message.usage.input_tokens ?? 0;
  usage.output += message.usage.output_tokens ?? 0;
  usage.cacheRead += message.usage.cache_read_input_tokens ?? 0;
  usage.cacheWrite += message.usage.cache_creation_input_tokens ?? 0;
  if (message.stop_reason === "refusal")
    throw new Error("The model declined to translate this page.");
  if (message.stop_reason === "max_tokens")
    throw new Error("The translation hit the output token limit.");
  const text = message.content
    .filter((block) => block.type === "text")
    .map((block) => block.text)
    .join("");
  return {
    message,
    text: text
      .replace(/^\s*<document>\n?/, "")
      .replace(/\n?<\/document>\s*$/, ""),
  };
}

/** Sends a request and asks for corrections until `check` returns no errors. */
async function translateWithChecks(lang, prompt, check) {
  const messages = [{ role: "user", content: prompt }];
  let lastErrors = [];
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    const { message, text } = await callModel(lang, messages);
    const result = await check(text);
    if (result.errors.length === 0) return result;
    lastErrors = result.errors;
    messages.push({ role: "assistant", content: message.content });
    messages.push({
      role: "user",
      content: `Your translation failed these checks:\n${result.errors.map((e) => `- ${e}`).join("\n")}\n\nOutput the full corrected document.`,
    });
  }
  throw new Error(
    `Checks still failing after ${MAX_ATTEMPTS} attempts: ${lastErrors.join(" ")}`,
  );
}

async function compiles(body) {
  try {
    await compile(body);
    return true;
  } catch {
    return false;
  }
}

function keepTermWarnings(englishMasked, translatedMasked) {
  return glossary.terms
    .filter((t) => t.keep && /^[A-Z]/.test(t.term))
    .filter(
      (t) =>
        englishMasked.includes(t.term) && !translatedMasked.includes(t.term),
    )
    .map((t) => `"${t.term}" is in the source but not in the translation.`);
}

// ---------------------------------------------------------------------------
// Translating pages and meta.json files
// ---------------------------------------------------------------------------

async function translatePage(lang, file, source, previous) {
  const { data, body } = splitFrontmatter(source);
  const { masked, slots } = maskBody(body);
  if (masked.length > config.maxSourceChars) {
    throw new Error(
      `Skipped: ${masked.length} characters of prose exceed maxSourceChars (${config.maxSourceChars}).`,
    );
  }
  const fields = translatableFrontmatter(data);
  const englishHeadings = headings(masked);
  const sourceCompiles = await compiles(body);

  let previousReference = null;
  if (previous) {
    const hide = (text) =>
      hidePlaceholders(maskBody(splitFrontmatter(text).body).masked);
    previousReference = {
      english: previous.english ? hide(previous.english) : null,
      translation: hide(previous.translation),
    };
  }

  const prompt = documentPrompt({
    file,
    fields,
    masked,
    previous: previousReference,
  });
  return translateWithChecks(lang, prompt, async (text) => {
    const errors = [];
    let translatedFields = {};
    let translatedBody = text;
    const fm = text.match(
      /^\s*⟦FRONTMATTER⟧\s*\n([\s\S]*?)\n\s*⟦\/FRONTMATTER⟧\s*\n?/,
    );
    if (Object.keys(fields).length) {
      if (!fm) {
        errors.push(
          "The ⟦FRONTMATTER⟧ block is missing at the top of the document.",
        );
      } else {
        try {
          translatedFields = JSON.parse(fm[1]);
        } catch {
          errors.push("The ⟦FRONTMATTER⟧ block is not valid JSON.");
        }
        translatedBody = text.slice(fm[0].length);
      }
    }
    translatedBody = translatedBody.replace(
      /^\n+/,
      body.startsWith("\n") ? "\n" : "",
    );

    errors.push(...checkPlaceholders(translatedBody, slots.length));
    if (errors.length) return { errors };
    errors.push(...compareStructure(masked, translatedBody));
    if (errors.length) return { errors };

    const pinned = pinHeadingIds(translatedBody, englishHeadings);
    const restored = unmaskBody(pinned, slots);
    if (sourceCompiles && !(await compiles(restored))) {
      errors.push(
        "The translated document is not valid MDX. Check that every JSX tag and Markdown construct is intact.",
      );
      return { errors };
    }
    const output =
      buildFrontmatter(data, translatedFields) + restored.replace(/\n*$/, "\n");
    return {
      errors: [],
      output,
      warnings: keepTermWarnings(masked, translatedBody),
    };
  });
}

async function translateMetaFiles(lang, files) {
  const strings = {};
  for (const { file, source } of files)
    strings[file] = metaStrings(JSON.parse(source));
  const prompt = `These are sidebar labels of documentation sections. Translate each string. Return only a JSON object with the same keys, where each value is an object that maps every source string to its translation.

${JSON.stringify(strings, null, 2)}`;
  const result = await translateWithChecks(lang, prompt, async (text) => {
    try {
      const parsed = JSON.parse(text.replace(/^```(?:json)?\s*|\s*```$/g, ""));
      const missing = Object.entries(strings).flatMap(([file, list]) =>
        list
          .filter((s) => typeof parsed[file]?.[s] !== "string")
          .map((s) => `${file}: "${s}"`),
      );
      return missing.length
        ? {
            errors: [
              `Missing translations: ${missing.slice(0, 10).join(", ")}`,
            ],
          }
        : { errors: [], parsed };
    } catch {
      return { errors: ["The response is not a valid JSON object."] };
    }
  });
  return files.map(({ file, source }) => ({
    file,
    output: `${JSON.stringify(applyMetaStrings(JSON.parse(source), result.parsed[file]), null, 2)}\n`,
  }));
}

async function pool(items, size, worker) {
  let next = 0;
  const run = async () => {
    while (next < items.length) await worker(items[next++]);
  };
  await Promise.all(Array.from({ length: Math.min(size, items.length) }, run));
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function runLanguage(lang) {
  const lock = readLock(lang);
  const files = sourceFiles(lang);
  const fileSet = new Set(files);
  const stats = {
    lang,
    created: [],
    updated: [],
    deleted: [],
    failed: [],
    warnings: [],
    humanBehind: [],
    humanOrphaned: [],
    pending: 0,
    estimatedChars: 0,
  };

  // Remove translations whose English page was deleted or excluded. Skip
  // sections whose source is missing in this checkout (workshop pages are
  // synced, not committed), and never remove human translations.
  if (!pathFilter) {
    for (const [file, entry] of Object.entries(lock.files)) {
      if (fileSet.has(file)) continue;
      if (
        !fs.existsSync(path.join(ROOT, file.split("/").slice(0, 2).join("/")))
      )
        continue;
      if (entry.human) {
        stats.humanOrphaned.push(file);
        continue;
      }
      if (!args["dry-run"]) {
        fs.rmSync(outputPath(lang, file), { force: true });
        delete lock.files[file];
      }
      stats.deleted.push(file);
    }
  }

  const queue = [];
  for (const file of files.filter(matchesPathFilter)) {
    const source = fs.readFileSync(path.join(ROOT, file), "utf8");
    const sha = blobSha(source);
    const entry = lock.files[file];
    const out = outputPath(lang, file);
    const exists = fs.existsSync(out);
    // Human translations are never overwritten, not even with --force. The
    // report lists the ones whose English page changed since.
    if (entry?.human && exists) {
      if (entry.source !== sha) stats.humanBehind.push(file);
      continue;
    }
    if (!args.force && entry?.source === sha && exists) continue;
    let previous = null;
    if (exists && entry?.source !== sha && !file.endsWith(".json")) {
      previous = {
        english: entry?.source ? readBlob(entry.source) : null,
        translation: fs.readFileSync(out, "utf8"),
      };
    }
    queue.push({ file, source, sha, previous, isNew: !exists });
  }

  const pages = queue
    .filter((q) => !q.file.endsWith(".json"))
    .slice(0, fileLimit);
  const metas = queue.filter((q) => q.file.endsWith(".json"));
  stats.pending = queue.length - pages.length - metas.length;
  stats.estimatedChars = pages.reduce(
    (sum, q) => sum + maskBody(splitFrontmatter(q.source).body).masked.length,
    0,
  );

  const record = (q, output, warnings = []) => {
    fs.mkdirSync(path.dirname(outputPath(lang, q.file)), { recursive: true });
    fs.writeFileSync(outputPath(lang, q.file), output);
    lock.files[q.file] = {
      source: q.sha,
      translatedAt: new Date().toISOString().slice(0, 10),
      model: config.model,
      prompt: PROMPT_VERSION,
    };
    (q.isNew ? stats.created : stats.updated).push(q.file);
    stats.warnings.push(...warnings.map((w) => `${q.file}: ${w}`));
  };

  if (args["dry-run"]) {
    for (const q of [...pages, ...metas])
      (q.isNew ? stats.created : stats.updated).push(q.file);
    return stats;
  }

  await pool(pages, concurrency, async (q) => {
    try {
      const result = await translatePage(lang, q.file, q.source, q.previous);
      record(q, result.output, result.warnings);
      console.log(`[${lang}] ${q.isNew ? "created" : "updated"} ${q.file}`);
    } catch (error) {
      if (
        error instanceof Anthropic.AuthenticationError ||
        error instanceof Anthropic.PermissionDeniedError
      )
        throw error;
      stats.failed.push(`${q.file}: ${error.message}`);
      console.error(`[${lang}] failed ${q.file}: ${error.message}`);
    }
    writeLock(lang, lock);
  });

  if (metas.length) {
    try {
      for (const { file, output } of await translateMetaFiles(lang, metas)) {
        record(
          metas.find((q) => q.file === file),
          output,
        );
      }
    } catch (error) {
      stats.failed.push(`meta.json files: ${error.message}`);
    }
  }
  writeLock(lang, lock);
  return stats;
}

function report(allStats) {
  const price = PRICES[config.model];
  const cost = price
    ? (usage.input * price.input +
        usage.output * price.output +
        usage.cacheRead * price.cacheRead +
        usage.cacheWrite * price.cacheWrite) /
      1e6
    : null;
  const list = (items) =>
    items.length ? items.map((i) => `- \`${i}\``).join("\n") : "- none";
  const sections = allStats.map((s) => {
    const name = config.languages[s.lang].name;
    const parts = [
      `## ${name} (\`${s.lang}\`)`,
      `${s.created.length} new, ${s.updated.length} updated, ${s.deleted.length} deleted, ${s.failed.length} failed${s.pending ? `, ${s.pending} left for the next run (--limit)` : ""}.`,
    ];
    if (args["dry-run"]) {
      parts.push(
        `Dry run: about ${Math.round(s.estimatedChars / 4).toLocaleString("en-US")} input tokens of English prose would be translated.`,
      );
    }
    parts.push(
      `<details><summary>Changed files</summary>\n\n**New**\n${list(s.created)}\n\n**Updated**\n${list(s.updated)}\n\n**Deleted**\n${list(s.deleted)}\n</details>`,
    );
    if (s.failed.length)
      parts.push(`### Failed\n${s.failed.map((f) => `- ${f}`).join("\n")}`);
    if (s.humanBehind.length)
      parts.push(
        `### Human translations behind the English page\nThese are not changed automatically. Ask the translator to update them, then set \`source\` in \`i18n/${s.lang}/.translation-lock.json\` to the new English version.\n\n${list(s.humanBehind)}`,
      );
    if (s.humanOrphaned.length)
      parts.push(
        `### Human translations without an English page\n${list(s.humanOrphaned)}`,
      );
    if (s.warnings.length)
      parts.push(
        `### Glossary warnings\n${s.warnings.map((w) => `- ${w}`).join("\n")}`,
      );
    return parts.join("\n\n");
  });
  const footer = usage.requests
    ? `Model: \`${config.model}\`, ${usage.requests} requests, ${usage.input.toLocaleString("en-US")} input / ${usage.output.toLocaleString("en-US")} output tokens (${usage.cacheRead.toLocaleString("en-US")} cache reads)${cost === null ? "" : `, about $${cost.toFixed(2)}`}.`
    : "";
  return `${sections.join("\n\n")}\n\n${footer}\n`;
}

// Languages run in parallel; each runs `concurrency` requests at a time.
const allStats = await Promise.all(languages.map(runLanguage));
const markdown = report(allStats);
console.log(`\n${markdown}`);
if (args.report) fs.writeFileSync(args.report, markdown);

const failed = allStats.reduce((n, s) => n + s.failed.length, 0);
const done = allStats.reduce(
  (n, s) => n + s.created.length + s.updated.length,
  0,
);
if (failed > 0 && done === 0) process.exit(1);
