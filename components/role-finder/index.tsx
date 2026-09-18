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
 * Fetches listed ClickHouse jobs whose title contains "langfuse" (cached via
 * ISR in `getAshbyJobs`) and matches each curated role by title fragments.
 * Live title, apply URL, and availability are merged into the quiz config
 * before handing off to the client engine. If the board can't be fetched,
 * roles fall back to the static config and stay available so the quiz keeps
 * working.
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
      const job = jobs
        ? findJobForRole(jobs, role.titleMatch, role.ashbyId)
        : undefined;
      // When the board fetch succeeds, availability = a listed Langfuse
      // posting matched this role. When it fails (jobs === null) we can't
      // know, so assume the role is open and use the static fallback data.
      const available = jobs ? Boolean(job) : true;

      const resolved: ResolvedRole = {
        key,
        available,
        title: job?.title ?? role.title,
        url: job?.jobUrl ?? role.url,
        pitch: role.pitch,
        youll: role.youll,
      };
      return [key, resolved];
    }),
  ) as Record<string, ResolvedRole>;

  const openJobs = (jobs ?? []).map((job) => ({
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
