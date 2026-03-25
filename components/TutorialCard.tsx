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
          "h-full transition-all duration-200 border bg-transparent hover:bg-muted/40 hover:border-gray-300 dark:hover:border-gray-600 group",
          className
        )}
      >
        <CardContent className="p-4 flex flex-col h-full gap-3">
          <div className="flex items-center gap-2">
            <div className="text-muted-foreground flex items-center justify-center shrink-0 w-5 h-5 group-hover:text-primary transition-colors [&>svg]:w-5 [&>svg]:h-5">
              {icon}
            </div>
            <h3 className="font-semibold text-base leading-none no-underline !m-0 !p-0 !border-0">
              {title}
            </h3>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed no-underline">
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
