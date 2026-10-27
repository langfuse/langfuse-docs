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
  autoPlay = false,
  muted = false,
  onCanPlay,
}: {
  src: string;
  aspectRatio?: number;
  gifStyle?: boolean;
  className?: string;
  poster?: string;
  autoPlay?: boolean;
  muted?: boolean;
  onCanPlay?: () => void;
}) => {
  return (
    <MediaPlayer
      src={src}
      poster={poster}
      posterLoad="eager"
      controls={!gifStyle}
      autoPlay={gifStyle || autoPlay}
      muted={gifStyle || muted}
      loop={gifStyle}
      load={"visible"}
      // Always inline. Vidstack enters fullscreen on coarse pointers
      // (phones) when this is false, which overlays the docs page.
      playsInline
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
