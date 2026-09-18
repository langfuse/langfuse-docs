import { findJobForRole, getAshbyJobs } from "@/lib/ashby-jobs";
import {
  CAREERS_FALLBACK_URL,
  ROLES,
  ROOT_QUESTION_ID,
  TREE,
} from "./role-finder-data";
import { RoleFinderQuiz, type ResolvedRole } from "./RoleFinderQuiz";

/**
 * Server component for the careers role-finder quiz.
 *
 * Fetches listed ClickHouse jobs whose title contains "langfuse" and matches
 * each curated role by title fragments (or Ashby posting id). Live title,
 * apply URL, and availability are merged into the quiz config. If the board
 * can't be fetched, last-known posting URLs are used so "View role & apply"
 * still deep-links to a specific job — never the unfiltered board.
 */
export async function RoleFinder() {
  const jobs = await getAshbyJobs();

  const resolvedRoles = Object.fromEntries(
    (
      Object.entries(ROLES) as [
        keyof typeof ROLES,
        (typeof ROLES)[keyof typeof ROLES],
      ][]
    ).map(([key, role]) => {
      const job = findJobForRole(jobs, role.titleMatch, role.ashbyId);

      const resolved: ResolvedRole = {
        key,
        available: Boolean(job),
        title: job?.title ?? role.title,
        url: job?.jobUrl ?? role.url,
        pitch: role.pitch,
        youll: role.youll,
      };
      return [key, resolved];
    }),
  ) as Record<string, ResolvedRole>;

  const openJobs = jobs.map((job) => ({
    title: job.title,
    url: job.jobUrl,
  }));

  return (
    <RoleFinderQuiz
      roles={resolvedRoles}
      tree={TREE}
      rootId={ROOT_QUESTION_ID}
      careersFallbackUrl={CAREERS_FALLBACK_URL}
      openJobs={openJobs}
    />
  );
}
