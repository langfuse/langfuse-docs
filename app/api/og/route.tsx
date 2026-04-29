import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";
import { SITE_DEFAULT_OG_DESCRIPTION } from "@/lib/og-url";

export const runtime = "edge";

function wrapWords(text: string, maxChars: number): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (test.length <= maxChars) {
      line = test;
    } else {
      if (line) lines.push(line);
      line = word;
    }
  }
  if (line) lines.push(line);
  return lines.length ? lines : [""];
}

/**
 * Split a string into "tokens" that can be laid out independently.
 * Latin/space-delimited text stays as whole words; CJK characters become
 * individual tokens so they can wrap at any character boundary.
 */
function tokenize(text: string): string[] {
  const tokens: string[] = [];
  let buf = "";
  for (const ch of text) {
    const cp = ch.codePointAt(0)!;
    if (/\s/.test(ch)) {
      if (buf) { tokens.push(buf); buf = ""; }
      continue;
    }
    if (isCjkOrFullWidth(cp)) {
      if (buf) { tokens.push(buf); buf = ""; }
      tokens.push(ch);
    } else {
      buf += ch;
    }
  }
  if (buf) tokens.push(buf);
  return tokens;
}

/** ~average char width for F37 (panel / two-line checks). */
const ANALOG_CHAR_EM = 0.48;
/**
 * Stricter `length × em` for title *packing* and span one-line width — must be pessimistic
 * or Satori soft-wraps a second line inside the yellow `span` (and highlights look wrong).
 */
const TITLE_LONG_LINE_EM = 0.56;
/** Extra guard against Satori measuring text slightly wider than our estimator. */
const TITLE_RENDER_SAFETY = 1.03;
const TITLE_SPAN_H_PADDING_X = 24;
const TITLE_TEXT_LINE_FRAC = 1;
const INTER_CHAR_EM = 0.52;
const TITLE_LINE_GAP = 10;
/** Line height for title glyphs (must be ≥ ~1 for no vertical overlap when wrapping). */
const TITLE_LINE_HEIGHT = 1.1;
const DESC_LINE_GAP = 3;
/** Smaller steps at the end so long titles can shrink until rows fit the title band height. */
const TITLE_FONT_SIZES = [
  108, 96, 88, 80, 72, 64, 56, 48, 42, 36, 34, 32, 30, 28, 26, 24, 22, 20,
];
/** Extra steps at the top for very short single-line titles only. */
const TITLE_SINGLE_LINE_FONT_SIZES = [
  120, 112, ...TITLE_FONT_SIZES,
];
/** Long-title search includes the same large sizes as single-line (then steps down). */
const TITLE_LONG_TITLE_FONT_SIZES = [120, 112, ...TITLE_FONT_SIZES];
const DESC_FONT_SIZES = [26, 24, 22, 20, 18, 16, 14, 13, 12];
const TITLE_MAX_REFINE_FS = 120;

/**
 * CJK and other full-width characters render at roughly 1em while Latin
 * letters average around the given `em` fraction.  Count effective character
 * units so width estimation works for mixed-script titles (e.g. Japanese).
 */
function effectiveCharCount(line: string, em: number): number {
  let units = 0;
  for (const ch of line) {
    const cp = ch.codePointAt(0)!;
    if (isCjkOrFullWidth(cp)) {
      units += 1.0 / em;
    } else {
      units += 1;
    }
  }
  return units;
}

function isCjkOrFullWidth(cp: number): boolean {
  return (
    (cp >= 0x2e80 && cp <= 0x9fff) ||  // CJK radicals, kangxi, ideographs
    (cp >= 0xf900 && cp <= 0xfaff) ||  // CJK compatibility ideographs
    (cp >= 0xfe30 && cp <= 0xfe4f) ||  // CJK compatibility forms
    (cp >= 0xff01 && cp <= 0xff60) ||  // fullwidth Latin + halfwidth forms start
    (cp >= 0xffe0 && cp <= 0xffe6) ||  // fullwidth signs
    (cp >= 0x20000 && cp <= 0x2fa1f) || // CJK unified ext B–F, compat supplement
    (cp >= 0x3000 && cp <= 0x303f) ||  // CJK symbols and punctuation
    (cp >= 0x3040 && cp <= 0x309f) ||  // Hiragana
    (cp >= 0x30a0 && cp <= 0x30ff) ||  // Katakana
    (cp >= 0x31f0 && cp <= 0x31ff) ||  // Katakana phonetic extensions
    (cp >= 0xac00 && cp <= 0xd7af)     // Hangul syllables
  );
}

