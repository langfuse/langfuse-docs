import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface CTACardProps {
  title: string;
  description: string;
  children?: React.ReactNode;
  className?: string;
  showArrow?: boolean;
}

export function CTACard({
  title,
  description,
  children,
  className,
  showArrow = false,
}: CTACardProps) {
  return (
    <Card className={cn("border bg-card mt-8", className)}>
      <CardContent className="p-8">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div className="flex-1 md:flex-[2] space-y-2">
            <h3 className="text-xl font-semibold text-foreground">{title}</h3>
            <p className="text-muted-foreground">{description}</p>
          </div>
          {children && (
            <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-end items-center md:flex-1">
              {showArrow
                ? React.Children.map(children, (child) => {
                    if (
                      React.isValidElement(child) &&
                      (child.type === Button || child.props.asChild)
                    ) {
                      return React.cloneElement(child, {
                        children: (
                          <div className="flex items-center gap-2">
                            {child.props.children}
                            <ArrowRight className="h-4 w-4" />
                          </div>
                        ),
                      } as any);
                    }
                    return child;
                  })
                : children}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
