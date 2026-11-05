#!/usr/bin/env node

// Builds components-mdx/adoption/container-pulls.md: pull counts of each
// platform's self-hosted server image on Docker Hub and GitHub Container
// Registry. Used on /adoption. Run via scripts/update_package_usage.sh.
// shields.io has no GHCR badge, so this is a snapshot. On failure, keeps the
// existing file.

const fs = require("fs");
const path = require("path");

const OUTPUT_PATH = path.join(
  __dirname,
  "..",
  "components-mdx",
  "adoption",
  "container-pulls.md",
);

// One server image per platform, so multi-image deployments are not double counted
const PLATFORMS = [
  {
    name: "🪢 Langfuse",
    image: "langfuse/langfuse",
    dockerHub: "langfuse/langfuse",
    ghcr: "langfuse/langfuse/pkgs/container/langfuse",
  },
  {
    name: "MLflow",
    image: "mlflow/mlflow",
    ghcr: "mlflow/mlflow/pkgs/container/mlflow",
  },
  {
    name: "Arize Phoenix",
    image: "arizephoenix/phoenix",
    dockerHub: "arizephoenix/phoenix",
  },
  {
    name: "Opik (Comet)",
    image: "comet-ml/opik/opik-backend",
    ghcr: "comet-ml/opik/pkgs/container/opik%2Fopik-backend",
  },
  {
    name: "LangSmith",
    image: "langchain/langsmith-backend",
    dockerHub: "langchain/langsmith-backend",
  },
];

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

function formatPulls(count) {
  if (count === undefined) return "–";
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
  return `${Math.round(count / 1_000)}K`;
}

async function updateContainerPulls() {
  try {
    const rows = [];
    for (const platform of PLATFORMS) {
      const dockerHub = platform.dockerHub
        ? await getDockerHubPulls(platform.dockerHub)
        : undefined;
      const ghcr = platform.ghcr
        ? await getGhcrPulls(platform.ghcr)
        : undefined;
      rows.push({
        ...platform,
        dockerHub,
        ghcr,
        total: (dockerHub ?? 0) + (ghcr ?? 0),
      });
    }
    rows.sort((a, b) => b.total - a.total);

    const date = new Date().toISOString().slice(0, 10);
    const table = [
      "| | Image | Docker Hub | GHCR | Total pulls |",
      "| --- | --- | ---: | ---: | ---: |",
      ...rows.map(
        (row) =>
          `| ${row.name} | \`${row.image}\` | ${formatPulls(row.dockerHub)} | ${formatPulls(row.ghcr)} | **${formatPulls(row.total)}** |`,
      ),
      "",
      `_Snapshot of all-time pulls from Docker Hub and GitHub Container Registry (GHCR), updated ${date}. One server image per platform. Braintrust and Pydantic Logfire do not publish public images._`,
    ].join("\n");

    fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
    fs.writeFileSync(OUTPUT_PATH, `${table}\n`, "utf8");
    console.log(`✅ Wrote ${rows.length} platforms to ${OUTPUT_PATH}`);
  } catch (error) {
    // Keep the committed snapshot rather than writing partial numbers
    console.warn("⚠️ Error updating container pulls:", error.message);
  }
}

updateContainerPulls();
