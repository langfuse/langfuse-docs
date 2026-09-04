"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function BlogPostCover({
  src,
  alt,
  className,
  priority = false,
  crop = false,
  sizes = "(max-width: 1024px) 100vw, 50vw",
}: {
  src?: string | null;
  alt: string;
  className?: string;
  priority?: boolean;
  crop?: boolean;
  sizes?: string;
}) {
  const [failed, setFailed] = useState(false);
  const showImage = Boolean(src) && !failed;

  return (
    <div className={cn("relative overflow-hidden bg-surface-1", className)}>
      {showImage ? (
        <Image
          src={src!}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className={cn(
            "object-cover object-center transition-transform duration-500 ease-out",
            crop ? "scale-[1.12]" : "group-hover:scale-[1.04]",
          )}
          onError={() => setFailed(true)}
        />
      ) : (
        <div aria-hidden className="absolute inset-0 bg-stripe-pattern" />
      )}
    </div>
  );
}
