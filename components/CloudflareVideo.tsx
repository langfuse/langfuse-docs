import { cn } from "@/lib/utils";
import { Stream } from "@cloudflare/stream-react";

export const CloudflareVideo = ({
  videoId,
  className,
}: {
  videoId: string;
  className: string;
}) => (
  <div
    className={cn(
      "my-4 overflow-hidden rounded-xl shadow-lg aspect-[1.18] ring-1 ring-slate-700",
      className
    )}
  >
    <Stream src={videoId} autoplay={true} loop={true} muted={true} />
  </div>
);
