#!/usr/bin/env node

// Snapshots the star-history.com chart used on /adoption so the page does not
// depend on the third-party API at view time. On failure, keeps the existing file.

const fs = require("fs");
const path = require("path");

const REPOS = [
  "langfuse/langfuse",
  "mlflow/mlflow",
  "comet-ml/opik",
  "arize-ai/phoenix",
  "pydantic/logfire",
];
const STAR_HISTORY_URL = `https://api.star-history.com/svg?repos=${REPOS.join(",")}&type=Date`;
const OUTPUT_PATH = path.join(
  __dirname,
  "..",
  "public",
  "images",
  "adoption",
  "star-history.svg",
);

async function updateStarHistory() {
  try {
    console.log("Fetching star history chart...");

    const response = await fetch(STAR_HISTORY_URL, {
      headers: { "User-Agent": "langfuse-docs" },
    });

    if (!response.ok) {
      throw new Error(
        `star-history request failed: ${response.status} ${response.statusText}`,
      );
    }

    const svg = await response.text();

    // An error or rate-limit response is a small SVG without the chart lines
    if (!svg.startsWith("<svg") || svg.length < 10_000) {
      throw new Error(
        "Unexpected star-history response, keeping existing chart",
      );
    }

    fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
    fs.writeFileSync(OUTPUT_PATH, svg, "utf8");
    console.log(`✅ Updated ${OUTPUT_PATH}`);
  } catch (error) {
    // Do not fail the job: the committed snapshot stays valid
    console.warn("⚠️ Error updating star history:", error.message);
  }
}

updateStarHistory();
