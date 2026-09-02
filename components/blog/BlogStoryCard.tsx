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
  featured = false,
  flush = false,
  className,
}: {
  post: BlogPageItem;
  withStripes?: boolean;
  featured?: boolean;
  flush?: boolean;
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
        "flex flex-col overflow-hidden p-0",
        !flush && "-mt-px sm:-ml-px",
        featured ? "min-h-[280px] sm:min-h-[360px]" : "min-h-[176px]",
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
          className={cn(
            "w-full",
            featured
              ? "aspect-[16/10] min-h-[180px] sm:min-h-[240px]"
              : "aspect-[16/9]",
          )}
          sizes={
            featured
              ? "(max-width: 1024px) 100vw, 60vw"
              : "(max-width: 640px) 100vw, 50vw"
          }
        />
        <div className="flex flex-1 flex-col p-5 sm:p-6">
          <BlogPostMeta post={post} className="mb-3" />
          <h3
            className={cn(
              "m-0 font-analog font-medium leading-[1.15] tracking-tight text-text-primary",
              featured
                ? "text-[24px] sm:text-[32px] lg:text-[36px]"
                : "text-[20px] sm:text-[21px]",
            )}
          >
            {title}
          </h3>
          {description ? (
            <p
              className={cn(
                "mt-2 mb-0 text-[13px] leading-[1.45] text-text-tertiary",
                featured ? "line-clamp-3 max-w-[52ch]" : "line-clamp-2",
              )}
            >
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
