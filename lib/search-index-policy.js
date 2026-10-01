// Navigation utilities remain crawlable so crawlers can follow their links,
// but are not search landing pages. Keep them out of both sitemap inputs.
// /cloud itself is the public login landing page and stays indexable.
const SEARCH_UTILITY_PATTERNS = ["/cloud/*", "/faq/tag/*"];

function isSearchUtility(pathname) {
  return pathname.startsWith("/cloud/") || pathname.startsWith("/faq/tag/");
}

module.exports = { SEARCH_UTILITY_PATTERNS, isSearchUtility };
