import {
  V4_CUTOVER_DATE_ISO,
  V4_CUTOVER_DATE_LONG,
} from "@/lib/v4-migration-dates";

/**
 * Inline mention of the Langfuse Cloud v4 cutover date, for use inside MDX
 * prose, callouts, and table cells. Renders as e.g. "November 16, 2026 (2026-11-16)".
 * Update the source date in lib/v4-migration-dates.ts, not here.
 */
export function V4CutoverDate() {
  return (
    <>
      <strong>{V4_CUTOVER_DATE_LONG}</strong> (
      <code>{V4_CUTOVER_DATE_ISO}</code>)
    </>
  );
}