function hasCjk(text: string): boolean {
  for (const ch of text) {
    if (isCjkOrFullWidth(ch.codePointAt(0)!)) return true;
  }
  return false;
}

function approxLineWidthPx(line: string, fontSize: number, em: number): number {
  return effectiveCharCount(line, em) * fontSize * em;
}

/** Two lines using an approximate pixel budget (never wider than the panel). */
function splitTwoLinesByWidth(
  title: string,
  fontSize: number,
  innerW: number
): string[] | null {
  const budget = innerW;
  const cjk = hasCjk(title);
  const words = cjk
    ? tokenize(title)
    : title.trim().split(/\s+/).filter(Boolean);
  if (words.length <= 1) return null;
  const join = cjk ? joinTokens : (t: string[]) => t.join(" ");
  let best: string[] | null = null;
  let bestImbalance = Infinity;
  for (let cut = 1; cut < words.length; cut++) {
    const l1 = join(words.slice(0, cut));
    const l2 = join(words.slice(cut));
    if (
      approxLineWidthPx(l1, fontSize, ANALOG_CHAR_EM) <= budget &&
      approxLineWidthPx(l2, fontSize, ANALOG_CHAR_EM) <= budget
    ) {
      const imbalance = Math.abs(
        approxLineWidthPx(l1, fontSize, ANALOG_CHAR_EM) -
        approxLineWidthPx(l2, fontSize, ANALOG_CHAR_EM)
      );
      if (imbalance < bestImbalance) {
        bestImbalance = imbalance;
        best = [l1, l2];
      }
    }
  }
  return best;
}

function splitTwoLines(title: string, maxCharsPerLine: number): string[] | null {
  const cjk = hasCjk(title);
  const words = cjk
    ? tokenize(title)
    : title.trim().split(/\s+/).filter(Boolean);
  if (words.length <= 1) return null;
  const join = cjk ? joinTokens : (t: string[]) => t.join(" ");
  let best: string[] | null = null;
  let bestImbalance = Infinity;
  for (let cut = 1; cut < words.length; cut++) {
    const l1 = join(words.slice(0, cut));
    const l2 = join(words.slice(cut));
    if (l1.length <= maxCharsPerLine && l2.length <= maxCharsPerLine) {
      const imbalance = Math.abs(l1.length - l2.length);
      if (imbalance < bestImbalance) {
        bestImbalance = imbalance;
        best = [l1, l2];
      }
    }
  }
  return best;
}

function titleStackHeight(
  lineCount: number,
  fontSize: number,
  lineGap: number
): number {
  const perLine = fontSize * TITLE_LINE_HEIGHT + 14;
  return lineCount * perLine + (lineCount - 1) * lineGap;
}

/** True if a single row is wider than the panel (approximate; avoids splitting valid two-line pairs). */
function lineExceedsPanelWidth(
  line: string,
  fontSize: number,
  innerW: number
): boolean {
  return approxLineWidthPx(line, fontSize, ANALOG_CHAR_EM) > innerW * 1.02;
}

/** Usable text width inside the full-width title row (yellow span horizontal padding). */
function titleTextBudgetWidthPx(innerW: number): number {
  return Math.max(40, innerW - TITLE_SPAN_H_PADDING_X) * TITLE_TEXT_LINE_FRAC;
}

/**
 * Join tokens back into display text: CJK tokens are adjacent without spaces;
 * Latin tokens are separated by spaces.
 */
function joinTokens(tokens: string[]): string {
  if (tokens.length === 0) return "";
  let result = tokens[0];
  for (let i = 1; i < tokens.length; i++) {
    const prevCjk = hasCjk(tokens[i - 1]);
    const curCjk = hasCjk(tokens[i]);
    if (prevCjk && curCjk) {
      result += tokens[i];
    } else {
      result += " " + tokens[i];
    }
  }
  return result;
}

