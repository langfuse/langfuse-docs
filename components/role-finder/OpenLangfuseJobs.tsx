import { ExternalLink } from "lucide-react";

import { getAshbyJobs } from "@/lib/ashby-jobs";

/**
 * Live (or last-known) Langfuse postings with posting-specific Ashby URLs.
 * Used on /careers so "open roles" deep-links do not depend on Ashby search.
 */
export async function OpenLangfuseJobs() {
  const jobs = await getAshbyJobs();
  if (jobs.length === 0) return null;

  return (
    <div className="not-prose mx-auto w-full max-w-xl">
      <h2
        id="open-roles"
        className="text-center text-lg font-semibold tracking-tight"
      >
        Open roles
      </h2>
      <ul className="mt-4 flex flex-col gap-2">
        {jobs.map((job) => (
          <li key={job.id}>
            <a
              href={job.jobUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground underline-offset-4 hover:underline"
            >
              {job.title}
              <ExternalLink
                className="h-3.5 w-3.5 text-muted-foreground"
                aria-hidden
              />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
