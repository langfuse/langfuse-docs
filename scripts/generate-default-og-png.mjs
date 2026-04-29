#!/usr/bin/env node
/**
 * Writes public/og.png — static fallback that mirrors the white/template-based
 * dynamic /api/og layout for the homepage frontmatter title + description.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import satori from "satori";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const ogBgPath = path.join(root, "public/og-bg.png");
const fontAnalogPath = path.join(root, "public/fonts/F37Analog-Medium.ttf");
const fontInterPath = path.join(root, "public/fonts/Inter-Regular.ttf");
const outPath = path.join(root, "public/og.png");

const W = 1200;
const H = 630;
const BG_COLOR = "#f6f6f3";
const fontAnalog = fs.readFileSync(fontAnalogPath);
const fontInter = fs.readFileSync(fontInterPath);
const ogBgDataUri = `data:image/png;base64,${fs
  .readFileSync(ogBgPath)
  .toString("base64")}`;

const title = "Langfuse \u2013 Open Source LLM Engineering Platform";
const description =
  "Traces, evals, prompt management and metrics to debug and improve your LLM application.";

const CONTENT_INSET_X = 86;
const CONTENT_W = W - CONTENT_INSET_X * 2;
const CONTENT_TOP = 172;
const TITLE_BAND_H = 238;
const DESC_BAND_H = 138;
const BETWEEN_BANDS_H = 2;
const MIN_EDGE = 28;
const TITLE_PAD_Y = 24;

const ANALOG_CHAR_EM = 0.48;
const TITLE_LONG_LINE_EM = 0.56;
const TITLE_RENDER_SAFETY = 1.03;
const TITLE_SPAN_H_PADDING_X = 24;
const TITLE_TEXT_LINE_FRAC = 1;
const TITLE_LINE_GAP = 10;
const TITLE_LINE_HEIGHT = 1.1;
const DESC_LINE_GAP = 3;
const TITLE_FONT_SIZES = [96, 88, 80, 72, 64, 56, 48, 42, 36, 32, 28];
const DESC_FONT_SIZES = [26, 24, 22, 20, 18, 16];
const INTER_CHAR_EM = 0.52;

function wrapWords(text, maxChars) {
  const words = text.split(/\s+/).filter(Boolean);
  const lines = [];
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

function approxLineWidthPx(line, fontSize, em) {
  return line.length * fontSize * em;
}

function titleTextBudgetWidthPx(innerW) {
  return Math.max(40, innerW - TITLE_SPAN_H_PADDING_X) * TITLE_TEXT_LINE_FRAC;
}

function lineExceedsPanelWidth(line, fontSize, innerW) {
  return approxLineWidthPx(line, fontSize, ANALOG_CHAR_EM) > innerW * 1.02;
}

function titleStackHeight(lineCount, fontSize, lineGap) {
  const perLine = fontSize * TITLE_LINE_HEIGHT + 14;
  return lineCount * perLine + (lineCount - 1) * lineGap;
}

function titleLinesFit(lines, fontSize, innerW, innerH) {
  if (titleStackHeight(lines.length, fontSize, TITLE_LINE_GAP) > innerH) {
    return false;
  }
  const textBudget = titleTextBudgetWidthPx(innerW);
  for (const line of lines) {
    if (lineExceedsPanelWidth(line, fontSize, innerW)) {
      return false;
    }
    if (
      approxLineWidthPx(line, fontSize, TITLE_LONG_LINE_EM) * TITLE_RENDER_SAFETY >
      textBudget
    ) {
      return false;
    }
  }
  return true;
}

function splitTitleIntoBalancedLines(titleText, fontSize, innerW, targetLines) {
  const words = titleText.trim().split(/\s+/).filter(Boolean);
  const n = words.length;
  if (targetLines < 1 || targetLines > n) return null;
  const budget = titleTextBudgetWidthPx(innerW);

  const width = Array.from({ length: n }, () =>
    Array.from({ length: n }, () => Number.POSITIVE_INFINITY)
  );
  for (let i = 0; i < n; i++) {
    let line = "";
    for (let j = i; j < n; j++) {
      line = line ? `${line} ${words[j]}` : words[j];
      const w =
        approxLineWidthPx(line, fontSize, TITLE_LONG_LINE_EM) * TITLE_RENDER_SAFETY;
      if (w > budget) break;
      width[i][j] = w;
    }
  }

  const INF = { maxSlack: Number.POSITIVE_INFINITY, totalSlack: Number.POSITIVE_INFINITY };
  const dp = Array.from({ length: targetLines + 1 }, () =>
    Array.from({ length: n + 1 }, () => ({ ...INF }))
  );
  const prev = Array.from({ length: targetLines + 1 }, () =>
    Array.from({ length: n + 1 }, () => -1)
  );
  dp[0][0] = { maxSlack: 0, totalSlack: 0 };
  const better = (a, b) =>
    a.maxSlack < b.maxSlack ||
    (a.maxSlack === b.maxSlack && a.totalSlack < b.totalSlack);

  for (let k = 1; k <= targetLines; k++) {
    for (let end = k; end <= n; end++) {
      for (let start = k - 1; start < end; start++) {
        const prevScore = dp[k - 1][start];
        if (!Number.isFinite(prevScore.maxSlack)) continue;
        const w = width[start][end - 1];
        if (!Number.isFinite(w)) continue;
        const slack = budget - w;
        const cand = {
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
  const out = [];
  let end = n;
  for (let k = targetLines; k >= 1; k--) {
    const start = prev[k][end];
    if (start < 0) return null;
    out.push(words.slice(start, end).join(" "));
    end = start;
  }
  out.reverse();
  return out;
}

function pickTitleLayout(titleText, innerW, innerH) {
  for (const targetLines of [2, 3]) {
    for (const fontSize of TITLE_FONT_SIZES) {
      const lines = splitTitleIntoBalancedLines(titleText, fontSize, innerW, targetLines);
      if (!lines) continue;
      if (titleLinesFit(lines, fontSize, innerW, innerH)) {
        return { fontSize, lines };
      }
    }
  }
  const fs = TITLE_FONT_SIZES[TITLE_FONT_SIZES.length - 1];
  const mc = Math.max(8, Math.floor(innerW / (fs * ANALOG_CHAR_EM)));
  return { fontSize: fs, lines: wrapWords(titleText, mc) };
}

function descStackHeight(lineCount, fontSize, lineHeight, lineGap) {
  return lineCount * fontSize * lineHeight + (lineCount - 1) * lineGap;
}

function pickDescLayout(text, innerW, innerH) {
  const lineHeight = 1.36;
  for (const fontSize of DESC_FONT_SIZES) {
    const mc = Math.max(10, Math.floor(innerW / (fontSize * INTER_CHAR_EM)));
    const lines = wrapWords(text, mc);
    const h = descStackHeight(lines.length, fontSize, lineHeight, DESC_LINE_GAP);
    if (h <= innerH) return { fontSize, lines };
  }
  const fs = DESC_FONT_SIZES[DESC_FONT_SIZES.length - 1];
  const mc = Math.max(8, Math.floor(innerW / (fs * INTER_CHAR_EM)));
  return { fontSize: fs, lines: wrapWords(text, mc) };
}

const titleInnerW = CONTENT_W - MIN_EDGE * 2;
const titleInnerH = TITLE_BAND_H - TITLE_PAD_Y * 2;
const titleFit = pickTitleLayout(title, titleInnerW, titleInnerH);
const descInnerW = CONTENT_W - MIN_EDGE * 2;
const descInnerH = DESC_BAND_H - MIN_EDGE * 2;
const descFit = pickDescLayout(description, descInnerW, descInnerH);

const svg = await satori(
  {
    type: "div",
    props: {
      style: {
        display: "flex",
        position: "relative",
        width: W,
        height: H,
        backgroundColor: BG_COLOR,
      },
      children: [
        {
          type: "img",
          props: {
            style: {
              position: "absolute",
              top: 0,
              left: 0,
              width: W,
              height: H,
            },
            src: ogBgDataUri,
          },
        },
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              flexDirection: "column",
              position: "absolute",
              left: CONTENT_INSET_X,
              top: CONTENT_TOP,
              width: CONTENT_W,
              height: TITLE_BAND_H + BETWEEN_BANDS_H + DESC_BAND_H,
            },
            children: [
              {
                type: "div",
                props: {
                  style: {
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "flex-start",
                    height: TITLE_BAND_H,
                    padding: `${TITLE_PAD_Y}px ${MIN_EDGE}px`,
                    boxSizing: "border-box",
                    flexShrink: 0,
                  },
                  children: {
                    type: "div",
                    props: {
                      style: {
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "flex-start",
                        gap: TITLE_LINE_GAP,
                        width: titleInnerW,
                        height: titleInnerH,
                      },
                      children: titleFit.lines.map((line) => ({
                        type: "div",
                        props: {
                          style: {
                            display: "flex",
                            width: titleInnerW,
                            justifyContent: "flex-start",
                            alignItems: "flex-start",
                          },
                          children: {
                            type: "span",
                            props: {
                              style: {
                                backgroundColor: "#fbff7a",
                                fontFamily: "F37Analog",
                                fontWeight: 500,
                                fontSize: titleFit.fontSize,
                                lineHeight: TITLE_LINE_HEIGHT,
                                whiteSpace: "nowrap",
                                color: "#222220",
                                padding: "6px 12px",
                              },
                              children: line,
                            },
                          },
                        },
                      })),
                    },
                  },
                },
              },
              {
                type: "div",
                props: {
                  style: { height: BETWEEN_BANDS_H, width: CONTENT_W, flexShrink: 0 },
                },
              },
              {
                type: "div",
                props: {
                  style: {
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "flex-start",
                    height: DESC_BAND_H,
                    padding: MIN_EDGE,
                    boxSizing: "border-box",
                    flexShrink: 0,
                  },
                  children: {
                    type: "div",
                    props: {
                      style: {
                        display: "flex",
                        flexDirection: "column",
                        width: descInnerW,
                        gap: DESC_LINE_GAP,
                      },
                      children: descFit.lines.map((line) => ({
                        type: "div",
                        props: {
                          style: {
                            display: "flex",
                            fontFamily: "Inter",
                            fontWeight: 400,
                            fontSize: descFit.fontSize,
                            lineHeight: 1.36,
                            color: "#3d3d38",
                            textAlign: "left",
                          },
                          children: line,
                        },
                      })),
                    },
                  },
                },
              },
            ],
          },
        },
      ],
    },
  },
  {
    width: W,
    height: H,
    fonts: [
      { name: "F37Analog", data: fontAnalog, style: "normal", weight: 500 },
      { name: "Inter", data: fontInter, style: "normal", weight: 400 },
    ],
  }
);

await sharp(Buffer.from(svg)).png().toFile(outPath);

console.log(`Wrote ${outPath}`);
