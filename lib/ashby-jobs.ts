/**
 * Fetches the live Langfuse job board from Ashby's public posting API.
 *
 * Used by the careers role-finder quiz so role titles, apply URLs, and
 * availability always reflect the current job board. Results are cached with
 * ISR (revalidated hourly) so the page stays static and cheap while staying
 * accurate without manual updates.
 */

const ASHBY_JOB_BOARD_API_URL =
  "https://api.ashbyhq.com/posting-api/job-board/langfuse";

export type AshbyJob = {
  id: string;
  title: string;
  jobUrl: string;
  applyUrl?: string;
  isListed?: boolean;
};

/** Map of Ashby posting id -> job, for O(1) lookup by id. */
export type AshbyJobMap = Record<string, AshbyJob>;

/**
 * Returns a map of live Ashby jobs keyed by posting id, or `null` if the board
 * could not be fetched. Callers should treat `null` as "unknown" and fall back
 * to their static config rather than hiding everything.
 */
export async function getAshbyJobs(): Promise<AshbyJobMap | null> {
  try {
    const response = await fetch(ASHBY_JOB_BOARD_API_URL, {
      headers: { Accept: "application/json" },
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      console.error(
        `Failed to fetch Ashby job board: ${response.status} ${response.statusText}`,
      );
      return null;
    }

    const data = (await response.json()) as { jobs?: AshbyJob[] };
    if (!Array.isArray(data.jobs)) return null;

    const map: AshbyJobMap = {};
    for (const job of data.jobs) {
      if (job?.id) map[job.id] = job;
    }
    return map;
  } catch (error) {
    console.error("Failed to fetch Ashby job board", error);
    return null;
  }
}
