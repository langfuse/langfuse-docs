#!/usr/bin/env node

// Refreshes the pull counts in data/generated/container-pulls.json. /adoption
// fetches live counts daily (lib/container-pulls.ts) and falls back to this
// snapshot when a request fails. Run via scripts/update_package_usage.sh.
// On failure, keeps the existing file.

const fs = require("fs");
const path = require("path");

const SNAPSHOT_PATH = path.join(
  __dirname,
  "..",
  "data",
  "generated",
  "container-pulls.json",
);

async function getDockerHubPulls(repository) {
  const response = await fetch(
    `https://hub.docker.com/v2/repositories/${repository}/`,
  );
  if (!response.ok) {
    throw new Error(`Docker Hub ${repository}: ${response.status}`);
  }
  const { pull_count } = await response.json();
  if (!Number.isInteger(pull_count)) {
    throw new Error(`Docker Hub ${repository}: no pull_count`);
  }
  return pull_count;
}

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

async function updateContainerPulls() {
  try {
    const snapshot = JSON.parse(fs.readFileSync(SNAPSHOT_PATH, "utf8"));
    for (const sources of Object.values(snapshot.images)) {
      if (sources.dockerHub) {
        sources.dockerHub.pulls = await getDockerHubPulls(
          sources.dockerHub.repository,
        );
      }
      if (sources.ghcr) {
        sources.ghcr.pulls = await getGhcrPulls(sources.ghcr.package);
      }
    }
    snapshot.updated = new Date().toISOString().slice(0, 10);

    fs.writeFileSync(
      SNAPSHOT_PATH,
      `${JSON.stringify(snapshot, null, 2)}\n`,
      "utf8",
    );
    console.log(`✅ Updated ${SNAPSHOT_PATH}`);
  } catch (error) {
    // Keep the committed snapshot rather than writing partial numbers
    console.warn("⚠️ Error updating container pulls:", error.message);
  }
}

updateContainerPulls();
