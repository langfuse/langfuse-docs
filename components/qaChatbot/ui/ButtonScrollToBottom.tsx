"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { Button, type ButtonProps } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";
import { useAtBottom } from "../hooks/use-at-bottom";

export function ButtonScrollToBottom({
  className,
  outerDivRef,
  ...props
}: ButtonProps & { outerDivRef: React.Ref<HTMLButtonElement> }) {
  const isAtBottom = useAtBottom(outerDivRef);

  return (
    <Button
      variant="outline"
      size="icon"
      className={cn(
        "absolute right-4 bottom-3 -top-20 z-10 bg-background transition-opacity duration-300",
        isAtBottom ? "opacity-0" : "opacity-100",
        className
      )}
      onClick={() => {
        outerDivRef?.current?.scrollTo({
          top: document.body.offsetHeight,
          behavior: "smooth",
        });
      }}
      {...props}
    >
      <ArrowDown className="h-4 w-4" />
      <span className="sr-only">Scroll to bottom</span>
    </Button>
  );
}
