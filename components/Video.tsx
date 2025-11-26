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
        "my-4 overflow-hidden rounded-lg shadow-lg ring-1 ring-slate-700 bg-cover object-cover",
        className,
      )}
    >
      <MediaProvider />
    </MediaPlayer>
  );
};
