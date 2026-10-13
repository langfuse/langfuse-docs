// The frozen legacy spec links to the hosted reference by relative path, which
// does not exist on this site; its tag anchors also predate the current ones.
const CURRENT_REFERENCE_URL = "https://api.reference.langfuse.com";
const RENAMED_TAGS: Record<string, string> = {
  metricsv2: "metrics",
  observationsv2: "observations",
};
const RELATIVE_REFERENCE_LINK = /\]\(\/api-reference#tag\/([a-z0-9]+)\//g;

export function rewriteLegacySpecLinks(text: string): string {
  return text.replace(
    RELATIVE_REFERENCE_LINK,
    (_, tag: string) =>
      `](${CURRENT_REFERENCE_URL}/#tag/${RENAMED_TAGS[tag] ?? tag}/`,
  );
}
