import { Suspense } from "react";
import { EmbeddedTweet, TweetNotFound, TweetSkeleton } from "react-tweet";
import { fetchTweet } from "react-tweet/api";
import { cn } from "@/lib/utils";

// react-tweet@3.2.2's fetchTweet crashes with
//   "Cannot read properties of undefined (reading 'error')"
// when the Twitter syndication API returns a non-JSON error body.
// That blows up Next.js static prerender for any page embedding a tweet
// (e.g. /blog/launch-week-1). Wrap it ourselves so a failed fetch degrades
// to TweetNotFound instead.
async function TweetContent({ id }: { id: string }) {
  try {
    const result = await fetchTweet(id);
    if (
      !result ||
      "notFound" in result ||
      "tombstone" in result ||
      !result.data
    ) {
      return <TweetNotFound />;
    }
    return <EmbeddedTweet tweet={result.data} />;
  } catch (err) {
    console.warn(`[Tweet] Failed to fetch tweet ${id}:`, err);
    return <TweetNotFound />;
  }
}

export const Tweet = ({
  id,
  className,
}: {
  id: string;
  className?: string;
}) => (
  <div className={cn("mt-2", className)}>
    <Suspense fallback={<TweetSkeleton />}>
      <TweetContent id={id} />
    </Suspense>
  </div>
);
