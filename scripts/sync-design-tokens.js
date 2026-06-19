/**
 * Generates the public, externally-hosted Langfuse design page from the live
 * source of truth so it never drifts from the actual app theme.
 *
 *   Source of truth:
 *     - style.css        — Tailwind v4 `@theme` block (fonts, radius, color
 *                          token aliases) and the `:root` / `:root[class~="dark"]`
 *                          custom properties (the raw light/dark token values).
 *     - app/layout.tsx   — the `next/font` definitions that back the
 *                          `--font-*` variables (resolves Inter / Geist Mono /
 *                          F37 Analog and their weights).
 *
 *   Output:
 *     - public/design.md — served at https://langfuse.com/design.md. The page
 *       is fully self-contained for external consumers (humans and agents):
 *       it contains no repo-internal paths or commands, only public URLs.
 *
 * The file is fully generated — do not hand-edit it. Edit this script instead.
 * Runs via `pnpm sync-design-tokens` and as part of `prebuild`.
 */
"use strict";
const fs = require("fs");
const path = require("path");

const repoRoot = path.join(__dirname, "..");
const styleCssPath = path.join(repoRoot, "style.css");
const layoutPath = path.join(repoRoot, "app", "layout.tsx");
const outPath = path.join(repoRoot, "public", "design.md");

// Public URL of the installable skill repo (mirrors `npx skills add langfuse/design-skill`).
const SKILL_REPO_URL = "https://github.com/langfuse/design-skill";
const BRAND_GUIDELINES_URL = `${SKILL_REPO_URL}/blob/main/brand-guidelines/SKILL.md`;

/** Capture the balanced `{ ... }` body that follows the first selector match. */
function extractBlock(css, selectorRegex) {
  const match = selectorRegex.exec(css);
  if (!match) return null;
  let i = css.indexOf("{", match.index);
  if (i === -1) return null;
  let depth = 0;
  const start = i + 1;
  for (; i < css.length; i++) {
    if (css[i] === "{") depth++;
    else if (css[i] === "}" && --depth === 0) {
      return css.slice(start, i);
    }
  }
  return null;
}

/** Parse `--name: value;` declarations (comments stripped, values collapsed). */
function parseDecls(blockBody) {
  if (!blockBody) return [];
  const clean = blockBody.replace(/\/\*[\s\S]*?\*\//g, "");
  const decls = [];
  for (const chunk of clean.split(";")) {
    const m = chunk.match(/^\s*(--[\w-]+)\s*:\s*([\s\S]*)$/);
    if (!m) continue;
    const name = m[1];
    const value = m[2].replace(/\s+/g, " ").trim();
    if (value) decls.push({ name, value });
  }
  return decls;
}

/** Resolve `--font-*` backing fonts (family + weight) from app/layout.tsx. */
function parseFonts(layoutSrc) {
  const byVar = {};
  // Google fonts: e.g. `Inter({ ... variable: "--font-inter" ... })`
  const googleRe =
    /\b([A-Z][A-Za-z0-9_]+)\(\{([^}]*?variable:\s*"(--font-[\w-]+)"[^}]*?)\}\)/g;
  let g;
  while ((g = googleRe.exec(layoutSrc))) {
    const fnName = g[1];
    const body = g[2];
    const variable = g[3];
    if (fnName === "localFont") continue;
    const weight = (body.match(/weight:\s*"([^"]+)"/) || [])[1];
    byVar[variable] = { family: fnName, weight: weight || "variable" };
  }
  // Local fonts: `localFont({ src: ".../F37Analog-Medium.woff2", variable: "--font-analog", weight: "500" })`
  const localRe = /localFont\(\{([\s\S]*?)\}\)/g;
  let l;
  while ((l = localRe.exec(layoutSrc))) {
    const body = l[1];
    const variable = (body.match(/variable:\s*"(--font-[\w-]+)"/) || [])[1];
    if (!variable) continue;
    const src = (body.match(/src:\s*"([^"]+)"/) || [])[1] || "";
    const weight = (body.match(/weight:\s*"([^"]+)"/) || [])[1];
    byVar[variable] = {
      family: humanizeFontFile(src),
      weight: weight || "variable",
    };
  }
  return byVar;
}

/** "../public/fonts/GeistMono-Medium.woff2" -> "Geist Mono" */
function humanizeFontFile(src) {
  const base = src.split("/").pop() || src;
  const stem = base.replace(/\.[a-z0-9]+$/i, "");
  const name = stem.replace(
    /-(Thin|Light|Regular|Medium|SemiBold|Bold|Black|Italic)$/i,
    "",
  );
  return name.replace(/([a-z0-9])([A-Z])/g, "$1 $2").trim();
}

/** Render a GitHub-flavored markdown table matching Prettier's column alignment. */
function renderTable(headers, rows) {
  const widths = headers.map((h, i) =>
    Math.max(h.length, ...rows.map((r) => String(r[i] ?? "").length), 3),
  );
  const line = (cells) =>
    "| " +
    cells.map((c, i) => String(c ?? "").padEnd(widths[i])).join(" | ") +
    " |";
  const sep = "| " + widths.map((w) => "-".repeat(w)).join(" | ") + " |";
  return [line(headers), sep, ...rows.map(line)].join("\n");
}

const css = fs.readFileSync(styleCssPath, "utf-8");
const layoutSrc = fs.readFileSync(layoutPath, "utf-8");

