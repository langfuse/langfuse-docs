import NextLink from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import type { AnchorHTMLAttributes } from "react";

/**
 * Unified link component wrapping next/link.
 *
 * Variants:
 *   default   — inherits text color, no underline (navigation use)
 *   nav       — Body-S/Regular: tertiary text, 13px / 430 / 120% / -0.26px (navbar)
 *   text      — muted text, lightens on hover (sidebar / metadata)
 *   underline — always underlined (inline prose / MDX content)
 *   button    — solid primary button
 *   outline   — outline button
 *   ghost     — ghost button (hover background only)
 *
 * External URLs (http/https/mailto/tel) automatically get target="_blank"
 * and rel="noopener noreferrer" unless overridden.
 */
const linkVariants = cva(
  "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
  {
    variants: {
      variant: {
        default: "text-foreground hover:text-muted-foreground",
        nav: "text-text-tertiary hover:text-text-secondary no-underline font-sans text-[13px] font-[430] leading-[1.2] tracking-[-0.26px] [text-shadow:0_0_0_#B5AFEA]",
        text: "leading-snug font-[430] tracking-[-0.26px] text-text-tertiary underline decoration-line-structure underline-offset-2 transition-colors group-hover:text-text-secondary hover:text-text-primary",
        underline:
          "text-text-links underline decoration-1 underline-offset-2 decoration-text-links hover:text-primary hover:decoration-primary font-normal",
        button:
          "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/80 h-10 px-4 py-2",
        outline:
          "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded text-sm font-medium border border-input bg-background/30 hover:bg-accent/70 hover:text-accent-foreground h-10 px-4 py-2",
        ghost:
          "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded text-sm font-medium hover:bg-primary/10 hover:text-accent-foreground h-10 px-4 py-2",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export type LinkVariants = VariantProps<typeof linkVariants>;

export type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> &
  LinkVariants & {
    href?: string;
  };

function isExternal(href: string): boolean {
  return (
    href.startsWith("http://") ||
    href.startsWith("https://") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:")
  );
}

export function Link({
  href,
  variant,
  className,
  children,
  target,
  rel,
  ...props
}: LinkProps) {
  const classes = cn(linkVariants({ variant }), className);

  // No href — render plain anchor (e.g. named anchor targets)
  if (!href) {
    return (
      <a className={classes} {...props}>
        {children}
      </a>
    );
  }

  // External URL — use <a> with safe defaults
  if (isExternal(href)) {
    return (
      <a
        href={href}
        target={target ?? "_blank"}
        rel={rel ?? "noopener noreferrer"}
        className={classes}
        {...props}
      >
        {children}
      </a>
    );
  }

  // Internal URL — use Next.js Link for client-side navigation
  return (
    <NextLink href={href} target={target} rel={rel} className={classes} {...props}>
      {children}
    </NextLink>
  );
}

export { linkVariants };
