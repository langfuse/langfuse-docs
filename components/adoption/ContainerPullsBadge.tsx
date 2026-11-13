import {
  type ContainerImage,
  formatPulls,
  getContainerPulls,
  getContainerRegistryUrl,
} from "@/lib/container-pulls";

/**
 * All-time container pulls, summed across Docker Hub, GHCR, and ECR Public,
 * styled like the shields.io badges in the /adoption SDK table. Fetched
 * server-side because shields.io has no GHCR or ECR Public badge and its
 * Docker Hub badge is often rate limited. Mirrored in lib/markdown-component-renderers.js.
 */
export async function ContainerPullsBadge({
  image,
}: {
  image: ContainerImage;
}) {
  const value = formatPulls(await getContainerPulls(image));
  const color = image === "langfuse" ? "orange" : "grey";
  // Static badge: shields.io renders it without calling an upstream service
  const src = `https://img.shields.io/badge/%20-${encodeURIComponent(value)}-${color}?style=for-the-badge&labelColor=black`;

  return (
    <a href={getContainerRegistryUrl(image)}>
      <img src={src} alt={`${value} container pulls`} />
    </a>
  );
}
