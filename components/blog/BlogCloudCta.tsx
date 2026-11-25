"use client";

import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { SignupCTA } from "@/components/SignupCTA";
import { buttonVariants } from "@/components/ui/button";
import { HoverCorners } from "@/components/ui/corner-box";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import { usePostHogClientCapture } from "@/src/usePostHogClientCapture";

type SignupSurface = "blog" | "customer_story";
type SignupPlacement = "sidebar" | "article";

type BlogCloudCtaProps = {
  /** Which page the click came from. Picks the PostHog event name. */
  surface?: SignupSurface;
  className?: string;
};

function useTrackSignUp(surface: SignupSurface, placement: SignupPlacement) {
  const pathname = usePathname() ?? "/";
  const capture = usePostHogClientCapture();
  return () => {
    const properties = { placement, path: pathname };
    if (surface === "customer_story") {
      capture("customer_story:sign_up_clicked", properties);
    } else {
      capture("blog:sign_up_clicked", properties);
    }
  };
}

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
    <div
      className={cn(
        "group relative flex items-center p-1 button-wrapper",
        className,
      )}
    >
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
 * Sidebar signup action for blog posts and customer stories, shown under
 * the table of contents in the narrow right column.
 */
export function BlogCloudCta({
  surface = "blog",
  className,
}: BlogCloudCtaProps) {
  const trackSignUp = useTrackSignUp(surface, "sidebar");

  return (
    <section
      aria-label="Get started today"
      className={cn("px-4 py-4", className)}
    >
      <div>
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
      <CtaLink
        href="/cloud"
        variant="primary"
        className="mt-3 w-full"
        onClick={trackSignUp}
      >
        Sign up
      </CtaLink>
    </section>
  );
}

/**
 * End-of-article signup banner for blog posts and customer stories when the
 * right sidebar is hidden. Reuses the shared SignupCTA with PostHog tracking.
 */
export function BlogArticleSignupCta({
  surface = "blog",
  className,
}: BlogCloudCtaProps) {
  const trackSignUp = useTrackSignUp(surface, "article");
  return <SignupCTA className={className} onClick={trackSignUp} />;
}
