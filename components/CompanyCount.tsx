import { formatCompanyCount } from "@/lib/usage-stats";

/**
 * Inline company-count mention for MDX prose. Update the number in
 * lib/usage-stats.ts, not here.
 */
export function CompanyCount() {
  return <>{formatCompanyCount()}</>;
}
