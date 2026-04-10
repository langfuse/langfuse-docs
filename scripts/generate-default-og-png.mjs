#!/usr/bin/env node
/**
 * Writes public/og.png — static fallback (e.g. static export) that mirrors the
 * dynamic /api/og card layout: black background, white wordmark header bar with
 * tagline, then "Langfuse" title + description. Uses satori (same renderer as
 * @vercel/og) + sharp. Regenerate after wordmark or layout changes.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import satori from "satori";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const wordmarkPath = path.join(
  root,
  "public/brand-assets/wordmark/Langfuse/dark/langfuse-wordart-white.png"
);
const fontMonoPath = path.join(root, "public/fonts/GeistMono-Medium.ttf");
const fontSansPath = path.join(root, "public/fonts/Geist-Regular.ttf");
const outPath = path.join(root, "public/og.png");

const W = 1200;
const H = 630;

const WORDMARK_ASPECT = 2233 / 527;
function wordmarkSize(h) {
  return { height: h, width: Math.round(h * WORDMARK_ASPECT) };
}

const wordmarkBuf = fs.readFileSync(wordmarkPath);
const wordmarkDataUri = `data:image/png;base64,${wordmarkBuf.toString("base64")}`;
const fontMono = fs.readFileSync(fontMonoPath);
const fontSans = fs.readFileSync(fontSansPath);

const title = "Langfuse \u2013 Open Source LLM Engineering Platform";
const description =
  "Traces, evals, prompt management and metrics to debug and improve your LLM application.";

const headerWordmark = wordmarkSize(50);

const svg = await satori(
  {
    type: "div",
    props: {
      style: {
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
        backgroundColor: "#000000",
        fontFamily: "GeistSans",
        color: "#fff",
        padding: 0,
        fontWeight: 500,
        fontSize: 40,
      },
      children: [
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              gap: 24,
              alignItems: "center",
              padding: 40,
              paddingLeft: 80,
              paddingRight: 80,
              borderBottom: "3px solid #aaa",
            },
            children: [
              {
                type: "img",
                props: {
                  src: wordmarkDataUri,
                  ...headerWordmark,
                },
              },
              {
                type: "span",
                props: {
                  style: { fontWeight: 400, fontSize: 28, color: "#ccc" },
                  children: "Open Source LLM Engineering Platform",
                },
              },
            ],
          },
        },
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              flex: 1,
              alignItems: "flex-start",
              justifyContent: "center",
              flexDirection: "column",
              gap: 10,
              padding: 80,
              paddingTop: 40,
            },
            children: [
              {
                type: "div",
                props: {
                  style: {
                    fontWeight: 500,
                    fontSize: 60,
                    lineHeight: "4rem",
                    fontFamily: "GeistMono",
                  },
                  children: title,
                },
              },
              {
                type: "div",
                props: {
                  style: { color: "#ddd", paddingTop: "20px" },
                  children: description,
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
      { name: "GeistMono", data: fontMono, style: "normal" },
      { name: "GeistSans", data: fontSans, style: "normal" },
    ],
  }
);

await sharp(Buffer.from(svg)).png().toFile(outPath);

console.log(`Wrote ${outPath}`);
