"use client";

import { Text } from "@/components/ui/text";
import { HoverPostRow } from "@/components/lists/HoverPostRow";
import type { BlogPageItem } from "./BlogIndex";
import { formatDate, normalizeTags } from "./utils";

export function BlogHighlightCards({ posts }: { posts: BlogPageItem[] }) {
  if (posts.length === 0) return null;

  return (
    <section className="rounded-[2px] border border-line-structure bg-surface-bg overflow-hidden">
      <div className="flex items-center px-4 py-3 border-b border-line-structure">
        <h2 className="text-left font-analog font-medium text-[16px] text-text-primary">
          Highlights
        </h2>
      </div>

      <div className="divide-y divide-line-structure">
        {posts.map((post) => (
          <HoverPostRow
            key={post.route}
            href={post.route}
            tags={normalizeTags(post.frontMatter?.tag)}
            title={post.frontMatter?.title || post.name || ""}
            description={post.frontMatter?.description}
            previewOnHover
            previewImage={post.frontMatter?.ogImage ?? null}
            metaRight={
              <>
                <Text
                  size="s"
                  className="text-left md:text-right text-[12px] text-text-tertiary whitespace-nowrap"
                >
                  {formatDate(post.frontMatter?.date)}
                </Text>
                {post.frontMatter?.author && (
                  <>
                    <span className="text-[12px] text-text-tertiary md:hidden">
                      ·
                    </span>
                    <Text
                      size="s"
                      className="text-left md:text-right text-[12px] text-text-tertiary"
                    >
                      {post.frontMatter.author}
                    </Text>
                  </>
                )}
              </>
            }
          />
        ))}
      </div>
    </section>
  );
}
