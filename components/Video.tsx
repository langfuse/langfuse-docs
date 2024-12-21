import { cn } from "@/lib/utils";
import {
  MediaPlayer,
  MediaProvider,
  useMediaRemote,
  Poster,
} from "@vidstack/react";
import {
  DefaultVideoLayout,
  defaultLayoutIcons,
} from "@vidstack/react/player/layouts/default";

import { useRef, useEffect } from "react";

export const CloudflareVideo = ({
  videoId,
  aspectRatio,
  className,
  gifStyle = false,
  poster,
  posterStartTime = 1,
  title,
}: {
  videoId: string;
  aspectRatio?: number;
  gifStyle?: boolean;
  className?: string;
  poster?: string;
  posterStartTime?: number;
  title?: string;
}) => {
  return (
    <Video
      src={`https://customer-xnej9vqjtgxpafyk.cloudflarestream.com/${videoId}/manifest/video.m3u8`}
      poster={
        poster ??
        `https://customer-xnej9vqjtgxpafyk.cloudflarestream.com/${videoId}/thumbnails/thumbnail.gif?time=${posterStartTime}s`
      }
      aspectRatio={aspectRatio}
      gifStyle={gifStyle}
      className={className}
      title={title}
    />
  );
};

export const Video = ({
  src,
  poster,
  aspectRatio,
  className,
  gifStyle = false,
  title,
}: {
  src: string;
  poster?: string;
  aspectRatio?: number;
  gifStyle?: boolean;
  className?: string;
  title?: string;
}) => {
  const mediaPlayerRef = useRef(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const remote = useMediaRemote(mediaPlayerRef);

  useEffect(() => {
    if (!gifStyle) return;

    // Small delay to ensure video is ready
    const timeoutId = setTimeout(() => {
      remote.seek(0);
      remote.play();
    }, 200);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            remote.seek(0);
            remote.play();
          } else {
            remote.pause();
          }
        });
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, [gifStyle, remote]);

  return (
    <div ref={containerRef}>
      <MediaPlayer
        ref={mediaPlayerRef}
        viewType="video"
        src={src}
        autoPlay={false} // We'll handle autoplay ourselves
        muted={gifStyle}
        loop={gifStyle}
        load={gifStyle ? "eager" : "play"}
        playsInline={gifStyle}
        aspectRatio={aspectRatio?.toString()}
        title={title}
        poster={poster}
        className={cn(
          "my-4 overflow-hidden rounded-lg shadow-lg ring-1 ring-slate-700 bg-cover object-cover",
          className
        )}
      >
        <MediaProvider>
          <Poster className="vds-poster" />
        </MediaProvider>
        <DefaultVideoLayout icons={defaultLayoutIcons} />
      </MediaPlayer>
    </div>
  );
};
