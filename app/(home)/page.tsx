import { appendFileSync } from "node:fs";
import { Home } from "@/components/home";
import { HomeUrlProbe } from "@/components/debug/HomeUrlProbe";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function HomePage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const utm = resolvedSearchParams.utm;
  const hasUtmLastweek =
    utm === "lastweek" || (Array.isArray(utm) && utm.includes("lastweek"));

  try {
    // #region agent log
    appendFileSync(
      "/opt/cursor/logs/debug.log",
      JSON.stringify({
        hypothesisId: "A",
        location: "app/(home)/page.tsx:16",
        message: "HomePage server render",
        data: {
          searchParams: resolvedSearchParams,
          hasUtmLastweek,
        },
        timestamp: Date.now(),
      }) + "\n",
    );
    // #endregion
  } catch {}

  return (
    <>
      <HomeUrlProbe />
      <Home />
    </>
  );
}
