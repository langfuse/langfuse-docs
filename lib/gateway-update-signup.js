const GATEWAY_DOCS_PATH = "/docs/gateway";

// The overview embeds the signup below its beta callout instead of at the end.
const INLINE_SIGNUP_PATHS = new Set([`${GATEWAY_DOCS_PATH}/overview`]);

/** Shared scope for the rendered gateway signup footer and Markdown exports.
 * @param {string} pathname
 */
function hasGatewaySignupFooter(pathname) {
  const normalized = pathname.replace(/\/$/, "");
  return (
    normalized.startsWith(`${GATEWAY_DOCS_PATH}/`) &&
    !INLINE_SIGNUP_PATHS.has(normalized)
  );
}

module.exports = { hasGatewaySignupFooter };
