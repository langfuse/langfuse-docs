import { cn } from "@/lib/utils";
import { formatDate, primaryTag } from "./utils";
import type { BlogPageItem } from "./BlogIndex";

export function postTitle(post: BlogPageItem): string {
  return post.frontMatter?.title || post.name || "";
}

export function BlogTagChip({
  tag,
  className,
}: {
  tag?: string;
  className?: string;
}) {
  if (!tag) return null;
  return (
    <span
      className={cn(
        "inline-flex w-fit bg-[#FBFF7A] px-2 py-1 font-mono text-[11px] uppercase tracking-[0.1em] text-text-primary",
        className,
      )}
    >
      {tag}
    </span>
  );
}

export function BlogPostMeta({
  post,
  className,
}: {
  post: BlogPageItem;
  className?: string;
}) {
  const tag = primaryTag(post.frontMatter?.tag);
  const date = formatDate(post.frontMatter?.date);
  const author = post.frontMatter?.author;

  return (
    <div
      className={cn(
        "flex flex-wrap items-baseline gap-x-2 gap-y-1 font-mono text-[11px] uppercase tracking-[0.08em] text-text-tertiary",
        className,
      )}
    >
      {tag ? <span className="text-text-secondary">{tag}</span> : null}
      {tag && date ? <span aria-hidden>·</span> : null}
      {date ? <span>{date}</span> : null}
      {author ? (
        <>
          <span aria-hidden>·</span>
          <span className="normal-case tracking-normal">{author}</span>
        </>
      ) : null}
    </div>
  );
}
