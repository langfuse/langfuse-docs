"use client";

import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { MediaPlayer, MediaProvider } from "@vidstack/react";
import "@vidstack/react/player/styles/base.css";
import { useId } from "react";

// Vidstack types mediaProps as HTMLAttributes<HTMLMediaElement>, which
// omits video-only playsInline. Cast so the attributes still land on
// the native <video> as soon as it is created.
const INLINE_MEDIA_PROPS = {
  playsInline: true,
  "webkit-playsinline": "",
} as HTMLAttributes<HTMLMediaElement>;

/**
 * `title` and `description` say what the video shows in the UI. They give the
 * player an accessible name and description, and the plain-Markdown build
 * (lib/markdown-component-renderers.js) prints them, so readers and agents
 * that cannot watch the video still learn the click path.
 */
export const Video = ({
  src,
  aspectRatio,
  className,
  gifStyle = false,
  poster,
  autoPlay = false,
  muted = false,
  onCanPlay,
  title,
  description,
}: {
  src: string;
  aspectRatio?: number;
  gifStyle?: boolean;
  className?: string;
  poster?: string;
  autoPlay?: boolean;
  muted?: boolean;
  onCanPlay?: () => void;
  title?: string;
  description?: string;
}) => {
  const descriptionId = useId();
  return (
    <>
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
        title={title}
        aria-describedby={description ? descriptionId : undefined}
        className={cn(
          "overflow-hidden shadow-lg bg-surface-bg object-cover",
          className,
        )}
        onCanPlay={onCanPlay}
      >
        <MediaProvider mediaProps={INLINE_MEDIA_PROPS} />
      </MediaPlayer>
      {description ? (
        <p id={descriptionId} className="sr-only">
          {description}
        </p>
      ) : null}
    </>
  );
};