/**
 * Pack words into rows: each row is the longest prefix that still fits the text budget.
 * This matches one yellow row = one visual line (no `wrapWords` char cap that then soft-wraps in Satori).
 * Uses tokenize() for CJK-aware splitting so characters can wrap mid-"word".
 */
function greedyWordsToTitleRows(
  title: string,
  fontSize: number,
  innerW: number
): string[] {
  const tokens = hasCjk(title)
    ? tokenize(title)
    : title.trim().split(/\s+/).filter(Boolean);
  if (tokens.length === 0) {
    return [""];
  }
  const join = hasCjk(title) ? joinTokens : (t: string[]) => t.join(" ");
  const budget = titleTextBudgetWidthPx(innerW);
  const rows: string[] = [];
  let start = 0;
  while (start < tokens.length) {
    let end = start;
    for (let j = start + 1; j <= tokens.length; j++) {
      const candidate = join(tokens.slice(start, j));
      if (
        approxLineWidthPx(candidate, fontSize, TITLE_LONG_LINE_EM) *
          TITLE_RENDER_SAFETY <=
        budget
      ) {
        end = j;
      } else {
        break;
      }
    }
    if (end === start) {
      rows.push(tokens[start]);
      start += 1;
    } else {
      rows.push(join(tokens.slice(start, end)));
      start = end;
    }
  }
  return rows;
}

function titleLinesFitRenderConstraints(
  lines: string[],
  fontSize: number,
  innerW: number,
  innerH: number
): boolean {
  if (titleStackHeight(lines.length, fontSize, TITLE_LINE_GAP) > innerH) {
    return false;
  }
  const textBudget = titleTextBudgetWidthPx(innerW);
  for (const line of lines) {
    if (lineExceedsPanelWidth(line, fontSize, innerW)) {
      return false;
    }
    if (
      approxLineWidthPx(line, fontSize, TITLE_LONG_LINE_EM) *
        TITLE_RENDER_SAFETY >
      textBudget
    ) {
      return false;
    }
  }
  return true;
}

/**
 * Reflow only lines that actually exceed the panel width (char-based wrap as fallback).
 * Do not use raw char counts — that splits "Open Source Engineering" / "LLM Platform" into 3 rows.
 */
function normalizeTitleLines(
  lines: string[],
  fontSize: number,
  innerW: number
): string[] {
  const mc = Math.max(6, Math.floor(innerW / (fontSize * ANALOG_CHAR_EM)));
  const out: string[] = [];
  for (const line of lines) {
    if (!lineExceedsPanelWidth(line, fontSize, innerW)) {
      out.push(line);
    } else {
      out.push(...wrapWords(line, mc));
    }
  }
  return out.length ? out : [""];
}

function titleRowWidthPx(innerW: number): number {
  return innerW;
}

function tryTwoLineLayout(
  lines: string[],
  fontSize: number,
  innerW: number,
  innerH: number
): { fontSize: number; lines: string[] } | null {
  if (lines.length !== 2) return null;
  if (!titleLinesFitRenderConstraints(lines, fontSize, innerW, innerH))
    return null;
  return { fontSize, lines };
}

/**
 * Split title into exactly `targetLines` contiguous rows under the title budget.
 * Objective: minimize worst slack first, then total slack (fuller and more balanced rows).
 */
