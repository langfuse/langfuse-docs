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
        <div className="flex flex-col gap-4">
          <div className="space-y-2">
            <h3 className="m-0 text-xl font-medium leading-tight text-text-primary">
              {title}
            </h3>
            <p className="m-0 text-text-tertiary">{description}</p>
          </div>
          {children && (
            <div className="flex w-fit flex-wrap gap-3 [&_a]:w-auto">
              {showArrow
                ? React.Children.map(children, (child) => {
                    if (React.isValidElement(child) && child.type === Button) {
                      if (
                        child.props.asChild &&
                        React.isValidElement(child.props.children)
                      ) {
                        // asChild: inject arrow inside the <a> so Slot renders <a> with button classes
                        const linkChild = child.props
                          .children as React.ReactElement;
                        return React.cloneElement(child, {
                          children: React.cloneElement(linkChild, {
                            children: (
                              <span className="flex gap-2 items-center">
                                {linkChild.props.children}
                                <ArrowRight className="w-4 h-4" />
                              </span>
                            ),
                          }),
                        } as any);
                      }
                      return React.cloneElement(child, {
                        children: (
                          <span className="flex gap-2 items-center">
                            {child.props.children}
                            <ArrowRight className="w-4 h-4" />
                          </span>
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
