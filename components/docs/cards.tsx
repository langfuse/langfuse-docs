/**
 * Thin wrappers around fumadocs-ui Card/Cards.
 * Adds backward-compatible `num` prop to Cards for column control,
 * and makes `title` optional on Card (defaults to empty string).
 */
import * as React from "react";
import Link from "fumadocs-core/link";
import {
  Cards as FumadocsCards,
  type CardProps as FumadocsCardProps,
} from "fumadocs-ui/components/card";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Text } from "@/components/ui/text";
import { CornerBox } from "@/components/ui/corner-box";

interface CardsProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Number of columns (1 | 2 | 3). Defaults to 2. */
  num?: number;
  className?: string;
  children?: React.ReactNode;
}

export type CardProps = Omit<FumadocsCardProps, "title"> & {
  title?: React.ReactNode;
  contentClassName?: string;
  contentWrapperClassName?: string;
  /** Trailing chevron signalling that a linked card is clickable. Defaults to true for titled cards. */
  arrow?: boolean;
  /** Source line under the description, for example "ClickHouse blog". */
  source?: string;
  /** Render children as a full-bleed cover above the title. */
  cover?: boolean;
};

export function Card({
  icon,
  title = "",
  description = "",
  arrow,
  children,
  contentClassName,
  contentWrapperClassName,
  source,
  cover = false,
  ...props
}: CardProps) {
  const E = props.href ? Link : "div";
  const showArrow = arrow ?? Boolean(title);
  return (
    <E
      {...props}
      data-card
      className={cn(
        "block @max-lg:col-span-full",
        cover && "h-full",
        props.className,
      )}
    >
      <CornerBox
        hoverStripes={!!props.href}
        className={cn(
          cover
            ? "flex h-full flex-col items-stretch gap-0 overflow-hidden p-0 text-text-primary"
            : "flex h-full w-full flex-row items-center gap-2.5 p-2 text-text-primary sm:p-3",
          contentClassName,
        )}
      >
        {cover && children ? (
          <div className="not-prose relative aspect-[1200/630] w-full shrink-0 overflow-hidden">
            {children}
          </div>
        ) : null}
        {icon ? (
          <div className="not-prose shrink-0 [&_svg]:size-5 [&_img]:size-5">
            {icon}
          </div>
        ) : null}
        <div
          className={cn(
            "flex min-w-0 flex-1 flex-col gap-1",
            cover && "p-3",
            contentWrapperClassName,
          )}
        >
          <div className="flex items-center gap-1">
            <Text
              as="h3"
              size="s"
              className="not-prose mb-0 min-w-0 flex-1 font-medium text-left text-text-secondary"
            >
              {title}
            </Text>
            {props.href && showArrow ? (
              <ChevronRight
                aria-hidden="true"
                className="size-4 shrink-0 text-text-secondary"
              />
            ) : null}
          </div>
          {description ? (
            <Text size="s" className="my-0! text-left text-text-secondary">
              {description}
            </Text>
          ) : null}
          {source ? (
            <Text
              size="s"
              className="my-0! mt-auto pt-1 text-left text-text-tertiary"
            >
              {source}
            </Text>
          ) : null}
          {cover ? null : (
            <div className="prose-no-margin text-sm text-text-primary empty:hidden">
              {children}
            </div>
          )}
        </div>
      </CornerBox>
    </E>
  );
}

function CardsBase({ num, className, ...props }: CardsProps) {
  const colsClass =
    num === 1
      ? "[&>*]:col-span-full"
      : num === 3
        ? "sm:grid-cols-3"
        : undefined;
  return <FumadocsCards className={cn(colsClass, className)} {...props} />;
}

// Attach Card as a static property so <Cards.Card> works in TSX and MDX
export const Cards = Object.assign(CardsBase, { Card });
