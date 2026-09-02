"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { BlogPageItem } from "./BlogIndex";
import { BlogIndexBar } from "./BlogIndexBar";
import { BlogPostCover } from "./BlogPostCover";
import { BlogTagChip, postTitle } from "./BlogPostMeta";
import { formatDate, primaryTag } from "./utils";

const ROTATE_MS = 5500;

export function BlogHero({ posts }: { posts: BlogPageItem[] }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || posts.length < 2) return;
    const id = window.setInterval(() => {
      setActive((prev) => (prev + 1) % posts.length);
    }, ROTATE_MS);
    return () => window.clearInterval(id);
  }, [paused, posts.length]);

  if (posts.length === 0) return null;

  const post = posts[active] ?? posts[0];
  const title = postTitle(post);
  const description = post.frontMatter?.description;
  const image = post.frontMatter?.ogImage;
  const tag = primaryTag(post.frontMatter?.tag);
  const author = post.frontMatter?.author;
  const date = formatDate(post.frontMatter?.date);

  return (
    <section
      className="relative overflow-hidden border-y border-line-structure bg-surface-bg text-text-primary"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="Featured posts"
    >
      <div className="relative grid lg:min-h-[560px] lg:grid-cols-[minmax(0,1.15fr)_minmax(240px,0.85fr)]">
        <div className="relative flex min-w-0 flex-col px-6 py-10 sm:px-8 lg:py-12">
          <BlogIndexBar
            className="relative z-20 mb-8"
            extra={
              posts.length > 1 ? (
                <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.08em] text-text-tertiary">
                  <span>
                    {String(active + 1).padStart(2, "0")} /{" "}
                    {String(posts.length).padStart(2, "0")}
                  </span>
                  <span className="hidden text-text-disabled sm:inline">·</span>
                  <span className="hidden sm:inline">
                    {paused ? "paused" : "auto-plays"}
                  </span>
                </div>
              ) : null
            }
          />

          <AnimatePresence mode="wait">
            <motion.div
              key={post.route}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
              className="relative flex flex-1 flex-col"
            >
              <BlogTagChip tag={tag} className="mb-5" />
              <h2 className="m-0 max-w-[18ch] font-analog text-[28px] font-medium leading-[1.1] tracking-[-0.02em] text-text-primary sm:text-[40px] lg:text-[48px]">
                {title}
              </h2>
              {description ? (
                <p className="mt-4 mb-0 max-w-[38rem] text-[15px] leading-[1.5] text-text-tertiary">
                  {description}
                </p>
              ) : null}
              <div className="mt-5 flex flex-wrap items-baseline gap-x-2 gap-y-1 text-[13px]">
                {author ? (
                  <span className="font-medium text-text-primary">
                    {author}
                  </span>
                ) : null}
                {date ? (
                  <span className="text-text-tertiary">{date}</span>
                ) : null}
              </div>
              <div className="mt-auto flex justify-end pt-10">
                <Link
                  href={post.route}
                  aria-label={`Read ${title}`}
                  className="inline-flex items-center gap-1.5 font-mono text-[12px] uppercase tracking-[0.08em] text-text-secondary no-underline transition-colors after:absolute after:inset-0 after:z-10 after:cursor-pointer after:content-[''] hover:text-text-primary focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-inset focus-visible:after:ring-ring"
                >
                  Read the post
                  <span aria-hidden>→</span>
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="relative min-h-[220px] border-t border-line-structure lg:min-h-full lg:border-t-0 lg:border-l">
          <Link
            href={post.route}
            tabIndex={-1}
            aria-hidden
            className="absolute inset-0 z-0"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={post.route}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.28, ease: "easeOut" }}
                className="absolute inset-0"
              >
                {image ? (
                  <BlogPostCover
                    src={image}
                    alt=""
                    priority={active === 0}
                    crop
                    className="h-full w-full"
                    sizes="(max-width: 1024px) 100vw, 40vw"
                  />
                ) : (
                  <div className="absolute inset-0 bg-stripe-pattern">
                    <span
                      aria-hidden
                      className="absolute right-6 bottom-6 font-analog text-[72px] leading-none tracking-tight text-text-primary/15 sm:text-[96px]"
                    >
                      {String(active + 1).padStart(2, "0")}
                    </span>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </Link>
        </div>
      </div>

      {posts.length > 1 ? (
        <div className="flex gap-2 overflow-x-auto border-t border-line-structure px-6 py-3 sm:px-8 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {posts.map((item, i) => {
            const isActive = i === active;
            return (
              <button
                key={item.route}
                type="button"
                onClick={() => setActive(i)}
                onMouseEnter={() => setActive(i)}
                className={cn(
                  "max-w-[18rem] shrink-0 truncate rounded-sm border px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.06em] transition-colors",
                  isActive
                    ? "border-line-cta bg-surface-bg text-text-primary"
                    : "border-line-structure text-text-tertiary hover:text-text-primary",
                )}
              >
                {postTitle(item)}
              </button>
            );
          })}
        </div>
      ) : null}
    </section>
  );
}
