/**
 * Fetches live Langfuse roles from Ashby's public posting API.
 *
 * After the ClickHouse acquisition, Langfuse postings live on the ClickHouse
 * board and are identified by "langfuse" in the job title. The dedicated
 * Langfuse board is kept as a secondary source in case it is republished.
 *
 * This uses only the public job-board endpoint — no Ashby API key is required.
 * Unpublished, draft, or internal jobs are not visible. Results are cached
 * with ISR (revalidated hourly).
 */

const ASHBY_JOB_BOARD_API_BASE =
  "https://api.ashbyhq.com/posting-api/job-board";
const CLICKHOUSE_BOARD_SLUG = "clickhouse";
const LANGFUSE_BOARD_SLUG = "langfuse";

/** Public ClickHouse board. `?search=` is not a reliable Ashby deep link. */
export const LANGFUSE_CAREERS_BOARD_URL = "https://jobs.ashbyhq.com/clickhouse";

export function ashbyJobUrl(id: string): string {
  return `https://jobs.ashbyhq.com/clickhouse/${id}`;
}

/**
 * Last-known listed Langfuse postings. Used when the live board cannot be
 * fetched (Vercel SSG cannot cache the 2MB+ ClickHouse payload). Apply links
 * must stay on these posting URLs — never the board search page.
 */
export const FALLBACK_LANGFUSE_JOBS: AshbyJob[] = [
  {
    id: "0087feaa-a275-427d-bf4a-14a508708687",
    title: "Langfuse - Senior Product Engineer",
    jobUrl: ashbyJobUrl("0087feaa-a275-427d-bf4a-14a508708687"),
    isListed: true,
  },
  {
    id: "31500bec-b690-4795-b4d6-0dce06a4c180",
    title: "Langfuse - Senior Backend Engineer",
    jobUrl: ashbyJobUrl("31500bec-b690-4795-b4d6-0dce06a4c180"),
    isListed: true,
  },
  {
    id: "cf36e6db-3939-4ff0-8bcf-a3bb200d9e46",
    title: "Langfuse - Senior Cloud Infra Engineer",
    jobUrl: ashbyJobUrl("cf36e6db-3939-4ff0-8bcf-a3bb200d9e46"),
    isListed: true,
  },
  {
    id: "49953f5a-271a-492f-a8be-50b8f028fbd7",
    title: "Langfuse - DevRel Engineer, Events & Community (EMEA)",
    jobUrl: ashbyJobUrl("49953f5a-271a-492f-a8be-50b8f028fbd7"),
    isListed: true,
  },
  {
    id: "3b71c9a9-d3c9-4331-83e7-1a9007455b5e",
    title: "Langfuse - Product Marketing Manager",
    jobUrl: ashbyJobUrl("3b71c9a9-d3c9-4331-83e7-1a9007455b5e"),
    isListed: true,
  },
  {
    id: "bb3fd808-a87e-4b63-b675-f3ce55f4d1a6",
    title: "Solutions Architect - Langfuse",
    jobUrl: ashbyJobUrl("bb3fd808-a87e-4b63-b675-f3ce55f4d1a6"),
    isListed: true,
  },
];

export type AshbyJob = {
  id: string;
  title: string;
  jobUrl: string;
  applyUrl?: string;
  isListed?: boolean;
};

/** Title fragments used to match a curated quiz role to a live posting. */
export type RoleTitleMatch = {
  /** At least one of these strings must appear in the job title. */
  anyOf: string[];
  /** If any of these strings appear, the job is not a match. */
  exclude?: string[];
};

export function isLangfuseJobTitle(title: string | undefined): boolean {
  return (title ?? "").toLowerCase().includes("langfuse");
}

export function isListedJob(job: AshbyJob | null | undefined): job is AshbyJob {
  return Boolean(job?.id && job.isListed !== false);
}

/**
 * Merge the ClickHouse and Langfuse public boards into the Langfuse job set.
 *
 * - ClickHouse: keep listed jobs whose title contains "langfuse".
 * - Langfuse board: keep every listed job (the whole board is Langfuse).
 *
 * Returns `null` when we cannot tell whether roles are open (both fetches
 * failed, or ClickHouse failed and the Langfuse board is empty) so callers
 * can fall back to static config instead of hiding everything.
 */
