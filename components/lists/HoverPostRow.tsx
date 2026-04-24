"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Text } from "@/components/ui/text";
import { TextHighlight } from "@/components/ui/text-highlight";
import { cn } from "@/lib/utils";

export function HoverPostRow({
  href,
  tags = [],
  title,
  description,
  metaRight,
  leadingVisual,
  previewImage,
  previewOnHover = false,
}: {
  href: string;
  tags?: string[];
  title: string;
  description?: string;
  metaRight?: React.ReactNode;
  leadingVisual?: React.ReactNode;
  previewImage?: string | null;
  previewOnHover?: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  const showPreview = previewOnHover && !!previewImage && hovered;

  return (
    <Link
      href={href}
      className="group relative flex flex-col md:flex-row gap-1.5 md:gap-4 px-4 py-3 transition-colors hover:bg-surface-1"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {leadingVisual ? (
        <div className="shrink-0 self-start mt-0.5">{leadingVisual}</div>
      ) : null}

      <div
        className={cn(
          "flex-1 min-w-0 flex flex-col gap-1.5",
          previewOnHover ? "md:group-hover:mr-[136px]" : null
        )}
      >
        <Text
          size="s"
          className="text-left text-[13px] text-text-tertiary leading-snug capitalize md:truncate"
        >
          {tags.join(", ")}
        </Text>

        <h3 className="text-left text-[16px] font-analog font-medium text-text-primary leading-snug md:truncate">
          <TextHighlight
            highlightClassName="origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700 ease-out"
          >
            {title}
          </TextHighlight>
        </h3>

        {description && (
          <Text
            size="s"
            className="text-left text-[13px] text-text-tertiary leading-snug md:truncate"
          >
            {description}
          </Text>
        )}
      </div>

      {metaRight ? (
        <div
          className={cn(
            "flex md:shrink-0 md:flex-col md:items-end gap-1 md:gap-0.5 pt-0.5",
            previewOnHover ? "md:group-hover:invisible" : null
          )}
        >
          {metaRight}
        </div>
      ) : null}

      {showPreview && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-[120px] aspect-video rounded-[2px] overflow-hidden shadow-md hidden md:block">
          <Image
            src={previewImage as string}
            alt={title}
            fill
            className="object-cover"
            sizes="120px"
          />
        </div>
      )}
    </Link>
  );
}

