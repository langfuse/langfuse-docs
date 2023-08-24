import { cn } from "@/lib/utils";
import { MediaPlayer, MediaOutlet } from "@vidstack/react";

export const CloudflareVideo = ({
  videoId,
  aspectRatio,
  className,
}: {
  videoId: string;
  aspectRatio?: number;
  className?: string;
}) => (
  <MediaPlayer
    src={`https://customer-xnej9vqjtgxpafyk.cloudflarestream.com/${videoId}/manifest/video.m3u8`}
    poster={`https://customer-xnej9vqjtgxpafyk.cloudflarestream.com/${videoId}/thumbnails/thumbnail.gif`}
    controls
    aspectRatio={aspectRatio ?? 16 / 9}
    className={cn(
      "my-4 overflow-hidden rounded-xl shadow-lg ring-1 ring-slate-700",
      className
    )}
  >
    <MediaOutlet />
  </MediaPlayer>
);
