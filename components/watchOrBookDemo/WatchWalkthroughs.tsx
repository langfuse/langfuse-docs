"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { WALKTHROUGH_VIDEO } from "./constants";
import { BookOpen, ExternalLink, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

function WalkthroughPlayer({ autoplay = false }: { autoplay?: boolean }) {
  return (
    <iframe
      width="100%"
      className="aspect-[16/9] rounded-[2px]"
      src={`https://www.youtube-nocookie.com/embed/${WALKTHROUGH_VIDEO.videoId}${
        autoplay ? "?autoplay=1" : ""
      }`}
      title="Langfuse platform walkthrough"
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      referrerPolicy="strict-origin-when-cross-origin"
      allowFullScreen
    />
  );
}

export function WatchWalkthroughs({
  className,
  expandOnPlay = false,
}: {
  className?: string;
  /** Open a large lightbox player instead of embedding the video inline. */
  expandOnPlay?: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={cn(
        "relative p-4 mx-auto max-w-2xl rounded-none border border-line-structure corner-box-corners bg-stripe-pattern",
        className,
      )}
    >
      <div className="mb-6">
        <h3 className="mb-2 text-xl font-semibold">
          {WALKTHROUGH_VIDEO.title}
        </h3>
        <p>{WALKTHROUGH_VIDEO.description}</p>
      </div>
      {expandOnPlay ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="relative w-full overflow-hidden rounded-[2px] group cursor-pointer"
          aria-label="Play walkthrough in a larger player"
        >
          <img
            src={`https://i.ytimg.com/vi/${WALKTHROUGH_VIDEO.videoId}/maxresdefault.jpg`}
            alt=""
            className="aspect-[16/9] w-full object-cover"
            onError={(event) => {
              event.currentTarget.src = `https://i.ytimg.com/vi/${WALKTHROUGH_VIDEO.videoId}/hqdefault.jpg`;
            }}
          />
          <span className="absolute inset-0 flex items-center justify-center bg-background/25 transition-colors group-hover:bg-background/40">
            <span className="flex size-14 items-center justify-center rounded-full bg-text-primary text-surface-bg">
              <Play className="size-6 fill-current ml-0.5" />
            </span>
          </span>
        </button>
      ) : (
        <WalkthroughPlayer />
      )}
      <div className="mt-4 flex justify-center">
        <Button
          icon={<BookOpen size={16} />}
          href={WALKTHROUGH_VIDEO.docs.href}
        >
          <span className="flex items-center gap-2">
            {WALKTHROUGH_VIDEO.docs.title}
            <ExternalLink size={12} className="ml-auto" />
          </span>
        </Button>
      </div>

      {expandOnPlay ? (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="w-full max-w-[min(92vw,80rem)] gap-3 p-3 sm:p-4">
            <DialogHeader className="pr-8">
              <DialogTitle>{WALKTHROUGH_VIDEO.title}</DialogTitle>
            </DialogHeader>
            {open ? <WalkthroughPlayer autoplay /> : null}
          </DialogContent>
        </Dialog>
      ) : null}
    </div>
  );
}
