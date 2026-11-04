"use client";

import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";
import { HoverCorners } from "@/components/ui/corner-box";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import { usePostHogClientCapture } from "@/src/usePostHogClientCapture";

type SignupSurface = "blog" | "customer_story";

type BlogCloudCtaProps = {
  /** `stack` for the narrow right column. `row` for the end of the article. */
  layout?: "stack" | "row";
  /** Which page the click came from. Picks the PostHog event name. */
  surface?: SignupSurface;
  className?: string;
};

function CtaLink({
  href,
  variant,
  children,
  className,
  onClick,
}: {
  href: string;
  variant: "primary" | "secondary";
  children: string;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <div className={cn("group relative flex items-center p-1", className)}>
      <HoverCorners />
      <NextLink
        href={href}
        onClick={onClick}
        className={cn(
          buttonVariants({ variant, size: "small" }),
          "justify-center px-2 font-sans text-[12px] font-[450] leading-[150%] tracking-[-0.06px]",
        )}
      >
        {children}
      </NextLink>
    </div>
  );
}

/**
 * Signup action for blog posts and customer stories. The stack layout sits
 * under the table of contents. The row layout is the same offer at the end
 * of the article, where the right column is hidden.
 */
export function BlogCloudCta({
  layout = "stack",
  surface = "blog",
  className,
}: BlogCloudCtaProps) {
  const pathname = usePathname() ?? "/";
  const capture = usePostHogClientCapture();
  const placement = layout === "stack" ? "sidebar" : "article";
  const trackSignUp = () => {
    const properties = { placement, path: pathname };
    if (surface === "customer_story") {
      capture("customer_story:sign_up_clicked", properties);
    } else {
      capture("blog:sign_up_clicked", properties);
    }
  };

  const copy = (
    <div className={layout === "row" ? "min-w-0" : undefined}>
      <Text
        size="s"
        className="mb-1 font-[430] text-left text-[13px] text-text-primary"
      >
        Get started today
      </Text>
      <Text
        size="s"
        className="text-left text-[13px] leading-snug text-text-tertiary"
      >
        Interested in tracing and improving your AI agents? Get started with
        Langfuse in minutes.
      </Text>
    </div>
  );

  const action = (
    <CtaLink
      href="/cloud"
      variant="primary"
      className={
        layout === "row" ? "mt-3 w-full sm:mt-0 sm:w-[140px]" : "mt-3 w-full"
      }
      onClick={trackSignUp}
    >
      Sign up
    </CtaLink>
  );

  if (layout === "row") {
    return (
      <section
        id={surface === "blog" ? "blog-cloud-cta" : "customer-story-cta"}
        aria-label="Get started today"
        className={cn(
          "not-prose flex flex-col border border-line-structure bg-surface-1 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4",
          className,
        )}
      >
        {copy}
        {action}
      </section>
    );
  }

  return (
    <section
      aria-label="Get started today"
      className={cn("px-4 py-4", className)}
    >
      {copy}
      {action}
    </section>
  );
}
