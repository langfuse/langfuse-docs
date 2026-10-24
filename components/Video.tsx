"use client";

import { cn } from "@/lib/utils";
import { MediaPlayer, MediaProvider } from "@vidstack/react";
import "@vidstack/react/player/styles/base.css";
import { useId } from "react";

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
  onCanPlay,
  title,
  description,
}: {
  src: string;
  aspectRatio?: number;
  gifStyle?: boolean;
  className?: string;
  poster?: string;
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
        autoPlay={gifStyle}
        muted={gifStyle}
        loop={gifStyle}
        load={"visible"}
        playsInline={gifStyle}
        aspectRatio={aspectRatio ? `${aspectRatio}` : undefined}
        title={title}
        aria-describedby={description ? descriptionId : undefined}
        className={cn(
          "overflow-hidden shadow-lg bg-surface-bg object-cover",
          className,
        )}
        onCanPlay={onCanPlay}
      >
        <MediaProvider />
      </MediaPlayer>
      {description ? (
        <p id={descriptionId} className="sr-only">
          {description}
        </p>
      ) : null}
    </>
  );
};
