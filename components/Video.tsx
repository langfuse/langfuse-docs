"use client";

import { cn } from "@/lib/utils";
import { MediaPlayer, MediaProvider } from "@vidstack/react";

export const Video = ({
  src,
  aspectRatio,
  className,
  gifStyle = false,
}: {
  src: string;
  aspectRatio?: number;
  gifStyle?: boolean;
  className?: string;
}) => {
  return (
    <MediaPlayer
      src={src}
      controls={!gifStyle}
      autoPlay={gifStyle}
      muted={gifStyle}
      loop={gifStyle}
      load={"visible"}
      playsInline={gifStyle}
      aspectRatio={aspectRatio ? `${aspectRatio}` : undefined}
      className={cn(
        "overflow-hidden shadow-lg bg-surface-bg object-cover",
        className
      )}
    >
      <MediaProvider />
    </MediaPlayer>
  );
};