function splitTitleIntoBalancedLines(
  title: string,
  fontSize: number,
  innerW: number,
  targetLines: number
): string[] | null {
  const cjk = hasCjk(title);
  const words = cjk
    ? tokenize(title)
    : title.trim().split(/\s+/).filter(Boolean);
  const join = cjk ? joinTokens : (t: string[]) => t.join(" ");
  const n = words.length;
  if (targetLines < 1 || targetLines > n) return null;
  const budget = titleTextBudgetWidthPx(innerW);

  const width: number[][] = Array.from({ length: n }, () =>
    Array.from({ length: n }, () => Number.POSITIVE_INFINITY)
  );
  for (let i = 0; i < n; i++) {
    let line = "";
    for (let j = i; j < n; j++) {
      line = join(words.slice(i, j + 1));
      const w =
        approxLineWidthPx(line, fontSize, TITLE_LONG_LINE_EM) *
        TITLE_RENDER_SAFETY;
      if (w > budget) break;
      width[i][j] = w;
    }
  }

  type Score = { maxSlack: number; totalSlack: number };
  const better = (a: Score, b: Score): boolean => {
    if (a.maxSlack !== b.maxSlack) return a.maxSlack < b.maxSlack;
    return a.totalSlack < b.totalSlack;
  };
  const INF: Score = {
    maxSlack: Number.POSITIVE_INFINITY,
    totalSlack: Number.POSITIVE_INFINITY,
  };

  const dp: Score[][] = Array.from({ length: targetLines + 1 }, () =>
    Array.from({ length: n + 1 }, () => ({ ...INF }))
  );
  const prev: number[][] = Array.from({ length: targetLines + 1 }, () =>
    Array.from({ length: n + 1 }, () => -1)
  );
  dp[0][0] = { maxSlack: 0, totalSlack: 0 };

  for (let k = 1; k <= targetLines; k++) {
    for (let end = k; end <= n; end++) {
      for (let start = k - 1; start < end; start++) {
        const prevScore = dp[k - 1][start];
        if (!Number.isFinite(prevScore.maxSlack)) continue;
        const w = width[start][end - 1];
        if (!Number.isFinite(w)) continue;
        const slack = budget - w;
        const cand: Score = {
          maxSlack: Math.max(prevScore.maxSlack, slack),
          totalSlack: prevScore.totalSlack + slack,
        };
        if (better(cand, dp[k][end])) {
          dp[k][end] = cand;
          prev[k][end] = start;
        }
      }
    }
  }

  if (!Number.isFinite(dp[targetLines][n].maxSlack)) return null;

  const out: string[] = [];
  let end = n;
  for (let k = targetLines; k >= 1; k--) {
    const start = prev[k][end];
    if (start < 0) return null;
    out.push(join(words.slice(start, end)));
    end = start;
  }
  out.reverse();
  return out;
}

function titleLineFillMinRatio(
  lines: string[],
  fontSize: number,
  innerW: number
): number {
  const budget = titleTextBudgetWidthPx(innerW);
  if (budget <= 0 || lines.length === 0) return 0;
  let minRatio = 1;
  for (const line of lines) {
    const ratio =
      approxLineWidthPx(line, fontSize, TITLE_LONG_LINE_EM) / budget;
    minRatio = Math.min(minRatio, Math.max(0, Math.min(1, ratio)));
  }
  return minRatio;
}

function titleLineFillAvgRatio(
  lines: string[],
  fontSize: number,
  innerW: number
): number {
  const budget = titleTextBudgetWidthPx(innerW);
  if (budget <= 0 || lines.length === 0) return 0;
  let sum = 0;
  for (const line of lines) {
    const ratio =
      approxLineWidthPx(line, fontSize, TITLE_LONG_LINE_EM) / budget;
    sum += Math.max(0, Math.min(1, ratio));
  }
  return sum / lines.length;
}

function scoreLongTitleCandidate(
  candidate: { fontSize: number; lines: string[] },
  innerW: number
): number {
  const minFill = titleLineFillMinRatio(candidate.lines, candidate.fontSize, innerW);
  const avgFill = titleLineFillAvgRatio(candidate.lines, candidate.fontSize, innerW);
  // Emphasize larger type while still rewarding fuller horizontal usage.
  return candidate.fontSize * (0.72 * minFill + 0.28 * avgFill);
}

