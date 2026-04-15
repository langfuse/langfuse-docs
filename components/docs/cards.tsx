/**
 * Thin wrappers around fumadocs-ui Card/Cards.
 * Adds backward-compatible `num` prop to Cards for column control,
 * and makes `title` optional on Card (defaults to empty string).
 */
import * as React from "react";
import Link from 'fumadocs-core/link';
import {
  Cards as FumadocsCards,
  type CardProps as FumadocsCardProps,
} from "fumadocs-ui/components/card";
import { cn } from "@/lib/utils";
import { Text } from "@/components/ui/text";
import { HoverCorners } from "@/components/ui/corner-box";

interface CardsProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Number of columns (1 | 2 | 3). Defaults to 2. */
  num?: number;
  className?: string;
  children?: React.ReactNode;
}

export type CardProps = Omit<FumadocsCardProps, "title"> & {
  title?: React.ReactNode;
  /** Legacy prop — ignored, fumadocs renders its own arrow. */
  arrow?: boolean;
};

export function Card({ icon, title = "", description = "", arrow: _arrow, children, ...props }: CardProps) {
  const E = props.href ? Link : 'div';
  return (
    <E
      {...props}
      data-card
      className={cn(
        'block @max-lg:col-span-full',
        'group card-hover-stripes z-1',
        props.className,
      )}
    >
      <div className="flex flex-row items-center p-2 sm:p-4 gap-2 border bg-surface-bg text-text-primary w-full h-full">
        {props.href && <HoverCorners />}
        {icon ? (
          <div className="not-prose mb-1 w-fit border border-line-structure rounded-xs bg-surface-button-grey p-1.5 [&_svg]:size-4">
            {icon}
          </div>
        ) : null}
        <div className="flex flex-col gap-2">
          <Text as="h3" size="s" className="not-prose mb-0.5 font-medium text-left text-text-secondary">
            {title}
          </Text>
          {description ? <Text size="s" className="my-0! text-text-secondary">{description}</Text> : null}
          <div className="text-sm text-text-primary prose-no-margin empty:hidden">
            {children}
          </div>
        </div>
      </div>
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
