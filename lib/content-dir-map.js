/**
 * Single source of truth: maps each content/ subdirectory name to the URL
 * path prefix it is served under.
 *
 * Consumed by:
 *   - lib/source.ts        (loader baseUrl values)
 *   - scripts/copy_md_sources.js  (md-src output paths)
 *
 * When adding a new content section, add it here so both consumers stay in sync.
 */
const CONTENT_DIR_TO_URL_PREFIX = {
  docs: "docs",
  "self-hosting": "self-hosting",
  blog: "blog",
  changelog: "changelog",
  guides: "guides",
  faq: "faq",
  integrations: "integrations",
  security: "security",
  library: "library",
  customers: "users",
  handbook: "handbook",
  marketing: "",
};

module.exports = { CONTENT_DIR_TO_URL_PREFIX };