function fitTitleLayoutLongAtLineCount(
  title: string,
  innerW: number,
  innerH: number,
  targetLines: number
): { fontSize: number; lines: string[] } | null {
  let first: { fontSize: number; lines: string[] } | null = null;
  for (const fontSize of TITLE_LONG_TITLE_FONT_SIZES) {
    const pair = splitTitleIntoBalancedLines(
      title,
      fontSize,
      innerW,
      targetLines
    );
    if (!pair) continue;
    if (!titleLinesFitRenderConstraints(pair, fontSize, innerW, innerH)) continue;
    first = { fontSize, lines: pair };
    break;
  }
  if (!first) return null;
  let { fontSize: maxFs, lines: maxLines } = first;
  for (let f = first.fontSize + 1; f <= TITLE_MAX_REFINE_FS; f += 1) {
    const pair = splitTitleIntoBalancedLines(title, f, innerW, targetLines);
    if (!pair) continue;
    if (!titleLinesFitRenderConstraints(pair, f, innerW, innerH)) continue;
    maxFs = f;
    maxLines = pair;
  }
  return { fontSize: maxFs, lines: maxLines };
}

function isLongTitle(title: string): boolean {
  const t = title.trim();
  if (t.length > 105) return true;
  if (hasCjk(t) && effectiveCharCount(t, ANALOG_CHAR_EM) > 105) return true;
  const words = t.split(/\s+/).filter(Boolean);
  return words.length > 14;
}

/** Prefer one huge line (e.g. “LLM Platform”) — must run before two-line heuristics. */
function isShortTitle(title: string): boolean {
  const t = title.trim();
  if (!t) return false;
  if (hasCjk(t)) return false;
  const words = t.split(/\s+/).filter(Boolean);
  return words.length <= 3 && t.length <= 36;
}

function fitTitleLayoutSingleLine(
  title: string,
  innerW: number,
  innerH: number
): { fontSize: number; lines: string[] } | null {
  const text = title.trim();
  for (const fontSize of TITLE_SINGLE_LINE_FONT_SIZES) {
    if (!titleLinesFitRenderConstraints([text], fontSize, innerW, innerH))
      continue;
    return { fontSize, lines: [text] };
  }
  return null;
}

/**
 * Long titles: `greedyWordsToTitleRows` maxes out each row’s width, so the largest font
 * for the *minimum* achievable row count (when height/width checks pass) uses horizontal
 * space. Pick min line count, then the largest font that achieves it (first hit in
 * descending size order).
 */
function fitTitleLayoutLong(
  title: string,
  innerW: number,
  innerH: number
): { fontSize: number; lines: string[] } {
  if (!title.trim()) {
    return { fontSize: 36, lines: [""] };
  }

  const candidateTwoLine = fitTitleLayoutLongAtLineCount(
    title,
    innerW,
    innerH,
    2
  );
  const candidateThreeLine = fitTitleLayoutLongAtLineCount(
    title,
    innerW,
    innerH,
    3
  );
  const candidateFourLine = fitTitleLayoutLongAtLineCount(
    title,
    innerW,
    innerH,
    4
  );

  let minLines = Number.POSITIVE_INFINITY;
  for (const fontSize of TITLE_LONG_TITLE_FONT_SIZES) {
    const lines = greedyWordsToTitleRows(title, fontSize, innerW);
    if (titleLinesFitRenderConstraints(lines, fontSize, innerW, innerH)) {
      minLines = Math.min(minLines, lines.length);
    }
  }

  let bestMinLine: { fontSize: number; lines: string[] } | null = null;
  if (minLines < Number.POSITIVE_INFINITY) {
    let first: { fontSize: number; lines: string[] } | null = null;
    for (const fontSize of TITLE_LONG_TITLE_FONT_SIZES) {
      const lines = splitTitleIntoBalancedLines(title, fontSize, innerW, minLines);
      if (!lines) continue;
      if (
        titleLinesFitRenderConstraints(lines, fontSize, innerW, innerH) &&
        lines.length === minLines
      ) {
        first = { fontSize, lines };
        break;
      }
    }
    if (first) {
      let { fontSize: maxFs, lines: maxLines } = first;
      for (let f = first.fontSize + 1; f <= TITLE_MAX_REFINE_FS; f += 1) {
        const tryLines = splitTitleIntoBalancedLines(title, f, innerW, minLines);
        if (!tryLines) continue;
        if (
          titleLinesFitRenderConstraints(tryLines, f, innerW, innerH) &&
          tryLines.length === minLines
        ) {
          maxFs = f;
          maxLines = tryLines;
        }
      }
      bestMinLine = { fontSize: maxFs, lines: maxLines };
    }
  }

  const chooseBetter = (
    a: { fontSize: number; lines: string[] } | null,
    b: { fontSize: number; lines: string[] } | null
  ): { fontSize: number; lines: string[] } | null => {
    if (!a) return b;
    if (!b) return a;
    const scoreA = scoreLongTitleCandidate(a, innerW);
    const scoreB = scoreLongTitleCandidate(b, innerW);
    if (scoreA !== scoreB) {
      return scoreA > scoreB ? a : b;
    }
    if (a.fontSize !== b.fontSize) {
      return a.fontSize > b.fontSize ? a : b;
    }
    return a.lines.length <= b.lines.length ? a : b;
  };

  const bestStructured = chooseBetter(
    chooseBetter(chooseBetter(candidateTwoLine, candidateThreeLine), candidateFourLine),
    bestMinLine
  );
  if (bestStructured) return bestStructured;

  let best: { fontSize: number; lines: string[] } | null = null;
  for (const fontSize of TITLE_FONT_SIZES) {
    const lines = greedyWordsToTitleRows(title, fontSize, innerW);
    if (!titleLinesFitRenderConstraints(lines, fontSize, innerW, innerH)) {
      continue;
    }
    if (
      !best ||
      lines.length < best.lines.length ||
      (lines.length === best.lines.length && fontSize > best.fontSize)
    ) {
      best = { fontSize, lines };
    }
  }
  if (best) {
    return best;
  }
  let fs = TITLE_FONT_SIZES[TITLE_FONT_SIZES.length - 1];
  let lines = greedyWordsToTitleRows(title, fs, innerW);
  while (titleStackHeight(lines.length, fs, TITLE_LINE_GAP) > innerH && fs > 12) {
    fs -= 2;
    lines = greedyWordsToTitleRows(title, fs, innerW);
  }
  return { fontSize: Math.max(12, fs), lines };
}

