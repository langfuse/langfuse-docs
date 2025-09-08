import { cn } from "@/lib/utils";
import {
  MediaPlayer,
  MediaOutlet,
  useMediaRemote,
  useMediaStore,
} from "@vidstack/react";
import { Play } from "lucide-react";
import { useState, useRef, useEffect } from "react";

// export const CloudflareVideo = ({
//   videoId,
//   aspectRatio,
//   className,
//   gifStyle = false,
//   poster,
//   posterStartTime = 1,
//   title,
// }: {
//   videoId: string;
//   aspectRatio?: number;
//   gifStyle?: boolean;
//   className?: string;
//   poster?: string;
//   posterStartTime?: number;
//   title?: string;
// }) => {
//   return (
//     <Video
//       src={`https://customer-xnej9vqjtgxpafyk.cloudflarestream.com/${videoId}/manifest/video.m3u8`}
//       poster={
//         poster ??
//         `https://customer-xnej9vqjtgxpafyk.cloudflarestream.com/${videoId}/thumbnails/thumbnail.gif?time=${posterStartTime}s`
//       }
//       aspectRatio={aspectRatio}
//       gifStyle={gifStyle}
//       className={className}
//       title={title}
//     />
//   );
// };

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
  const [panelDismissed, setPanelDismissed] = useState(false);
  const mediaPlayerRef = useRef(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const remote = useMediaRemote(mediaPlayerRef);
  const { duration, currentTime } = useMediaStore(mediaPlayerRef);

  const durationString = duration
    ? `${Math.floor(duration / 60)}:${String(
        Math.floor(duration % 60)
      ).padStart(2, "0")} min`
    : null;

  // Calculate progress percentage for gif mode
  const progressPercentage = duration && currentTime 
    ? (currentTime / duration) * 100 
    : 0;

  // Handle seeking in gif mode
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!gifStyle || !duration) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    const newTime = percentage * duration;
    
    remote.seek(newTime);
  };

  return (
    <div ref={containerRef} className="relative">
      <MediaPlayer
        ref={mediaPlayerRef}
        src={src}
        controls={!gifStyle && panelDismissed}
        autoplay={gifStyle}
        muted={gifStyle}
        loop={gifStyle}
        load={"visible"}
        playsinline={gifStyle}
        aspectRatio={aspectRatio}
        className={cn(
          "my-4 overflow-hidden rounded-lg shadow-lg ring-1 ring-slate-700 bg-cover object-cover",
          className
        )}
      >
        {!gifStyle && !panelDismissed ? (
          <div
            className="group cursor-pointer absolute inset-0 z-10 flex flex-col justify-center items-center bg-cover"
            style={{
              backgroundImage: poster ? `url(${poster})` : undefined,
            }}
            onMouseMove={() => {
              remote.startLoading();
            }}
            onClick={() => {
              remote.startLoading();
              remote.play();
              setPanelDismissed(true);
            }}
          >
            <div className="p-3 md:p-6 rounded-full bg-black/80 group-hover:bg-black/90 group-hover:ring-8 ring-black/20 transition flex">
              <Play className="h-6 w-6 text-white" />
            </div>
            <div className="mt-3 md:mt-6 transition-opacity duration-300">
              <span className="flex gap-2 text-xs md:text-sm font-semibold bg-black/80 group-hover:bg-black/90 transition-all text-white py-1 px-3 rounded-full">
                {title && <span>{title}</span>}
                {durationString && (
                  <span className="text-white/70">{durationString}</span>
                )}
              </span>
            </div>
          </div>
        ) : null}
        <MediaOutlet />
        
        {/* Custom progress bar for gif mode */}
        {gifStyle && (
          <div 
            className="absolute bottom-0 left-0 right-0 h-2 bg-black/60 cursor-pointer group/progress z-20"
            onClick={handleProgressClick}
          >
            <div 
              className="h-full bg-white group-hover/progress:bg-blue-400 transition-all duration-200"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        )}
      </MediaPlayer>
    </div>
  );
};
