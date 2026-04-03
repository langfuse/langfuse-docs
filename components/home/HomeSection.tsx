"use client";

import { cn } from "@/lib/utils";
import React, { forwardRef, useEffect, useRef, useState } from "react";

export const HomeSection = forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement>
>(({ className, children, ...props }, ref) => {
  const innerRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = innerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={(node) => {
        (innerRef as React.MutableRefObject<HTMLElement | null>).current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLElement | null>).current = node;
      }}
      className={cn(
        "mx-auto w-full max-w-[640px] lg:max-w-[840px]",
        "transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)]",
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
        className
      )}
      {...props}
    >
      {children}
    </section>
  );
});

HomeSection.displayName = "HomeSection";
