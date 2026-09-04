"use client";

import Link from "next/link";
import { CornerBox } from "@/components/ui/corner-box";
import { cn } from "@/lib/utils";
import type { BlogPageItem } from "./BlogIndex";
import { BlogPostCover } from "./BlogPostCover";
import { BlogPostMeta, postTitle } from "./BlogPostMeta";

export function BlogStoryCard({
  post,
  withStripes = false,
  className,
}: {
  post: BlogPageItem;
  withStripes?: boolean;
  className?: string;
}) {
  const title = postTitle(post);
  const description = post.frontMatter?.description;
  const image = post.frontMatter?.ogImage;

  return (
    <CornerBox
      withStripes={withStripes}
      hoverStripes={!withStripes}
      className={cn(
        "-mt-px flex min-h-[176px] flex-col overflow-hidden p-0 sm:-ml-px",
        className,
      )}
    >
      <Link
        href={post.route}
        className="group flex h-full flex-col no-underline outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <BlogPostCover
          src={image}
          alt=""
          className="aspect-[16/9] w-full"
          sizes="(max-width: 640px) 100vw, 50vw"
        />
        <div className="flex flex-1 flex-col p-5 sm:p-6">
          <BlogPostMeta post={post} className="mb-3" />
          <h3 className="m-0 font-analog text-[20px] font-medium leading-[1.15] tracking-tight text-text-primary sm:text-[21px]">
            {title}
          </h3>
          {description ? (
            <p className="mt-2 mb-0 line-clamp-2 text-[13px] leading-[1.45] text-text-tertiary">
              {description}
            </p>
          ) : null}
          <span className="mt-auto inline-flex items-center gap-1.5 pt-4 font-mono text-[11px] uppercase tracking-[0.1em] text-text-secondary transition-colors group-hover:text-text-primary">
            Read
            <span aria-hidden>→</span>
          </span>
        </div>
      </Link>
    </CornerBox>
  );
}
