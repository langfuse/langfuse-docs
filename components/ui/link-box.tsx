"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { HoverCorners } from "./corner-box";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  tooltipContentClassName,
} from "./tooltip";

export type LinkBoxTooltipPlacement = "follow" | "bottom-center" | "bottom-right";

export interface LinkBoxProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "href"> {
  href?: React.ComponentProps<typeof Link>["href"];
  prefetch?: React.ComponentProps<typeof Link>["prefetch"];
  replace?: React.ComponentProps<typeof Link>["replace"];
  scroll?: React.ComponentProps<typeof Link>["scroll"];
  shallow?: React.ComponentProps<typeof Link>["shallow"];
  locale?: React.ComponentProps<typeof Link>["locale"];
  tooltip?: React.ReactNode;
  tooltipPlacement?: LinkBoxTooltipPlacement;
}

const FOLLOW_OFFSET = 12;

const LinkBox = React.forwardRef<HTMLAnchorElement | HTMLDivElement, LinkBoxProps>(
  (
    {
      className,
      children,
      tooltip,
      tooltipPlacement = "bottom-center",
      href,
      prefetch,
      replace,
      scroll,
      shallow,
      locale,
      onPointerEnter,
      onPointerLeave,
      onPointerMove,
      ...props
    },
    ref
  ) => {
    const [mounted, setMounted] = React.useState(false);
    React.useEffect(() => setMounted(true), []);

    const tooltipId = React.useId();
    const [followOpen, setFollowOpen] = React.useState(false);
    const [followPos, setFollowPos] = React.useState({ x: 0, y: 0 });

    const boxClassName = cn("link-box group py-2.5 px-4.5", className);

    const linkProps =
      href !== undefined && href !== null && href !== ""
        ? { href, prefetch, replace, scroll, shallow, locale }
        : null;

    if (!tooltip) {
      if (linkProps) {
        return (
          <Link
            ref={ref as React.ForwardedRef<HTMLAnchorElement>}
            className={boxClassName}
            {...linkProps}
            {...props}
          >
            <HoverCorners />
            {children}
          </Link>
        );
      }
      return (
        <div
          ref={ref as React.ForwardedRef<HTMLDivElement>}
          className={boxClassName}
          {...props}
        >
          <HoverCorners />
          {children}
        </div>
      );
    }

    if (tooltipPlacement === "follow") {
      const followHandlers = {
        "aria-describedby": followOpen ? tooltipId : undefined,
        onPointerEnter: (e: React.PointerEvent<HTMLAnchorElement | HTMLDivElement>) => {
          onPointerEnter?.(e as React.PointerEvent<HTMLDivElement>);
          setFollowOpen(true);
          setFollowPos({ x: e.clientX, y: e.clientY });
        },
        onPointerLeave: (
          e: React.PointerEvent<HTMLAnchorElement | HTMLDivElement>
        ) => {
          onPointerLeave?.(e as React.PointerEvent<HTMLDivElement>);
          setFollowOpen(false);
        },
        onPointerMove: (
          e: React.PointerEvent<HTMLAnchorElement | HTMLDivElement>
        ) => {
          onPointerMove?.(e as React.PointerEvent<HTMLDivElement>);
          setFollowPos({ x: e.clientX, y: e.clientY });
        },
      };

      return (
        <>
          {linkProps ? (
            <Link
              ref={ref as React.ForwardedRef<HTMLAnchorElement>}
              className={boxClassName}
              {...linkProps}
              {...props}
              {...followHandlers}
            >
              <HoverCorners />
              {children}
            </Link>
          ) : (
            <div
              ref={ref as React.ForwardedRef<HTMLDivElement>}
              className={boxClassName}
              {...props}
              {...followHandlers}
            >
              <HoverCorners />
              {children}
            </div>
          )}
          {mounted &&
            followOpen &&
            createPortal(
              <div
                id={tooltipId}
                role="tooltip"
                className={cn(
                  tooltipContentClassName,
                  "fixed pointer-events-none"
                )}
                style={{
                  left: followPos.x + FOLLOW_OFFSET,
                  top: followPos.y + FOLLOW_OFFSET,
                }}
              >
                {tooltip}
              </div>,
              document.body
            )}
        </>
      );
    }

    return (
      <TooltipProvider disableHoverableContent={false}>
        <Tooltip>
          <TooltipTrigger asChild>
            {linkProps ? (
              <Link
                ref={ref as React.ForwardedRef<HTMLAnchorElement>}
                className={boxClassName}
                {...linkProps}
                {...props}
              >
                <HoverCorners />
                {children}
              </Link>
            ) : (
              <div
                ref={ref as React.ForwardedRef<HTMLDivElement>}
                className={boxClassName}
                {...props}
              >
                <HoverCorners />
                {children}
              </div>
            )}
          </TooltipTrigger>
          <TooltipContent
            side="bottom"
            sideOffset={-14}
            avoidCollisions={true}
            className="pointer-events-none"
            align={tooltipPlacement === "bottom-right" ? "end" : "center"}
            alignOffset={tooltipPlacement === "bottom-right" ? 12 : 0}
          >
            {tooltip}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
);
LinkBox.displayName = "LinkBox";

export { LinkBox };
