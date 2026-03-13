"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { getPagesUnderRoute } from "@/lib/nextra-shim/context";
import Link from "next/link";
import { Authors } from "../Authors";
import { Video } from "../Video";

export const ChangelogHeader = () => {
  const pathname = usePathname();
  const changelogPages = getPagesUnderRoute("/changelog");
  const page = changelogPages.find((p) => p.route === pathname) as {
    route?: string;
    frontMatter?: Record<string, any>;
  } | undefined;

  const frontMatter = page?.frontMatter ?? {};
  const {
    title,
    description,
    ogImage,
    ogVideo,
    gif,
    date,
    author,
    showOgInHeader,
    badge,
  } = frontMatter;

  // Parse comma-separated authors
  const authors = author
    ? author.includes(",")
      ? author.split(",").map((a) => a.trim())
      : [author.trim()]
    : [];

  return (
    <div className="md:mt-10 flex flex-col gap-10">
      <Link
        href={`/changelog${
          page.route ? "#" + page.route.replace("/changelog/", "") : ""
        }`}
        className="md:mb-10"
      >
        ← Back to changelog
      </Link>

      <div>
        <div className="text-lg text-primary/60 mb-3">
          {new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            timeZone: "UTC",
          })}
          {!!badge && ` | ${badge}`}
        </div>
        <div className="flex flex-col gap-5 md:gap-10 md:flex-row justify-between md:items-center">
          <div>
            <h1 className="text-2xl md:text-3xl text-pretty font-mono">
              {title}
            </h1>
          </div>
          <Authors authors={authors} />
        </div>
      </div>

      {showOgInHeader === false ? null : ogVideo ? (
        <Video src={ogVideo} gifStyle />
      ) : ogImage ? (
        <Image
          src={gif ?? ogImage}
          alt={title}
          width={1200}
          height={630}
          className="rounded border"
          unoptimized={
            frontMatter.gif !== undefined ||
            frontMatter.ogImage?.endsWith(".gif")
          }
        />
      ) : null}

      <p className="text-[17px]">{description}</p>
    </div>
  );
};
