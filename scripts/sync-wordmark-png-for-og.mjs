#!/usr/bin/env node
/**
 * Renders public/langfuse-wordart-white.svg → the brand-assets PNG used by
 * app/api/og/route.tsx and scripts/generate-default-og-png.mjs.
 * Run after updating the root white wordmark SVG, then: node scripts/generate-default-og-png.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const src = path.join(root, "public/langfuse-wordart-white.svg");
const out = path.join(
  root,
  "public/brand-assets/wordmark/Langfuse/dark/langfuse-wordart-white.png"
);

await sharp(fs.readFileSync(src)).png().toFile(out);
console.log(`Wrote ${path.relative(root, out)}`);
