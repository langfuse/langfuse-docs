import { cn } from "@/lib/utils";
import React, { forwardRef } from "react";
import { HomeSection } from "@/components/home/HomeSection";

export const WrappedSection = forwardRef<
  HTMLElement,
  { children: React.ReactNode; className?: string; id?: string }
>((props, ref) => {
  return (
    <HomeSection
      ref={ref}
      id={props.id}
      className={cn("pt-16 lg:pt-24", props.className)}
    >
      {props.children}
    </HomeSection>
  );
});

WrappedSection.displayName = "WrappedSection";
