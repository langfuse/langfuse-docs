import { cn } from "@/lib/utils";
import { EmbeddedTweet, TweetNotFound } from "react-tweet";
import { getTweet, type Tweet as TweetData } from "react-tweet/api";

type TweetLike = {
  entities?: Partial<TweetData["entities"]>;
  quoted_tweet?: TweetData["quoted_tweet"];
  parent?: TweetData["parent"];
};

function normalizeTweetEntities<T extends TweetLike>(tweet: T): T {
  const entities = tweet.entities ?? {};

  return {
    ...tweet,
    // Twitter's syndication API may omit empty entity arrays. react-tweet assumes
    // they are always iterable, so normalize the payload before rendering.
    entities: {
      ...entities,
      hashtags: Array.isArray(entities.hashtags) ? entities.hashtags : [],
      urls: Array.isArray(entities.urls) ? entities.urls : [],
      user_mentions: Array.isArray(entities.user_mentions)
        ? entities.user_mentions
        : [],
      symbols: Array.isArray(entities.symbols) ? entities.symbols : [],
      ...(Array.isArray(entities.media) ? { media: entities.media } : {}),
    },
    ...(tweet.quoted_tweet
      ? { quoted_tweet: normalizeTweetEntities(tweet.quoted_tweet) }
      : {}),
    ...(tweet.parent ? { parent: normalizeTweetEntities(tweet.parent) } : {}),
  } as T;
}

export const Tweet = async ({
  id,
  className,
}: {
  id: string;
  className?: string;
}) => {
  let tweet: TweetData | undefined;
  let error: unknown;

  try {
    tweet = await getTweet(id);
  } catch (err) {
    console.error(err);
    error = err;
  }

  return (
    <div className={cn("mt-2", className)}>
      {tweet ? (
        <EmbeddedTweet tweet={normalizeTweetEntities(tweet)} />
      ) : (
        <TweetNotFound error={error} />
      )}
    </div>
  );
};