const themeDecls = parseDecls(extractBlock(css, /@theme\s*\{/));
const lightDecls = parseDecls(extractBlock(css, /:root\s*\{/));
const darkDecls = parseDecls(extractBlock(css, /:root\[class~="dark"\]\s*\{/));
const fonts = parseFonts(layoutSrc);

// name -> { light, dark } for the :root custom properties
const themed = new Map();
for (const { name, value } of lightDecls)
  themed.set(name, { light: value, dark: "" });
for (const { name, value } of darkDecls) {
  const entry = themed.get(name) || { light: "", dark: "" };
  entry.dark = value;
  themed.set(name, entry);
}

const order = lightDecls.map((d) => d.name); // preserve source ordering
for (const { name } of darkDecls) if (!order.includes(name)) order.push(name);

// Group tokens by prefix; everything non-prefixed is a base/semantic token.
const groups = {
  surface: { title: "Surfaces", prefix: "--surface-", rows: [] },
  text: { title: "Text", prefix: "--text-", rows: [] },
  line: { title: "Lines and borders", prefix: "--line-", rows: [] },
  callout: { title: "Callouts", prefix: "--callout-", rows: [] },
};
const semantic = [];
let radius = "";

for (const name of order) {
  const { light, dark } = themed.get(name);
  if (name === "--radius") {
    radius = light;
    continue;
  }
  if (name === "--button-icon-color") continue; // pointer alias, not a value
  let placed = false;
  for (const key of Object.keys(groups)) {
    if (name.startsWith(groups[key].prefix)) {
      groups[key].rows.push([
        `\`${name}\``,
        `\`${light}\``,
        dark ? `\`${dark}\`` : "—",
      ]);
      placed = true;
      break;
    }
  }
  if (!placed)
    semantic.push([`\`${name}\``, `\`${light}\``, dark ? `\`${dark}\`` : "—"]);
}

// Typography rows from @theme `--font-*`, resolved through app/layout.tsx.
const fontRows = themeDecls
  .filter((d) => /^--font-/.test(d.name))
  .map((d) => {
    const role = d.name.replace("--font-", "");
    const primaryVar = (d.value.match(/var\((--font-[\w-]+)\)/) || [])[1];
    const resolved = primaryVar && fonts[primaryVar];
    const family = resolved
      ? `${resolved.family}${resolved.weight && resolved.weight !== "variable" ? ` (${resolved.weight})` : ""}`
      : primaryVar
        ? `\`${primaryVar}\``
        : "—";
    return [`\`font-${role}\``, `\`${d.name}\``, family, `\`${d.value}\``];
  });

// Radius rows from @theme `--radius-*` plus the base `--radius`.
const radiusRows = [];
if (radius) radiusRows.push(["`--radius`", `\`${radius}\``, "(base)"]);
for (const d of themeDecls) {
  if (/^--radius-/.test(d.name)) {
    const util = "rounded-" + d.name.replace("--radius-", "");
    radiusRows.push([`\`${d.name}\``, `\`${d.value}\``, `\`${util}\``]);
  }
}

const sections = [];
sections.push(
  "<!--\n" +
    "  This page is generated from the live Langfuse design system.\n" +
    "  Do not edit by hand.\n" +
    "-->",
);
sections.push("# Langfuse Design");
sections.push(
  "> Langfuse's design and brand system - logo, typography, color palette,\n" +
    "> design tokens, and product UI patterns. Langfuse is the open source AI\n" +
    "> engineering platform. Brand assets and the full download package live at\n" +
    "> https://langfuse.com/brand.",
);

sections.push("## Get the Agent Skill");
sections.push(
  "The canonical, versioned guidelines and design tokens are maintained as an\n" +
    "Agent Skill. Install them with a single command:",
);
sections.push("```sh\nnpx skills add langfuse/design-skill\n```");

sections.push("## Guidelines");
sections.push(
  `- [Brand guidelines](${BRAND_GUIDELINES_URL}) - logo, icon, color palette, typography, and voice for press, partner pages, and external-facing content.`,
);

sections.push("## Design tokens");
sections.push(
  "The complete Langfuse design token set, generated directly from the live app\n" +
    "theme so it always matches production. Every token below has a light value\n" +
    "and, where defined, a dark value. Always reference the semantic token in\n" +
    "code, never a raw value.",
);

for (const key of ["surface", "text", "line", "callout"]) {
  const g = groups[key];
  if (!g.rows.length) continue;
  sections.push(`### ${g.title}`);
  sections.push(renderTable(["Token", "Light", "Dark"], g.rows));
}

if (semantic.length) {
  sections.push("### Base and semantic tokens (shadcn/ui)");
  sections.push(
    "Consumed via `hsl(var(--token))` (or directly) by shadcn/ui components.",
  );
  sections.push(renderTable(["Token", "Light", "Dark"], semantic));
}

if (fontRows.length) {
  sections.push("### Typography");
  sections.push(
    renderTable(["Utility", "Token", "Primary font", "Full stack"], fontRows),
  );
}

if (radiusRows.length) {
  sections.push("### Radius");
  sections.push(renderTable(["Token", "Value", "Tailwind"], radiusRows));
}

sections.push(
  "Brand asset library and full download package: https://langfuse.com/brand",
);

const output = sections.join("\n\n") + "\n";
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, output);

const totalTokens =
  Object.values(groups).reduce((n, g) => n + g.rows.length, 0) +
  semantic.length +
  fontRows.length +
  radiusRows.length;
console.log(
  `[sync-design-tokens] Wrote ${totalTokens} token(s) to ${path.relative(repoRoot, outPath)}`,
);
