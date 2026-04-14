import * as React from "react"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"
import Link from "next/link"

import { cn } from "@/lib/utils"

const paginationIconAreaClassName =
  "inline-flex h-full aspect-square shrink-0 items-center justify-center rounded-[1px] border-[0.5px] border-[rgba(64,61,57,0.20)] bg-[rgba(64,61,57,0.10)] p-[1px] text-button-icon dark:bg-transparent"

const Pagination = ({ className, ...props }: React.ComponentProps<"nav">) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn("mx-auto flex w-full justify-center", className)}
    {...props}
  />
)
Pagination.displayName = "Pagination"

const PaginationContent = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn("flex flex-row list-none h-[26px] not-prose items-center gap-1.5", className)}
    {...props}
  />
))
PaginationContent.displayName = "PaginationContent"

const PaginationItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn("list-none h-[26px]", className)} {...props} />
))
PaginationItem.displayName = "PaginationItem"

type PaginationLinkProps = {
  isActive?: boolean
  size?: "default" | "small"
} & React.ComponentProps<"a">

const PaginationLink = ({
  className,
  isActive,
  size = "small",
  href,
  children,
  ...props
}: PaginationLinkProps) => {
  const sharedClassName = cn(
    "inline-flex items-center justify-center gap-1 rounded-[1px] border border-line-structure bg-surface-bg text-[12px] font-[450] leading-[150%] tracking-[-0.06px] text-text-secondary no-underline shadow-none transition-colors hover:bg-surface-1 hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50",
    size === "small" ? "h-[26px] min-w-[26px] px-2" : "h-[32px] min-w-[32px] px-2",
    isActive && "bg-primary text-surface-bg",
    className
  )

  if (href) {
    return (
      <Link
        href={href}
        aria-current={isActive ? "page" : undefined}
        className={sharedClassName}
        {...props}
      >
        {children}
      </Link>
    )
  }

  return (
    <button
      type="button"
      aria-current={isActive ? "page" : undefined}
      className={sharedClassName}
      {...(props as React.ComponentProps<"button">)}
    >
      {children}
    </button>
  )
}
PaginationLink.displayName = "PaginationLink"

const PaginationPrevious = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to previous page"
    className={cn("gap-1.5 pr-1.75 py-0.75 pl-0.75 items-center", className)}
    {...props}
  >
    <span className={paginationIconAreaClassName} aria-hidden>
      <ChevronLeft className="h-3 w-3 inline-flex" />
    </span>
    Previous
  </PaginationLink>
)
PaginationPrevious.displayName = "PaginationPrevious"

const PaginationNext = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to next page"
    className={cn("gap-1.5 pl-1.75 py-0.75 pr-0.75", className)}
    {...props}
  >
    Next
    <span className={paginationIconAreaClassName} aria-hidden>
      <ChevronRight className="h-3 w-3 inline-flex" />
    </span>
  </PaginationLink>
)
PaginationNext.displayName = "PaginationNext"

const PaginationEllipsis = ({
  className,
  ...props
}: React.ComponentProps<"span">) => (
  <span
    aria-hidden
    className={cn(
      "inline-flex h-[26px] min-w-[26px] items-end justify-center pb-0.5",
      className
    )}
    {...props}
  >
    <span aria-hidden>
      <MoreHorizontal className="h-3 w-3" />
    </span>
    <span className="sr-only">More pages</span>
  </span>
)
PaginationEllipsis.displayName = "PaginationEllipsis"

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
}
