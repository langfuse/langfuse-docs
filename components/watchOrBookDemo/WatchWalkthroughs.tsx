import { Button } from "@/components/ui/button";
import { WALKTHROUGH_VIDEO } from "./constants";
import { BookOpen, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

export function WatchWalkthroughs({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative p-4 mx-auto max-w-2xl rounded-none border border-line-structure corner-box-corners bg-stripe-pattern",
        className,
      )}
    >
      <div className="mb-6">
        <h3 className="mb-2 text-xl font-semibold">
          {WALKTHROUGH_VIDEO.title}
        </h3>
        <p>{WALKTHROUGH_VIDEO.description}</p>
      </div>
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
    </div>
  );
}
