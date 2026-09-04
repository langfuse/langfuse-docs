/**
 * Product landing URLs from the top-nav Product menu.
 *
 * Shared by next-sitemap.config.js (priority 0.9) and
 * scripts/generate_llms_txt.js (pin order in the docs section).
 * Keep this list in one place so a rename cannot update one consumer
 * without the other.
 *
 * Lives in CJS (not section-registry.ts) because both consumers run
 * outside the Next.js server graph and cannot import server-only modules.
 */
const PRODUCT_OVERVIEW_PATHS = [
  "/docs",
  "/docs/observability",
  "/docs/prompt-management",
  "/docs/evaluation",
  "/docs/metrics",
];

module.exports = { PRODUCT_OVERVIEW_PATHS };
