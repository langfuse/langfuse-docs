import {
  type ContainerImage,
  type ContainerRegistry,
  formatPulls,
  getContainerPulls,
  getContainerRegistryUrl,
} from "@/lib/container-pulls";

/**
 * Container pull count styled like the shields.io badges in the /adoption SDK
 * table. Fetched server-side because shields.io has no GHCR badge and its
 * Docker Hub badge is often rate limited. Mirrored in lib/markdown-component-renderers.js.
 */
export async function ContainerPullsBadge({
  image,
  registry,
}: {
  image: ContainerImage;
  registry: ContainerRegistry;
}) {
  const pulls = await getContainerPulls(image, registry);
  const href = getContainerRegistryUrl(image, registry);
  if (pulls === undefined || !href) return <>–</>;

  const value = formatPulls(pulls);
  const color = image === "langfuse" ? "orange" : "grey";
  // Static badge: shields.io renders it without calling an upstream service
  const src = `https://img.shields.io/badge/%20-${encodeURIComponent(value)}-${color}?style=for-the-badge&labelColor=black`;
  const registryName = registry === "dockerHub" ? "Docker Hub" : "GHCR";

  return (
    <a href={href}>
      <img src={src} alt={`${value} ${registryName} pulls`} />
    </a>
  );
}
