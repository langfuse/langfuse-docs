import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import React, { forwardRef } from "react";

const HomeSubHeader = forwardRef<
  HTMLDivElement,
  {
    title?: string;
    subtitle?: string;
    description?: string;
    button?: { href: string; text: string };
    className?: string;
  }
>(({ title, subtitle, description, className, button }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "mx-auto max-w-4xl text-center mb-20 text-balance",
        className
      )}
    >
      {title && <h2 className="text-base font-semibold leading-7">{title}</h2>}
      {subtitle && (
        <p className="mt-2 text-4xl font-bold tracking-tight sm:text-6xl text-balance">
          {subtitle}
        </p>
      )}
      {description && (
        <p className="mt-6 text-lg leading-8 text-primary/70">{description}</p>
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
