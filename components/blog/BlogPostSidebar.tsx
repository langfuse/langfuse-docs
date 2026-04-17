"use client";

import { Text } from "@/components/ui/text";
import { SidebarShell } from "@/components/home/layout/SidebarShell";
import { SidebarUpdatesBlock } from "./SidebarUpdatesBlock";
import Link from "next/link";

type TagInfo = { name: string; count: number };

export function BlogPostSidebar({
  tags,
  totalPosts,
}: {
  tags: TagInfo[];
  totalPosts: number;
}) {
  return (
    <SidebarShell>
      {/* Categories */}
      <div className="pb-px bg-line-structure">
        <div className="px-2 py-4 rounded-sm bg-surface-1">
          <Text
            size="s"
            className="px-2 mb-3 font-[430] text-left text-[13px] text-text-primary"
          >
            Categories
          </Text>
          <div className="flex flex-col">
            <Link
              href="/blog"
              className="flex items-center gap-1 px-2 py-0.5 w-full text-left text-text-tertiary hover:text-text-primary transition-colors"
            >
              <Text
                size="s"
                className="text-left text-inherit text-[13px]"
              >
                + All [{totalPosts}]
              </Text>
            </Link>
            {tags.map((tag) => (
              <Link
                key={tag.name}
                href={`/blog?tag=${encodeURIComponent(tag.name)}`}
                className="flex items-center gap-1 px-2 py-0.5 w-full text-left text-text-tertiary hover:text-text-primary transition-colors"
              >
                <Text
                  size="s"
                  className="text-left text-inherit text-[13px] capitalize"
                >
                  + {tag.name} [{tag.count}]
                </Text>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <SidebarUpdatesBlock source="blog-post-sidebar" />
    </SidebarShell>
  );
}