function fitTitleLayout(
  title: string,
  innerW: number,
  innerH: number
): { fontSize: number; lines: string[] } {
  if (isLongTitle(title)) {
    return fitTitleLayoutLong(title, innerW, innerH);
  }

  if (isShortTitle(title)) {
    const single = fitTitleLayoutSingleLine(title, innerW, innerH);
    if (single) return single;
  }

  const splitSlack = [0, 2, 4, 6, 10, 14];

  // 1) Two lines from approximate rendered width (panel-wide budget only).
  for (const fontSize of TITLE_FONT_SIZES) {
    const pair = splitTwoLinesByWidth(title, fontSize, innerW);
    if (pair) {
      const ok = tryTwoLineLayout(pair, fontSize, innerW, innerH);
      if (ok) return ok;
    }
  }

  // 2) Two lines from character budget + slack (fallback).
  for (const fontSize of TITLE_FONT_SIZES) {
    const baseMc = Math.max(8, Math.floor(innerW / (fontSize * ANALOG_CHAR_EM)));
    for (const s of splitSlack) {
      const mc = baseMc + s;
      const pair = splitTwoLines(title, mc);
      if (pair) {
        const ok = tryTwoLineLayout(pair, fontSize, innerW, innerH);
        if (ok) return ok;
      }
    }
  }

  // 3) Exactly two lines from word-wrap.
  for (const fontSize of TITLE_FONT_SIZES) {
    const maxChars = Math.max(8, Math.floor(innerW / (fontSize * ANALOG_CHAR_EM)));
    const wrapped = wrapWords(title, maxChars);
    if (wrapped.length === 2) {
      const ok = tryTwoLineLayout(wrapped, fontSize, innerW, innerH);
      if (ok) return ok;
    }
  }

  // 4) Fewest wrapped lines possible, then largest font.
  let best: { fontSize: number; lines: string[] } | null = null;
  for (const fontSize of TITLE_FONT_SIZES) {
    const maxChars = Math.max(8, Math.floor(innerW / (fontSize * ANALOG_CHAR_EM)));
    const wrapped = wrapWords(title, maxChars);
    const normalized = normalizeTitleLines(wrapped, fontSize, innerW);
    const h = titleStackHeight(normalized.length, fontSize, TITLE_LINE_GAP);
    if (h > innerH) continue;
    if (
      !best ||
      normalized.length < best.lines.length ||
      (normalized.length === best.lines.length && fontSize > best.fontSize)
    ) {
      best = { fontSize, lines: normalized };
    }
  }
  if (best) return best;

  const fs = TITLE_FONT_SIZES[TITLE_FONT_SIZES.length - 1];
  const maxChars = Math.max(6, Math.floor(innerW / (fs * ANALOG_CHAR_EM)));
  return {
    fontSize: fs,
    lines: normalizeTitleLines(wrapWords(title, maxChars), fs, innerW),
  };
}

