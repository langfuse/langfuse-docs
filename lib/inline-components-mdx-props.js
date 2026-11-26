/**
 * Substitute `{props.children}` and `{props.attr}` in an imported MDX snippet
 * so parameterized components keep their page-level content in Markdown output.
 *
 * @param {string} source
 * @param {string} [attrs]
 * @param {string} [children]
 * @returns {string}
 */
function interpolateImportedMdxProps(source, attrs, children) {
  let result = source;
  const inner = (children ?? "").trim();
  result = result.replace(/\{props\.children\}/g, () => inner);
  result = result.replace(/\{children\}/g, () => inner);
  const attrPattern = /\b([A-Za-z_][\w]*)="((?:\\.|[^"\\])*)"/g;
  let match;
  while ((match = attrPattern.exec(attrs ?? "")) !== null) {
    const name = match[1];
    const value = match[2].replace(/\\"/g, '"');
    result = result.split(`{props.${name}}`).join(value);
  }
  return result;
}

module.exports = { interpolateImportedMdxProps };
