import snapshot from "@/data/generated/container-pulls.json";

export type ContainerImage = keyof typeof snapshot.images;
export type ContainerRegistry = "dockerHub" | "ghcr";

// Refetch at most daily; the committed snapshot covers failed or slow requests
const REVALIDATE_SECONDS = 60 * 60 * 24;
const TIMEOUT_MS = 5_000;

type Source = { repository?: string; package?: string; pulls: number };

function getSource(
  image: ContainerImage,
  registry: ContainerRegistry,
): Source | undefined {
  return (snapshot.images[image] as Partial<Record<ContainerRegistry, Source>>)[
    registry
  ];
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

/** Live pull count, falling back to the committed snapshot. Undefined if the image is not published there. */
export async function getContainerPulls(
  image: ContainerImage,
  registry: ContainerRegistry,
): Promise<number | undefined> {
  const source = getSource(image, registry);
  if (!source) return undefined;
  try {
    const live =
      registry === "dockerHub"
        ? await fetchDockerHubPulls(source.repository!)
        : await fetchGhcrPulls(source.package!);
    // Counts only grow; guard against a parsed value from changed markup
    return Math.max(live, source.pulls);
  } catch {
    return source.pulls;
  }
}

export function getContainerRegistryUrl(
  image: ContainerImage,
  registry: ContainerRegistry,
): string | undefined {
  const source = getSource(image, registry);
  if (!source) return undefined;
  return registry === "dockerHub"
    ? `https://hub.docker.com/r/${source.repository}`
    : `https://github.com/${source.package}`;
}

/** Mirrored in scripts/update-container-pulls.js and lib/markdown-component-renderers.js. */
export function formatPulls(count: number): string {
  // Round before picking the unit so 999,500+ shows as 1.0M, not 1000K
  const thousands = Math.round(count / 1_000);
  if (thousands >= 1_000) return `${(count / 1_000_000).toFixed(1)}M`;
  return `${thousands}K`;
}