function descStackHeight(
  lineCount: number,
  fontSize: number,
  lineHeight: number,
  lineGap: number
): number {
  return lineCount * fontSize * lineHeight + (lineCount - 1) * lineGap;
}

function fitDescLayout(
  text: string,
  innerW: number,
  innerH: number
): { fontSize: number; lines: string[] } {
  const lineHeight = 1.36;

  for (const fontSize of DESC_FONT_SIZES) {
    const mc = Math.max(
      10,
      Math.floor(innerW / (fontSize * INTER_CHAR_EM))
    );
    const lines = wrapWords(text, mc);
    const h = descStackHeight(lines.length, fontSize, lineHeight, DESC_LINE_GAP);
    if (h <= innerH) {
      return { fontSize, lines };
    }
  }

  const fs = DESC_FONT_SIZES[DESC_FONT_SIZES.length - 1];
  const mc = Math.max(8, Math.floor(innerW / (fs * INTER_CHAR_EM)));
  return { fontSize: fs, lines: wrapWords(text, mc) };
}

function toDataUrl(buffer: ArrayBuffer, mime: string): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  // `fromCharCode(...subarray)` can exceed the engine's max call/spread size on Edge; use `apply` with bounded chunks.
  const chunk = 0x2000; // 8192, safe for apply
  for (let i = 0; i < bytes.length; i += chunk) {
    const sub = bytes.subarray(i, i + chunk);
    binary += String.fromCharCode.apply(
      null,
      sub as unknown as number[]
    );
  }
  return `data:${mime};base64,${btoa(binary)}`;
}

/**
 * Background image with decorators (light beige, geometric corner elements)..
 */
const OG_BG_PATH = "/og-bg.png";

const CANVAS_W = 1200;
const CANVAS_H = 630;
/**
 * Inset over `public/og-bg.png` — template inner panel (~x 86–1113). Branding + top
 * caption live in the PNG; we only overlay title + description (bands below y ~170).
 */
const CONTENT_INSET_X = 86;
const CONTENT_W = CANVAS_W - CONTENT_INSET_X * 2; // 1028
/** Top of the title band (below header + divider baked into the asset). */
const CONTENT_TOP = 172;
/** Vertical band where the baked logo + right-side tagline sit; section label aligns to this. */
const HEADER_TOP = 102;
const HEADER_HEIGHT = 40;
/** Left offset of the section label relative to `CONTENT_INSET_X` (sits right of the logo). */
const SECTION_LABEL_LEFT_OFFSET = 215;
const TITLE_BAND_H = 238;
const DESC_BAND_H = 138;
/** Spacer so the middle divider in the PNG stays visible between title and description. */
const BETWEEN_BANDS_H = 2;
/** Minimum padding from the template panel on all sides for title + description. */
const MIN_EDGE = 28;
/** Extra vertical padding inside the title band (horizontal still uses MIN_EDGE). */
const TITLE_PAD_Y = 24;
const BG_COLOR = "#f6f6f3";

