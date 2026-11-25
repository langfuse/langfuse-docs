"use client";

import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { MediaPlayer, MediaProvider } from "@vidstack/react";
import "@vidstack/react/player/styles/base.css";
import { useEffect, useId, useRef } from "react";

// Vidstack types mediaProps as HTMLAttributes<HTMLMediaElement>, which
// omits video-only playsInline. Cast so the attributes still land on
// the native <video> as soon as it is created.
const INLINE_MEDIA_PROPS = {
  playsInline: true,
  "webkit-playsinline": "",
} as HTMLAttributes<HTMLMediaElement>;

function LoopingVideo({
  src,
  poster,
  aspectRatio,
  className,
  onCanPlay,
  title,
  describedBy,
}: {
  src: string;
  poster?: string;
  aspectRatio?: number;
  className?: string;
  onCanPlay?: () => void;
  title?: string;
  describedBy?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  // React sets `muted` as a property after the element is created, so the
  // browser's own autoplay check sees an unmuted video and refuses to start it.
  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    video.muted = true;
    video.play().catch(() => {});
  }, [src]);

  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      aria-label={title}
      aria-describedby={describedBy}
      style={aspectRatio ? { aspectRatio: `${aspectRatio}` } : undefined}
      className={cn("mx-auto block w-full", className)}
      onCanPlay={onCanPlay}
    />
  );
}

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
  controls = true,
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
  /**
   * Set to false for short, silent product loops that should read as part of
   * the page: renders a bare native <video> that autoplays muted on a loop.
   */
  controls?: boolean;
}) => {
  const descriptionId = useId();
  if (!controls) {
    return (
      <>
        <LoopingVideo
          src={src}
          poster={poster}
          aspectRatio={aspectRatio}
          className={className}
          onCanPlay={onCanPlay}
          title={title}
          describedBy={description ? descriptionId : undefined}
        />
        {description ? (
          <p id={descriptionId} className="sr-only">
            {description}
          </p>
        ) : null}
      </>
    );
  }
  return (
    <>
      <MediaPlayer
        src={src}
        poster={poster}
        posterLoad="eager"
        // Native controls on every video, gifStyle included, so readers can
        // pause, scrub and open fullscreen.
        controls
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
