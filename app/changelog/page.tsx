import { Suspense } from "react";
import { ChangelogIndex } from "@/components/changelog/ChangelogIndex";
import type { ChangelogPageItem } from "@/components/changelog/ChangelogIndex";
import { Header } from "@/components/Header";
import { ProductUpdateSignup } from "@/components/ProductUpdateSignup";
import Link from "next/link";
import { changelogSource } from "@/lib/source";

export default function ChangelogIndexPage() {
  const pages: ChangelogPageItem[] = changelogSource
    .getPages()
    .filter((p) => p.url !== "/changelog")
    .sort(
      (a, b) =>
        new Date((b.data.date as string) ?? 0).getTime() -
        new Date((a.data.date as string) ?? 0).getTime()
    )
    .map((p) => ({
      route: p.url,
      name: p.data.title,
      title: p.data.title,
      frontMatter: {
        title: p.data.title,
        description: p.data.description as string | undefined,
        date: p.data.date as string | undefined,
        ogImage: p.data.ogImage as string | undefined,
        ogVideo: p.data.ogVideo as string | undefined,
        gif: p.data.gif as string | undefined,
        badge: p.data.badge as string | undefined,
      },
    }));

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