export function collectLangfuseJobs(
  clickhouse: AshbyJob[] | null,
  langfuse: AshbyJob[] | null,
): AshbyJob[] | null {
  if (clickhouse === null) {
    if (langfuse === null) return null;
    const listed = langfuse.filter(isListedJob);
    return listed.length > 0 ? listed : null;
  }

  const byId = new Map<string, AshbyJob>();
  for (const job of clickhouse) {
    if (isListedJob(job) && isLangfuseJobTitle(job.title)) {
      byId.set(job.id, job);
    }
  }
  for (const job of langfuse ?? []) {
    if (isListedJob(job)) byId.set(job.id, job);
  }
  return Array.from(byId.values());
}

export function jobMatchesRole(
  job: AshbyJob,
  match: RoleTitleMatch,
  ashbyId?: string,
): boolean {
  if (ashbyId && job.id === ashbyId) return true;
  if (!isListedJob(job)) return false;

  const title = job.title.toLowerCase();
  if (match.exclude?.some((term) => title.includes(term.toLowerCase()))) {
    return false;
  }
  return match.anyOf.some((term) => title.includes(term.toLowerCase()));
}

export function findJobForRole(
  jobs: AshbyJob[],
  match: RoleTitleMatch,
  ashbyId?: string,
): AshbyJob | undefined {
  if (ashbyId) {
    const exact = jobs.find((job) => job.id === ashbyId && isListedJob(job));
    if (exact) return exact;
  }

  const matches = jobs.filter((job) => jobMatchesRole(job, match));
  if (matches.length <= 1) return matches[0];

  // Prefer the posting whose title contains the longest matching fragment.
  return [...matches].sort((a, b) => {
    const score = (job: AshbyJob) =>
      Math.max(
        0,
        ...match.anyOf
          .filter((term) =>
            job.title.toLowerCase().includes(term.toLowerCase()),
          )
          .map((term) => term.length),
      );
    return score(b) - score(a);
  })[0];
}

function slimJob(job: Partial<AshbyJob> | null | undefined): AshbyJob | null {
  if (!job?.id) return null;
  return {
    id: job.id,
    title: job.title ?? "",
    jobUrl: job.jobUrl ?? "",
    applyUrl: job.applyUrl,
    isListed: job.isListed,
  };
}

async function fetchJobBoard(slug: string): Promise<AshbyJob[] | null> {
  try {
    // The ClickHouse board payload is >2MB (full HTML descriptions), which
    // Next.js cannot store in its data cache. Skip that cache and keep only
    // the fields we match on.
    const response = await fetch(`${ASHBY_JOB_BOARD_API_BASE}/${slug}`, {
      headers: {
        Accept: "application/json",
        "User-Agent": "langfuse.com/role-finder",
      },
      cache: "no-store",
      signal: AbortSignal.timeout(20_000),
    });

    if (!response.ok) {
      console.error(
        `Failed to fetch Ashby job board (${slug}): ${response.status} ${response.statusText}`,
      );
      return null;
    }

    const data = (await response.json()) as { jobs?: Partial<AshbyJob>[] };
    if (!Array.isArray(data.jobs)) return null;
    return data.jobs
      .map(slimJob)
      .filter((job): job is AshbyJob => job !== null);
  } catch (error) {
    console.error(`Failed to fetch Ashby job board (${slug})`, error);
    return null;
  }
}

const JOBS_CACHE_TTL_MS = 60 * 60 * 1000;

let jobsCache: { jobs: AshbyJob[] | null; expiresAt: number } | null = null;

/**
 * Returns listed Langfuse jobs. Prefers the live ClickHouse board; if that
 * fetch fails (common at Vercel build time because the payload is >2MB),
 * returns {@link FALLBACK_LANGFUSE_JOBS} so apply links stay posting-specific.
 */
export async function getAshbyJobs(): Promise<AshbyJob[]> {
  if (jobsCache && Date.now() < jobsCache.expiresAt && jobsCache.jobs) {
    return jobsCache.jobs;
  }

  const [clickhouse, langfuse] = await Promise.all([
    fetchJobBoard(CLICKHOUSE_BOARD_SLUG),
    fetchJobBoard(LANGFUSE_BOARD_SLUG),
  ]);
  const jobs = collectLangfuseJobs(clickhouse, langfuse);
  if (jobs) {
    jobsCache = { jobs, expiresAt: Date.now() + JOBS_CACHE_TTL_MS };
    return jobs;
  }
  return FALLBACK_LANGFUSE_JOBS;
}
