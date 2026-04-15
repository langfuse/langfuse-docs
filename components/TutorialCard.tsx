import React from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

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
    <Link href={href} className="block h-full no-underline">
      <Card
        className={cn(
          "group h-full border bg-surface-bg transition-all duration-200 hover:bg-muted/40 hover:border-border",
          className
        )}
      >
        <CardContent className="flex h-full min-h-[140px] flex-col justify-center gap-3 p-4">
          <div className="flex items-center gap-2">
            <div className="flex size-5 shrink-0 items-center justify-center text-text-tertiary transition-colors group-hover:text-text-primary [&>svg]:size-5">
              {icon}
            </div>
            <h3 className="!m-0 !border-0 !p-0 text-base font-semibold leading-none text-text-primary no-underline">
              {title}
            </h3>
          </div>
          <p className="text-sm leading-relaxed text-text-tertiary no-underline">
            {description}
          </p>
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
