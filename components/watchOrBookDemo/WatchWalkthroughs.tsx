import { Button } from "@/components/ui/button";
import { WALKTHROUGH_VIDEO } from "./constants";
import { BookOpen, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

export function WatchWalkthroughs({
  className,
  compact = false,
}: {
  className?: string;
  /** Hide the long description so the player can take more of the card. */
  compact?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative p-4 mx-auto max-w-2xl rounded-none border border-line-structure corner-box-corners bg-stripe-pattern",
        compact && "max-w-none w-full p-3 sm:p-4",
        className,
      )}
    >
      {!compact ? (
        <div className="mb-6">
          <h3 className="mb-2 text-xl font-semibold">
            {WALKTHROUGH_VIDEO.title}
          </h3>
          <p>{WALKTHROUGH_VIDEO.description}</p>
        </div>
      ) : null}
      <iframe
        width="100%"
        className="aspect-[16/9] rounded-[2px]"
        src={`https://www.youtube-nocookie.com/embed/${WALKTHROUGH_VIDEO.videoId}`}
        title="Langfuse platform walkthrough"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
      {!compact ? (
        <div className="mt-4 flex justify-center">
          <Button
            icon={<BookOpen size={16} />}
            href={WALKTHROUGH_VIDEO.docs.href}
          >
            <span className="flex items-center gap-2">
              {WALKTHROUGH_VIDEO.docs.title}
              <ExternalLink size={12} className="ml-auto" />
            </span>
          </Button>
        </div>
      ) : null}
    </div>
  );
}
