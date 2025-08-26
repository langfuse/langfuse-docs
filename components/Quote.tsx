import { cn } from "@/lib/utils";
import Image from "next/image";
import { Quote as QuoteIcon } from "lucide-react";

type QuoteProps = {
  quote: string;
  authorName: string;
  authorTitle?: string;
  authorImageSrc?: string;
  className?: string;
};

export function Quote({
  quote,
  authorName,
  authorTitle,
  authorImageSrc,
  className,
}: QuoteProps) {
  return (
    <div className={cn("p-2", className)}>
      <blockquote className="relative pl-4 md:pl-6">
        <QuoteIcon
          aria-hidden
          className="absolute left-0 -translate-x-1/2 top-0 h-4 w-4 text-secondary-foreground"
        />
        <span
          aria-hidden
          className="absolute left-0 top-6 bottom-0 w-[2px] bg-secondary-foreground"
        />
        <p className="italic text-base leading-relaxed">{quote}</p>
        <div className="mt-2 flex items-center gap-2 text-sm not-italic">
          {authorImageSrc ? (
            <Image
              src={authorImageSrc}
              alt={authorName}
              width={20}
              height={20}
              className="rounded-full aspect-square"
            />
          ) : null}
          <span>
            <span className="font-medium text-foreground">{authorName}</span>
            {authorTitle ? <span>{`, ${authorTitle}`}</span> : null}
          </span>
        </div>
      </blockquote>
    </div>
  );
}
