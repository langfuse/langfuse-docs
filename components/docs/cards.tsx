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
};

export function Card({
  icon,
  title = "",
  description = "",
  arrow,
  children,
  contentClassName,
  contentWrapperClassName,
  ...props
}: CardProps) {
  const E = props.href ? Link : "div";
  const showArrow = arrow ?? Boolean(title);
  return (
    <E
      {...props}
      data-card
      className={cn("block @max-lg:col-span-full", props.className)}
    >
      <CornerBox
        hoverStripes={!!props.href}
        className={cn(
          "flex flex-row items-center p-2 sm:p-3 gap-2.5 text-text-primary w-full h-full",
          contentClassName,
        )}
      >
        {icon ? (
          <div className="not-prose shrink-0 [&_svg]:size-5 [&_img]:size-5">
            {icon}
          </div>
        ) : null}
        <div
          className={cn(
            "flex flex-1 min-w-0 flex-col gap-1",
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
            <Text size="s" className="my-0! text-text-secondary">
              {description}
            </Text>
          ) : null}
          <div className="text-sm text-text-primary prose-no-margin empty:hidden">
            {children}
          </div>
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
