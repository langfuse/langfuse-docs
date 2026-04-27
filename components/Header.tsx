import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Heading, type HeadingLevel } from "@/components/ui/heading";

export const Header = ({
  title,
  description,
  className,
  buttons,
  h = "h2",
}: {
  title?: React.ReactNode;
  description?: React.ReactNode;
  buttons?: { href: string; text: string; target?: string }[];
  h?: HeadingLevel;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "mx-auto max-w-4xl text-center mb-12 text-balance",
        className
      )}
    >
      {title && (
        <Heading as={h} size="big" className="text-balance">
          {title}
        </Heading>
      )}
      {description && (
        <p className="mt-6 text-2xl leading-8 font-medium tracking-wide text-primary/70">
          {description}
        </p>
      )}
      {buttons && (
        <div className="mt-6 flex flex-row gap-2 justify-center flex-wrap">
          {buttons.map((button) => (
            <Button key={button.href} variant="ghost" asChild>
              {button.target ? (
                <a href={button.href} target={button.target} rel="noopener noreferrer">
                  {button.text} <ArrowRight size={14} className="ml-2" />
                </a>
              ) : (
                <Link href={button.href}>
                  {button.text} <ArrowRight size={14} className="ml-2" />
                </Link>
              )}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};