export async function GET(request: NextRequest) {
  const base = new URL("/", request.url).toString();
  // Try to load the background image (decorators); fall back gracefully if not present.
  const bgUrl = new URL(OG_BG_PATH, base);
  const [ogBgData, fontAnalog, fontInter] = await Promise.all([
    fetch(bgUrl).then((r) => (r.ok ? r.arrayBuffer() : Promise.resolve(null))),
    fetch(new URL("/fonts/F37Analog-Medium.ttf", base)).then((r) => r.arrayBuffer()),
    fetch(new URL("/fonts/Inter-Regular.ttf", base)).then((r) => r.arrayBuffer()),
  ]);

  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title")?.trim() || "Langfuse";
  const sectionLabel = searchParams.get("section")?.trim() || undefined;

  const rawDescription = searchParams.get("description") ?? undefined;
  const descriptionText =
    rawDescription?.trim() ||
    SITE_DEFAULT_OG_DESCRIPTION;

  const titleInnerW = CONTENT_W - MIN_EDGE * 2;
  const titleInnerH = TITLE_BAND_H - TITLE_PAD_Y * 2;
  const titleFit = fitTitleLayout(title, titleInnerW, titleInnerH);
  const titleLinesDisplay = titleFit.lines;

  const descInnerW = CONTENT_W - MIN_EDGE * 2;
  const descInnerH = DESC_BAND_H - MIN_EDGE * 2;
  const descFit = fitDescLayout(descriptionText, descInnerW, descInnerH);

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          position: "relative",
          width: CANVAS_W,
          height: CANVAS_H,
          backgroundColor: BG_COLOR,
        }}
      >
        {/* Background with decorators — shown only when og-bg.png is present */}
        {ogBgData ? (
          <img
            src={toDataUrl(ogBgData, "image/png")}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: CANVAS_W,
              height: CANVAS_H,
            }}
          />
        ) : null}

        {sectionLabel ? (
          <div
            style={{
              display: "flex",
              position: "absolute",
              left: CONTENT_INSET_X + SECTION_LABEL_LEFT_OFFSET,
              top: HEADER_TOP,
              height: HEADER_HEIGHT,
              alignItems: "center",
              fontFamily: "Inter",
              fontWeight: 400,
              fontSize: 24,
              lineHeight: 1,
              color: "#9b9b96",
            }}
          >
            {sectionLabel}
          </div>
        ) : null}

        {/* Content column */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            position: "absolute",
            left: CONTENT_INSET_X,
            top: CONTENT_TOP,
            width: CONTENT_W,
            height: TITLE_BAND_H + BETWEEN_BANDS_H + DESC_BAND_H,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "flex-start",
              height: TITLE_BAND_H,
              padding: `${TITLE_PAD_Y}px ${MIN_EDGE}px`,
              boxSizing: "border-box",
              flexShrink: 0,
            }}
          >
            {/* Each line gets its own highlight strip; gap creates space between lines */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "flex-start",
                gap: TITLE_LINE_GAP,
                width: titleInnerW,
                height: titleInnerH,
                flexShrink: 0,
              }}
            >
              {titleLinesDisplay.map((line, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    width: titleRowWidthPx(titleInnerW),
                    justifyContent: "flex-start",
                    alignItems: "flex-start",
                  }}
                >
                  <span
                    style={{
                      backgroundColor: "#fbff7a",
                      fontFamily: "F37Analog",
                      fontWeight: 500,
                      fontSize: titleFit.fontSize,
                      lineHeight: TITLE_LINE_HEIGHT,
                      whiteSpace: "nowrap",
                      color: "#222220",
                      padding: "6px 12px",
                    }}
                  >
                    {line}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ height: BETWEEN_BANDS_H, width: CONTENT_W, flexShrink: 0 }} />

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "flex-start",
              height: DESC_BAND_H,
              padding: MIN_EDGE,
              boxSizing: "border-box",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: descInnerW,
                gap: DESC_LINE_GAP,
              }}
            >
              {descFit.lines.map((line, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    fontFamily: "Inter",
                    fontWeight: 400,
                    fontSize: descFit.fontSize,
                    lineHeight: 1.36,
                    color: "#3d3d38",
                    textAlign: "left",
                  }}
                >
                  {line}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: CANVAS_W,
      height: CANVAS_H,
      fonts: [
        { name: "F37Analog", data: fontAnalog, style: "normal", weight: 500 },
        { name: "Inter", data: fontInter, style: "normal", weight: 400 },
      ],
    }
  );
}
