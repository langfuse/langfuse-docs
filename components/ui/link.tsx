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
        text: "leading-snug font-[430] tracking-[-0.26px] text-text-tertiary underline decoration-line-structure underline-offset-2 transition-colors group-hover:text-text-secondary group-hover/box:text-text-secondary hover:text-text-primary",
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
  },
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

/**
 * Same-origin short paths that 307/302 off-site (see lib/redirects.js).
 * Soft-navigating them with next/link issues an RSC fetch against the
 * external Location and can land on "This page couldn't load".
 */
const EXTERNAL_REDIRECT_HREFS: Record<string, string> = {
  "/discord": "https://discord.gg/7NXusRtqYU",
  "/terms":
    "https://clickhouse.com/legal/clickhouse-general-terms-and-conditions",
  "/dpa": "https://clickhouse.com/legal/agreements/data-processing-addendum",
  "/security/dpa":
    "https://clickhouse.com/legal/agreements/data-processing-addendum",
  "/toms": "https://clickhouse.com/legal/agreements/security-addendum",
  "/security/toms": "https://clickhouse.com/legal/agreements/security-addendum",
  "/ph": "https://www.producthunt.com/products/langfuse",
  "/issue": "https://github.com/langfuse/langfuse/issues/new/choose",
  "/new-issue": "https://github.com/langfuse/langfuse/issues/new/choose",
  "/issues": "https://github.com/langfuse/langfuse/issues",
  "/billing-portal": "https://billing.stripe.com/p/login/6oE9BXd4u8PR2aYaEE",
  "/stickers": "https://forms.gle/Af5BHpWUMZSCT4kg8?_imcp=1",
  "/sticker": "https://forms.gle/Af5BHpWUMZSCT4kg8?_imcp=1",
};

function resolveHref(href: string): string {
  return EXTERNAL_REDIRECT_HREFS[href] ?? href;
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

  const resolvedHref = resolveHref(href);

  // External URL — use <a> with safe defaults
  if (isExternal(resolvedHref)) {
    return (
      <a
        href={resolvedHref}
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
    <NextLink
      href={resolvedHref}
      target={target}
      rel={rel}
      className={classes}
      {...props}
    >
      {children}
    </NextLink>
  );
}

export { linkVariants };
