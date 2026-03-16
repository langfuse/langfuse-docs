import { Suspense } from "react";
import { ChangelogIndex } from "@/components/changelog/ChangelogIndex";
import type { ChangelogPageItem } from "@/components/changelog/ChangelogIndex";
import { Header } from "@/components/Header";
import { ProductUpdateSignup } from "@/components/productUpdateSignup";
import Link from "next/link";
import { getPagesForRoute } from "@/lib/source";

/** Keep only serializable fields so we can pass pages to a client component. */
function toSerializableChangelogPage(
  p: (ReturnType<typeof getPagesForRoute>[number] & { route: string })
): ChangelogPageItem {
  const fm = p.frontMatter ?? {};
  return {
    route: p.route,
    name: p.name ?? p.title,
    title: p.title,
    frontMatter: {
      title: typeof fm.title === "string" ? fm.title : undefined,
      description: typeof fm.description === "string" ? fm.description : undefined,
      date: typeof fm.date === "string" ? fm.date : undefined,
      ogImage: typeof fm.ogImage === "string" ? fm.ogImage : undefined,
      ogVideo: typeof fm.ogVideo === "string" ? fm.ogVideo : undefined,
      gif: typeof fm.gif === "string" ? fm.gif : undefined,
      badge: typeof fm.badge === "string" ? fm.badge : undefined,
    },
  };
}

export default function ChangelogIndexPage() {
  const rawPages = getPagesForRoute("/changelog");
  const pages: ChangelogPageItem[] = rawPages
    .filter((p) => p.route !== "/changelog")
    .sort(
      (a, b) =>
        new Date((b.frontMatter?.date as string) ?? 0).getTime() -
        new Date((a.frontMatter?.date as string) ?? 0).getTime()
    )
    .map(toSerializableChangelogPage);

  return (
    <div className="px-4 md:container md:px-0">
      <div className="flex flex-col items-center content-center text-center my-10">
        <Header
          title="Changelog"
          description={
            <>
              Latest release updates from the Langfuse team. Check out our{" "}
              <Link href="/docs/roadmap" className="underline">
                Roadmap
              </Link>{" "}
              to see what&apos;s next.
            </>
          }
          className="mb-8"
          h="h1"
        />
        <div className="mb-8">
          <ProductUpdateSignup source="changelog" />
        </div>
      </div>
      <Suspense fallback={<div className="min-h-[400px] animate-pulse rounded-md bg-muted/50" />}>
        <ChangelogIndex pages={pages} />
      </Suspense>
    </div>
  );
}
