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
          "h-full transition-all hover:shadow-md border bg-card",
          className
        )}
      >
        <CardContent className="p-6 flex flex-col h-full">
          <div className="flex items-start gap-3 mb-4">
            <div className="text-muted-foreground mt-0.5">{icon}</div>
            <h3 className="font-semibold text-lg leading-tight flex-1">
              {title}
            </h3>
            <ArrowRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
          </div>
          <p className="text-sm text-muted-foreground mt-auto leading-relaxed">
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
    <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-4 mt-6", className)}>
      {children}
    </div>
  );
}
