import React from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Heading } from "./ui/heading";
import { Text } from "./ui/text";

interface TutorialCardProps {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  className?: string;
}

export function TutorialCard({
  title,
  description,
  href,
  icon,
  className,
}: TutorialCardProps) {
  return (
    <Link href={href} className="block h-full group no-underline not-prose">
      <Card
        className={cn(
          "group h-full border bg-surface-bg corner-box-hover-stripes",
          className
        )}
      >
        <CardContent className="flex h-full min-h-[140px] flex-col justify-center gap-3 p-4">
          <div className="flex items-center gap-2">
            <div className="flex size-4 shrink-0 items-center justify-center text-text-tertiary transition-colors group-hover:text-text-secondary [&>svg]:size-5">
              {icon}
            </div>
            <Heading as="h3" size="small" className="not-prose">
              {title}
            </Heading>
          </div>
          <Text size="s" className="text-text-tertiary text-left group-hover:text-text-secondary transition-colors duration-220">
            {description}
          </Text>
        </CardContent>
      </Card>
    </Link>
  );
}

interface TutorialCardsProps {
  children: React.ReactNode;
  className?: string;
}

export function TutorialCards({ children, className }: TutorialCardsProps) {
  return (
    <div
      className={cn("grid grid-cols-1 md:grid-cols-2 gap-4 mt-6", className)}
    >
      {children}
    </div>
  );
}
