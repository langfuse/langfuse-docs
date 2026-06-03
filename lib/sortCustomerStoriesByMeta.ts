import customerMeta from "@/content/customers/meta.json";

/** Slug order from `content/customers/meta.json` (excluding the index page). */
const CUSTOMER_PAGE_ORDER = customerMeta.pages.filter((p) => p !== "index");

function slugFromCustomerRoute(route: string): string {
  const trimmed = route.replace(/\/$/, "");
  const segments = trimmed.split("/").filter(Boolean);
  return segments[segments.length - 1] ?? "";
}

/**
 * `usersSource.getPages()` order follows the content scan order (not `meta.json`).
 * Use this so the Users grid and homepage carousel match the sidebar / meta order.
 */
export function sortCustomerStoriesByMetaOrder<T extends { route: string }>(
  stories: T[],
): T[] {
  return [...stories].sort((a, b) => {
    const slugA = slugFromCustomerRoute(a.route);
    const slugB = slugFromCustomerRoute(b.route);
    const idxA = CUSTOMER_PAGE_ORDER.indexOf(slugA);
    const idxB = CUSTOMER_PAGE_ORDER.indexOf(slugB);
    const orderA = idxA === -1 ? Number.MAX_SAFE_INTEGER : idxA;
    const orderB = idxB === -1 ? Number.MAX_SAFE_INTEGER : idxB;
    return orderA - orderB;
  });
}
