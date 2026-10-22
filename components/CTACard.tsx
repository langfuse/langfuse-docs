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
    <Card className={cn("mt-8", className)} hoverStripes>
      <CardContent className="not-prose p-6">
        <div className="flex flex-col gap-6">
          <div className="space-y-2">
            <h3 className="m-0 text-xl font-medium leading-tight text-text-primary">
              {title}
            </h3>
            <p className="m-0 text-text-tertiary">{description}</p>
          </div>
          {children && (
            <div className="flex w-fit flex-col items-start gap-3 sm:flex-row">
              {React.Children.map(children, (child) => {
                if (!React.isValidElement(child) || child.type !== Button) {
                  return child;
                }

                const className = cn(
                  "w-auto px-4",
                  (child.props as { className?: string }).className,
                );

                if (!showArrow) {
                  return React.cloneElement(child, { className } as any);
                }

                if (
                  child.props.asChild &&
                  React.isValidElement(child.props.children)
                ) {
                  // asChild: inject arrow inside the <a> so Slot renders <a> with button classes
                  const linkChild = child.props.children as React.ReactElement;
                  return React.cloneElement(child, {
                    className,
                    children: React.cloneElement(linkChild, {
                      children: (
                        <span className="flex items-center gap-2">
                          {linkChild.props.children}
                          <ArrowRight className="h-4 w-4" />
                        </span>
                      ),
                    }),
                  } as any);
                }

                return React.cloneElement(child, {
                  className,
                  children: (
                    <span className="flex items-center gap-2">
                      {child.props.children}
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  ),
                } as any);
              })}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
