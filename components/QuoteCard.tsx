import { cn } from "@/lib/utils";
import Image from "next/image";

type QuoteCardProps = {
  quote: string;
  authorName: string;
  authorTitle?: string;
  authorImageSrc?: string;
  className?: string;
};

export function QuoteCard({
  quote,
  authorName,
  authorTitle,
  authorImageSrc,
  className,
}: QuoteCardProps) {
  return (
    <div className={cn("p-2", className)}>
      <blockquote className="border-l-2 pl-4 md:pl-6">
        <p className="italic text-base leading-relaxed">
          {quote}
          <span className="mt-2 ml-2 inline-flex items-center gap-2 text-sm not-italic align-baseline">
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
          </span>
        </p>
      </blockquote>
    </div>
  );
}
