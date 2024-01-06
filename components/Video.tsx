import { cn } from "@/lib/utils";
import { MediaPlayer, MediaOutlet } from "@vidstack/react";

export const CloudflareVideo = ({
  videoId,
  aspectRatio,
  className,
  gifStyle = false,
}: {
  videoId: string;
  aspectRatio?: number;
  gifStyle?: boolean;
  className?: string;
}) => (
  <Video
    src={`https://customer-xnej9vqjtgxpafyk.cloudflarestream.com/${videoId}/manifest/video.m3u8`}
    poster={`https://customer-xnej9vqjtgxpafyk.cloudflarestream.com/${videoId}/thumbnails/thumbnail.gif`}
    aspectRatio={aspectRatio}
    gifStyle={gifStyle}
    className={className}
  />
);

export const Video = ({
  src,
  poster,
  aspectRatio,
  className,
  gifStyle = false,
}: {
  src: string;
  poster?: string;
  aspectRatio?: number;
  gifStyle?: boolean;
  className?: string;
}) => (
  <MediaPlayer
    src={src}
    poster={poster}
    controls={!gifStyle}
    autoplay={gifStyle}
    muted={gifStyle}
    loop={gifStyle}
    playsinline={gifStyle}
    aspectRatio={aspectRatio}
    className={cn(
      "my-4 overflow-hidden rounded-xl shadow-lg ring-1 ring-slate-700 bg-cover object-cover",
      className
    )}
  >
    <MediaOutlet />
  </MediaPlayer>
);
