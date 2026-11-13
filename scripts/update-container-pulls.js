#!/usr/bin/env node

// Refreshes the pull counts in data/generated/container-pulls.json. /adoption
// fetches live counts daily (lib/container-pulls.ts) and falls back to this
// snapshot when a request fails. Run via scripts/update_package_usage.sh.
// A source that fails to fetch keeps its previous count.

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

// The ECR Public Gallery's own API, which serves the counts shown on gallery.ecr.aws
async function getEcrPublicPulls(registryAlias, repository) {
  const response = await fetch(
    "https://api.us-east-1.gallery.ecr.aws/getRepositoryCatalogData",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        registryAliasName: registryAlias,
        repositoryName: repository,
      }),
    },
  );
  if (!response.ok) {
    throw new Error(
      `ECR Public ${registryAlias}/${repository}: ${response.status}`,
    );
  }
  const downloadCount = (await response.json()).insightData?.downloadCount;
  if (!Number.isInteger(downloadCount)) {
    throw new Error(
      `ECR Public ${registryAlias}/${repository}: no downloadCount`,
    );
  }
  return downloadCount;
}

const FETCHERS = {
  dockerHub: (source) => getDockerHubPulls(source.repository),
  ghcr: (source) => getGhcrPulls(source.package),
  ecrPublic: (source) =>
    getEcrPublicPulls(source.registryAlias, source.repository),
};

async function updateContainerPulls() {
  const snapshot = JSON.parse(fs.readFileSync(SNAPSHOT_PATH, "utf8"));
  let failures = 0;
  for (const sources of Object.values(snapshot.images)) {
    for (const [registry, source] of Object.entries(sources)) {
      try {
        source.pulls = await FETCHERS[registry](source);
      } catch (error) {
        // Keep this source's previous count; the others still refresh
        failures++;
        console.warn("⚠️ Keeping previous count:", error.message);
      }
    }
  }
  snapshot.updated = new Date().toISOString().slice(0, 10);

  fs.writeFileSync(
    SNAPSHOT_PATH,
    `${JSON.stringify(snapshot, null, 2)}\n`,
    "utf8",
  );
  console.log(`✅ Updated ${SNAPSHOT_PATH} (${failures} sources kept)`);
}

updateContainerPulls();
