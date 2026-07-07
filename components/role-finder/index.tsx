import { getAshbyJobs } from "@/lib/ashby-jobs";
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
 * Fetches the live Ashby job board (cached via ISR in `getAshbyJobs`) and merges
 * each role's live title, apply URL, and availability into the curated config
 * before handing off to the client engine. If the board can't be fetched, roles
 * fall back to the static config and stay available so the quiz keeps working.
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
      const job = jobs?.[role.ashbyId];
      // When the board fetch succeeds, availability = the posting exists and
      // is listed. When it fails (jobs === null) we can't know, so assume the
      // role is open and use the static fallback data.
      const available = jobs ? Boolean(job && job.isListed !== false) : true;

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

  return (
    <RoleFinderQuiz
      roles={resolvedRoles}
      tree={TREE}
      rootId={ROOT_QUESTION_ID}
      careersFallbackUrl={CAREERS_FALLBACK_URL}
    />
  );
}
