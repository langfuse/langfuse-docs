const { CONTENT_DIR_TO_URL_PREFIX } = require("./content-dir-map.js");

const ENGINEERING_PATH = `/${CONTENT_DIR_TO_URL_PREFIX.resources}/engineering`;

/** Shared scope for the rendered resource footer and Markdown/PDF exports.
 * @param {string} pathname
 */
function hasResourceSignupCta(pathname) {
  return (
    pathname === ENGINEERING_PATH || pathname.startsWith(`${ENGINEERING_PATH}/`)
  );
}

module.exports = { hasResourceSignupCta };
