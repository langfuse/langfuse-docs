/**
 * Shared helpers for next/image eligibility and whether an MDX <img>
 * should get Fumadocs ImageZoom.
 */

export const OPTIMIZED_HOSTNAMES = [
  "static.langfuse.com",
  "langfuse.com",
  "github.com",
  "raw.githubusercontent.com",
];

export function isOptimizable(src: string): boolean {
  if (!src.startsWith("http://") && !src.startsWith("https://")) return true; // local path
  try {
    const { hostname } = new URL(src);
    return OPTIMIZED_HOSTNAMES.some(
      (h) => hostname === h || hostname.endsWith(`.${h}`),
    );
  } catch {
    return false;
  }
}

const SKIP_ZOOM_SRC_RE =
  /shields\.io|badge\.fury|img\.shields|\/badge(\.|\/)|favicon|wordmark/i;

const SKIP_ZOOM_CLASS_RE = /\bno-zoom\b|\blogo\b|\bfavicon\b|\bavatar\b/;

function numericDimension(value: string | number | undefined): number | null {
  if (value === undefined || value === null || value === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

/**
 * ImageZoom is a poor fit for badges, logos, favicons, and tiny inline
 * assets. Screenshots and diagrams (local or known hosts) should zoom.
 */
export function shouldZoomMdxImage({
  src,
  width,
  height,
  className,
}: {
  src?: string | Blob;
  width?: string | number;
  height?: string | number;
  className?: string;
}): boolean {
  if (!src || typeof src !== "string") return false;
  if (className && SKIP_ZOOM_CLASS_RE.test(className)) return false;
  if (SKIP_ZOOM_SRC_RE.test(src)) return false;
  if (!isOptimizable(src)) return false;

  const w = numericDimension(width);
  const h = numericDimension(height);
  // Explicitly tiny assets (badges, icons) — skip even if the host is known.
  if (w !== null && h !== null && (w <= 48 || h <= 32)) return false;

  return true;
}
