"use client";

import { cn } from "@/lib/utils";
import { MediaPlayer, MediaProvider } from "@vidstack/react";
import "@vidstack/react/player/styles/base.css";

export const Video = ({
  src,
  aspectRatio,
  className,
  gifStyle = false,
  poster,
  onCanPlay,
}: {
  src: string;
  aspectRatio?: number;
  gifStyle?: boolean;
  className?: string;
  poster?: string;
  onCanPlay?: () => void;
}) => {
  return (
    <MediaPlayer
      src={src}
      poster={poster}
      posterLoad="eager"
      controls={!gifStyle}
      autoPlay={gifStyle}
      muted={gifStyle}
      loop={gifStyle}
      load={"visible"}
      playsInline={gifStyle}
      aspectRatio={aspectRatio ? `${aspectRatio}` : undefined}
      className={cn(
        "overflow-hidden shadow-lg bg-surface-bg object-cover",
        className,
      )}
      onCanPlay={onCanPlay}
    >
      <MediaProvider />
    </MediaPlayer>
  );
};
