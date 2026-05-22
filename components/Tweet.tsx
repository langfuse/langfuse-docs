import { cn } from "@/lib/utils";

// Render embedded tweets as a simple link to x.com instead of fetching from
// Twitter's syndication API. The previous react-tweet-based embed broke
// Vercel's static prerender ("TypeError: c is not iterable") because the
// syndication endpoint now returns non-JSON error bodies that crash
// fetchTweet — and that failure isn't reliably caught during streaming
// SSR even with a wrapper try/catch. A static link keeps the build
// deterministic and offline-safe; the embed's visual richness is lost
// but the content (and crucially the build) stays usable.
export const Tweet = ({
  id,
  className,
}: {
  id: string;
  className?: string;
}) => (
  <div className={cn("mt-2", className)}>
    <a
      href={`https://x.com/i/status/${id}`}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 px-3 py-2 text-sm border rounded-md hover:bg-muted"
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
      View tweet on X
    </a>
  </div>
);
