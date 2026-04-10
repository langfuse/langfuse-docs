"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { HoverCorners } from "./corner-box";
import { tooltipContentClassName } from "./tooltip";

const FOLLOW_OFFSET = 12;

export interface ChipCardProps {
  href?: string;
  label?: string;
  tooltip?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}

const ChipCard = React.forwardRef<HTMLAnchorElement | HTMLDivElement, ChipCardProps>(
  ({ href, icon, label, tooltip, size = "sm", className, children }, ref) => {
    const tooltipId = React.useId();
    const [mounted, setMounted] = React.useState(false);
    const [open, setOpen] = React.useState(false);
    const [pos, setPos] = React.useState({ x: 0, y: 0 });

    React.useEffect(() => setMounted(true), []);

    const followHandlers = tooltip
      ? {
        "aria-describedby": open ? tooltipId : undefined,
        onPointerEnter: (e: React.PointerEvent) => {
          setOpen(true);
          setPos({ x: e.clientX, y: e.clientY });
        },
        onPointerLeave: () => setOpen(false),
        onPointerMove: (e: React.PointerEvent) =>
          setPos({ x: e.clientX, y: e.clientY }),
      }
      : {};

    const isMd = size === "md";

    const inner = children ? (
      <>
        <HoverCorners />
        {children}
      </>
    ) : (
      <>
        <HoverCorners />
        {icon && (
          <span className={cn(
            "flex justify-center items-center shrink-0",
            isMd ? "w-6 h-6" : "w-5 h-5"
          )}>
            {icon}
          </span>
        )}
        <span className={cn(
          "font-normal leading-none whitespace-nowrap text-text-secondary",
          isMd ? "text-[15px]" : "text-[14px]"
        )}>
          {label}
        </span>
      </>
    );

    const baseClassName = cn(
      "box-custom-hover",
      "relative group inline-flex items-center",
      "border border-line-structure bg-surface-bg rounded-[2px]",
      "transition-colors duration-120 cursor-pointer",
      isMd ? "gap-3 px-4 py-3 min-w-[140px]" : "gap-2.5 px-3.5 py-2.5",
      className
    );

    const tooltipPortal =
      tooltip && mounted && open
        ? createPortal(
          <div
            id={tooltipId}
            role="tooltip"
            className={cn(tooltipContentClassName, "fixed pointer-events-none")}
            style={{
              left: pos.x + FOLLOW_OFFSET,
              top: pos.y + FOLLOW_OFFSET,
            }}
          >
            {tooltip}
          </div>,
          document.body
        )
        : null;

    if (href) {
      return (
        <>
          <Link
            ref={ref as React.ForwardedRef<HTMLAnchorElement>}
            href={href}
            className={baseClassName}
            {...followHandlers}
          >
            {inner}
          </Link>
          {tooltipPortal}
        </>
      );
    }

    return (
      <>
        <div
          ref={ref as React.ForwardedRef<HTMLDivElement>}
          className={baseClassName}
          {...followHandlers}
        >
          {inner}
        </div>
        {tooltipPortal}
      </>
    );
  }
);

ChipCard.displayName = "ChipCard";

export { ChipCard };
