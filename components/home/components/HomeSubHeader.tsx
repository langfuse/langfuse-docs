import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import React, { forwardRef } from "react";

const HomeSubHeader = forwardRef<
  HTMLDivElement,
  {
    title?: string;
    description?: string;
    button?: { href: string; text: string };
    className?: string;
  }
>(({ title, description, className, button }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "mx-auto max-w-4xl text-center mb-20 text-balance",
        className
      )}
    >
      {title && (
        <h2 className="mt-2 text-5xl font-bold tracking-tight sm:text-7xl text-balance">
          {title}
        </h2>
      )}
      {description && (
        <p className="mt-6 text-2xl leading-8 font-medium tracking-wide text-primary/70">
          {description}
        </p>
      )}
      {button && (
        <Button variant="ghost" className="mt-6" asChild>
          <Link href={button.href}>
            {button.text} <ArrowRight size={14} className="ml-2" />
          </Link>
        </Button>
      )}
    </div>
  );
});

HomeSubHeader.displayName = "HomeSubHeader";

export default HomeSubHeader;
