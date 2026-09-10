// Navigation utilities remain crawlable so crawlers can follow their links,
// but are not search landing pages. Keep them out of both sitemap inputs.
const SEARCH_UTILITY_PATTERNS = ["/cloud", "/cloud/*", "/faq/tag/*"];

function isSearchUtility(pathname) {
  return (
    pathname === "/cloud" ||
    pathname.startsWith("/cloud/") ||
    pathname.startsWith("/faq/tag/")
  );
}

module.exports = { SEARCH_UTILITY_PATTERNS, isSearchUtility };
