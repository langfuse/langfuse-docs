"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function BlogPostCover({
  src,
  alt,
  className,
  priority = false,
  sizes = "(max-width: 1024px) 100vw, 50vw",
}: {
  src?: string | null;
  alt: string;
  className?: string;
  priority?: boolean;
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
          className="object-cover object-center"
          onError={() => setFailed(true)}
        />
      ) : (
        <div aria-hidden className="absolute inset-0 bg-stripe-pattern" />
      )}
    </div>
  );
}
