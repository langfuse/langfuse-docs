/**
 * Shim for nextra/hooks. useData() was used with getStaticProps in Nextra;
 * Fumadocs/App Router does not use getStaticProps for MDX, so we return an empty object.
 * Pages that need runtime data should use client-side fetch (e.g. a dedicated component).
 */
export function useData(): Record<string, unknown> {
  return {};
}
