/** Marketing usage stats. Update these when public metrics change. */

export const SDK_INSTALLS_PER_MONTH = 130_000_000;
export const DOCKER_PULLS = 6_000_000;
export const FORTUNE_500_COMPANIES = 129;
export const FORTUNE_50_COMPANIES = 21;
/** Companies using Langfuse (Cloud + self-hosted), not paying customers. */
export const COMPANIES = 50_000;

export function formatCompanyCount() {
  return `${COMPANIES.toLocaleString("en-US")}+`;
}
