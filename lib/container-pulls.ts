import snapshot from "@/data/generated/container-pulls.json";

export type ContainerImage = keyof typeof snapshot.images;
type ContainerRegistry = "dockerHub" | "ghcr" | "ecrPublic";

// Refetch at most daily; the committed snapshot covers failed or slow requests
const REVALIDATE_SECONDS = 60 * 60 * 24;
const TIMEOUT_MS = 5_000;

type Source = {
  repository?: string;
  package?: string;
  registryAlias?: string;
  pulls: number;
};

function getSources(image: ContainerImage): [ContainerRegistry, Source][] {
  return Object.entries(snapshot.images[image]) as [
    ContainerRegistry,
    Source,
  ][];
}

async function fetchDockerHubPulls(repository: string): Promise<number> {
  const response = await fetch(
    `https://hub.docker.com/v2/repositories/${repository}/`,
    {
      next: { revalidate: REVALIDATE_SECONDS },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    },
  );
  if (!response.ok) throw new Error(`Docker Hub ${response.status}`);
  const { pull_count } = await response.json();
  if (!Number.isInteger(pull_count)) throw new Error("No pull_count");
  return pull_count;
}

// GHCR has no public API for download counts; read them from the package page
async function fetchGhcrPulls(packagePath: string): Promise<number> {
  const response = await fetch(`https://github.com/${packagePath}`, {
    headers: { "User-Agent": "langfuse-docs" },
    next: { revalidate: REVALIDATE_SECONDS },
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!response.ok) throw new Error(`GHCR ${response.status}`);
  const match = (await response.text()).match(
    /Total downloads[\s\S]{0,300}?title="(\d+)"/,
  );
  if (!match) throw new Error("Download count not found");
  return Number(match[1]);
}

// The ECR Public Gallery's own API, which serves the counts shown on gallery.ecr.aws
async function fetchEcrPublicPulls(
  registryAlias: string,
  repository: string,
): Promise<number> {
  const response = await fetch(
    "https://api.us-east-1.gallery.ecr.aws/getRepositoryCatalogData",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        registryAliasName: registryAlias,
        repositoryName: repository,
      }),
      next: { revalidate: REVALIDATE_SECONDS },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    },
  );
  if (!response.ok) throw new Error(`ECR Public ${response.status}`);
  const downloadCount = (await response.json()).insightData?.downloadCount;
  if (!Number.isInteger(downloadCount)) throw new Error("No downloadCount");
  return downloadCount;
}

function fetchPulls(registry: ContainerRegistry, source: Source) {
  switch (registry) {
    case "dockerHub":
      return fetchDockerHubPulls(source.repository!);
    case "ghcr":
      return fetchGhcrPulls(source.package!);
    case "ecrPublic":
      return fetchEcrPublicPulls(source.registryAlias!, source.repository!);
  }
}

/** All-time pulls summed across registries, each live with a fallback to the committed snapshot. */
export async function getContainerPulls(
  image: ContainerImage,
): Promise<number> {
  const counts = await Promise.all(
    getSources(image).map(async ([registry, source]) => {
      try {
        // Counts only grow; guard against a parsed value from changed markup
        return Math.max(await fetchPulls(registry, source), source.pulls);
      } catch {
        return source.pulls;
      }
    }),
  );
  return counts.reduce((sum, count) => sum + count, 0);
}

/** Page of the image's first registry in the snapshot. */
export function getContainerRegistryUrl(image: ContainerImage): string {
  const [registry, source] = getSources(image)[0];
  switch (registry) {
    case "dockerHub":
      return `https://hub.docker.com/r/${source.repository}`;
    case "ghcr":
      return `https://github.com/${source.package}`;
    case "ecrPublic":
      return `https://gallery.ecr.aws/${source.registryAlias}/${source.repository}`;
  }
}

/** Mirrored in lib/markdown-component-renderers.js. */
export function formatPulls(count: number): string {
  // Round before picking the unit so 999,500+ shows as 1.0M, not 1000K
  const thousands = Math.round(count / 1_000);
  if (thousands >= 1_000) return `${(count / 1_000_000).toFixed(1)}M`;
  return `${thousands}K`;
}
