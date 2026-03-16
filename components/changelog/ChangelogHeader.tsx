"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Authors } from "../Authors";
import { Video } from "../Video";
import { useChangelogFrontMatter } from "./ChangelogFrontMatterContext";

export const ChangelogHeader = () => {
  const pathname = usePathname();
  const frontMatter = useChangelogFrontMatter();
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

  // Derive slug from current path for the back-link anchor
  const slug = pathname.replace(/^\/changelog\//, "");

  return (
    <div className="mt-4 md:mt-10 flex flex-col gap-2 md:gap-4">
      <Link
        href={`/changelog#${slug}`}
        className="no-underline hover:no-underline mb-2"
      >
        ← Back to changelog
      </Link>

      <div>
        <div className="flex flex-wrap items-center gap-2 text-lg text-primary/60 mb-2 md:mb-3">
          {date &&
            new Date(date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
              timeZone: "UTC",
            })}
          {!!badge && (
            <span className="inline-block px-2 py-1 text-xs font-bold rounded-md bg-muted text-muted-foreground">
              {badge}
            </span>
          )}
        </div>
        <div className="flex flex-col gap-2 md:gap-6 md:flex-row justify-between md:items-center">
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
          src={(gif ?? ogImage) as string}
          alt={title ?? ""}
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
