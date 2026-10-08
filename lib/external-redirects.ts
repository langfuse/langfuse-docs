/**
 * Same-origin paths that 307/302 to an absolute http(s) URL
 * (see lib/redirects.js). Soft-navigating them with next/link (or
 * fumadocs-core/link) issues an RSC fetch against the external Location and
 * can blank the page with "This page couldn't load".
 *
 * Keep in sync with every http(s) destination in lib/redirects.js —
 * lib/external-redirects.test.ts asserts that.
 */
export const externalRedirects: Record<string, string> = {
  "/loom-gpt4-PR":
    "https://www.loom.com/share/5c044ca77be44ff7821967834dd70cba",
  "/terms":
    "https://clickhouse.com/legal/clickhouse-general-terms-and-conditions",
  "/security/dpa":
    "https://clickhouse.com/legal/agreements/data-processing-addendum",
  "/dpa": "https://clickhouse.com/legal/agreements/data-processing-addendum",
  "/security/subprocessors":
    "https://clickhouse.com/legal/agreements/langfuse-subprocessors",
  "/subprocessors":
    "https://clickhouse.com/legal/agreements/langfuse-subprocessors",
  "/security/toms": "https://clickhouse.com/legal/agreements/security-addendum",
  "/toms": "https://clickhouse.com/legal/agreements/security-addendum",
  "/security/policies": "https://trust.clickhouse.com/",
  "/security/policies.md": "https://trust.clickhouse.com/",
  "/discord": "https://discord.gg/7NXusRtqYU",
  "/ph": "https://www.producthunt.com/products/langfuse",
  "/issue": "https://github.com/langfuse/langfuse/issues/new/choose",
  "/new-issue": "https://github.com/langfuse/langfuse/issues/new/choose",
  "/issues": "https://github.com/langfuse/langfuse/issues",
  "/stickers": "https://forms.gle/Af5BHpWUMZSCT4kg8?_imcp=1",
  "/sticker": "https://forms.gle/Af5BHpWUMZSCT4kg8?_imcp=1",
  "/billing-portal": "https://billing.stripe.com/p/login/6oE9BXd4u8PR2aYaEE",
  "/idea": "https://github.com/orgs/langfuse/discussions/new?category=ideas",
  "/new-idea":
    "https://github.com/orgs/langfuse/discussions/new?category=ideas",
  "/ideas": "https://github.com/orgs/langfuse/discussions/categories/ideas",
  "/gh-support":
    "https://github.com/orgs/langfuse/discussions/categories/support",
  "/discussions": "https://github.com/orgs/langfuse/discussions",
  "/gh-discussions": "https://github.com/orgs/langfuse/discussions",
  "/request-trial": "https://forms.gle/cXZuQZLmzJp8yd9k7",
  "/request-security-docs": "https://forms.gle/o5JE7vWtX7Qk2syc8",
  "/pricing-comparison-sheet":
    "https://docs.google.com/spreadsheets/d/1uCPPGwwgNMstF743UWa5OWWD4JzEFCJOk6dt31a3gXI/edit?usp=sharing",
  "/docs/reference": "https://api.reference.langfuse.com/",
  "/tos":
    "https://clickhouse.com/legal/clickhouse-general-terms-and-conditions",
};

function isHttpUrl(dest: string): boolean {
  return /^https?:\/\//.test(dest);
}

/** Resolve a same-origin short path to its off-site destination, if any. */
export function resolveExternalRedirect(
  href: string | undefined | null,
): string | undefined {
  if (!href) return undefined;

  // Already absolute — nothing to rewrite
  if (isHttpUrl(href) || href.startsWith("//")) return undefined;

  // Ignore mailto/tel/hash-only
  if (
    href.startsWith("mailto:") ||
    href.startsWith("tel:") ||
    href.startsWith("#")
  ) {
    return undefined;
  }

  // Strip query/hash for lookup; redirects are path-only
  const pathOnly = href.split(/[?#]/, 1)[0] ?? href;
  if (externalRedirects[pathOnly]) return externalRedirects[pathOnly];

  // Trailing-slash variant
  if (pathOnly.length > 1 && pathOnly.endsWith("/")) {
    const trimmed = pathOnly.slice(0, -1);
    return externalRedirects[trimmed];
  }

  return undefined;
}
