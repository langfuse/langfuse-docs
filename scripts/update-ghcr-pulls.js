#!/usr/bin/env node

// Writes data/generated/ghcr-pulls.json: all-time GHCR download counts of each
// platform's server image, read by shields.io dynamic badges on /adoption.
// Docker Hub counts use live shields.io badges; GHCR has no API or badge.
// Run via scripts/update_package_usage.sh. On failure, keeps the existing file.

const fs = require("fs");
const path = require("path");

const OUTPUT_PATH = path.join(
  __dirname,
  "..",
  "data",
  "generated",
  "ghcr-pulls.json",
);

// Keys match the `query` of the badges in content/marketing/adoption.mdx
const PACKAGES = {
  langfuse: "langfuse/langfuse/pkgs/container/langfuse",
  mlflow: "mlflow/mlflow/pkgs/container/mlflow",
  opik: "comet-ml/opik/pkgs/container/opik%2Fopik-backend",
};

// GHCR has no public API for download counts; read them from the package page
async function getGhcrPulls(packagePath) {
  const response = await fetch(`https://github.com/${packagePath}`, {
    headers: { "User-Agent": "langfuse-docs" },
  });
  if (!response.ok) {
    throw new Error(`GHCR ${packagePath}: ${response.status}`);
  }
  const html = await response.text();
  const match = html.match(/Total downloads[\s\S]{0,300}?title="(\d+)"/);
  if (!match) {
    throw new Error(`GHCR ${packagePath}: download count not found`);
  }
  return Number(match[1]);
}

function formatPulls(count) {
  // Round before picking the unit so 999,500+ shows as 1.0M, not 1000K
  const thousands = Math.round(count / 1_000);
  if (thousands >= 1_000) return `${(count / 1_000_000).toFixed(1)}M`;
  return `${thousands}K`;
}

async function updateGhcrPulls() {
  try {
    const pulls = {};
    for (const [key, packagePath] of Object.entries(PACKAGES)) {
      pulls[key] = formatPulls(await getGhcrPulls(packagePath));
    }
    pulls.updated = new Date().toISOString().slice(0, 10);

    fs.writeFileSync(
      OUTPUT_PATH,
      `${JSON.stringify(pulls, null, 2)}\n`,
      "utf8",
    );
    console.log(`✅ Wrote ${OUTPUT_PATH}`);
  } catch (error) {
    // Keep the committed counts rather than writing partial numbers
    console.warn("⚠️ Error updating GHCR pulls:", error.message);
  }
}

updateGhcrPulls();
