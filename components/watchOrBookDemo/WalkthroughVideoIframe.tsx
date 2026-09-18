import { cn } from "@/lib/utils";
import { WALKTHROUGH_VIDEO } from "./constants";

export function WalkthroughVideoIframe({ className }: { className?: string }) {
  return (
    <iframe
      width="100%"
      className={cn("aspect-[16/9] rounded-[2px]", className)}
      src={`https://www.youtube-nocookie.com/embed/${WALKTHROUGH_VIDEO.videoId}?rel=0`}
      title="Langfuse platform walkthrough"
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      referrerPolicy="strict-origin-when-cross-origin"
      allowFullScreen
    />
  );
}
