import React from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
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
    <Link href={href} className="block h-full">
      <Card
        className={cn(
          "h-full transition-all duration-200 border bg-transparent hover:bg-muted/40 hover:border-gray-300 dark:hover:border-gray-600 group",
          className,
        )}
      >
        <CardContent className="p-4 flex flex-col h-full">
          <div className="flex items-center gap-3 mb-4">
            <div className="text-muted-foreground flex items-center group-hover:text-primary transition-colors">
              {icon}
            </div>
            <h3 className="font-semibold text-lg leading-tight flex-1">
              {title}
            </h3>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
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
