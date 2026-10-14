import { cn } from "@/lib/utils";
import React from "react";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  className?: string;
  children?: React.ReactNode;
  id?: string;
}

export function SectionHeading({
  title,
  subtitle,
  className,
  children,
  id,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 items-start mb-8 lg:flex-row lg:items-end lg:justify-between lg:gap-8",
        className,
      )}
    >
      <div className="flex-1 min-w-0">
        <Heading as="h2" id={id}>
          {title}
        </Heading>
        {subtitle && (
          <Text className="mt-3 text-left max-w-[64ch]">{subtitle}</Text>
        )}
      </div>
      {children && <div className="lg:text-right shrink-0">{children}</div>}
    </div>
  );
}
